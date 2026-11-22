"""Independent probes of owned runtime history, request and adapter boundaries."""
import copy
import json
import uuid

import pytest

from backend.activity_engine_v2 import preview
from backend.activity_engine_v2.validator import require_valid_program
from backend.tests.account_helpers import csrf, mutate

BASE = '/api/activity-programs'


@pytest.fixture(autouse=True)
def preview_enabled(monkeypatch):
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW', 'true')


def headers(client):
    return {'X-Sidekick-Profile-Version': str(client.get('/api/auth/session').json()['version'])}


def post(client, path, body):
    return mutate(client, 'POST', BASE + path, json=body, headers=headers(client))


def begin(client, key='habitat_designer'):
    response = post(client, f'/preview/{key}/sessions', dict(requestId=uuid.uuid4().hex))
    assert response.status_code == 200, response.text
    return response.json()


def move(client, view, step, request_id=None):
    return post(client, f"/sessions/{view['id']}/actions", dict(
        requestId=request_id or uuid.uuid4().hex, expectedRevision=view['revision'],
        actionId=step.actionId, inputs=step.inputs))


def complete(client):
    view = begin(client)
    for step in preview.load_preview('habitat_designer').witness:
        response = move(client, view, step)
        assert response.status_code == 200, response.text
        view = response.json()
    assert view['status'] == 'completed'
    return view


@pytest.mark.parametrize('corruption', ['event_evidence', 'completion_snapshot', 'cached_response'])
def test_replay_does_not_certify_corrupted_outcome_evidence_or_cached_result(kid_client, security_context, corruption):
    view = complete(kid_client)
    with security_context.db.transaction() as connection:
        if corruption == 'completion_snapshot':
            snapshot = json.loads(connection.execute(
                'SELECT completion_snapshot_json FROM activity_program_sessions WHERE id=?', (view['id'],)).fetchone()[0])
            snapshot['outcome']['assessment'] = 'pending_parent_review'
            connection.execute('UPDATE activity_program_sessions SET completion_snapshot_json=? WHERE id=?',
                               (json.dumps(snapshot), view['id']))
        else:
            column = 'evidence_json' if corruption == 'event_evidence' else 'response_json'
            event = connection.execute(
                f'SELECT id,{column} FROM activity_program_events WHERE session_id=? ORDER BY revision DESC LIMIT 1',
                (view['id'],)).fetchone()
            stored = json.loads(event[column])
            stored['outcome']['assisted'] = True
            connection.execute(f'UPDATE activity_program_events SET {column}=? WHERE id=?',
                               (json.dumps(stored), event['id']))
        original = connection.execute('SELECT state_json,revision,action_count FROM activity_program_sessions WHERE id=?',
                                      (view['id'],)).fetchone()
        saved = tuple(original)
    response = post(kid_client, f"/sessions/{view['id']}/replay", dict(expectedRevision=view['revision']))
    assert response.status_code == 503, response.text
    assert response.json()['error']['code'] == 'replay_integrity_failed'
    with security_context.db.transaction() as connection:
        assert tuple(connection.execute('SELECT state_json,revision,action_count FROM activity_program_sessions WHERE id=?',
                                        (view['id'],)).fetchone()) == saved


def test_retry_of_old_action_after_new_moves_returns_original_without_duplicating_private_evidence(kid_client, security_context):
    initial = begin(kid_client)
    first, second = preview.load_preview('habitat_designer').witness
    response = move(kid_client, initial, first, 'first-move')
    first_view = response.json()
    response = move(kid_client, first_view, second, 'second-move')
    finished = response.json()
    assert finished['status'] == 'completed'
    retried = move(kid_client, initial, first, 'first-move')
    assert retried.status_code == 200
    assert retried.json() == first_view
    assert kid_client.get(f"{BASE}/sessions/{initial['id']}").json() == finished
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_events WHERE session_id=?',
                                  (initial['id'],)).fetchone()[0] == 2


def test_request_identity_cannot_cross_action_and_help_channels(kid_client):
    initial = begin(kid_client)
    help_response = post(kid_client, f"/sessions/{initial['id']}/help", dict(
        requestId='shared-identity', expectedRevision=0, helpId=initial['help'][0]['id']))
    assert help_response.status_code == 200
    assisted = help_response.json()
    step = preview.load_preview('habitat_designer').witness[0]
    response = move(kid_client, assisted, step, 'shared-identity')
    assert response.status_code == 409
    assert response.json()['error']['code'] == 'request_id_conflict'
    assert kid_client.get(f"{BASE}/sessions/{initial['id']}").json() == assisted


