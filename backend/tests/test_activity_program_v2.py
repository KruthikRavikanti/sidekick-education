"""Adversarial compiler tests for the isolated declarative contract boundary."""
import copy
import json
from pathlib import Path

import pytest

from backend.activity_engine_v2 import ProgramInvalid, require_valid_program, validate_program
from backend.activity_engine_v2.models import ActivityProgram, MAX_JSON_NODES, MAX_PROGRAM_BYTES

ROOT=Path(__file__).resolve().parents[2]


def example(name='habitat_designer'):
    return json.loads((ROOT/'data/activity_engine_v2/examples'/f'{name}.json').read_text())


def check_invalid(raw,code=None,*,computational=False):
    report=validate_program(raw)
    assert report.valid is False,report.model_dump()
    if code:assert any(issue.code==code for issue in report.issues),report.model_dump()
    assert report.structural==('passed' if computational else 'failed')
    assert report.computational==('failed' if computational else 'not_checked')
    assert report.semanticReview=='required' and report.childTesting=='not_performed'
    return report


def literal(value):return dict(kind='literal',value=value)
def state(ref):return dict(kind='state',ref=ref)
def equal(ref,value):return dict(kind='compare',op='eq',left=state(ref),right=literal(value))


@pytest.mark.parametrize('mutation',[
    lambda raw:raw.update(generatedJavaScript='PRIVATE_CONTENT'),
    lambda raw:raw['rules'][0].update(onEvent='loop'),
    lambda raw:raw['rules'][0]['effects'][0].update(kind='eval',code='PRIVATE_CONTENT'),
    lambda raw:raw['goals'][0]['when'].update(kind='expression',expression='PRIVATE_CONTENT'),
])
def test_executable_code_autonomous_events_and_unrestricted_expressions_are_not_in_the_language(mutation):
    raw=example();mutation(raw)
    report=check_invalid(raw,'schema_invalid')
    assert 'PRIVATE_CONTENT' not in report.model_dump_json()


def test_all_unknown_input_details_stay_out_of_safe_diagnostics(caplog):
    raw=example();raw['PRIVATE_FIELD_NAME']='PRIVATE_CONTENT'
    report=check_invalid(raw,'schema_invalid')
    assert 'PRIVATE' not in report.model_dump_json()+caplog.text
    with pytest.raises(ProgramInvalid) as caught:require_valid_program(raw)
    assert str(caught.value)=='schema_invalid'


@pytest.mark.parametrize('value',[True,1.5,'2'])
def test_integer_state_never_coerces_boolean_float_or_text(value):
    raw=example();raw['world']['state'][0]['initial']=value
    check_invalid(raw,'schema_invalid')


@pytest.mark.parametrize('value',[float('nan'),float('inf'),float('-inf')])
def test_nonfinite_confidence_is_rejected_for_dictionary_and_json_inputs(value):
    raw=example();raw['intent']['observations'][0]['confidence']=value
    check_invalid(raw)
    check_invalid(json.dumps(raw),'non_finite_number')


def test_size_nesting_node_and_duplicate_key_budgets_precede_recursive_validation():
    check_invalid('"'+'x'*MAX_PROGRAM_BYTES+'"','program_size_exceeded')
    check_invalid('['*41+'0'+']'*41,'json_depth_exceeded')
    check_invalid([0]*(MAX_JSON_NODES+1),'json_node_budget_exceeded')
    check_invalid('{"id":"first","id":"PRIVATE_CONTENT"}','duplicate_json_key')


@pytest.mark.parametrize('text',['<a'*60000,'<'+' '*100000+'!'])
def test_malformed_markup_scanning_has_no_nested_tag_or_optional_whitespace_rescan(text):
    # No timing assertion: this adversarial input exercises the bounded scanner
    # before the ordinary title/schema length checks reject it.
    check_invalid(json.dumps(dict(title=text)),'schema_invalid')


