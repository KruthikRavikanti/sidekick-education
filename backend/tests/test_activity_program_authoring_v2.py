"""Authoring compilation preserves meaning and the actual provider schema is closed."""
import asyncio
import copy
import json

import httpx
import pytest
from pydantic import ValidationError

from backend.activity_engine_v2.authoring import ActivityAuthoring, compile_authoring, to_authoring
from backend.activity_engine_v2.core import ExecutionCore, ProgramInvalid
from backend.gap.vision import _strict_schema, activity_schema_diagnostic, structured_call
from backend.provider import ExtractionError, VisionSettings
from backend.tests.program_composition_examples import context_for, make_program


@pytest.mark.parametrize('kind', ['tile', 'design', 'reading', 'writing'])
def test_authoring_round_trip_preserves_exact_runtime_behavior_and_uses_trusted_intent(kind):
    original = make_program(kind)
    context = context_for(original)
    context['observations'] = [dict(id='supported', skillId=original.intent.targets[0].skillId,
        kind='correct_response', source='uploaded_work', confidence=0.91,
        summary='A supported correct response was observed.')]
    authored = to_authoring(original)
    compiled = compile_authoring(authored, context, model='synthetic-model')
    for field in ('world','components','actions','rules','goals','completion','help','evidence','presentation','limits','witness'):
        assert getattr(compiled, field) == getattr(original, field)
    assert compiled.intent.observations[0].confidence == 0.91
    assert compiled.provenance.origin == 'ai_composed'
    assert compiled.provenance.sourceRefs == []
    final = []
    for program in (original, compiled):
        core = ExecutionCore(program); state = core.initial
        for count, step in enumerate(program.witness):
            state = core.transition(state, step.actionId, step.inputs, action_count=count).state
        final.append(state)
    assert final[0] == final[1]


@pytest.mark.parametrize('change,code', [('binding','duplicate_binding_entry'),('witness','duplicate_witness_input_entry'),('unknown','unknown_witness_input_entry')])
def test_duplicate_or_unknown_map_entries_never_silently_overwrite(change, code):
    program = make_program('design'); raw = to_authoring(program).model_dump()
    if change == 'binding':
        raw['world']['objects'][0]['bindings'].append(copy.deepcopy(raw['world']['objects'][0]['bindings'][0]))
    elif change == 'witness':
        raw['witness'][0]['inputs'].append(copy.deepcopy(raw['witness'][0]['inputs'][0]))
    else:
        raw['witness'][0]['inputs'][0]['inputId'] = 'an-unknown-input'
    with pytest.raises(ProgramInvalid) as captured:
        compile_authoring(raw, context_for(program), model='synthetic-model')
    assert captured.value.code == code


def test_unknown_port_and_forged_context_are_closed_out_of_authoring():
    program = make_program(); raw = to_authoring(program).model_dump()
    raw['world']['objects'][0]['bindings'][0]['port'] = 'execute-code'
    with pytest.raises(ValidationError):
        ActivityAuthoring.model_validate(raw)
    raw = to_authoring(program).model_dump()
    raw['observations'] = [dict(confidence=1, summary='Invented learner state')]
    with pytest.raises(ValidationError):
        ActivityAuthoring.model_validate(raw)
    raw = to_authoring(program).model_dump()
    raw['targets'][0]['demonstration'] = 'An invented curriculum demonstration'
    with pytest.raises(ProgramInvalid, match='trusted_target_mismatch'):
        compile_authoring(raw, context_for(program), model='synthetic-model')


def inspect_schema(value):
    if isinstance(value, list):
        for child in value: inspect_schema(child)
    elif isinstance(value, dict):
        assert 'oneOf' not in value and 'discriminator' not in value
        if value.get('type') == 'object':
            assert value.get('additionalProperties') is False
            assert set(value.get('required', [])) == set(value.get('properties', {}))
        for child in value.values(): inspect_schema(child)


def test_actual_structured_call_schema_preserves_bindings_and_input_entries(monkeypatch):
    program=make_program('design'); content=to_authoring(program).model_dump(); captured=[]
    original = httpx.AsyncClient
    def handler(request):
        payload=json.loads(request.content); captured.append(payload)
        return httpx.Response(200,json=dict(model='returned-synthetic-model', choices=[dict(finish_reason='stop', message=dict(content=json.dumps(content)))]))
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **kwargs: original(transport=httpx.MockTransport(handler), **kwargs))
    metadata={}
    result=asyncio.run(structured_call(ActivityAuthoring,task='compose_activity_program',system='Synthetic authoring.',user={},
        settings=VisionSettings('synthetic-secret','requested-synthetic-model','https://vision.example.test/v1',5),metadata=metadata))
    assert isinstance(result, ActivityAuthoring)
    schema=captured[0]['response_format']['json_schema']['schema']; inspect_schema(schema)
    assert schema['$defs']['AuthoringObject']['properties']['bindings']['type']=='array'
    assert schema['$defs']['AuthoringWitnessStep']['properties']['inputs']['type']=='array'
    assert set(schema['$defs']['BindingEntry']['properties'])=={'port','stateRef'}
    assert set(schema['$defs']['WitnessInputEntry']['properties'])=={'inputId','value'}
    assert metadata==dict(requestedModel='requested-synthetic-model',returnedModel='returned-synthetic-model')
    assert 'synthetic-secret' not in json.dumps(captured[0])


