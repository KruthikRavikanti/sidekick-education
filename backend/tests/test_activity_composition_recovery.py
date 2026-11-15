"""On-demand composition repairs one scene without replacing a child's lesson."""
import asyncio
import copy
import json

import pytest

from backend import main
from backend.activities import general, service
from backend.activities.recovery import diagnostic
from backend.gap.catalog import get_subskill
from backend.provider import ExtractionError
from backend.tests.account_helpers import mutate, picker, select_child, unlock
from backend.tests.test_general_activity_service import (
    Composer, family, finish, generic_spec, mapped_upload, start, uid,
)


class RepairComposer(Composer):
    def __init__(self, *, provider_failure=False, repair_failure=False, review_failure=False, review_issue=None):
        super().__init__()
        self.provider_failure = provider_failure
        self.repair_failure = repair_failure
        self.review_failure = review_failure
        self.review_issue = review_issue
        self.reviews = 0

    async def _call(self, schema, task, instruction, data):
        self.calls.append((task, instruction, copy.deepcopy(data)))
        if task == 'compose_activity':
            if self.provider_failure and data['compositionMode'] == 'original':
                raise ExtractionError('provider_timeout', 'PRIVATE PROVIDER BODY', 504)
            spec = generic_spec()
            spec['schemaVersion'] = '1.3'
            if data['compositionMode'] == 'original' and not self.review_failure:
                spec['scenes'][0]['params']['groupSize'] = 9
            if data['compositionMode'] == 'simpler':
                spec['title'] = 'A Simpler Original Packing Mission'
            return spec
        if task == 'repair_activity_scene':
            if self.repair_failure:
                raise RuntimeError('PRIVATE PROVIDER BODY')
            scene = copy.deepcopy(generic_spec()['scenes'][data['sceneIndex']])
            if self.review_failure:
                scene['prompt'] = 'Pack every complete crate using the loose orchard apples.'
            return dict(scene=scene)
        if task == 'review_activity':
            self.reviews += 1
            approved = not self.review_failure or self.reviews > 1
            return dict(approved=approved, reason='approved' if approved else 'unsuitable_task',
                demonstratesTarget=True, interactionNecessary=approved, goalAchievable=True,
                scoringAligned=True, materialsPresent=True, independentFresh=True,
                failedSceneIds=[] if approved else ['notice'],
                sceneIssues=[] if approved or self.review_issue is None else [dict(sceneId='notice', code=self.review_issue)])
        raise AssertionError(task)


def target(security):
    with security.db.transaction() as conn:
        return get_subskill(conn, '1.NBT.B.2-1')


def compose(security, adapter, events):
    return asyncio.run(general.compose(adapter, target(security), [], [], 0,
        on_event=events.append))


def test_invalid_scene_is_repaired_and_other_scenes_are_preserved(family, security_context):
    adapter, events = RepairComposer(), []
    spec = compose(security_context, adapter, events)
    assert [call[0] for call in adapter.calls] == ['compose_activity', 'repair_activity_scene', 'review_activity']
    repair = adapter.calls[1][2]
    assert repair['sceneIndex'] == 0 and repair['failure']['category'] == 'schema'
    assert repair['unchangedScenes'] == generic_spec()['scenes'][1:]
    assert spec.scenes[0].params.groupSize == 10
    for actual, original in zip(spec.scenes[1:], generic_spec()['scenes'][1:]):
        for key, value in original.items():
            assert actual.model_dump()[key] == value
    assert any(event['code'] == 'scene_repaired' for event in events)
    assert all('PRIVATE' not in json.dumps(event) for event in events)


def test_review_failure_identifies_and_repairs_only_its_scene(family, security_context):
    adapter, events = RepairComposer(review_failure=True), []
    spec = compose(security_context, adapter, events)
    assert [call[0] for call in adapter.calls] == ['compose_activity', 'review_activity', 'repair_activity_scene', 'review_activity']
    repair = adapter.calls[2][2]
    assert repair['failure']['code'] == 'review_unsuitable_task' and repair['sceneIndex'] == 0
    assert repair['unchangedScenes'] == generic_spec()['scenes'][1:]
    assert spec.scenes[0].prompt.startswith('Pack every complete crate')


