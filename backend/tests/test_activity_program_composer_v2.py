"""Live composition admission, exact-hash review, bounded repair and honest evidence."""
import asyncio
import copy

import pytest

from backend.activity_engine_v2.authoring import ActivityAuthoring, to_authoring
from backend.activity_engine_v2.composer import CompositionFailure, SemanticReview, admit_authoring, compose
from backend.activity_engine_v2 import preview
from backend.provider import ExtractionError
from backend.tests.program_composition_examples import context_for, make_program


def approval(data, **changes):
    raw=dict(definitionHash=data['definitionHash'],approved=True,targetNecessary=True,
        meaningfulConsequences=True,materialsSuitable=True,goalAchievable=True,helpRelevant=True,
        scoringCorrectAcrossRoutes=True,shortcutsPrevented=True,parentAssessmentAppropriate=True,
        requiresParentReview=any(item['assessment']['kind']=='parent_review' for item in data['definition']['evidence']),
        reasonCode='approved',summary='Synthetic independent review of the exact candidate.')
    raw.update(changes)
    return SemanticReview(**raw)


class Stub:
    model='synthetic-configured-model'
    def __init__(self, programs, review_changes=None):
        self.programs=list(programs); self.calls=[]; self.metadata=[]; self.review_changes=review_changes or {}
    async def call(self, response_model, task, system, data):
        self.calls.append(dict(task=task,data=copy.deepcopy(data),system=system))
        self.metadata.append(dict(task=task,requestedModel=self.model,returnedModel='returned-synthetic-model'))
        if response_model is SemanticReview:return approval(data,**self.review_changes)
        program=self.programs.pop(0) if len(self.programs)>1 else self.programs[0]
        return program if isinstance(program, ActivityAuthoring) else to_authoring(program)


@pytest.mark.parametrize('kind',['tile','design','reading','writing'])
def test_original_stub_candidates_validate_review_and_start_from_initial_without_loading_fixtures(kind,monkeypatch):
    program=make_program(kind); context=context_for(program); adapter=Stub([program])
    monkeypatch.setattr(preview,'FIXTURE_PATHS',{})
    monkeypatch.setattr(preview,'load_preview',lambda *_:pytest.fail('Composition must not select a finished fixture.'))
    stages=[]
    result=asyncio.run(compose(context,adapter=adapter,progress=stages.append))
    assert result.program.provenance.origin=='ai_composed'
    assert result.program.world.state==program.world.state
    assert result.program.intent.observations==[]
    assert result.definition_hash==result.review.definitionHash
    assert result.review.approved
    assert result.call_count==2
    assert result.returned_models==['returned-synthetic-model','returned-synthetic-model']
    assert stages==['composing','validating','reviewing']
    assert adapter.calls[1]['data']['definition']==result.program.model_dump()
    assert 'fixtures' not in adapter.calls[0]['data']
    if kind=='writing':assert result.review.requiresParentReview


def test_supported_context_changes_prompt_emphasis_and_is_injected_without_model_facts():
    program=make_program('design'); context=context_for(program)
    context['observations']=[dict(id='source',skillId=program.intent.targets[0].skillId,
        kind='assisted_success',source='activity_history',confidence=0.87,summary='A saved construction was completed with relevant help.')]
    context['history']=[dict(assessment='demonstrated',assisted=True,operations=['toggle_tile','assemble_product'])]
    context['previousSignatures']=[dict(operations=['toggle_tile','assemble_product'])]
    adapter=Stub([program]); result=asyncio.run(compose(context,adapter=adapter))
    assert adapter.calls[0]['data']['context']==context
    assert result.program.intent.observations[0].confidence==0.87
    assert 'not just' in adapter.calls[0]['system']


def test_failed_trace_is_repaired_as_new_candidate_and_only_final_hash_is_reviewed():
    bad=to_authoring(make_program('design')).model_dump()
    bad['witness'][0]['inputs'][0]['value']=1
    bad=ActivityAuthoring.model_validate(bad)
    good=make_program('design'); adapter=Stub([bad,good])
    result=asyncio.run(compose(context_for(good),adapter=adapter))
    assert [call['task'] for call in adapter.calls]==['compose_activity_program','repair_activity_program','review_activity_program']
    assert adapter.calls[1]['data']['repair']['stage']=='witness'
    assert result.call_count==3
    assert result.diagnostic_events==[dict(attempt=1,stage='witness',code='witness_does_not_finish_mission',path='witness')]
    assert adapter.calls[-1]['data']['definitionHash']==result.definition_hash


