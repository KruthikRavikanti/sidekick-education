"""One explicit, budgeted gameplay re-review after a generic renderer change.

The immutable program and semantic receipt never change. No child action or
finish-witness autoplay is performed. Old render receipts stay in private audit.
"""
from __future__ import annotations

import argparse
import asyncio
import fcntl
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
from pydantic import ValidationError
from starlette.requests import Request

from backend.accounts.security import AccountError, SecurityContext
from backend.activity_engine_v2 import generation, service
from backend.activity_engine_v2.composer import (ConfiguredComposerAdapter, CompositionFailure,
    GAME_MAX_MODEL_CALLS, GAME_TOTAL_BUDGET_SECONDS, SemanticReview, capabilities,
    validate_gameplay_review, validate_review)
from backend.activity_engine_v2.gameplay import GameplayReview, canonical_hash, render_manifest
from backend.activity_engine_v2.gameplay_prompt import GAMEPLAY_REVIEW_INSTRUCTION
from backend.activity_engine_v2.models import Misconception, Observation, SkillTarget
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.validator import validate_program
from backend.provider import ExtractionError
from scripts.compose_game_design_case import clear_browser_evidence, read_json, update_json

SAFE_CALL_FIELDS = ('task','requestedModel','returnedModel','elapsedMs','maxOutputTokens','usage','finishReason','providerHttpStatus')


class RenderReviewError(ValueError):
    def __init__(self, code):
        self.code = code
        super().__init__(code)


def _safe_code(code):
    return code if isinstance(code,str) and re.fullmatch(r'[a-z][a-z0-9_]{0,79}',code) else 'render_review_failed'


def _source(connection, security, active, generation_id, expected_hash, *, status):
    row = generation._owned(connection,security,active.active_kid_profile_id,generation_id,active)
    if row['status'] != status or row['approved_definition_sha256'] != expected_hash:
        raise RenderReviewError('owned_ready_approval_required')
    session = connection.execute('''SELECT * FROM activity_program_sessions
        WHERE id=? AND kid_id=? AND account_id=?''',
        (row['session_id'],row['kid_id'],row['account_id'])).fetchone()
    if not session:
        raise RenderReviewError('owned_pristine_session_required')
    program,core,version = service._definition(connection,session)
    if (version['definition_sha256'] != expected_hash or session['status'] != 'in_progress'
            or session['action_count'] != 0 or session['revision'] != 0
            or json.loads(session['state_json']) != core.initial
            or json.loads(session['assistance_json'])
            or connection.execute('SELECT 1 FROM activity_program_events WHERE session_id=? LIMIT 1',(session['id'],)).fetchone()):
        raise RenderReviewError('pristine_generation_required')
    return dict(row),program


def _previous_receipt(program, digest, row):
    semantic = validate_review(program,digest,SemanticReview.model_validate_json(row['review_json']))
    review = GameplayReview.model_validate_json(row['gameplay_review_json'])
    manifest = json.loads(row['render_manifest_json'])
    flags = [name for name,field in GameplayReview.model_fields.items() if field.annotation is bool and name != 'approved']
    if (not review.approved or review.reasonCode != 'approved' or not all(getattr(review,name) for name in flags)
            or review.definitionHash != digest or review.renderManifestHash != canonical_hash(manifest)):
        raise RenderReviewError('previous_render_approval_integrity_failed')
    return semantic,review,manifest


