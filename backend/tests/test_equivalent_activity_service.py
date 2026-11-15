"""Equivalent fractions require visible equal splitting before an independent rewrite."""
import hashlib
import json

import pytest

from backend import main
from backend.activities import service
from backend.activities.equivalent import EQUIVALENT_SUBSKILLS, has_split_scene
from backend.activities.library import seed_library
from backend.activities.models import ActivitySpec
from backend.gap.catalog import get_subskill, seed_catalog
from backend.gap.service import _homework_state
from backend.tests.account_helpers import create_child, mutate, picker, select_child, unlock
from backend.tests.test_general_activity_service import Composer, generic_spec, mapped_upload, start, uid


@pytest.fixture
def family(parent_client, security_context, monkeypatch):
    seed_catalog(security_context.db)
    seed_library(security_context.db)
    child = create_child(parent_client, grade='4').json()
    select_child(parent_client, child['id'])
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', False)
    # Each policy case explicitly supplies the matching historical/fallback data.
    with security_context.db.transaction() as connection:
        connection.execute("DELETE FROM activity_versions WHERE subskill_id IN (?,?,?,?)", tuple(sorted(EQUIVALENT_SUBSKILLS)))
    return child, parent_client


def split_spec(security, subskill='4.NF.A.1-1', *, weak=False):
    with security.db.transaction() as connection:
        target = get_subskill(connection, subskill)
    def visual(identifier, numerator, denominator, factor, factors, next_id):
        return dict(id=identifier, component='fraction_split_compare', phase='guided',
                    prompt=f'Split each of the {denominator} equal parts into {factor} equal pieces.',
                    params=dict(context='Imagine one rectangular garden bed with part of it planted.',
                                teachingText='Equal new divisions change the piece counts while the planted area stays fixed.',
                                wholeLabel='One garden bed', shadedLabel='Planted',
                                numerator=numerator, denominator=denominator, splitFactors=factors),
                    answer=dict(splitFactor=factor), nextSceneId=next_id,
                    feedback=dict(correct=f'{numerator}/{denominator} becomes {numerator * factor}/{denominator * factor}: the same area has finer equal parts.',
                                  incorrect='Keep the planted area fixed and choose the requested equal split.',
                                  hint=f'Split each original part into {factor} equal pieces.'))
    spec = dict(schemaVersion='1.1', title='One Garden, More Equal Pieces', subject='math',
                subskillId=subskill, grade=int(target['grade']), sourceRefs=[],
                misconceptionTags=['Equivalent fractions keep the same shaded area'] if weak else [target['common_misconception']],
                scenes=[visual('halves', 1, 2, 3, [2, 3, 4], 'thirds'),
                        visual('thirds', 2, 3, 2, [2, 3], 'own'),
                        dict(id='own', component='independent_response', phase='independent',
                             prompt='Write 3/4 as a fraction with denominator 8.', params=dict(context=None),
                             answer=dict(value='6/8', acceptedAnswers=[], comparison='fraction_form',
                                         sourceNumerator=3, sourceDenominator=4, targetDenominator=8),
                             feedback=dict(correct='You kept the same amount in the requested equal parts.',
                                           incorrect='Use the requested denominator for the same fraction amount.',
                                           hint='Use the same multiplication factor for both counts.'), nextSceneId=None)])
    if subskill == '4.NF.A.1-2':
        spec['schemaVersion'] = '1.2'
        final = spec['scenes'][-1]
        final.update(component='text_editor', prompt='Explain why splitting each fourth of a new garden into two pieces preserves its planted 3/4 area.',
            params=dict(context=None, teachingText=None, goal='Explain the same amount after equal splitting.', visual=None,
                mode='compose', initialText='', minLength=20, minWords=0, maxLength=2000, wordBank=[]),
            answer=dict(assessment='parent_review', rubric=['Explains unchanged area and equal subdivisions.', 'Connects both counts to the same split factor.']))
    return spec


