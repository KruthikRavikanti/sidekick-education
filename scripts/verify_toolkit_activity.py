"""Live synthetic uploads -> new playable activities -> protected parent history.

Only telemetry and fixed outcomes are reported. Uses disposable accounts, files,
and database, real configured model calls, and ordinary authenticated API routes.
"""
import argparse
from datetime import datetime, timezone
import json
import logging
import os
from pathlib import Path
import secrets
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.verify_live_activity import VerificationFailure, request_json, safe_code
from scripts.verify_general_activity import keys

CASES = {
    'bundles': ('math', '1', 'bundle_builder'),
    'sequence': ('ela', '3', 'tile_order'),
    'evidence': ('ela', '3', 'evidence_board'),
}


def play(client, security, session):
    from backend.activities.models import ActivitySpec
    from backend.activities import toolkit
    with security.db.transaction() as conn:
        row = conn.execute('SELECT v.* FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=?', (session['id'],)).fetchone()
        spec = ActivitySpec.model_validate_json(row['spec_json'])
    toolkit.validate_activity(spec)
    if not row['verified'] or row['origin'] != 'model_generated':
        raise VerificationFailure('play_activity', 'verified_generation_missing')
    components = []
    conserved = True
    for index, scene in enumerate(spec.scenes):
        current = session['currentScene']
        if not current or current['id'] != scene.id or session['sceneIndex'] != index:
            raise VerificationFailure('play_activity', 'unexpected_scene')
        if keys(current) & {'answer', 'acceptedAnswers', 'comparison', 'nextSceneId', 'feedback', 'explanation'}:
            raise VerificationFailure('play_activity', 'private_key_exposed')
        components.append(scene.component)
        if scene.component == 'bundle_builder':
            response = {'bundles': scene.answer.bundles}
            conserved = conserved and all(n * 10 + (scene.params.total - n * 10) == scene.params.total for n in range(scene.answer.bundles + 1))
        elif scene.component == 'tile_order':
            response = {'order': scene.answer.order}
        elif scene.component == 'evidence_board':
            response = {'sentenceId': scene.answer.sentenceId}
        elif scene.component == 'guided_choice':
            response = {'choiceId': scene.answer.value}
        elif scene.component in {'guided_response', 'independent_response'}:
            response = scene.answer.value
        else:
            raise VerificationFailure('play_activity', 'unexpected_control')
        path = f"/api/activities/kid/sessions/{session['id']}"
        if scene.phase == 'independent':
            if session['hint'] is not None or session['feedback'] is not None or current['params'].get('teachingText'):
                raise VerificationFailure('play_activity', 'independent_cues_present')
            rejected = client.post(path + '/hint', json={'sceneId': scene.id},
                headers={'Origin': 'http://testserver', 'X-CSRF-Token': request_json(client, 'GET', '/api/auth/csrf', stage='csrf').json()['csrfToken']})
            if rejected.status_code != 409:
                raise VerificationFailure('play_activity', 'independent_hint_allowed')
        body = dict(sceneId=scene.id, idempotencyKey=secrets.token_hex(16), response=response)
        session = request_json(client, 'POST', path + '/submit', stage='submit_activity', json=body).json()
        retry = request_json(client, 'POST', path + '/submit', stage='retry_submit', json=body).json()
        resume = request_json(client, 'GET', path, stage='resume_activity').json()
        if retry != session or resume != session:
            raise VerificationFailure('resume_activity', 'retry_changed_result')
        if scene.phase == 'guided':
            if not session['feedback']['correct']:
                raise VerificationFailure('submit_activity', 'answer_key_disagrees')
            session = request_json(client, 'POST', path + '/next', stage='advance_activity',
                json={'sceneId': scene.id, 'idempotencyKey': secrets.token_hex(16)}).json()
    if session['status'] != 'completed' or not session['finalResult']['correct']:
        raise VerificationFailure('complete_activity', 'independent_result_missing')
    return dict(schemaVersion=spec.schemaVersion, componentVersion=row['component_version'], promptVersion=row['prompt_version'],
        components=components, sceneCount=len(components), completed=True, independentCorrect=True,
        refreshResumed=True, submitRetrySafe=True, privateAnswersProtected=True,
        independentTeachingRemoved=True, independentHintsBlocked=True,
        bundleConservation=conserved if 'bundle_builder' in components else None), session['finalResult']