def test_witness_action_budget_failure_repairs_the_candidate_without_silent_normalization():
    good=make_program('tile'); raw=to_authoring(good).model_dump()
    raw['limits']['maxActions']=2  # Two operation definitions still require seven child moves.
    bad=ActivityAuthoring.model_validate(raw); adapter=Stub([bad,good])
    result=asyncio.run(compose(context_for(good),adapter=adapter))
    assert result.diagnostic_events==[dict(attempt=1,stage='witness',code='witness_action_budget_exceeded',path='witness')]
    assert adapter.calls[1]['data']['repair']['candidate']['limits']['maxActions']==2
    assert result.program.limits.maxActions==100 and result.call_count==3
    assert 'INDIVIDUAL CHILD MOVES' in adapter.calls[0]['system']
    assert '100' in adapter.calls[1]['data']['repair']['guidance']


def test_static_material_and_goal_repair_advice_contains_no_private_path_or_input():
    from backend.activity_engine_v2.composer import repair_guidance
    for code in ('invalid_tile_material','invalid_goal_reference','activity_schema_invalid'):
        advice=repair_guidance(code,'PRIVATE_STUDENT_PATH')
        assert 'PRIVATE_STUDENT_PATH' not in advice
        assert 'null' in advice or 'goal' in advice


def test_exact_semantic_feedback_guides_a_new_candidate_that_is_fully_revalidated_and_reviewed():
    first=make_program('tile'); revised=make_program('design')
    finding='Require a decision that connects the child construction to the target; a related easier action can bypass the intended demonstration.'
    class ReviewThenRepair(Stub):
        def __init__(self):super().__init__([first,revised]);self.reviews=0
        async def call(self,response_model,task,system,data):
            result=await super().call(response_model,task,system,data)
            if response_model is SemanticReview:
                self.reviews+=1
                if self.reviews==1:
                    return approval(data,approved=False,shortcutsPrevented=False,
                                    reasonCode='shortcut_bypasses_skill',summary=finding)
            return result
    adapter=ReviewThenRepair()
    result=asyncio.run(compose(context_for(first),adapter=adapter))
    assert [item['task'] for item in adapter.calls]==[
        'compose_activity_program','review_activity_program','repair_activity_program','review_activity_program']
    first_review=adapter.calls[1]['data']
    repair=adapter.calls[2]['data']['repair']
    assert repair['reviewFeedback']['definitionHash']==first_review['definitionHash']
    assert repair['reviewFeedback']['summary']==finding
    assert repair['reviewFeedback']['shortcutsPrevented'] is False
    assert repair['reviewFeedback']['targetNecessary'] is True
    assert result.definition_hash==adapter.calls[3]['data']['definitionHash']
    assert result.definition_hash!=first_review['definitionHash']
    assert result.program.id==revised.id
    assert result.call_count==4 and adapter.reviews==2
    assert finding not in str(result.diagnostic_events)
    assert finding not in str(result.model_calls)


def test_ephemeral_review_feedback_never_enters_public_error_or_safe_audit_metadata(caplog):
    program=make_program('design')
    finding='EPHEMERAL_GENERATED_DEFINITION_FEEDBACK'
    adapter=Stub([program],dict(approved=False,shortcutsPrevented=False,
        reasonCode='shortcut_bypasses_skill',summary=finding))
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose(context_for(program),adapter=adapter))
    error=captured.value
    assert error._review_feedback['summary']==finding
    for safe in (str(error),str(error.diagnostic_events),str(error.model_calls),caplog.text):
        assert finding not in safe
    assert adapter.calls[2]['data']['repair']['reviewFeedback']['summary']==finding
    assert adapter.calls[4]['data']['repair']['reviewFeedback']['summary']==finding


@pytest.mark.parametrize('failure',['transport_format','model_validation','unavailable'])
def test_malformed_review_has_review_stage_and_bounded_repair_while_transport_failures_stay_provider(failure):
    program=make_program('design')
    class InvalidReview(Stub):
        async def call(self,response_model,task,system,data):
            result=await super().call(response_model,task,system,data)
            if response_model is SemanticReview:
                if failure=='transport_format':
                    raise ExtractionError('invalid_extraction','PRIVATE MALFORMED REVIEW')
                if failure=='unavailable':
                    raise ExtractionError('provider_unavailable','PRIVATE PROVIDER BODY')
                return SemanticReview.model_validate(dict(approved=True))
            return result
    adapter=InvalidReview([program])
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose(context_for(program),adapter=adapter))
    expected=('provider','provider_unavailable') if failure=='unavailable' else ('review','review_response_invalid')
    assert (captured.value.stage,captured.value.code)==expected
    assert captured.value.call_count==6
    assert len(adapter.calls)==6
    repair=adapter.calls[2]['data']['repair']
    assert (repair['stage'],repair['reasonCode'])==expected
    assert repair['candidate'] is not None and repair['reviewFeedback'] is None
    assert 'PRIVATE' not in str(captured.value.diagnostic_events)


