"""Real owned HTTP generation reservations with explicit synthetic model adapters."""
import copy
import asyncio
import json
from pathlib import Path
import uuid

import pytest

from backend import main
from backend.activity_engine_v2 import generation, preview, service
from backend.activity_engine_v2.authoring import ActivityAuthoring, to_authoring
from backend.activity_engine_v2.composer import SemanticReview
from backend.activity_engine_v2.models import ActivityProgram
from backend.accounts.security import AccountError
from backend.gap.catalog import seed_catalog
from backend.provider import ExtractionError
from backend.tests.account_helpers import create_child, mutate, picker, select_child, setup_pin, signup, unlock

BASE = '/api/activity-programs'
EXAMPLES = Path(__file__).resolve().parents[2] / 'data/activity_engine_v2/examples'


class Composer:
    model = 'explicit-synthetic-v2-composer'

    def __init__(self, callback=None, failure=False):
        self.calls, self.callback, self.failure = [], callback, failure

    async def call(self, response_model, task, system, data):
        self.calls.append((task, copy.deepcopy(data)))
        if self.callback:
            self.callback()
        if self.failure:
            raise ExtractionError('provider_unavailable', 'Synthetic failure')
        if response_model is ActivityAuthoring:
            target = data['context']['targets'][0]['skillId']
            key = 'story_studio' if target == 'W.3.3-1' else 'trail_evidence' if target == 'RL.3.1-1' else 'habitat_designer'
            program = ActivityProgram.model_validate_json((EXAMPLES / f'{key}.json').read_bytes())
            return to_authoring(program)
        assert response_model is SemanticReview
        return SemanticReview(definitionHash=data['definitionHash'], approved=True,
            targetNecessary=True, meaningfulConsequences=True, materialsSuitable=True, goalAchievable=True,
            helpRelevant=True, scoringCorrectAcrossRoutes=True, shortcutsPrevented=True,
            parentAssessmentAppropriate=True, requiresParentReview=any(e['assessment']['kind'] == 'parent_review'
                for e in data['definition']['evidence']), reasonCode='approved', summary='Explicit synthetic review.')


@pytest.fixture
def family(parent_client, security_context, monkeypatch):
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW', 'true')
    seed_catalog(security_context.db)
    child = create_child(parent_client, grade='3').json()
    assert select_child(parent_client, child['id']).status_code == 200
    adapter = Composer()
    monkeypatch.setitem(main.app.state._state, 'program_composition_adapter', adapter)
    return child, parent_client, adapter


def upload(security, child, skill='3.MD.C.7-1', correctness='incorrect', confidence=.99,
           *, uncertain=False, conflict=False, work_status='answered'):
    identifier, problem = uuid.uuid4().hex, uuid.uuid4().hex
    extraction = dict(question=dict(text='PRIVATE_STUDENT_QUESTION secret@example.com', uncertain=uncertain),
        answer_choices=[], student_work=dict(status=work_status, steps=[],
            final_answer=dict(text='PRIVATE_WRITTEN_ANSWER', uncertain=False), selected_choice=dict(text=None, uncertain=False)))
    with security.db.transaction() as connection:
        now = security.clock.now()
        connection.execute('''INSERT INTO homework_uploads
            (id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at)
            VALUES (?,?,?,'PRIVATE_FILE_PATH','image/png','[]','fixture','completed','completed',?,?)''',
            (identifier, child['id'], uuid.uuid4().hex, now, now))
        connection.execute('''INSERT INTO homework_problems
            (id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,
            fingerprint,mapping_json,grading_json,teacher_conflict,created_at)
            VALUES (?,?,?,1,0,'1',?,'[]',?,?,?,?,?)''',
            (problem, identifier, child['id'], json.dumps(extraction), uuid.uuid4().hex,
             json.dumps(dict(subskill_id=skill, confidence=confidence, explanation='PRIVATE_MAPPING_EXPLANATION')),
             json.dumps(dict(correctness=correctness, source='deterministic', confidence=.99,
                             explanation='PRIVATE_GRADE_EXPLANATION')), int(conflict), now))
    return identifier


def headers(client):
    return {'X-Sidekick-Profile-Version': str(client.get('/api/auth/session').json()['version'])}


def post(client, path, payload):
    return mutate(client, 'POST', BASE + path, json=payload, headers=headers(client))


def prepare(client, upload_id, request_id=None):
    response = post(client, f'/uploads/{upload_id}/generations', dict(requestId=request_id or uuid.uuid4().hex))
    assert response.status_code == 202, response.text
    return client.get(BASE + '/generations/' + response.json()['id']).json()