def verify_case(client, security, recorder, name):
    from backend.gap.service import _homework_state
    subject, grade, expected_component = CASES[name]
    password, pin = secrets.token_urlsafe(24), '0042'
    request_json(client, 'POST', '/api/auth/signup', stage='signup', json={'email': f'toolkit-{name}@example.test', 'password': password})
    request_json(client, 'POST', '/api/parent/pin/setup', stage='setup_pin', json={'password': password, 'pin': pin, 'confirmPin': pin})
    request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent', json={'pin': pin})
    child = request_json(client, 'POST', '/api/parent/profiles', stage='create_profile', json={'firstName': 'Synthetic', 'grade': grade, 'avatarKey': 'fox'}).json()
    request_json(client, 'POST', '/api/session/kid', stage='choose_child', json={'profileId': child['id']})
    photo = (ROOT / f'public/samples/activity-toolkit-{name}-work.png').read_bytes()
    extracted = request_json(client, 'POST', '/api/extract', stage='upload_work', files={'file': ('synthetic-work.png', photo, 'image/png')})
    upload_id = extracted.headers.get('X-Sidekick-Upload-Id')
    if not upload_id or extracted.json().get('source') != 'live':
        raise VerificationFailure('upload_work', 'live_upload_not_saved')
    deadline = time.monotonic() + 180
    while True:
        suggestion = request_json(client, 'GET', '/api/activities/kid/suggestion', stage='suggest_activity', params={'uploadId': upload_id}).json()
        if suggestion['available']:
            break
        if suggestion.get('reason') != 'analysis_pending' or time.monotonic() >= deadline:
            raise VerificationFailure('suggest_activity', safe_code(suggestion.get('reason')))
        time.sleep(.5)
    target = suggestion['targetSkill']
    if target['subject'] != subject:
        raise VerificationFailure('suggest_activity', 'unexpected_subject')
    with security.db.transaction() as conn:
        before = _homework_state(conn, child['id'], target['id'])
        count = conn.execute('SELECT COUNT(*) FROM activity_versions WHERE subskill_id=?', (target['id'],)).fetchone()[0]
    if count:
        raise VerificationFailure('generate_activity', 'unexpected_prebuilt_activity')
    session = request_json(client, 'POST', '/api/activities/kid/start', stage='generate_activity',
        json={'uploadId': upload_id, 'idempotencyKey': secrets.token_hex(16)}).json()
    result, final = play(client, security, session)
    if expected_component not in result['components']:
        raise VerificationFailure('play_activity', 'expected_mechanic_missing')
    if not recorder.approvals:
        raise VerificationFailure('generate_activity', 'separate_review_missing')
    with security.db.transaction() as conn:
        after = _homework_state(conn, child['id'], target['id'])
    if after != before:
        raise VerificationFailure('verify_status', 'activity_changed_learning_status')
    history_path = f"/api/activities/parent/{child['id']}/history"
    if client.get(history_path).status_code != 403:
        raise VerificationFailure('parent_history', 'parent_guard_failed')
    request_json(client, 'POST', '/api/session/picker', stage='picker', json={})
    request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_history', json={'pin': pin})
    history = request_json(client, 'GET', history_path, stage='parent_history').json()['activities']
    if len(history) != 1 or history[0]['status'] != 'completed' or history[0]['finalResult'] != final:
        raise VerificationFailure('parent_history', 'protected_result_missing')
    return dict(case=name, subject=subject, targetCatalogSkill=target['id'], liveExtraction=True, liveAnalysis=True,
        noPrebuiltActivity=True, generatedActivity=result, separateReviewApproved=True,
        parentOutcomeVisible=True, parentPinProtectedHistory=True, learningStatusUnchanged=True, success=True)