def test_deep_invalid_json_is_a_safe_rejection_before_json_decoder_recursion(kid_client):
    initial = begin(kid_client)
    private = 'PRIVATE_STUDENT_DRAFT'
    body = ('{"requestId":"nested","expectedRevision":0,"actionId":"reshape","inputs":{"rows":'
            + '[' * 1500 + '"' + private + '"' + ']' * 1500 + ',"columns":6}}')
    response = kid_client.post(BASE + f"/sessions/{initial['id']}/actions", content=body,
        headers={**headers(kid_client), 'Origin': 'http://testserver', 'X-CSRF-Token': csrf(kid_client),
                 'Content-Type': 'application/json'})
    assert response.status_code == 400, response.text
    assert private not in response.text
    assert kid_client.get(f"{BASE}/sessions/{initial['id']}").json() == initial


def test_adapter_shape_guard_rejects_contract_that_current_renderer_cannot_truthfully_display(kid_client, monkeypatch, tmp_path):
    raw = json.loads(preview.FIXTURE_PATHS['habitat_designer'].read_text())
    expression = next(item for item in raw['world']['objects'] if item['kind'] == 'equation')
    extra = copy.deepcopy(expression)
    extra['id'] = 'another-expression'
    remap = {ref: 'other-'+ref for ref in expression['bindings'].values()}
    extra['bindings'] = {role: remap[ref] for role, ref in extra['bindings'].items()}
    for slot in list(raw['world']['state']):
        if slot['id'] in remap:
            replacement = copy.deepcopy(slot)
            replacement['id'] = remap[slot['id']]
            raw['world']['state'].append(replacement)
    raw['world']['objects'].append(extra)
    raw['components'][0]['objectIds'].append(extra['id'])
    action = copy.deepcopy(next(item for item in raw['actions'] if item['operation'] == 'assemble_product'))
    old_id = action['id']
    action['id'] = 'other-expression-action'
    raw['actions'].append(action)
    for rule in list(raw['rules']):
        if rule['onAction'] == old_id:
            replacement = copy.deepcopy(rule)
            replacement.update(id='other-'+rule['id'], onAction=action['id'])
            for effect in replacement['effects']:
                effect['target'] = remap[effect['target']]
            raw['rules'].append(replacement)
    # The general contract legitimately admits this shape. The preview's
    # current one-equation adapter must reject it instead of wiring both tools
    # to the first displayed object and pretending the second one is present.
    require_valid_program(raw)
    fixture = tmp_path / 'two-equations.json'
    fixture.write_text(json.dumps(raw))
    monkeypatch.setitem(preview.FIXTURE_PATHS, 'two-equations', fixture)
    response = post(kid_client, '/preview/two-equations/sessions', dict(requestId='two-equations'))
    assert response.status_code == 422, response.text
    assert response.json()['error']['code'] == 'runtime_adapter_unavailable'


def test_adapter_rejects_a_second_action_that_would_be_silently_hidden_by_first_operation_selection(kid_client, monkeypatch, tmp_path):
    raw = json.loads(preview.FIXTURE_PATHS['habitat_designer'].read_text())
    action = copy.deepcopy(next(item for item in raw['actions'] if item['operation'] == 'resize_rectangle'))
    original = action['id']
    action.update(id='alternative-reshape', label='Reshape using the alternative declared action')
    raw['actions'].append(action)
    rule = copy.deepcopy(next(item for item in raw['rules'] if item['onAction'] == original))
    rule.update(id='alternative-reshape-rule', onAction=action['id'])
    raw['rules'].append(rule)
    require_valid_program(raw)
    fixture = tmp_path / 'duplicate-operation.json'
    fixture.write_text(json.dumps(raw))
    monkeypatch.setitem(preview.FIXTURE_PATHS, 'duplicate-operation', fixture)
    response = post(kid_client, '/preview/duplicate-operation/sessions', dict(requestId='duplicate-operation'))
    assert response.status_code == 422, response.text
    assert response.json()['error']['code'] == 'runtime_adapter_unavailable'
