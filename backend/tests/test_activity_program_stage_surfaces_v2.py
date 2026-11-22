"""Physical stage surfaces are views/actions on real concept state, not copies."""
import copy
import json
import uuid

import pytest

from backend.activity_engine_v2.core import ExecutionCore, ProgramInvalid
from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.validator import validate_program
from backend.tests.account_helpers import mutate
from backend.tests.program_world_examples import world_program


def surface_program():
    raw=world_program('tile','route').model_dump()
    slots={slot['id']:slot for slot in raw['world']['state']}
    slots['height']['initial']=1;slots['width']['initial']=2
    slots['stock'].update(initial=2,minimum=2,maximum=2)
    next(material for material in raw['world']['materials'] if material['kind']=='unit_tiles')['quantity']=2
    stage=raw['presentation']['stage']
    stage['entities'][1]['representationObjectId']=None
    stage['tools'][0]['availableWhen']={'kind':'all','conditions':[
        stage['tools'][0]['availableWhen'],{'kind':'compare','op':'eq',
        'left':{'kind':'state','ref':'world-position'},'right':{'kind':'literal','value':'work'}}]}
    stage['surfaces']=[dict(id='actual-pier',label='Actual square panels',objectId='board',
        locationId=None,connectionId='concept-route',cellIds=['r0c0','r0c1'],layout='row',
        actionId='place',visibleWhen={'kind':'contains','collection':{'kind':'state','ref':'world-inspected'},
                                    'item':{'kind':'literal','value':'work'}})]
    raw['witness']=[
        dict(actionId='world-move',inputs={'destination':'work'}),
        dict(actionId='world-inspect',inputs={'location':'work'}),
        dict(actionId='place',inputs={'cell':'r0c0'}),dict(actionId='place',inputs={'cell':'r0c1'}),
        dict(actionId='multiply',inputs={'left':1,'right':2,'result':2}),
        dict(actionId='world-move',inputs={'destination':'finish'})]
    program=ActivityProgram.model_validate(raw)
    report=validate_program(program)
    assert report.valid,report.issues
    validate_runtime_compatibility(program)
    return program


def act(core,state,action,inputs):
    return core.transition(state,action,inputs).state


def test_two_unit_physical_route_uses_actual_grid_cells_and_same_core():
    program=surface_program()
    core=ExecutionCore(program)
    assert core.stage_view(core.initial)['surfaces']==[]  # Tool/unknown material is still gated.
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    surface=core.stage_view(state)['surfaces'][0]
    assert surface['objectId']=='board' and surface['connectionId']=='concept-route'
    assert surface['cellIds']==['r0c0','r0c1'] and surface['layout']=='row'
    assert surface['actionId']=='place' and surface['inputId']=='cell'
    assert all(cell['allowed'] and not cell['selected'] for cell in surface['cells'])
    for identifier in surface['cellIds']:
        state=act(core,state,surface['actionId'],{surface['inputId']:identifier})
        displayed=core.stage_view(state)['surfaces'][0]
        assert {cell['id'] for cell in displayed['cells'] if cell['selected']}==set(state['placed'])
    assert state['placed']==['r0c0','r0c1'] and not core.completed(state)
    assert not core.stage_view(state)['connections'][1]['open']
    state=act(core,state,'multiply',{'left':1,'right':2,'result':2})
    assert core.stage_view(state)['connections'][1]['open']
    state=act(core,state,'world-move',{'destination':'finish'})
    assert core.completed(state)
    assert not any(cell['allowed'] for cell in core.stage_view(state)['surfaces'][0]['cells'])


def test_surface_direct_actions_honor_actual_guards_without_optimistic_changes():
    raw=surface_program().model_dump()
    rule=next(rule for rule in raw['rules'] if rule['onAction']=='place')
    rule['when']={'kind':'contains','collection':{'kind':'state','ref':'world-inspected'},
                  'item':{'kind':'literal','value':'start'}}
    program=ActivityProgram.model_validate(raw)
    core=ExecutionCore(program)
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    original=copy.deepcopy(state)
    surface=core.stage_view(state)['surfaces'][0]
    assert not any(cell['allowed'] for cell in surface['cells'])
    assert {cell['reasonCode'] for cell in surface['cells']}=={'action_guard_unsatisfied'}
    assert state==original
    with pytest.raises(ProgramInvalid,match='action_guard_unsatisfied'):
        act(core,state,'place',{'cell':'r0c0'})
    assert state==original


