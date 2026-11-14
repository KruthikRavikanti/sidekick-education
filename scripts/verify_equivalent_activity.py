"""Opt-in live split-and-compare smoke test using disposable synthetic work.

Run: backend/.venv/bin/python scripts/verify_equivalent_activity.py --live
The API flow uses real model extraction, analysis, composition and review.
No local dev server, user database, private upload or model stub is used.
This checks server math; browser tests separately check on-screen animation.
"""
import argparse
from datetime import datetime, timezone
from fractions import Fraction
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

DEFAULT_REPORT = ROOT / 'data/activities/equivalent_live_verification.json'


def keys(value):
    if isinstance(value, dict):
        return set(value) | set().union(*(keys(item) for item in value.values()))
    if isinstance(value, list):
        return set().union(*(keys(item) for item in value))
    return set()


def play(client, security, session):
    from backend.activities import equivalent, service
    from backend.activities.models import ActivitySpec

    with security.db.transaction() as connection:
        row = connection.execute('SELECT v.* FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=?', (session['id'],)).fetchone()
        if not row:
            raise VerificationFailure('play_activity', 'session_missing')
        spec = ActivitySpec.model_validate_json(row['spec_json'])
        equivalent.validate_equivalent_activity(spec)
        metadata = dict(schemaVersion=spec.schemaVersion, componentVersion=row['component_version'],
                        promptVersion=row['prompt_version'])
    if row['origin'] != 'model_generated' or not row['verified']:
        raise VerificationFailure('play_activity', 'verified_generation_missing')
    final = spec.scenes[-1]
    # A requested finer representation must reject its equal reduced form and
    # decimal without using up the child's immutable independent attempt.
    reduced = str(Fraction(final.answer.sourceNumerator, final.answer.sourceDenominator))
    decimal = str(float(Fraction(final.answer.sourceNumerator, final.answer.sourceDenominator)))
    if service._grade(final, reduced)[1] or service._grade(final, decimal)[1]:
        raise VerificationFailure('grade_activity', 'requested_denominator_not_enforced')
    components, split_scenes = [], 0
    for index, scene in enumerate(spec.scenes):
        current = session.get('currentScene')
        if not current or current['id'] != scene.id or session['sceneIndex'] != index:
            raise VerificationFailure('play_activity', 'unexpected_scene')
        if keys(current) & {'answer', 'acceptedAnswers', 'comparison', 'sourceNumerator', 'sourceDenominator',
                            'targetDenominator', 'nextSceneId', 'feedback', 'scenes'}:
            raise VerificationFailure('play_activity', 'private_key_exposed')
        components.append(scene.component)
        expected_split = None
        if scene.component == 'fraction_split_compare':
            split_scenes += 1
            for factor in scene.params.splitFactors:
                if Fraction(equivalent.split_fraction(scene.params, factor)) != Fraction(scene.params.numerator, scene.params.denominator):
                    raise VerificationFailure('play_activity', 'split_changes_shaded_amount')
            expected_split = equivalent.split_fraction(scene.params, scene.answer.splitFactor)
            response = dict(splitFactor=scene.answer.splitFactor)
        elif scene.component == 'guided_choice':
            response = dict(choiceId=scene.answer.value)
        elif scene.component in {'guided_response', 'independent_response'}:
            response = scene.answer.value
        else:
            raise VerificationFailure('play_activity', 'unexpected_component')
        if scene.phase == 'independent' and (session['hint'] is not None or session['feedback'] is not None
                or current['params'].get('context') is not None
                or keys(current['params']) & {'options', 'teachingText', 'numerator', 'denominator', 'splitFactors'}):
            raise VerificationFailure('play_activity', 'independent_cues_present')
        path = f"/api/activities/kid/sessions/{session['id']}"
        body = dict(sceneId=scene.id, idempotencyKey=secrets.token_hex(16), response=response)
        session = request_json(client, 'POST', path + '/submit', stage='submit_activity', json=body).json()
        retry = request_json(client, 'POST', path + '/submit', stage='retry_submit', json=body).json()
        resumed = request_json(client, 'GET', path, stage='resume_activity').json()
        if retry != session or resumed != session:
            raise VerificationFailure('resume_activity', 'retry_changed_result')
        if expected_split is not None:
            with security.db.transaction() as connection:
                attempt = connection.execute('SELECT response_text,correct FROM activity_attempts WHERE session_id=? AND request_key=?',
                    (session['id'], body['idempotencyKey'])).fetchone()
            if not attempt or attempt['response_text'] != expected_split or not attempt['correct']:
                raise VerificationFailure('grade_activity', 'split_response_not_recorded')
        if scene.phase == 'guided':
            if not session['feedback']['correct']:
                raise VerificationFailure('grade_activity', 'answer_key_disagrees')
            session = request_json(client, 'POST', path + '/next', stage='advance_activity',
                json=dict(sceneId=scene.id, idempotencyKey=secrets.token_hex(16))).json()
    if not split_scenes or session['status'] != 'completed' or not session['finalResult'] or not session['finalResult']['correct']:
        raise VerificationFailure('complete_activity', 'independent_result_missing')
    if session['finalResult']['question'] != final.prompt:
        raise VerificationFailure('complete_activity', 'independent_context_changed')
    return dict(metadata, sceneCount=len(spec.scenes), components=components, splitSceneCount=split_scenes,
                completed=True, independentCorrect=True, refreshResumed=True, submitRetrySafe=True,
                sameShadedAmountForEveryOfferedSplit=True, splitResponseRecorded=True,
                requestedDenominatorEnforced=True, reducedFormRejected=True, decimalFormRejected=True,
                independentVisualAndHintsAbsent=True, privateAnswersProtected=True,
                browserAnimationVerifiedByThisScript=False), session['finalResult']


