"""Fresh expression state hides its computed total without altering scoring/history."""
import json

from backend import main
from backend.activities import service
from backend.activities.models import ActivitySpec
from backend.tests.account_helpers import mutate, picker, unlock
from backend.tests.test_composition_models import area_activity
from backend.tests.test_general_activity_service import family, mapped_upload, start, uid


def test_independent_area_total_is_private_but_exact_parent_attempt_and_score_are_retained(family, security_context, monkeypatch):
    child, client = family
    upload = mapped_upload(security_context, child, '3.MD.C.7-1')
    spec = ActivitySpec.model_validate(area_activity())
    async def compose(*args, **kwargs):
        return spec
    monkeypatch.setattr(service, '_generate', compose)
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', object())
    opened = start(client, upload)
    assert opened.status_code == 200, opened.text
    session = opened.json()
    path = f"/api/activities/kid/sessions/{session['id']}"
    for response in [dict(marks=[dict(x=x,y=y) for y in range(2) for x in range(3)],text=''),
                     dict(marks=[],text='2 × 3 = 6')]:
        scene = session['currentScene']
        saved = mutate(client,'POST',path+'/submit',json=dict(sceneId=scene['id'],idempotencyKey=uid(),response=response))
        assert saved.status_code == 200 and saved.json()['feedback']['correct'] is True
        advanced = mutate(client,'POST',path+'/next',json=dict(sceneId=scene['id'],idempotencyKey=uid()))
        assert advanced.status_code == 200
        session = advanced.json()
    assert session['currentScene']['params']['area'] == dict(rows=3,columns=4,targetArea=None)
    assert client.get(path).json()['currentScene']['params']['area']['targetArea'] is None
    submitted = mutate(client,'POST',path+'/submit',json=dict(sceneId=session['currentScene']['id'],
        idempotencyKey=uid(),response=dict(marks=[],text='3 × 4 = 12')))
    assert submitted.status_code == 200 and submitted.json()['finalResult']['correct'] is True
    parent_path = f"/api/activities/parent/{child['id']}/sessions/{session['id']}"
    assert client.get(parent_path).status_code == 403
    picker(client); unlock(client)
    exact = client.get(parent_path)
    assert exact.status_code == 200
    assert exact.json()['scenes'][-1]['params']['area']['targetArea'] == 12
    with security_context.db.transaction() as conn:
        raw = json.loads(conn.execute('SELECT v.spec_json FROM activity_versions v JOIN activity_sessions s ON s.activity_version_id=v.id WHERE s.id=?',(session['id'],)).fetchone()[0])
    assert raw['scenes'][-1]['params']['area']['targetArea'] == 12