@pytest.mark.parametrize('mutation,code',[
    (lambda raw:raw['world']['state'].append(copy.deepcopy(raw['world']['state'][0])),'duplicate_id'),
    (lambda raw:raw['actions'][0].update(componentId='missing'),'unknown_action_component'),
    (lambda raw:raw['world']['objects'][0]['bindings'].update(rows='missing'),'unknown_state_reference'),
    (lambda raw:raw['world']['objects'][0]['bindings'].update(rows='covered-cells'),'object_port_type_mismatch'),
    (lambda raw:raw['world']['objects'][0].update(materialIds=['missing']),'unknown_material_reference'),
    (lambda raw:raw['components'][0]['objectIds'].append(raw['components'][0]['objectIds'][0]),'unknown_component_object'),
    (lambda raw:raw['evidence'][0]['stateRefs'].append(raw['evidence'][0]['stateRefs'][0]),'duplicate_reference'),
    (lambda raw:raw['completion']['goalIds'].append(raw['completion']['goalIds'][0]),'duplicate_reference'),
    (lambda raw:raw['help'][0].update(actionIds=['missing']),'help_action_reference_invalid'),
    (lambda raw:raw['presentation'].update(assets=['https://example.com/private.png']),'schema_invalid'),
])
def test_references_types_materials_assets_and_duplicate_refs_are_authoritative(mutation,code):
    raw=example();mutation(raw);check_invalid(raw,code)


def test_passage_board_must_have_actual_offered_sentences_and_literal_material():
    raw=example('trail_evidence');raw['world']['materials'][0]['text']='A different passage.'
    check_invalid(raw,'passage_sentence_not_in_material')
    raw=example('trail_evidence');raw['actions'][0]['inputs'][0]['options'].append('made-up-clue')
    check_invalid(raw,'evidence_input_not_in_passage')


def test_observation_and_misconception_refs_are_skill_scoped_with_confidence_and_provenance():
    raw=example();raw['intent']['observations'][0]['skillId']='W.3.3-1'
    check_invalid(raw,'observation_skill_mismatch')
    raw=example('observatory_floor');raw['intent']['misconceptions'][0]['observationIds']=['missing']
    check_invalid(raw,'misconception_provenance_invalid')
    raw=example('observatory_floor');raw['intent']['misconceptions'][0]['confidence']=1.0
    raw['intent']['observations'][0]['confidence']=.5
    check_invalid(raw,'misconception_provenance_invalid')
    raw=example();raw['provenance'].update(origin='ai_composed',model=None,promptVersion=None)
    check_invalid(raw,'generation_provenance_required')


def test_unknown_or_non_k5_skill_and_invented_demonstrations_are_rejected():
    raw=example();raw['intent']['targets'][0]['skillId']='6.RP.A.2-1'
    check_invalid(raw,'unknown_k5_skill')
    raw=example();raw['intent']['targets'][0]['demonstration']='A different skill'
    check_invalid(raw,'catalog_demonstration_mismatch')


def test_help_and_rules_cannot_rewrite_objective_scoring_or_emit_recursive_actions():
    raw=example();raw['help'][0]['effects']=[dict(kind='set',target='goal',value=literal(True))]
    check_invalid(raw,'schema_invalid')
    raw=example();raw['rules'][0]['effects'].append(dict(kind='set',target='completion',value=literal(True)))
    check_invalid(raw,'effect_outside_component_state')
    raw=example();raw['rules'][0]['effects'].append(dict(kind='emit_action',actionId=raw['actions'][0]['id']))
    check_invalid(raw,'schema_invalid')


def test_no_witness_means_no_reachability_claim_even_for_well_typed_program():
    raw=example();raw.pop('witness')
    report=validate_program(raw)
    assert report.valid and report.computational=='not_checked'
    assert report.achievedGoalIds==[] and report.childTesting=='not_performed'
    assert validate_program(example(),check_witness=False).computational=='not_checked'


def test_finite_choice_word_count_is_typed_and_does_not_crash_domain_checks():
    raw=example('trail_evidence');raw.pop('witness')
    raw['goals'][0]['when']=dict(kind='compare',op='eq',left=dict(kind='operator',op='word_count',args=[state('bridge-selection')]),right=literal(2))
    check_invalid(raw,'goal_provably_unreachable')


