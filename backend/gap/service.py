"""Transactional learning orchestration; model calls run between transactions."""
import asyncio
import hashlib
import json
import re
import uuid
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from backend.accounts.security import AccountError, kid_view
from .config import CONFIG
from .reducer import initial_state, reduce_state


def uid():
    return uuid.uuid4().hex


def encode(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def decode(value, default=None):
    try:
        return json.loads(value) if isinstance(value, str) else value
    except (ValueError, TypeError):
        return default


def question_fingerprint(question):
    return hashlib.sha256(re.sub(r'\s+', ' ', question or '').strip().casefold().encode()).hexdigest()


def authorize(security, conn, kid_id, expected_session=None, mode=None):
    if expected_session is not None:
        current = security.assert_active(conn, expected_session, mode)
        security.owned_kid(conn, expected_session.account_id, kid_id)
        if current['mode'] == 'kid' and current['active_kid_profile_id'] != kid_id:
            raise AccountError('kid_required', 'Choose this child profile to continue.', 403)
    elif not conn.execute('SELECT 1 FROM kid_profiles WHERE id=?', (kid_id,)).fetchone():
        raise AccountError('not_found', 'That child profile was not found.', 404)


def _state(conn, kid_id, subskill_id):
    row = conn.execute('SELECT state_json FROM skill_states WHERE kid_id=? AND subskill_id=?', (kid_id, subskill_id)).fetchone()
    return initial_state() | (decode(row[0], {}) if row else {})


def _save_state(conn, kid_id, subskill_id, state, now):
    conn.execute('INSERT INTO skill_states VALUES (?,?,?,?,?) ON CONFLICT(kid_id,subskill_id) DO UPDATE SET status=excluded.status,state_json=excluded.state_json,updated_at=excluded.updated_at',
                 (kid_id, subskill_id, state['status'], encode(state), now))


def _assignment(conn, kid_id, subskill_id, purpose, now):
    existing = conn.execute("SELECT * FROM practice_assignments WHERE kid_id=? AND subskill_id=? AND status IN ('awaiting_items','open')", (kid_id, subskill_id)).fetchone()
    if existing:
        return dict(existing)
    count = CONFIG.check_items if purpose == 'check' else CONFIG.recheck_items if purpose == 'recheck' else CONFIG.practice_round_items
    identity = uid()
    conn.execute('INSERT INTO practice_assignments(id,kid_id,subskill_id,purpose,status,required_count,episode,created_at) VALUES (?,?,?,?,?,?,?,?)',
                 (identity, kid_id, subskill_id, purpose, 'awaiting_items', count, _state(conn, kid_id, subskill_id)['episode'], now))
    return dict(conn.execute('SELECT * FROM practice_assignments WHERE id=?', (identity,)).fetchone())


def _recompute(conn, kid_id, subskill_id, now):
    old = _state(conn, kid_id, subskill_id)
    events = []
    for row in conn.execute('SELECT * FROM learning_evidence WHERE kid_id=? AND subskill_id=? AND id>? ORDER BY id', (kid_id, subskill_id, old['last_event_seq'])):
        event = dict(row)
        event['seq'] = event['id']
        events.append(event)
    completed = []
    for row in conn.execute("SELECT * FROM practice_assignments WHERE kid_id=? AND subskill_id=? AND status='completed' ORDER BY completed_at,id", (kid_id, subskill_id)):
        final_seq = conn.execute('SELECT MAX(e.id) FROM learning_evidence e JOIN practice_attempts pa ON pa.id=e.source_ref JOIN assignment_items ai ON ai.id=pa.assignment_item_id WHERE ai.assignment_id=?', (row['id'],)).fetchone()[0]
        completed.append(dict(id=row['id'], purpose=row['purpose'], count=row['required_count'], completed_at=row['completed_at'], completion_seq=final_seq,
                              grades=[grade[0] for grade in conn.execute('SELECT correctness FROM assignment_items WHERE assignment_id=? ORDER BY position', (row['id'],))]))
    state, actions = reduce_state(old, events, completed, CONFIG, now)
    _save_state(conn, kid_id, subskill_id, state, now)
    for action in actions:
        if action['type'] == 'create_assignment' and state['status'] == 'checking':
            _assignment(conn, kid_id, subskill_id, action['purpose'], now)
        elif action['type'] == 'check_failed':
            root_check = conn.execute('SELECT 1 FROM gap_chain_steps s JOIN gap_chains c ON c.id=s.chain_id WHERE c.kid_id=? AND s.assignment_id=? AND s.position>0', (kid_id, action['assignment_id'])).fetchone()
            if not root_check:
                chain_id = uid()
                conn.execute("INSERT OR IGNORE INTO gap_chains VALUES (?,?,?,?,'tracing',NULL,NULL,?,?)", (chain_id, kid_id, subskill_id, action['assignment_id'], now, now))
                chain = conn.execute('SELECT id FROM gap_chains WHERE trigger_assignment_id=?', (action['assignment_id'],)).fetchone()
                conn.execute("INSERT OR IGNORE INTO gap_chain_steps VALUES (?,0,?,'gap',?)", (chain[0], subskill_id, action['assignment_id']))
        elif action['type'] == 'resume_practice':
            _assignment(conn, kid_id, subskill_id, 'practice', now)
        elif action['type'] == 'mastered':
            conn.execute("UPDATE practice_assignments SET status='cancelled' WHERE kid_id=? AND subskill_id=? AND purpose='practice' AND status IN ('open','awaiting_items')", (kid_id, subskill_id))
    _progress_chains(conn, kid_id, now)
    return state, actions


def _progress_chains(conn, kid_id, now):
    from .catalog import get_roots
    for chain_row in conn.execute("SELECT * FROM gap_chains WHERE kid_id=? AND status!='completed' ORDER BY created_at,id", (kid_id,)).fetchall():
        chain = dict(chain_row)
        steps = [dict(row) for row in conn.execute('SELECT * FROM gap_chain_steps WHERE chain_id=? ORDER BY position', (chain['id'],))]
        for step in steps:
            state = _state(conn, kid_id, step['subskill_id'])
            outcome = 'mastered' if state['status'] == 'mastered' else 'gap' if state['status'] in ('gap', 'practicing') else 'passed' if state['status'] == 'on_track' and state.get('last_check_outcome') == 'passed' else 'checking'
            step['outcome'] = outcome
            conn.execute('UPDATE gap_chain_steps SET outcome=? WHERE chain_id=? AND position=?', (outcome, chain['id'], step['position']))
        stop_reason = chain['stop_reason']
        if chain['status'] == 'tracing':
            for _ in range(CONFIG.max_chain_depth + 1):
                last = steps[-1]
                if last['outcome'] == 'checking':
                    break
                if last['outcome'] in ('passed', 'mastered'):
                    stop_reason = 'root_passed'
                    break
                if len(steps) >= CONFIG.max_chain_depth + 1:
                    stop_reason = 'depth_limit'
                    break
                visited = {step['subskill_id'] for step in steps}
                roots = get_roots(conn, last['subskill_id'])
                valid = [root for root in roots if root.get('usable') and root.get('confidence', '').lower() in ('high', 'medium') and root.get('target_id') not in visited]
                if not valid:
                    stop_reason = 'cycle_or_visited' if any(root.get('target_id') in visited for root in roots) else 'no_valid_root'
                    break
                root_id = valid[0]['target_id']
                state = _state(conn, kid_id, root_id)
                if state['status'] == 'mastered':
                    outcome, assignment_id = 'mastered', None
                elif state['status'] in ('gap', 'practicing'):
                    outcome, assignment_id = 'gap', None
                elif state['status'] == 'on_track' and state.get('last_check_outcome') == 'passed':
                    outcome, assignment_id = 'passed', None
                else:
                    assignment = _assignment(conn, kid_id, root_id, 'check', now)
                    state['status'] = 'checking'
                    _save_state(conn, kid_id, root_id, state, now)
                    outcome, assignment_id = 'checking', assignment['id']
                step = dict(position=len(steps), subskill_id=root_id, outcome=outcome, assignment_id=assignment_id)
                conn.execute('INSERT INTO gap_chain_steps VALUES (?,?,?,?,?)', (chain['id'], step['position'], root_id, outcome, assignment_id))
                steps.append(step)
        if stop_reason:
            waiting = [step for step in reversed(steps) if step['outcome'] == 'gap']
            target = waiting[0]['subskill_id'] if waiting else None
            conn.execute('UPDATE gap_chains SET status=?,current_target_id=?,stop_reason=?,updated_at=? WHERE id=?', ('practicing' if target else 'completed', target, stop_reason, now, chain['id']))
            if target:
                target_state = _state(conn, kid_id, target)
                target_state['status'] = 'practicing'
                _save_state(conn, kid_id, target, target_state, now)
                _assignment(conn, kid_id, target, 'practice', now)


def record_homework_evidence(security, kid_id, problem_id, subskill_id, correctness, eligible, confidence, signature=None,
                             *, fingerprint=None, question=None, expected_session=None, expected_upload_id=None):
    """One authoritative eligible event per child/question, including retry history.

    Call outside the upload transaction. Authorization is checked again here so
    profile switches/deletions during remote processing cannot write learning data.
    """
    now = security.clock.now()
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session)
        if expected_upload_id is not None and not conn.execute("SELECT 1 FROM homework_problems p JOIN homework_uploads u ON u.id=p.upload_id WHERE p.id=? AND p.upload_id=? AND u.kid_id=? AND u.state='processing'", (problem_id, expected_upload_id, kid_id)).fetchone():
            raise AccountError('not_found', 'That worksheet is no longer available.', 404)
        if correctness not in ('correct', 'incorrect', 'ungraded'):
            raise ValueError('Invalid correctness')
        valid_subskill = conn.execute('SELECT id FROM catalog_subskills WHERE id=? AND active=1', (subskill_id,)).fetchone() if subskill_id else None
        if not valid_subskill:
            subskill_id = None
        eligible = bool(eligible and subskill_id and correctness != 'ungraded' and confidence is not None and confidence >= CONFIG.mapping_confidence)
        fingerprint = fingerprint or (question_fingerprint(question) if question else None)
        if eligible and fingerprint and conn.execute("SELECT 1 FROM learning_evidence WHERE kid_id=? AND fingerprint=? AND source='homework' AND eligible=1", (kid_id, fingerprint)).fetchone():
            eligible = False
        conn.execute('INSERT OR IGNORE INTO learning_evidence(kid_id,subskill_id,source,source_ref,fingerprint,question,correctness,eligible,confidence,signature_json,created_at) VALUES (?,?,\'homework\',?,?,?,?,?,?,?,?)',
                     (kid_id, subskill_id, problem_id, fingerprint, question, correctness, int(eligible), confidence, encode(signature), now))
        row = conn.execute("SELECT * FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref=?", (kid_id, problem_id)).fetchone()
        if subskill_id:
            state, _ = _recompute(conn, kid_id, subskill_id, now)
        else:
            state = None
    return dict(evidenceId=row['id'], eligible=bool(row['eligible']), state=state)


