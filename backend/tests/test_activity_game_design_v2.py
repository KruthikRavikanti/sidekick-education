"""Planning quality gates and structural variety are separate from runtime play."""
import copy
import json

import pytest

from backend.activity_engine_v2.game_design import (DesignEvaluationError, GameDesignBatch, GameDesignReview,
    design_signature, evaluate_designs, select_reviewed_design, structural_signature)
from backend.activity_engine_v2.gameplay import canonical_hash
from backend.activity_engine_v2.validator import validate_program
from backend.gap.vision import _strict_schema
from backend.tests.gameplay_examples import design_batch, design_review_approval
from backend.tests.program_composition_examples import context_for
from backend.tests.program_world_examples import world_program
from backend.tests.test_activity_program_authoring_v2 import inspect_schema


def test_five_closed_concepts_are_evaluated_before_quality_ranked_selection():
    program=world_program('design'); context=context_for(program); batch=design_batch(program)
    _,evaluations=evaluate_designs(batch,context)
    assert len(evaluations)==5 and all(item['eligible'] for item in evaluations)
    assert all(item['candidate']['childGoal'] for item in evaluations)
    payload=dict(designBatch=batch.model_dump(),designBatchHash=canonical_hash(batch.model_dump()))
    review=design_review_approval(payload)
    review.candidates[0].approved=False
    review.candidates[0].targetIntegrated=False
    review.candidates[0].reasonCode='target_detached'
    review.candidates[2].rank=1
    for index in (1,3,4):review.candidates[index].rank=2
    selected,merged=select_reviewed_design(batch,evaluations,review)
    assert selected.id==batch.concepts[2].id
    assert not merged[0]['approvedForAuthoring']
    inspect_schema(_strict_schema(GameDesignBatch.model_json_schema()))
    inspect_schema(_strict_schema(GameDesignReview.model_json_schema()))


def test_cosmetic_five_concepts_do_not_establish_structural_variety():
    program=world_program('design'); batch=design_batch(program).model_dump()
    first=copy.deepcopy(batch['concepts'][0])
    batch['concepts']=[dict(copy.deepcopy(first),id=f'new-name-{i}',title=f'Different skin {i}') for i in range(5)]
    with pytest.raises(DesignEvaluationError) as captured:
        evaluate_designs(batch,context_for(program))
    assert len(captured.value.evaluations)==5
    assert all('cosmetic_design_duplicate' in item['reasonCodes'] for item in captured.value.evaluations[1:])


def test_unsupported_capability_or_invented_observation_never_reaches_authoring_selection():
    program=world_program('design'); batch=design_batch(program); context=context_for(program)
    batch.concepts[0].supportedObservationIds=['invented-difficulty']
    batch.concepts[1].missingCapabilities=['teleport_anywhere']
    _,evaluations=evaluate_designs(batch,context)
    assert evaluations[0]['reasonCodes']==['invented_design_support']
    assert 'unimplemented_design_capability' in evaluations[1]['reasonCodes']
    review=design_review_approval(dict(designBatch=batch.model_dump(),designBatchHash=canonical_hash(batch.model_dump())))
    selected,merged=select_reviewed_design(batch,evaluations,review)
    assert selected.id not in {batch.concepts[0].id,batch.concepts[1].id}


@pytest.mark.parametrize('change',['hash','unknown_id','duplicate_id'])
def test_design_review_is_bound_to_exact_known_batch_and_ids(change):
    program=world_program('design'); batch=design_batch(program)
    _,evaluations=evaluate_designs(batch,context_for(program))
    review=design_review_approval(dict(designBatch=batch.model_dump(),designBatchHash=canonical_hash(batch.model_dump())))
    if change=='hash':review.designBatchHash='0'*64
    elif change=='unknown_id':review.candidates[0].designId='not-a-proposed-concept'
    else:review.candidates[0].designId=review.candidates[1].designId
    with pytest.raises(ValueError):select_reviewed_design(batch,evaluations,review)