async def refresh_review(security, active, generation_id, expected_hash, *, adapter=None):
    """Private tooling API; one call, no automatic retry, no generated code."""
    with security.db.transaction() as connection:
        row,program = _source(connection,security,active,generation_id,expected_hash,status='ready')
    semantic,previous_review,previous_manifest = _previous_receipt(program,expected_hash,row)
    context = json.loads(row['context_json'])
    intent = dict(targets=[SkillTarget.model_validate(item).model_dump() for item in context['targets']],
        observations=[Observation.model_validate(item).model_dump() for item in context.get('observations',[])],
        misconceptions=[Misconception.model_validate(item).model_dump() for item in context.get('misconceptions',[])])
    if program.intent.model_dump(exclude={'successEvidence'},warnings=False) != intent:
        raise RenderReviewError('forged_learning_context')
    report = validate_program(program,check_witness=True)
    if not program.witness or not report.valid or report.computational != 'witness_verified' or report.witnessSteps < 1:
        raise RenderReviewError('verified_finish_required')
    validate_runtime_compatibility(program)
    manifest = render_manifest(program)
    digest = canonical_hash(manifest)
    if digest == previous_review.renderManifestHash:
        return dict(approved=True,status='ready',stage='ready',reasonCode='already_current',providerCallMade=False,
                    callCount=row['call_count'],durationMs=row['duration_ms'],renderManifestHash=digest)
    old_count,old_duration = row['call_count'],row['duration_ms']
    if type(old_count) is not int or not 0 <= old_count < GAME_MAX_MODEL_CALLS:
        raise RenderReviewError('model_call_budget_exceeded')
    if type(old_duration) is not int or not 0 <= old_duration < GAME_TOTAL_BUDGET_SECONDS*1000:
        raise RenderReviewError('generation_deadline_exceeded')
    remaining = GAME_TOTAL_BUDGET_SECONDS*1000-old_duration
    adapter = adapter or ConfiguredComposerAdapter()
    call_start = len(getattr(adapter,'metadata',[]))
    token = uuid.uuid4().hex
    with security.db.transaction() as connection:
        current,_ = _source(connection,security,active,generation_id,expected_hash,status='ready')
        if (current['call_count'] != old_count or current['duration_ms'] != old_duration
                or current['gameplay_review_json'] != row['gameplay_review_json']
                or current['render_manifest_json'] != row['render_manifest_json']):
            raise RenderReviewError('render_review_source_changed')
        connection.execute('''UPDATE activity_program_generations SET status='processing',stage='gameplay_review',
            reason_code=NULL,call_count=?,lease_token=?,lease_until=?,updated_at=? WHERE id=?''',
            (old_count+1,token,security.clock.now()+remaining/1000+30,security.clock.now(),generation_id))
    started = time.monotonic()
    review = None
    code,stage,approved = 'render_review_failed','gameplay_review',False
    try:
        async with asyncio.timeout(remaining/1000):
            candidate = await adapter.call(GameplayReview,'review_activity_gameplay',GAMEPLAY_REVIEW_INSTRUCTION,
                dict(context=context,capabilities=capabilities(),gameDesign=json.loads(row['game_design_json'] or 'null'),
                    definitionHash=expected_hash,definition=program.model_dump(warnings=False),renderManifest=manifest,
                    renderManifestHash=digest,recentStructures=context.get('previousSignatures',[])))
            review = GameplayReview.model_validate(candidate.model_dump(warnings=False) if isinstance(candidate,GameplayReview) else candidate)
            validate_gameplay_review(program,expected_hash,review,manifest)
            approved,code = True,'approved'
    except CompositionFailure as error:
        code = _safe_code(error.code)
    except ExtractionError as error:
        code = 'gameplay_review_response_invalid' if error.code in {'invalid_extraction','activity_schema_invalid','activity_provider_invalid'} else _safe_code(error.code)
        stage = 'gameplay_review' if code == 'gameplay_review_response_invalid' else 'provider'
    except (ValidationError,ValueError,TypeError,KeyError):
        code = 'gameplay_review_response_invalid'
    except TimeoutError:
        code,stage = 'generation_deadline_exceeded','provider'
    except Exception:
        code,stage = 'render_review_failed','provider'
    elapsed = max(0,round((time.monotonic()-started)*1000))
    if elapsed > remaining:
        approved,code,stage = False,'generation_deadline_exceeded','provider'
    calls = [{key:item[key] for key in SAFE_CALL_FIELDS if key in item}
             for item in list(getattr(adapter,'metadata',[]))[call_start:]][:1]
    if not calls:
        calls = [dict(task='review_activity_gameplay',elapsedMs=elapsed)]
    with security.db.transaction() as connection:
        current = connection.execute('SELECT * FROM activity_program_generations WHERE id=? AND lease_token=? AND status=\'processing\'',
                                     (generation_id,token)).fetchone()
        if not current:
            raise RenderReviewError('render_review_reservation_lost')
        try:
            _,current_program = _source(connection,security,active,generation_id,expected_hash,status='processing')
            if (canonical_hash(current_program.model_dump(warnings=False)) != expected_hash
                    or current['session_id'] != row['session_id'] or current['review_json'] != row['review_json']
                    or current['context_json'] != row['context_json']):
                raise RenderReviewError('render_review_source_changed')
        except (AccountError,RenderReviewError) as error:
            approved,code,stage = False,_safe_code(error.code),'gameplay_review'
        sources = json.loads(current['private_sources_json'])
        history = sources.setdefault('renderReviewRevisions',[])
        history.append(dict(definitionHash=expected_hash,previousGameplayReview=previous_review.model_dump(warnings=False),
            previousRenderManifest=previous_manifest,newGameplayReview=review.model_dump(warnings=False) if review else None,
            newRenderManifestHash=digest,approved=approved,reasonCode=code,modelCall=calls[0],durationMs=elapsed))
        all_calls = json.loads(current['model_calls_json'] or '[]')+calls
        returned = json.loads(current['returned_models_json'] or '[]')+[item['returnedModel'] for item in calls if item.get('returnedModel')]
        connection.execute('''UPDATE activity_program_generations SET status=?,stage=?,reason_code=?,gameplay_review_json=?,
            render_manifest_json=?,private_sources_json=?,model_calls_json=?,returned_models_json=?,duration_ms=?,
            lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=?''',
            ('ready' if approved else 'failed','ready' if approved else stage,None if approved else code,
             service._json(review.model_dump(warnings=False) if review else None),service._json(manifest),service._json(sources),
             service._json(all_calls),service._json(returned),old_duration+elapsed,security.clock.now(),generation_id,token))
    return dict(approved=approved,status='ready' if approved else 'failed',stage='ready' if approved else stage,reasonCode=code,providerCallMade=True,
        callCount=old_count+1,durationMs=old_duration+elapsed,renderManifestHash=digest,
        previousRenderManifestHash=previous_review.renderManifestHash,modelCalls=all_calls,returnedModels=returned,
        gameplayReview=review.model_dump(warnings=False) if review else None)