def audit_model(security, task, record_ref, outcome, *, model='', prompt_version='', catalog_revision='', confidence=None, explanation='', kid_id=None):
    with security.db.transaction() as conn:
        _audit(conn, security, task, record_ref, outcome, model=model, prompt_version=prompt_version, catalog_revision=catalog_revision, confidence=confidence, explanation=explanation, kid_id=kid_id)


def _audit(conn, security, task, record_ref, outcome, *, model='', prompt_version='', catalog_revision='', confidence=None, explanation='', kid_id=None):
    # Keep explanations short and strip contact details; never persist prompts/images.
    explanation = re.sub(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}', '[redacted]', explanation or '')[:500]
    if kid_id:
        private_values = _private_values(conn, kid_id)
        if not private_values:
            return
        for value in private_values:
            explanation = re.sub(r'(?<!\w)' + re.escape(value) + r'(?!\w)', '[redacted]', explanation, flags=re.I)
    conn.execute('INSERT INTO model_audits VALUES (?,?,?,?,?,?,?,?,?,?,?)', (uid(), kid_id, task, record_ref, model, prompt_version, catalog_revision, outcome, confidence, explanation, security.clock.now()))


def remove_homework_evidence(security, kid_id, problem_ids, *, expected_session=None):
    """Delete upload-linked content; retain independent diagnostic/practice history."""
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent' if expected_session else None)
        affected = set()
        for problem_id in problem_ids:
            affected.update(row[0] for row in conn.execute("SELECT subskill_id FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref=? AND subskill_id IS NOT NULL", (kid_id, problem_id)))
            conn.execute("DELETE FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref=?", (kid_id, problem_id))
        for subskill_id in affected:
            conn.execute('DELETE FROM skill_states WHERE kid_id=? AND subskill_id=?', (kid_id, subskill_id))
            # Only an uncompleted homework-triggered check is invalidated by loss
            # of its source. Completed diagnostic answers remain student history.
            if not conn.execute('SELECT 1 FROM gap_chain_steps s JOIN gap_chains c ON c.id=s.chain_id WHERE c.kid_id=? AND s.subskill_id=?', (kid_id, subskill_id)).fetchone():
                conn.execute("UPDATE practice_assignments SET status='cancelled' WHERE kid_id=? AND subskill_id=? AND purpose='check' AND status IN ('open','awaiting_items')", (kid_id, subskill_id))
            _recompute(conn, kid_id, subskill_id, security.clock.now())


