"""Actual model -> original K–5 activity -> protected automatic/parent outcome.

All inputs and responses are synthetic, with disposable family data and media.
Manual recordings/drafts are deliberately reviewed INCORRECT; this verifies the
review path without claiming a synthetic recording read a generated passage.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import logging
from pathlib import Path
import secrets
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.verify_live_activity import VerificationFailure, request_json, safe_code
from scripts.verify_general_activity import keys
from scripts.verify_toolkit_activity import verify as run_isolated

CASES = {'multiplication': ('math', '3'), 'measurement': ('math', '2'),
         'phonics': ('ela', '1'), 'writing': ('ela', '3')}
EXPECTED_FAMILIES = {'multiplication': 'equal_groups', 'measurement': 'measurement_length',
                     'phonics': 'phonics_decoding', 'writing': 'writing_composition'}


def synthetic_written(params):
    words = max(params.minWords, 8)
    response = ' '.join(['Synthetic'] + ['draft'] * words)
    while len(response) < params.minLength:
        response += ' draft'
    response = response[:params.maxLength]
    if len(response.split()) < params.minWords:
        # A synthetic negative example should fit even a tight but reachable
        # word/character budget; its quality is never marked correct.
        response = ' '.join(['x'] * params.minWords)
        response += 'x' * max(0, params.minLength - len(response))
    if response.strip() == params.initialText.strip():
        response = 'Changed ' + response
    return response[:params.maxLength]


def scene_response(client, session_id, scene):
    """Use canonical keys for automatic API grading; author real manual state."""
    component, params, answer = scene.component, scene.params, scene.answer
    manual = getattr(answer, 'assessment', None) == 'parent_review'
    if component == 'quantity_lab':
        counts = list(params.initialCounts) if manual else answer.expectedCounts
        if manual:
            counts = list(counts)
            if sum(counts) < params.stock:
                counts[0] += 1
            elif sum(counts):
                counts[next(index for index, count in enumerate(counts) if count)] -= 1
            else:
                raise VerificationFailure('play_activity', 'quantity_goal_unreachable')
        return {'allocations': [dict(containerId=item.id, count=count) for item, count in zip(params.containers, counts)]}
    if component == 'math_workspace':
        if not manual:
            return {'marks': [mark.model_dump() for mark in answer.expectedMarks], 'text': answer.expectedText or ''}
        return {'marks': [dict(x=1., y=0.)], 'text': 'Synthetic reasoning artifact for review.'}
    if component == 'sort_connect':
        placements = [dict(pieceId=item.id, targetId=params.targets[0].id) for item in params.pieces] if manual else [item.model_dump() for item in answer.placements]
        return {'placements': placements}
    if component == 'text_editor':
        return {'writtenText': synthetic_written(params) if manual else answer.acceptedTexts[0]}
    if component == 'oral_studio':
        recording = request_json(client, 'POST', f'/api/activities/kid/sessions/{session_id}/recording',
            stage='save_recording', files={'file': ('synthetic-reading.wav', (ROOT / 'fixtures/synthetic-reading.wav').read_bytes(), 'audio/wav')},
            data={'sceneId': scene.id, 'idempotencyKey': secrets.token_hex(16)}).json()
        return {'recordingId': recording['recordingId']}
    if component == 'drawing_studio':
        return {'strokes': [[dict(x=10., y=20.), dict(x=30., y=40.), dict(x=50., y=20.)]]}
    if component == 'fraction_split_compare':
        return {'splitFactor': answer.splitFactor}
    if component == 'bundle_builder':
        return {'bundles': answer.bundles}
    if component == 'tile_order':
        return {'order': answer.order}
    if component == 'evidence_board':
        return {'sentenceId': answer.sentenceId}
    if component == 'guided_choice':
        return {'choiceId': answer.value}
    if component in {'guided_response', 'independent_response'}:
        return answer.value
    raise VerificationFailure('play_activity', 'unexpected_control')


def play(client, security, session, recorder):
    from backend.activities.models import ActivitySpec
    from backend.activities import capabilities
    from backend.gap.catalog import get_subskill
    with security.db.transaction() as conn:
        version = conn.execute('SELECT v.* FROM activity_versions v JOIN activity_sessions s ON s.activity_version_id=v.id WHERE s.id=?', (session['id'],)).fetchone()
        spec = ActivitySpec.model_validate_json(version['spec_json'])
        capabilities.validate_activity(spec, get_subskill(conn, spec.subskillId))
    # Capture the actual validated, original definition before disposable data
    # is removed. This contains no worksheet text or account/profile metadata.
    Path(tempfile.gettempdir(), f'sidekick-catalog-live-spec-{spec.subskillId}.json').write_text(
        json.dumps(dict(subskillId=spec.subskillId, specSha256=version['spec_sha256'], spec=spec.model_dump()), indent=2) + '\n')
    if not version['verified'] or version['origin'] != 'model_generated':
        raise VerificationFailure('play_activity', 'verified_generation_missing')
    canonical_hash = hashlib.sha256(json.dumps(spec.model_dump(), ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    if canonical_hash != version['spec_sha256']:
        raise VerificationFailure('play_activity', 'definition_hash_changed')
    recorder.case_metadata.update(generatedValidated=True, specSha256=version['spec_sha256'],
        components=[scene.component for scene in spec.scenes],
        assessment='parent_review' if getattr(spec.scenes[-1].answer, 'assessment', None) == 'parent_review' else 'automatic')
    final_response = None
    for index, scene in enumerate(spec.scenes):
        current = session['currentScene']
        if not current or current['id'] != scene.id or session['sceneIndex'] != index:
            raise VerificationFailure('play_activity', 'unexpected_scene')
        if keys(current) & {'answer', 'acceptedAnswers', 'comparison', 'nextSceneId', 'feedback', 'rubric', 'expectedCounts', 'expectedMarks', 'mathRule'}:
            raise VerificationFailure('play_activity', 'private_key_exposed')
        path = f"/api/activities/kid/sessions/{session['id']}"
        if scene.phase == 'independent':
            if session['hint'] is not None or session['feedback'] is not None or current['params'].get('teachingText'):
                raise VerificationFailure('play_activity', 'independent_cues_present')
            csrf = request_json(client, 'GET', '/api/auth/csrf', stage='csrf').json()['csrfToken']
            blocked = client.post(path + '/hint', json={'sceneId': scene.id},
                headers={'Origin': 'http://testserver', 'X-CSRF-Token': csrf})
            if blocked.status_code != 409:
                raise VerificationFailure('play_activity', 'independent_hint_allowed')
        response = scene_response(client, session['id'], scene)
        body = dict(sceneId=scene.id, idempotencyKey=secrets.token_hex(16), response=response)
        session = request_json(client, 'POST', path + '/submit', stage='submit_activity', json=body).json()
        retried = request_json(client, 'POST', path + '/submit', stage='retry_submit', json=body).json()
        resumed = request_json(client, 'GET', path, stage='resume_activity').json()
        if session != retried or session != resumed:
            raise VerificationFailure('resume_activity', 'retry_changed_result')
        if scene.phase == 'guided':
            expected = None if getattr(scene.answer, 'assessment', None) == 'parent_review' else True
            if session['feedback']['correct'] is not expected:
                raise VerificationFailure('play_activity', 'assessment_disagrees')
            session = request_json(client, 'POST', path + '/next', stage='advance_activity',
                json={'sceneId': scene.id, 'idempotencyKey': secrets.token_hex(16)}).json()
        else:
            final_response = response
    if session['status'] != 'completed' or not session['finalResult']:
        raise VerificationFailure('complete_activity', 'independent_result_missing')
    manual = getattr(spec.scenes[-1].answer, 'assessment', None) == 'parent_review'
    expected = None if manual else True
    if session['finalResult']['correct'] is not expected:
        raise VerificationFailure('complete_activity', 'manual_result_not_pending' if manual else 'automatic_result_incorrect')
    return session, spec, version, final_response, manual


def verify_case(client, security, recorder, name):
    from backend.activities.coverage import for_subskill
    from backend.gap.service import _homework_state
    subject, grade = CASES[name]
    password, pin = secrets.token_urlsafe(24), '0042'
    request_json(client, 'POST', '/api/auth/signup', stage='signup', json={'email': f'catalog-{name}@example.test', 'password': password})
    request_json(client, 'POST', '/api/parent/pin/setup', stage='setup_pin', json={'password': password, 'pin': pin, 'confirmPin': pin})
    request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_parent', json={'pin': pin})
    child = request_json(client, 'POST', '/api/parent/profiles', stage='create_profile', json={'firstName': 'Synthetic', 'grade': grade, 'avatarKey': 'fox'}).json()
    request_json(client, 'POST', '/api/session/kid', stage='choose_child', json={'profileId': child['id']})
    photo = (ROOT / f'public/samples/activity-catalog-{name}-work.png').read_bytes()
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
    if target['subject'] != subject or not for_subskill(target['id']):
        raise VerificationFailure('suggest_activity', 'unexpected_catalog_target')
    if for_subskill(target['id'])['family'] != EXPECTED_FAMILIES[name]:
        raise VerificationFailure('suggest_activity', 'unexpected_skill_family')
    recorder.case_metadata = dict(subskillId=target['id'], providerMode='live',
        generatedValidated=False, playedScored=False, parentReviewed=False, outcome='not_completed',
        source='scripts/verify_catalog_activities.py', liveUpload=True)
    with security.db.transaction() as conn:
        before = _homework_state(conn, child['id'], target['id'])
        count = conn.execute('SELECT COUNT(*) FROM activity_versions WHERE subskill_id=?', (target['id'],)).fetchone()[0]
    if count:
        raise VerificationFailure('generate_activity', 'unexpected_prebuilt_match')
    try:
        session = request_json(client, 'POST', '/api/activities/kid/start', stage='generate_activity',
            json={'uploadId': upload_id, 'idempotencyKey': secrets.token_hex(16)}).json()
    except VerificationFailure:
        # Only original model-created activity data is captured transiently for
        # inspection. No uploaded question, child record or credential is saved.
        if recorder.proposals:
            Path(tempfile.gettempdir(), f'sidekick-catalog-proposal-{name}.json').write_text(json.dumps(recorder.proposals, indent=2) + '\n')
        raise
    if not recorder.approvals or session['origin'] != 'model_generated':
        raise VerificationFailure('generate_activity', 'real_reviewed_generation_missing')
    session, spec, version, final_response, manual = play(client, security, session, recorder)
    history_path = f"/api/activities/parent/{child['id']}/history"
    if client.get(history_path).status_code != 403:
        raise VerificationFailure('parent_history', 'parent_guard_failed')
    if manual:
        if session['finalResult']['assessmentStatus'] != 'pending_parent_review':
            raise VerificationFailure('parent_review', 'pending_state_missing')
        # Child mode cannot grade its own artifact.
        csrf = request_json(client, 'GET', '/api/auth/csrf', stage='csrf').json()['csrfToken']
        rejected = client.post(f"/api/activities/parent/{child['id']}/sessions/{session['id']}/review",
            json=dict(correct=False, note='Synthetic artifact deliberately reviewed as not meeting the generated goal.', parentObserved=True, idempotencyKey=secrets.token_hex(16)),
            headers={'Origin': 'http://testserver', 'X-CSRF-Token': csrf})
        if rejected.status_code != 403:
            raise VerificationFailure('parent_review', 'child_can_grade')
    request_json(client, 'POST', '/api/session/picker', stage='picker', json={})
    request_json(client, 'POST', '/api/parent/pin/verify', stage='unlock_history', json={'pin': pin})
    history = request_json(client, 'GET', history_path, stage='parent_history').json()['activities']
    if len(history) != 1 or history[0]['finalResult'] != session['finalResult']:
        raise VerificationFailure('parent_history', 'protected_result_missing')
    if manual:
        review = request_json(client, 'POST', f"/api/activities/parent/{child['id']}/sessions/{session['id']}/review", stage='parent_review',
            json=dict(correct=False, note='Synthetic artifact deliberately reviewed as not meeting the generated goal.',
                      parentObserved=True, idempotencyKey=secrets.token_hex(16))).json()
        history = request_json(client, 'GET', history_path, stage='reviewed_history').json()['activities']
        result = history[0]['finalResult']
        if result['correct'] is not False or result['assessmentStatus'] != 'parent_reviewed' or review['finalResult'] != result:
            raise VerificationFailure('parent_review', 'reviewed_outcome_missing')
        if result['response'] != session['finalResult']['response']:
            raise VerificationFailure('parent_review', 'child_artifact_changed')
        if isinstance(final_response, dict) and 'recordingId' in final_response:
            media = request_json(client, 'GET', f"/api/activities/parent/{child['id']}/recordings/{final_response['recordingId']}", stage='parent_recording')
            if media.content != (ROOT / 'fixtures/synthetic-reading.wav').read_bytes():
                raise VerificationFailure('parent_recording', 'recording_changed')
    with security.db.transaction() as conn:
        after = _homework_state(conn, child['id'], target['id'])
    if before != after:
        raise VerificationFailure('learning_state', 'activity_changed_learning_evidence')
    return dict(case=name, subskillId=target['id'], generatedValidated=True, playedScored=True,
        family=for_subskill(target['id'])['family'], definitionRevalidated=True,
        specSha256=version['spec_sha256'], providerMode='live', assessment='parent_review' if manual else 'automatic',
        parentReviewed=manual, outcome='incorrect' if manual else 'correct', source='scripts/verify_catalog_activities.py',
        components=[scene.component for scene in spec.scenes], liveUpload=True, noPrebuiltActivity=True,
        sixReviewCriteriaApproved=True, privateAnswersProtected=True, independentHintsBlocked=True,
        refreshResumed=True, submitRetrySafe=True, parentPinProtectedHistory=True,
        learningStatusUnchanged=True, syntheticManualArtifactsReviewedIncorrect=manual, success=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--live', action='store_true', required=True)
    parser.add_argument('--case', choices=['all', *CASES], default='all')
    parser.add_argument('--report', type=Path, default=ROOT / 'data/activities/catalog_live_verification.json')
    args = parser.parse_args()
    from backend.activities.coverage import MAP_PATH, file_sha
    started = time.monotonic()
    logging.disable(logging.CRITICAL)
    report = dict(command='backend/.venv/bin/python scripts/verify_catalog_activities.py --live',
        coverageMapSha256=file_sha(MAP_PATH), checkedAt=datetime.now(timezone.utc).isoformat(), success=False)
    try:
        run_isolated(report, list(CASES) if args.case == 'all' else [args.case], case_runner=verify_case)
    except VerificationFailure as error:
        report.update(failedStage=error.stage, errorCode=error.code)
    except Exception:
        report.update(failedStage='configuration_or_unexpected_failure', errorCode='verification_failed')
    report['elapsedSeconds'] = round(time.monotonic() - started, 2)
    report['definitionRevalidation'] = dict(coverageMapSha256=report['coverageMapSha256'],
        allCapturedDefinitionsValidated=bool(report.get('cases')) and all(case.get('definitionRevalidated') is True for case in report.get('cases', [])))
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2), flush=True)
    return 0 if report['success'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
