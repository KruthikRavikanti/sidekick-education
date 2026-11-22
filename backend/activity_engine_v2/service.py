"""Owned preview persistence. Curriculum definitions and private event bodies stay server-side."""
from __future__ import annotations

import hashlib
import json
import uuid

from pydantic import ValidationError

from backend.accounts.security import AccountError
from .core import ExecutionCore, ProgramInvalid, RUNTIME_VERSION
from .models import ActivityProgram
from .preview import FIXTURE_PATHS, load_preview


def _json(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False, allow_nan=False)


def _hash(value):
    return hashlib.sha256(_json(value).encode()).hexdigest()


def _authorize(connection, security, kid_id, active):
    row = security.assert_active(connection, active, 'kid')
    if row['active_kid_profile_id'] != kid_id:
        raise AccountError('profile_changed', 'Your profile changed. Refresh the page and try again.', 409)
    security.owned_kid(connection, active.account_id, kid_id)


def _owned(connection, security, kid_id, session_id, active):
    _authorize(connection, security, kid_id, active)
    row = connection.execute('SELECT * FROM activity_program_sessions WHERE id=? AND kid_id=? AND account_id=?',
                             (session_id, kid_id, active.account_id)).fetchone()
    if not row:
        raise AccountError('not_found', 'That activity was not found.', 404)
    return row


def _definition(connection, row):
    version = connection.execute('SELECT * FROM activity_program_versions WHERE id=?', (row['program_version_id'],)).fetchone()
    if not version or version['runtime_version'] != RUNTIME_VERSION:
        raise AccountError('runtime_version_unavailable', 'This activity needs a different runtime version.', 409)
    try:
        program = ActivityProgram.model_validate_json(version['definition_json'])
        if (_hash(program.model_dump()) != version['definition_sha256']
                or program.schemaVersion != version['schema_version']
                or program.componentVersion != version['component_version']):
            raise ValueError()
    except (ValueError, ValidationError):
        raise AccountError('definition_integrity_failed', 'This saved activity could not be verified.', 503) from None
    # Approved immutable definitions replay with pinned semantics rather than
    # being reaccepted against a potentially changed curriculum catalog.
    return program, ExecutionCore(program), version


def _events(connection, session_id):
    return connection.execute('SELECT * FROM activity_program_events WHERE session_id=? ORDER BY revision', (session_id,)).fetchall()


def _assistance(program, delivered):
    actions = sorted({action for item in delivered.values() for action in item['actionIds']})
    evidence = sorted(item.id for item in program.evidence if set(item.actionIds).intersection(actions))
    return {'received': bool(delivered), 'actionIds': actions, 'evidenceIds': evidence}


def _outcome(program, core, state, delivered, observed_actions):
    complete = core.completed(state)
    assistance = _assistance(program, delivered)
    evidence = []
    for item in program.evidence:
        observed = bool(set(item.actionIds).intersection(observed_actions))
        status = 'not_observed'
        if complete and observed:
            if item.assessment.kind == 'parent_review':
                status = 'pending_parent_review'
            else:
                status = 'demonstrated' if core.evaluate(item.assessment.when, state, {}) else 'not_established'
        evidence.append({'id': item.id, 'status': status,
                         'assisted': bool(set(item.actionIds).intersection(assistance['actionIds']))})
    statuses = {item['status'] for item in evidence} - {'not_observed'}
    assessment = ('not_assessed' if not complete or not statuses else
                  'pending_parent_review' if statuses == {'pending_parent_review'} else
                  'demonstrated' if statuses == {'demonstrated'} else 'mixed')
    return {'missionComplete': complete, 'assessment': assessment,
            'assisted': any(item['assisted'] and item['status'] != 'not_observed' for item in evidence),
            'evidence': evidence}


