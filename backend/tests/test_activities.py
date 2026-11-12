"""Activities compose safely and preserve a private, independent first attempt."""
import copy
import asyncio
import json
import uuid

import pytest
from pydantic import ValidationError

from backend import main
from backend.activities import service
from backend.activities.library import DEFAULT_ACTIVITIES, seed_library
from backend.activities.models import ActivitySpec, StartRequest
from backend.accounts.security import AccountError, SessionRecord
from backend.gap.catalog import seed_catalog
from backend.gap.service import record_homework_evidence
from backend.tests.account_helpers import create_child, mutate, picker, select_child, signup, setup_pin, unlock


def key():
    return uuid.uuid4().hex


def examples():
    return [entry['spec'] for entry in json.loads(DEFAULT_ACTIVITIES.read_text())['activities']]


@pytest.fixture(autouse=True)
def no_remote_activity_calls(monkeypatch):
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', False)


@pytest.fixture
def activity_family(parent_client, security_context):
    seed_catalog(security_context.db)
    report = seed_library(security_context.db)
    assert report['originalExamplesImported'] == 2
    child = create_child(parent_client).json()
    select_child(parent_client, child['id'])
    return child, parent_client


def add_problem(security, child, upload_id, subject='math', *, correctness='incorrect', eligible=True,
                subskill=None, confidence=.99, page_number=1, problem_order=0, teacher_conflict=False):
    problem_id = key()
    subskill = subskill or ('3.NF.A.1-2' if subject == 'math' else 'L.3.1-2')
    with security.db.transaction() as conn:
        conn.execute("INSERT INTO homework_problems(id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,fingerprint,teacher_conflict,created_at) VALUES(?,?,?,?,?,'1','{}','[]',?,?,?)", (problem_id, upload_id, child['id'], page_number, problem_order, key(), int(teacher_conflict), security.clock.now()))
    record_homework_evidence(security, child['id'], problem_id, subskill, correctness, eligible, confidence,
                             question='Sensitive uploaded content must not reach composition.', fingerprint=key())
    return problem_id


def upload(security, child, subject='math', *, state='completed', correctness='incorrect', eligible=True,
           subskill=None, confidence=.99, teacher_conflict=False):
    upload_id = key()
    now = security.clock.now()
    with security.db.transaction() as conn:
        conn.execute("INSERT INTO homework_uploads(id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at) VALUES(?,?,?,'opaque','image/png','[]','fixture',?,'completed',?,?)", (upload_id, child['id'], key(), state, now, now))
    add_problem(security, child, upload_id, subject, correctness=correctness, eligible=eligible,
                subskill=subskill, confidence=confidence, teacher_conflict=teacher_conflict)
    return upload_id


def start(client, upload_id, request_key=None):
    return mutate(client, 'POST', '/api/activities/kid/start', json={'uploadId': upload_id, 'idempotencyKey': request_key or key()})


def submit(client, session, response, request_key=None):
    return mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/submit", json={'sceneId': session['currentScene']['id'], 'idempotencyKey': request_key or key(), 'response': response})


def advance(client, session, request_key=None):
    return mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/next", json={'sceneId': session['currentScene']['id'], 'idempotencyKey': request_key or key()})


def complete(client, session, final_answer=None):
    while session['status'] == 'in_progress':
        scene = session['currentScene']
        response = {'fraction_builder': {'selectedParts': [0, 1, 2]}, 'number_line': {'tick': 4},
                    'word_tiles': {'tileIds': ['tile-m', 'tile-i', 'tile-c', 'tile-e']},
                    'word_choice': {'choiceId': 'many-men'}, 'independent_fraction': final_answer or '3/8',
                    'independent_word': final_answer or 'feet'}[scene['component']]
        session = submit(client, session, response).json()
        if scene['phase'] == 'guided':
            session = advance(client, session).json()
    return session