def test_review_issue_supplies_a_specific_server_authored_repair_constraint(family, security_context):
    adapter, events = RepairComposer(review_failure=True, review_issue='teaching_state_mismatch'), []
    compose(security_context, adapter, events)
    repair = next(call[2] for call in adapter.calls if call[0] == 'repair_activity_scene')
    assert repair['failure']['code'] == 'review_teaching_state_mismatch'
    assert repair['sceneIndex'] == 0
    assert 'dynamic links must not assert placeholder dimensions' in repair['failure']['constraint']
    assert any(event['code'] == 'review_teaching_state_mismatch' for event in events)


@pytest.mark.parametrize('failure', ['provider', 'repair'])
def test_recovery_tries_a_simpler_composition_for_the_same_demonstration(family, security_context, failure):
    adapter = RepairComposer(provider_failure=failure == 'provider', repair_failure=failure == 'repair')
    events = []
    spec = compose(security_context, adapter, events)
    proposals = [call[2] for call in adapter.calls if call[0] == 'compose_activity']
    assert [item['compositionMode'] for item in proposals] == ['original', 'simpler']
    assert proposals[0]['subskillId'] == proposals[1]['subskillId'] == '1.NBT.B.2-1'
    assert proposals[0]['coveragePath'] == proposals[1]['coveragePath']
    assert spec.title == 'A Simpler Original Packing Mission'
    assert spec.scenes[-1].phase == 'independent'
    assert any(event['code'] == 'composition_recovered' for event in events)
    assert 'PRIVATE PROVIDER BODY' not in json.dumps(events)


def test_safe_diagnostics_are_persisted_on_failure_without_provider_text(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child)

    class Offline(Composer):
        async def _call(self, schema, task, instruction, data):
            raise ExtractionError('provider_timeout', 'PRIVATE PROVIDER BODY', 504)

    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Offline())
    result = start(client, upload)
    assert result.status_code == 503
    with security_context.db.transaction() as conn:
        events = [dict(row) for row in conn.execute("SELECT outcome,explanation FROM model_audits WHERE task='compose_activity_stage'")]
        assert len(events) == 2
        assert all(event['outcome'] == 'provider_timeout' for event in events)
        assert all(json.loads(event['explanation'])['category'] == 'provider' for event in events)
        assert 'PRIVATE' not in json.dumps(events)
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 0


def test_long_server_repair_constraint_stays_in_memory_and_audits_remain_valid_json(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child)
    async def unavailable(*args, on_event=None, **kwargs):
        on_event(dict(category='schema', code='schema_scene_invalid', sceneIndex=1, field='connection',
            mode='original', action='validation_failed', constraint='A server-authored correction. ' * 100))
        raise ValueError('Do not persist draft content.')
    monkeypatch.setattr(service, '_generate', unavailable)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer())
    result = start(client, upload)
    assert result.status_code == 503
    with security_context.db.transaction() as conn:
        event = conn.execute("SELECT explanation FROM model_audits WHERE task='compose_activity_stage'").fetchone()[0]
    parsed = json.loads(event)
    assert parsed['code'] == 'schema_scene_invalid' and parsed['sceneIndex'] == 1
    assert 'constraint' not in parsed and len(event) < 500
    assert 'server-authored correction' not in event


def test_resume_reuses_exact_composition_but_next_upload_composes_with_prior_actions(family, security_context, monkeypatch):
    child, client = family
    adapter = Composer()
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', adapter)
    upload = mapped_upload(security_context, child)
    first = start(client, upload).json()
    assert len(adapter.calls) == 2
    assert start(client, upload).json()['id'] == first['id']
    assert client.get(f"/api/activities/kid/sessions/{first['id']}").json()['id'] == first['id']
    assert len(adapter.calls) == 2
    finish(client, first, '4')
    next_spec = generic_spec()
    next_spec['scenes'][-1]['prompt'] = 'How many full tens are in 52 ones?'
    next_spec['scenes'][-1]['answer']['value'] = '5'
    next_adapter = Composer(next_spec)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', next_adapter)
    second = start(client, mapped_upload(security_context, child))
    assert second.status_code == 200
    payload = next_adapter.calls[0][2]
    assert payload['previousInteractionSignatures'] == [[dict(component='bundle_builder', mode=None), dict(component='guided_response', mode=None)]]
    assert payload['learningGoal']['problemType'] == dict(family='place_value', responseForm='written_response')
    assert payload['componentToolkit'] and 'childActions' in payload['componentToolkit'][0]


