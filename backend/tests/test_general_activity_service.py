"""Missing library activities are generated and independently reviewed for mapped skills."""
import copy
import asyncio
import json
import uuid

import pytest

from backend import main
from backend.activities import service
from backend.activities.models import PROMPT_VERSION
from backend.activities.library import seed_library
from backend.gap.catalog import get_subskill, seed_catalog
from backend.gap.service import _homework_state, record_homework_evidence
from backend.tests.account_helpers import create_child, mutate, picker, select_child, unlock


def uid():
    return uuid.uuid4().hex


@pytest.fixture
def family(parent_client, security_context, monkeypatch):
    seed_catalog(security_context.db)
    seed_library(security_context.db)
    child = create_child(parent_client, grade='4').json()
    select_child(parent_client, child['id'])
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', False)
    return child, parent_client


def mapped_upload(security, child, subskill='1.NBT.B.2-1', *, correctness='ungraded', confidence=.99,
                  question='Private original question must never enter generation.', uncertain=False, conflict=False):
    upload, problem = uid(), uid()
    now = security.clock.now()
    with security.db.transaction() as conn:
        conn.execute("INSERT INTO homework_uploads(id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at) VALUES(?,?,?,'opaque','image/png','[]','fixture','completed','completed',?,?)", (upload, child['id'], uid(), now, now))
        conn.execute("INSERT INTO homework_problems(id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,fingerprint,mapping_json,grading_json,teacher_conflict,created_at) VALUES(?,?,?,1,0,'1',?,'[]',?,?,?,?,?)",
                     (problem, upload, child['id'], json.dumps({'question': {'text': question, 'uncertain': uncertain}}), uid(),
                      json.dumps({'subskill_id': subskill, 'confidence': confidence, 'explanation': 'Synthetic skill mapping.'}),
                      json.dumps({'correctness': correctness, 'confidence': 0 if correctness == 'ungraded' else .99}), int(conflict), now))
    record_homework_evidence(security, child['id'], problem, subskill, correctness,
                             correctness != 'ungraded' and not conflict,
                             0 if correctness == 'ungraded' else confidence, question=question, fingerprint=uid())
    return upload


def generic_spec(subskill='1.NBT.B.2-1'):
    def answer(value, comparison='number', alternatives=None):
        return dict(value=value, acceptedAnswers=alternatives or [], comparison=comparison)

    def scene(id, component, prompt, params, key, next_id, phase='guided'):
        return dict(id=id, component=component, prompt=prompt, params=params, answer=key, phase=phase,
                    nextSceneId=next_id, feedback=dict(correct='You used the idea carefully.', incorrect='Try the idea one step at a time.', hint='Look at the relationship in the example.'))

    if subskill == 'RI.3.1-1':
        scenes = [
            scene('notice', 'evidence_board', 'Which sentence shows where Rosa planted the seeds?',
                  dict(context=None, teachingText='Move the sentence that directly tells the place onto the clue board.',
                       goal='Help the garden detective prove where the seeds were planted.', boardLabel='Garden clue',
                       sentences=[dict(id='place', text='Rosa planted seeds beside her home.'), dict(id='water', text='She watered them every day.')]),
                  dict(sentenceId='place', explanation='Beside her home directly tells where Rosa planted the seeds.'), 'build'),
            scene('build', 'guided_response', 'Where did Theo read? Write the place named in the passage.',
                  dict(context='Theo read at the library. He found a book about birds.',
                       teachingText='The words after at the tell you the place.'), answer('library', 'text', ['the library']), 'own'),
            scene('own', 'independent_response', 'Where did Ana play? Write the place named in the passage.',
                  dict(context='Ana played basketball at the park. She wore her new shoes.'), answer('park', 'text', ['the park']), None, 'independent'),
        ]
        subject, grade, tag = 'ela', 3, 'Answers from memory'
    elif subskill == 'RI.3.3-1':
        scenes = [
            scene('notice', 'tile_order', 'Arrange the repair steps so the kite is ready to fly.',
                  dict(context=None, teachingText='An earlier step makes the next step possible.', goal='Rebuild the kite repair story.', ordering='story',
                       tiles=[dict(id='fly', text='The repaired kite flew.'), dict(id='tear', text='The wind tore the kite.'), dict(id='fix', text='Jo taped the tear closed.')]),
                  dict(order=['tear', 'fix', 'fly']), 'build'),
            scene('build', 'guided_response', 'What did Sam do before filling the cup?',
                  dict(context='Sam washed a dusty cup. Then he filled it with water.', teachingText='The first action prepared the cup for the next action.'),
                  answer('washed it', 'text', ['washed the cup']), 'own'),
            scene('own', 'independent_response', 'What did Priya plant after digging a hole?',
                  dict(context='Priya dug a hole. She planted a seed in the hole. A sprout grew later.'), answer('seed', 'text', ['a seed']), None, 'independent'),
        ]
        subject, grade, tag = 'ela', 3, 'Reverses cause and effect'
    else:
        scenes = [
            scene('notice', 'bundle_builder', 'Pack every full crate of ten apples.',
                  dict(context='Help the orchard pack a shipment.', teachingText='Trade ten loose apples for one crate of ten. The total number stays the same.',
                       goal='Pack every full crate, leaving fewer than ten apples loose.', itemLabel='apples', groupLabel='crates', total=24, groupSize=10),
                  dict(bundles=2), 'build'),
            scene('build', 'guided_response', 'There are 3 tens and 7 ones. How many ones are loose?',
                  dict(context=None, teachingText='Every full group of ten is one ten; the objects left over are ones.'), answer('7'), 'own'),
            scene('own', 'independent_response', 'How many full tens are in 43 ones?',
                  dict(context=None), answer('4'), None, 'independent'),
        ]
        subject, grade, tag = 'math', 1, 'Does not trade 10 ones for a ten'
    return dict(schemaVersion='1.1', title='Discover the Idea', subject=subject, subskillId=subskill,
                grade=grade, misconceptionTags=[tag], sourceRefs=[], scenes=scenes)