@pytest.mark.parametrize('subject', ['math', 'ela'])
def test_upload_support_suggestion_reuse_play_resume_parent_result(activity_family, security_context, subject):
    child, client = activity_family
    upload_id = upload(security_context, child, subject)
    suggestion = client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).json()
    assert suggestion['available'] and suggestion['targetSkill']['subject'] == subject
    request_key = key()
    session = start(client, upload_id, request_key).json()
    assert session['id'] == start(client, upload_id, request_key).json()['id']
    assert session['sceneCount'] == 3 and not session['feedback'] and not session['hint']
    assert 'answer' not in json.dumps(session) and 'nextSceneId' not in json.dumps(session)
    assert ('independent_fraction' if subject == 'math' else 'independent_word') not in json.dumps(session)
    path = f"/api/activities/kid/sessions/{session['id']}"
    assert client.get(path).json() == session
    # First guided response is deliberately wrong; hints are available afterward.
    response = {'selectedParts': [0]} if subject == 'math' else {'tileIds': ['tile-e', 'tile-m']}
    submitted = submit(client, session, response).json()
    assert submitted['feedback']['correct'] is False and submitted['canAdvance']
    assert client.get(path).json()['currentResponse'] == response
    hinted = mutate(client, 'POST', path + '/hint', json={'sceneId': session['currentScene']['id']}).json()
    assert hinted['hint']
    session = advance(client, hinted).json()
    result = complete(client, session, final_answer='7/8' if subject == 'math' else 'foots')
    assert result['status'] == 'completed' and result['currentScene'] is None
    assert result['finalResult']['correct'] is False
    assert result['finalResult']['response'] == ('7/8' if subject == 'math' else 'foots')
    picker(client)
    unlock(client)
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult'] == result['finalResult'] and history[0]['completedAt']
    assert history[0]['guidedHintCount'] == 1
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 2
        assert conn.execute('SELECT COUNT(*) FROM activity_attempts WHERE session_id=?', (result['id'],)).fetchone()[0] == 3
        assert service._homework_state(conn, child['id'], suggestion['targetSkill']['id'])['status'] == 'needs_support'
        assert not conn.execute("SELECT 1 FROM learning_evidence WHERE source!='homework'").fetchone()


@pytest.mark.parametrize('subject', ['math', 'ela'])
def test_all_correct_upload_starts_reinforcement_and_preserves_on_track_state(activity_family, security_context, subject):
    child, client = activity_family
    upload_id = upload(security_context, child, subject, correctness='correct')
    add_problem(security_context, child, upload_id, subject, correctness='correct', page_number=2)
    subskill = '3.NF.A.1-2' if subject == 'math' else 'L.3.1-2'
    with security_context.db.transaction() as conn:
        before = service._homework_state(conn, child['id'], subskill)
        assert before['status'] == 'on_track'

    suggestion = client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).json()
    assert suggestion['available'] and suggestion['reason'] is None
    assert suggestion['targetSkill']['id'] == subskill
    response = start(client, upload_id)
    assert response.status_code == 200, response.text
    session = response.json()
    assert client.get(f"/api/activities/kid/sessions/{session['id']}").json() == session
    # Activity results remain separate even if the new independent answer is wrong.
    result = complete(client, session, final_answer='7/8' if subject == 'math' else 'foots')
    assert result['status'] == 'completed' and result['finalResult']['correct'] is False
    picker(client)
    unlock(client)
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult'] == result['finalResult']
    with security_context.db.transaction() as conn:
        assert service._homework_state(conn, child['id'], subskill) == before
        assert conn.execute("SELECT COUNT(*) FROM learning_evidence WHERE kid_id=? AND eligible=1 AND correctness='correct'", (child['id'],)).fetchone()[0] == 2
        chosen = conn.execute('SELECT e.correctness FROM activity_sessions s JOIN learning_evidence e ON e.id=s.evidence_id WHERE s.id=?', (session['id'],)).fetchone()
        assert chosen['correctness'] == 'correct'
        assert not conn.execute("SELECT 1 FROM learning_evidence WHERE source!='homework'").fetchone()


def test_supported_errors_take_priority_then_follow_page_order(activity_family, security_context):
    child, client = activity_family
    upload_id = upload(security_context, child, correctness='correct')
    # Insert the later-page math error first; original page order wins among errors.
    add_problem(security_context, child, upload_id, 'math', page_number=3)
    first_error = add_problem(security_context, child, upload_id, 'ela', page_number=2)
    suggestion = client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).json()
    assert suggestion['available'] and suggestion['targetSkill']['subject'] == 'ela'
    response = start(client, upload_id)
    assert response.status_code == 200, response.text
    with security_context.db.transaction() as conn:
        selected = conn.execute('SELECT e.source_ref FROM activity_sessions s JOIN learning_evidence e ON e.id=s.evidence_id WHERE s.id=?', (response.json()['id'],)).fetchone()
        assert selected['source_ref'] == first_error


