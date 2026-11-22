"""One pure transition language for fixture witnesses and owned play sessions."""
import copy
import json
from pathlib import Path

import pytest

from backend.activity_engine_v2.core import ExecutionCore, ProgramInvalid, RUNTIME_VERSION
from backend.activity_engine_v2.validator import Compiler, require_valid_program, validate_program

ROOT = Path(__file__).resolve().parents[2]
NAMES = ('observatory_floor', 'habitat_designer', 'trail_evidence', 'story_studio')


def raw_example(name='habitat_designer'):
    return json.loads((ROOT / 'data/activity_engine_v2/examples' / f'{name}.json').read_text())


def core_for(name='habitat_designer', payload=None):
    return ExecutionCore(require_valid_program(payload or raw_example(name), check_witness=False))


def rejected(core, state, action_id, inputs, code, **kwargs):
    original = copy.deepcopy(state)
    definition = core.p.model_dump()
    with pytest.raises(ProgramInvalid) as caught:
        core.transition(state, action_id, inputs, **kwargs)
    assert caught.value.code == code
    assert state == original
    assert core.p.model_dump() == definition


@pytest.mark.parametrize('name', NAMES)
def test_witness_and_live_execution_share_identical_core_and_finish_state(name, monkeypatch):
    payload = raw_example(name)
    program = require_valid_program(payload)
    core = ExecutionCore(program)
    state = copy.deepcopy(core.initial)
    for count, step in enumerate(program.witness):
        before = copy.deepcopy(state)
        result = core.transition(state, step.actionId, step.inputs, action_count=count)
        assert state == before
        state = result.state
        assert result.action_count == count + 1
    assert result.completed
    assert result.achieved_goal_ids == tuple(validate_program(payload).achievedGoalIds)
    assert result.visible_space_ids == core.visible_spaces(state)
    assert Compiler.term is ExecutionCore.term
    assert Compiler.evaluate is ExecutionCore.evaluate
    assert Compiler.check_state is ExecutionCore.check_state
    assert Compiler.transition is ExecutionCore.transition

    calls = []
    transition = ExecutionCore.transition

    def traced(self, state, action_id, inputs, **kwargs):
        outcome = transition(self, state, action_id, inputs, **kwargs)
        calls.append(outcome.state)
        return outcome

    monkeypatch.setattr(ExecutionCore, 'transition', traced)
    assert validate_program(payload).valid
    assert len(calls) == len(program.witness)
    assert calls[-1] == state


@pytest.mark.parametrize('value', [True, 2.0, '2', None, [], {}])
def test_action_input_types_reject_coercion_and_leave_state_unchanged(value):
    core = core_for()
    rejected(core, core.initial, 'reshape', dict(rows=value, columns=6), 'action_integer_input_invalid')


def test_invalid_signatures_unknown_actions_and_noops_are_atomic():
    core = core_for()
    rejected(core, core.initial, 'reshape', dict(rows=2, columns=6, award=True), 'action_input_signature_invalid')
    rejected(core, core.initial, 'reshape', dict(rows=2), 'action_input_signature_invalid')
    rejected(core, core.initial, 'invented-action', {}, 'unknown_action')
    rejected(core, core.initial, 'reshape', dict(rows=1, columns=1), 'action_has_no_visible_change')
    rejected(core, core.initial, 'reshape', dict(rows=7, columns=6), 'action_integer_input_invalid')


def test_wrong_expression_is_an_accepted_exploration_and_is_preserved_verbatim():
    core = core_for()
    state = core.transition(core.initial, 'reshape', dict(rows=2, columns=6)).state
    result = core.transition(state, 'build-product', dict(left=2, right=6, result=8), action_count=1)
    assert result.state['expression-result'] == 8
    assert not result.completed
    assert result.achieved_goal_ids == ()
    assert not hasattr(result, 'incorrect')
    finished = core.transition(result.state, 'build-product', dict(left=2, right=6, result=12), action_count=2)
    assert finished.completed
    assert RUNTIME_VERSION == 'sidekick-program-runtime-v1'


