"""World consequences derive from actual concept state, never a second engine."""
import copy
from dataclasses import replace
import json
import uuid

import pytest

from backend.activity_engine_v2.core import ExecutionCore, ProgramInvalid
from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.validator import validate_program
from backend.tests.account_helpers import mutate
from backend.tests.program_world_examples import world_program


def admitted(kind='tile',loop='route'):
    program=world_program(kind,loop)
    report=validate_program(program)
    assert report.valid,report.issues
    validate_runtime_compatibility(program)
    return program


def act(core,state,action,inputs):
    return core.transition(state,action,inputs).state


@pytest.mark.parametrize('kind',['tile','design','reading','writing','fraction'])
@pytest.mark.parametrize('loop',['route','attach'])
def test_same_world_kernel_supports_concept_tools_and_distinct_loops(kind,loop):
    program=admitted(kind,loop)
    core=ExecutionCore(program)
    state=core.initial
    original=copy.deepcopy(state)
    view=core.stage_view(state)
    assert view['entities'] and view['locations'] and not core.completed(state)
    assert state==original  # Projections/dry runs never create child actions.
    for step in program.witness:
        state=act(core,state,step.actionId,step.inputs)
    assert core.completed(state)
    view=core.stage_view(state)
    assert any(entity['currentStatus']=='active' for entity in view['entities'])
    if loop=='route':assert next(edge for edge in view['connections'] if edge['id']=='concept-route')['open']