def _private_values(conn, kid_id):
    row = conn.execute('SELECT k.first_name,k.id,k.account_id,a.email FROM kid_profiles k JOIN accounts a ON a.id=k.account_id WHERE k.id=?', (kid_id,)).fetchone()
    return tuple(row) if row else ()


def _private_item(row):
    item = dict(row)
    for field, key in [('context_json', 'context'), ('response_spec_json', 'responseSpec'), ('grading_spec_json', 'gradingSpec')]:
        item[key] = decode(item.get(field), {} if key != 'context' else [])
    return item


def _pool(conn, assignment):
    rows = conn.execute("SELECT * FROM practice_items WHERE subskill_id=? AND active=1 AND ((verified=1 AND readiness='ready') OR readiness='adult_required') ORDER BY CASE source WHEN 'seed' THEN 0 ELSE 1 END,logical_id,id", (assignment['subskill_id'],)).fetchall()
    seen, items = set(), []
    for row in rows:
        item = _private_item(row)
        fingerprint = question_fingerprint(item['question'])
        if fingerprint in seen:
            continue
        if assignment['purpose'] == 'practice' and conn.execute('SELECT 1 FROM assignment_items ai JOIN practice_assignments a ON a.id=ai.assignment_id WHERE a.kid_id=? AND ai.fingerprint=?', (assignment['kid_id'], fingerprint)).fetchone():
            continue
        seen.add(fingerprint)
        items.append(item)
    return items


