"""Synthetic authoring/ABI checks; no finished activity is supplied to the AI."""
import json

from backend.activity_engine_v2.authoring import ActivityAuthoring, compile_authoring, to_authoring
from backend.activity_engine_v2.composer import capabilities
from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.validator import catalog
from backend.gap.vision import _strict_schema
from backend.tests.program_composition_examples import context_for, eq, inp, lit, state
from backend.tests.test_activity_program_authoring_v2 import inspect_schema


def fraction_program():
    """From-scratch contract specimen, not a runtime library or composer input."""
    skill='4.NF.A.1-1'
    different=dict(kind='compare',op='ne',left=state('work-denominator'),right=state('reference-denominator'))
    comparison=dict(kind='fraction_equal',leftObject='reference',rightObject='working')
    goal=dict(kind='all',conditions=[comparison,different])
    options=[f'p{index}' for index in range(20)]
    raw=dict(schemaVersion='2.0-foundation',componentVersion='sidekick-program-contract-v1',
        id='synthetic-fraction-abi',title='Synthetic fraction contract specimen',
        intent=dict(targets=[dict(skillId=skill,demonstration=catalog()[skill]['subskill'])],
                    observations=[],misconceptions=[],successEvidence=['construction']),
        world=dict(state=[
            dict(id='reference-denominator',kind='integer',initial=5,minimum=5,maximum=5,mutable=False),
            dict(id='reference-pieces',kind='id_set',initial=['p0','p1'],options=options[:5],maxItems=5,mutable=False),
            dict(id='work-denominator',kind='integer',initial=5,minimum=5,maximum=20),
            dict(id='work-pieces',kind='id_set',initial=[],options=options,maxItems=20)],
            materials=[dict(id='brief',kind='prompt',text='Construct the same amount using a different partition. Place and rearrange pieces on the same whole, then refine the divisions without changing the amount.')],
            objects=[dict(id='reference',kind='fraction_strip',bindings=dict(denominator='reference-denominator',pieces='reference-pieces'),materialIds=['brief'],wholeId='same-whole',width=5),
                     dict(id='working',kind='fraction_strip',bindings=dict(denominator='work-denominator',pieces='work-pieces'),materialIds=['brief'],wholeId='same-whole',width=5)],
            relationships=[dict(id='same-light',kind='same_whole',source='reference',target='working')],invariants=[]),
        components=[dict(id='fraction-tools',kind='fraction_workspace',objectIds=['reference','working'],spaceId='space')],
        actions=[dict(id='partition',componentId='fraction-tools',operation='set_fraction_partition',inputs=[dict(id='denominator',kind='integer',minimum=5,maximum=20)],label='Refine the partition'),
                 dict(id='piece',componentId='fraction-tools',operation='toggle_fraction_piece',inputs=[dict(id='piece',kind='choice',options=options)],label='Place or remove a piece'),
                 dict(id='move',componentId='fraction-tools',operation='move_fraction_piece',inputs=[dict(id='from',kind='choice',options=options),dict(id='to',kind='choice',options=options)],label='Move a piece')],
        rules=[dict(id='partition-rule',onAction='partition',when=dict(kind='always'),effects=[dict(kind='repartition',target='work-denominator',piecesTarget='work-pieces',value=inp('denominator'))]),
               dict(id='piece-rule',onAction='piece',when=dict(kind='always'),effects=[dict(kind='toggle_item',target='work-pieces',item=inp('piece'))]),
               dict(id='move-rule',onAction='move',when=dict(kind='always'),effects=[dict(kind='move_item',target='work-pieces',fromItem=inp('from'),toItem=inp('to'))])],
        goals=[dict(id='same-amount',description='Construct the same amount with different equal divisions.',when=goal)],
        completion=dict(when=dict(kind='goal',goalId='same-amount'),goalIds=['same-amount']),
        help=[dict(id='hint',kind='hint',text='The whole stays the same size. Compare how much is covered before and after changing the divisions.',availableWhen=dict(kind='always'),actionIds=['partition','piece','move'])],
        evidence=[dict(id='construction',skillIds=[skill],actionIds=['partition','piece','move'],stateRefs=['work-denominator','work-pieces'],assessment=dict(kind='automatic',when=goal))],
        presentation=dict(entrySpace='space',spaces=[dict(id='space',title='Fraction tools')],assets=[]),
        provenance=dict(origin='human_authored',author='Synthetic ABI test',sourceRefs=[]),
        witness=[dict(actionId='piece',inputs=dict(piece='p0')),
                 dict(actionId='move',inputs={'from':'p0','to':'p3'}),
                 dict(actionId='piece',inputs=dict(piece='p1')),
                 dict(actionId='partition',inputs=dict(denominator=10))])
    return ActivityProgram.model_validate(raw)