@pytest.mark.parametrize('rows,columns,left,right', [(2, 6, 2, 6), (3, 4, 3, 4), (4, 3, 3, 4), (6, 2, 6, 2)])
def test_different_valid_constructions_and_commutation_reach_completion(rows, columns, left, right):
    core = core_for()
    result = core.transition(core.initial, 'reshape', dict(rows=rows, columns=columns))
    result = core.transition(result.state, 'build-product', dict(left=left, right=right, result=12), action_count=1)
    assert result.completed
    rejected(core, result.state, 'reshape', dict(rows=1, columns=1), 'mission_already_complete', action_count=2)
    assert core.visible_spaces(result.state) == ('workshop',)


def test_actual_tile_placement_and_removal_changes_shared_coverage():
    core = core_for('observatory_floor')
    placed = core.transition(core.initial, 'place-or-lift', dict(cell='r0c0'))
    assert placed.state['covered-cells'] == ['r0c0']
    assert not placed.completed
    lifted = core.transition(placed.state, 'place-or-lift', dict(cell='r0c0'), action_count=1)
    assert lifted.state['covered-cells'] == []
    assert core.initial['covered-cells'] == []
    rejected(core, core.initial, 'place-or-lift', dict(cell='r9c9'), 'action_choice_input_invalid')


def test_post_effect_world_invariant_rejection_does_not_place_a_hidden_tile():
    payload = raw_example('observatory_floor')
    payload.pop('witness')
    rows = next(slot for slot in payload['world']['state'] if slot['id'] == 'rows')
    rows.update(initial=1, minimum=1, mutable=True)
    core = core_for(payload=payload)
    # The cell exists in the declared board domain but is outside its current
    # rectangle. Input validation passes; the post-effect world check rolls back.
    rejected(core, core.initial, 'place-or-lift', dict(cell='r1c0'), 'tile_outside_current_rectangle')
    assert core.initial['covered-cells'] == []


def test_space_visibility_is_authoritative_and_hidden_actions_cannot_run():
    payload = raw_example('trail_evidence')
    payload['presentation']['spaces'][1]['visibleWhen'] = dict(kind='compare', op='eq',
        left=dict(kind='state', ref='bridge-selection'), right=dict(kind='literal', value='bridge-1'))
    payload.pop('witness')
    core = core_for(payload=payload)
    assert core.visible_spaces(core.initial) == ('bridge',)
    rejected(core, core.initial, 'gate-place-clue', dict(sentence='gate-2'), 'action_space_unavailable')
    result = core.transition(core.initial, 'bridge-place-clue', dict(sentence='bridge-1'))
    assert not result.completed
    assert result.visible_space_ids == ('bridge', 'gate')
    assert core.transition(result.state, 'gate-place-clue', dict(sentence='gate-2'), action_count=1).completed


def test_effects_and_guards_read_one_pre_action_snapshot():
    payload = raw_example()
    payload.pop('witness')
    for identifier in ('changed-flag', 'snapshot-flag'):
        payload['world']['state'].append(dict(id=identifier, kind='boolean', initial=False))
        payload['world']['objects'].append(dict(id=identifier+'-object', kind='progress', bindings={'value': identifier}))
        payload['components'][0]['objectIds'].append(identifier+'-object')
    rule = next(item for item in payload['rules'] if item['onAction'] == 'reshape')
    rule['effects'].extend([
        dict(kind='set', target='changed-flag', value=dict(kind='literal', value=True)),
        dict(kind='set', target='snapshot-flag', value=dict(kind='state', ref='changed-flag')),
    ])
    core = core_for(payload=payload)
    result = core.transition(core.initial, 'reshape', dict(rows=2, columns=6))
    assert result.state['changed-flag'] is True
    assert result.state['snapshot-flag'] is False
    assert result.applied_rule_ids == (rule['id'],)


