"""Opt-in live smoke test through real auth, upload and activity HTTP handlers.

Run: backend/.venv/bin/python scripts/verify_live_activity.py --live
Only original synthetic work is uploaded. All accounts, uploads and session
records live in a temporary directory that is removed when the run ends.
"""
import argparse
from datetime import datetime, timezone
from fractions import Fraction
from functools import lru_cache
import json
import logging
import os
from pathlib import Path
import re
import secrets
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
DEFAULT_REPORT = ROOT / 'data/activities/live_verification.json'


class VerificationFailure(Exception):
    def __init__(self, stage, code):
        self.stage, self.code = stage, code
        super().__init__(code)


def safe_code(value):
    return value if isinstance(value, str) and re.fullmatch(r'[a-z_]{1,80}', value) else 'verification_failed'


def request_json(client, method, path, *, stage, **kwargs):
    if method != 'GET':
        csrf = client.get('/api/auth/csrf')
        if csrf.status_code != 200:
            raise VerificationFailure(stage, 'csrf_unavailable')
        headers = {'Origin': 'http://testserver', 'X-CSRF-Token': csrf.json()['csrfToken']}
        headers.update(kwargs.pop('headers', {}))
        kwargs['headers'] = headers
    response = client.request(method, path, **kwargs)
    if response.status_code not in {200, 201}:
        try:
            code = safe_code(response.json().get('error', {}).get('code'))
        except (ValueError, AttributeError):
            code = 'invalid_api_response'
        raise VerificationFailure(stage, code)
    return response


def tile_order(tiles, answer):
    @lru_cache(maxsize=None)
    def find(offset, mask):
        if offset == len(answer):
            return () if mask == (1 << len(tiles)) - 1 else None
        for index, tile in enumerate(tiles):
            if not mask & (1 << index) and answer.startswith(tile.text, offset):
                remainder = find(offset + len(tile.text), mask | (1 << index))
                if remainder is not None:
                    return (tile.id,) + remainder
        return None
    result = find(0, 0)
    if result is None:
        raise VerificationFailure('play_activity', 'unconstructable_tiles')
    return list(result)


def play(client, security, session):
    from backend.activities.models import ActivitySpec

    with security.db.transaction() as connection:
        row = connection.execute('SELECT v.spec_json FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=?', (session['id'],)).fetchone()
        if not row:
            raise VerificationFailure('play_activity', 'session_missing')
        spec = ActivitySpec.model_validate_json(row[0])
    components, refreshed = [], False
    for index, scene in enumerate(spec.scenes):
        current = session.get('currentScene')
        if not current or current['id'] != scene.id or session['sceneIndex'] != index:
            raise VerificationFailure('play_activity', 'unexpected_scene')
        if any(key in current for key in ('answer', 'feedback', 'nextSceneId')):
            raise VerificationFailure('play_activity', 'private_key_exposed')
        components.append(scene.component)
        if scene.component == 'fraction_builder':
            count = Fraction(scene.answer.value) * scene.params.denominator
            if count.denominator != 1:
                raise VerificationFailure('play_activity', 'invalid_fraction_control')
            response = {'selectedParts': list(range(int(count)))}
        elif scene.component == 'number_line':
            response = {'tick': int(Fraction(scene.answer.value) * scene.params.denominator)}
        elif scene.component == 'word_tiles':
            response = {'tileIds': tile_order(scene.params.tiles, scene.answer.value)}
        elif scene.component == 'word_choice':
            option = next((option for option in scene.params.options if option.text == scene.answer.value), None)
            if option is None:
                raise VerificationFailure('play_activity', 'correct_choice_missing')
            response = {'choiceId': option.id}
        elif scene.component in {'independent_fraction', 'independent_word'}:
            if current['phase'] != 'independent' or session['hint'] is not None or session['feedback'] is not None:
                raise VerificationFailure('play_activity', 'independent_cues_present')
            response = scene.answer.value
        else:
            raise VerificationFailure('play_activity', 'unsupported_component')
        path = f"/api/activities/kid/sessions/{session['id']}"
        request_key = secrets.token_hex(16)
        body = {'sceneId': scene.id, 'idempotencyKey': request_key, 'response': response}
        session = request_json(client, 'POST', path + '/submit', stage='submit_activity', json=body).json()
        retried = request_json(client, 'POST', path + '/submit', stage='retry_submit', json=body).json()
        if session != retried:
            raise VerificationFailure('retry_submit', 'retry_changed_result')
        resumed = request_json(client, 'GET', path, stage='resume_activity').json()
        if resumed != session:
            raise VerificationFailure('resume_activity', 'refresh_changed_result')
        refreshed = True
        if scene.phase == 'guided':
            if not session['feedback']['correct']:
                raise VerificationFailure('submit_activity', 'deterministic_grade_disagrees')
            session = request_json(client, 'POST', path + '/next', stage='advance_activity', json={'sceneId': scene.id, 'idempotencyKey': secrets.token_hex(16)}).json()
    if session['status'] != 'completed' or not session['finalResult'] or not session['finalResult']['correct']:
        raise VerificationFailure('complete_activity', 'independent_result_missing')
    return dict(sceneCount=len(components), components=components, origin=session['origin'], completed=True,
                independentCorrect=True, refreshResumed=refreshed, submitRetrySafe=True)


