"""Real account/CSRF/SQLite journeys for the development-only program runtime."""
import copy
import json
from pathlib import Path
from types import SimpleNamespace
import uuid

import pytest

from backend.activity_engine_v2 import preview, service
from backend.accounts.security import AccountError
from backend.tests.account_helpers import (create_child, csrf, mutate, picker, select_child,
                                           setup_pin, signup, unlock)

BASE = '/api/activity-programs'


@pytest.fixture(autouse=True)
def enabled(monkeypatch):
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW', 'true')


def version_header(client):
    return {'X-Sidekick-Profile-Version': str(client.get('/api/auth/session').json()['version'])}


def post(client, path, payload, **kwargs):
    return mutate(client, 'POST', BASE + path, json=payload, headers=version_header(client), **kwargs)


def start(client, key='habitat_designer', request_id=None):
    response = post(client, f'/preview/{key}/sessions', {'requestId': request_id or uuid.uuid4().hex})
    assert response.status_code == 200, response.text
    return response.json()


def action(client, view, step, request_id=None):
    return post(client, f"/sessions/{view['id']}/actions", {
        'requestId': request_id or uuid.uuid4().hex, 'expectedRevision': view['revision'],
        'actionId': step['actionId'], 'inputs': step['inputs']})


def help_item(client, view, request_id=None):
    return post(client, f"/sessions/{view['id']}/help", {
        'requestId': request_id or uuid.uuid4().hex, 'expectedRevision': view['revision'],
        'helpId': view['help'][0]['id']})


@pytest.mark.parametrize('key', list(preview.FIXTURE_PATHS))
def test_registered_witnesses_play_finish_and_replay_through_owned_http(kid_client, security_context, key):
    view = start(kid_client, key)
    program = preview.load_preview(key)
    for step in program.witness:
        response = action(kid_client, view, step.model_dump())
        assert response.status_code == 200, response.text
        view = response.json()
    assert view['status'] == 'completed'
    assert view['outcome']['missionComplete'] is True
    assert view['outcome']['assessment'] == ('pending_parent_review' if key == 'story_studio' else 'demonstrated')
    assert view['spaces'] and view['components'] and view['actions']  # finished workspace retained
    saved = kid_client.get(f"{BASE}/sessions/{view['id']}")
    assert saved.json() == view
    replay = post(kid_client, f"/sessions/{view['id']}/replay", {'expectedRevision': view['revision']})
    assert replay.status_code == 200, replay.text
    assert replay.json() == {'verified': True, 'eventCount': len(program.witness), 'session': view}
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 0
        snapshot = json.loads(connection.execute('SELECT completion_snapshot_json FROM activity_program_sessions WHERE id=?', (view['id'],)).fetchone()[0])
        assert snapshot['outcome'] == view['outcome']
        assert snapshot['definitionHash'] == view['definitionHash']


def test_feature_flag_disabled_and_production_stay_unavailable(kid_client, security_context, monkeypatch):
    monkeypatch.delenv('SIDEKICK_ACTIVITY_V2_PREVIEW')
    assert kid_client.get(BASE + '/preview').status_code == 404
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW', 'true')
    security_context.settings = SimpleNamespace(**{**security_context.settings.__dict__, 'app_env': 'production',
        'session_cookie': security_context.settings.session_cookie, 'csrf_cookie': security_context.settings.csrf_cookie})
    assert kid_client.get(BASE + '/preview').status_code == 404


def test_cookie_csrf_and_profile_version_are_required(kid_client, raw_client):
    # raw_client and kid_client can be the same fixture in this graph; a fresh
    # unauthenticated client is covered by the account suite and ownership test.
    view = start(kid_client)
    payload = {'requestId': 'missing-version'}
    missing = mutate(kid_client, 'POST', BASE + '/preview/habitat_designer/sessions', json=payload)
    assert missing.status_code == 409 and missing.json()['error']['code'] == 'profile_version_required'
    response = kid_client.post(BASE + '/preview/habitat_designer/sessions', json=payload,
                               headers={'Origin': 'https://other.invalid'})
    assert response.status_code == 403
    response = mutate(kid_client, 'POST', BASE + f"/sessions/{view['id']}/help",
        json={'requestId': 'stale-profile', 'expectedRevision': 0, 'helpId': view['help'][0]['id']},
        headers={'X-Sidekick-Profile-Version': '-1'})
    assert response.status_code == 409 and response.json()['error']['code'] == 'profile_changed'


