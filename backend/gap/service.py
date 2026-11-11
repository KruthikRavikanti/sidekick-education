"""Private homework evidence and observations, without a standalone practice flow."""
import hashlib
import json
import re
import uuid

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


def _homework_state(conn, kid_id, subskill_id):
    events = [dict(row) | {'seq': row['id']} for row in conn.execute(
        "SELECT * FROM learning_evidence WHERE kid_id=? AND subskill_id=? AND source='homework' ORDER BY id",
        (kid_id, subskill_id))]
    return reduce_state(None, events, config=CONFIG)[0]


def _recompute(conn, kid_id, subskill_id, now):
    # Replay only retained homework. Removed quizzes cannot claim mastery or
    # initiate new work through an old persisted state or historical attempt.
    state = _homework_state(conn, kid_id, subskill_id)
    _save_state(conn, kid_id, subskill_id, state, now)
    return state, []


def record_homework_evidence(security, kid_id, problem_id, subskill_id, correctness, eligible, confidence, signature=None,
                             *, fingerprint=None, question=None, expected_session=None, expected_upload_id=None):
    """Record one authoritative eligible observation per child and question."""
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
        state = _recompute(conn, kid_id, row['subskill_id'], now)[0] if row['subskill_id'] else None
    return dict(evidenceId=row['id'], eligible=bool(row['eligible']), state=state)


def audit_model(security, task, record_ref, outcome, *, model='', prompt_version='', catalog_revision='', confidence=None, explanation='', kid_id=None):
    with security.db.transaction() as conn:
        _audit(conn, security, task, record_ref, outcome, model=model, prompt_version=prompt_version, catalog_revision=catalog_revision, confidence=confidence, explanation=explanation, kid_id=kid_id)


def _audit(conn, security, task, record_ref, outcome, *, model='', prompt_version='', catalog_revision='', confidence=None, explanation='', kid_id=None):
    explanation = re.sub(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}', '[redacted]', explanation or '')[:500]
    if kid_id:
        private_values = _private_values(conn, kid_id)
        if not private_values:
            return
        for value in private_values:
            explanation = re.sub(r'(?<!\w)' + re.escape(value) + r'(?!\w)', '[redacted]', explanation, flags=re.I)
    conn.execute('INSERT INTO model_audits VALUES (?,?,?,?,?,?,?,?,?,?,?)', (uid(), kid_id, task, record_ref, model, prompt_version, catalog_revision, outcome, confidence, explanation, security.clock.now()))


def remove_homework_evidence(security, kid_id, problem_ids, *, expected_session=None):
    """Remove upload-linked observations while preserving independent history."""
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent' if expected_session else None)
        affected = set()
        for problem_id in problem_ids:
            affected.update(row[0] for row in conn.execute("SELECT subskill_id FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref=? AND subskill_id IS NOT NULL", (kid_id, problem_id)))
            conn.execute("DELETE FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref=?", (kid_id, problem_id))
        for subskill_id in affected:
            _recompute(conn, kid_id, subskill_id, security.clock.now())


def _private_values(conn, kid_id):
    row = conn.execute('SELECT k.first_name,k.id,k.account_id,a.email FROM kid_profiles k JOIN accounts a ON a.id=k.account_id WHERE k.id=?', (kid_id,)).fetchone()
    return tuple(row) if row else ()


def _homework_metrics(conn, kid_id):
    # Questions read includes blank/unreadable and pending work. Recognized
    # duplicate questions count once, using the first usable stored final grade.
    # Mapping eligibility affects skill observations, never whether an answer was
    # graded. Unmapped but confidently graded answers retain their actual grade.
    questions = {}
    for row in conn.execute('SELECT id,fingerprint,grading_json FROM homework_problems WHERE kid_id=? ORDER BY created_at,upload_id,page_number,problem_order,id', (kid_id,)):
        identity = row['fingerprint'] or row['id']
        questions.setdefault(identity, 'ungraded')
        grade = (decode(row['grading_json'], {}) or {}).get('correctness')
        if questions[identity] == 'ungraded' and grade in ('correct', 'incorrect'):
            questions[identity] = grade
    return dict(sessionsThisWeek=0, timeSpentMinutes=0, problemsAttempted=len(questions),
                problemsCorrect=list(questions.values()).count('correct'),
                problemsUngraded=list(questions.values()).count('ungraded'))


def parent_dashboard(security, account_id, kid_id, *, expected_session=None):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, expected_session, 'parent' if expected_session else None)
        profile = kid_view(security.owned_kid(conn, account_id, kid_id))
        # This GET is read-only. Calculate from homework, not stale legacy quiz
        # states, and never prepare assignments or invoke a model while reading.
        rows = conn.execute("SELECT s.* FROM catalog_subskills s WHERE (s.active=1 AND s.grade=?) OR EXISTS(SELECT 1 FROM learning_evidence e WHERE e.kid_id=? AND e.subskill_id=s.id AND e.source='homework') ORDER BY s.subject,s.skill_id,s.subskill_order", (profile.grade, kid_id)).fetchall()
        skills = []
        for row in rows:
            raw = decode(row['raw_json'], {})
            state = _homework_state(conn, kid_id, row['id'])
            evidence, pattern = [], None
            for event in conn.execute("SELECT * FROM learning_evidence WHERE kid_id=? AND subskill_id=? AND source='homework' ORDER BY id DESC LIMIT 10", (kid_id, row['id'])):
                signature = decode(event['signature_json'])
                if not pattern and event['eligible'] and event['correctness'] == 'incorrect' and isinstance(signature, dict):
                    pattern = signature.get('explanation') or signature.get('status')
                evidence.append(dict(id=str(event['id']), problemId=event['source_ref'], question=event['question'], correctness=event['correctness'], eligible=bool(event['eligible']), createdAt=event['created_at']))
            skills.append(dict(id=row['id'], subskillId=row['id'], name=raw.get('subskill') or row['name'], subject='math' if row['subject'] == 'Math' else 'ela', commonCoreCode=raw.get('ccss_substandard') or row['skill_id'], status=state['status'],
                               parentExplanation=raw.get('parent_explain'), observedPattern=pattern, homeTip=raw.get('home_tip'), evidence=evidence,
                               traceback=[], stopReason=None, currentPracticeTarget=None, teacherSuggestion=None))
        priority = {'needs_support': 0, 'on_track': 1, 'unassessed': 2}
        skills.sort(key=lambda skill: priority[skill['status']])
        analytics = _homework_metrics(conn, kid_id)
    return dict(profile=profile.model_dump(), sample=False, skills=skills, analytics=analytics, conversations=[])
