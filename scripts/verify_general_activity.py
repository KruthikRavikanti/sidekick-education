"""Opt-in live Math/ELA generation smoke test using disposable synthetic work.

Run: backend/.venv/bin/python scripts/verify_general_activity.py --live
No existing family database, local dev server, private upload or model stub is
used. Output contains fixed statuses and versions, never questions or answers.
"""
import argparse
from datetime import datetime, timezone
import io
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

DEFAULT_REPORT = ROOT / 'data/activities/general_live_verification.json'


def math_photo():
    """Create an original synthetic unit-rate page, not a real student record."""
    from PIL import Image, ImageDraw
    from scripts.generate_fixtures import font
    image = Image.new('RGB', (1000, 1200), 'white')
    draw = ImageDraw.Draw(image)
    lines = [
        (65, 65, 'SIDEKICK / ORIGINAL SYNTHETIC WORK', 20),
        (65, 150, 'Unit rates', 42),
        (65, 220, 'Grade 6', 24),
        (65, 300, 'Answer the question.', 27),
        (65, 420, '1. 12 dollars buys 4 pounds of apples.', 30),
        (65, 470, 'What is the cost per pound?', 30),
        (100, 575, '3', 38),
        (65, 1080, 'Synthetic response. No real student information.', 20),
    ]
    for left, top, text, size in lines:
        draw.text((left, top), text, fill='#242C36', font=font(size))
    output = io.BytesIO()
    image.save(output, 'PNG')
    return output.getvalue()


def keys(value):
    if isinstance(value, dict):
        return set(value) | set().union(*(keys(item) for item in value.values()))
    if isinstance(value, list):
        return set().union(*(keys(item) for item in value))
    return set()


def play(client, security, session):
    from backend.activities.models import ActivitySpec, GENERIC_COMPONENTS
    with security.db.transaction() as connection:
        row = connection.execute('SELECT v.* FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=?', (session['id'],)).fetchone()
        if not row:
            raise VerificationFailure('play_activity', 'session_missing')
        spec = ActivitySpec.model_validate_json(row['spec_json'])
        metadata = dict(schemaVersion=spec.schemaVersion, componentVersion=row['component_version'], promptVersion=row['prompt_version'])
    if spec.schemaVersion != '1.1' or any(scene.component not in GENERIC_COMPONENTS for scene in spec.scenes):
        raise VerificationFailure('play_activity', 'general_activity_missing')
    if not row['verified'] or row['origin'] != 'model_generated':
        raise VerificationFailure('play_activity', 'verified_generation_missing')
    components = []
    for index, scene in enumerate(spec.scenes):
        current = session.get('currentScene')
        if not current or current['id'] != scene.id or session['sceneIndex'] != index:
            raise VerificationFailure('play_activity', 'unexpected_scene')
        if keys(current) & {'answer', 'acceptedAnswers', 'comparison', 'nextSceneId', 'feedback'}:
            raise VerificationFailure('play_activity', 'private_key_exposed')
        if current['params'].get('context') != scene.params.context:
            raise VerificationFailure('play_activity', 'context_missing')
        components.append(scene.component)
        if scene.component == 'guided_choice':
            response = {'choiceId': scene.answer.value}
        else:
            response = scene.answer.value
        if scene.phase == 'independent' and (session['hint'] is not None or session['feedback'] is not None or keys(current['params']) & {'options', 'teachingText'}):
            raise VerificationFailure('play_activity', 'independent_cues_present')
        path = f"/api/activities/kid/sessions/{session['id']}"
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
                                   json=dict(sceneId=scene.id, idempotencyKey=secrets.token_hex(16))).json()
    if session['status'] != 'completed' or not session['finalResult'] or not session['finalResult']['correct']:
        raise VerificationFailure('complete_activity', 'independent_result_missing')
    context = spec.scenes[-1].params.context
    expected_question = f'{context}\n\n{spec.scenes[-1].prompt}' if context else spec.scenes[-1].prompt
    if session['finalResult']['question'] != expected_question:
        raise VerificationFailure('complete_activity', 'final_context_missing')
    return dict(metadata, sceneCount=len(spec.scenes), components=components, completed=True,
                independentCorrect=True, refreshResumed=True, submitRetrySafe=True,
                privateAnswersProtected=True, finalContextRetained=True), session['finalResult']