def test_all_correct_targets_follow_page_order_and_ignore_unsupported_errors(activity_family, security_context):
    child, client = activity_family
    upload_id = upload(security_context, child, 'ela', correctness='correct')
    add_problem(security_context, child, upload_id, 'math', correctness='correct', problem_order=1)
    add_problem(security_context, child, upload_id, 'math', subskill='3.OA.A.1-1', page_number=2)
    suggestion = client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).json()
    assert suggestion['available'] and suggestion['targetSkill']['subject'] == 'ela'
    assert start(client, upload_id).status_code == 200


def test_correct_upload_is_available_even_when_earlier_work_still_needs_support(activity_family, security_context):
    child, client = activity_family
    upload(security_context, child)
    upload_id = upload(security_context, child, correctness='correct')
    suggestion = client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).json()
    assert suggestion['available'] and start(client, upload_id).status_code == 200
    with security_context.db.transaction() as conn:
        assert service._homework_state(conn, child['id'], '3.NF.A.1-2')['status'] == 'needs_support'


def test_suggestion_get_is_read_only_and_unsupported_or_unusable_observations_do_not_start(activity_family, security_context, monkeypatch):
    child, client = activity_family
    uploads = [(upload(security_context, child, state='processing'), 'analysis_pending'),
               (upload(security_context, child, state='failed'), 'analysis_failed'),
               (upload(security_context, child, eligible=False), 'no_supported_skill'),
               (upload(security_context, child, correctness='correct', eligible=False), 'no_supported_skill'),
               (upload(security_context, child, correctness='ungraded'), 'no_supported_skill'),
               (upload(security_context, child, correctness='correct', confidence=.1), 'no_supported_skill'),
               (upload(security_context, child, correctness='correct', teacher_conflict=True), 'no_supported_skill'),
               (upload(security_context, child, subskill='3.OA.A.1-1'), 'no_supported_skill')]
    statements = []
    original = security_context.db.connect
    def traced():
        connection = original()
        connection.set_trace_callback(statements.append)
        return connection
    monkeypatch.setattr(security_context.db, 'connect', traced)
    for upload_id, reason in uploads:
        result = client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).json()
        assert not result['available'] and result['reason'] == reason
    # Session middleware only reads existing sessions for these GET requests.
    assert not any(value.lstrip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')) for value in statements)


def new_composition():
    spec = copy.deepcopy(examples()[0])
    spec['title'] = 'A New Fraction Journey'
    inserted = copy.deepcopy(spec['scenes'][0])
    inserted.update(id='extra', prompt='Build 1/2 using equal parts.', params={'denominator': 2}, answer={'value': '1/2'}, nextSceneId='independent')
    inserted['feedback'] = {'correct': 'Each equal piece is a half.', 'incorrect': 'Count the equal pieces.', 'hint': 'Select one of two equal parts.'}
    spec['scenes'][1]['nextSceneId'] = 'extra'
    spec['scenes'].insert(2, inserted)
    spec['scenes'][-1].update(prompt='What fraction is 5 copies of 1/8?', params={'unitDenominator': 8, 'copies': 5}, answer={'value': '5/8'})
    return spec


class Composer:
    model = 'test-composer'

    def __init__(self, result=None, error=False, callback=None):
        self.result, self.error, self.callback, self.calls = result, error, callback, []

    async def _call(self, schema, task, instruction, data):
        self.calls.append((task, instruction, data))
        if self.callback:
            self.callback()
        if self.error:
            raise RuntimeError('Provider failure includes private payload; do not save this exception.')
        return self.result


def test_unseen_verified_match_prevents_model_call(activity_family, security_context, monkeypatch):
    child, client = activity_family
    composer = Composer(error=True)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    assert start(client, upload(security_context, child)).status_code == 200
    assert not composer.calls


@pytest.mark.parametrize('correctness', ['correct', 'incorrect'])
def test_model_composes_and_saves_new_four_scene_spec_without_worksheet_or_identity(activity_family, security_context, monkeypatch, correctness):
    child, client = activity_family
    upload_id = upload(security_context, child, correctness=correctness)
    complete(client, start(client, upload_id).json())
    composer = Composer(new_composition())
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    result = start(client, upload_id)
    assert result.status_code == 200, result.text
    assert result.json()['sceneCount'] == 4 and result.json()['title'] == 'A New Fraction Journey'
    payload = json.dumps(composer.calls[0][2])
    assert 'Sensitive uploaded' not in payload and child['id'] not in payload and child['firstName'] not in payload
    assert 'account_id' not in payload and 'uploadId' not in payload
    with security_context.db.transaction() as conn:
        version = conn.execute("SELECT * FROM activity_versions WHERE origin='model_generated'").fetchone()
        assert version['verified'] and version['model'] == 'test-composer' and version['component_version']
        assert ActivitySpec.model_validate_json(version['spec_json']).scenes[-1].answer.value == '5/8'
        assert service._homework_state(conn, child['id'], '3.NF.A.1-2')['status'] == ('on_track' if correctness == 'correct' else 'needs_support')


@pytest.mark.parametrize('invalid', [False, True])
def test_generation_failure_or_invalid_spec_uses_verified_fallback(activity_family, security_context, monkeypatch, tmp_path, invalid):
    child, client = activity_family
    upload_id = upload(security_context, child)
    # A verified same-skill example with a general misconception tag is suitable
    # as fallback, while it does not meet the strict exact-tag reuse threshold.
    manifest = json.loads(DEFAULT_ACTIVITIES.read_text())
    manifest['activities'][0]['spec']['misconceptionTags'] = ['General equal-part support']
    path = tmp_path / 'weak-match.json'
    path.write_text(json.dumps(manifest))
    seed_library(security_context.db, activities_path=path)
    malformed = new_composition()
    malformed['scenes'][-1]['answer']['value'] = '7/8'
    composer = Composer(malformed, error=not invalid)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    second = start(client, upload_id)
    assert second.status_code == 200 and second.json()['title'] == 'Equal Pieces: Build a Fraction'
    assert composer.calls
    with security_context.db.transaction() as conn:
        assert not conn.execute("SELECT 1 FROM activity_versions WHERE origin='model_generated'").fetchone()
        assert not any('private payload' in row[0] for row in conn.execute('SELECT explanation FROM model_audits'))


def test_no_fallback_friendly_retry_releases_reservation(activity_family, security_context, monkeypatch):
    child, client = activity_family
    upload_id, request_key = upload(security_context, child), key()
    with security_context.db.transaction() as conn:
        conn.execute('UPDATE activity_versions SET active=0')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer(error=True))
    failed = start(client, upload_id, request_key)
    assert failed.status_code == 503 and failed.json()['error']['code'] == 'activity_unavailable'
    seed_library(security_context.db)
    assert start(client, upload_id, request_key).status_code == 200


