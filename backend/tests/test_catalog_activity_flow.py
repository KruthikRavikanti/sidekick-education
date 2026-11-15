"""New family actions, private artifacts, parent review and mixed-upload routing."""
import copy
import io
import json
from pathlib import Path
import sys
import wave

import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'tests/e2e'))
from catalog_examples import EXAMPLE_KINDS, example
from backend import main
from backend.activities import capabilities, service
from backend.activities.general import FamilyActivityReview
from backend.accounts.security import AccountError
from backend.tests.account_helpers import picker, unlock, mutate, create_child, select_child
from backend.tests.test_general_activity_service import family, mapped_upload, start, uid


@pytest.fixture(autouse=True)
def isolated_artifact_storage(security_context,monkeypatch):
    monkeypatch.setenv('SIDEKICK_PRIVATE_UPLOAD_DIR',str(security_context.db.path.parent/'activity-media'))


class FamilyComposer:
    model = 'explicit-synthetic-family-composer'

    def __init__(self, *, approved=True):
        self.approved = approved
        self.calls = []

    async def _call(self, response_model, task, instruction, data):
        self.calls.append((task, copy.deepcopy(data)))
        if response_model is FamilyActivityReview:
            return dict(approved=self.approved, reason='approved' if self.approved else 'unsuitable_task',
                demonstratesTarget=True, interactionNecessary=self.approved, goalAchievable=True,
                scoringAligned=True, materialsPresent=True, independentFresh=True)
        return example(data)


def wav_bytes():
    stream = io.BytesIO()
    with wave.open(stream, 'wb') as writer:
        writer.setnchannels(1); writer.setsampwidth(2); writer.setframerate(8000)
        writer.writeframes(b'\x01\x00' * 8000)
    return stream.getvalue()


def response_for(scene, client, session_id):
    component, params = scene['component'], scene['params']
    if component == 'quantity_lab':
        count = params['stock'] // len(params['containers'])
        return {'allocations': [dict(containerId=item['id'], count=count) for item in params['containers']]}
    if component == 'math_workspace':
        import re
        if params['mode'] == 'grid':
            x,y = map(int,re.search(r'\((\d+), (\d+)\)',scene['prompt']).groups())
        else:
            x,y = params['objects'][0]['width'],0
        return {'marks':[dict(x=x,y=y)],'text':''}
    if component == 'text_editor':
        if params['mode'] == 'edit':
            correct = {'the fox and the moon':'The Fox and the Moon','a boat on the river':'A Boat on the River','the owl in the tower':'The Owl in the Tower'}
            return {'writtenText':correct[params['initialText']]}
        if params['wordBank']==['robin','oak']:
            return {'writtenText':'A robin is a bird because it has feathers. An oak is a tree because it has a trunk and branches.'}
        return {'writtenText':'Nia stood at the river with her friend Sam. Their map had blown into a tree, so they followed the bank to find a safe way across.'}
    if component == 'drawing_studio':
        return {'strokes':[[dict(x=20,y=20),dict(x=80,y=20)],[dict(x=50,y=20),dict(x=50,y=80)]]}
    if component == 'sort_connect':
        return {'placements':[dict(pieceId=piece['id'],targetId=f'category-{0 if i<2 else 1}') for i,piece in enumerate(params['pieces'])]}
    key = uid()
    uploaded = mutate(client, 'POST', f'/api/activities/kid/sessions/{session_id}/recording',
        data={'sceneId':scene['id'],'idempotencyKey':key}, files={'file':('synthetic.wav',wav_bytes(),'audio/wav')})
    assert uploaded.status_code == 200,uploaded.text
    again = mutate(client, 'POST', f'/api/activities/kid/sessions/{session_id}/recording',
        data={'sceneId':scene['id'],'idempotencyKey':key}, files={'file':('synthetic.wav',wav_bytes(),'audio/wav')})
    assert again.json() == uploaded.json()
    return uploaded.json()