def save_version(security, spec, *, origin='model_generated'):
    parsed = ActivitySpec.model_validate(spec)
    raw = json.dumps(parsed.model_dump(), ensure_ascii=False, sort_keys=True)
    identifier = uid()
    with security.db.transaction() as connection:
        revision = connection.execute('SELECT id FROM activity_library_revisions LIMIT 1').fetchone()[0]
        connection.execute("""INSERT INTO activity_versions
            (id,activity_id,version,spec_json,spec_sha256,subskill_id,subject,grade,
             misconception_tags_json,origin,verified,source_revision,model,prompt_version,
             component_version,created_at,active)
            VALUES(?,?,1,?,?,?,?,?,?,?,1,?,'historical-model','sidekick-activity-v3',
                   'sidekick-interactions-v2',?,1)""",
            (identifier, identifier, raw, hashlib.sha256(raw.encode()).hexdigest(), parsed.subskillId,
             parsed.subject, parsed.grade, json.dumps(parsed.misconceptionTags), origin,
             revision, security.clock.now()))
    return identifier


def old_question_card(security, subskill='4.NF.A.1-1'):
    spec = generic_spec()
    with security.db.transaction() as connection:
        target = get_subskill(connection, subskill)
    spec.update(subskillId=subskill, grade=int(target['grade']), misconceptionTags=[target['common_misconception']])
    return spec


@pytest.mark.parametrize('subskill', sorted(EQUIVALENT_SUBSKILLS))
def test_every_equivalent_skill_generates_manipulation_even_when_old_cards_match(family, security_context, monkeypatch, subskill):
    child, client = family
    upload = mapped_upload(security_context, child, subskill, correctness='correct')
    save_version(security_context, old_question_card(security_context, subskill))
    composer = Composer(split_spec(security_context, subskill))
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    response = start(client, upload)
    assert response.status_code == 200, response.text
    session = response.json()
    assert session['origin'] == 'model_generated'
    assert session['currentScene']['component'] == 'fraction_split_compare'
    assert [call[0] for call in composer.calls] == ['compose_activity', 'review_activity']
    payload = composer.calls[0][2]
    assert payload['learningGoal']['intent'] == 'reinforce_correct_work'
    assert payload['learningGoal']['supportedObservation'] == {'kind': 'correct_response'}
    serialized = json.dumps(payload)
    assert 'Private original question' not in serialized and child['id'] not in serialized
    assert 'splitFactor' not in session['currentScene']
    assert 'answer' not in json.dumps(session) and 'targetDenominator' not in json.dumps(session)


@pytest.mark.parametrize('correctness,signature,intent,kind', [
    ('incorrect', {'status': 'matched', 'confidence': .99, 'explanation': 'Private handwriting says 9/11.'}, 'support_current_skill', 'matched_catalog_pattern'),
    ('incorrect', {'status': 'possible_slip', 'confidence': .99}, 'support_current_skill', 'incorrect_response'),
    ('incorrect', {'status': 'matched', 'confidence': .4}, 'support_current_skill', 'incorrect_response'),
    ('ungraded', {'status': 'matched', 'confidence': .99}, 'explore_skill', None),
])
def test_learning_goal_uses_only_supported_current_observation(family, security_context, monkeypatch, correctness, signature, intent, kind):
    child, client = family
    upload = mapped_upload(security_context, child, '4.NF.A.1-1', correctness=correctness)
    with security_context.db.transaction() as connection:
        connection.execute("UPDATE learning_evidence SET signature_json=? WHERE source_ref IN (SELECT id FROM homework_problems WHERE upload_id=?)", (json.dumps(signature), upload))
    composer = Composer(split_spec(security_context))
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    assert start(client, upload).status_code == 200
    payload = composer.calls[0][2]
    goal = payload['learningGoal']
    assert goal['intent'] == intent
    observation = goal['supportedObservation']
    assert (observation or {}).get('kind') == kind
    if kind == 'matched_catalog_pattern':
        assert observation['pattern'] == 'Adds the same number to both'
    else:
        assert not observation or 'pattern' not in observation
    assert 'Private handwriting' not in json.dumps(composer.calls)
    assert '9/11' not in json.dumps(composer.calls)


def test_failed_live_composition_does_not_substitute_a_finished_split_activity(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child, '4.NF.A.1-1', correctness='incorrect')
    save_version(security_context, old_question_card(security_context))
    fallback_id = save_version(security_context, split_spec(security_context, weak=True), origin='original_example')
    composer = Composer(failure=True)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    response = start(client, upload)
    assert response.status_code == 503
    assert response.json()['error']['code'] == 'activity_unavailable'
    assert len(composer.calls) == 2
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 0
        assert connection.execute('SELECT verified FROM activity_versions WHERE id=?', (fallback_id,)).fetchone()[0] == 1