_generation_limiter = asyncio.Semaphore(CONFIG.generation_concurrency)


async def prepare_assignment(security, assignment_id, kid_id, expected_session, *, adapter=None):
    """Claim a short lease, generate/verify outside SQLite, then atomically publish."""
    from .catalog import get_subskill
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session)
        row = conn.execute('SELECT * FROM practice_assignments WHERE id=? AND kid_id=?', (assignment_id, kid_id)).fetchone()
        if not row or row['status'] != 'awaiting_items':
            return
        assignment = dict(row)
        if assignment['preparation_until'] and assignment['preparation_until'] > security.clock.now():
            return
        conn.execute('UPDATE practice_assignments SET preparation_until=?,preparation_error=NULL WHERE id=?', (security.clock.now() + 180, assignment_id))
        pool = _pool(conn, assignment)
        subskill = get_subskill(conn, assignment['subskill_id'])
        private_values = _private_values(conn, kid_id)
    try:
        if len(pool) < assignment['required_count']:
            if adapter is False:
                raise RuntimeError('Model tasks are disabled for this request.')
            from .vision import VisionAdapter
            from .items import save_generated_item
            adapter = adapter or VisionAdapter(private_values=private_values)
            async with _generation_limiter:
                for _ in range(CONFIG.generation_retries):
                    missing = assignment['required_count'] - len(pool)
                    if missing <= 0:
                        break
                    generated = await adapter.generate_items(subskill, count=missing)
                    with security.db.transaction() as conn:
                        authorize(security, conn, kid_id, expected_session)
                        _audit(conn, security, 'generate_items', assignment_id, 'generated' if generated else 'empty', model=getattr(adapter, 'model', ''), prompt_version='sidekick-gap-v1', catalog_revision=subskill.get('revision', ''), explanation='Generated candidate items await content and answer verification.', kid_id=kid_id)
                    for candidate in generated[:missing]:
                        from .catalog_models import CompiledItem
                        target_context = {key: subskill.get(key) for key in ('subskill', 'skill', 'subject', 'grade', 'p1_q', 'p2_q')}
                        verification = await adapter.verify_item(candidate | {'targetSubskill': target_context})
                        with security.db.transaction() as conn:
                            authorize(security, conn, kid_id, expected_session)
                            _audit(conn, security, 'verify_item', assignment_id, 'verified' if verification.verified else 'adult_review' if candidate.get('readiness') == 'adult_required' and verification.aligned_subskill and verification.difficulty_match else 'rejected', model=verification.model, prompt_version=verification.prompt_version, catalog_revision=subskill.get('revision', ''), explanation=verification.explanation, kid_id=kid_id)
                        if candidate.get('readiness') == 'adult_required':
                            if candidate.get('context', {}).get('missing') or not verification.aligned_subskill or not verification.difficulty_match:
                                continue
                            candidate = candidate | dict(verificationMethod='independent_alignment_and_parent_adjudication', verificationResult=verification.model_dump())
                            compiled = CompiledItem.model_validate(candidate)
                        else:
                            if not verification.verified:
                                continue
                            candidate = candidate | dict(verified=True, readiness='ready', verificationMethod=verification.method, verificationResult=verification.model_dump())
                            compiled = CompiledItem.model_validate(candidate)
                        if not compiled.question.strip() or not compiled.answer.strip():
                            continue
                        with security.db.transaction() as conn:
                            authorize(security, conn, kid_id, expected_session)
                            save_generated_item(conn, assignment['subskill_id'], 'generated:' + uid(), compiled, now=security.clock.now())
                    with security.db.transaction() as conn:
                        authorize(security, conn, kid_id, expected_session)
                        pool = _pool(conn, assignment)
        with security.db.transaction() as conn:
            authorize(security, conn, kid_id, expected_session)
            row = conn.execute('SELECT status FROM practice_assignments WHERE id=? AND kid_id=?', (assignment_id, kid_id)).fetchone()
            if row and row[0] == 'awaiting_items' and len(pool) >= assignment['required_count']:
                for position, item in enumerate(pool[:assignment['required_count']]):
                    conn.execute('INSERT INTO assignment_items(id,assignment_id,item_id,position,fingerprint) VALUES (?,?,?,?,?)', (uid(), assignment_id, item['id'], position, question_fingerprint(item['question'])))
                conn.execute("UPDATE practice_assignments SET status='open',preparation_until=NULL WHERE id=?", (assignment_id,))
            else:
                conn.execute("UPDATE practice_assignments SET preparation_until=NULL,preparation_error='not_enough_verified_items' WHERE id=?", (assignment_id,))
    except AccountError:
        raise
    except Exception:
        # No raw provider response, worksheet content, or credentials in logs/errors.
        with security.db.transaction() as conn:
            authorize(security, conn, kid_id, expected_session)
            conn.execute("UPDATE practice_assignments SET preparation_until=NULL,preparation_error='provider_unavailable' WHERE id=? AND kid_id=?", (assignment_id, kid_id))