@pytest.mark.parametrize('subskill', list(EXAMPLE_KINDS))
def test_generated_family_flows_score_or_wait_for_real_parent_review(family,security_context,monkeypatch,subskill):
    child,client=family
    upload=mapped_upload(security_context,child,subskill)
    composer=FamilyComposer()
    monkeypatch.setitem(main.app.state._state,'activity_adapter',composer)
    opened=start(client,upload)
    assert opened.status_code==200,opened.text
    session=opened.json()
    assert composer.calls[0][1]['coveragePath']['subskillId']==subskill
    assert [call[0] for call in composer.calls]==['compose_activity','review_activity']
    for index in range(3):
        scene=session['currentScene']
        response=response_for(scene,client,session['id'])
        key=uid()
        body=dict(sceneId=scene['id'],idempotencyKey=key,response=response)
        submitted=mutate(client,'POST',f"/api/activities/kid/sessions/{session['id']}/submit",json=body)
        assert submitted.status_code==200,submitted.text
        session=submitted.json()
        replay=mutate(client,'POST',f"/api/activities/kid/sessions/{session['id']}/submit",json=body)
        assert replay.json()==session
        if index<2:
            advanced=mutate(client,'POST',f"/api/activities/kid/sessions/{session['id']}/next",json=dict(sceneId=scene['id'],idempotencyKey=uid()))
            assert advanced.status_code==200,advanced.text
            session=advanced.json()
    assert session['status']=='completed'
    manual=session['finalResult']['assessmentStatus']=='pending_parent_review'
    assert session['finalResult']['correct'] is (None if manual else True)
    if manual:
        assert session['finalResult']['assessmentStatus']=='pending_parent_review'
        assert session['finalResult']['rubric']==[]
        assert mutate(client,'POST',f"/api/activities/parent/{child['id']}/sessions/{session['id']}/review",
            json=dict(correct=True,note='A child cannot grade this.',parentObserved=True,idempotencyKey=uid())).status_code==403
    if session['finalResult']['recordingId']:
        rid=session['finalResult']['recordingId']
        assert client.get(f"/api/activities/parent/{child['id']}/recordings/{rid}").status_code==403
        assert client.get(f"/api/activities/kid/sessions/{session['id']}/recordings/{rid}").content==wav_bytes()
    assert client.get(f"/api/activities/parent/{child['id']}/history").status_code==403
    picker(client); unlock(client)
    history=client.get(f"/api/activities/parent/{child['id']}/history").json()['activities']
    assert history[0]['finalResult']['response']==session['finalResult']['response']
    assert history[0]['finalResult']['correct']==session['finalResult']['correct']
    if manual:assert history[0]['finalResult']['rubric']
    if manual:
        key=uid()
        body=dict(correct=False,note=' Saved observation. ',parentObserved=True,idempotencyKey=key)
        path=f"/api/activities/parent/{child['id']}/sessions/{session['id']}/review"
        reviewed=mutate(client,'POST',path,json=body)
        assert reviewed.status_code==200,reviewed.text
        assert reviewed.json()['finalResult']['correct'] is False
        assert reviewed.json()['finalResult']['assessmentStatus']=='parent_reviewed'
        assert mutate(client,'POST',path,json=body).json()==reviewed.json()
        body['correct']=True
        assert mutate(client,'POST',path,json=body).status_code==409


def test_unplayable_question_does_not_hide_another_reliably_mapped_playable_item(family,security_context):
    child,client=family
    upload=mapped_upload(security_context,child,'6.RP.A.2-1',correctness='incorrect')
    second=mapped_upload(security_context,child,'3.OA.A.1-1',correctness='correct')
    with security_context.db.transaction() as conn:
        conn.execute('UPDATE homework_problems SET upload_id=?,problem_order=1 WHERE upload_id=?',(upload,second))
    result=client.get('/api/activities/kid/suggestion',params={'uploadId':upload}).json()
    assert result['available'] and result['targetSkill']['id']=='3.OA.A.1-1'