def test_compatible_saved_plan_signature_drives_novelty_instead_of_incompatible_runtime_feature_bag():
    program=world_program('design'); batch=design_batch(program); context=context_for(program)
    context['previousSignatures']=[dict(structuralSignature=structural_signature(program),
                                       designSignature=design_signature(batch.concepts[0]))]
    _,evaluations=evaluate_designs(batch,context)
    assert evaluations[0]['structuralNovelty']==0
    assert all(item['structuralNovelty']>0 for item in evaluations[1:])
    review=design_review_approval(dict(designBatch=batch.model_dump(),designBatchHash=canonical_hash(batch.model_dump())))
    selected,_=select_reviewed_design(batch,evaluations,review)
    assert selected.id!=batch.concepts[0].id


def test_actual_structure_ignores_names_numbers_assets_and_private_witness_choices():
    program=world_program('design'); raw=program.model_dump()
    original=structural_signature(program)
    reserved={'rows','columns','left','right','result','text','cell','sentence','order','artifact','amount','destination','location'}
    names=set()
    def collect(value):
        if isinstance(value,dict):
            if isinstance(value.get('id'),str) and value['id'] not in reserved:names.add(value['id'])
            for child in value.values():collect(child)
        elif isinstance(value,list):
            for child in value:collect(child)
    collect(raw); mapping={name:'renamed-'+name for name in names}
    def rename(value):
        if isinstance(value,str):return mapping.get(value,value)
        if isinstance(value,list):return [rename(item) for item in value]
        if isinstance(value,dict):return {key:item if key in {'kind','operation','asset','theme','schemaVersion','componentVersion','origin','source','op'} else rename(item) for key,item in value.items()}
        return value
    raw=rename(raw);raw['title']='A different title and visual skin'
    for entity in raw['presentation']['stage']['entities']:entity['asset']='flower';entity['label']='New visible name'
    for location in raw['presentation']['stage']['locations']:
        location['x']=100-location['x'];location['label']='New location name'
    for slot in raw['world']['state']:
        if slot['id']==mapping['height']:slot['initial']=2
    for step in raw['witness']:
        if step['actionId']==mapping['reshape']:step['inputs']={'rows':4,'columns':3}
        if step['actionId']==mapping['multiply']:step['inputs']={'left':4,'right':3,'result':12}
    assert validate_program(raw).valid
    assert structural_signature(raw)==original


def test_actual_direction_and_world_action_loop_change_the_structure():
    route=world_program('design'); changed=route.model_dump()
    changed['presentation']['stage']['connections'][0]['bidirectional']=False
    assert structural_signature(changed)!=structural_signature(route)
    assert structural_signature(world_program('design',loop='attach'))!=structural_signature(route)


def test_physical_surface_structure_uses_actual_anchor_and_action_not_labels_or_cell_names():
    raw=world_program('tile').model_dump()
    surface=dict(id='planks',label='Panels along the crossing',objectId='board',locationId=None,
        connectionId='concept-route',cellIds=['r0c0','r1c0'],layout='row',actionId='place',visibleWhen=dict(kind='always'))
    raw['presentation']['stage']['surfaces']=[surface]
    before=structural_signature(raw)
    surface.update(id='different-id',label='Different color and wording',cellIds=['r0c1','r1c1'])
    assert structural_signature(raw)==before
    surface.update(connectionId=None,locationId='work')
    assert structural_signature(raw)!=before


def test_actual_construction_constraint_counts_as_structure_but_target_numbers_do_not():
    raw=world_program('tile').model_dump()
    before=structural_signature(raw)
    raw['presentation']['stage']['connections'][1]['construction']=dict(objectId='board',rows=2,columns=3)
    mounted=structural_signature(raw)
    assert mounted!=before
    raw['presentation']['stage']['connections'][1]['construction'].update(rows=3,columns=2)
    assert structural_signature(raw)==mounted