def _read_aloud(grade):
    return 'Read this aloud to your child' if grade in ('K', '1') else None


def _child_item(row, grade):
    item = _private_item(row)
    # responseSpec contains only interaction data. Never serialize the private item.
    spec = item['responseSpec'] or {}
    allowed = ('kind', 'type', 'options', 'choices', 'fields', 'items', 'left', 'right', 'graph', 'min', 'max', 'step', 'points', 'grid', 'placeholder', 'unit', 'multiple', 'instructions')
    return dict(assignmentId=row['assignment_id'], assignmentItemId=row['assignment_item_id'], itemId=row['id'], purpose=row['purpose'],
                question=row['question'], context=item['context'], responseSpec={key: value for key, value in spec.items() if key in allowed}, readAloud=_read_aloud(grade))


def _pending_items(conn, kid_id, assignment_ids, *, adult=False):
    if not assignment_ids:
        return []
    placeholders = ','.join('?' for _ in assignment_ids)
    condition = "(p.readiness='adult_required' OR ai.correctness='ungraded')" if adult else "p.readiness!='adult_required'"
    return conn.execute(f"SELECT p.*,ai.id assignment_item_id,ai.assignment_id,a.purpose,a.subskill_id FROM assignment_items ai JOIN practice_assignments a ON a.id=ai.assignment_id JOIN practice_items p ON p.id=ai.item_id WHERE a.kid_id=? AND a.id IN ({placeholders}) AND a.status='open' AND (ai.correctness IS NULL OR ai.correctness='ungraded') AND {condition} ORDER BY a.created_at,ai.position", (kid_id, *assignment_ids)).fetchall()


async def get_next_practice(security, kid_id, expected_session, *, adapter=None):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'kid')
        _progress_chains(conn, kid_id, security.clock.now())
        for state in conn.execute("SELECT * FROM skill_states WHERE kid_id=? AND status='mastered'", (kid_id,)).fetchall():
            value = decode(state['state_json'], {})
            if value.get('next_recheck_date') and value['next_recheck_date'] <= CONFIG.date(security.clock.now()):
                _assignment(conn, kid_id, state['subskill_id'], 'recheck', security.clock.now())
        for state in conn.execute("SELECT subskill_id FROM skill_states WHERE kid_id=? AND status='practicing'", (kid_id,)).fetchall():
            # Descendants wait until every active chain pointing to them allows it.
            waiting = conn.execute("SELECT 1 FROM gap_chain_steps s JOIN gap_chains c ON c.id=s.chain_id WHERE c.kid_id=? AND s.subskill_id=? AND c.status!='completed' AND (c.current_target_id IS NULL OR c.current_target_id!=?)", (kid_id, state[0], state[0])).fetchone()
            if not waiting:
                _assignment(conn, kid_id, state[0], 'practice', security.clock.now())
        assignments = [dict(row) for row in conn.execute("SELECT * FROM practice_assignments WHERE kid_id=? AND status IN ('open','awaiting_items') ORDER BY CASE purpose WHEN 'check' THEN 0 WHEN 'practice' THEN 1 ELSE 2 END,created_at,id", (kid_id,))]
    for assignment in assignments[:CONFIG.session_max_items]:
        if assignment['status'] == 'awaiting_items':
            await prepare_assignment(security, assignment['id'], kid_id, expected_session, adapter=adapter)
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'kid')
        grade = security.owned_kid(conn, expected_session.account_id, kid_id)['grade']
        session = conn.execute("SELECT * FROM learning_sessions WHERE kid_id=? AND state='open'", (kid_id,)).fetchone()
        if session:
            assignment_ids = decode(session['assignment_ids_json'], [])
            rows = _pending_items(conn, kid_id, assignment_ids)
            adult_pending = _pending_items(conn, kid_id, assignment_ids, adult=True)
            if not rows and not adult_pending:
                conn.execute("UPDATE learning_sessions SET state='completed',completed_at=? WHERE id=?", (security.clock.now(), session['id']))
                session = None
        if not session:
            assignment_ids, rows = [], []
            for assignment in assignments:
                pending = _pending_items(conn, kid_id, [assignment['id']])
                if not pending:
                    continue
                if rows and len(rows) + len(pending) > CONFIG.session_max_items:
                    break
                assignment_ids.append(assignment['id'])
                rows.extend(pending)
                if len(rows) >= CONFIG.session_min_items:
                    break
            if rows:
                now, session_id = security.clock.now(), uid()
                conn.execute("INSERT INTO learning_sessions VALUES (?,?,'open',?,?,?,0,NULL)", (session_id, kid_id, encode(assignment_ids), now, now))
                session = conn.execute('SELECT * FROM learning_sessions WHERE id=?', (session_id,)).fetchone()
        pending_count = conn.execute("SELECT COUNT(*) FROM practice_assignments WHERE kid_id=? AND status='awaiting_items'", (kid_id,)).fetchone()[0]
        adult_count = len(_pending_items(conn, kid_id, [a['id'] for a in assignments], adult=True))
        items = [_child_item(row, grade) for row in rows]
    return dict(sessionId=session['id'] if session else None, items=items, pendingCount=pending_count,
                message='Here is your next practice.' if items else 'Some activities are ready to try with a grown-up.' if adult_count else 'We are preparing your next questions. Try again shortly.' if pending_count else 'You are all caught up. Bring your next worksheet when you are ready!')