def verify(report):
    from dotenv import load_dotenv
    load_dotenv(ROOT / 'backend/.env')
    from backend.provider import ExtractionError, VisionSettings
    try:
        settings = VisionSettings.from_env()
    except ExtractionError as error:
        raise VerificationFailure('configuration', safe_code(error.code)) from None
    report['model'] = settings.model
    with tempfile.TemporaryDirectory(prefix='sidekick-equivalent-live-') as directory:
        temporary = Path(directory).resolve()
        database_url = 'sqlite:///' + str(temporary / 'verification.sqlite3')
        # Override before importing the application so its configured user DB
        # and upload directory can never be opened by this isolated process.
        os.environ.update(DATABASE_URL=database_url, SIDEKICK_PRIVATE_UPLOAD_DIR=str(temporary / 'uploads'),
                          SIDEKICK_FIXTURE_MODE='false', APP_ENV='test', PASSWORD_POLICY='dev',
                          COOKIE_SECURE='false', TRUSTED_ORIGINS='http://testserver')
        from fastapi.testclient import TestClient
        from backend import main
        from backend.accounts.security import SecurityContext
        from backend.accounts.settings import Settings
        from backend.activities import equivalent, service
        from backend.activities.library import seed_library
        from backend.activities.models import ActivityReview
        from backend.gap.catalog import get_subskill, seed_catalog
        from backend.gap.service import _homework_state
        from backend.gap.vision import VisionAdapter

        class RecordingAdapter(VisionAdapter):
            """Count real calls and fixed verdicts without replacing any response."""
            def __init__(self):
                super().__init__(settings=settings)
                self.counts, self.rejections, self.errors, self.approvals = {}, [], [], 0
                self.intent, self.observation = None, None

            async def _call(self, response_model, task, instruction, data):
                self.counts[task] = self.counts.get(task, 0) + 1
                if task == 'compose_activity':
                    goal = data.get('learningGoal', {})
                    self.intent = safe_code(goal.get('intent'))
                    observation = goal.get('supportedObservation')
                    self.observation = safe_code(observation.get('kind')) if isinstance(observation, dict) else None
                try:
                    result = await super()._call(response_model, task, instruction, data)
                except ExtractionError as error:
                    self.errors.append(safe_code(error.code))
                    raise
                if isinstance(result, ActivityReview):
                    if result.approved:
                        self.approvals += 1
                    else:
                        self.rejections.append(result.reason)
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
        recorder = RecordingAdapter()
        main.app.state.activity_adapter = recorder
        report.update(isolatedTemporaryDatabase=True, fixtureMode=False, stubbedProvider=False,
                      realComposition=False, separateModelReview=False)
        try:
            with TestClient(main.app, base_url='http://testserver') as client:
                password, pin = secrets.token_urlsafe(24), '0042'
                request_json(client, 'POST', '/api/auth/signup', stage='signup', json={'email': 'equivalent-smoke@example.test', 'password': password})
                request_json(client, 'POST', '/api/parent/pin/setup', stage='setup_parent_pin', json={'password': password, 'pin': pin, 'confirmPin': pin})
                request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent', json={'pin': pin})
                child = request_json(client, 'POST', '/api/parent/profiles', stage='create_profile', json={'firstName': 'Synthetic', 'grade': '3', 'avatarKey': 'fox'}).json()
                request_json(client, 'POST', '/api/session/kid', stage='choose_child', json={'profileId': child['id']})
                image = ROOT / 'public/samples/activity-equivalent-work.png'
                if not image.is_file():
                    raise VerificationFailure('upload_work', 'synthetic_image_missing')
                print(json.dumps(dict(stage='live_equivalent_upload_analysis_and_generation', started=True)), flush=True)
                extracted = request_json(client, 'POST', '/api/extract', stage='upload_work', files={'file': ('synthetic-work.png', image.read_bytes(), 'image/png')})
                upload_id = extracted.headers.get('X-Sidekick-Upload-Id')
                if not upload_id or extracted.json().get('source') != 'live':
                    raise VerificationFailure('upload_work', 'live_upload_not_saved')
                report['liveExtraction'] = True
                deadline = time.monotonic() + 180
                while True:
                    suggested = request_json(client, 'GET', '/api/activities/kid/suggestion', stage='suggest_activity', params={'uploadId': upload_id}).json()
                    if suggested['available']:
                        break
                    if suggested.get('reason') != 'analysis_pending' or time.monotonic() >= deadline:
                        raise VerificationFailure('suggest_activity', safe_code(suggested.get('reason')))
                    time.sleep(.5)
                target_id = suggested['targetSkill']['id']
                if not equivalent.is_equivalent_target(target_id):
                    raise VerificationFailure('suggest_activity', 'equivalent_skill_not_selected')
                with security.db.transaction() as connection:
                    target = get_subskill(connection, target_id)
                    before = _homework_state(connection, child['id'], target_id)
                    blocked = service._blocked_tasks(connection, child['id'], upload_id, 'math', equivalent_skill=True)
                    strong = service._matches(connection, target, blocked=blocked)
                    fallback = service._matches(connection, target, blocked=blocked, strong=False)
                    evidence = connection.execute("SELECT e.correctness FROM learning_evidence e JOIN homework_problems p ON p.id=e.source_ref AND p.kid_id=e.kid_id WHERE e.kid_id=? AND p.upload_id=? AND e.source='homework'", (child['id'], upload_id)).fetchall()
                if strong:
                    raise VerificationFailure('generate_activity', 'unexpected_strong_library_match')
                if not fallback or any(not equivalent.has_split_scene(spec) for _, spec in fallback):
                    raise VerificationFailure('seed_library', 'verified_split_fallback_missing')
                report.update(targetCatalogSkill=target_id, liveAnalysis=True, noStrongLibraryMatch=True,
                              verifiedInteractionFallbackAvailable=True,
                              inputCorrectness=sorted({row['correctness'] for row in evidence}))
                session = request_json(client, 'POST', '/api/activities/kid/start', stage='generate_activity',
                    json=dict(uploadId=upload_id, idempotencyKey=secrets.token_hex(16))).json()
                if session['origin'] != 'model_generated' or not recorder.approvals:
                    raise VerificationFailure('generate_activity', 'reviewed_live_generation_missing')
                result, final_result = play(client, security, session)
                with security.db.transaction() as connection:
                    after = _homework_state(connection, child['id'], target_id)
                if before != after:
                    raise VerificationFailure('verify_status', 'activity_changed_learning_status')
                history_path = f"/api/activities/parent/{child['id']}/history"
                if client.get(history_path).status_code != 403:
                    raise VerificationFailure('parent_history', 'parent_guard_failed')
                request_json(client, 'POST', '/api/session/picker', stage='return_to_picker', json={})
                request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent_history', json={'pin': pin})
                history = request_json(client, 'GET', history_path, stage='parent_history').json()['activities']
                if len(history) != 1 or history[0]['status'] != 'completed' or history[0]['finalResult'] != final_result:
                    raise VerificationFailure('parent_history', 'protected_results_incomplete')
                report.update(generatedActivity=result, realComposition=True, separateModelReview=True,
                              learningStatusUnchanged=True, statusBefore=before['status'], statusAfter=after['status'],
                              parentHistoryCount=1, parentPinProtectedHistory=True, success=True)
        finally:
            report.update(providerActivityTasks=recorder.counts, reviewRejectionCodes=recorder.rejections,
                          providerErrorCodes=recorder.errors, learningGoalIntent=recorder.intent,
                          supportedObservationKind=recorder.observation)


def main():
    parser = argparse.ArgumentParser(description='Live equivalent-fraction generation using disposable synthetic work')
    parser.add_argument('--live', action='store_true', required=True, help='Explicitly authorize configured provider calls')
    parser.add_argument('--report', type=Path, default=DEFAULT_REPORT)
    args = parser.parse_args()
    logging.disable(logging.CRITICAL)
    started = time.monotonic()
    report = dict(command='backend/.venv/bin/python scripts/verify_equivalent_activity.py --live',
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