def test_certain_impossible_goals_and_writes_are_rejected_without_a_witness():
    raw=example();raw.pop('witness');raw['goals'][0]['when']=equal('rows',999)
    check_invalid(raw,'goal_provably_unreachable')
    raw=example('observatory_floor');raw.pop('witness');raw['goals'][0]['when']=equal('rows',9)
    check_invalid(raw,'goal_provably_unreachable')
    raw=example();raw.pop('witness')
    raw['actions'][1]['inputs'][2].update(minimum=999,maximum=1000)
    check_invalid(raw,'state_write_provably_out_of_bounds')


def test_expression_budget_and_no_initially_completed_mission():
    raw=example();raw['limits']['maxExpressionNodes']=1
    check_invalid(raw,'expression_budget_exceeded')
    raw=example();raw['completion']['when']=dict(kind='always');raw['completion']['goalIds']=[]
    check_invalid(raw,'schema_invalid')
    raw=example();raw['goals'][0]['when']=dict(kind='always')
    check_invalid(raw,'mission_initially_complete')


def test_goal_cycles_reject_before_entry_visibility_evaluation_can_recurse():
    raw=example();raw['goals'][0]['when']=dict(kind='goal',goalId='region-explained')
    raw['presentation']['spaces'][0]['visibleWhen']=dict(kind='goal',goalId='region-explained')
    check_invalid(raw,'invalid_goal_reference')


def test_operation_cannot_write_another_object_just_because_component_contains_it():
    raw=example();raw.pop('witness')
    raw['rules'][1]['effects'].append(dict(kind='set',target='rows',value=literal(999)))
    check_invalid(raw,'effect_outside_component_state')


def test_every_conditional_branch_must_preserve_actual_child_authored_values():
    raw=example();raw.pop('witness')
    rule=raw['rules'][1]
    rule['when']=dict(kind='compare',op='eq',left=dict(kind='input',ref='left'),right=literal(2))
    alternate=copy.deepcopy(rule);alternate['id']='bad-other-branch'
    alternate['when']=dict(kind='not',condition=copy.deepcopy(rule['when']))
    alternate['effects'][2]['value']=literal(12)
    raw['rules'].append(alternate)
    check_invalid(raw,'operation_must_use_child_input')


def test_every_prior_rule_writer_is_checked_not_just_the_last_complement():
    raw=example();raw.pop('witness')
    raw['limits']['maxEffectsPerAction']=16
    first=raw['rules'][1]
    first['when']=dict(kind='compare',op='eq',left=dict(kind='input',ref='left'),right=literal(2))
    second=copy.deepcopy(first);second['id']='complementary-branch'
    second['when']=dict(kind='not',condition=copy.deepcopy(first['when']))
    third=copy.deepcopy(first);third['id']='coactive-branch'
    raw['rules'] += [second,third]
    check_invalid(raw,'potentially_conflicting_rules')


def test_conflicting_effects_and_immutable_state_writes_are_rejected():
    raw=example();raw['rules'][0]['effects'].append(copy.deepcopy(raw['rules'][0]['effects'][0]))
    check_invalid(raw,'conflicting_effects')
    raw=example();next(slot for slot in raw['world']['state'] if slot['id']=='rows')['mutable']=False
    check_invalid(raw,'immutable_state_write')


def test_child_expression_is_not_server_filled_from_world_dimensions():
    raw=example();raw['rules'][1]['effects'][0]['value']=state('rows')
    check_invalid(raw,'operation_must_use_child_input')


def test_bare_mission_progress_boolean_is_not_automatic_skill_evidence():
    raw=example()
    raw['world']['state'].append(dict(id='done-flag',kind='boolean',initial=False,mutable=True))
    raw['world']['objects'].append(dict(id='progress-object',kind='progress',bindings=dict(value='done-flag'),materialIds=[]))
    raw['components'][0]['objectIds'].append('progress-object')
    raw['rules'][1]['effects'].append(dict(kind='set',target='done-flag',value=literal(True)))
    raw['evidence'][0]['stateRefs'].append('done-flag')
    raw['evidence'][0]['assessment']['when']=equal('done-flag',True)
    check_invalid(raw,'automatic_assessment_requires_checkable_state')