def _project(row, program, core, version, events):
    state = json.loads(row['state_json'])
    delivered = json.loads(row['assistance_json'])
    visible = set(core.visible_spaces(state))
    components = [item for item in program.components if item.spaceId in visible]
    object_ids = {ref for item in components for ref in item.objectIds}
    objects = [item for item in program.world.objects if item.id in object_ids]
    material_ids = {ref for item in objects for ref in item.materialIds}
    state_ids = {ref for item in objects for ref in item.bindings.values()}
    component_ids = {item.id for item in components}
    observed = {json.loads(event['payload_json'])['actionId'] for event in events if event['kind'] == 'action'}
    outcome = _outcome(program, core, state, delivered, observed)
    available = []
    if row['status'] != 'completed':
        for item in program.help:
            uses = delivered.get(item.id, {}).get('uses', 0)
            # Help scoped only to currently visible actions can be requested.
            relevant_visible = any(action.id in item.actionIds and action.componentId in component_ids for action in program.actions)
            if relevant_visible and uses < item.maxUses and core.evaluate(item.availableWhen, state, {}):
                available.append({'id': item.id, 'kind': item.kind, 'label': 'Show me a hint' if item.kind == 'hint' else 'Show me help',
                                  'remainingUses': item.maxUses - uses})
    goal_status = core.goal_status(state)
    result = {
        'id': row['id'], 'programId': program.id, 'title': program.title,
        'definitionHash': version['definition_sha256'], 'schemaVersion': version['schema_version'],
        'componentVersion': version['component_version'], 'runtimeVersion': version['runtime_version'],
        'revision': row['revision'], 'actionCount': row['action_count'], 'status': row['status'],
        'spaces': [{'id': item.id, 'title': item.title} for item in program.presentation.spaces if item.id in visible],
        'components': [item.model_dump() for item in components],
        'objects': [item.model_dump() for item in objects],
        'materials': [item.model_dump() for item in program.world.materials if item.id in material_ids],
        'state': {ref: state[ref] for ref in state_ids},
        'stateSlots': [{key: value for key, value in item.model_dump().items() if key not in {'initial', 'mutable'} and value is not None}
                       for item in program.world.state if item.id in state_ids],
        'actions': [item.model_dump() for item in program.actions if item.componentId in component_ids],
        'goals': [{'id': item.id, 'description': item.description, 'achieved': goal_status[item.id]} for item in program.goals],
        'help': available, 'deliveredHelp': sorted(delivered.values(), key=lambda item: item['id']),
        'assistance': _assistance(program, delivered), 'outcome': outcome,
        'completionFeedback': ('Your creation is saved. Its quality is waiting for parent review.'
            if outcome['assessment'] == 'pending_parent_review' else
            'You finished your mission with help. Your workspace is saved.' if outcome['assisted'] else
            'You finished your mission. Your workspace is saved.') if outcome['missionComplete'] else None,
    }
    return result


def previews(security, kid_id, active):
    with security.db.transaction() as connection:
        _authorize(connection, security, kid_id, active)
        result = []
        for key in FIXTURE_PATHS:
            try:
                program = load_preview(key)
            except AccountError as error:
                result.append({'id': key, 'title': 'Preview unavailable', 'available': False, 'reasonCode': error.code})
                continue
            row = connection.execute('''SELECT s.id,s.status FROM activity_program_sessions s
                JOIN activity_program_versions v ON v.id=s.program_version_id
                WHERE s.kid_id=? AND s.account_id=? AND v.program_key=? ORDER BY s.started_at DESC,s.rowid DESC LIMIT 1''',
                (kid_id, active.account_id, key)).fetchone()
            result.append({'id': key, 'title': program.title, 'available': True,
                           'description': 'An original development example. Build, explore and finish a mission.',
                           'sessionId': row['id'] if row else None, 'status': row['status'] if row else None})
        return {'programs': result}