def test_parent_can_review_exact_saved_scenes_and_actions_only_after_unlock(family, security_context, monkeypatch):
    child, client = family
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer())
    session = start(client, mapped_upload(security_context, child)).json()
    completed = finish(client, session, '4')
    url = f"/api/activities/parent/{child['id']}/sessions/{session['id']}"
    assert client.get(url).status_code == 403
    picker(client)
    assert client.get(url).status_code == 403
    unlock(client)
    result = client.get(url)
    assert result.status_code == 200, result.text
    attempt = result.json()
    assert attempt['id'] == session['id'] and len(attempt['definitionHash']) == 64
    assert len(attempt['scenes']) == 3
    assert [scene['responses'][0]['response'] for scene in attempt['scenes']] == [{'bundles': 2}, '7', '4']
    assert attempt['finalResult']['correct'] is True
    assert 'answer' not in attempt['scenes'][0]


def test_parent_can_view_in_progress_composition_before_a_link_has_source_state(family, security_context, monkeypatch):
    from backend.tests.test_composition_models import area_activity
    child, client = family
    definition = area_activity()
    definition['misconceptionTags'] = [get_area_tag(security_context)]
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', Composer(definition))
    session = start(client, mapped_upload(security_context, child, '3.MD.C.7-1')).json()
    picker(client)
    unlock(client)
    result = client.get(f"/api/activities/parent/{child['id']}/sessions/{session['id']}")
    assert result.status_code == 200, result.text
    scenes = result.json()['scenes']
    assert scenes[1]['connectionPending'] is True and scenes[1]['responses'] == []
    assert scenes[0]['connectionPending'] is False


def get_area_tag(security):
    with security.db.transaction() as conn:
        return get_subskill(conn, '3.MD.C.7-1')['common_misconception']


def test_repeated_area_action_is_rejected_with_a_scene_local_alternative(family, security_context):
    from backend.tests.test_composition_models import area_activity
    from backend.activities.recovery import CompositionFailure
    raw = area_activity()
    raw['misconceptionTags'] = [get_area_tag(security_context)]
    with security_context.db.transaction() as conn:
        area_target = get_subskill(conn, '3.MD.C.7-1')
    previous = [[dict(component='math_workspace', mode='area_tile'), dict(component='math_workspace', mode='area_expression')]]
    with pytest.raises(CompositionFailure) as caught:
        general._validate_candidate(raw, area_target, [], previous)
    safe = diagnostic(caught.value)
    assert safe['code'] == 'repeated_interaction' and safe['sceneIndex'] == 0
    assert 'area_design' in safe['constraint']
    designed = area_activity('area_design')
    designed['misconceptionTags'] = raw['misconceptionTags']
    assert general._validate_candidate(designed, area_target, [], previous).scenes[0].params.mode == 'area_design'


def test_diagnostic_rejects_arbitrary_adapter_locations_or_codes():
    error = ExtractionError('activity_schema_invalid', 'PRIVATE')
    error.diagnostic = dict(stage='schema', code='secret@example.com', field='PRIVATE / value', sceneIndex=100)
    safe = diagnostic(error)
    assert safe['category'] == 'schema' and safe['code'] == 'composition_failed'
    assert safe['field'] is None and safe['sceneIndex'] is None
    error.diagnostic = dict(stage='schema', code='schema_validation_failed', field='private_child_text', sceneIndex=0, constraint='PRIVATE CONTENT')
    safe = diagnostic(error)
    assert safe['field'] is None and safe['constraint'] is None


def test_schema_error_diagnostics_do_not_echo_arbitrary_extra_field_names():
    from backend.activities.models import BundleParams
    from pydantic import ValidationError
    params = generic_spec()['scenes'][0]['params']
    params['private_child_text'] = 'PRIVATE CONTENT'
    with pytest.raises(ValidationError) as caught:
        BundleParams.model_validate(params)
    safe = diagnostic(caught.value)
    assert safe['code'] == 'extra_forbidden'
    assert 'private_child_text' not in json.dumps(safe) and 'PRIVATE CONTENT' not in json.dumps(safe)


def test_scene_repair_derives_area_key_before_validating_the_provider_placeholder():
    from backend.tests.test_composition_models import area_activity
    from backend.activities.recovery import ActivitySceneRepair
    raw = area_activity()['scenes'][2]
    untouched = copy.deepcopy(raw)
    raw['answer'] = dict(assessment='automatic', expectedText='3 × 4 = 999', expectedMarks=[], mathRule=None)
    repaired = ActivitySceneRepair.model_validate(dict(scene=raw)).scene
    assert repaired.answer.expectedText == '3 × 4 = 12'
    assert repaired.answer.mathRule.result == '12'
    assert repaired.params.model_dump() == untouched['params']
    assert raw['answer']['expectedText'] == '3 × 4 = 999'


