"""Reusable exact-fraction operations, isolation and old-history compatibility."""
import copy
from fractions import Fraction
import json
import uuid

import pytest

from backend.activity_engine_v2.core import ExecutionCore, ProgramInvalid
from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.validator import Compiler, validate_program
from backend.tests.account_helpers import mutate
from backend.tests.test_activity_program_fraction_authoring_v2 import fraction_program


def valid_program():
    program = fraction_program()
    assert validate_program(program).valid
    validate_runtime_compatibility(program)
    return program


def transition(core, state, action, inputs, count=0):
    return core.transition(state, action, inputs, action_count=count).state


def amount(state):
    return Fraction(len(state['work-pieces']), state['work-denominator'])


@pytest.mark.parametrize('denominator', [10, 15, 20])
def test_exact_partition_preserves_actual_shading_and_multiple_valid_constructions(denominator):
    program = valid_program()
    core = ExecutionCore(program)
    state = core.initial
    state = transition(core, state, 'piece', {'piece': 'p0'})
    before = amount(state)
    state = transition(core, state, 'move', {'from': 'p0', 'to': 'p3'})
    assert amount(state) == before and state['work-pieces'] == ['p3']
    state = transition(core, state, 'piece', {'piece': 'p1'})
    assert amount(state) == Fraction(2, 5) and not core.completed(state)
    state = transition(core, state, 'partition', {'denominator': denominator})
    rows = denominator // 5
    expected = {f'p{index}' for column in [1, 3] for index in range(column * rows, (column + 1) * rows)}
    assert set(state['work-pieces']) == expected
    assert amount(state) == Fraction(2, 5) and core.completed(state)
    assert core.fraction_comparison(state, 'reference', 'working')['comparison'] == 'equal'
    assert state['reference-pieces'] == ['p0', 'p1']


def test_empty_whole_can_be_built_in_another_layout_and_exact_comparison_does_not_round():
    core = ExecutionCore(valid_program())
    state = transition(core, core.initial, 'partition', {'denominator': 15})
    assert amount(state) == 0 and not core.completed(state)
    for piece in ['p14', 'p9', 'p7', 'p3', 'p1']:
        state = transition(core, state, 'piece', {'piece': piece})
        assert not core.completed(state)
    assert core.fraction_comparison(state, 'reference', 'working')['comparison'] == 'greater'
    state = transition(core, state, 'piece', {'piece': 'p5'})
    assert amount(state) == Fraction(2, 5) and core.completed(state)
    assert set(state['work-pieces']) == {'p14', 'p9', 'p7', 'p3', 'p1', 'p5'}


def test_coarsening_only_merges_homogeneous_parts_and_publishes_valid_choices():
    core = ExecutionCore(valid_program())
    state = transition(core, core.initial, 'partition', {'denominator': 10})
    state = transition(core, state, 'piece', {'piece': 'p0'})
    views, _ = core.fraction_views(state)
    choices = next(view['allowedDenominators'] for view in views if view['editable'])
    assert 5 not in choices and 15 not in choices and 20 in choices
    saved = copy.deepcopy(state)
    with pytest.raises(ProgramInvalid, match='fraction_partition_cuts_shaded_piece'):
        transition(core, state, 'partition', {'denominator': 5})
    assert state == saved
    state = transition(core, state, 'piece', {'piece': 'p1'})
    state = transition(core, state, 'partition', {'denominator': 5})
    assert state['work-pieces'] == ['p0'] and amount(state) == Fraction(1, 5)


def test_partition_choices_respect_authored_guard_until_child_builds_the_base_amount():
    raw = fraction_program().model_dump()
    raw['rules'][0]['when'] = {'kind': 'fraction_equal', 'leftObject': 'reference', 'rightObject': 'working'}
    program = ActivityProgram.model_validate(raw)
    assert validate_program(program).valid
    core = ExecutionCore(program)
    state = core.initial
    def allowed(current):
        views, _ = core.fraction_views(current)
        return next(view['allowedDenominators'] for view in views if view['editable'])
    assert allowed(state) == []
    with pytest.raises(ProgramInvalid, match='action_guard_unsatisfied'):
        transition(core, state, 'partition', {'denominator': 10})
    state = transition(core, state, 'piece', {'piece': 'p0'})
    assert allowed(state) == []
    state = transition(core, state, 'move', {'from': 'p0', 'to': 'p3'})
    assert allowed(state) == []  # Rearrangement preserves the insufficient amount.
    state = transition(core, state, 'piece', {'piece': 'p1'})
    assert allowed(state) == [10, 15, 20]
    untouched = copy.deepcopy(state)
    result = transition(core, state, 'partition', {'denominator': 15})
    assert state == untouched and core.completed(result)