def start(security, kid_id, key, request_id, active):
    fingerprint = _hash({'programKey': key})
    with security.db.transaction() as connection:
        _authorize(connection, security, kid_id, active)
        previous = connection.execute('SELECT * FROM activity_program_start_requests WHERE kid_id=? AND request_id=?', (kid_id, request_id)).fetchone()
        if previous:
            if previous['request_sha256'] != fingerprint:
                raise AccountError('request_id_conflict', 'That request was already used for a different action.', 409)
            return json.loads(previous['response_json'])
        program = load_preview(key)
        core = ExecutionCore(program)
        definition = program.model_dump()
        definition_hash = _hash(definition)
        now = security.clock.now()
        version_id = definition_hash
        connection.execute('''INSERT OR IGNORE INTO activity_program_versions
            (id,program_key,definition_json,definition_sha256,schema_version,component_version,runtime_version,created_at)
            VALUES (?,?,?,?,?,?,?,?)''', (version_id, key, _json(definition), definition_hash,
            program.schemaVersion, program.componentVersion, RUNTIME_VERSION, now))
        session_id = uuid.uuid4().hex
        connection.execute('''INSERT INTO activity_program_sessions
            (id,account_id,kid_id,program_version_id,status,state_json,assistance_json,started_at)
            VALUES (?,?,?,?,'in_progress',?,'{}',?)''',
            (session_id, active.account_id, kid_id, version_id, _json(core.initial), now))
        row = _owned(connection, security, kid_id, session_id, active)
        _, _, version = _definition(connection, row)
        response = _project(row, program, core, version, [])
        connection.execute('INSERT INTO activity_program_start_requests VALUES (?,?,?,?,?)',
                           (kid_id, request_id, fingerprint, session_id, _json(response)))
        return response


def session_view(security, kid_id, session_id, active):
    with security.db.transaction() as connection:
        row = _owned(connection, security, kid_id, session_id, active)
        program, core, version = _definition(connection, row)
        try:
            core.check_state(json.loads(row['state_json']))
        except (ProgramInvalid, ValueError):
            raise AccountError('state_integrity_failed', 'This saved workspace could not be verified.', 503) from None
        return _project(row, program, core, version, _events(connection, session_id))


def _deliver_help(program, core, state, delivered, help_id):
    item = next((item for item in program.help if item.id == help_id), None)
    if item is None:
        raise AccountError('unknown_help', 'That help is not available.', 400)
    visible = set(core.visible_spaces(state))
    action_ids = {action.id for action in program.actions
                  if core.components[action.componentId].spaceId in visible}
    uses = delivered.get(help_id, {}).get('uses', 0)
    if (core.completed(state) or uses >= item.maxUses
            or not set(item.actionIds).intersection(action_ids)
            or not core.evaluate(item.availableWhen, state, {})):
        raise AccountError('help_unavailable', 'That help is not available right now.', 409)
    delivered[help_id] = {'id': item.id, 'kind': item.kind, 'text': item.text, 'uses': uses + 1,
                          'actionIds': list(item.actionIds),
                          'evidenceIds': [e.id for e in program.evidence if set(e.actionIds).intersection(item.actionIds)]}
    return delivered


def mutate(security, kid_id, session_id, kind, payload, active):
    fingerprint = _hash({'kind': kind, 'payload': payload})
    with security.db.transaction() as connection:
        row = _owned(connection, security, kid_id, session_id, active)
        previous = connection.execute('SELECT * FROM activity_program_events WHERE session_id=? AND request_id=?', (session_id, payload['requestId'])).fetchone()
        if previous:
            if previous['request_sha256'] != fingerprint:
                raise AccountError('request_id_conflict', 'That request was already used for a different action.', 409)
            return json.loads(previous['response_json'])
        if row['revision'] != payload['expectedRevision']:
            raise AccountError('stale_revision', 'Your workspace changed. Reload it and try again.', 409)
        if row['status'] == 'completed':
            raise AccountError('mission_completed', 'Your finished workspace is saved.', 409)
        program, core, version = _definition(connection, row)
        state = json.loads(row['state_json'])
        delivered = json.loads(row['assistance_json'])
        action_count = row['action_count']
        try:
            if kind == 'action':
                transition = core.transition(state, payload['actionId'], payload['inputs'], action_count=action_count)
                state, action_count = transition.state, transition.action_count
            elif kind == 'help':
                delivered = _deliver_help(program, core, state, delivered, payload['helpId'])
            else:
                raise AccountError('invalid_request', 'That action is not available.', 400)
        except ProgramInvalid as error:
            raise AccountError(error.code, 'That action could not be applied. Your workspace has not changed.', 400) from None
        revision = row['revision'] + 1
        complete = core.completed(state)
        now = security.clock.now()
        old_events = _events(connection, session_id)
        observed = {json.loads(event['payload_json'])['actionId'] for event in old_events if event['kind'] == 'action'}
        if kind == 'action':
            observed.add(payload['actionId'])
        outcome = _outcome(program, core, state, delivered, observed)
        snapshot = {'state': state, 'outcome': outcome, 'assistance': delivered, 'revision': revision,
                    'definitionHash': version['definition_sha256'], 'runtimeVersion': RUNTIME_VERSION} if complete else None
        connection.execute('''UPDATE activity_program_sessions SET state_json=?,assistance_json=?,revision=?,
            action_count=?,status=?,completion_snapshot_json=?,completed_at=? WHERE id=?''',
            (_json(state), _json(delivered), revision, action_count, 'completed' if complete else 'in_progress',
             _json(snapshot) if snapshot else None, now if complete else None, session_id))
        event_id = uuid.uuid4().hex
        # Accepted event evidence records attribution and the exact private state,
        # not a correctness judgment on each exploratory move.
        attributable = {'kind': kind, 'actionId': payload.get('actionId'), 'helpId': payload.get('helpId'),
                        'assistance': _assistance(program, delivered), 'outcome': outcome}
        connection.execute('''INSERT INTO activity_program_events
            (id,session_id,request_id,request_sha256,revision,kind,payload_json,state_json,evidence_json,response_json,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,'{}',?)''', (event_id, session_id, payload['requestId'], fingerprint,
            revision, kind, _json(payload), _json(state), _json(attributable), now))
        updated = _owned(connection, security, kid_id, session_id, active)
        response = _project(updated, program, core, version, _events(connection, session_id))
        connection.execute('UPDATE activity_program_events SET response_json=? WHERE id=?', (_json(response), event_id))
        return response