def test_actual_surface_persists_readonly_when_actor_leaves_the_editing_workshop():
    core=ExecutionCore(surface_program())
    state=act(core,core.initial,'world-move',{'destination':'work'})
    state=act(core,state,'world-inspect',{'location':'work'})
    state=act(core,state,'place',{'cell':'r0c0'})
    state=act(core,state,'world-move',{'destination':'start'})
    surface=core.stage_view(state)['surfaces'][0]
    assert surface['cellIds']==['r0c0','r0c1']
    assert [cell['id'] for cell in surface['cells'] if cell['selected']]==['r0c0']
    assert surface['actionId'] is None and surface['inputId'] is None
    assert not any(cell['allowed'] for cell in surface['cells'])
    with pytest.raises(ProgramInvalid,match='stage_tool_unavailable'):
        act(core,state,'place',{'cell':'r0c1'})
    state=act(core,state,'world-move',{'destination':'work'})
    assert core.stage_view(state)['surfaces'][0]['actionId']=='place'
    assert state['placed']==['r0c0']


def test_explicit_surface_visibility_does_not_override_a_hidden_mutable_source_space():
    raw=surface_program().model_dump()
    raw['presentation']['stage']['surfaces'][0]['visibleWhen']={'kind':'always'}
    raw['components'][0]['spaceId']='discovered-workspace'
    raw['presentation']['spaces'].append(dict(id='discovered-workspace',title='Discovered materials',
        visibleWhen={'kind':'contains','collection':{'kind':'state','ref':'world-inspected'},
                     'item':{'kind':'literal','value':'work'}}))
    program=ActivityProgram.model_validate(raw)
    assert validate_program(program).valid
    core=ExecutionCore(program)
    assert core.stage_view(core.initial)['surfaces']==[]
    state=act(core,core.initial,'world-move',{'destination':'work'})
    assert core.stage_view(state)['surfaces']==[]
    state=act(core,state,'world-inspect',{'location':'work'})
    assert core.stage_view(state)['surfaces'][0]['objectId']=='board'


@pytest.mark.parametrize('mutation,code,field',[
    ('object','stage_surface_object_unknown','objectId'),
    ('location','stage_surface_location_unknown','locationId'),
    ('connection','stage_surface_connection_unknown','connectionId'),
    ('cells','stage_surface_cells_outside_object','cellIds'),
    ('action','stage_surface_action_unknown','actionId'),
    ('wrong-operation','stage_surface_action_unsupported','actionId'),
    ('wrong-object','stage_surface_action_wrong_object','actionId'),
])
def test_surfaces_reject_forged_anchors_geometry_and_actions(mutation,code,field):
    raw=surface_program().model_dump()
    surface=raw['presentation']['stage']['surfaces'][0]
    if mutation=='object':surface['objectId']='missing'
    elif mutation=='location':surface.update(locationId='missing',connectionId=None)
    elif mutation=='connection':surface['connectionId']='missing'
    elif mutation=='cells':surface['cellIds']=['r9c9']
    elif mutation=='action':surface['actionId']='missing'
    elif mutation=='wrong-operation':surface['actionId']='multiply'
    elif mutation=='wrong-object':
        raw['rules'][0]['effects'][0]['target']='unrelated-selected-cells'
    report=validate_program(raw)
    assert not report.valid and report.issues[0].code==code
    assert report.issues[0].path=='presentation.stage.surfaces.0.'+field


@pytest.mark.parametrize('cell_ids,layout,code',[
    (['p0'],'object','stage_surface_subset_requires_grid'),
    ([],'row','stage_surface_fraction_whole_layout_required'),
])
def test_fraction_surfaces_preserve_the_entire_same_whole(cell_ids,layout,code):
    raw=world_program('fraction','route').model_dump()
    raw['presentation']['stage']['surfaces']=[dict(id='whole-only',label='The same complete whole',objectId='working',
        locationId='work',connectionId=None,cellIds=cell_ids,layout=layout,actionId='piece',visibleWhen={'kind':'always'})]
    report=validate_program(raw)
    assert not report.valid and report.issues[0].code==code


def test_empty_surface_extension_preserves_old_stage_hash_and_public_shape():
    program=world_program()
    assert 'surfaces' not in program.presentation.stage.model_dump()
    assert 'surfaces' not in ExecutionCore(program).stage_view(ExecutionCore(program).initial)
    raw=program.model_dump()
    prior=validate_program(raw).definitionSha256
    raw['presentation']['stage']['surfaces']=[]
    assert validate_program(raw).definitionSha256==prior