def verify_case(client, security, recorder, subject, image, profile_grade):
    from backend.activities.models import SUPPORTED
    from backend.gap.service import _homework_state
    password, pin = secrets.token_urlsafe(24), '0042'
    request_json(client, 'POST', '/api/auth/signup', stage='signup', json={'email': f'general-{subject}@example.test', 'password': password})
    request_json(client, 'POST', '/api/parent/pin/setup', stage='setup_parent_pin', json={'password': password, 'pin': pin, 'confirmPin': pin})
    request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent', json={'pin': pin})
    child = request_json(client, 'POST', '/api/parent/profiles', stage='create_profile', json={'firstName': 'Synthetic', 'grade': profile_grade, 'avatarKey': 'fox'}).json()
    request_json(client, 'POST', '/api/session/kid', stage='choose_child', json={'profileId': child['id']})
    extracted = request_json(client, 'POST', '/api/extract', stage='upload_work', files={'file': ('synthetic-work.png', image, 'image/png')})
    upload_id = extracted.headers.get('X-Sidekick-Upload-Id')
    if not upload_id or extracted.json().get('source') != 'live':
        raise VerificationFailure('upload_work', 'live_upload_not_saved')
    deadline = time.monotonic() + 180
    while True:
        suggested = request_json(client, 'GET', '/api/activities/kid/suggestion', stage='suggest_activity', params={'uploadId': upload_id}).json()
        if suggested['available']:
            break
        if suggested.get('reason') != 'analysis_pending' or time.monotonic() >= deadline:
            raise VerificationFailure('suggest_activity', safe_code(suggested.get('reason')))
        time.sleep(.5)
    target = suggested['targetSkill']
    if target['id'] in SUPPORTED or target['subject'] != subject:
        raise VerificationFailure('suggest_activity', 'general_skill_not_selected')
    with security.db.transaction() as connection:
        before = _homework_state(connection, child['id'], target['id'])
        evidence = connection.execute("SELECT e.correctness,e.eligible FROM learning_evidence e JOIN homework_problems p ON p.id=e.source_ref AND p.kid_id=e.kid_id WHERE e.kid_id=? AND p.upload_id=? AND e.source='homework'", (child['id'], upload_id)).fetchall()
        matching_versions = connection.execute('SELECT COUNT(*) FROM activity_versions WHERE subskill_id=?', (target['id'],)).fetchone()[0]
    if matching_versions:
        raise VerificationFailure('generate_activity', 'unexpected_library_match')
    if not evidence or any(row['correctness'] not in {'correct', 'ungraded'} for row in evidence):
        raise VerificationFailure('verify_work', 'unexpected_incorrect_grade')
    if before['status'] == 'needs_support':
        raise VerificationFailure('verify_work', 'unexpected_support_status')
    session = request_json(client, 'POST', '/api/activities/kid/start', stage='generate_activity', json={'uploadId': upload_id, 'idempotencyKey': secrets.token_hex(16)}).json()
    if session['origin'] != 'model_generated':
        raise VerificationFailure('generate_activity', 'live_generation_not_selected')
    if not recorder.counts.get('compose_activity') or not recorder.approvals:
        raise VerificationFailure('generate_activity', 'independent_review_missing')
    result, final_result = play(client, security, session)
    with security.db.transaction() as connection:
        after = _homework_state(connection, child['id'], target['id'])
    if after != before:
        raise VerificationFailure('verify_status', 'activity_changed_learning_status')
    history_path = f"/api/activities/parent/{child['id']}/history"
    if client.get(history_path).status_code != 403:
        raise VerificationFailure('parent_history', 'parent_guard_failed')
    request_json(client, 'POST', '/api/session/picker', stage='return_to_picker', json={})
    request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent_history', json={'pin': pin})
    history = request_json(client, 'GET', history_path, stage='parent_history').json()['activities']
    if len(history) != 1 or history[0]['status'] != 'completed' or history[0]['finalResult'] != final_result:
        raise VerificationFailure('parent_history', 'protected_results_incomplete')
    if not history[0]['completedAt'] or not history[0]['finalResult']['correct']:
        raise VerificationFailure('parent_history', 'protected_results_incomplete')
    return dict(subject=subject, targetCatalogSkill=target['id'], liveExtraction=True, liveAnalysis=True,
                inputCorrectness=sorted({row['correctness'] for row in evidence}),
                suggestionAvailable=True, noLibraryMatch=True, generatedActivity=result,
                independentModelReviewApproved=True,
                parentHistoryCount=1, parentPinProtectedHistory=True, learningStatusUnchanged=True,
                statusBefore=before['status'], statusAfter=after['status'], success=True)