def test_submit_next_and_final_are_idempotent_and_independent_cues_are_removed(activity_family, security_context):
    child, client = activity_family
    upload_id, start_key = upload(security_context, child), key()
    session = start(client, upload_id, start_key).json()
    another_upload = upload(security_context, child)
    assert start(client, another_upload, start_key).status_code == 409
    assert mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/hint", json={'sceneId': 'build'}).status_code == 409
    request_key = key()
    first = submit(client, session, {'selectedParts': [0]}, request_key)
    assert first.json() == submit(client, session, {'selectedParts': [0]}, request_key).json()
    assert submit(client, session, {'selectedParts': [1]}, request_key).status_code == 409
    retried = submit(client, first.json(), {'selectedParts': [0, 1, 2]}).json()
    assert retried['feedback']['correct'] and retried['currentResponse'] == {'selectedParts': [0, 1, 2]}
    next_key = key()
    next_session = advance(client, retried, next_key).json()
    assert advance(client, first.json(), next_key).json() == next_session
    session = advance(client, submit(client, next_session, {'tick': 4}).json()).json()
    assert session['currentScene']['component'] == 'independent_fraction'
    assert session['feedback'] is None and session['hint'] is None and session['currentResponse'] is None
    assert set(session['currentScene']['params']) == {'unitDenominator', 'copies'}
    assert mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/hint", json={'sceneId': session['currentScene']['id']}).status_code == 409
    final_key = key()
    final = submit(client, session, '6/16', final_key)
    assert final.json()['finalResult']['correct']
    assert submit(client, session, '6/16', final_key).json() == final.json()
    assert submit(client, session, '1/8').status_code == 409