def test_question_only_generation_and_fallback_cannot_replace_the_mechanic(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child, '4.NF.A.1-1')
    old = old_question_card(security_context)
    save_version(security_context, old)
    composer = Composer(old)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    response = start(client, upload)
    assert response.status_code == 503 and response.json()['error']['code'] == 'activity_unavailable'
    assert [call[0] for call in composer.calls] == ['compose_activity', 'compose_activity']
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT count(*) FROM activity_sessions').fetchone()[0] == 0


def submit(client, session, response):
    return mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/submit",
                  json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid(), response=response))


def advance(client, session):
    response = mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/next",
                      json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid()))
    assert response.status_code == 200
    return response.json()


def test_equal_split_action_and_independent_form_are_saved_in_parent_history(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child, '4.NF.A.1-1', correctness='correct')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer(split_spec(security_context)))
    with security_context.db.transaction() as connection:
        before = _homework_state(connection, child['id'], '4.NF.A.1-1')
    session = start(client, upload).json()
    assert submit(client, session, {'splitFactor': 5}).status_code == 400
    wrong = submit(client, session, {'splitFactor': 2})
    assert wrong.status_code == 200 and wrong.json()['feedback']['correct'] is False
    right = submit(client, session, {'splitFactor': 3})
    assert right.status_code == 200 and right.json()['feedback']['correct'] is True
    session = advance(client, right.json())
    session = advance(client, submit(client, session, {'splitFactor': 2}).json())
    assert session['currentScene']['component'] == 'independent_response'
    assert session['currentScene']['params'] == {'context': None}
    assert session['hint'] is None
    final = submit(client, session, ' 6 / 8 ')
    assert final.status_code == 200 and final.json()['finalResult']['correct'] is True
    assert final.json()['finalResult']['response'] == ' 6 / 8 '
    with security_context.db.transaction() as connection:
        responses = [row[0] for row in connection.execute('SELECT response_text FROM activity_attempts WHERE session_id=? ORDER BY rowid', (session['id'],))]
        assert responses == ['2/4', '3/6', '4/6', ' 6 / 8 ']
        assert _homework_state(connection, child['id'], '4.NF.A.1-1') == before
    picker(client)
    unlock(client)
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult'] == final.json()['finalResult']


@pytest.mark.parametrize('response,correct', [('6/8', True), (' 6 / 8 ', True), ('3/4', False), ('0.75', False), ('12/16', False), ('6/12', False), ('5/8', False)])
def test_requested_denominator_is_graded_through_existing_server_flow(security_context, response, correct):
    seed_catalog(security_context.db)
    scene = ActivitySpec.model_validate(split_spec(security_context)).scenes[-1]
    text, result = service._grade(scene, response)
    assert text == response and result is correct


def test_prior_question_card_session_remains_readable_but_new_selection_uses_split(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child, '4.NF.A.1-1')
    old_id = save_version(security_context, old_question_card(security_context))
    old_session = uid()
    with security_context.db.transaction() as connection:
        connection.execute("INSERT INTO activity_sessions(id,kid_id,upload_id,activity_version_id,subskill_id,status,started_at) VALUES(?,?,?,?,'4.NF.A.1-1','in_progress',?)", (old_session, child['id'], upload, old_id, security_context.clock.now()))
    assert client.get(f'/api/activities/kid/sessions/{old_session}').status_code == 200
    assert start(client, upload).json()['id'] == old_session
    new_upload = mapped_upload(security_context, child, '4.NF.A.1-1')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer(split_spec(security_context)))
    created = start(client, new_upload)
    assert created.status_code == 200 and created.json()['id'] != old_session
    assert created.json()['currentScene']['component'] == 'fraction_split_compare'
    with security_context.db.transaction() as connection:
        target = get_subskill(connection, '4.NF.A.1-1')
        assert all(has_split_scene(spec) for _, spec in service._matches(connection, target, strong=False))


def test_uploaded_equivalent_amount_cannot_be_repeated_as_fresh_final(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child, '4.NF.A.1-1', question='Write 3/4 in eighths.')
    save_version(security_context, split_spec(security_context, weak=True), origin='original_example')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer(split_spec(security_context)))
    response = start(client, upload)
    assert response.status_code == 503