class Composer:
    model = 'synthetic-general-composer'

    def __init__(self, spec=None, *, approved=True, failure=False, callback=None):
        self.spec = spec or generic_spec()
        self.approved, self.failure, self.callback = approved, failure, callback
        self.calls = []

    async def _call(self, schema, task, instruction, data):
        self.calls.append((task, instruction, copy.deepcopy(data)))
        if self.failure:
            raise RuntimeError('Private provider error must never enter a log.')
        if task == 'review_activity':
            if self.callback:
                self.callback()
            verdict = {'approved': self.approved, 'reason': 'approved' if self.approved else 'incorrect_answer'}
            if 'demonstratesTarget' in schema.model_fields:
                verdict.update(demonstratesTarget=True, interactionNecessary=self.approved,
                    goalAchievable=True, scoringAligned=True, materialsPresent=True, independentFresh=True)
            return verdict
        result = copy.deepcopy(self.spec)
        if result.get('schemaVersion') in {'1.1', '1.2'}:
            result['schemaVersion'] = '1.3'
        return result


def start(client, upload, key=None):
    return mutate(client, 'POST', '/api/activities/kid/start', json={'uploadId': upload, 'idempotencyKey': key or uid()})


def test_legacy_generation_cannot_accept_a_generic_spec_without_independent_review(family, security_context):
    with security_context.db.transaction() as connection:
        target = get_subskill(connection, '3.NF.A.1-2')
    spec = generic_spec()
    spec.update(subskillId=target['subskill_id'], grade=3,
                misconceptionTags=[target['common_misconception']])
    composer = Composer(spec)
    with pytest.raises(ValueError, match='missing_target_action'):
        asyncio.run(service._generate(composer, target, [], [], 0))
    assert [call[0] for call in composer.calls] == ['compose_activity', 'compose_activity']


def finish(client, session, final):
    subskill = session['targetSkill']['id']
    actions = {'1.NBT.B.2-1': [{'bundles': 2}, '7'], 'RI.3.1-1': [{'sentenceId': 'place'}, 'library'],
               'RI.3.3-1': [{'order': ['tear', 'fix', 'fly']}, 'washed it']}
    for response in [*actions[subskill], final]:
        scene = session['currentScene']
        if scene['phase'] == 'independent':
            assert scene['params'].get('teachingText') is None
            assert session['hint'] is None and session['feedback'] is None
            assert 'answer' not in scene and 'feedback' not in scene
            private_hint = mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/hint", json={'sceneId': scene['id']})
            assert private_hint.status_code == 409 and private_hint.json()['error']['code'] == 'hint_unavailable'
        submitted = mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/submit",
                           json={'sceneId': scene['id'], 'idempotencyKey': uid(), 'response': response})
        assert submitted.status_code == 200, submitted.text
        session = submitted.json()
        if scene['phase'] == 'guided':
            advanced = mutate(client, 'POST', f"/api/activities/kid/sessions/{session['id']}/next",
                              json={'sceneId': scene['id'], 'idempotencyKey': uid()})
            assert advanced.status_code == 200
            session = advanced.json()
    return session