def test_fraction_authoring_preserves_object_identity_geometry_actions_and_exact_comparison():
    original=fraction_program()
    authored=to_authoring(original)
    encoded=json.loads(authored.model_dump_json())
    bindings=encoded['world']['objects'][1]['bindings']
    assert {item['port'] for item in bindings}=={'denominator','pieces'}
    assert encoded['world']['objects'][1]['wholeId']=='same-whole'
    compiled=compile_authoring(authored,context_for(original),model='synthetic-provider')
    for field in ('world','actions','rules','goals','completion','evidence','witness'):
        assert getattr(compiled,field)==getattr(original,field)


def test_fraction_provider_schema_remains_closed_and_uses_same_goal_free_exact_predicate():
    schema=_strict_schema(ActivityAuthoring.model_json_schema()); inspect_schema(schema)
    fraction=schema['$defs']['FractionEqualCondition']
    assert set(fraction['properties'])=={'kind','leftObject','rightObject'}
    for name in ('AuthoringGoal','AuthoringAutomaticAssessment'):
        assert {'$ref':'#/$defs/FractionEqualCondition'} in schema['$defs'][name]['properties']['when']['anyOf']
    assert {'denominator','pieces'}<=set(schema['$defs']['BindingEntry']['properties']['port']['enum'])
    assert schema['$defs']['RepartitionEffect']['properties']['piecesTarget']['type']=='string'
    assert set(schema['$defs']['MoveItemEffect']['properties'])=={'kind','target','fromItem','toItem'}


def test_capabilities_expose_actual_fraction_operations_without_a_skill_to_game_gate():
    contract=capabilities()
    assert {'set_fraction_partition','toggle_fraction_piece','move_fraction_piece'}<=set(contract['operations'])
    assert contract['objectPorts']['fraction_strip']=={'denominator':'integer','pieces':'id_set'}
    fraction=contract['rendererConstraints']['fractionWorkspace']
    assert fraction['matchingWholeIdAndWidth'] and fraction['recommendedInitialWorkingPiecesEmpty']
    assert fraction['denominatorMaximum']==24 and fraction['denominatorMultipleOfWidth']
    assert '4.NF' not in json.dumps(contract) and 'synthetic-fraction' not in json.dumps(contract)


def test_fraction_piece_domain_error_repairs_explicit_maximum_contract_without_normalizing_candidate():
    import asyncio
    from backend.activity_engine_v2.composer import compose
    from backend.tests.test_activity_program_composer_v2 import Stub
    original=fraction_program()
    bad=to_authoring(original).model_dump()
    pieces=next(slot for slot in bad['world']['state'] if slot['id']=='work-pieces')
    pieces['maxItems']=4  # A current numerator/count is not the full future domain.
    adapter=Stub([ActivityAuthoring.model_validate(bad),original])
    result=asyncio.run(compose(context_for(original),adapter=adapter))
    assert result.diagnostic_events[0]['code']=='fraction_piece_domain_invalid'
    repair=adapter.calls[1]['data']['repair']
    assert 'maxItems must EQUAL' in repair['guidance']
    assert 'immutable references' in repair['guidance']
    prior=next(slot for slot in repair['candidate']['world']['state'] if slot['id']=='work-pieces')
    assert prior['maxItems']==4
    accepted=next(slot for slot in result.program.world.state if slot.id=='work-pieces')
    assert accepted.maxItems==20 and len(accepted.options)==20
    assert result.call_count==3 and result.review.definitionHash==result.definition_hash