def with_immutable_reference_surface(program, visible_when):
    raw=program.model_dump()
    original=next(obj for obj in raw['world']['objects'] if obj['id']=='board')
    reference=copy.deepcopy(original)
    reference['id']='reference-grid'
    mapping={ref:'reference-'+ref for ref in reference['bindings'].values()}
    reference['bindings']={port:mapping[ref] for port,ref in reference['bindings'].items()}
    for slot in list(raw['world']['state']):
        if slot['id'] not in mapping:continue
        added=copy.deepcopy(slot);added['id']=mapping[slot['id']];added['mutable']=False
        if added['kind']=='id_set':added['initial']=['r0c0','r0c1']
        raw['world']['state'].append(added)
    raw['world']['objects'].append(reference)
    raw['presentation']['stage']['surfaces'].append(dict(id='reference-surface',label='Explicit readonly reference',
        objectId='reference-grid',locationId='start',connectionId=None,cellIds=['r0c0','r0c1'],
        layout='row',actionId=None,visibleWhen=visible_when))
    return ActivityProgram.model_validate(raw)


def test_explicit_immutable_reference_can_be_public_without_a_new_interactive_component():
    program=with_immutable_reference_surface(surface_program(),{'kind':'always'})
    report=validate_program(program)
    assert report.valid,report.issues
    core=ExecutionCore(program)
    surfaces=core.stage_view(core.initial)['surfaces']
    assert len(surfaces)==1 and surfaces[0]['objectId']=='reference-grid'
    assert surfaces[0]['actionId'] is None and all(cell['selected'] and not cell['allowed'] for cell in surfaces[0]['cells'])
    assert all('reference-grid' not in component.objectIds for component in program.components)


@pytest.mark.parametrize('reference_visible',[True,False])
def test_owned_surfaces_publish_only_visible_actual_state_and_persist_same_gestures(kid_client,security_context,monkeypatch,tmp_path,reference_visible):
    from backend.activity_engine_v2 import preview
    when={'kind':'always'} if reference_visible else {'kind':'compare','op':'eq',
        'left':{'kind':'literal','value':0},'right':{'kind':'literal','value':1}}
    program=with_immutable_reference_surface(surface_program(),when)
    path=tmp_path/'surface-contract.json';path.write_text(program.model_dump_json())
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW','true')
    monkeypatch.setitem(preview.FIXTURE_PATHS,'synthetic-physical-surface',path)
    prefix='/api/activity-programs'
    def post(endpoint,body):
        version=kid_client.get('/api/auth/session').json()['version']
        return mutate(kid_client,'POST',prefix+endpoint,json=body,headers={'X-Sidekick-Profile-Version':str(version)})
    response=post('/preview/synthetic-physical-surface/sessions',{'requestId':'surface-start'})
    assert response.status_code==200,response.text
    view=response.json()
    expected={'world-movable','world-discoveries'}|({'reference-grid'} if reference_visible else set())
    assert {obj['id'] for obj in view['objects']}==expected
    assert ('reference-placed' in view['state']) is reference_visible
    if reference_visible:assert view['state']['reference-placed']==['r0c0','r0c1']
    assert 'placed' not in view['state']
    for step in program.witness:
        before=view['revision']
        response=post(f"/sessions/{view['id']}/actions",dict(requestId=uuid.uuid4().hex,expectedRevision=before,
            actionId=step.actionId,inputs=step.inputs))
        assert response.status_code==200,response.text
        view=response.json()
        if step.actionId=='place':
            assert view['revision']==before+1
            surface=next(item for item in view['stageView']['surfaces'] if item['id']=='actual-pier')
            assert {cell['id'] for cell in surface['cells'] if cell['selected']}==set(view['state']['placed'])
            if step.inputs['cell']=='r0c0':
                for destination in ('start','work'):
                    view=post(f"/sessions/{view['id']}/actions",dict(requestId=uuid.uuid4().hex,
                        expectedRevision=view['revision'],actionId='world-move',inputs={'destination':destination})).json()
                    assert view['state']['placed']==['r0c0']
                    actual=next(item for item in view['stageView']['surfaces'] if item['id']=='actual-pier')
                    if destination=='start':
                        assert actual['actionId'] is None and not any(cell['allowed'] for cell in actual['cells'])
                        assert not any(action['id']=='place' for action in view['actions'])
                        assert not any(component['id']=='tools' for component in view['components'])
                    else:assert actual['actionId']=='place'
    assert view['status']=='completed' and view['outcome']['assessment']=='demonstrated'
    assert post(f"/sessions/{view['id']}/replay",dict(expectedRevision=view['revision'])).json()['verified']
    with security_context.db.transaction() as connection:
        events=connection.execute("SELECT payload_json FROM activity_program_events WHERE session_id=? AND kind='action'",(view['id'],)).fetchall()
        actual=[json.loads(row['payload_json']) for row in events]
        assert [item['inputs'] for item in actual if item['actionId']=='place']==[{'cell':'r0c0'},{'cell':'r0c1'}]
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0]==0
