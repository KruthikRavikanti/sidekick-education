"""A physical grid mount uses actual shape/coverage in the shared runtime."""
import copy
import json
import uuid

import pytest
from pydantic import ValidationError

from backend.activity_engine_v2.core import ExecutionCore, ProgramInvalid
from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.validator import validate_program
from backend.tests.account_helpers import mutate
from backend.tests.program_composition_examples import eq, inp, lit, state
from backend.tests.program_world_examples import world_program


def construction_program():
    raw=world_program('tile','route').model_dump()
    stage=raw['presentation']['stage']
    edge=stage['connections'][1]
    edge.update(when={'kind':'always'},construction=dict(objectId='board',rows=2,columns=3))
    # The mount itself, not a duplicated condition or proxy flag, supplies the
    # real conceptual dependency for the route.
    stage['reactions']=[dict(id='work-status',entityId='workbench',when=eq(state('world-position'),lit('work')),
                             status='active',text='The workbench is here.')]
    stage['surfaces']=[dict(id='mounted-grid',label='Actual construction',objectId='board',
        locationId=None,connectionId=edge['id'],cellIds=[],layout='object',actionId='place',
        visibleWhen={'kind':'contains','collection':state('world-inspected'),'item':lit('work')})]
    for action in raw['actions']:
        if action['id']=='place':action['inputs'][0]['options']=[f'r{r}c{c}' for r in range(3) for c in range(3)]
    raw['actions'].append(dict(id='reshape',componentId='tools',operation='resize_rectangle',
        inputs=[dict(id='rows',kind='integer',minimum=1,maximum=3),
                dict(id='columns',kind='integer',minimum=1,maximum=3)],label='Change the shape'))
    raw['rules'].append(dict(id='reshape-rule',onAction='reshape',when={'kind':'always'},effects=[
        dict(kind='set',target='height',value=inp('rows')),dict(kind='set',target='width',value=inp('columns'))]))
    program=ActivityProgram.model_validate(raw)
    report=validate_program(program,check_witness=True)
    assert report.valid and report.computational=='witness_verified',report.issues
    validate_runtime_compatibility(program)
    return program


def act(core,st,action,inputs):return core.transition(st,action,inputs).state


def workshop(core):
    st=act(core,core.initial,'world-move',{'destination':'work'})
    return act(core,st,'world-inspect',{'location':'work'})


def connection(core,st):return core.stage_view(st)['connections'][1]


def test_partial_shape_cannot_pass_even_with_true_declared_guard_and_forged_travel():
    core=ExecutionCore(construction_program())
    st=workshop(core)
    for cell in ['r0c0','r0c1','r0c2','r1c0','r1c1']:
        st=act(core,st,'place',{'cell':cell})
    view=connection(core,st)
    assert not view['open']
    assert view['construction']==dict(objectId='board',rows=2,columns=3,requiredCells=6,
        actualRows=2,actualColumns=3,coveredCells=5,dimensionsMatch=True,complete=False,fits=False,sourceVisible=True)
    before=copy.deepcopy(st)
    with pytest.raises(ProgramInvalid,match='stage_connection_closed'):
        act(core,st,'world-move',{'destination':'finish'})
    assert st==before
    st=act(core,st,'place',{'cell':'r1c2'})
    assert connection(core,st)['open'] and core.stage_connection_open(core.stage.connections[1],st)
    assert connection(core,st)['construction']['fits'] is True
    st=act(core,st,'world-move',{'destination':'finish'})
    assert st['world-position']=='finish'


def test_equal_area_wrong_footprint_stays_closed_then_recovery_preserves_scarce_stock():
    core=ExecutionCore(construction_program())
    st=workshop(core)
    st=act(core,st,'reshape',{'rows':3,'columns':2})
    wrong=[f'r{r}c{c}' for r in range(3) for c in range(2)]
    for cell in wrong:st=act(core,st,'place',{'cell':cell})
    mount=connection(core,st)['construction']
    assert mount['complete'] and not mount['dimensionsMatch'] and not mount['fits']
    assert mount['coveredCells']==mount['requiredCells']==6
    assert not connection(core,st)['open']
    with pytest.raises(ProgramInvalid,match='stage_connection_closed'):
        act(core,st,'world-move',{'destination':'finish'})
    # Reconfiguration never silently discards squares outside new dimensions.
    with pytest.raises(ProgramInvalid,match='tile_outside_current_rectangle'):
        act(core,st,'reshape',{'rows':2,'columns':3})
    for cell in ('r2c0','r2c1'):st=act(core,st,'place',{'cell':cell})
    st=act(core,st,'reshape',{'rows':2,'columns':3})
    for cell in ('r0c2','r1c2'):st=act(core,st,'place',{'cell':cell})
    assert connection(core,st)['open'] and len(st['placed'])==6
    # A larger shape cannot manufacture additional stock while experimenting.
    larger=act(core,st,'reshape',{'rows':3,'columns':3})
    with pytest.raises(ProgramInvalid,match='tile_stock_exceeded'):
        act(core,larger,'place',{'cell':'r2c0'})
    assert len(larger['placed'])==6