def _attempt_result(row, complete=False):
    value = row['correctness']
    return dict(correctness=value, message='Thanks for showing your thinking.' if value == 'correct' else 'Thanks for trying. Keep practicing.' if value == 'incorrect' else 'We could not check that answer yet. Try again or ask a grown-up.', assignmentComplete=complete)


async def submit_response(security, kid_id, body, expected_session, *, adult=False, adapter=None):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent' if adult else 'kid')
        previous = conn.execute('SELECT * FROM practice_attempts WHERE kid_id=? AND idempotency_key=?', (kid_id, body.idempotencyKey)).fetchone()
        if previous:
            if previous['assignment_item_id'] != body.assignmentItemId:
                raise AccountError('idempotency_conflict', 'Use a new submission key for this answer.', 409)
            complete = conn.execute("SELECT a.status FROM assignment_items ai JOIN practice_assignments a ON a.id=ai.assignment_id WHERE ai.id=?", (body.assignmentItemId,)).fetchone()[0] == 'completed'
            return _attempt_result(previous, complete)
        row = conn.execute('SELECT p.*,ai.id assignment_item_id,ai.assignment_id,ai.fingerprint,ai.graded_attempt_id,a.purpose,a.subskill_id,a.status assignment_status FROM assignment_items ai JOIN practice_assignments a ON a.id=ai.assignment_id JOIN practice_items p ON p.id=ai.item_id WHERE ai.id=? AND a.kid_id=?', (body.assignmentItemId, kid_id)).fetchone()
        if not row:
            raise AccountError('not_found', 'That activity was not found.', 404)
        if row['assignment_status'] != 'open':
            raise AccountError('activity_closed', 'That activity is complete or no longer available. Open your next practice.', 409)
        item = _private_item(row)
        private_values = _private_values(conn, kid_id)
        if not adult and item['readiness'] == 'adult_required':
            raise AccountError('adult_required', 'Try this activity with a grown-up.', 403)
    if adult:
        correctness, source, confidence = body.correctness, 'adult', 1.0
        independent, hint, reveal, aloud = body.independent, not body.independent, False, body.readAloud
        response = None
    else:
        from .vision import grade_response
        from .vision import VisionAdapter
        try:
            if adapter is False:
                from .grading import grade_spec
                decision = grade_spec(item['gradingSpec'], body.response)
            else:
                decision = await grade_response(item, body.response, adapter=adapter or VisionAdapter(private_values=private_values))
        except Exception:
            from .homework_models import GradeDecision
            decision = GradeDecision(correctness='ungraded', source='model', confidence=0.0, explanation='The answer checker is temporarily unavailable.')
        correctness, source, confidence = decision.correctness, decision.source, decision.confidence
        independent = not body.assistance.hintUsed and not body.assistance.answerRevealed
        hint, reveal, aloud, response = body.assistance.hintUsed, body.assistance.answerRevealed, body.assistance.readAloud, body.response
    now = security.clock.now()
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent' if adult else 'kid')
        previous = conn.execute('SELECT * FROM practice_attempts WHERE kid_id=? AND idempotency_key=?', (kid_id, body.idempotencyKey)).fetchone()
        if previous:
            if previous['assignment_item_id'] != body.assignmentItemId:
                raise AccountError('idempotency_conflict', 'Use a new submission key for this answer.', 409)
            return _attempt_result(previous)
        current = conn.execute('SELECT ai.*,a.status assignment_status,a.required_count FROM assignment_items ai JOIN practice_assignments a ON a.id=ai.assignment_id WHERE ai.id=? AND a.kid_id=?', (body.assignmentItemId, kid_id)).fetchone()
        if not current:
            raise AccountError('not_found', 'That activity was not found.', 404)
        if current['assignment_status'] != 'open':
            raise AccountError('activity_closed', 'That activity is complete or no longer available. Open your next practice.', 409)
        first_graded = not current['graded_attempt_id'] and correctness != 'ungraded'
        prior = conn.execute("SELECT 1 FROM practice_attempts pa JOIN assignment_items ai ON ai.id=pa.assignment_item_id WHERE pa.kid_id=? AND ai.fingerprint=? AND pa.correctness!='ungraded'", (kid_id, current['fingerprint'])).fetchone()
        fresh = not prior
        session = conn.execute("SELECT id FROM learning_sessions WHERE kid_id=? AND state='open'", (kid_id,)).fetchone()
        if session is None and current['assignment_status'] == 'open':
            session_id = uid()
            conn.execute("INSERT INTO learning_sessions VALUES (?,?,'open',?,?,?,0,NULL)", (session_id, kid_id, encode([current['assignment_id']]), now, now))
            session = (session_id,)
        attempt_id = uid()
        conn.execute('INSERT INTO practice_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', (attempt_id, kid_id, body.assignmentItemId, session[0] if session else None, body.idempotencyKey, encode(response), correctness, source, confidence, int(independent), int(hint), int(reveal), int(aloud), int(first_graded), int(fresh), now))
        if source == 'model':
            _audit(conn, security, 'grade_response', attempt_id, correctness, model=getattr(adapter, 'model', ''), prompt_version='sidekick-gap-v1', catalog_revision=item.get('catalog_revision', ''), confidence=confidence, explanation=decision.explanation, kid_id=kid_id)
        eligible = correctness in ('correct', 'incorrect') and first_graded
        if eligible:
            conn.execute('UPDATE assignment_items SET correctness=?,graded_attempt_id=? WHERE id=? AND graded_attempt_id IS NULL', (correctness, attempt_id, body.assignmentItemId))
        elif current['graded_attempt_id'] is None:
            conn.execute("UPDATE assignment_items SET correctness='ungraded' WHERE id=?", (body.assignmentItemId,))
        conn.execute('INSERT INTO learning_evidence(kid_id,subskill_id,source,source_ref,fingerprint,question,correctness,eligible,independent,hint_used,answer_revealed,read_aloud,first_graded,fresh,confidence,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                     (kid_id, item['subskill_id'], item['purpose'], attempt_id, current['fingerprint'], item['question'], correctness, int(eligible), int(independent), int(hint), int(reveal), int(aloud), int(first_graded), int(fresh), confidence, now))
        remaining = conn.execute("SELECT COUNT(*) FROM assignment_items WHERE assignment_id=? AND (correctness IS NULL OR correctness='ungraded')", (current['assignment_id'],)).fetchone()[0]
        if not remaining:
            conn.execute("UPDATE practice_assignments SET status='completed',completed_at=? WHERE id=? AND status='open'", (now, current['assignment_id']))
        _recompute(conn, kid_id, item['subskill_id'], now)
        attempt = conn.execute('SELECT * FROM practice_attempts WHERE id=?', (attempt_id,)).fetchone()
        result = _attempt_result(attempt, not remaining)
    return result


def record_activity(security, kid_id, session_id, body, expected_session):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'kid')
        row = conn.execute('SELECT * FROM learning_sessions WHERE id=? AND kid_id=?', (session_id, kid_id)).fetchone()
        if not row:
            raise AccountError('not_found', 'That practice session was not found.', 404)
        now = security.clock.now()
        increment = max(0, min(body.activeSeconds, now - row['last_activity_at'], 120)) if row['state'] == 'open' else 0
        # Closing a browser is not assignment completion; the same session resumes.
        conn.execute('UPDATE learning_sessions SET active_seconds=active_seconds+?,last_activity_at=? WHERE id=?', (increment, now, session_id))
    return {'ok': True}


