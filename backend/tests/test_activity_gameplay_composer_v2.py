"""The normal world pipeline plans, reviews and binds actual playable stage data."""
import asyncio
import copy

import pytest

from backend.activity_engine_v2.authoring import ActivityAuthoring
from backend.activity_engine_v2.composer import CompositionFailure, ConfiguredComposerAdapter, capabilities, compose_gameplay, repair_guidance, validate_gameplay_review
from backend.activity_engine_v2.game_design import GameDesignBatch, GameDesignReview
from backend.activity_engine_v2.gameplay import GameplayReview, canonical_hash, render_manifest
from backend.activity_engine_v2.core import ProgramInvalid
from backend.provider import ExtractionError
from backend.tests.gameplay_examples import GameplayStub, design_review_approval, gameplay_approval
from backend.tests.program_composition_examples import context_for, make_program
from backend.tests.program_world_examples import world_program


@pytest.mark.parametrize('kind',['tile','design','reading','writing','fraction'])
def test_planning_and_two_exact_hash_reviews_admit_actual_worlds_with_initial_state_untouched(kind):
    program=world_program(kind); adapter=GameplayStub(program); context=context_for(program)
    result=asyncio.run(compose_gameplay(context,adapter=adapter))
    assert result.call_count==5
    assert [item['task'] for item in adapter.calls]==['design_activity_game','review_activity_game_design',
        'compose_activity_game','review_activity_program','review_activity_gameplay']
    assert result.program.world.state==program.world.state
    assert len(result.design_evaluations)==5
    assert all(item['candidate']['childGoal'] and item['designReview'] for item in result.design_evaluations)
    assert result.review.definitionHash==result.gameplay_review.definitionHash==result.definition_hash
    assert result.gameplay_review.renderManifestHash==canonical_hash(result.render_manifest)
    assert result.game_design['id']==adapter.calls[2]['data']['gameDesign']['id']
    assert result.render_manifest['counterfactual']['completedWithoutConcept'] is False
    assert 'physicalSurfaces' not in result.render_manifest['renderer']
    assert any(not item['missionComplete'] for item in result.render_manifest['authoritativeCheckpoints'])
    assert result.gameplay_review.approved
    if kind=='writing':assert result.review.requiresParentReview


