"""Missing library activities are generated and independently reviewed for mapped skills."""
import copy
import asyncio
import json
import uuid

import pytest

from backend import main
from backend.activities import service
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


def mapped_upload(security, child, subskill='4.OA.A.2-1', *, correctness='ungraded', confidence=.99,
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


def generic_spec(subskill='4.OA.A.2-1'):
    def answer(value, comparison='number', alternatives=None):
        return dict(value=value, acceptedAnswers=alternatives or [], comparison=comparison)

    def scene(id, component, prompt, params, key, next_id, phase='guided'):
        return dict(id=id, component=component, prompt=prompt, params=params, answer=key, phase=phase,
                    nextSceneId=next_id, feedback=dict(correct='You used the idea carefully.', incorrect='Try the idea one step at a time.', hint='Look at the relationship in the example.'))

    ela = subskill == 'RI.4.2-1'
    if ela:
        scenes = [
            scene('notice', 'guided_choice', 'Which sentence states the main idea?',
                  dict(context='Rosa plants seeds. She waters the soil and pulls weeds. Soon her garden is full of flowers.',
                       teachingText='A main idea tells what the whole passage is mostly about.',
                       options=[dict(id='main', text='Rosa cares for a garden.'), dict(id='detail', text='Rosa pulls weeds.')]), answer('main', 'text'), 'build'),
            scene('build', 'guided_response', 'Complete the main idea: Daily walking helps people stay ___. Write one word.',
                  dict(context='Walking strengthens the heart. It can improve sleep and keep muscles active.',
                       teachingText='Combine important details to state the main idea in a few words.'), answer('healthy', 'text', ['fit']), 'own'),
            scene('own', 'independent_response', 'Complete the main idea: Bees help ___ grow. Write one word.',
                  dict(context='Bees visit flowers for nectar. Pollen travels on their bodies to other flowers. This helps plants make seeds.'), answer('plants', 'text', ['flowers']), None, 'independent'),
        ]
        subject, grade, tag = 'ela', 4, 'Picks a detail as main idea'
    else:
        ratio = subskill == '6.RP.A.2-1'
        scenes = [
            scene('notice', 'guided_choice', 'Which expression finds the number in each equal group?' if ratio else 'Which expression finds the total number of crayons?',
                  dict(context='There are 12 crayons shared equally among 3 boxes.' if ratio else 'There are 3 boxes with 4 crayons in each box.',
                       teachingText='A unit rate compares an amount to one unit.' if ratio else 'Multiplication finds the total in equal groups.',
                       options=[dict(id='product', text='12 ÷ 3' if ratio else '3 × 4'), dict(id='sum', text='12 + 3' if ratio else '3 + 4')]), answer('product', 'text'), 'build'),
            scene('build', 'guided_response', 'How many cups are used per scoop? Write a number.' if ratio else 'Mina has 5 stamps. Jo has 3 times as many stamps. How many stamps does Jo have?',
                  dict(context='A mixture uses 20 cups of water for 4 scoops of powder.' if ratio else None,
                       teachingText='Divide the total amount by the number of equal units.' if ratio else 'Multiply the first count by the number of times as many.'), answer('5' if ratio else '15'), 'own'),
            scene('own', 'independent_response', 'How many miles are traveled per hour? Write a number.' if ratio else 'A class has 6 red counters. It has 4 times as many blue counters. How many blue counters are there?',
                  dict(context='A cyclist travels 30 miles in 5 hours at the same speed.' if ratio else None), answer('6' if ratio else '24'), None, 'independent'),
        ]
        subject, grade, tag = 'math', 6 if ratio else 4, 'Divides in the wrong order (b/a)' if ratio else 'Adds the numbers'
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
            return {'approved': self.approved, 'reason': 'approved' if self.approved else 'incorrect_answer'}
        return copy.deepcopy(self.spec)


def start(client, upload, key=None):
    return mutate(client, 'POST', '/api/activities/kid/start', json={'uploadId': upload, 'idempotencyKey': key or uid()})


def test_legacy_generation_cannot_accept_a_generic_spec_without_independent_review(family, security_context):
    with security_context.db.transaction() as connection:
        target = get_subskill(connection, '3.NF.A.1-2')
    spec = generic_spec()
    spec.update(subskillId=target['subskill_id'], grade=3,
                misconceptionTags=[target['common_misconception']])
    composer = Composer(spec)
    with pytest.raises(ValueError, match='not aligned'):
        asyncio.run(service._generate(composer, target, [], [], 0))
    assert [call[0] for call in composer.calls] == ['compose_activity']


def finish(client, session, final):
    for response in [{'choiceId': 'main' if session['subject'] == 'ela' else 'product'}, 'fit' if session['subject'] == 'ela' else '5' if session['targetSkill']['id'].startswith('6.') else '15', final]:
        scene = session['currentScene']
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
    ('4.OA.A.2-1', 'correct', '24.00'), ('6.RP.A.2-1', 'ungraded', '12/2'),
    ('RI.4.2-1', 'correct', '  PLANTS  '),
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
    assert session['origin'] == 'model_generated' and session['currentScene']['component'] == 'guided_choice'
    assert [call[0] for call in composer.calls] == ['compose_activity', 'review_activity']
    serialized = json.dumps(composer.calls)
    assert 'Private original question' not in serialized and child['id'] not in serialized and child['firstName'] not in serialized
    public = json.dumps(session)
    assert 'acceptedAnswers' not in public and 'comparison' not in public and 'nextSceneId' not in public
    assert start(client, upload, key).json() == session
    assert len(composer.calls) == 2
    result = finish(client, session, final)
    assert result['status'] == 'completed' and result['finalResult']['correct'] is True
    assert result['finalResult']['response'] == final
    if subskill.startswith('RI.'):
        assert 'Bees visit flowers' in result['finalResult']['question']
    picker(client)
    unlock(client)
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult'] == result['finalResult']
    with security_context.db.transaction() as conn:
        assert _homework_state(conn, child['id'], subskill) == before
        version = conn.execute("SELECT grade,verified,prompt_version FROM activity_versions WHERE origin='model_generated'").fetchone()
        assert version['grade'] == (6 if subskill.startswith('6.') else 4) and version['verified'] == 1
        assert version['prompt_version'] == 'sidekick-activity-v3'


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
