"""Durable, owned composition reservations; provider work never holds a transaction."""
from __future__ import annotations

import asyncio
import json
import re
import uuid

from backend.accounts.security import AccountError
from .context import build_context
from .service import _authorize, _json, start_approved

GENERATION_TIMEOUT_SECONDS = 360
GENERATION_LEASE_SECONDS = 420
STAGES = {'queued', 'context', 'compose', 'validate', 'review', 'repair', 'start', 'ready', 'failed',
          'provider', 'schema', 'capability', 'witness', 'scoring'}


def _owned(connection, security, kid_id, generation_id, active):
    _authorize(connection, security, kid_id, active)
    row = connection.execute('SELECT * FROM activity_program_generations WHERE id=? AND kid_id=? AND account_id=?',
                             (generation_id, kid_id, active.account_id)).fetchone()
    if not row:
        raise AccountError('not_found', 'That activity preparation was not found.', 404)
    return row


def _expire(connection, security, row):
    if row['status'] == 'processing' and row['lease_until'] <= security.clock.now():
        connection.execute("UPDATE activity_program_generations SET status='failed',stage='failed',reason_code='generation_interrupted',lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND status='processing'",
                           (security.clock.now(), row['id']))
        return connection.execute('SELECT * FROM activity_program_generations WHERE id=?', (row['id'],)).fetchone()
    return row


def _view(row):
    target = json.loads(row['target_json'])
    return dict(id=row['id'], status=row['status'], stage=row['stage'], reasonCode=row['reason_code'],
        sessionId=row['session_id'], canRetry=row['status'] == 'failed', targetSkill=target,
        title='An activity for '+target['name'], createdAt=row['created_at'])


def suggestion(security, kid_id, upload_id, active):
    with security.db.transaction() as connection:
        _authorize(connection, security, kid_id, active)
        try:
            context = build_context(connection, security, kid_id, upload_id, active)
        except AccountError as error:
            if error.code not in {'analysis_pending', 'analysis_failed', 'no_supported_skill'}:
                raise
            return dict(available=False, reason=error.code, targetSkill=None, generation=None)
        row = connection.execute('''SELECT * FROM activity_program_generations
            WHERE kid_id=? AND account_id=? AND upload_id=? ORDER BY created_at DESC,rowid DESC LIMIT 1''',
            (kid_id, active.account_id, upload_id)).fetchone()
        return dict(available=True, reason=None, targetSkill=context.target_view,
                    generation=_view(_expire(connection, security, row)) if row else None)


def view(security, kid_id, generation_id, active):
    with security.db.transaction() as connection:
        return _view(_expire(connection, security, _owned(connection, security, kid_id, generation_id, active)))


def listing(security, kid_id, active):
    with security.db.transaction() as connection:
        _authorize(connection, security, kid_id, active)
        rows = connection.execute('''SELECT * FROM activity_program_generations
            WHERE kid_id=? AND account_id=? ORDER BY created_at DESC,rowid DESC LIMIT 20''', (kid_id, active.account_id)).fetchall()
        return dict(generations=[_view(_expire(connection, security, row)) for row in rows])


def retry_source(security, kid_id, generation_id, active):
    with security.db.transaction() as connection:
        row = _owned(connection, security, kid_id, generation_id, active)
        return row['upload_id']