async def extra_practice(security, kid_id, subskill_id, expected_session, *, adapter=None):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent')
        if not conn.execute('SELECT 1 FROM catalog_subskills WHERE id=? AND active=1', (subskill_id,)).fetchone():
            raise AccountError('not_found', 'That skill was not found.', 404)
        chain = conn.execute("SELECT * FROM gap_chains WHERE kid_id=? AND original_subskill_id=? AND status!='completed' ORDER BY created_at LIMIT 1", (kid_id, subskill_id)).fetchone()
        target = chain['current_target_id'] if chain and chain['current_target_id'] else subskill_id
        if chain and chain['status'] == 'tracing':
            step = conn.execute("SELECT subskill_id FROM gap_chain_steps WHERE chain_id=? AND outcome='checking' ORDER BY position LIMIT 1", (chain['id'],)).fetchone()
            target = step[0] if step else target
        purpose = 'check' if _state(conn, kid_id, target)['status'] == 'checking' else 'practice'
        assignment = _assignment(conn, kid_id, target, purpose, security.clock.now())
    await prepare_assignment(security, assignment['id'], kid_id, expected_session, adapter=adapter)
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent')
        state = conn.execute('SELECT status FROM practice_assignments WHERE id=?', (assignment['id'],)).fetchone()[0]
    return dict(assignmentId=assignment['id'], state=state)