def test_review_rejection_requires_a_corresponding_failed_check():
    from pydantic import ValidationError
    verdict = dict(approved=False, reason='misaligned_skill', demonstratesTarget=True,
        interactionNecessary=True, goalAchievable=True, scoringAligned=True,
        materialsPresent=True, independentFresh=True, failedSceneIds=['opening'],
        sceneIssues=[dict(sceneId='opening', code='target_action_missing')])
    with pytest.raises(ValidationError, match='corresponding failed check'):
        general.CompositionActivityReview.model_validate(verdict)
    verdict['demonstratesTarget'] = False
    assert general.CompositionActivityReview.model_validate(verdict).approved is False
    verdict.update(reason='unsafe_content', demonstratesTarget=True,
                   sceneIssues=[dict(sceneId='opening', code='unsafe_content')])
    assert general.CompositionActivityReview.model_validate(verdict).approved is False


def test_writing_compose_revision_and_fresh_artifact_reach_exact_parent_history(family, security_context, monkeypatch):
    from backend.tests.test_family_activity_models import family_activity
    child, client = family
    raw = family_activity('text_editor')
    with security_context.db.transaction() as conn:
        writing_target = get_subskill(conn, 'W.3.3-1')
    raw.update(schemaVersion='1.3', subskillId='W.3.3-1',
        misconceptionTags=[writing_target['common_misconception']], title='The Lost Lantern Journal')
    for index, scene in enumerate(raw['scenes']):
        scene['params'].update(mode='edit' if index == 1 else 'compose', initialText='', minLength=5,
                              maxLength=1000, minWords=0, wordBank=[])
        scene['answer'] = dict(assessment='parent_review', rubric=[
            'Establishes an understandable situation and introduces a narrator or characters.',
            'Orders the short opening events naturally.'])
        scene['prompt'] = [
            'Write a story opening about a character discovering a lost lantern at the harbor.',
            'Revise your actual opening so the situation and character are clear and events follow naturally.',
            'Write a fresh opening about a different character finding an unexpected parcel in a snowy village.'][index]
        scene['params']['goal'] = 'Create an original story opening with a clear situation and character.'
        scene['params']['teachingText'] = 'Introduce who is there and what is happening, in an order a reader can follow.' if index < 2 else None
    raw['scenes'][1]['connection'] = dict(sourceSceneId='scene-0', sourceOutput='written_text', targetInput='draft_text')
    adapter = Composer(raw)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', adapter)
    opened = start(client, mapped_upload(security_context, child, 'W.3.3-1'))
    assert opened.status_code == 200, opened.text
    session = opened.json()
    original = 'Lena reached the harbor at dusk. She noticed a lost lantern beside a fishing boat.'
    revised = 'At dusk, Lena hurried to the quiet harbor to meet her aunt. Before reaching the boat, she noticed a lost lantern on the dock.'
    fresh = 'Snow covered the village when Omar opened his door. A small parcel sat on the step, so he called his sister to look.'
    base = f"/api/activities/kid/sessions/{session['id']}"
    submitted = mutate(client, 'POST', base + '/submit', json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid(), response=dict(writtenText=original)))
    assert submitted.status_code == 200
    assert submitted.json()['feedback']['correct'] is None
    advanced = mutate(client, 'POST', base + '/next', json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid()))
    assert advanced.status_code == 200, advanced.text
    session = advanced.json()
    assert session['currentScene']['params']['mode'] == 'edit'
    assert session['currentScene']['params']['initialText'] == original
    unchanged = mutate(client, 'POST', base + '/submit', json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid(), response=dict(writtenText=original)))
    assert unchanged.status_code == 400
    edited = mutate(client, 'POST', base + '/submit', json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid(), response=dict(writtenText=revised)))
    assert edited.status_code == 200 and edited.json()['feedback']['correct'] is None
    session = mutate(client, 'POST', base + '/next', json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid())).json()
    assert session['currentScene']['params']['teachingText'] is None
    completed = mutate(client, 'POST', base + '/submit', json=dict(sceneId=session['currentScene']['id'], idempotencyKey=uid(), response=dict(writtenText=fresh)))
    assert completed.status_code == 200, completed.text
    assert completed.json()['finalResult']['correct'] is None
    assert completed.json()['finalResult']['assessmentStatus'] == 'pending_parent_review'
    # The immutable authored placeholder remains blank; only the saved session
    # projection receives the real child's draft.
    with security_context.db.transaction() as conn:
        stored = json.loads(conn.execute('SELECT v.spec_json FROM activity_versions v JOIN activity_sessions s ON s.activity_version_id=v.id WHERE s.id=?', (session['id'],)).fetchone()[0])
        assert stored['scenes'][1]['params']['initialText'] == ''
    picker(client)
    unlock(client)
    exact = client.get(f"/api/activities/parent/{child['id']}/sessions/{session['id']}").json()
    assert exact['scenes'][1]['params']['initialText'] == original
    assert [scene['responses'][0]['response']['writtenText'] for scene in exact['scenes']] == [original, revised, fresh]
    review = mutate(client, 'POST', f"/api/activities/parent/{child['id']}/sessions/{session['id']}/review", json=dict(correct=True, note='The original opening establishes Omar and the situation in natural order.', parentObserved=True, idempotencyKey=uid()))
    assert review.status_code == 200 and review.json()['finalResult']['correct'] is True
    history = client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult']['response'] == fresh and history[0]['finalResult']['correct'] is True
    instruction = next(call[1] for call in adapter.calls if call[0] == 'review_activity')
    assert 'It NEVER applies to text_editor, oral_studio or' in instruction
    assert 'Actual composing and revising text IS a meaningful on-screen action' in instruction
    assert 'coveragePath.modes lists primary/default mode recommendations' in instruction
    assert 'the blank authored initialText is NOT missing material and NOT a' in instruction
    review_payload = next(call[2] for call in adapter.calls if call[0] == 'review_activity')
    assert review_payload['connectedSceneInputs'] == [dict(sceneId='scene-1', sourceSceneId='scene-0',
        sourceOutput='written_text', targetInput='draft_text', fromSavedSubmission=True,
        availableAt='runtime_after_source_submission', placeholderAllowed=True,
        placeholderField='params.initialText', generationTimeChildContentAvailable=False)]


