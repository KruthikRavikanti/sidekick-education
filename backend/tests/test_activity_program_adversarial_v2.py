"""Independent boundary probes for the isolated ActivityProgram validator."""
import copy
import json
from pathlib import Path

import pytest

from backend.activity_engine_v2.validator import validate_program

ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / 'data/activity_engine_v2/examples'


def example(name, *, witness=True):
    payload = json.loads((EXAMPLES / f'{name}.json').read_text())
    if not witness:
        payload.pop('witness', None)
    return payload


@pytest.mark.parametrize('value', [2, 999])
def test_component_sharing_does_not_let_equation_action_rewrite_grid_state(value):
    payload = example('habitat_designer', witness=False)
    # One math workspace intentionally binds both geometry and expression.
    # A product input cannot smuggle an unrelated rectangle write into its rule,
    # even when that write stays within the integer domain.
    equation_rule = next(rule for rule in payload['rules'] if rule['onAction'] == 'build-product')
    equation_rule['effects'].append(dict(kind='set', target='rows', value=dict(kind='literal', value=value)))
    report = validate_program(payload)
    assert not report.valid and report.structural == 'failed'
    assert report.computational == 'not_checked'
    assert any(issue.code in {'effect_outside_component_state', 'state_write_provably_out_of_bounds'} for issue in report.issues)


def conflicting_passage(payload):
    original = payload['world']['materials'][0]
    conflicting = copy.deepcopy(original)
    conflicting['id'] = 'conflicting-passage'
    conflicting['text'] = 'A different clue. A conflicting fact.'
    for index, item in enumerate(conflicting['items']):
        item['text'] = ['A different clue.', 'A conflicting fact.'][index % 2]
    payload['world']['materials'].append(conflicting)
    return conflicting['id']


def test_bare_sentence_ids_cannot_alias_different_passages_on_one_board():
    payload = example('trail_evidence', witness=False)
    extra = conflicting_passage(payload)
    payload['world']['objects'][0]['materialIds'].append(extra)
    report = validate_program(payload)
    assert not report.valid
    assert any(issue.code == 'ambiguous_material_item_reference' for issue in report.issues)


def test_separate_material_scopes_do_not_require_global_item_ids():
    payload = example('trail_evidence', witness=False)
    # This material is not combined into the original board's selection scope.
    # Identical local item handles do not create ambiguity on that board.
    conflicting_passage(payload)
    report = validate_program(payload)
    assert report.valid and report.computational == 'not_checked'


def test_equal_cell_sets_ignore_the_order_in_which_the_child_placed_tiles():
    payload = example('observatory_floor')
    current = next(slot for slot in payload['world']['state'] if slot['id'] == 'covered-cells')
    expected = copy.deepcopy(current)
    expected.update(id='needed-cells', mutable=False, initial=list(current['options']))
    payload['world']['state'].append(expected)
    original_goal = payload['goals'][0]['when']
    payload['goals'][0]['when'] = dict(kind='all', conditions=[original_goal,
        dict(kind='compare', op='eq', left=dict(kind='state', ref='covered-cells'), right=dict(kind='state', ref='needed-cells'))])
    tiles = [step for step in payload['witness'] if step['actionId'] == 'place-or-lift']
    rest = [step for step in payload['witness'] if step['actionId'] != 'place-or-lift']
    payload['witness'] = list(reversed(tiles)) + rest
    report = validate_program(payload)
    assert report.valid and report.computational == 'witness_verified'


def test_sequence_equality_still_preserves_order():
    payload = example('observatory_floor')
    for identifier, initial in [('ordered-items', ['one', 'two']), ('reversed-items', ['two', 'one'])]:
        payload['world']['state'].append(dict(id=identifier, kind='id_list', mutable=False,
            options=['one', 'two'], initial=initial, maxItems=2))
    payload['goals'].append(dict(id='order-matters', description='A sequence preserves its order.',
        when=dict(kind='compare', op='ne', left=dict(kind='state', ref='ordered-items'), right=dict(kind='state', ref='reversed-items'))))
    report = validate_program(payload)
    assert report.valid and 'order-matters' in report.achievedGoalIds


def test_selected_success_evidence_must_inform_every_target_without_a_witness():
    payload = example('observatory_floor', witness=False)
    target = next(row for row in json.loads((ROOT / 'data/sidekick_skill_map_v2.json').read_text())
                  if row['subskill_id'] == '3.MD.C.6-1')
    payload['intent']['targets'].append(dict(skillId=target['subskill_id'], demonstration=target['subskill']))
    extra = copy.deepcopy(payload['evidence'][0])
    extra.update(id='extra-evidence', skillIds=[target['subskill_id']])
    payload['evidence'].append(extra)
    # All evidence covers both targets, but selected evidence still omits one.
    report = validate_program(payload)
    assert not report.valid
    assert any(issue.code == 'selected_target_evidence_missing' for issue in report.issues)


def test_a_provably_impossible_bounded_goal_is_not_left_as_unchecked():
    payload = example('habitat_designer', witness=False)
    payload['goals'][0]['when'] = dict(kind='compare', op='gt',
        left=dict(kind='state', ref='rows'), right=dict(kind='literal', value=7))
    report = validate_program(payload)
    assert not report.valid and any(issue.code == 'goal_provably_unreachable' for issue in report.issues)


def test_absent_witness_does_not_become_playability_or_learning_proof():
    report = validate_program(example('habitat_designer', witness=False))
    assert report.valid and report.structural == 'passed'
    assert report.computational == 'not_checked' and report.witnessSteps == 0
    assert report.semanticReview == 'required' and report.childTesting == 'not_performed'
    assert report.runtimeIntegration == 'not_connected' and report.artifactVerification == 'not_performed'


def test_schema_error_report_never_echoes_untrusted_extra_fields_or_content():
    payload = example('story_studio', witness=False)
    payload['PRIVATE_CHILD_TEXT'] = 'A private draft must not enter diagnostics.'
    report = validate_program(payload)
    assert not report.valid
    assert 'PRIVATE_CHILD_TEXT' not in report.model_dump_json()
    assert 'private draft' not in report.model_dump_json()
