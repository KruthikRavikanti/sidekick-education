"""Run one real, idempotent world-composition job from an owned synthetic upload."""
from __future__ import annotations

import argparse
import copy
import fcntl
import json
import os
from pathlib import Path
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
from fastapi.testclient import TestClient

SOURCE_RECORD_FIELDS = frozenset({
    'case', 'syntheticSource', 'liveExtraction', 'expectedSkill', 'targetSkills',
    'mappingConfidence', 'learningGoal', 'observationKinds', 'sameMathSource',
    'uploadFailures', 'priorFailures', 'priorBrowserFailures',
})
GENERATION_RECORD_FIELDS = frozenset({
    'stage', 'reasonCode', 'generated', 'requestedModel', 'returnedModels',
    'modelCalls', 'providerCalls', 'generationDurationMs', 'repairReasons',
    'designEvaluations', 'selectedDesign', 'semanticReview', 'gameplayReview',
    'title', 'definitionHash', 'initialActionCount', 'initialRevision',
    'structuralFingerprint', 'operations', 'renderReviewHistory',
    'composedAgainstCapabilitySnapshot', 'compositionPrecededElaFreeze',
})


def clear_browser_evidence(record):
    """Proof belongs to one exact definition and engineering play attempt.

    Preserve source/generation audit fields; discard all derived proof fields,
    including new browser/recording fields unknown to an older script version.
    Existing artifact files are historical evidence, not current report links.
    """
    for key in set(record) - SOURCE_RECORD_FIELDS - GENERATION_RECORD_FIELDS:
        record.pop(key)


def clear_play_binding(job, *, keep_pristine=True):
    keep = {'requestId', 'generationId'}
    if keep_pristine:
        keep.update({'sessionId', 'definitionHash'})
    for key in set(job) - keep:
        job.pop(key)


def replace_generation_binding(job, record, generation_id):
    """Reset stale sessions, plans and proof before attaching another job."""
    changed = job.get('generationId') != generation_id
    if changed:
        if record.get('reasonCode'):
            record.setdefault('priorFailures', []).append(copy.deepcopy({key: record[key]
                for key in sorted(GENERATION_RECORD_FIELDS) if key in record}))
        clear_play_binding(job, keep_pristine=False)
        for key in set(record) - SOURCE_RECORD_FIELDS:
            record.pop(key)
    job['generationId'] = generation_id
    return changed


def read_json(path):
    with path.open(encoding='utf-8') as source:
        fcntl.flock(source.fileno(), fcntl.LOCK_SH)
        try:
            return json.load(source)
        finally:
            fcntl.flock(source.fileno(), fcntl.LOCK_UN)


def update_json(path, update):
    """Merge independent case checkpoints without losing concurrent jobs."""
    with path.open('r+', encoding='utf-8') as output:
        fcntl.flock(output.fileno(), fcntl.LOCK_EX)
        try:
            current = json.load(output)
            result = update(current)
            output.seek(0)
            json.dump(current, output, indent=2)
            output.write('\n')
            output.truncate()
            output.flush()
            return copy.deepcopy(result)
        finally:
            fcntl.flock(output.fileno(), fcntl.LOCK_UN)