def test_start_idempotency_and_conflicting_content(kid_client, security_context):
    view = start(kid_client, request_id='start-once')
    assert start(kid_client, request_id='start-once') == view
    different = post(kid_client, '/preview/story_studio/sessions', {'requestId': 'start-once'})
    assert different.status_code == 409 and different.json()['error']['code'] == 'request_id_conflict'
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0] == 1


def test_duplicate_actions_help_stale_rejections_and_resume_preserve_state(kid_client, security_context):
    original = start(kid_client)
    assisted = help_item(kid_client, original, 'help-once')
    assert assisted.status_code == 200, assisted.text
    view = assisted.json()
    assert view['revision'] == 1 and view['actionCount'] == 0 and view['assistance']['received']
    assert help_item(kid_client, original, 'help-once').json() == view
    assert view['deliveredHelp'][0]['uses'] == 1
    stale = action(kid_client, original, preview.load_preview('habitat_designer').witness[0].model_dump())
    assert stale.status_code == 409 and stale.json()['error']['code'] == 'stale_revision'
    bad = action(kid_client, view, {'actionId': 'habitat-resize', 'inputs': {'rows': -9, 'columns': 3}})
    assert bad.status_code == 400
    assert kid_client.get(f"{BASE}/sessions/{view['id']}").json() == view
    first_step = preview.load_preview('habitat_designer').witness[0].model_dump()
    played = action(kid_client, view, first_step, 'action-once')
    assert played.status_code == 200, played.text
    next_view = played.json()
    assert action(kid_client, view, first_step, 'action-once').json() == next_view
    conflict_step = copy.deepcopy(first_step)
    conflict_step['inputs']['rows'] = 1
    conflict = action(kid_client, view, conflict_step, 'action-once')
    assert conflict.status_code == 409 and conflict.json()['error']['code'] == 'request_id_conflict'
    view = next_view
    for step in preview.load_preview('habitat_designer').witness[1:]:
        response = action(kid_client, view, step.model_dump())
        assert response.status_code == 200, response.text
        view = response.json()
    assert view['outcome']['assisted'] and view['outcome']['assessment'] == 'demonstrated'
    assert kid_client.get(f"{BASE}/sessions/{view['id']}").json() == view
    assert post(kid_client, f"/sessions/{view['id']}/replay", {'expectedRevision': view['revision']}).json()['verified']
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_events WHERE session_id=?', (view['id'],)).fetchone()[0] == view['revision']


def test_current_child_and_account_own_every_read_and_mutation(kid_client, client_factory):
    view = start(kid_client)
    assert picker(kid_client).status_code == 200
    assert unlock(kid_client).status_code == 200
    second = create_child(kid_client, 'Morgan').json()['id']
    assert select_child(kid_client, second).status_code == 200
    assert kid_client.get(f"{BASE}/sessions/{view['id']}").status_code == 404
    assert help_item(kid_client, view).status_code == 404
    other = client_factory()
    assert signup(other, 'another@example.com').status_code == 201
    assert setup_pin(other).status_code == 200 and unlock(other).status_code == 200
    child = create_child(other).json()['id']
    assert select_child(other, child).status_code == 200
    assert other.get(f"{BASE}/sessions/{view['id']}").status_code == 404
    assert help_item(other, view).status_code == 404
    anonymous = client_factory()
    assert anonymous.get(f"{BASE}/sessions/{view['id']}").status_code == 401


def test_profile_switch_between_authorization_and_transaction_is_rejected(kid_client, security_context):
    view = start(kid_client)
    from backend.accounts.security import digest, SessionRecord
    with security_context.db.transaction() as connection:
        token = digest(kid_client.cookies.get(security_context.settings.session_cookie))
        row = connection.execute('SELECT * FROM sessions WHERE token_digest=?', (token,)).fetchone()
        active = SessionRecord(token, row['account_id'], row['mode'], row['active_kid_profile_id'], row['parent_expires_at'], row['version'])
        connection.execute('UPDATE sessions SET version=version+1 WHERE token_digest=?', (token,))
    with pytest.raises(AccountError, match='profile_changed'):
        service.session_view(security_context, active.active_kid_profile_id, view['id'], active)