@pytest.mark.parametrize('subskill,correctness,final', [
    ('1.NBT.B.2-1', 'correct', '4.00'), ('1.NBT.B.2-1', 'ungraded', '8/2'),
    ('RI.3.1-1', 'correct', '  PARK  '), ('RI.3.3-1', 'correct', 'a seed'),
])
def test_no_matching_library_activity_generates_reviews_plays_and_keeps_learning_state(family, security_context, monkeypatch, subskill, correctness, final):
    child, client = family
    upload = mapped_upload(security_context, child, subskill, correctness=correctness)
    with security_context.db.transaction() as conn:
        before = _homework_state(conn, child['id'], subskill)
    suggested = client.get('/api/activities/kid/suggestion', params={'uploadId': upload}).json()
    assert suggested['available'] and suggested['targetSkill']['id'] == subskill
    composer = Composer(generic_spec(subskill))
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    key = uid()
    response = start(client, upload, key)
    assert response.status_code == 200, response.text
    session = response.json()
    assert session['origin'] == 'model_generated' and session['currentScene']['component'] in {'bundle_builder', 'tile_order', 'evidence_board'}
    assert [call[0] for call in composer.calls] == ['compose_activity', 'review_activity']
    assert session['currentScene']['component'] in composer.calls[0][2]['availableMechanics']
    assert set(composer.calls[0][2]['availableMechanics']) == set(composer.calls[0][2]['coveragePath']['mechanics'])
    goal = composer.calls[0][2]['learningGoal']
    assert goal['intent'] == ('reinforce_correct_work' if correctness == 'correct' else 'explore_skill')
    assert goal['supportedObservation'] == ({'kind': 'correct_response'} if correctness == 'correct' else None)
    serialized = json.dumps(composer.calls)
    assert 'Private original question' not in serialized and child['id'] not in serialized and child['firstName'] not in serialized
    public = json.dumps(session)
    assert 'acceptedAnswers' not in public and 'comparison' not in public and 'nextSceneId' not in public
    assert start(client, upload, key).json() == session
    assert len(composer.calls) == 2
    result = finish(client, session, final)
    assert result['status'] == 'completed' and result['finalResult']['correct'] is True
    assert result['finalResult']['response'] == final
    if subskill == 'RI.3.1-1':
        assert 'Ana played basketball' in result['finalResult']['question']
    picker(client)
    unlock(client)
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult'] == result['finalResult']
    with security_context.db.transaction() as conn:
        assert _homework_state(conn, child['id'], subskill) == before
        version = conn.execute("SELECT grade,verified,prompt_version FROM activity_versions WHERE origin='model_generated'").fetchone()
        assert version['grade'] == (1 if subskill.startswith('1.') else 3) and version['verified'] == 1
        assert version['prompt_version'] == PROMPT_VERSION


@pytest.mark.parametrize('failure', ['rejected', 'provider', 'freshness'])
def test_rejected_unavailable_or_repeated_generation_never_stores_unverified_content(family, security_context, monkeypatch, failure):
    child, client = family
    spec = generic_spec()
    upload = mapped_upload(security_context, child, question=spec['scenes'][-1]['prompt'] if failure == 'freshness' else 'Private original question.')
    composer = Composer(spec, approved=failure != 'rejected', failure=failure == 'provider')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    key = uid()
    response = start(client, upload, key)
    assert response.status_code == 503 and response.json()['error']['code'] == 'activity_unavailable'
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE origin='model_generated'").fetchone()[0] == 0
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 0
        request = conn.execute('SELECT lease_token,lease_until FROM activity_start_requests WHERE request_key=?', (key,)).fetchone()
        assert request['lease_token'] is None and request['lease_until'] is None
        assert not any('Private provider' in row[0] for row in conn.execute('SELECT explanation FROM model_audits'))


@pytest.mark.parametrize('confidence,uncertain,conflict', [(.2, False, False), (.99, True, False), (.99, False, True)])
def test_only_reliable_readable_mapping_can_select_a_generated_activity(family, security_context, confidence, uncertain, conflict):
    child, client = family
    upload = mapped_upload(security_context, child, confidence=confidence, uncertain=uncertain, conflict=conflict)
    assert not client.get('/api/activities/kid/suggestion', params={'uploadId': upload}).json()['available']
    assert start(client, upload).status_code == 409


def test_profile_change_during_independent_review_cannot_store_an_activity(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child)
    composer = Composer(callback=lambda: picker(client))
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    response = start(client, upload)
    assert response.status_code == 403
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE origin='model_generated'").fetchone()[0] == 0