@pytest.mark.parametrize('subskill,excluded,expected', [
    ('3.NF.A.1-2', {'fraction_builder', 'number_line'}, {'quantity_lab', 'math_workspace'}),
    ('L.3.1-2', {'word_tiles', 'word_choice'}, {'text_editor', 'sort_connect'}),
])
def test_new_generation_advertises_only_schema_compatible_controls(family, security_context, subskill, excluded, expected):
    class Capture(Composer):
        async def _call(self, schema, task, instruction, data):
            self.calls.append((task, instruction, copy.deepcopy(data)))
            raise ExtractionError('provider_unavailable', 'Not used by this payload test.', 503)
    with security_context.db.transaction() as conn:
        skill = get_subskill(conn, subskill)
    adapter = Capture()
    with pytest.raises(ValueError):
        asyncio.run(general.compose(adapter, skill, [], [], 0))
    assert len(adapter.calls) == 2
    for _, instruction, payload in adapter.calls:
        assert set(payload['availableMechanics']) == expected
        assert not excluded & set(payload['availableMechanics'])
        assert all('1.3' in row['schemaVersions'] for row in payload['componentToolkit'])
        assert excluded <= set(payload['coveragePath']['mechanics'])
        assert 'coveragePath.modes lists primary/default mode recommendations' in instruction


@pytest.mark.parametrize('message,code', [
    ('Area action requires Math and its actual rectangle state', 'area_state_missing'),
    ('Area board uses equal unit squares, zero origin and its actual rectangle state', 'area_unit_contract'),
    ('Area rectangle must fit the reachable board and tile bound', 'area_out_of_bounds'),
    ('Area mission requires more than one unit square', 'area_too_small'),
    ('Area design must require changing the starting rectangle', 'area_design_already_complete'),
    ('Area target needs a reachable rectangle factor pair', 'unreachable_area'),
    ('Area target must equal the rectangle unit-square count', 'area_product_mismatch'),
    ('Area scoring must be derived from the actual component state', 'area_key_mismatch'),
    ('Editing requires an original draft', 'missing_edit_draft'),
])
def test_component_validation_produces_specific_fixed_repair_reasons(message, code):
    info = diagnostic(ValueError(message), scene_index=1)
    assert info['code'] == code and info['sceneIndex'] == 1
    assert info['constraint'] and info['code'] != 'component_constraint'
