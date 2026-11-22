"""Copy an approved benchmark into a fresh synthetic verification database.

The application's evaluated child/session is opened read-only and never changed.
All browser actions and help then belong to a separate synthetic account. No
fixture library, provider, uploaded image, or private source content is needed.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import secrets
import sqlite3
import sys
import tempfile
from urllib.parse import quote, urlparse
import uuid

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
from fastapi.testclient import TestClient
from starlette.requests import Request

from backend.accounts.database import Database
from backend.accounts.security import SecurityContext
from backend.accounts.settings import Settings
from backend.activity_engine_v2.composer import ApprovedProgram, SemanticReview, validate_review
from backend.activity_engine_v2.gameplay import GameplayReview
from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.service import _hash, start_approved


def external_new_path(path):
    path = path.resolve()
    if ROOT == path or ROOT in path.parents or path.exists() or not path.parent.is_dir():
        raise ValueError('new_external_private_path_required')
    return path


def write_private(path, value):
    path = external_new_path(path)
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, 'w') as output:
        json.dump(value, output, indent=2)
        output.write('\n')
    return path


def source_approval(database, report):
    parsed = urlparse(report['localUrl'])
    match = re.fullmatch(r'/kid/activity-preview/([A-Za-z0-9_-]{1,100})', parsed.path)
    if (parsed.scheme != 'http' or parsed.hostname != 'localhost' or parsed.port != 3000
            or parsed.username or parsed.password or parsed.query or parsed.fragment or not match):
        raise ValueError('local_benchmark_url_required')
    expected = report['definitionHash']
    if not isinstance(expected, str) or not re.fullmatch(r'[a-f0-9]{64}', expected):
        raise ValueError('benchmark_hash_required')
    connection = sqlite3.connect('file:' + quote(str(database.resolve()), safe='/') + '?mode=ro', uri=True)
    connection.row_factory = sqlite3.Row
    try:
        row = connection.execute('''SELECT g.*,s.action_count,s.revision,
            v.definition_json,v.definition_sha256 FROM activity_program_generations g
            JOIN activity_program_sessions s ON s.id=g.session_id
            JOIN activity_program_versions v ON v.id=s.program_version_id
            JOIN kid_profiles k ON k.id=s.kid_id AND k.account_id=s.account_id
            JOIN accounts a ON a.id=k.account_id
            WHERE s.id=? AND g.status='ready' AND g.kid_id=s.kid_id
                AND g.account_id=s.account_id ORDER BY g.rowid DESC LIMIT 1''', (match[1],)).fetchone()
        if not row or row['approved_definition_sha256'] != expected or row['definition_sha256'] != expected:
            raise ValueError('owned_ready_approved_benchmark_required')
        program = ActivityProgram.model_validate_json(row['definition_json'])
        review = SemanticReview.model_validate_json(row['review_json'])
        if _hash(program.model_dump(warnings=False)) != expected:
            raise ValueError('benchmark_definition_changed')
        validate_review(program, expected, review)
        approved = ApprovedProgram(program=program, definition_hash=expected, requested_model=row['requested_model'],
            returned_models=json.loads(row['returned_models_json'] or '[]'), review=review,
            call_count=row['call_count'], model_calls=json.loads(row['model_calls_json'] or '[]'),
            game_design=json.loads(row['game_design_json'] or 'null'),
            design_evaluations=json.loads(row['design_evaluations_json'] or '[]'),
            gameplay_review=GameplayReview.model_validate_json(row['gameplay_review_json'])
                if row['gameplay_review_json'] and row['gameplay_review_json'] != 'null' else None,
            structural_fingerprint=json.loads(row['structural_fingerprint_json'] or 'null'),
            render_manifest=json.loads(row['render_manifest_json'] or 'null'))
        context = json.loads(row['context_json'])
        snapshot = dict(actionCount=row['action_count'], revision=row['revision'])
        grade = str(context.get('grade', '3'))
        if grade not in {'K', '1', '2', '3', '4', '5'}:
            grade = '3'
        return approved, snapshot, grade
    finally:
        connection.close()


def synthetic_family(security, grade):
    # A new process-local application with the explicit isolated SecurityContext.
    # The same HTTP auth/PIN/profile endpoints mint this synthetic child's cookie.
    from backend.main import app
    previous_security = getattr(app.state, 'security', None)
    app.state.security = security
    password = secrets.token_urlsafe(28)
    try:
        with TestClient(app, base_url='http://localhost:3000') as client:
            def post(path, body):
                csrf = client.get('/api/auth/csrf')
                if csrf.status_code != 200:
                    raise ValueError('synthetic_csrf_setup_failed')
                response = client.post(path, json=body, headers={'Origin': 'http://localhost:3000',
                                                               'X-CSRF-Token': csrf.json()['csrfToken']})
                if response.status_code not in {200, 201}:
                    raise ValueError('synthetic_account_setup_failed')
                return response.json()
            post('/api/auth/signup', dict(email='benchmark-'+uuid.uuid4().hex+'@example.com', password=password))
            post('/api/parent/pin/setup', dict(password=password, pin='0042', confirmPin='0042'))
            post('/api/parent/pin/verify', dict(pin='0042'))
            profile = post('/api/parent/profiles', dict(firstName='Preview', grade=grade, avatarKey='fox'))
            post('/api/session/kid', dict(profileId=profile['id']))
            token = client.cookies.get(security.settings.session_cookie)
    finally:
        if previous_security is None:
            delattr(app.state, 'security')
        else:
            app.state.security = previous_security
    request = Request({'type': 'http', 'headers': [(b'cookie',
        (security.settings.session_cookie+'='+token).encode())]})
    active = security.session(request)
    state = {'cookies': [{'name': security.settings.session_cookie, 'value': token, 'domain': 'localhost',
        'path': '/', 'expires': security.clock.now()+security.settings.session_seconds,
        'httpOnly': True, 'secure': False, 'sameSite': 'Lax'}], 'origins': []}
    return active, state


def prepare(report_path, browser_state, private_config, source_database=None, *, source_settings=None):
    report_path = report_path.resolve()
    report = json.loads(report_path.read_text())
    # Validate outputs before creating any state. Existing browser credentials
    # are never overwritten or imported into the isolated account.
    browser_state = external_new_path(browser_state)
    private_config = external_new_path(private_config)
    if source_settings is None:
        load_dotenv(ROOT / 'backend/.env')
        source_settings = Settings.from_env()
    if source_settings.app_env != 'development' or source_settings.cookie_secure:
        raise ValueError('local_development_required')
    source = source_database.resolve() if source_database else Database(source_settings.database_url).path.resolve()
    if not source.is_file() or source.is_symlink():
        raise ValueError('source_database_required')
    approved, source_snapshot, grade = source_approval(source, report)
    descriptor, database_name = tempfile.mkstemp(prefix='sidekick-benchmark-', suffix='.sqlite3')
    os.close(descriptor)
    database = Path(database_name).resolve()
    security = SecurityContext(Settings(database_url='sqlite:///'+str(database), app_env='test',
        password_policy='dev', cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    security.db.migrate()
    active, state = synthetic_family(security, grade)
    with security.db.transaction() as connection:
        pristine = start_approved(connection, security, active.active_kid_profile_id, approved, active)
        attempts = [start_approved(connection, security, active.active_kid_profile_id, approved, active) for _ in range(2)]
        if connection.execute('SELECT COUNT(*) FROM homework_uploads').fetchone()[0] != 0:
            raise ValueError('isolated_verification_must_not_copy_uploads')
        if connection.execute('SELECT COUNT(*) FROM catalog_subskills').fetchone()[0] != 0:
            raise ValueError('isolated_verification_must_not_seed_catalog_or_fixtures')
    # A second read-only snapshot establishes that even preparation left the
    # evaluated session untouched. Later browser actions use only the temp DB.
    _, after, _ = source_approval(source, report)
    if source_snapshot != after:
        raise ValueError('evaluation_changed_during_verification_preparation')
    write_private(browser_state, state)
    write_private(private_config, dict(databaseUrl='sqlite:///'+str(database),
        privateUploadDirectory=str(database)+'.uploads', browserState=str(browser_state),
        definitionHash=approved.definition_hash, pristineSessionId=pristine['id'],
        verificationSessionIds=[item['id'] for item in attempts]))
    report.update(verificationIsolation='synthetic_separate_database', verificationPristineId=pristine['id'],
        verificationAttempts=[dict(id=item['id'], initialActionCount=item['actionCount']) for item in attempts],
        evaluationPreparationSnapshot=source_snapshot, evaluationPreparationUnchanged=True,
        browserVerified=False)
    report_path.write_text(json.dumps(report, indent=2)+'\n')
    return dict(success=True, privateConfig=str(private_config))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report', required=True, type=Path)
    parser.add_argument('--browser-state', required=True, type=Path)
    parser.add_argument('--private-config', required=True, type=Path)
    parser.add_argument('--source-database', type=Path, help='Optional read-only development database source.')
    args = parser.parse_args()
    try:
        print(json.dumps(prepare(args.report, args.browser_state, args.private_config, args.source_database)))
        return 0
    except Exception:
        # Never disclose source paths, identity, cookies, candidate or provider data.
        print(json.dumps(dict(success=False, reasonCode='benchmark_verification_preparation_failed')))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