async def adult_queue(security, kid_id, expected_session):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent')
        assignments = [row[0] for row in conn.execute("SELECT id FROM practice_assignments WHERE kid_id=? AND status IN ('awaiting_items','open') ORDER BY created_at", (kid_id,))]
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent')
        profile = security.owned_kid(conn, expected_session.account_id, kid_id)
        items = []
        for row in _pending_items(conn, kid_id, assignments, adult=True):
            item = _private_item(row)
            skill = conn.execute('SELECT raw_json FROM catalog_subskills WHERE id=?', (item['subskill_id'],)).fetchone()
            raw = decode(skill[0], {}) if skill else {}
            items.append(dict(assignmentItemId=row['assignment_item_id'], assignmentId=row['assignment_id'], purpose=row['purpose'], question=row['question'], context=item['context'], expectedResponse=item['answer'], rubric=item['gradingSpec'], homeTip=raw.get('home_tip'), readAloud=_read_aloud(profile['grade']), verificationMethod='parent_adjudication_required' if item['readiness'] == 'adult_required' else item.get('verification_method')))
    return {'items': items}


def parent_dashboard(security, account_id, kid_id, *, expected_session=None):
    from .catalog import get_subskill
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent' if expected_session else None)
        profile = kid_view(security.owned_kid(conn, account_id, kid_id))
        rows = conn.execute('SELECT s.*,ss.status,ss.state_json FROM catalog_subskills s LEFT JOIN skill_states ss ON ss.subskill_id=s.id AND ss.kid_id=? WHERE (s.active=1 AND s.grade=?) OR ss.kid_id=? ORDER BY CASE WHEN ss.status IN (\'gap\',\'practicing\',\'checking\') THEN 0 WHEN ss.status IS NOT NULL THEN 1 ELSE 2 END,s.subject,s.skill_id,s.subskill_order', (kid_id, profile.grade, kid_id)).fetchall()
        skills = []
        for row in rows:
            raw = decode(row['raw_json'], {})
            chains = conn.execute('SELECT * FROM gap_chains WHERE kid_id=? AND original_subskill_id=? ORDER BY created_at DESC LIMIT 1', (kid_id, row['id'])).fetchone()
            path = []
            if chains:
                for step in conn.execute('SELECT * FROM gap_chain_steps WHERE chain_id=? ORDER BY position', (chains['id'],)):
                    detail = get_subskill(conn, step['subskill_id'])
                    path.append(dict(subskillId=step['subskill_id'], name=detail.get('subskill') or detail.get('name') or step['subskill_id'], outcome=step['outcome']))
            evidence = []
            pattern = None
            for event in conn.execute("SELECT * FROM learning_evidence WHERE kid_id=? AND subskill_id=? AND source='homework' ORDER BY id DESC LIMIT 10", (kid_id, row['id'])):
                signature = decode(event['signature_json'])
                if not pattern and isinstance(signature, dict):
                    pattern = signature.get('explanation') or signature.get('status')
                evidence.append(dict(id=str(event['id']), problemId=event['source_ref'], question=event['question'], correctness=event['correctness'], eligible=bool(event['eligible']), createdAt=event['created_at']))
            rounds = conn.execute("SELECT COUNT(*) FROM practice_assignments WHERE kid_id=? AND subskill_id=? AND purpose='practice' AND status='completed'", (kid_id, row['id'])).fetchone()[0]
            status = row['status'] or 'unassessed'
            teacher = 'Consider talking with your child’s teacher about this.' if profile.grade in ('K', '1') and row['subject'] != 'Math' and status in ('gap', 'practicing') and rounds >= 2 else None
            skills.append(dict(id=row['id'], subskillId=row['id'], name=raw.get('subskill') or row['name'], subject='math' if row['subject'] == 'Math' else 'ela', commonCoreCode=raw.get('ccss_substandard') or row['skill_id'], status=status,
                               parentExplanation=raw.get('parent_explain'), observedPattern=pattern, homeTip=raw.get('home_tip'), evidence=evidence, traceback=path, stopReason=chains['stop_reason'] if chains else None,
                               currentPracticeTarget=chains['current_target_id'] if chains else None, teacherSuggestion=teacher))
        now = datetime.fromtimestamp(security.clock.now(), ZoneInfo(CONFIG.timezone))
        week = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
        session_metrics = conn.execute('SELECT COUNT(*),COALESCE(SUM(active_seconds),0) FROM learning_sessions WHERE kid_id=? AND started_at>=?', (kid_id, week)).fetchone()
        # Count each attempted slot once, with its first accepted final grade.
        # An initially ungraded answer later adjudicated is no longer pending.
        attempts = conn.execute("SELECT COUNT(DISTINCT ai.id),COUNT(DISTINCT CASE WHEN ai.correctness='correct' THEN ai.id END),COUNT(DISTINCT CASE WHEN ai.graded_attempt_id IS NULL THEN ai.id END) FROM practice_attempts pa JOIN assignment_items ai ON ai.id=pa.assignment_item_id WHERE pa.kid_id=?", (kid_id,)).fetchone()
        analytics = dict(sessionsThisWeek=session_metrics[0], timeSpentMinutes=int(session_metrics[1] // 60), problemsAttempted=attempts[0], problemsCorrect=attempts[1], problemsUngraded=attempts[2])
    return dict(profile=profile.model_dump(), sample=False, skills=skills, analytics=analytics, conversations=[])
