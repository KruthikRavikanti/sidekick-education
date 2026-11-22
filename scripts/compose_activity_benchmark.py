"""Compose from an existing owned upload, never from a finished activity template.

Development-only operator tool. Reuses the ordinary reservation, context, provider,
admission and persistence path. Optional private browser state permits engineering
verification without changing a family's password or its existing browser session.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

from backend.accounts.security import AccountError, SecurityContext, SessionRecord, digest
from backend.activity_engine_v2 import generation
from backend.activity_engine_v2.composer import SemanticReview
from backend.activity_engine_v2.models import ActivityProgram


def active_record(row):
    return SessionRecord(row['token_digest'], row['account_id'], row['mode'],
                         row['active_kid_profile_id'], row['parent_expires_at'], row['version'])


def private_browser_state(security, active, path):
    path = path.resolve()
    if ROOT == path or ROOT in path.parents or path.exists():
        raise ValueError('private_state_requires_new_external_path')
    # A separate local operator session; existing family sessions are untouched.
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'kid')
        token = security.new_session(connection, active.account_id)
        connection.execute("UPDATE sessions SET mode='kid',active_kid_profile_id=? WHERE token_digest=?",
                           (active.active_kid_profile_id, digest(token)))
    state = {'cookies': [{'name': security.settings.session_cookie, 'value': token,
        'domain': 'localhost', 'path': '/', 'expires': security.clock.now() + security.settings.session_seconds,
        'httpOnly': True, 'secure': False, 'sameSite': 'Lax'}], 'origins': []}
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, 'w') as output:
        json.dump(state, output)


async def main(args):
    load_dotenv(ROOT / 'backend/.env')
    security = SecurityContext.from_env()
    if security.settings.app_env != 'development' or security.settings.cookie_secure:
        raise ValueError('local_development_required')
    brief = args.brief.read_text().strip()
    with security.db.transaction() as connection:
        source = connection.execute('''SELECT g.* FROM activity_program_generations g
            JOIN activity_program_sessions s ON s.id=g.session_id
            JOIN activity_program_versions v ON v.id=s.program_version_id
            WHERE g.status='ready' AND json_extract(v.definition_json,'$.title')=?
            ORDER BY g.rowid DESC LIMIT 1''', (args.source_title,)).fetchone()
        if not source:
            raise ValueError('owned_source_activity_missing')
        row = connection.execute('''SELECT * FROM sessions WHERE account_id=? AND active_kid_profile_id=?
            AND mode='kid' AND revoked_at IS NULL AND expires_at>? ORDER BY created_at DESC LIMIT 1''',
            (source['account_id'], source['kid_id'], security.clock.now())).fetchone()
        if not row:
            raise ValueError('active_owned_child_required')
        active = active_record(row)
        upload_id = source['upload_id']
    kid_id = active.active_kid_profile_id
    job, token = generation.reserve(security, kid_id, upload_id, str(uuid.uuid4()), active)
    if token is None:
        raise ValueError('source_generation_already_running')
    await generation.run(security, kid_id, job['id'], token, active, design_brief=brief)
    result = generation.view(security, kid_id, job['id'], active)
    if result['status'] != 'ready':
        print(json.dumps({'success': False, 'stage': result['stage'], 'reasonCode': result['reasonCode']}))
        return 1
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'kid')
        saved = connection.execute('SELECT * FROM activity_program_generations WHERE id=?', (job['id'],)).fetchone()
        version = connection.execute('''SELECT v.* FROM activity_program_versions v
            JOIN activity_program_sessions s ON s.program_version_id=v.id WHERE s.id=?''',
            (saved['session_id'],)).fetchone()
        program = ActivityProgram.model_validate_json(version['definition_json'])
        review = SemanticReview.model_validate_json(saved['review_json'])
        original = connection.execute('SELECT action_count,revision FROM activity_program_sessions WHERE id=?',
                                      (saved['session_id'],)).fetchone()
        sources = json.loads(saved['private_sources_json'])
        report = dict(success=True, title=program.title,
            localUrl='http://localhost:3000/kid/activity-preview/' + saved['session_id'],
            definitionHash=saved['approved_definition_sha256'],
            requestedModel=saved['requested_model'], returnedModels=json.loads(saved['returned_models_json']),
            modelCalls=json.loads(saved['model_calls_json']), repairReasons=sources.get('generationDiagnostics', []),
            providerCalls=saved['call_count'], separateReviewApproved=review.approved,
            reviewHashBound=review.definitionHash == saved['approved_definition_sha256'],
            witnessSteps=len(program.witness or []),
            targets=[item.skillId for item in program.intent.targets],
            initialActionCount=original['action_count'], initialRevision=original['revision'],
            operations=sorted({action.operation for action in program.actions}),
            verificationAttempts=[],
            browserVerified=False)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    if args.browser_state:
        private_browser_state(security, active, args.browser_state)
    print(json.dumps({'success': True, 'localUrl': report['localUrl'],
                      'requestedModel': report['requestedModel'], 'returnedModels': report['returnedModels']}))
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-title', required=True)
    parser.add_argument('--brief', required=True, type=Path)
    parser.add_argument('--report', required=True, type=Path)
    parser.add_argument('--browser-state', type=Path)
    try:
        sys.exit(asyncio.run(main(parser.parse_args())))
    except AccountError as error:
        print(json.dumps({'success': False, 'reasonCode': error.code}))
        sys.exit(1)
    except Exception:
        # Never print exception messages, provider data, contexts or credentials.
        print(json.dumps({'success': False, 'reasonCode': 'benchmark_preparation_failed'}))
        sys.exit(1)