def test_public_projection_hides_definitions_and_nonvisible_material(kid_client, monkeypatch, tmp_path):
    raw = json.loads(preview.FIXTURE_PATHS['trail_evidence'].read_text())
    raw['presentation']['spaces'][1]['visibleWhen'] = {
        'kind': 'compare', 'op': 'ne', 'left': {'kind': 'state', 'ref': 'bridge-selection'},
        'right': {'kind': 'literal', 'value': 'none'}}
    raw['witness'] = [{'actionId': 'bridge-place-clue', 'inputs': {'sentence': 'bridge-2'}}]
    path = tmp_path / 'hidden.json'
    path.write_text(json.dumps(raw))
    monkeypatch.setitem(preview.FIXTURE_PATHS, 'hidden-route', path)
    view = start(kid_client, 'hidden-route')
    assert [space['id'] for space in view['spaces']] == ['bridge']
    assert not any(item['id'].startswith('gate') for item in view['materials'] + view['objects'] + view['actions'])
    assert 'gate-selection' not in view['state']
    forbidden = {'witness', 'rules', 'intent', 'observations', 'when', 'rubric', 'provenance', 'initial'}
    def keys(value):
        if isinstance(value, dict):
            return set(value) | set().union(*(keys(item) for item in value.values()))
        if isinstance(value, list):
            return set().union(*(keys(item) for item in value))
        return set()
    assert not keys(view).intersection(forbidden)
    response = action(kid_client, view, {'actionId': 'gate-place-clue', 'inputs': {'sentence': 'gate-2'}})
    assert response.status_code == 400 and response.json()['error']['code'] == 'action_space_unavailable'
    assert kid_client.get(f"{BASE}/sessions/{view['id']}").json() == view


def test_drafts_and_revisions_are_private_attributable_events_not_quality_scores(kid_client, security_context, caplog):
    view = start(kid_client, 'story_studio')
    program = preview.load_preview('story_studio')
    previous_texts = []
    for step in program.witness:
        response = action(kid_client, view, step.model_dump())
        assert response.status_code == 200, response.text
        view = response.json()
        previous_texts.append(step.inputs['text'])
    assert view['outcome']['assessment'] == 'pending_parent_review'
    with security_context.db.transaction() as connection:
        events = connection.execute('SELECT payload_json,evidence_json FROM activity_program_events WHERE session_id=? ORDER BY revision', (view['id'],)).fetchall()
        assert [json.loads(row['payload_json'])['inputs']['text'] for row in events] == previous_texts
        assert all('correct' not in json.loads(row['evidence_json']) for row in events)
    assert all(text not in caplog.text for text in previous_texts)


def test_replay_detects_corruption_and_saved_definition_survives_fixture_changes(kid_client, security_context, monkeypatch, tmp_path):
    view = start(kid_client)
    step = preview.load_preview('habitat_designer').witness[0].model_dump()
    response = action(kid_client, view, step)
    assert response.status_code == 200, response.text
    view = response.json()
    monkeypatch.setitem(preview.FIXTURE_PATHS, 'habitat_designer', tmp_path / 'missing.json')
    assert kid_client.get(f"{BASE}/sessions/{view['id']}").json() == view
    assert post(kid_client, f"/sessions/{view['id']}/replay", {'expectedRevision': view['revision']}).json()['verified']
    with security_context.db.transaction() as connection:
        connection.execute("UPDATE activity_program_events SET request_sha256='bad' WHERE session_id=?", (view['id'],))
    response = post(kid_client, f"/sessions/{view['id']}/replay", {'expectedRevision': view['revision']})
    assert response.status_code == 503 and response.json()['error']['code'] == 'replay_integrity_failed'


def test_profile_deletion_removes_sessions_events_and_private_drafts(kid_client, security_context):
    view = start(kid_client, 'story_studio')
    step = preview.load_preview('story_studio').witness[0].model_dump()
    assert action(kid_client, view, step).status_code == 200
    profile_id = kid_client.get('/api/auth/session').json()['activeKidProfileId']
    assert picker(kid_client).status_code == 200 and unlock(kid_client).status_code == 200
    assert mutate(kid_client, 'DELETE', '/api/parent/profiles/' + profile_id).status_code == 200
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0] == 0
        assert connection.execute('SELECT COUNT(*) FROM activity_program_events').fetchone()[0] == 0
        assert connection.execute('SELECT COUNT(*) FROM activity_program_start_requests').fetchone()[0] == 0


def test_oversize_private_json_and_browser_definitions_are_rejected(kid_client):
    view = start(kid_client, 'story_studio')
    response = action(kid_client, view, {'actionId': 'draft-opening', 'inputs': {'text': 'PRIVATE_DRAFT' * 6000}})
    assert response.status_code == 413 and 'PRIVATE_DRAFT' not in response.text
    response = post(kid_client, '/preview/story_studio/sessions', {'requestId': 'definition-injection', 'program': {'code': 'PRIVATE'}})
    assert response.status_code == 400 and 'PRIVATE' not in response.text