def replay(security, kid_id, session_id, expected_revision, active):
    """Verify every accepted transition with pinned trusted semantics, without mutation."""
    with security.db.transaction() as connection:
        row = _owned(connection, security, kid_id, session_id, active)
        if row['revision'] != expected_revision:
            raise AccountError('stale_revision', 'Your workspace changed. Reload it and try again.', 409)
        program, core, version = _definition(connection, row)
        state, delivered, count, observed = core.initial, {}, 0, set()
        last_snapshot = None
        events = _events(connection, session_id)
        try:
            for revision, event in enumerate(events, 1):
                payload = json.loads(event['payload_json'])
                if (event['revision'] != revision or payload['expectedRevision'] != revision - 1
                        or payload['requestId'] != event['request_id']):
                    raise ValueError()
                if _hash({'kind': event['kind'], 'payload': payload}) != event['request_sha256']:
                    raise ValueError()
                if event['kind'] == 'action':
                    transition = core.transition(state, payload['actionId'], payload['inputs'], action_count=count)
                    state, count = transition.state, transition.action_count
                    observed.add(payload['actionId'])
                else:
                    delivered = _deliver_help(program, core, state, delivered, payload['helpId'])
                if _json(state) != event['state_json']:
                    raise ValueError()
                outcome = _outcome(program, core, state, delivered, observed)
                attributable = {'kind': event['kind'], 'actionId': payload.get('actionId'), 'helpId': payload.get('helpId'),
                                'assistance': _assistance(program, delivered), 'outcome': outcome}
                if _json(attributable) != event['evidence_json']:
                    raise ValueError()
                event_row = dict(row)
                event_row.update(state_json=_json(state), assistance_json=_json(delivered),
                                 revision=revision, action_count=count,
                                 status='completed' if core.completed(state) else 'in_progress')
                if _json(_project(event_row, program, core, version, events[:revision])) != event['response_json']:
                    raise ValueError()
                if core.completed(state):
                    last_snapshot = {'state': state, 'outcome': outcome, 'assistance': delivered, 'revision': revision,
                                     'definitionHash': version['definition_sha256'], 'runtimeVersion': RUNTIME_VERSION}
            if (len(events) != row['revision'] or count != row['action_count']
                    or _json(state) != row['state_json'] or _json(delivered) != row['assistance_json']
                    or (row['status'] == 'completed') != core.completed(state)
                    or (_json(last_snapshot) if last_snapshot else None) != row['completion_snapshot_json']):
                raise ValueError()
        except (ValueError, KeyError, ProgramInvalid, AccountError):
            raise AccountError('replay_integrity_failed', 'This saved workspace could not be verified.', 503) from None
        return {'verified': True, 'eventCount': len(events), 'session': _project(row, program, core, version, events)}