def main(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise RenderReviewError('explicit_game_verification_required')
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,80}',args.case):
        raise RenderReviewError('known_game_case_required')
    config = read_json(args.private_config)
    database_url = config['databaseUrl']
    database = Path(database_url.removeprefix('sqlite:///'))
    if (not database_url.startswith('sqlite:///') or not database.is_absolute() or not database.is_file()
            or not database.name.startswith('sidekick-e2e-games-') or database.is_symlink()
            or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise RenderReviewError('isolated_game_database_required')
    lock_path = args.private_config.with_name(args.private_config.stem+'-render-review-'+args.case+'.lock')
    descriptor = os.open(lock_path,os.O_CREAT|os.O_WRONLY|getattr(os,'O_NOFOLLOW',0),0o600)
    with os.fdopen(descriptor,'w') as lock:
        try:
            fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:
            raise RenderReviewError('render_review_in_progress') from None
        load_dotenv(ROOT/'backend/.env')
        os.environ.update(DATABASE_URL=database_url,APP_ENV='test',PASSWORD_POLICY='dev',COOKIE_SECURE='false',
            SIDEKICK_ACTIVITY_V2_PREVIEW='true',SIDEKICK_FIXTURE_MODE='false',TRUSTED_ORIGINS='http://localhost:3000')
        security = SecurityContext.from_env()
        state = read_json(Path(config['browserState']))
        cookie = next(item for item in state['cookies'] if item['name']==security.settings.session_cookie)
        active = security.session(Request({'type':'http','headers':[(b'cookie',(cookie['name']+'='+cookie['value']).encode())]}))
        job = config['jobs'][args.case]
        record = next(item for item in read_json(Path(config['report']))['cases'] if item['case']==args.case)
        if job.get('sessionId') is None or job.get('definitionHash') != record['definitionHash']:
            raise RenderReviewError('pinned_case_definition_required')
        result = asyncio.run(refresh_review(security,active,job['generationId'],record['definitionHash']))
        if result['providerCallMade']:
            def save(current):
                case = next(item for item in current['cases'] if item['case']==args.case)
                if case.get('definitionHash') != record['definitionHash']:
                    raise RenderReviewError('report_definition_changed')
                clear_browser_evidence(case)
                case.setdefault('renderReviewHistory',[]).append({key:result[key] for key in
                    ('approved','reasonCode','previousRenderManifestHash','renderManifestHash','callCount','durationMs')})
                case.update(generated=result['approved'],stage=result['stage'],
                    reasonCode=None if result['approved'] else result['reasonCode'],providerCalls=result['callCount'],
                    generationDurationMs=result['durationMs'],modelCalls=result['modelCalls'],returnedModels=result['returnedModels'],
                    gameplayReview=result['gameplayReview'])
                current['success'] = False
            update_json(Path(config['report']),save)
        print(json.dumps({key:result[key] for key in ('approved','status','reasonCode','providerCallMade','callCount')}))
        return 0 if result['approved'] else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config',type=Path,required=True)
    parser.add_argument('--case',required=True)
    try:
        sys.exit(main(parser.parse_args()))
    except Exception as error:
        print(json.dumps(dict(approved=False,reasonCode=_safe_code(getattr(error,'code',None)))))
        sys.exit(1)