@pytest.mark.parametrize('skill', ['3.MD.C.7-1', 'RL.3.1-1', 'W.3.3-1'])
def test_owned_composition_starts_initial_state_and_replays_without_fixture_loading(family, security_context, monkeypatch, skill):
    child, client, adapter = family
    identifier = upload(security_context, child, skill)
    monkeypatch.setattr(preview, 'load_preview', lambda *_: pytest.fail('Generated path loaded a finished fixture'))
    monkeypatch.setattr(service, 'load_preview', lambda *_: pytest.fail('Generated path loaded a finished fixture'))
    view = prepare(client, identifier)
    assert view['status'] == 'ready', view
    initial = client.get(BASE + '/sessions/' + view['sessionId']).json()
    assert initial['origin'] == 'ai_composed'
    assert initial['actionCount'] == initial['revision'] == 0
    assert initial['status'] == 'in_progress' and not initial['assistance']['received']
    assert 'witness' not in json.dumps(initial) and 'PRIVATE_' not in json.dumps(adapter.calls)
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 0
        saved = connection.execute('''SELECT v.definition_json,g.review_json FROM activity_program_generations g
            JOIN activity_program_sessions s ON s.id=g.session_id JOIN activity_program_versions v ON v.id=s.program_version_id
            WHERE g.id=?''', (view['id'],)).fetchone()
        program = ActivityProgram.model_validate_json(saved['definition_json'])
        assert json.loads(saved['review_json'])['definitionHash'] == initial['definitionHash']
    current = initial
    for step in program.witness:
        response = post(client, f"/sessions/{initial['id']}/actions", dict(requestId=uuid.uuid4().hex,
            expectedRevision=current['revision'], actionId=step.actionId, inputs=step.inputs))
        assert response.status_code == 200, response.text
        current = response.json()
    assert current['status'] == 'completed'
    assert current['outcome']['assessment'] == ('pending_parent_review' if skill == 'W.3.3-1' else 'demonstrated')
    assert post(client, f"/sessions/{initial['id']}/replay", dict(expectedRevision=current['revision'])).json()['verified']


def test_trusted_context_uses_actual_grades_and_uncertainty_without_private_content(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child, correctness='ungraded')
    view = prepare(client, identifier)
    assert view['status'] == 'ready', view
    context = adapter.calls[0][1]['context']
    assert context['learningGoal'] == 'explore_skill'
    assert not context['observations'] and not context['misconceptions']
    assert context['mappingConfidence'] == .99
    assert context['uncertainties'] and context['history'] == []
    public = json.dumps(adapter.calls)
    for private in ('PRIVATE_', child['id'], identifier, 'secret@example.com'):
        assert private not in public


@pytest.mark.parametrize('kwargs', [dict(confidence=.1), dict(uncertain=True), dict(conflict=True), dict(skill='FORGED-SKILL')])
def test_unreliable_or_forged_target_cannot_reach_composer(family, security_context, kwargs):
    child, client, adapter = family
    identifier = upload(security_context, child, **kwargs)
    suggestion = client.get(BASE + f'/uploads/{identifier}/suggestion')
    assert suggestion.status_code == 200 and not suggestion.json()['available']
    response = post(client, f'/uploads/{identifier}/generations', dict(requestId='no-target'))
    assert response.status_code == 422 and not adapter.calls


def test_idempotency_survives_ready_and_conflicting_upload_reuse(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    view = prepare(client, identifier, 'same-request')
    duplicate = prepare(client, identifier, 'same-request')
    assert duplicate == view and len(adapter.calls) == 2
    other = upload(security_context, child)
    conflict = post(client, f'/uploads/{other}/generations', dict(requestId='same-request'))
    assert conflict.status_code == 409
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0] == 1