def test_discovery_reveals_real_materials_and_tool_actions_without_leaking_gate_predicates():
    core=ExecutionCore(admitted('reading'))
    state=core.initial
    assert 'case-tools' not in core.stage_component_ids(state)
    assert all(entity['representationObjectId'] is None for entity in core.stage_view(state)['entities'])
    with pytest.raises(ProgramInvalid,match='stage_tool_unavailable'):
        act(core,state,'place-clue',{'sentence':'shelter'})
    state=act(core,state,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    view=core.stage_view(state)
    assert 'case-tools' in core.stage_component_ids(state)
    assert any(entity['representationObjectId']=='case-board' for entity in view['entities'])
    assert next(location for location in view['locations'] if location['id']=='work')['inspected']
    assert 'when' not in json.dumps(view)


def test_shared_fraction_tool_can_attach_reference_and_working_entities_with_independent_availability():
    raw=world_program('fraction','route').model_dump()
    stage=raw['presentation']['stage']
    stage['entities'][0]['representationObjectId']='working'
    stage['entities'][1]['representationObjectId']='reference'
    stage['tools'].append(dict(componentId='fraction-tools',entityId='traveler',
        availableWhen={'kind':'contains','collection':{'kind':'state','ref':'world-inspected'},
                       'item':{'kind':'literal','value':'start'}},label='Work on the carried construction'))
    program=ActivityProgram.model_validate(raw)
    report=validate_program(program)
    assert report.valid,report.issues
    validate_runtime_compatibility(program)
    core=ExecutionCore(program)
    assert 'fraction-tools' not in core.stage_component_ids(core.initial)
    state=act(core,core.initial,'world-inspect',{'location':'start'})
    assert 'fraction-tools' in core.stage_component_ids(state)
    view=core.stage_view(state)
    assert [tool['available'] for tool in view['tools']]==[False,True]
    entities={entity['id']:entity for entity in view['entities']}
    assert entities['workbench']['toolComponentIds']==[]
    assert entities['traveler']['toolComponentIds']==['fraction-tools']
    assert entities['workbench']['representationObjectId']=='reference'
    assert entities['traveler']['representationObjectId']=='working'


def test_fixed_device_can_show_actual_grid_tool_without_becoming_a_movable_piece():
    raw=world_program('tile','route').model_dump()
    raw['presentation']['stage']['entities'][1].update(kind='device',asset='bridge')
    program=ActivityProgram.model_validate(raw)
    report=validate_program(program)
    assert report.valid,report.issues
    validate_runtime_compatibility(program)
    core=ExecutionCore(program)
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    device=next(entity for entity in core.stage_view(state)['entities'] if entity['id']=='workbench')
    assert device['kind']=='device' and device['objectId'] is None and device['locationId']=='work'
    assert device['representationObjectId']=='board' and device['toolComponentIds']==['tools']
    assert device['actionIds']==[]  # Native move/place operations still need a bound stage_piece.
    for step in program.witness[2:]:state=act(core,state,step.actionId,step.inputs)
    assert core.completed(state)


@pytest.mark.parametrize('mutation,code',[
    ('both','stage_entity_requires_one_placement'),
    ('neither','stage_entity_requires_one_placement'),
    ('actor-fixed','stage_actor_requires_object'),
    ('destination-movable','stage_destination_requires_location'),
])
def test_fixed_device_support_does_not_relax_placement_or_actor_identity(mutation,code):
    from pydantic import ValidationError
    from backend.activity_engine_v2.models import StageEntity
    raw=dict(id='some-device',label='A fixed or carried device',kind='device',asset='gear',
             objectId=None,locationId='work',representationObjectId='board')
    if mutation=='both':raw['objectId']='world-movable'
    elif mutation=='neither':raw['locationId']=None
    elif mutation=='actor-fixed':raw['kind']='actor'
    elif mutation=='destination-movable':raw.update(kind='destination',objectId='world-movable',locationId=None)
    with pytest.raises(ValidationError) as caught:
        StageEntity.model_validate(raw)
    assert code in str(caught.value.errors()[0]['ctx']['error'])


@pytest.mark.parametrize('mutation,code,path',[
    ('missing-component','stage_tool_component_unknown','presentation.stage.tools.0.componentId'),
    ('world-component','stage_tool_world_component_forbidden','presentation.stage.tools.0.componentId'),
    ('missing-entity','stage_tool_entity_unknown','presentation.stage.tools.0.entityId'),
    ('duplicate-pair','stage_tool_attachment_duplicate','presentation.stage.tools.1'),
])
def test_stage_tool_binding_rejections_have_precise_safe_codes_and_indexed_paths(mutation,code,path):
    raw=world_program().model_dump()
    stage=raw['presentation']['stage']
    if mutation=='missing-component':stage['tools'][0]['componentId']='missing'
    elif mutation=='world-component':stage['tools'][0]['componentId']='world-controls'
    elif mutation=='missing-entity':stage['tools'][0]['entityId']='missing'
    elif mutation=='duplicate-pair':stage['tools'].append(copy.deepcopy(stage['tools'][0]))
    report=validate_program(raw)
    assert not report.valid and (report.issues[0].code,report.issues[0].path)==(code,path)


def test_incorrect_clue_keeps_route_closed_then_recovery_changes_world_before_finish():
    core=ExecutionCore(admitted('reading'))
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    state=act(core,state,'place-clue',{'sentence':'paint'})
    assert not next(edge for edge in core.stage_view(state)['connections'] if edge['id']=='concept-route')['open']
    original=copy.deepcopy(state)
    with pytest.raises(ProgramInvalid,match='stage_connection_closed'):
        act(core,state,'world-move',{'destination':'finish'})
    assert state==original and not core.completed(state)
    state=act(core,state,'place-clue',{'sentence':'shelter'})
    assert not core.completed(state)
    assert next(edge for edge in core.stage_view(state)['connections'] if edge['id']=='concept-route')['open']
    assert any(entity['currentStatus']=='active' for entity in core.stage_view(state)['entities'])
    state=act(core,state,'world-move',{'destination':'finish'})
    assert core.completed(state)


def test_navigation_cannot_teleport_and_reversible_route_remains_available():
    core=ExecutionCore(admitted())
    with pytest.raises(ProgramInvalid,match='stage_destination_not_adjacent'):
        act(core,core.initial,'world-move',{'destination':'finish'})
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-move',{'destination':'start'})
    assert state['world-position']=='start'


def test_device_configuration_can_try_wrong_port_recover_and_use_actual_construction():
    program=admitted('design','attach')
    core=ExecutionCore(program)
    state=act(core,core.initial,'world-move',{'destination':'finish'})
    assert not core.completed(state)
    for step in program.witness[:-1]:state=act(core,state,step.actionId,step.inputs)
    assert not core.completed(state)
    assert any(entity['currentStatus']=='blocked' for entity in core.stage_view(state)['entities'])
    state=act(core,state,'world-move',{'destination':'start'})
    state=act(core,state,'world-move',{'destination':'work'})
    assert core.completed(state)


def test_attachment_capacity_is_conserved_and_multiple_piece_actions_are_unambiguous():
    raw=world_program('design','attach').model_dump()
    raw['presentation']['stage']['locations'][1]['capacity']=1
    raw['world']['state'].append(dict(id='other-position',kind='choice',initial='start',options=['start','work','finish']))
    raw['world']['objects'].append(dict(id='other-piece',kind='stage_piece',bindings=dict(location='other-position')))
    raw['components'][-1]['objectIds'].append('other-piece')
    raw['presentation']['stage']['entities'].append(dict(id='other-entity',label='Other device',kind='device',
        objectId='other-piece',locationId=None,asset='parcel',representationObjectId=None))
    raw['actions'].append(dict(id='place-other',componentId='world-controls',operation='place_piece',
        inputs=[dict(id='destination',kind='choice',options=['start','work','finish'])],label='Place another device'))
    raw['rules'].append(dict(id='move-other',onAction='place-other',when=dict(kind='always'),
        effects=[dict(kind='set',target='other-position',value=dict(kind='input',ref='destination'))]))
    program=ActivityProgram.model_validate(raw)
    assert validate_program(program).valid
    validate_runtime_compatibility(program)
    core=ExecutionCore(program)
    state=act(core,core.initial,'world-move',{'destination':'work'})
    original=copy.deepcopy(state)
    with pytest.raises(ProgramInvalid,match='stage_location_capacity_exceeded'):
        act(core,state,'place-other',{'destination':'work'})
    assert state==original
    state=act(core,state,'world-move',{'destination':'finish'})
    state=act(core,state,'place-other',{'destination':'work'})
    assert state['world-position']=='finish' and state['other-position']=='work'


def test_incorrect_numeric_construction_cannot_open_the_travel_connection():
    program=admitted('tile')
    core=ExecutionCore(program)
    state=core.initial
    for step in program.witness[:-2]:
        state=act(core,state,step.actionId,step.inputs)
    state=act(core,state,'multiply',{'left':2,'right':3,'result':5})
    assert state['product']==5
    assert core.stage_view(state)['connections'][1]['open'] is False
    with pytest.raises(ProgramInvalid,match='stage_connection_closed'):
        act(core,state,'world-move',{'destination':'finish'})
    state=act(core,state,'multiply',{'left':2,'right':3,'result':6})
    assert core.stage_view(state)['connections'][1]['open'] is True


@pytest.mark.parametrize('mutation,code',[
    ('unknown-location','stage_location_unknown'),
    ('duplicate-entity','duplicate_id'),
    ('representation-proxy','stage_representation_invalid'),
    ('no-real-consequence','stage_requires_conceptual_consequences'),
    ('invented-input','operation_must_use_child_input'),
    ('world-only-assessment','unsupported_automatic_assessment'),
    ('world-state-score','world_success_is_not_learning_evidence'),
    ('parent-arrival-only','world_success_is_not_learning_evidence'),
])
def test_stage_contract_rejects_forged_scene_and_world_success_scoring(mutation,code):
    raw=world_program().model_dump()
    stage=raw['presentation']['stage']
    if mutation=='unknown-location':stage['entities'][1]['locationId']='missing'
    elif mutation=='duplicate-entity':stage['entities'][1]['id']=stage['entities'][0]['id']
    elif mutation=='representation-proxy':stage['entities'][1]['representationObjectId']='world-movable'
    elif mutation=='no-real-consequence':
        for edge in stage['connections']:edge['when']={'kind':'always'}
        for reaction in stage['reactions']:reaction['when']={'kind':'always'}
    elif mutation=='invented-input':raw['rules'][-2]['effects'][0]['value']={'kind':'literal','value':'finish'}
    elif mutation=='world-only-assessment':
        raw['evidence'][0]['actionIds']=['world-move']
        raw['evidence'][0]['stateRefs']=['world-position']
        raw['evidence'][0]['assessment']['when']={'kind':'compare','op':'eq',
            'left':{'kind':'state','ref':'world-position'},'right':{'kind':'literal','value':'finish'}}
    elif mutation=='world-state-score':
        raw['evidence'][0]['assessment']['when']={'kind':'compare','op':'eq',
            'left':{'kind':'state','ref':'world-position'},'right':{'kind':'literal','value':'finish'}}
    elif mutation=='parent-arrival-only':
        raw['evidence'][0].update(actionIds=['world-move'],stateRefs=['world-position'],
            assessment={'kind':'parent_review','rubric':['The child arrived at the destination.']})
    report=validate_program(raw)
    assert not report.valid and report.issues[0].code==code


def test_post_action_reactions_are_derived_from_accepted_state_without_mutating_it():
    core=ExecutionCore(admitted('reading'))
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    before=core.stage_view(state)
    state=act(core,state,'place-clue',{'sentence':'shelter'})
    accepted=copy.deepcopy(state)
    after=core.stage_view(state)
    assert state==accepted
    assert before['connections'][1]['open'] is False and after['connections'][1]['open'] is True
    assert len(state)==len(core.initial)  # No hidden success flags or rule cascades.


@pytest.mark.parametrize('kind',['reading','writing'])
def test_owned_world_projection_help_refresh_and_exact_replay(kid_client,security_context,monkeypatch,tmp_path,kind):
    from backend.activity_engine_v2 import preview
    program=admitted(kind)
    path=tmp_path/'world-contract.json';path.write_text(program.model_dump_json())
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW','true')
    monkeypatch.setitem(preview.FIXTURE_PATHS,'synthetic-world',path)
    prefix='/api/activity-programs'
    def post(endpoint,body):
        version=kid_client.get('/api/auth/session').json()['version']
        return mutate(kid_client,'POST',prefix+endpoint,json=body,headers={'X-Sidekick-Profile-Version':str(version)})
    response=post('/preview/synthetic-world/sessions',{'requestId':'world-start'})
    assert response.status_code==200,response.text
    view=response.json()
    assert view['stageView'] and not view['materials']
    assert not any(action['operation']=='select_evidence' for action in view['actions'])
    assert view['help']==[] and not view['assistance']['received']
    guessed=post(f"/sessions/{view['id']}/help",{'requestId':'guessed-hidden-help',
        'expectedRevision':view['revision'],'helpId':'small-hint'})
    assert guessed.status_code==409 and guessed.json()['error']['code']=='help_unavailable'
    assert kid_client.get(prefix+f"/sessions/{view['id']}").json()==view
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_events WHERE session_id=?',(view['id'],)).fetchone()[0]==0
        saved=connection.execute('SELECT assistance_json,revision FROM activity_program_sessions WHERE id=?',(view['id'],)).fetchone()
        assert json.loads(saved['assistance_json'])=={} and saved['revision']==0
    for index,step in enumerate(program.witness):
        response=post(f"/sessions/{view['id']}/actions",{'requestId':str(uuid.uuid4()),'expectedRevision':view['revision'],
                      'actionId':step.actionId,'inputs':step.inputs})
        assert response.status_code==200,response.text
        view=response.json()
        if index==1:
            assert view['materials']
            assert any(item['id']=='small-hint' for item in view['help'])
            if kind=='reading':assert any(material['kind']=='passage' for material in view['materials'])
            helped=post(f"/sessions/{view['id']}/help",{'requestId':'world-help','expectedRevision':view['revision'],'helpId':'small-hint'})
            assert helped.status_code==200,helped.text
            view=helped.json()
    assert view['status']=='completed' and view['outcome']['assisted']
    assert view['outcome']['assessment']==('pending_parent_review' if kind=='writing' else 'demonstrated')
    assert kid_client.get(prefix+f"/sessions/{view['id']}").json()==view
    replay=post(f"/sessions/{view['id']}/replay",{'expectedRevision':view['revision']})
    assert replay.status_code==200 and replay.json()['verified']
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0]==0