def verify(report):
    from dotenv import load_dotenv
    load_dotenv(ROOT / 'backend/.env')
    from backend.provider import ExtractionError, VisionSettings
    try:
        settings = VisionSettings.from_env()
    except ExtractionError as error:
        raise VerificationFailure('configuration', safe_code(error.code)) from None
    report['model'] = settings.model
    with tempfile.TemporaryDirectory(prefix='sidekick-general-live-') as directory:
        temporary = Path(directory).resolve()
        database_url = 'sqlite:///' + str(temporary / 'verification.sqlite3')
        os.environ.update(DATABASE_URL=database_url, SIDEKICK_PRIVATE_UPLOAD_DIR=str(temporary / 'uploads'),
                          SIDEKICK_FIXTURE_MODE='false', APP_ENV='test', PASSWORD_POLICY='dev',
                          COOKIE_SECURE='false', TRUSTED_ORIGINS='http://testserver')
        from fastapi.testclient import TestClient
        from backend import main
        from backend.accounts.security import SecurityContext
        from backend.accounts.settings import Settings
        from backend.activities.library import seed_library
        from backend.activities.models import ActivityReview
        from backend.gap.catalog import seed_catalog
        from backend.gap.vision import VisionAdapter

        class RecordingAdapter(VisionAdapter):
            """Telemetry around the actual transport; no response is replaced."""
            def __init__(self):
                super().__init__(settings=settings)
                self.counts, self.rejections, self.errors, self.approvals = {}, [], [], 0

            async def _call(self, response_model, task, instruction, data):
                self.counts[task] = self.counts.get(task, 0) + 1
                try:
                    result = await super()._call(response_model, task, instruction, data)
                except ExtractionError as error:
                    self.errors.append(safe_code(error.code))
                    raise
                if isinstance(result, ActivityReview) and not result.approved:
                    self.rejections.append(result.reason)
                elif isinstance(result, ActivityReview) and result.approved:
                    self.approvals += 1
                return result

        security = SecurityContext(settings=Settings(database_url=database_url, app_env='test', password_policy='dev',
            cookie_secure=False, trusted_origins=('http://testserver',)))
        if security.db.path.resolve().parent != temporary:
            raise VerificationFailure('isolation', 'unsafe_database_location')
        security.db.migrate()
        seed_catalog(security.db)
        seed_library(security.db)
        main.app.state.security = security
        main.app.state.gap_adapter = None
        report.update(isolatedTemporaryDatabase=True, fixtureMode=False, stubbedProvider=False,
                      realComposition=True, separateModelReview=True, cases=[])
        for subject, image, profile_grade in [
            ('math', math_photo(), '5'),
            ('ela', (ROOT / 'public/samples/activity-ela-general-work.png').read_bytes(), '3'),
        ]:
            recorder = RecordingAdapter()
            main.app.state.activity_adapter = recorder
            print(json.dumps(dict(subject=subject, stage='live_extraction_analysis_and_generation', started=True)), flush=True)
            with TestClient(main.app, base_url='http://testserver') as client:
                try:
                    case = verify_case(client, security, recorder, subject, image, profile_grade)
                except VerificationFailure as error:
                    case = dict(subject=subject, success=False, failedStage=error.stage, errorCode=error.code)
                except Exception:
                    case = dict(subject=subject, success=False, failedStage='unexpected_failure', errorCode='verification_failed')
            case.update(providerActivityTasks=recorder.counts, reviewRejectionCodes=recorder.rejections,
                        providerErrorCodes=recorder.errors)
            report['cases'].append(case)
        report['success'] = len(report['cases']) == 2 and all(case['success'] for case in report['cases'])


def main():
    parser = argparse.ArgumentParser(description='Live general activity generation using disposable Math/ELA work')
    parser.add_argument('--live', action='store_true', required=True, help='Explicitly authorize configured provider calls')
    parser.add_argument('--report', type=Path, default=DEFAULT_REPORT)
    args = parser.parse_args()
    logging.disable(logging.CRITICAL)
    started = time.monotonic()
    report = dict(command='backend/.venv/bin/python scripts/verify_general_activity.py --live',
                  checkedAt=datetime.now(timezone.utc).isoformat(), success=False)
    try:
        verify(report)
    except VerificationFailure as error:
        report.update(failedStage=error.stage, errorCode=error.code)
    except Exception:
        report.update(failedStage='unexpected_failure', errorCode='verification_failed')
    report['elapsedSeconds'] = round(time.monotonic() - started, 2)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2), flush=True)
    return 0 if report['success'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