def test_generation_also_works_without_seeded_activity_examples(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child)
    with security_context.db.transaction() as conn:
        conn.execute('DELETE FROM activity_versions')
        conn.execute('DELETE FROM activity_sources')
        conn.execute('DELETE FROM activity_library_revisions')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer())
    assert start(client, upload).status_code == 200


def test_stored_legacy_component_versions_remain_reusable(family, security_context):
    child, client = family
    upload = mapped_upload(security_context, child, '3.NF.A.1-2', correctness='correct')
    with security_context.db.transaction() as conn:
        conn.execute("UPDATE activity_versions SET component_version='sidekick-interactions-v1'")
    response = start(client, upload)
    assert response.status_code == 200 and response.json()['origin'] == 'original_example'


def test_new_child_gets_on_demand_composition_even_when_a_verified_definition_exists(family, security_context, monkeypatch):
    child, client = family
    composer = Composer()
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    generated = start(client, mapped_upload(security_context, child))
    assert generated.status_code == 200
    assert [call[0] for call in composer.calls] == ['compose_activity', 'review_activity']
    with security_context.db.transaction() as conn:
        version = conn.execute("SELECT v.id,v.verified,v.origin FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=?", (generated.json()['id'],)).fetchone()
        assert version['verified'] == 1 and version['origin'] == 'model_generated'
    assert picker(client).status_code == 200
    assert unlock(client).status_code == 200
    second_child = create_child(client, name='Robin', grade='1').json()
    assert select_child(client, second_child['id']).status_code == 200
    fresh_spec = generic_spec()
    fresh_spec['title'] = 'An Original Orchard Mission'
    fresh_provider = Composer(fresh_spec)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', fresh_provider)
    composed = start(client, mapped_upload(security_context, second_child))
    assert composed.status_code == 200
    assert composed.json()['origin'] == 'model_generated'
    assert [call[0] for call in fresh_provider.calls] == ['compose_activity', 'review_activity']
    with security_context.db.transaction() as conn:
        fresh_version = conn.execute('SELECT activity_version_id FROM activity_sessions WHERE id=?', (composed.json()['id'],)).fetchone()[0]
        assert fresh_version != version['id']
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE origin='model_generated'").fetchone()[0] == 2


def test_failed_live_composition_does_not_silently_substitute_a_finished_library_activity(family, security_context, monkeypatch, tmp_path):
    from backend.activities.library import source_id
    child, client = family
    # The trusted original has the same catalog objective and interaction, with
    # a broad focus tag. It is a weak fallback, not an unverified model proposal.
    spec = generic_spec()
    spec['misconceptionTags'] = ['Ten ones form one ten']
    spec['sourceRefs'] = [source_id('https://ies.ed.gov/ncee/wwc/practiceguide/26')]
    manifest = tmp_path / 'verified-bundles.json'
    manifest.write_text(json.dumps(dict(schemaVersion='1.0', activities=[dict(
        id='verified-bundles-fallback', origin='original_example', spec=spec)])))
    imported = seed_library(security_context.db, activities_path=manifest)
    assert imported['originalExamplesImported'] == 1 and imported['issues'] == []
    with security_context.db.transaction() as conn:
        target = get_subskill(conn, '1.NBT.B.2-1')
        assert service._matches(conn, target) == []
        assert len(service._matches(conn, target, strong=False)) == 1
    unavailable_provider = Composer(failure=True)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', unavailable_provider)
    fallback = start(client, mapped_upload(security_context, child))
    assert fallback.status_code == 503
    assert fallback.json()['error']['code'] == 'activity_unavailable'
    assert [call[0] for call in unavailable_provider.calls] == ['compose_activity', 'compose_activity']
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 0
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE origin='model_generated'").fetchone()[0] == 0


@pytest.mark.parametrize('subskill', ['6.RP.A.2-1'])
def test_objective_without_a_suitable_control_is_unavailable_without_provider_call(family, security_context, monkeypatch, subskill):
    child, client = family
    upload = mapped_upload(security_context, child, subskill)
    composer = Composer()
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    suggestion = client.get('/api/activities/kid/suggestion', params={'uploadId': upload}).json()
    assert suggestion['available'] is False
    assert suggestion['reason'] == 'no_suitable_mechanic'
    assert suggestion['targetSkill']['id'] == subskill
    result = start(client, upload)
    assert result.status_code == 409 and result.json()['error']['code'] == 'no_suitable_mechanic'
    assert composer.calls == []