def test_trusted_stage_start_requires_hash_bound_gameplay_approval(kid_client,security_context):
    from starlette.requests import Request
    from backend.accounts.security import AccountError
    from backend.activity_engine_v2.composer import ApprovedProgram
    from backend.activity_engine_v2.gameplay import canonical_hash,render_manifest
    from backend.activity_engine_v2.service import _hash,start_approved
    from backend.tests.gameplay_examples import gameplay_approval
    from backend.tests.test_activity_program_composer_v2 import approval
    program=admitted('reading')
    program.provenance=program.provenance.model_copy(update=dict(origin='ai_composed',model='synthetic-model',promptVersion='synthetic-game-v1'))
    digest=_hash(program.model_dump())
    semantic=approval(dict(definitionHash=digest,definition=program.model_dump()))
    manifest=render_manifest(program)
    play=gameplay_approval(dict(definitionHash=digest,renderManifestHash=canonical_hash(manifest)))
    approved=ApprovedProgram(program,digest,'synthetic-model',[],semantic,5,[],gameplay_review=play)
    token=kid_client.cookies.get(security_context.settings.session_cookie)
    active=security_context.session(Request({'type':'http','headers':[(b'cookie',('sidekick_session='+token).encode())]}))
    for rejected in [replace(approved,gameplay_review=None),
                     replace(approved,gameplay_review=play.model_copy(update=dict(renderManifestHash='0'*64))),
                     replace(approved,gameplay_review=play.model_copy(update=dict(mainStagePlayable=False)))]:
        with security_context.db.transaction() as connection:
            with pytest.raises(AccountError,match='gameplay_approval_integrity_failed'):
                start_approved(connection,security_context,active.active_kid_profile_id,rejected,active)
            assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0]==0
    with security_context.db.transaction() as connection:
        created=start_approved(connection,security_context,active.active_kid_profile_id,approved,active)
        assert created['actionCount']==created['revision']==0 and created['status']=='in_progress'
        assert created['stageView'] and not created['materials']