def main(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_live_verification_required')
    config = read_json(args.private_config)
    database_url = config['databaseUrl']
    if not database_url.startswith('sqlite:///') or not Path(database_url[10:]).name.startswith('sidekick-e2e-games-'):
        raise ValueError('isolated_game_verification_required')
    load_dotenv(ROOT / 'backend/.env')
    os.environ.update(DATABASE_URL=database_url, APP_ENV='test', PASSWORD_POLICY='dev', COOKIE_SECURE='false',
        SIDEKICK_FIXTURE_MODE='false', SIDEKICK_ACTIVITY_V2_PREVIEW='true', TRUSTED_ORIGINS='http://localhost:3000',
        SIDEKICK_PRIVATE_UPLOAD_DIR=config['privateUploadDirectory'])
    from backend.accounts.security import SecurityContext
    from backend.activity_engine_v2 import generation, preview
    from backend.main import app
    security = SecurityContext.from_env()
    security.db.assert_migrated()
    app.state.security = security
    preview.FIXTURE_PATHS.clear()
    def unavailable(*_, **__):
        raise RuntimeError('finished_fixture_unavailable_in_live_composition')
    preview.load_preview = unavailable
    report_path = Path(config['report'])
    report = read_json(report_path)
    record = next(item for item in report['cases'] if item['case'] == args.case)
    def reserve_request(current):
        item = current.setdefault('jobs', {}).setdefault(args.case, {})
        if not item.get('requestId') or args.retry:
            item['requestId'] = uuid.uuid4().hex
        return item
    private_job = update_json(args.private_config, reserve_request)
    def save_job():
        update_json(args.private_config, lambda current: current.setdefault('jobs', {}).__setitem__(args.case, private_job))
    state = json.loads(Path(config['browserState']).read_text())
    cookie = next(item for item in state['cookies'] if item['name'] == security.settings.session_cookie)
    brief = args.brief.read_text().strip() if args.brief else None
    with TestClient(app, base_url='http://localhost:3000', cookies={cookie['name']: cookie['value']}) as client:
        account = client.get('/api/auth/session')
        if account.status_code != 200:
            raise ValueError('synthetic_authentication_failed')
        csrf = client.get('/api/auth/csrf').json()['csrfToken']
        headers = {'Origin': 'http://localhost:3000', 'X-CSRF-Token': csrf,
                   'X-Sidekick-Profile-Version': str(account.json()['version'])}
        upload_id = config['uploads'][args.case]
        # The regular public endpoint supplies ownership, CSRF, idempotency and
        # the trusted context. A curated brief, if requested, remains operator-
        # owned input to the same worker, never a browser context/program field.
        if brief:
            from starlette.requests import Request
            request = Request({'type': 'http', 'headers': [(b'cookie', (cookie['name']+'='+cookie['value']).encode())]})
            active = security.session(request)
            source = private_job.get('generationId') if args.retry else None
            job, token = generation.reserve(security, active.active_kid_profile_id, upload_id,
                                             private_job['requestId'], active, retry_of=source)
            if token:
                import asyncio
                asyncio.run(generation.run(security, active.active_kid_profile_id, job['id'], token, active, design_brief=brief))
        else:
            path = ('/api/activity-programs/generations/'+private_job['generationId']+'/retry'
                if args.retry and private_job.get('generationId') else
                '/api/activity-programs/uploads/'+upload_id+'/generations')
            response = client.post(path, json={'requestId': private_job['requestId']}, headers=headers)
            if response.status_code != 202:
                raise ValueError('generation_reservation_failed')
            job = response.json()
        generation_changed = replace_generation_binding(private_job, record, job['id'])
        save_job()
        status = client.get('/api/activity-programs/generations/'+job['id']).json()
        record.update(stage=status['stage'], reasonCode=status['reasonCode'], generated=status['status']=='ready')
        result = client.get('/api/activity-programs/sessions/'+status['sessionId']).json() if status['status']=='ready' else None
        with security.db.transaction() as connection:
            row = connection.execute('SELECT * FROM activity_program_generations WHERE id=?', (job['id'],)).fetchone()
            sources = json.loads(row['private_sources_json'])
            record.update(requestedModel=row['requested_model'], returnedModels=json.loads(row['returned_models_json'] or '[]'),
                modelCalls=json.loads(row['model_calls_json'] or '[]'), providerCalls=row['call_count'],
                generationDurationMs=row['duration_ms'], repairReasons=sources.get('generationDiagnostics', []),
                designEvaluations=json.loads(row['design_evaluations_json'] or '[]'),
                selectedDesign=json.loads(row['game_design_json'] or 'null'),
                semanticReview=json.loads(row['review_json'] or 'null'),
                gameplayReview=json.loads(row['gameplay_review_json'] or 'null'))
            if status['status']=='ready':
                if (private_job.get('definitionHash') != result['definitionHash']
                        or private_job.get('sessionId') not in {None, status['sessionId']}):
                    clear_play_binding(private_job)
                    clear_browser_evidence(record)
                    generation_changed = True
                private_job['sessionId'] = status['sessionId']
                private_job['definitionHash'] = result['definitionHash']
                save_job()
                if result['actionCount'] != 0 or result['revision'] != 0 or result['status'] != 'in_progress':
                    raise ValueError('pristine_generation_required')
                record.update(title=result['title'], definitionHash=result['definitionHash'],
                    initialActionCount=result['actionCount'], initialRevision=result['revision'],
                    semanticReview=json.loads(row['review_json']), gameplayReview=json.loads(row['gameplay_review_json']),
                    selectedDesign=json.loads(row['game_design_json']), structuralFingerprint=json.loads(row['structural_fingerprint_json']),
                    operations=sorted({action['operation'] for action in result['actions']}),
                    browserVerified=False)
        def save_case(current):
            if generation_changed:
                current['success'] = False
            for index, item in enumerate(current['cases']):
                if item['case'] == args.case:
                    current['cases'][index] = record
                    break
        update_json(report_path, save_case)
        print(json.dumps(dict(case=args.case, generated=record['generated'], stage=record['stage'],
                              reasonCode=record['reasonCode'], providerCalls=record.get('providerCalls'))), flush=True)
        return 0 if record['generated'] else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config', type=Path, required=True)
    parser.add_argument('--case', required=True)
    parser.add_argument('--brief', type=Path)
    parser.add_argument('--retry', action='store_true')
    try:
        sys.exit(main(parser.parse_args()))
    except Exception as error:
        code = getattr(error, 'code', None)
        print(json.dumps({'success': False, 'reasonCode': code if isinstance(code, str) else 'live_composition_check_failed'}))
        sys.exit(1)