def test_mount_and_declared_guard_are_both_required_not_either_one():
    raw=construction_program().model_dump()
    raw['presentation']['stage']['connections'][1]['when']=eq(state('world-position'),lit('start'))
    core=ExecutionCore(ActivityProgram.model_validate(raw))
    st=workshop(core)
    for cell in [f'r{r}c{c}' for r in range(2) for c in range(3)]:st=act(core,st,'place',{'cell':cell})
    assert connection(core,st)['construction']['fits'] and not connection(core,st)['open']
    with pytest.raises(ProgramInvalid,match='stage_connection_closed'):
        act(core,st,'world-move',{'destination':'finish'})


def test_hidden_source_does_not_leak_actual_mount_dimensions_or_coverage():
    core=ExecutionCore(construction_program())
    mount=connection(core,core.initial)['construction']
    assert mount['rows']==2 and mount['columns']==3 and mount['requiredCells']==6
    assert mount['sourceVisible'] is False
    assert all(mount[key] is None for key in ('actualRows','actualColumns','coveredCells','dimensionsMatch','complete','fits'))
    assert core.stage_view(core.initial)['surfaces']==[]


@pytest.mark.parametrize('mutation,code,field',[
    ('unknown','stage_construction_object_unknown','.objectId'),
    ('nongrid','stage_construction_requires_grid','.objectId'),
    ('bounds','stage_construction_outside_source_bounds',''),
    ('budget','stage_construction_area_budget_exceeded',''),
    ('surface-missing','stage_construction_whole_surface_required',''),
    ('surface-subset','stage_construction_whole_surface_required',''),
    ('surface-flat','stage_construction_whole_surface_required',''),
])
def test_forged_mounts_and_unrendered_geometry_are_rejected(mutation,code,field):
    raw=construction_program().model_dump()
    stage=raw['presentation']['stage'];mount=stage['connections'][1]['construction']
    if mutation=='unknown':mount['objectId']='missing'
    elif mutation=='nongrid':mount['objectId']='equation'
    elif mutation=='bounds':mount['rows']=4
    elif mutation=='budget':mount.update(rows=12,columns=12)
    elif mutation=='surface-missing':stage['surfaces']=[]
    elif mutation=='surface-subset':stage['surfaces'][0]['cellIds']=['r0c0']
    elif mutation=='surface-flat':stage['surfaces'][0]['layout']='row'
    report=validate_program(raw)
    assert not report.valid and report.issues[0].code==code
    assert report.issues[0].path=='presentation.stage.connections.1.construction'+field


@pytest.mark.parametrize('value',[0,13,True,'2'])
def test_mount_dimensions_are_bounded_strict_integers(value):
    raw=construction_program().model_dump()
    raw['presentation']['stage']['connections'][1]['construction']['rows']=value
    with pytest.raises(ValidationError):ActivityProgram.model_validate(raw)


def test_absent_mount_extension_preserves_existing_definition_hash_and_public_projection():
    original=world_program()
    raw=original.model_dump()
    prior=validate_program(raw).definitionSha256
    assert all('construction' not in edge for edge in raw['presentation']['stage']['connections'])
    raw['presentation']['stage']['connections'][1]['construction']=None
    assert validate_program(raw).definitionSha256==prior
    core=ExecutionCore(original)
    assert all('construction' not in edge for edge in core.stage_view(core.initial)['connections'])


def test_owned_mount_actions_complete_and_replay_through_existing_server_flow(kid_client,security_context,monkeypatch,tmp_path):
    from backend.activity_engine_v2 import preview
    program=construction_program()
    fixture=tmp_path/'mount-contract.json';fixture.write_text(program.model_dump_json())
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW','true')
    monkeypatch.setitem(preview.FIXTURE_PATHS,'synthetic-mount-contract',fixture)
    def post(path,body):
        version=kid_client.get('/api/auth/session').json()['version']
        return mutate(kid_client,'POST','/api/activity-programs'+path,json=body,
                      headers={'X-Sidekick-Profile-Version':str(version)})
    view=post('/preview/synthetic-mount-contract/sessions',dict(requestId='mount-start')).json()
    assert view['stageView']['connections'][1]['construction']['sourceVisible'] is False
    for step in program.witness:
        result=post(f"/sessions/{view['id']}/actions",dict(requestId=uuid.uuid4().hex,
            expectedRevision=view['revision'],actionId=step.actionId,inputs=step.inputs))
        assert result.status_code==200,result.text
        view=result.json()
    assert view['status']=='completed' and view['outcome']['assessment']=='demonstrated'
    assert view['stageView']['connections'][1]['construction']['fits']
    assert post(f"/sessions/{view['id']}/replay",dict(expectedRevision=view['revision'])).json()['verified']
    with security_context.db.transaction() as connection:
        payloads=[json.loads(row[0]) for row in connection.execute(
            "SELECT payload_json FROM activity_program_events WHERE session_id=? AND kind='action'",(view['id'],))]
        assert [item['actionId'] for item in payloads]==[step.actionId for step in program.witness]
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0]==0