def quantity_program():
    raw=example();raw['intent'].update(observations=[],misconceptions=[],successEvidence=['allocation'])
    slots=[dict(id=name,kind='integer',initial=initial,minimum=0,maximum=6,unit='counter',mutable=True)
           for name,initial in [('stock',6),('a',0),('b',0)]]
    raw['world']=dict(state=slots,materials=[],objects=[dict(id='pool-'+name,kind='quantity_pool',bindings=dict(count=name),materialIds=[]) for name in ('stock','a','b')],relationships=[],
        invariants=[dict(kind='conserved_total',stateRefs=['stock','a','b'],total=6,unit='counter')])
    raw['components']=[dict(id='packing',kind='quantity_lab',objectIds=['pool-stock','pool-a','pool-b'],spaceId='workshop')]
    raw['actions']=[dict(id='move-'+name,componentId='packing',operation='transfer_quantity',label='Move counters into this order',inputs=[dict(id='amount',kind='integer',minimum=1,maximum=3)]) for name in ('a','b')]
    raw['rules']=[dict(id='transfer-'+name,onAction='move-'+name,when=dict(kind='always'),effects=[dict(kind='transfer',source='stock',target=name,amount=dict(kind='input',ref='amount'))]) for name in ('a','b')]
    goal=dict(kind='all',conditions=[equal('a',3),equal('b',3)])
    raw['goals']=[dict(id='packed',description='Fill both equal orders from the same stock.',when=goal)]
    raw['completion']=dict(when=dict(kind='goal',goalId='packed'),goalIds=['packed'],allowAssisted=True)
    raw['evidence']=[dict(id='allocation',skillIds=['3.MD.C.7-1'],actionIds=['move-a','move-b'],stateRefs=['a','b','stock'],assessment=dict(kind='automatic',when=goal),assistance='server_event_history')]
    raw['help']=[]
    raw['witness']=[dict(actionId='move-a',inputs=dict(amount=3)),dict(actionId='move-b',inputs=dict(amount=3))]
    return raw


def test_conservation_transfer_witness_checks_real_shared_stock_and_quantities():
    raw=quantity_program()
    report=validate_program(raw)
    assert report.valid and report.computational=='witness_verified'
    # Structural mechanics do not establish that this packing mission actually
    # teaches rectangle area. A mandatory semantic review would reject that.
    assert report.semanticReview=='required'
    raw['witness'].insert(1,dict(actionId='move-a',inputs=dict(amount=3)))
    check_invalid(raw,'state_integer_bounds_violated',computational=True)


def test_duplicate_conservation_refs_cannot_double_count_the_same_quantity():
    raw=quantity_program();raw['world']['invariants'][0]['stateRefs']=['stock','stock','a']
    check_invalid(raw,'quantity_conservation_domain_invalid')
    raw=quantity_program();raw['world']['invariants'][0]['total']=5
    check_invalid(raw,'quantity_conservation_violated')
    raw=quantity_program();raw['world']['state'][1]['unit']='kilogram'
    check_invalid(raw,'quantity_conservation_domain_invalid')


def test_missing_or_bad_witness_is_not_confused_with_actual_child_testing():
    raw=example();raw['witness']=[]
    report=check_invalid(raw,'witness_does_not_finish_mission',computational=True)
    assert report.childTesting=='not_performed'
    raw=example();raw['limits']['maxActions']=1
    check_invalid(raw,'witness_action_budget_exceeded',computational=True)


def test_schema_export_is_closed_and_versioned_without_live_runtime_imports():
    schema=ActivityProgram.model_json_schema()
    assert schema['additionalProperties'] is False
    assert schema['properties']['schemaVersion']['const']=='2.0-foundation'
    assert all(definition.get('additionalProperties') is False for definition in schema['$defs'].values() if definition.get('type')=='object')