def test_authoring_schema_is_not_the_runtime_dynamic_dictionary_schema():
    from backend.activity_engine_v2.models import ActivityProgram
    runtime=_strict_schema(ActivityProgram.model_json_schema())
    authoring=_strict_schema(ActivityAuthoring.model_json_schema())
    assert runtime['$defs']['WorldObject']['properties']['bindings']['additionalProperties'] is False
    assert not runtime['$defs']['WorldObject']['properties']['bindings'].get('properties')
    assert authoring['$defs']['AuthoringObject']['properties']['bindings']['type']=='array'
    inspect_schema(authoring)


@pytest.mark.parametrize('kind,change',[
    ('tile',dict(text='This belongs in a prompt.')),
    ('tile',dict(items=[dict(id='not-a-tile',text='A narrative item.')])),
    ('tile',dict(quantity=None)),
    ('reading',dict(quantity=3)),
    ('reading',dict(items=[])),
    ('writing',dict(text=None)),
    ('writing',dict(quantity=4)),
])
def test_material_branches_enforce_kind_specific_contract_before_compilation(kind,change):
    raw=to_authoring(make_program(kind)).model_dump()
    wanted='unit_tiles' if kind=='tile' else 'passage' if kind=='reading' else 'prompt'
    material=next(item for item in raw['world']['materials'] if item['kind']==wanted)
    material.update(change)
    with pytest.raises(ValidationError):ActivityAuthoring.model_validate(raw)


@pytest.mark.parametrize('nested',[False,True])
def test_goal_references_are_not_representable_inside_goal_definitions(nested):
    raw=to_authoring(make_program('design')).model_dump()
    illegal=dict(kind='goal',goalId=raw['goals'][0]['id'])
    raw['goals'][0]['when']=dict(kind='all',conditions=[dict(kind='not',condition=illegal)]) if nested else illegal
    with pytest.raises(ValidationError):ActivityAuthoring.model_validate(raw)


def test_provider_schema_material_branches_and_recursive_goal_subset_are_closed():
    schema=_strict_schema(ActivityAuthoring.model_json_schema()); inspect_schema(schema)
    tile=schema['$defs']['TileMaterial']['properties']
    assert tile['text']['type']=='null' and tile['items']['maxItems']==0
    assert tile['quantity']['type']=='integer'
    prompt=schema['$defs']['PromptMaterial']['properties']
    assert prompt['text']['minLength']==1 and prompt['quantity']['type']=='null'
    assert schema['$defs']['PassageMaterial']['properties']['items']['minItems']==2
    visited=set()
    def visit(value):
        if isinstance(value,list):
            for child in value:visit(child)
        elif isinstance(value,dict):
            if '$ref' in value:
                name=value['$ref'].split('/')[-1]
                if name not in visited:
                    visited.add(name);visit(schema['$defs'][name])
            for key,child in value.items():
                if key!='$ref':visit(child)
    visit(schema['$defs']['AuthoringGoal']['properties']['when'])
    assert 'GoalCondition' not in visited
    assert 'LogicCondition' not in visited and 'NotCondition' not in visited


@pytest.mark.parametrize('nested',[False,True])
def test_automatic_assessment_cannot_reference_a_goal_at_any_depth(nested):
    raw=to_authoring(make_program('design')).model_dump()
    goal_ref=dict(kind='goal',goalId=raw['goals'][0]['id'])
    raw['evidence'][0]['assessment']['when']=dict(kind='all',conditions=[dict(kind='not',condition=goal_ref)]) if nested else goal_ref
    with pytest.raises(ValidationError):ActivityAuthoring.model_validate(raw)


def test_provider_automatic_assessment_uses_same_goal_free_recursive_predicate_subset():
    schema=_strict_schema(ActivityAuthoring.model_json_schema()); inspect_schema(schema)
    automatic=schema['$defs']['AuthoringAutomaticAssessment']['properties']['when']
    assert automatic==schema['$defs']['AuthoringGoal']['properties']['when']
    assert {'$ref':'#/$defs/GoalCondition'} not in automatic['anyOf']