def test_saved_question_cards_cannot_preempt_or_fallback_for_a_playable_activity(family, security_context, monkeypatch):
    from backend.tests.test_general_activity_models import general_activity
    from backend.activities.library import content_hash
    from backend.activities.models import COMPONENT_VERSION
    child, client = family
    upload = mapped_upload(security_context, child)
    card = general_activity()
    card.update(subskillId='1.NBT.B.2-1', grade=1, misconceptionTags=['Does not trade 10 ones for a ten'])
    with security_context.db.transaction() as conn:
        revision = conn.execute('SELECT id FROM activity_library_revisions LIMIT 1').fetchone()[0]
        conn.execute("""INSERT INTO activity_versions(id,activity_id,version,spec_json,spec_sha256,
            subskill_id,subject,grade,misconception_tags_json,origin,verified,source_revision,
            model,prompt_version,component_version,created_at)
            VALUES('old-cards','old-cards',1,?,?,'1.NBT.B.2-1','math',1,?,'model_generated',1,?,'old-model','old-prompt',?,1)""",
            (json.dumps(card), content_hash(card), json.dumps(card['misconceptionTags']), revision, COMPONENT_VERSION))
        target = get_subskill(conn, '1.NBT.B.2-1')
        assert not service._matches(conn, target)
        assert not service._matches(conn, target, strong=False)
    # Both matching and provider-failure fallback reject stored question cards.
    assert start(client, upload).status_code == 503
    composer = Composer()
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', composer)
    result = start(client, upload)
    assert result.status_code == 200 and result.json()['currentScene']['component'] == 'bundle_builder'
    with security_context.db.transaction() as conn:
        matches = service._matches(conn, target)
        assert len(matches) == 1 and matches[0][0]['id'] != 'old-cards'


@pytest.mark.parametrize('subskill,response,expected,correct', [
    ('1.NBT.B.2-1', {'bundles': 4}, '4 groups of 10, 3 loose', True),
    ('1.NBT.B.2-1', {'bundles': 3}, '3 groups of 10, 13 loose', False),
    ('RI.3.1-1', {'sentenceId': 'keys'}, 'Hana found her keys under the bench.', True),
    ('RI.3.3-1', {'order': ['wet', 'dry', 'wear']}, 'Rain soaked the coat. → The coat dried by the fire. → Ari put on the dry coat.', True),
])
def test_independent_control_is_graded_server_side_and_saved_in_protected_history(family, security_context, monkeypatch, subskill, response, expected, correct):
    child, client = family
    upload = mapped_upload(security_context, child, subskill)
    with security_context.db.transaction() as conn:
        learning_state = _homework_state(conn, child['id'], subskill)
    spec = generic_spec(subskill)
    final = spec['scenes'][-1]
    if subskill == '1.NBT.B.2-1':
        final.update(component='bundle_builder', prompt='Pack all full crates for the new orchard shipment.',
                     params=dict(context=None, teachingText=None, goal='Pack every full crate of ten.', itemLabel='pears', groupLabel='crates', total=43, groupSize=10),
                     answer=dict(bundles=4))
    elif subskill == 'RI.3.1-1':
        final.update(component='evidence_board', prompt='Find the sentence that proves where Hana found her keys.',
                     params=dict(context=None, teachingText=None, goal='Resolve the lost-key mystery.', boardLabel='Key clue',
                                 sentences=[dict(id='keys', text='Hana found her keys under the bench.'), dict(id='wind', text='Wind rustled the trees.')]),
                     answer=dict(sentenceId='keys', explanation='Under the bench directly tells where the keys were.'))
    else:
        final.update(component='tile_order', prompt='Arrange what happened to the coat in order.',
                     params=dict(context=None, teachingText=None, goal='Rebuild Ari’s coat story.', ordering='story',
                                 tiles=[dict(id='wear', text='Ari put on the dry coat.'), dict(id='wet', text='Rain soaked the coat.'), dict(id='dry', text='The coat dried by the fire.')]),
                     answer=dict(order=['wet', 'dry', 'wear']))
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer(spec))
    started = start(client, upload)
    assert started.status_code == 200, started.text
    completed = finish(client, started.json(), response)
    assert completed['finalResult']['correct'] is correct
    assert completed['finalResult']['response'] == expected
    assert 'explanation' not in json.dumps(completed)
    picker(client)
    assert client.get(f"/api/activities/parent/{child['id']}/history").status_code == 403
    unlock(client)
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult'] == completed['finalResult']
    with security_context.db.transaction() as conn:
        assert _homework_state(conn, child['id'], subskill) == learning_state