@pytest.mark.parametrize('change', ['wrong_key', 'cycle', 'unknown_component', 'missing_context', 'fresh_answer_leak', 'negated_final', 'zero_denominator', 'unequal_parts', 'ambiguous_guided'])
def test_invalid_or_ungrounded_model_specs_are_rejected(change):
    spec = copy.deepcopy(examples()[0])
    if change == 'wrong_key': spec['scenes'][0]['answer']['value'] = '1/2'
    if change == 'cycle': spec['scenes'][1]['nextSceneId'] = 'build'
    if change == 'unknown_component': spec['scenes'][0]['component'] = 'html'
    if change == 'missing_context': spec['scenes'][0]['prompt'] += ' Use the passage above.'
    if change == 'fresh_answer_leak': spec['scenes'][0]['feedback']['hint'] += ' Later the answer is 3/8.'
    if change == 'negated_final': spec['scenes'][-1]['prompt'] = 'What fraction is not 3 copies of 1/8?'
    if change == 'zero_denominator': spec['scenes'][0]['answer']['value'] = '1/0'
    if change == 'unequal_parts': spec['scenes'][0]['params']['denominator'] = 8
    if change == 'ambiguous_guided': spec['scenes'][0]['prompt'] += ' Or build 1/2.'
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(spec)


def test_final_plural_cannot_reuse_or_reveal_guided_word():
    spec = copy.deepcopy(examples()[1])
    spec['scenes'][0]['params']['tiles'][0]['text'] = 'feet'
    with pytest.raises(ValidationError): ActivitySpec.model_validate(spec)
    spec = copy.deepcopy(examples()[1])
    spec['scenes'][0]['feedback']['hint'] += ' Foot becomes feet.'
    with pytest.raises(ValidationError): ActivitySpec.model_validate(spec)


def test_whole_word_tiles_must_be_orderable_not_just_share_letter_inventory():
    spec = copy.deepcopy(examples()[1])
    spec['scenes'][0]['params']['tiles'] = [{'id': 'left', 'text': 'mc'}, {'id': 'right', 'text': 'ie'}]
    with pytest.raises(ValidationError): ActivitySpec.model_validate(spec)
    spec['scenes'][0]['params']['tiles'] = [{'id': 'left', 'text': 'mi'}, {'id': 'right', 'text': 'ce'}]
    assert ActivitySpec.model_validate(spec).scenes[0].answer.value == 'mice'


@pytest.mark.parametrize('subject,title', [('math', 'Next fraction: 3/8'), ('ela', 'Next word: foot becomes feet')])
def test_title_cannot_expose_the_independent_task(subject, title):
    spec = copy.deepcopy(examples()[0 if subject == 'math' else 1])
    spec['title'] = title
    with pytest.raises(ValidationError): ActivitySpec.model_validate(spec)