def verify(report):
    from dotenv import load_dotenv
    load_dotenv(ROOT / 'backend/.env')
    from backend.provider import ExtractionError, VisionSettings
    try:
        settings = VisionSettings.from_env()
    except ExtractionError as exc:
        raise VerificationFailure('configuration', safe_code(exc.code)) from None
    report['model'] = settings.model
    # Override storage before importing the application. No developer database
    # or configured upload directory can be opened by this isolated process.
    with tempfile.TemporaryDirectory(prefix='sidekick-live-activity-') as directory:
        temporary = Path(directory)
        database_url = 'sqlite:///' + str(temporary / 'verification.sqlite3')
        os.environ.update(DATABASE_URL=database_url, SIDEKICK_PRIVATE_UPLOAD_DIR=str(temporary / 'uploads'),
                          SIDEKICK_FIXTURE_MODE='false', APP_ENV='test', PASSWORD_POLICY='dev',
                          COOKIE_SECURE='false', TRUSTED_ORIGINS='http://testserver')
        from fastapi.testclient import TestClient
        from backend import main
        from backend.accounts.security import SecurityContext
        from backend.accounts.settings import Settings
        from backend.activities.library import seed_library
        from backend.gap.catalog import seed_catalog
        from backend.gap.service import _homework_state
        security = SecurityContext(settings=Settings(database_url=database_url, app_env='test', password_policy='dev', cookie_secure=False, trusted_origins=('http://testserver',)))
        security.db.migrate()
        seed_catalog(security.db)
        imported = seed_library(security.db)
        if imported['originalExamplesImported'] != 2:
            raise VerificationFailure('seed_library', 'original_examples_missing')
        main.app.state.security = security
        main.app.state.gap_adapter = None
        main.app.state.activity_adapter = None
        report.update(isolatedTemporaryDatabase=True, fixtureMode=False, stubbedProvider=False)
        with TestClient(main.app, base_url='http://testserver') as client:
            password, pin = secrets.token_urlsafe(24), '0042'
            request_json(client, 'POST', '/api/auth/signup', stage='signup', json={'email': 'live-verification@example.test', 'password': password})
            request_json(client, 'POST', '/api/parent/pin/setup', stage='setup_parent_pin', json={'password': password, 'pin': pin, 'confirmPin': pin})
            request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent', json={'pin': pin})
            child = request_json(client, 'POST', '/api/parent/profiles', stage='create_profile', json={'firstName': 'Synthetic', 'grade': '3', 'avatarKey': 'fox'}).json()
            request_json(client, 'POST', '/api/session/kid', stage='choose_child', json={'profileId': child['id']})
            image = ROOT / 'public/samples/activity-math-work.png'
            if not image.is_file():
                raise VerificationFailure('upload_work', 'synthetic_image_missing')
            print(json.dumps({'stage': 'live_upload_and_analysis', 'started': True}), flush=True)
            extracted = request_json(client, 'POST', '/api/extract', stage='upload_work',
                                     files={'file': ('synthetic-work.png', image.read_bytes(), 'image/png')})
            upload_id = extracted.headers.get('X-Sidekick-Upload-Id')
            if not upload_id or extracted.json().get('source') != 'live':
                raise VerificationFailure('upload_work', 'live_upload_not_saved')
            report['liveExtraction'] = True
            deadline = time.monotonic() + 180
            while True:
                suggested = request_json(client, 'GET', '/api/activities/kid/suggestion', stage='suggest_activity', params={'uploadId': upload_id}).json()
                if suggested['available']:
                    break
                if suggested['reason'] != 'analysis_pending' or time.monotonic() >= deadline:
                    raise VerificationFailure('suggest_activity', safe_code(suggested.get('reason')))
                time.sleep(.5)
            if suggested['targetSkill']['id'] != '3.NF.A.1-2':
                raise VerificationFailure('suggest_activity', 'unexpected_skill_mapping')
            with security.db.transaction() as connection:
                before = _homework_state(connection, child['id'], '3.NF.A.1-2')
            if before['status'] != 'needs_support':
                raise VerificationFailure('suggest_activity', 'support_observation_missing')
            report['liveSupportObservation'] = True
            print(json.dumps({'stage': 'verified_activity_reuse', 'started': True}), flush=True)
            first = request_json(client, 'POST', '/api/activities/kid/start', stage='reuse_activity', json={'uploadId': upload_id, 'idempotencyKey': secrets.token_hex(16)}).json()
            if first['origin'] != 'original_example':
                raise VerificationFailure('reuse_activity', 'strong_match_not_reused')
            report['reusedActivity'] = play(client, security, first)
            print(json.dumps({'stage': 'live_activity_composition', 'started': True}), flush=True)
            second = request_json(client, 'POST', '/api/activities/kid/start', stage='generate_activity', json={'uploadId': upload_id, 'idempotencyKey': secrets.token_hex(16)}).json()
            if second['origin'] != 'model_generated':
                raise VerificationFailure('generate_activity', 'live_generation_not_selected')
            report['generatedActivity'] = play(client, security, second)
            with security.db.transaction() as connection:
                after = _homework_state(connection, child['id'], '3.NF.A.1-2')
                model_calls = connection.execute("SELECT COUNT(*) FROM model_audits WHERE task='compose_activity' AND outcome='generated'").fetchone()[0]
            if after != before or model_calls != 1:
                raise VerificationFailure('verify_support_state', 'unexpected_support_change')
            request_json(client, 'POST', '/api/session/picker', stage='return_to_picker', json={})
            request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent_history', json={'pin': pin})
            history = request_json(client, 'GET', f"/api/activities/parent/{child['id']}/history", stage='parent_history').json()['activities']
            dashboard = request_json(client, 'GET', f"/api/learning/parent/{child['id']}/dashboard", stage='parent_dashboard').json()
            observed = next((skill for skill in dashboard['skills'] if skill['id'] == '3.NF.A.1-2'), None)
            if len(history) != 2 or not all(activity['status'] == 'completed' and activity['finalResult'] and activity['completedAt'] for activity in history) or not observed or observed['status'] != 'needs_support':
                raise VerificationFailure('parent_history', 'protected_results_incomplete')
            report.update(parentHistoryCount=len(history), parentPinProtectedHistory=True,
                          supportObservationUnchanged=True, liveGeneratedActivities=model_calls,
                          independentTaskFresh=True, success=True)


def main():
    parser = argparse.ArgumentParser(description='Opt-in live provider verification using a disposable account and synthetic work')
    parser.add_argument('--live', action='store_true', required=True, help='Explicitly authorize configured provider calls')
    parser.add_argument('--report', type=Path, default=DEFAULT_REPORT)
    args = parser.parse_args()
    logging.disable(logging.INFO)
    started = time.monotonic()
    report = dict(command='backend/.venv/bin/python scripts/verify_live_activity.py --live',
                  checkedAt=datetime.now(timezone.utc).isoformat(), success=False)
    try:
        verify(report)
    except VerificationFailure as exc:
        report.update(failedStage=exc.stage, errorCode=exc.code)
        if exc.code == 'provider_not_configured':
            report['nextStep'] = 'Set VISION_API_KEY and VISION_MODEL in backend/.env, then rerun with --live.'
    except Exception:
        # A traceback could include model text or test request data. Keep output
        # and the committed verification artifact limited to fixed safe labels.
        report.update(failedStage='unexpected_failure', errorCode='verification_failed')
    report['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2), flush=True)
    return 0 if report['success'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