def verify(report, selected, *, case_runner=None, empty_library=False):
    from dotenv import load_dotenv
    load_dotenv(ROOT / 'backend/.env')
    from backend.provider import ExtractionError, VisionSettings
    settings = VisionSettings.from_env()
    report['model'] = settings.model
    with tempfile.TemporaryDirectory(prefix='sidekick-toolkit-live-') as directory:
        temporary = Path(directory).resolve()
        database_url = 'sqlite:///' + str(temporary / 'verification.sqlite3')
        os.environ.update(DATABASE_URL=database_url, SIDEKICK_PRIVATE_UPLOAD_DIR=str(temporary / 'uploads'),
            SIDEKICK_FIXTURE_MODE='false', APP_ENV='test', PASSWORD_POLICY='dev', COOKIE_SECURE='false', TRUSTED_ORIGINS='http://testserver')
        from fastapi.testclient import TestClient
        from backend import main
        from backend.accounts.security import SecurityContext
        from backend.accounts.settings import Settings
        from backend.activities.library import seed_library
        from backend.activities.models import ActivityReview, ActivitySpec
        from backend.gap.catalog import seed_catalog
        from backend.gap.vision import VisionAdapter

        class RecordingAdapter(VisionAdapter):
            def __init__(self):
                super().__init__(settings=settings)
                self.counts, self.rejections, self.errors, self.approvals = {}, [], [], 0
                self.proposals = []
                self.failed_proposals, self.repairs = [], []

            async def _call(self, response_model, task, instruction, data):
                self.counts[task] = self.counts.get(task, 0) + 1
                try:
                    result = await super()._call(response_model, task, instruction, data)
                except ExtractionError as error:
                    self.errors.append(safe_code(error.code))
                    candidate = getattr(error, '_activity_candidate', None)
                    if isinstance(candidate, dict):
                        self.failed_proposals.append(dict(task=task, candidate=candidate))
                    raise
                if isinstance(result, ActivityReview):
                    if result.approved:
                        self.approvals += 1
                    else:
                        self.rejections.append(result.reason)
                elif isinstance(result, ActivitySpec):
                    # In-memory original synthetic activity proposals allow an
                    # opt-in verifier to diagnose a rejected run without logs.
                    self.proposals.append(result.model_dump())
                elif task == 'repair_activity_scene':
                    self.repairs.append(result.model_dump())
                return result

        security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev', cookie_secure=False, trusted_origins=('http://testserver',)))
        if security.db.path.resolve().parent != temporary:
            raise VerificationFailure('isolation', 'unsafe_database_location')
        security.db.migrate()
        seed_catalog(security.db)
        if not empty_library:
            seed_library(security.db)
        with security.db.transaction() as conn:
            initial_activity_count = conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0]
        if empty_library and initial_activity_count:
            raise VerificationFailure('isolation', 'finished_library_not_empty')
        main.app.state.security = security
        main.app.state.gap_adapter = None
        report.update(isolatedTemporaryDatabase=True, fixtureMode=False, stubbedProvider=False,
                      emptyLibraryAtStart=empty_library, initialFinishedActivityCount=initial_activity_count,
                      browserVerifiedByThisScript=False, cases=[])
        for name in selected:
            recorder = RecordingAdapter()
            main.app.state.activity_adapter = recorder
            print(json.dumps({'case': name, 'stage': 'live_upload_analysis_and_generation', 'started': True}), flush=True)
            with TestClient(main.app, base_url='http://testserver') as client:
                try:
                    case = (case_runner or verify_case)(client, security, recorder, name)
                except VerificationFailure as error:
                    case = dict(case=name, success=False, failedStage=error.stage, errorCode=error.code)
                except Exception:
                    case = dict(case=name, success=False, failedStage='unexpected_failure', errorCode='verification_failed')
            if not case['success']:
                case.update(getattr(recorder, 'case_metadata', {}))
            case.update(providerActivityTasks=recorder.counts, reviewRejectionCodes=recorder.rejections, providerErrorCodes=recorder.errors)
            report['cases'].append(case)
            print(json.dumps({'case': name, 'success': case['success'], 'failedStage': case.get('failedStage')}), flush=True)
        report['success'] = all(case['success'] for case in report['cases']) and bool(report['cases'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--live', action='store_true', required=True)
    parser.add_argument('--case', choices=['all', *CASES], default='all')
    parser.add_argument('--report', type=Path, default=ROOT / 'data/activities/toolkit_live_verification.json')
    args = parser.parse_args()
    logging.disable(logging.CRITICAL)
    started = time.monotonic()
    report = dict(command='npm run activities:verify:toolkit:live', checkedAt=datetime.now(timezone.utc).isoformat(), success=False)
    try:
        verify(report, list(CASES) if args.case == 'all' else [args.case])
    except VerificationFailure as error:
        report.update(failedStage=error.stage, errorCode=error.code)
    except Exception:
        report.update(failedStage='configuration_or_unexpected_failure', errorCode='verification_failed')
    report['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2), flush=True)
    return 0 if report['success'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