def test_csrf_parent_pin_sibling_and_other_account_isolation(activity_family, security_context, client_factory):
    child, client = activity_family
    upload_id = upload(security_context, child)
    assert client.post('/api/activities/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}, headers={'Origin': 'http://testserver'}).status_code == 403
    session = start(client, upload_id).json()
    path = f"/api/activities/kid/sessions/{session['id']}"
    assert client.get(f"/api/activities/parent/{child['id']}/history").status_code == 403
    picker(client)
    assert client.get(f"/api/activities/parent/{child['id']}/history").status_code == 403
    unlock(client)
    sibling = create_child(client, name='Sibling').json()
    select_child(client, sibling['id'])
    assert client.get(path).status_code == 404
    assert client.get('/api/activities/kid/suggestion', params={'uploadId': upload_id}).status_code == 404
    assert start(client, upload_id).status_code == 404
    assert mutate(client, 'POST', path + '/submit', json={'sceneId': 'build', 'idempotencyKey': key(), 'response': {'selectedParts': [0]}}).status_code == 404
    other = client_factory()
    signup(other, 'other@example.test')
    setup_pin(other)
    unlock(other)
    assert other.get(f"/api/activities/parent/{child['id']}/history").status_code == 404
    other_child = create_child(other).json()
    select_child(other, other_child['id'])
    assert other.get(path).status_code == 404


def test_profile_switch_during_model_call_prevents_save_and_model_runs_outside_transaction(activity_family, security_context, monkeypatch):
    child, client = activity_family
    upload_id = upload(security_context, child)
    complete(client, start(client, upload_id).json())
    def switch():
        # Acquiring a write transaction here proves generation holds no DB lock.
        with security_context.db.transaction() as conn:
            conn.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,version=version+1")
    composer = Composer(new_composition(), callback=switch)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    result = start(client, upload_id)
    assert result.status_code in (403, 409)
    with security_context.db.transaction() as conn:
        assert not conn.execute("SELECT 1 FROM activity_versions WHERE origin='model_generated'").fetchone()
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 1


def test_child_deletion_cascades_private_activity_records_but_keeps_library(activity_family, security_context):
    child, client = activity_family
    session = complete(client, start(client, upload(security_context, child)).json())
    picker(client)
    with security_context.db.transaction() as conn:
        conn.execute('DELETE FROM kid_profiles WHERE id=?', (child['id'],))
        for table in ('activity_sessions', 'activity_attempts', 'activity_start_requests', 'activity_scene_events'):
            assert not conn.execute(f'SELECT 1 FROM {table}').fetchone()
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 2


@pytest.mark.parametrize('subject,question', [('math', 'What fraction is 3 copies of 1/8?'), ('ela', 'Write the plural of foot.')])
def test_original_upload_independent_task_collision_never_reuses_example(activity_family, security_context, monkeypatch, subject, question):
    child, client = activity_family
    upload_id = upload(security_context, child, subject)
    with security_context.db.transaction() as conn:
        conn.execute('UPDATE homework_problems SET extraction_json=? WHERE upload_id=?', (json.dumps({'question': {'text': question}}), upload_id))
    result = start(client, upload_id)
    assert result.status_code == 503
    with security_context.db.transaction() as conn:
        assert not conn.execute('SELECT 1 FROM activity_sessions').fetchone()


def test_generated_task_collision_is_retried_without_passing_uploaded_question(activity_family, security_context, monkeypatch):
    child, client = activity_family
    upload_id = upload(security_context, child)
    with security_context.db.transaction() as conn:
        conn.execute('UPDATE homework_problems SET extraction_json=? WHERE upload_id=?', (json.dumps({'question': {'text': 'What fraction is 3 copies of 1/8?'}}), upload_id))
    composer = Composer(copy.deepcopy(examples()[0]))
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    result = start(client, upload_id)
    assert result.status_code == 503 and len(composer.calls) == 2
    assert all('What fraction is 3 copies of 1/8?' not in json.dumps(call[2]) for call in composer.calls)


def test_equivalent_task_cannot_be_repeated_by_rewording_model_prompt(activity_family, security_context, monkeypatch):
    child, client = activity_family
    upload_id = upload(security_context, child, 'ela')
    complete(client, start(client, upload_id).json())
    spec = copy.deepcopy(examples()[1])
    spec['scenes'][-1]['prompt'] = 'Write the plural of foot.'
    composer = Composer(spec)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    assert start(client, upload_id).status_code == 503 and len(composer.calls) == 2


def test_concurrent_start_retry_uses_one_provider_call_and_one_session(activity_family, security_context):
    child, client = activity_family
    upload_id = upload(security_context, child)
    with security_context.db.transaction() as conn:
        conn.execute('UPDATE activity_versions SET active=0')
        row = conn.execute("SELECT * FROM sessions WHERE mode='kid'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], row['active_kid_profile_id'], row['parent_expires_at'], row['version'])
    body = StartRequest(uploadId=upload_id, idempotencyKey=key())
    async def exercise():
        entered, release = asyncio.Event(), asyncio.Event()
        class PausedComposer:
            model = 'test-concurrent'
            calls = 0
            async def _call(self, schema, task, instruction, data):
                self.calls += 1
                entered.set()
                await release.wait()
                return new_composition()
        adapter = PausedComposer()
        first = asyncio.create_task(service.start(security_context, child['id'], body, active, adapter=adapter))
        await entered.wait()
        with pytest.raises(AccountError) as conflict:
            await service.start(security_context, child['id'], body, active, adapter=adapter)
        assert conflict.value.code == 'activity_preparing'
        release.set()
        result = await first
        retry = await service.start(security_context, child['id'], body, active, adapter=adapter)
        assert retry['id'] == result['id'] and adapter.calls == 1
    asyncio.run(exercise())
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 1