@pytest.mark.parametrize('action,inputs,reason', [
    ('partition', {'denominator': 7}, 'fraction_partition_invalid'),
    ('partition', {'denominator': True}, 'action_integer_input_invalid'),
    ('partition', {'denominator': 25}, 'action_integer_input_invalid'),
    ('piece', {'piece': 'p19'}, 'fraction_piece_outside_whole'),
    ('move', {'from': 'p0', 'to': 'p1'}, 'fraction_move_requires_filled_and_empty_places'),
])
def test_invalid_actions_do_not_change_state_or_consume_budget(action, inputs, reason):
    core = ExecutionCore(valid_program())
    original = copy.deepcopy(core.initial)
    with pytest.raises(ProgramInvalid, match=reason):
        transition(core, core.initial, action, inputs)
    assert core.initial == original


def test_repartition_same_value_is_not_a_fake_visible_action_or_evidence():
    core = ExecutionCore(valid_program())
    state = transition(core, core.initial, 'piece', {'piece': 'p3'})
    state = transition(core, state, 'piece', {'piece': 'p1'})
    with pytest.raises(ProgramInvalid, match='fraction_partition_unchanged'):
        transition(core, state, 'partition', {'denominator': 5})
    assert state['work-pieces'] == ['p3', 'p1']


def test_same_count_is_not_same_amount_and_whole_identity_cannot_be_forged():
    core = ExecutionCore(valid_program())
    state = transition(core, core.initial, 'partition', {'denominator': 10})
    state = transition(core, state, 'piece', {'piece': 'p0'})
    state = transition(core, state, 'piece', {'piece': 'p1'})
    assert len(state['work-pieces']) == len(state['reference-pieces'])
    assert not core.fraction_comparison(state, 'reference', 'working')['equalAmount']
    raw = fraction_program().model_dump()
    raw['world']['objects'][1]['wholeId'] = 'another-whole'
    rejected = validate_program(raw)
    assert not rejected.valid and rejected.issues[0].code == 'fraction_same_whole_mismatch'
    forged = ExecutionCore(ActivityProgram.model_validate(raw))
    assert not forged.fraction_comparison(state, 'reference', 'working')['equalAmount']


@pytest.mark.parametrize('mutation,reason', [
    ('reference_write', 'immutable_state_write'),
    ('manufactured_partition', 'operation_must_use_child_input'),
    ('manufactured_toggle', 'operation_must_use_child_input'),
    ('manufactured_move', 'operation_must_use_child_input'),
    ('wrong_piece_domain', 'fraction_piece_domain_invalid'),
    ('missing_material', 'fraction_prompt_material_required'),
    ('mutable_reference', 'fraction_comparison_requires_fixed_reference'),
])
def test_fraction_authoring_rejects_forged_state_and_manufactured_actions(mutation, reason):
    raw = fraction_program().model_dump()
    if mutation == 'reference_write':
        raw['rules'][1]['effects'][0]['target'] = 'reference-pieces'
    elif mutation == 'manufactured_partition':
        raw['rules'][0]['effects'][0]['value'] = {'kind': 'literal', 'value': 10}
    elif mutation == 'manufactured_toggle':
        raw['rules'][1]['effects'][0]['item'] = {'kind': 'literal', 'value': 'p0'}
    elif mutation == 'manufactured_move':
        raw['rules'][2]['effects'][0]['toItem'] = {'kind': 'literal', 'value': 'p1'}
    elif mutation == 'wrong_piece_domain':
        raw['world']['state'][3]['options'][-1] = 'r1c1'
    elif mutation == 'missing_material':
        raw['world']['objects'][1]['materialIds'] = []
    elif mutation == 'mutable_reference':
        raw['world']['state'][0]['mutable'] = raw['world']['state'][1]['mutable'] = True
    report = validate_program(raw)
    assert not report.valid and report.issues[0].code == reason