def test_decorative_activity_review_cannot_be_promoted_to_verified(family,security_context,monkeypatch):
    child,client=family
    upload=mapped_upload(security_context,child,'3.OA.A.1-1')
    monkeypatch.setitem(main.app.state._state,'activity_adapter',FamilyComposer(approved=False))
    assert start(client,upload).status_code==503
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE origin='model_generated'").fetchone()[0]==0


def test_recording_cannot_be_faked_with_a_string_or_borrowed_between_profiles(family,security_context,monkeypatch):
    child,client=family
    upload=mapped_upload(security_context,child,'RF.1.3-2')
    monkeypatch.setitem(main.app.state._state,'activity_adapter',FamilyComposer())
    session=start(client,upload).json(); scene=session['currentScene']
    path=f"/api/activities/kid/sessions/{session['id']}"
    bad=mutate(client,'POST',path+'/submit',json=dict(sceneId=scene['id'],idempotencyKey=uid(),response={'recordingId':'made-up'}))
    assert bad.status_code==400
    malformed=mutate(client,'POST',path+'/recording',data=dict(sceneId=scene['id'],idempotencyKey=uid()),files={'file':('bad.webm',b'pretend speech','audio/webm')})
    assert malformed.status_code==400
    audio=response_for(scene,client,session['id'])
    picker(client); unlock(client)
    sibling=create_child(client,'Robin','1').json()
    select_child(client,sibling['id'])
    assert client.get(path+f"/recordings/{audio['recordingId']}").status_code==404
    assert mutate(client,'POST',path+'/recording',data=dict(sceneId=scene['id'],idempotencyKey=uid()),
        files={'file':('synthetic.wav',wav_bytes(),'audio/wav')}).status_code==404


def test_deleting_child_removes_recording_bytes_as_well_as_the_private_row(family,security_context,monkeypatch):
    from backend.gap.storage import file_path,save_bytes
    child,client=family
    upload=mapped_upload(security_context,child,'RF.1.3-2')
    original=save_bytes(security_context,(ROOT/'public/samples/activity-catalog-phonics-work.png').read_bytes())
    with security_context.db.transaction() as c:
        c.execute('UPDATE homework_uploads SET file_ref=? WHERE id=?',(original,upload))
    monkeypatch.setitem(main.app.state._state,'activity_adapter',FamilyComposer())
    session=start(client,upload).json()
    saved=response_for(session['currentScene'],client,session['id'])
    with security_context.db.transaction() as c:
        reference=c.execute('SELECT file_ref FROM activity_recordings WHERE id=?',(saved['recordingId'],)).fetchone()[0]
    private_file=file_path(security_context,reference)
    assert private_file.is_file()
    picker(client);unlock(client)
    assert mutate(client,'DELETE',f"/api/parent/profiles/{child['id']}").status_code==200
    assert not private_file.exists()
    with security_context.db.transaction() as c:
        assert c.execute('SELECT 1 FROM activity_recordings WHERE id=?',(saved['recordingId'],)).fetchone() is None


def test_real_recording_over_json_limit_uses_the_bounded_media_upload_path(family,security_context,monkeypatch):
    child,client=family
    upload=mapped_upload(security_context,child,'RF.1.3-2')
    monkeypatch.setitem(main.app.state._state,'activity_adapter',FamilyComposer())
    session=start(client,upload).json();scene=session['currentScene']
    data=(ROOT/'fixtures/synthetic-reading.wav').read_bytes()
    assert 65536<len(data)<8*1024*1024
    saved=mutate(client,'POST',f"/api/activities/kid/sessions/{session['id']}/recording",
        data=dict(sceneId=scene['id'],idempotencyKey=uid()),files={'file':('synthetic-reading.wav',data,'audio/wav')})
    assert saved.status_code==200,saved.text
    media=client.get(f"/api/activities/kid/sessions/{session['id']}/recordings/{saved.json()['recordingId']}")
    assert media.content==data and media.headers['cache-control']=='no-store'