def test_failure_releases_reservation_and_owned_retry_can_succeed(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    adapter.failure = True
    failed = prepare(client, identifier, 'failing')
    assert failed['status'] == 'failed' and failed['canRetry'] and failed['reasonCode'] == 'provider_unavailable'
    adapter.failure = False
    response = post(client, f"/generations/{failed['id']}/retry", dict(requestId='retry-new'))
    retried = client.get(BASE + '/generations/' + response.json()['id']).json()
    assert retried['status'] == 'ready' and retried['id'] != failed['id']
    assert prepare(client, identifier, 'failing')['id'] == failed['id']


def test_refresh_of_old_failed_route_recovers_already_ready_retry_without_another_model_job(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    adapter.failure = True
    original = prepare(client, identifier, 'original-failure')
    adapter.failure = False
    response = post(client, f"/generations/{original['id']}/retry", dict(requestId='accepted-retry'))
    retried = client.get(BASE + '/generations/' + response.json()['id']).json()
    assert retried['status'] == 'ready' and retried['createdAt'] == original['createdAt']
    calls = len(adapter.calls)
    # A browser refresh can restore the old route before router navigation.
    # Its fresh retry identity must still recover the accepted newer result.
    recovered = post(client, f"/generations/{original['id']}/retry", dict(requestId='after-refresh'))
    assert recovered.status_code == 202 and recovered.json() == retried
    assert len(adapter.calls) == calls
    assert post(client, f"/generations/{retried['id']}/retry", dict(requestId='already-ready')).json() == retried
    assert len(adapter.calls) == calls
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_generations').fetchone()[0] == 2
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0] == 1


def test_retry_does_not_reuse_ready_activity_created_before_the_failed_new_attempt(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    earlier = prepare(client, identifier, 'earlier-ready')
    adapter.failure = True
    failed = prepare(client, identifier, 'new-original-failed')
    assert failed['status'] == 'failed'
    adapter.failure = False
    response = post(client, f"/generations/{failed['id']}/retry", dict(requestId='retry-actual-new-activity'))
    recovered = client.get(BASE + '/generations/' + response.json()['id']).json()
    assert recovered['status'] == 'ready' and recovered['id'] not in {earlier['id'], failed['id']}
    assert earlier['createdAt'] == failed['createdAt'] == recovered['createdAt']
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_generations').fetchone()[0] == 3


def test_retry_reuses_processing_attempt_but_skips_expired_newer_retry(family, security_context, clock):
    from starlette.requests import Request
    child, client, adapter = family
    identifier = upload(security_context, child)
    request = Request({'type': 'http', 'headers': [(b'cookie', ('sidekick_session='+client.cookies.get('sidekick_session')).encode())]})
    active = security_context.session(request)
    original, _ = generation.reserve(security_context, child['id'], identifier, 'stopped-original', active)
    assert post(client, f"/generations/{original['id']}/retry", dict(requestId='pending-refresh')).json() == original
    assert not adapter.calls
    clock.advance(generation.GENERATION_LEASE_SECONDS + 1)
    newer, _ = generation.reserve(security_context, child['id'], identifier, 'stopped-retry', active, retry_of=original['id'])
    assert newer['id'] != original['id']
    clock.advance(generation.GENERATION_LEASE_SECONDS + 1)
    response = post(client, f"/generations/{original['id']}/retry", dict(requestId='recover-expired-retry'))
    recovered = client.get(BASE + '/generations/' + response.json()['id']).json()
    assert recovered['status'] == 'ready' and recovered['id'] not in {original['id'], newer['id']}
    assert client.get(BASE + '/generations/' + newer['id']).json()['status'] == 'failed'


def test_forged_learning_context_or_missing_csrf_and_profile_version_is_rejected(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    response = post(client, f'/uploads/{identifier}/generations', dict(requestId='forged', context={'learningGoal': 'mastered'}))
    assert response.status_code == 400
    response = mutate(client, 'POST', BASE + f'/uploads/{identifier}/generations', json=dict(requestId='no-profile'))
    assert response.status_code == 409
    response = client.post(BASE + f'/uploads/{identifier}/generations', json=dict(requestId='no-csrf'))
    assert response.status_code == 403 and not adapter.calls


def test_provider_profile_switch_prevents_saving_generated_session(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    def change():
        with security_context.db.transaction() as connection:
            connection.execute("UPDATE sessions SET version=version+1 WHERE active_kid_profile_id=?", (child['id'],))
        adapter.callback = None
    adapter.callback = change
    view = prepare(client, identifier)
    assert view['status'] == 'failed' and view['reasonCode'] == 'profile_changed'
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0] == 0


def test_other_child_cannot_read_or_retry_generation_or_owned_upload(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    view = prepare(client, identifier)
    assert picker(client).status_code == 200 and unlock(client).status_code == 200
    second = create_child(client, 'Maya').json()
    assert select_child(client, second['id']).status_code == 200
    assert client.get(BASE + f"/generations/{view['id']}").status_code == 404
    assert post(client, f"/generations/{view['id']}/retry", dict(requestId='steal')).status_code == 404
    assert client.get(BASE + f'/uploads/{identifier}/suggestion').status_code == 404
    assert post(client, f'/uploads/{identifier}/generations', dict(requestId='steal-source')).status_code == 404


def test_reservation_aliases_running_requests_and_expired_process_is_recoverable(family, security_context, clock):
    from starlette.requests import Request
    child, client, adapter = family
    identifier = upload(security_context, child)
    # Obtain the real session record through the same cookie, without weakening
    # route authorization. Reserve only: simulate a stopped background process.
    request = Request({'type': 'http', 'headers': [(b'cookie', ('sidekick_session='+client.cookies.get('sidekick_session')).encode())]})
    active = security_context.session(request)
    first, token = generation.reserve(security_context, child['id'], identifier, 'first', active)
    alias, no_worker = generation.reserve(security_context, child['id'], identifier, 'alias', active)
    assert alias == first and token and no_worker is None
    clock.advance(generation.GENERATION_LEASE_SECONDS + 1)
    failed = client.get(BASE + '/generations/' + first['id']).json()
    assert failed['status'] == 'failed' and failed['reasonCode'] == 'generation_interrupted'
    assert prepare(client, identifier, 'fresh')['status'] == 'ready'


def test_saved_help_dependence_informs_next_context_without_claiming_mastery(family, security_context):
    child, client, adapter = family
    first = prepare(client, upload(security_context, child))
    view = client.get(BASE + '/sessions/' + first['sessionId']).json()
    response = post(client, f"/sessions/{view['id']}/help", dict(requestId='actual-help',
        expectedRevision=0, helpId=view['help'][0]['id']))
    view = response.json()
    with security_context.db.transaction() as connection:
        raw = connection.execute('''SELECT v.definition_json FROM activity_program_sessions s
            JOIN activity_program_versions v ON v.id=s.program_version_id WHERE s.id=?''', (view['id'],)).fetchone()[0]
    program = ActivityProgram.model_validate_json(raw)
    for step in program.witness:
        response = post(client, f"/sessions/{view['id']}/actions", dict(requestId=uuid.uuid4().hex,
            expectedRevision=view['revision'], actionId=step.actionId, inputs=step.inputs))
        assert response.status_code == 200, response.text
        view = response.json()
    assert view['outcome']['assisted']
    second = prepare(client, upload(security_context, child, correctness='correct'))
    assert second['status'] == 'ready'
    context = [data['context'] for task, data in adapter.calls if task == 'compose_activity_program'][-1]
    assert context['learningGoal'] == 'reinforce_correct_work'
    assert context['observations'][0]['kind'] == 'correct_response'
    assert context['history'][0]['assistanceReceived'] and context['history'][0]['helpDeliveries'] == 1
    assert context['history'][0]['assessment'] == 'demonstrated' and context['history'][0]['confidence'] is None
    assert context['previousSignatures'][0]['operations'] == ['assemble_product', 'resize_rectangle']
    assert 'mastered' not in json.dumps(context)
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM skill_states').fetchone()[0] == 0


def test_another_account_cannot_read_retry_or_start_from_private_source(family, security_context, client_factory):
    child, client, adapter = family
    identifier = upload(security_context, child)
    view = prepare(client, identifier)
    other = client_factory()
    assert signup(other, 'other-composer@example.com').status_code == 201
    assert setup_pin(other).status_code == 200 and unlock(other).status_code == 200
    profile = create_child(other).json()
    assert select_child(other, profile['id']).status_code == 200
    assert other.get(BASE + '/generations/' + view['id']).status_code == 404
    assert post(other, f"/generations/{view['id']}/retry", dict(requestId='steal')).status_code == 404
    assert post(other, f'/uploads/{identifier}/generations', dict(requestId='steal-source')).status_code == 404
    assert other.get(BASE + '/generations').json()['generations'] == []


def test_total_deadline_releases_failed_job_without_storing_candidate(family, security_context, monkeypatch):
    child, client, adapter = family
    identifier = upload(security_context, child)
    async def delayed(*args, **kwargs):
        await asyncio.sleep(1)
    monkeypatch.setattr(adapter, 'call', delayed)
    monkeypatch.setattr(generation, 'GENERATION_TIMEOUT_SECONDS', .01)
    view = prepare(client, identifier)
    assert view['status'] == 'failed' and view['canRetry']
    assert view['reasonCode'] in {'generation_timeout', 'generation_deadline_exceeded'}
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_versions').fetchone()[0] == 0
        assert connection.execute('SELECT lease_token FROM activity_program_generations').fetchone()[0] is None


def test_only_visible_matched_error_pattern_supports_hypothesis(family, security_context):
    child, client, adapter = family
    identifier = upload(security_context, child)
    with security_context.db.transaction() as connection:
        connection.execute('UPDATE homework_problems SET signature_json=? WHERE upload_id=?',
            (json.dumps(dict(status='matched', confidence=.91, explanation='PRIVATE_PATTERN_EXPLANATION')), identifier))
    assert prepare(client, identifier)['status'] == 'ready'
    context = adapter.calls[0][1]['context']
    assert context['misconceptions'] and context['misconceptions'][0]['confidence'] == .91
    assert context['misconceptions'][0]['observationIds'] == ['upload-pattern']
    assert 'PRIVATE_PATTERN_EXPLANATION' not in json.dumps(adapter.calls)