def reserve(security, kid_id, upload_id, request_id, active, *, retry_of=None):
    """Return (public status, worker lease); identical/aliased requests never spawn work."""
    with security.db.transaction() as connection:
        _authorize(connection, security, kid_id, active)
        original = None
        if retry_of is not None:
            original = _owned(connection, security, kid_id, retry_of, active)
            if original['upload_id'] != upload_id or not connection.execute(
                    'SELECT 1 FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone():
                raise AccountError('not_found', 'That student work was not found.', 404)
        previous = connection.execute('''SELECT r.upload_id,g.* FROM activity_program_generation_requests r
            JOIN activity_program_generations g ON g.id=r.generation_id
            WHERE r.kid_id=? AND r.request_id=?''', (kid_id, request_id)).fetchone()
        if previous:
            if previous['upload_id'] != upload_id:
                raise AccountError('request_id_conflict', 'That request was used for different work.', 409)
            return _view(_expire(connection, security, previous)), None
        if original is not None:
            original = _expire(connection, security, original)
            recoverable = [original] if original['status'] in {'processing', 'ready'} else []
            if not recoverable:
                # Refresh can lose the accepted retry's navigation and request
                # ID. Recover a later attempt for this source, including one
                # already finished, without creating another model job. Use
                # SQLite insertion order because server clocks may tie.
                original_sequence = connection.execute('SELECT rowid FROM activity_program_generations WHERE id=?',
                                                       (original['id'],)).fetchone()[0]
                recoverable = connection.execute('''SELECT * FROM activity_program_generations
                    WHERE kid_id=? AND account_id=? AND upload_id=? AND rowid>?
                    AND status IN ('processing','ready') ORDER BY rowid''',
                    (kid_id, active.account_id, upload_id, original_sequence)).fetchall()
            for candidate in recoverable:
                candidate = _expire(connection, security, candidate)
                if candidate['status'] in {'processing', 'ready'}:
                    connection.execute('INSERT INTO activity_program_generation_requests VALUES (?,?,?,?)',
                                       (kid_id, request_id, upload_id, candidate['id']))
                    return _view(candidate), None
        context = build_context(connection, security, kid_id, upload_id, active)
        running = connection.execute('''SELECT * FROM activity_program_generations
            WHERE kid_id=? AND account_id=? AND upload_id=? AND status='processing'
            ORDER BY created_at DESC,rowid DESC LIMIT 1''', (kid_id, active.account_id, upload_id)).fetchone()
        if running:
            running = _expire(connection, security, running)
            if running['status'] == 'processing':
                connection.execute('INSERT INTO activity_program_generation_requests VALUES (?,?,?,?)',
                                   (kid_id, request_id, upload_id, running['id']))
                return _view(running), None
        identifier, token, now = uuid.uuid4().hex, uuid.uuid4().hex, security.clock.now()
        connection.execute('''INSERT INTO activity_program_generations
            (id,account_id,kid_id,upload_id,status,stage,lease_token,lease_until,
            context_json,private_sources_json,target_json,created_at,updated_at)
            VALUES (?,?,?,?,'processing','queued',?,?,?,?,?,?,?)''',
            (identifier, active.account_id, kid_id, upload_id, token, now+GENERATION_LEASE_SECONDS,
             _json(context.sanitized), _json(context.private_sources), _json(context.target_view), now, now))
        connection.execute('INSERT INTO activity_program_generation_requests VALUES (?,?,?,?)',
                           (kid_id, request_id, upload_id, identifier))
        row = connection.execute('SELECT * FROM activity_program_generations WHERE id=?', (identifier,)).fetchone()
        return _view(row), token


def _diagnostics(connection, generation_id, events):
    row = connection.execute('SELECT private_sources_json FROM activity_program_generations WHERE id=?',
                             (generation_id,)).fetchone()
    if row:
        sources = json.loads(row['private_sources_json'])
        sources['generationDiagnostics'] = list(events or [])
        connection.execute('UPDATE activity_program_generations SET private_sources_json=? WHERE id=?',
                           (_json(sources), generation_id))


def _fail(security, generation_id, token, code, stage='failed', metadata=None):
    # Only fixed content-safe identifiers leave an error; no exception strings.
    code = code if isinstance(code, str) and re.fullmatch(r'[a-z][a-z0-9_]{0,79}', code) else 'generation_failed'
    stage = stage if stage in STAGES else 'failed'
    with security.db.transaction() as connection:
        changed = connection.execute('''UPDATE activity_program_generations SET status='failed',stage=?,reason_code=?,
            lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=? AND status='processing' ''',
            (stage, code, security.clock.now(), generation_id, token))
        if changed.rowcount and metadata is not None:
            calls = list(getattr(metadata, 'model_calls', []) or [])
            returned = [item['returnedModel'] for item in calls if item.get('returnedModel')]
            connection.execute('''UPDATE activity_program_generations SET requested_model=?,model_calls_json=?,
                returned_models_json=?,call_count=? WHERE id=?''',
                (getattr(metadata, 'requested_model', None), _json(calls), _json(returned),
                 getattr(metadata, 'call_count', 0), generation_id))
            _diagnostics(connection, generation_id, getattr(metadata, 'diagnostic_events', []))


async def run(security, kid_id, generation_id, token, active, adapter=None):
    """A bounded in-process worker. A stopped process leaves a recoverable expiring lease."""
    from .composer import compose, CompositionFailure

    async def progress(stage):
        stage = {'composing': 'compose', 'validating': 'validate', 'reviewing': 'review', 'repairing': 'repair'}.get(stage, stage)
        with security.db.transaction() as connection:
            row = _owned(connection, security, kid_id, generation_id, active)
            if row['status'] != 'processing' or row['lease_token'] != token or row['lease_until'] <= security.clock.now():
                raise AccountError('generation_interrupted', 'Please retry preparing this activity.', 409)
            # Recheck the source still belongs to this child before every stage.
            if not connection.execute('SELECT 1 FROM homework_uploads WHERE id=? AND kid_id=?',
                                      (row['upload_id'], kid_id)).fetchone():
                raise AccountError('not_found', 'That student work was not found.', 404)
            connection.execute('UPDATE activity_program_generations SET stage=?,updated_at=? WHERE id=?',
                               (stage if stage in STAGES else 'compose', security.clock.now(), generation_id))

    try:
        await progress('context')
        with security.db.transaction() as connection:
            row = _owned(connection, security, kid_id, generation_id, active)
            context = json.loads(row['context_json'])
        # All provider calls and the review/repair loop occur after the transaction.
        approved = await asyncio.wait_for(compose(context, adapter=adapter, progress=progress,
                                                   budget_seconds=GENERATION_TIMEOUT_SECONDS), GENERATION_TIMEOUT_SECONDS)
        await progress('start')
        with security.db.transaction() as connection:
            row = _owned(connection, security, kid_id, generation_id, active)
            if row['status'] != 'processing' or row['lease_token'] != token or row['lease_until'] <= security.clock.now():
                raise AccountError('generation_interrupted', 'Please retry preparing this activity.', 409)
            if not connection.execute('SELECT 1 FROM homework_uploads WHERE id=? AND kid_id=?', (row['upload_id'], kid_id)).fetchone():
                raise AccountError('not_found', 'That student work was not found.', 404)
            from .models import Misconception, Observation, SkillTarget
            pinned_context = json.loads(row['context_json'])
            trusted_intent = dict(
                targets=[SkillTarget.model_validate(item).model_dump() for item in pinned_context['targets']],
                observations=[Observation.model_validate(item).model_dump() for item in pinned_context.get('observations', [])],
                misconceptions=[Misconception.model_validate(item).model_dump() for item in pinned_context.get('misconceptions', [])])
            if approved.program.intent.model_dump(exclude={'successEvidence'}, warnings=False) != trusted_intent:
                raise AccountError('forged_learning_context', 'The activity intent could not be verified.', 503)
            session = start_approved(connection, security, kid_id, approved, active)
            review = approved.review.model_dump(warnings=False) if hasattr(approved.review, 'model_dump') else approved.review
            _diagnostics(connection, generation_id, getattr(approved, 'diagnostic_events', []))
            connection.execute('''UPDATE activity_program_generations SET status='ready',stage='ready',reason_code=NULL,
                session_id=?,requested_model=?,returned_models_json=?,model_calls_json=?,review_json=?,approved_definition_sha256=?,call_count=?,
                lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=?''',
                (session['id'], approved.requested_model, _json(list(approved.returned_models)), _json(approved.model_calls), _json(review),
                 approved.definition_hash, approved.call_count, security.clock.now(), generation_id, token))
    except CompositionFailure as error:
        _fail(security, generation_id, token, error.code, error.stage, error)
    except AccountError as error:
        _fail(security, generation_id, token, error.code)
    except (asyncio.TimeoutError, TimeoutError):
        _fail(security, generation_id, token, 'generation_timeout')
    except asyncio.CancelledError:
        _fail(security, generation_id, token, 'generation_interrupted')
        raise
    except Exception:
        _fail(security, generation_id, token, 'generation_failed')