@pytest.mark.parametrize('changes,code',[
    (dict(definitionHash='0'*64),'review_hash_mismatch'),
    (dict(approved=False,reasonCode='shortcut_bypasses_skill',shortcutsPrevented=False),'shortcut_bypasses_skill'),
    (dict(scoringCorrectAcrossRoutes=False),'semantic_review_rejected'),
    (dict(requiresParentReview=True),'semantic_review_rejected'),
])
def test_reviewer_cannot_approve_another_hash_or_skip_required_gates(changes,code):
    program=make_program('design'); adapter=Stub([program],changes)
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose(context_for(program),adapter=adapter))
    assert captured.value.stage=='review' and captured.value.code==code
    assert len(adapter.calls)==6
    assert captured.value.call_count==6
    assert captured.value.requested_model==adapter.model
    assert len(captured.value.model_calls)==6
    assert captured.value.diagnostic_events==[dict(attempt=index,stage='review',code=code) for index in (1,2,3)]
    assert sum(call['task']=='review_activity_program' for call in adapter.calls)==3


@pytest.mark.parametrize('witness',[None,[]])
def test_no_witness_is_explicitly_rejected_despite_offline_validity(witness):
    program=make_program(); raw=to_authoring(program).model_dump(); raw['witness']=witness
    with pytest.raises(CompositionFailure) as captured:
        admit_authoring(raw,context_for(program),'synthetic-model')
    assert captured.value.stage=='witness' and captured.value.code=='verified_finish_required'


@pytest.mark.parametrize('mutation,stage,code',[
    ('unsupported','capability','runtime_adapter_unavailable'),
    ('materials','schema','grid_tile_material_required'),
    ('forged','schema','trusted_target_mismatch'),
    ('initial_score','scoring','assessment_initially_satisfied'),
    ('finish_score','scoring','finish_assessment_inconsistent'),
])
def test_unplayable_or_invalid_scoring_candidates_never_reach_review(mutation,stage,code):
    program=make_program('design'); raw=to_authoring(program).model_dump()
    if mutation=='unsupported':raw['actions'][0]['operation']='reorder'
    elif mutation=='materials':raw['world']['objects'][0]['materialIds']=['mission-note']
    elif mutation=='forged':raw['targets'][0]['demonstration']='Invented target'
    elif mutation=='initial_score':raw['evidence'][0]['assessment']['when']=dict(kind='compare',op='gte',left=dict(kind='state',ref='product'),right=dict(kind='literal',value=0))
    else:raw['evidence'][0]['assessment']['when']=dict(kind='compare',op='eq',left=dict(kind='state',ref='product'),right=dict(kind='literal',value=99))
    with pytest.raises(CompositionFailure) as captured:
        admit_authoring(raw,context_for(program),'synthetic-model')
    assert (captured.value.stage,captured.value.code)==(stage,code)


def test_total_deadline_bounds_provider_and_never_returns_a_partial_program():
    program=make_program()
    class Slow(Stub):
        async def call(self,*args):
            await asyncio.sleep(0.1)
            return await super().call(*args)
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose(context_for(program),adapter=Slow([program]),budget_seconds=0.01))
    assert captured.value.code=='generation_deadline_exceeded'


def test_provider_failures_are_bounded_and_safe_without_finished_fixture_fallback(caplog):
    program=make_program()
    class Failed(Stub):
        async def call(self,*args):
            self.calls.append(args)
            raise ExtractionError('provider_timeout','PRIVATE BODY MUST NOT BE LOGGED')
    adapter=Failed([program])
    with pytest.raises(CompositionFailure) as captured:
        asyncio.run(compose(context_for(program),adapter=adapter))
    assert captured.value.stage=='provider' and captured.value.code=='provider_timeout'
    assert len(adapter.calls)==3
    assert 'PRIVATE' not in str(captured.value)
    assert 'PRIVATE' not in caplog.text