def test_automatic_fraction_assessment_reads_both_real_piece_sets_and_whole_identity():
    program = valid_program()
    raw = program.model_dump()
    raw['evidence'][0]['assessment']['when'] = {'kind': 'compare', 'op': 'ne',
        'left': {'kind': 'state', 'ref': 'work-denominator'}, 'right': {'kind': 'state', 'ref': 'reference-denominator'}}
    report = validate_program(raw)
    assert not report.valid and report.issues[0].code == 'fraction_assessment_requires_same_whole_comparison'
    raw = program.model_dump()
    raw['evidence'][0]['stateRefs'] = ['work-denominator']
    report = validate_program(raw)
    assert not report.valid and report.issues[0].code == 'automatic_assessment_requires_checkable_state'
    # A predicate consisting solely of exact same-whole comparison still has
    # implicit dependencies on the actual mutable piece set and denominator.
    raw = program.model_dump()
    raw['evidence'][0]['assessment']['when'] = {'kind': 'fraction_equal', 'leftObject': 'reference', 'rightObject': 'working'}
    assert validate_program(raw).valid


def test_fraction_runtime_and_offline_witness_are_the_same_pure_transition():
    program = valid_program()
    core = ExecutionCore(program)
    state = core.initial
    for count, step in enumerate(program.witness):
        state = transition(core, state, step.actionId, step.inputs, count)
    assert core.completed(state)
    assert Compiler.transition is ExecutionCore.transition
    assert Compiler(program).validate().witness() == (['same-amount'], 4)


def test_new_optional_identity_does_not_change_old_definition_hashes():
    from pathlib import Path
    examples = Path(__file__).resolve().parents[2] / 'data/activity_engine_v2/examples'
    expected = {'habitat_designer': '73927676ae14564457c09ec4f30f66d29130bccfe9259b8332d3fdeb7bb41fc4',
                'observatory_floor': 'ce678ec37a60d9fbcb02516332573a4246c73b8d9a336ad72db4d00efcf1fd9e',
                'trail_evidence': 'bb398102cd9efcc08b40e7b71d929e0a0b033f915cc8cb98a8dd182cf5060331'}
    for name, digest in expected.items():
        assert validate_program((examples / f'{name}.json').read_bytes()).definitionSha256 == digest


def test_owned_fraction_workspace_keeps_help_refresh_completion_and_replay(kid_client, security_context, monkeypatch, tmp_path):
    from backend.activity_engine_v2 import preview
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW', 'true')
    path = tmp_path / 'synthetic-fraction-contract.json'
    program = valid_program()
    path.write_text(program.model_dump_json())
    monkeypatch.setitem(preview.FIXTURE_PATHS, 'synthetic-fraction-runtime', path)
    prefix = '/api/activity-programs'
    def post(endpoint, body):
        version = kid_client.get('/api/auth/session').json()['version']
        return mutate(kid_client, 'POST', prefix + endpoint, json=body,
                      headers={'X-Sidekick-Profile-Version': str(version)})
    response = post('/preview/synthetic-fraction-runtime/sessions', {'requestId': 'fraction-start'})
    assert response.status_code == 200, response.text
    view = response.json()
    assert view['fractionViews'][1]['numerator'] == 0
    assert view['fractionComparisons'][0]['comparison'] == 'greater'
    view = post(f"/sessions/{view['id']}/help", {'requestId': 'fraction-help', 'expectedRevision': 0, 'helpId': 'hint'}).json()
    for step in program.witness:
        response = post(f"/sessions/{view['id']}/actions", {'requestId': uuid.uuid4().hex, 'expectedRevision': view['revision'],
            'actionId': step.actionId, 'inputs': step.inputs})
        assert response.status_code == 200, response.text
        view = response.json()
    assert view['status'] == 'completed' and view['outcome']['assisted']
    assert view['fractionViews'][1]['numerator'] == 4 and view['fractionViews'][1]['denominator'] == 10
    assert view['fractionComparisons'][0]['equalAmount']
    assert kid_client.get(prefix + f"/sessions/{view['id']}").json() == view
    assert post(f"/sessions/{view['id']}/replay", {'expectedRevision': view['revision']}).json()['verified']
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 0
    assert 'wholeId' in view['objects'][0] and 'witness' not in json.dumps(view)