@pytest.mark.parametrize('code,change',[
    ('stage_entity_requires_one_placement',dict(kind='device',objectId=None,locationId=None)),
    ('stage_actor_requires_object',dict(kind='actor',objectId=None,locationId='work')),
    ('stage_destination_requires_location',dict(kind='destination',objectId='world-movable',locationId=None)),
])
def test_stage_entity_diagnostics_forward_only_known_model_codes_and_owned_paths(code,change):
    from backend.tests.program_world_examples import world_program
    raw=to_authoring(world_program('tile')).model_dump()
    entity=raw['presentation']['stage']['entities'][1]
    entity.update(change,label='private-value-must-never-be-diagnostic')
    with pytest.raises(ValidationError) as captured:ActivityAuthoring.model_validate(raw)
    diagnostic=activity_schema_diagnostic(captured.value,ActivityAuthoring)
    assert diagnostic==dict(stage='schema',code=code,sceneIndex=None,field='presentation.stage.entities.1')
    assert 'private-value' not in json.dumps(diagnostic)


def test_fixed_device_is_representable_without_inventing_movement_state():
    from backend.tests.program_world_examples import world_program
    raw=to_authoring(world_program('tile')).model_dump()
    raw['presentation']['stage']['entities'][1]['kind']='device'
    assert ActivityAuthoring.model_validate(raw).presentation.stage.entities[1].locationId=='work'


def test_actual_provider_schema_failure_carries_safe_stage_entity_reason(monkeypatch):
    from backend.tests.program_world_examples import world_program
    content=to_authoring(world_program('tile')).model_dump()
    content['presentation']['stage']['entities'][1].update(kind='actor',label='private-generated-entity-content')
    original=httpx.AsyncClient
    def handler(request):
        return httpx.Response(200,json=dict(model='synthetic',choices=[dict(finish_reason='stop',message=dict(content=json.dumps(content)))]))
    monkeypatch.setattr(httpx,'AsyncClient',lambda **kwargs:original(transport=httpx.MockTransport(handler),**kwargs))
    with pytest.raises(ExtractionError) as captured:
        asyncio.run(structured_call(ActivityAuthoring,task='compose_activity_game',system='Synthetic test.',user={},
            settings=VisionSettings('synthetic-secret','synthetic','https://vision.example.test/v1',5)))
    assert captured.value.diagnostic['code']=='stage_actor_requires_object'
    assert captured.value.diagnostic['field']=='presentation.stage.entities.1'
    assert 'private-generated' not in str(captured.value)+json.dumps(captured.value.diagnostic)


def test_physical_surface_authoring_preserves_actual_object_route_and_direct_action():
    from backend.tests.program_world_examples import world_program
    original=world_program('tile')
    raw=to_authoring(original).model_dump()
    surface=dict(id='actual-planks',label='Constructed panels on the route',objectId='board',
        locationId=None,connectionId='concept-route',cellIds=['r0c0','r1c0'],layout='row',
        actionId='place',visibleWhen=dict(kind='always'))
    raw['presentation']['stage']['surfaces']=[surface]
    authored=ActivityAuthoring.model_validate(raw)
    compiled=compile_authoring(authored,context_for(original),model='synthetic')
    assert compiled.presentation.stage.surfaces[0].model_dump()==surface
    authored.presentation.stage.surfaces[0].locationId='work'
    with pytest.raises(ValidationError) as captured:ActivityAuthoring.model_validate(authored.model_dump())
    diagnostic=activity_schema_diagnostic(captured.value,ActivityAuthoring)
    assert diagnostic['code']=='stage_surface_requires_one_anchor'
    assert diagnostic['field']=='presentation.stage.surfaces.0'


def test_construction_mount_roundtrip_keeps_closed_actual_grid_constraint_and_legacy_shape():
    from backend.tests.program_world_examples import world_program
    original=world_program('tile')
    raw=to_authoring(original).model_dump()
    assert 'construction' not in raw['presentation']['stage']['connections'][1]
    construction=dict(objectId='board',rows=2,columns=3)
    raw['presentation']['stage']['connections'][1].update(construction=construction,when=dict(kind='always'))
    raw['presentation']['stage']['surfaces']=[dict(id='actual-deck',label='Actual deck footprint',objectId='board',
        locationId=None,connectionId='concept-route',cellIds=[],layout='object',actionId='place',visibleWhen=dict(kind='always'))]
    authored=ActivityAuthoring.model_validate(raw)
    compiled=compile_authoring(authored,context_for(original),model='synthetic')
    assert compiled.presentation.stage.connections[1].construction.model_dump()==construction
    from backend.activity_engine_v2.validator import validate_program
    assert validate_program(compiled).valid
    schema=_strict_schema(ActivityAuthoring.model_json_schema());inspect_schema(schema)
    assert set(schema['$defs']['StageConstruction']['properties'])=={'objectId','rows','columns'}
    raw['presentation']['stage']['connections'][1]['construction']['rows']=True
    with pytest.raises(ValidationError):ActivityAuthoring.model_validate(raw)