def test_execution_budget_rejects_without_consuming_or_mutating():
    core = core_for()
    rejected(core, core.initial, 'reshape', dict(rows=2, columns=6), 'action_budget_exceeded',
             action_count=core.p.limits.maxActions)
    rejected(core, core.initial, 'reshape', dict(rows=2, columns=6), 'action_count_invalid', action_count=True)
    accepted = core.transition(core.initial, 'reshape', dict(rows=2, columns=6), action_count=core.p.limits.maxActions-1)
    assert accepted.action_count == core.p.limits.maxActions


def test_state_boundary_rejects_missing_extra_and_mutated_immutable_values():
    core = core_for()
    for mutation, code in [
        (lambda state: state.pop('rows'), 'state_signature_invalid'),
        (lambda state: state.update(extra='private'), 'state_signature_invalid'),
        (lambda state: state.update({'tile-budget': 6}), 'immutable_state_changed'),
        (lambda state: state.update({'covered-cells': [dict(unhashable=True)]}), 'state_collection_bounds_violated'),
    ]:
        state = copy.deepcopy(core.initial)
        mutation(state)
        rejected(core, state, 'reshape', dict(rows=2, columns=6), code)


def test_revision_requires_real_changed_draft_and_does_not_grade_writing_quality():
    core = core_for('story_studio')
    draft = 'Mira stood beside the town pond with a map.'
    revision = 'At sunrise Mira stood beside the town pond, unfolding her faded paper map.'
    rejected(core, core.initial, 'revise-opening', dict(text=revision), 'action_guard_unsatisfied')
    saved = core.transition(core.initial, 'write-opening', dict(text=draft))
    rejected(core, saved.state, 'revise-opening', dict(text=draft), 'action_guard_unsatisfied', action_count=1)
    revised = core.transition(saved.state, 'revise-opening', dict(text=revision), action_count=1)
    assert revised.completed
    assert revised.state['opening-text'] == revision
    assert all(item.assessment.kind == 'parent_review' for item in core.p.evidence)
    assert saved.state['opening-text'] == draft


def test_changed_ids_original_content_and_valid_parameters_do_not_select_an_example_flow():
    payload = raw_example()
    payload.update(id='moon-greenhouse', title='Build a moon greenhouse')
    payload['world']['materials'][0]['quantity'] = 6
    for slot in payload['world']['state']:
        if slot['id'] == 'tile-budget':
            slot.update(initial=6, minimum=6, maximum=6)
    # Keep semantic input/port names, but rename the entire world graph around
    # them. The execution core has no knowledge of fixture or skill identifiers.
    protected = {'rows', 'columns', 'left', 'right', 'result', 'cell', 'text'}
    identifiers = set()

    def collect(value):
        if isinstance(value, dict):
            if 'id' in value and value['id'] not in protected:
                identifiers.add(value['id'])
            for child in value.values():
                collect(child)
        elif isinstance(value, list):
            for child in value:
                collect(child)

    collect(payload)
    mapping = {identifier: 'new-'+identifier for identifier in identifiers}

    def rename(value):
        if isinstance(value, dict):
            return {key: rename(child) for key, child in value.items()}
        if isinstance(value, list):
            return [rename(child) for child in value]
        return mapping.get(value, value) if isinstance(value, str) else value

    payload = rename(payload)
    payload['witness'] = [dict(actionId=mapping['reshape'], inputs=dict(rows=2, columns=3)),
        dict(actionId=mapping['build-product'], inputs=dict(left=3, right=2, result=6))]
    assert validate_program(payload).valid
    core = core_for(payload=payload)
    result = core.transition(core.initial, mapping['reshape'], dict(rows=2, columns=3))
    result = core.transition(result.state, mapping['build-product'], dict(left=3, right=2, result=6), action_count=1)
    assert result.completed
    assert core.action_objects(mapping['reshape'])[0].kind == 'grid'
    assert core.action_objects(mapping['build-product'])[0].kind == 'equation'