def test_independent_design_review_rejects_before_program_authoring_and_preserves_all_five_judgments():
    program=world_program('design')
    class RejectPlans(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            if model is GameDesignReview:
                for item in value.candidates:
                    item.approved=False;item.targetIntegrated=False;item.reasonCode='target_detached'
            return value
    adapter=RejectPlans(program)
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    assert captured.value.code=='no_approved_game_design'
    assert captured.value.call_count==2
    assert len(captured.value.design_evaluations)==5
    assert all(item['candidate'] and not item['designReview']['targetIntegrated'] for item in captured.value.design_evaluations)
    assert not any(item['task']=='compose_activity_game' for item in adapter.calls)


def test_planning_repair_receives_exact_rejected_batch_and_reasons_and_retains_both_attempts():
    program=world_program('design')
    class RepairPlans(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            if model is GameDesignBatch and task=='design_activity_game':
                for index in range(1,5):
                    value.concepts[index]=value.concepts[0].model_copy(deep=True,update={'id':f'cosmetic-{index}'})
            return value
    adapter=RepairPlans(program)
    result=asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    repair=next(item for item in adapter.calls if item['task']=='repair_activity_game_design')['data']['repair']
    assert repair['reasonCode']=='insufficient_supported_design_variety'
    assert len(repair['previousBatch']['concepts'])==len(repair['evaluations'])==5
    assert repair['evaluations'][1]['reasonCodes']==['cosmetic_design_duplicate']
    assert result.call_count==6 and len(result.design_evaluations)==10
    assert {item['planningAttempt'] for item in result.design_evaluations}=={1,2}
    assert all(item.get('designReview') for item in result.design_evaluations if item['planningAttempt']==2)
    assert 'candidate' not in str(result.diagnostic_events)+str(result.model_calls)


def test_truncated_planning_repair_keeps_five_rejected_plans_and_only_safe_provider_metadata():
    program=world_program('design')
    class TruncatedRepair(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            self.metadata[-1].update(finishReason='length',providerHttpStatus=200,rawBody='never-persist-provider-body')
            if task=='repair_activity_game_design':
                raise ExtractionError('activity_provider_invalid','Invalid provider response')
            if model is GameDesignBatch:
                for index in range(1,5):
                    value.concepts[index]=value.concepts[0].model_copy(deep=True,update={'id':f'cosmetic-{index}'})
            return value
    adapter=TruncatedRepair(program)
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    error=captured.value
    assert error.call_count==2 and len(error.design_evaluations)==5
    assert all(item['candidate'] and item['planningAttempt']==1 for item in error.design_evaluations)
    assert error.model_calls[-1]['finishReason']=='length'
    assert error.model_calls[-1]['providerHttpStatus']==200
    assert 'never-persist-provider-body' not in str(error.model_calls)+str(error.diagnostic_events)+str(error)


def test_configured_planning_transport_has_bounded_room_for_all_five_concepts(monkeypatch):
    captured=[]
    async def transport(model,**kwargs):
        captured.append(kwargs)
        return 'unused-test-result'
    monkeypatch.setattr('backend.activity_engine_v2.composer.structured_call',transport)
    class Settings:model='explicit-test-model'
    adapter=ConfiguredComposerAdapter(Settings())
    for task in ('design_activity_game','repair_activity_game_design'):
        asyncio.run(adapter.call(GameDesignBatch,task,'test',{}))
    assert [item['max_output_tokens'] for item in captured]==[9000,9000]


def test_tool_attachment_repair_distinguishes_native_controls_from_actual_representation_binding():
    native=repair_guidance('stage_tool_world_component_forbidden')
    pair=repair_guidance('stage_tool_attachment_duplicate')
    representation=repair_guidance('stage_representation_not_bound_to_tool')
    assert 'Remove the world_stage attachment' in native and 'automatically' in native
    assert 'multiple different entities' in pair and 'identical pair' in pair
    assert 'representationObjectId' in representation and 'objectIds' in representation
    assert 'representationObjectId' not in repair_guidance('stage_tool_component_unknown')


def test_product_capability_truthfully_supports_exact_numeric_assessment_and_full_inspection_domain():
    contract=capabilities()['operations']['assemble_product']
    assert contract['automaticAssessment'] and contract['liveV2AdapterImplemented']
    assert 'Implemented typed V2 input adapter' in contract['evidence']
    assert 'future trusted parser' not in contract['evidence']
    guidance=repair_guidance('stage_inspection_domain_incomplete')
    assert 'ALL declared stage location IDs' in guidance and 'maxItems' in guidance
    grid=capabilities()['rendererConstraints']['gridWorkspace']
    assert grid['sharedStockAcrossGrids'] is False and 'tile_stock_exceeded' in grid['stock']


@pytest.mark.parametrize('provider_failure',[False,True])
def test_stage_entity_schema_reason_reaches_specific_repair_without_private_validation_text(provider_failure):
    program=world_program('design')
    class FixedPlacement(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            if task=='compose_activity_game':
                if provider_failure:
                    raise ExtractionError('activity_schema_invalid','The activity needs another attempt.',
                        diagnostic=dict(stage='schema',code='stage_actor_requires_object',sceneIndex=None,field='presentation.stage.entities.1'))
                raw=value.model_dump()
                raw['presentation']['stage']['entities'][1].update(kind='actor',label='private-invalid-label')
                return raw
            return value
    adapter=FixedPlacement(program)
    result=asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    repair=next(item for item in adapter.calls if item['task']=='repair_activity_game')['data']['repair']
    assert repair['reasonCode']=='stage_actor_requires_object'
    assert repair['path']=='presentation.stage.entities.1'
    assert 'actor must be movable' in repair['guidance']
    assert 'private-invalid-label' not in str(result.diagnostic_events)+str(result.model_calls)


@pytest.mark.parametrize('mutation',['rejected','wrong_hash','wrong_manifest'])
def test_semantic_approval_alone_cannot_bypass_gameplay_gate(mutation):
    program=world_program('design')
    class BadGameplay(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            if model is GameplayReview:
                if mutation=='rejected':value.approved=False;value.mainStagePlayable=False;value.reasonCode='bare_teaching_tool'
                elif mutation=='wrong_hash':value.definitionHash='0'*64
                else:value.renderManifestHash='0'*64
            return value
    adapter=BadGameplay(program)
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    assert captured.value.stage=='gameplay_review'
    assert captured.value.call_count==8
    assert len(adapter.calls)==8
    assert captured.value.game_design and len(captured.value.design_evaluations)==5
    assert captured.value.gameplay_review and captured.value.semantic_review and captured.value.render_manifest
    assert 'summary' not in str(captured.value.diagnostic_events)
    assert captured.value.gameplay_review['summary'] not in str(captured.value)


def test_rejected_gameplay_keeps_a_private_hash_bound_review_render_audit_for_the_same_candidate():
    program=world_program('design')
    class Decorative(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            if model is GameplayReview:
                return gameplay_approval(data,approved=False,mainStagePlayable=False,
                    reasonCode='decorative_world',summary='The generated rendering is a concept panel followed by a cosmetic reward.')
            return value
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose_gameplay(context_for(program),adapter=Decorative(program)))
    error=captured.value
    assert error.gameplay_review['definitionHash']==error.semantic_review['definitionHash']
    assert error.gameplay_review['renderManifestHash']==canonical_hash(error.render_manifest)
    assert error.gameplay_review['approved'] is False
    assert error.semantic_review['approved'] is True
    assert error.gameplay_review['summary'] not in str(error.diagnostic_events)
    assert error.gameplay_review['summary'] not in str(error.model_calls)


def test_gameplay_repair_revalidates_and_repeats_both_reviews_within_eight_calls():
    program=world_program('design')
    class RepairOnce(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            if model is GameplayReview and sum(item['task']=='review_activity_gameplay' for item in self.calls)==1:
                return gameplay_approval(data,approved=False,recoveryPossible=False,reasonCode='no_recovery',summary='The generated world needs a clear recoverable experiment.')
            return value
    adapter=RepairOnce(program)
    result=asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    assert result.call_count==8
    repair=next(item for item in adapter.calls if item['task']=='repair_activity_game')
    assert repair['data']['repair']['reviewFeedback']['reasonCode']=='no_recovery'
    assert sum(item['task']=='review_activity_program' for item in adapter.calls)==2
    assert sum(item['task']=='review_activity_gameplay' for item in adapter.calls)==2


def test_two_cheap_schema_failures_allow_a_third_fully_reviewed_candidate_inside_the_same_budget():
    program=world_program('tile')
    class RepairTwice(GameplayStub):
        async def call(self,model,task,system,data):
            value=await super().call(model,task,system,data)
            authors=sum(item['task'] in {'compose_activity_game','repair_activity_game'} for item in self.calls)
            if model is ActivityAuthoring and authors<=2:
                raw=value.model_dump()
                next(item for item in raw['world']['materials'] if item['kind']=='unit_tiles')['quantity']=None
                return raw
            return value
    adapter=RepairTwice(program)
    result=asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    assert result.call_count==7
    assert sum(item['task'] in {'compose_activity_game','repair_activity_game'} for item in adapter.calls)==3
    assert [item['task'] for item in adapter.calls[-2:]]==['review_activity_program','review_activity_gameplay']
    assert len(result.diagnostic_events)==2


def test_missing_stage_and_bare_legacy_tools_cannot_satisfy_new_gameplay_admission():
    with pytest.raises(ProgramInvalid,match='playable_stage_required'):
        render_manifest(make_program('design'))


def test_world_only_counterfactual_rejects_a_finish_that_bypasses_the_concept():
    program=world_program('design').model_dump()
    program['goals'][-1]['when']=dict(kind='compare',op='eq',left=dict(kind='state',ref='world-position'),right=dict(kind='literal',value='finish'))
    program['presentation']['stage']['connections'][1]['when']=dict(kind='always')
    from backend.activity_engine_v2.models import ActivityProgram
    with pytest.raises(ProgramInvalid,match='world_only_completion_bypasses_concept'):
        render_manifest(ActivityProgram.model_validate(program))


def test_manifest_represents_actual_initial_tool_visibility_not_hidden_source_text():
    program=world_program('reading'); manifest=render_manifest(program)
    assert manifest['initialRepresentations']==[]
    discovered=[item for item in manifest['authoritativeCheckpoints'] if item['afterOperation']=='inspect_location']
    assert discovered and discovered[0]['representations']
    assert any(material['kind']=='passage' for representation in discovered[0]['representations'] for material in representation['materials'])


def test_manifest_uses_actual_visible_route_surfaces_without_requiring_a_thumbnail():
    from backend.activity_engine_v2.models import ActivityProgram
    from backend.activity_engine_v2.validator import validate_program
    raw=world_program('tile').model_dump()
    for entity in raw['presentation']['stage']['entities']:entity['representationObjectId']=None
    discovery=dict(kind='contains',collection=dict(kind='state',ref='world-inspected'),item=dict(kind='literal',value='work'))
    raw['presentation']['stage']['tools'][0]['availableWhen']=dict(kind='all',conditions=[discovery,
        dict(kind='compare',op='eq',left=dict(kind='state',ref='world-position'),right=dict(kind='literal',value='work'))])
    raw['presentation']['stage']['surfaces']=[dict(id='planks',label='Actual route panels',objectId='board',
        locationId=None,connectionId='concept-route',cellIds=['r0c0','r1c0'],layout='row',actionId='place',visibleWhen=discovery)]
    program=ActivityProgram.model_validate(raw)
    assert validate_program(program).valid
    manifest=render_manifest(program)
    assert manifest['renderer']['physicalSurfaces']['minimumDirectCellPx']==24
    assert 'not an additional physics' in manifest['renderer']['physicalSurfaces']['limitation']
    assert manifest['initialGeometry']==dict(mobileStageHeightPx=410,tabletStageHeightPx=440,desktopStageHeightPx=500)
    assert manifest['initialRepresentations']==[] and manifest['initialStage']['surfaces']==[]
    checkpoint=next(item for item in manifest['authoritativeCheckpoints'] if item['stage']['surfaces'])
    assert checkpoint['stage']['surfaces'][0]['objectId']=='board'
    assert checkpoint['stage']['surfaces'][0]['cellIds']==['r0c0','r1c0']
    assert checkpoint['geometry']==dict(mobileStageHeightPx=500,tabletStageHeightPx=500,desktopStageHeightPx=550)
    assert checkpoint['representations'][0]['objectId']=='board'
    placed=next(item for item in manifest['authoritativeCheckpoints'] if item['afterOperation']=='toggle_tile')
    assert any(cell['selected'] for cell in placed['stage']['surfaces'][0]['cells'])
    final=manifest['authoritativeCheckpoints'][-1]
    assert final['missionComplete']
    assert final['stage']['surfaces'][0]['cellIds']==['r0c0','r1c0']
    assert final['stage']['surfaces'][0]['actionId'] is None
    assert all(not cell['allowed'] for cell in final['stage']['surfaces'][0]['cells'])
    assert not final['stage']['tools'][0]['available']


def test_manifest_includes_a_visible_immutable_whole_without_exposing_an_unavailable_working_tool():
    from backend.activity_engine_v2.models import ActivityProgram
    raw=world_program('fraction').model_dump()
    slots={item['id']:item for item in raw['world']['state']}
    reference=next(obj for obj in raw['world']['objects'] if obj['kind']=='fraction_strip'
        and not any(slots[ref].get('mutable',True) for ref in obj['bindings'].values()))
    raw['presentation']['stage']['surfaces']=[dict(id='reference-whole',label='Fixed whole',objectId=reference['id'],
        locationId='start',connectionId=None,cellIds=[],layout='object',actionId=None,visibleWhen=dict(kind='always'))]
    manifest=render_manifest(ActivityProgram.model_validate(raw))
    assert [item['objectId'] for item in manifest['initialRepresentations']]==[reference['id']]
    assert manifest['initialGeometry']==dict(mobileStageHeightPx=580,tabletStageHeightPx=580,desktopStageHeightPx=620)
    assert manifest['renderer']['mobileGeometry']['stageHeightPx']==580
    assert manifest['renderer']['desktopGeometry']['stageHeightPx']==620
    assert manifest['initialStage']['surfaces'][0]['actionId'] is None
    assert all(entity['representationObjectId'] is None for entity in manifest['initialStage']['entities'])


def test_manifest_binds_real_mount_target_actual_coverage_and_rendered_footprint_contract():
    from backend.activity_engine_v2.models import ActivityProgram
    from backend.activity_engine_v2.validator import validate_program
    raw=world_program('tile').model_dump()
    raw['presentation']['stage']['connections'][1].update(when=dict(kind='always'),
        construction=dict(objectId='board',rows=2,columns=3))
    raw['presentation']['stage']['surfaces']=[dict(id='deck',label='Actual fitted deck',objectId='board',
        locationId=None,connectionId='concept-route',cellIds=[],layout='object',actionId='place',visibleWhen=dict(kind='always'))]
    program=ActivityProgram.model_validate(raw)
    assert validate_program(program).valid
    manifest=render_manifest(program)
    mount=manifest['initialStage']['connections'][1]['construction']
    assert mount['objectId']=='board' and (mount['rows'],mount['columns'])==(2,3)
    assert mount['dimensionsMatch'] is True and mount['complete'] is False and mount['fits'] is False
    assert manifest['initialStage']['connections'][1]['open'] is False
    final=manifest['authoritativeCheckpoints'][-1]['stage']['connections'][1]
    assert final['construction']['complete'] and final['construction']['fits'] and final['open']
    facts=manifest['renderer']['physicalSurfaces']['constructionMounts']
    assert 'Dashed target unit squares' in facts['target']
    assert facts['directCellMinimumPx']==24 and 'every current source cell covered' in facts['route']
    assert manifest['counterfactual']['completedWithoutConcept'] is False
    raw['presentation']['stage']['surfaces'][0]['visibleWhen']=dict(kind='contains',
        collection=dict(kind='state',ref='world-inspected'),item=dict(kind='literal',value='work'))
    hidden=render_manifest(ActivityProgram.model_validate(raw))
    assert hidden['initialStage']['surfaces']==[] and hidden['initialRepresentations']==[]
    hidden_mount=hidden['initialStage']['connections'][1]['construction']
    assert hidden_mount['sourceVisible'] is False and hidden_mount['actualRows'] is None
    assert hidden['initialGeometry']==dict(mobileStageHeightPx=500,tabletStageHeightPx=500,desktopStageHeightPx=550)
    assert 'Hidden source bounds are not inferred' in hidden['renderer']['physicalSurfaces']['constructionMounts']['unitScale']
    raw['presentation']['stage']['connections'].append(dict(id='second-fitting-path',fromLocation='start',toLocation='finish',
        bidirectional=True,when=dict(kind='always'),label='Another fitted crossing',blockedLabel='Build its actual footprint.',
        construction=dict(objectId='board',rows=2,columns=3)))
    raw['presentation']['stage']['surfaces'].extend([
        dict(id='second-deck',label='Second actual mount',objectId='board',locationId=None,connectionId='second-fitting-path',
            cellIds=[],layout='object',actionId='place',visibleWhen=dict(kind='always')),
        dict(id='actual-expression',label='Constructed expression',objectId='equation',locationId='work',connectionId=None,
            cellIds=[],layout='object',actionId=None,visibleWhen=dict(kind='always'))])
    adaptive=render_manifest(ActivityProgram.model_validate(raw))
    assert adaptive['initialGeometry']==dict(mobileStageHeightPx=1140,tabletStageHeightPx=1140,desktopStageHeightPx=920)
    assert 'entry/exit ports' in adaptive['renderer']['physicalSurfaces']['anchors']
    assert 'five-column lanes' in adaptive['renderer']['physicalSurfaces']['placement']


def test_admission_recomputes_render_manifest_and_rejects_tampered_affordances():
    program=world_program('design'); adapter=GameplayStub(program)
    result=asyncio.run(compose_gameplay(context_for(program),adapter=adapter))
    tampered=copy.deepcopy(result.render_manifest)
    tampered['renderer']['mainSurface']='A different renderer'
    with pytest.raises(CompositionFailure,match='render_manifest_integrity_failed'):
        validate_gameplay_review(result.program,result.definition_hash,result.gameplay_review,tampered)
