"""Owned activity orchestration. Reusable definitions contain curriculum data only."""
import hashlib
import json
import re
import uuid
from fractions import Fraction

from backend.accounts.security import AccountError
from backend.gap.catalog import get_subskill
from backend.gap.service import _audit, _homework_state, authorize, decode, encode
from backend.gap.vision import VisionAdapter
from .models import (ActivitySpec, COMPONENT_VERSION, PROMPT_VERSION, SUPPORTED,
                     ChoiceResponse, PartsResponse, TickResponse, TilesResponse)


def uid():
    return uuid.uuid4().hex


def target_view(target):
    return dict(id=target['subskill_id'], name=target['subskill'], subject=SUPPORTED[target['subskill_id']])


def _target(conn, security, kid_id, upload_id, active):
    authorize(security, conn, kid_id, active, 'kid')
    upload = conn.execute('SELECT * FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
    if not upload:
        raise AccountError('not_found', 'That student work was not found.', 404)
    if upload['state'] != 'completed':
        return None, None, 'analysis_failed' if upload['state'] == 'failed' else 'analysis_pending'
    # Correct work can lead to reinforcement, too. Prefer an eligible error when
    # one exists, then retain the original page/problem order within each group.
    rows = conn.execute("""SELECT e.* FROM learning_evidence e
        JOIN homework_problems p ON p.id=e.source_ref AND p.kid_id=e.kid_id
        WHERE p.upload_id=? AND e.kid_id=? AND e.source='homework'
          AND e.eligible=1 AND e.correctness IN ('correct','incorrect')
          AND p.teacher_conflict=0
        ORDER BY CASE e.correctness WHEN 'incorrect' THEN 0 ELSE 1 END,
                 p.page_number,p.problem_order,e.id""", (upload_id, kid_id)).fetchall()
    for evidence in rows:
        if evidence['subskill_id'] not in SUPPORTED:
            continue
        target = get_subskill(conn, evidence['subskill_id'])
        if target and target['active'] and target['grade'] == '3':
            return target, evidence['id'], None
    return None, None, 'no_supported_skill'


def suggestion(security, kid_id, upload_id, active):
    with security.db.transaction() as conn:
        target, _, reason = _target(conn, security, kid_id, upload_id, active)
        session = conn.execute("SELECT id FROM activity_sessions WHERE kid_id=? AND upload_id=? AND status='in_progress' ORDER BY started_at DESC LIMIT 1", (kid_id, upload_id)).fetchone()
        return dict(available=bool(target), reason=reason, targetSkill=target_view(target) if target else None, sessionId=session['id'] if session else None)


def _owned(conn, security, kid_id, session_id, active):
    authorize(security, conn, kid_id, active, 'kid')
    row = conn.execute('SELECT * FROM activity_sessions WHERE id=? AND kid_id=?', (session_id, kid_id)).fetchone()
    if not row:
        raise AccountError('not_found', 'That activity was not found.', 404)
    version = conn.execute('SELECT * FROM activity_versions WHERE id=?', (row['activity_version_id'],)).fetchone()
    return row, ActivitySpec.model_validate_json(version['spec_json'])


def _result(conn, row, spec):
    attempt = conn.execute("SELECT * FROM activity_attempts WHERE session_id=? AND phase='independent'", (row['id'],)).fetchone()
    return dict(question=spec.scenes[-1].prompt, response=attempt['response_text'], correct=bool(attempt['correct'])) if attempt else None


def _view(conn, row, spec):
    scene = spec.scenes[row['current_scene']] if row['status'] == 'in_progress' else None
    attempt = conn.execute('SELECT * FROM activity_attempts WHERE session_id=? AND scene_id=? ORDER BY rowid DESC LIMIT 1', (row['id'], scene.id)).fetchone() if scene else None
    hinted = bool(conn.execute('SELECT 1 FROM activity_attempts WHERE session_id=? AND scene_id=? AND hint_used=1', (row['id'], scene.id)).fetchone()) if scene else False
    origin = conn.execute('SELECT origin FROM activity_versions WHERE id=?', (row['activity_version_id'],)).fetchone()[0]
    target = get_subskill(conn, row['subskill_id'])
    # Deliberate allowlist: never serialize ActivitySpec or a later scene.
    return dict(id=row['id'], title=spec.title, subject=spec.subject, origin=origin, targetSkill=target_view(target), status=row['status'], sceneIndex=row['current_scene'], sceneCount=len(spec.scenes),
                currentScene=dict(id=scene.id, component=scene.component, phase=scene.phase, prompt=scene.prompt, params=scene.params.model_dump()) if scene else None,
                currentResponse=decode(attempt['response_json']) if attempt else None,
                feedback=dict(correct=bool(attempt['correct']), message=scene.feedback.correct if attempt['correct'] else scene.feedback.incorrect) if attempt else None,
                hint=scene.feedback.hint if attempt and hinted and scene.phase == 'guided' else None,
                canAdvance=bool(attempt and scene.phase == 'guided'), finalResult=_result(conn, row, spec))


def session_view(security, kid_id, session_id, active):
    with security.db.transaction() as conn:
        return _view(conn, *_owned(conn, security, kid_id, session_id, active))


def _task_key(scene):
    return ('math', str(Fraction(scene.answer.value))) if scene.component == 'independent_fraction' else ('ela', scene.params.baseWord)


def _blocked_tasks(conn, kid_id, upload_id, subject):
    """Compare original tasks locally. No original question crosses model boundary."""
    from .models import IRREGULAR, REGULAR
    keys = set()
    for row in conn.execute('SELECT extraction_json FROM homework_problems WHERE kid_id=? AND upload_id=?', (kid_id, upload_id)):
        problem = decode(row[0], {})
        question = problem.get('question', {})
        text = question.get('text', '') if isinstance(question, dict) else str(question)
        if subject == 'ela':
            keys.update(('ela', base) for base in set(IRREGULAR) | REGULAR if re.search(rf'\b{base}\b', text or '', re.I))
        else:
            for token in re.findall(r'\b\d{1,2}\s*/\s*[1-9]\d?\b', text or ''):
                keys.add(('math', str(Fraction(token.replace(' ', '')))))
            for copies, denominator in re.findall(r'\b([1-9]\d?)\s+copies\s+of\s+1\s*/\s*([1-9]\d?)\b', text or '', re.I):
                keys.add(('math', str(Fraction(int(copies), int(denominator)))))
    # Retained evidence has the original visible question even when an old
    # extraction checkpoint does not. Never send either representation out.
    for row in conn.execute("SELECT e.question FROM learning_evidence e JOIN homework_problems p ON p.id=e.source_ref WHERE e.kid_id=? AND p.upload_id=? AND e.source='homework'", (kid_id, upload_id)):
        text = row[0] or ''
        if subject == 'ela':
            keys.update(('ela', base) for base in set(IRREGULAR) | REGULAR if re.search(rf'\b{base}\b', text, re.I))
        else:
            for token in re.findall(r'\b\d{1,2}\s*/\s*[1-9]\d?\b', text):
                keys.add(('math', str(Fraction(token.replace(' ', '')))))
            for copies, denominator in re.findall(r'\b([1-9]\d?)\s+copies\s+of\s+1\s*/\s*([1-9]\d?)\b', text, re.I):
                keys.add(('math', str(Fraction(int(copies), int(denominator)))))
    for row in conn.execute('SELECT v.spec_json FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.kid_id=?', (kid_id,)):
        keys.add(_task_key(ActivitySpec.model_validate_json(row[0]).scenes[-1]))
    return keys


def _matches(conn, target, *, blocked=(), strong=True):
    tag = target['common_misconception']
    matches = []
    for row in conn.execute('SELECT * FROM activity_versions WHERE subskill_id=? AND grade=3 AND active=1 AND verified=1 AND component_version=? ORDER BY created_at,id', (target['subskill_id'], COMPONENT_VERSION)):
        try:
            spec = ActivitySpec.model_validate_json(row['spec_json'])
        except ValueError:
            continue
        if (not strong or tag in spec.misconceptionTags) and spec.subject == SUPPORTED[target['subskill_id']] and _task_key(spec.scenes[-1]) not in blocked:
            matches.append((row, spec))
    return matches


GENERATION_INSTRUCTION = """Compose a new, complete ActivitySpec, not a single question or a fixed template.
Choose 3 to 6 scenes and their order, explanatory prompts, parameters, feedback and transitions.
Use 2 to 5 guided scenes followed by exactly one fresh independent scene. The component is the
safe interaction vocabulary, while you choose the activity sequence. IDs and nextSceneId must
form one linear sequence. Select only the requested subject, grade and subskill; copy the
provided misconception tag exactly and use only supplied sourceRefs (these are design references).
No worksheet text, student identity or private information is supplied or may be invented.
Activities can reinforce correct work as well as support skills needing more practice. The
misconception tag is curriculum metadata, not proof that this student made that mistake.
Never claim that the student's uploaded answer was wrong or that they have a misconception.
Math: guided fraction_builder or number_line. Fractions strictly between zero and one,
denominators only 2,3,4,6,8. fraction_builder params denominator; number_line params denominator,
min=0,max=1. Each guided prompt must explicitly name its target fraction a/b. Answer.value
is that exact fraction. Explain numerator as copies of the equal unit fraction, not two unrelated
numbers. Final independent_fraction params unitDenominator,copies; prompt explicitly asks
'What fraction is N copies of 1/D?' Answer.value=N/D. Choose a final fraction unequal to all
guided fractions and never mention the final answer fraction in guided content.
ELA: guided word_tiles params baseWord,tiles[{id,text}] whose letters exactly form the correct
plural, or word_choice params baseWord,options[{id,text}] including exactly one correct plural.
Every word prompt must contain the base word and the word 'plural'. Choose only supported
base words from the supplied dictionary. Answer.value is the deterministically correct plural.
Final independent_word params baseWord: prompt exactly 'One BASE, two ___. Write the plural word.'
or 'Write the plural of BASE.' Use a fresh base word and plural never mentioned in
any guided prompt, hint, feedback or option. Do not reveal its plural in its prompt.
Independent scenes have no tiles, choices or visual. Feedback objects contain correct, incorrect,
hint strings even for the final scene, but those final strings are never shown to the child.
Make feedback explain why the skill works, without claims of mastery or changed skill status.
"""


async def _generate(adapter, target, source_refs, seen_tasks, variation=0):
    from .models import IRREGULAR, REGULAR, plural
    data = dict(schemaVersion='1.0', subject=SUPPORTED[target['subskill_id']], grade=3,
                subskillId=target['subskill_id'], subskill=target['subskill'], misconceptionTags=[target['common_misconception']], sourceRefs=source_refs,
                supportedPlurals={base: plural(base) for base in sorted(set(IRREGULAR) | REGULAR)}, previousIndependentTasks=seen_tasks, variation=variation)
    result = await adapter._call(ActivitySpec, 'compose_activity', GENERATION_INSTRUCTION, data)
    spec = ActivitySpec.model_validate(result.model_dump() if isinstance(result, ActivitySpec) else result)
    if spec.subskillId != target['subskill_id'] or target['common_misconception'] not in spec.misconceptionTags or not set(spec.sourceRefs).issubset(source_refs):
        raise ValueError('Generated activity is not aligned with catalog or references')
    return spec


async def start(security, kid_id, body, active, *, adapter=None):
    key, upload_id, lease = body.idempotencyKey, body.uploadId, uid()
    with security.db.transaction() as conn:
        target, evidence_id, reason = _target(conn, security, kid_id, upload_id, active)
        prior = conn.execute('SELECT * FROM activity_start_requests WHERE kid_id=? AND request_key=?', (kid_id, key)).fetchone()
        if prior and prior['upload_id'] != upload_id:
            raise AccountError('idempotency_conflict', 'Use a new request for this student work.', 409)
        if prior and prior['session_id']:
            return _view(conn, *_owned(conn, security, kid_id, prior['session_id'], active))
        if not target:
            raise AccountError(reason, 'An activity is not ready for this student work. Please try again shortly.' if reason == 'analysis_pending' else 'There is no matching activity for this student work yet.', 409)
        opened = conn.execute("SELECT id FROM activity_sessions WHERE kid_id=? AND upload_id=? AND status='in_progress'", (kid_id, upload_id)).fetchone()
        if opened:
            conn.execute('INSERT OR REPLACE INTO activity_start_requests(kid_id,request_key,upload_id,session_id,created_at) VALUES(?,?,?,?,?)', (kid_id, key, upload_id, opened['id'], security.clock.now()))
            return _view(conn, *_owned(conn, security, kid_id, opened['id'], active))
        if prior and prior['lease_until'] and prior['lease_until'] > security.clock.now():
            raise AccountError('activity_preparing', 'Your activity is being prepared. Please retry in a moment.', 409)
        now = security.clock.now()
        conn.execute('INSERT INTO activity_start_requests(kid_id,request_key,upload_id,lease_token,lease_until,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(kid_id,request_key) DO UPDATE SET lease_token=excluded.lease_token,lease_until=excluded.lease_until', (kid_id, key, upload_id, lease, now + 600, now))
        blocked = _blocked_tasks(conn, kid_id, upload_id, SUPPORTED[target['subskill_id']])
        matches = _matches(conn, target, blocked=blocked)
        seen = {row[0] for row in conn.execute('SELECT activity_version_id FROM activity_sessions WHERE kid_id=?', (kid_id,))}
        selected = next((match for match in matches if match[0]['id'] not in seen), None)
        seen_tasks = []
        for row in conn.execute('SELECT v.spec_json FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.kid_id=? AND s.subskill_id=?', (kid_id, target['subskill_id'])):
            seen_tasks.append(ActivitySpec.model_validate_json(row[0]).scenes[-1].prompt)
        refs = [row[0] for row in conn.execute('SELECT id FROM activity_sources WHERE active=1 ORDER BY id')]
        revision = conn.execute('SELECT id FROM activity_library_revisions ORDER BY imported_at DESC,id LIMIT 1').fetchone()
        revision_id = revision['id'] if revision else None
    # No transaction spans provider work. Only curriculum fields cross this boundary.
    generated, outcome = None, 'reused'
    if selected is None and adapter is not False and revision_id:
        for variation in range(2):
            try:
                generated = await _generate(adapter or VisionAdapter(), target, refs, seen_tasks, variation)
                if _task_key(generated.scenes[-1]) in blocked:
                    generated = None
                    outcome = 'freshness_rejected_fallback'
                    continue
                outcome = 'generated'
                break
            except Exception:
                # Never include exception text or raw model output in a log/audit.
                outcome = 'generation_failed_fallback'
                break
    with security.db.transaction() as conn:
        # A logout, switch, deleted profile or deleted upload during generation
        # invalidates the result before it can become private child history.
        current_target, current_evidence, reason = _target(conn, security, kid_id, upload_id, active)
        if not current_target or current_target['subskill_id'] != target['subskill_id']:
            raise AccountError('activity_changed', 'This student work changed. Please refresh and try again.', 409)
        reservation = conn.execute('SELECT * FROM activity_start_requests WHERE kid_id=? AND request_key=?', (kid_id, key)).fetchone()
        if not reservation or reservation['lease_token'] != lease:
            raise AccountError('activity_preparing', 'Please retry to resume the activity.', 409)
        opened = conn.execute("SELECT id FROM activity_sessions WHERE kid_id=? AND upload_id=? AND status='in_progress'", (kid_id, upload_id)).fetchone()
        if opened:
            session_id = opened['id']
        else:
            latest_blocked = _blocked_tasks(conn, kid_id, upload_id, SUPPORTED[target['subskill_id']])
            if generated is not None and _task_key(generated.scenes[-1]) in latest_blocked:
                generated = None
            if selected and _task_key(selected[1].scenes[-1]) in latest_blocked:
                selected = None
            if generated is not None:
                raw = json.dumps(generated.model_dump(), ensure_ascii=False, sort_keys=True, separators=(',', ':'))
                content_hash = hashlib.sha256(raw.encode()).hexdigest()
                version_id = 'generated_' + content_hash[:40]
                conn.execute('INSERT OR IGNORE INTO activity_versions(id,activity_id,version,spec_json,spec_sha256,subskill_id,subject,grade,misconception_tags_json,origin,verified,source_revision,model,prompt_version,component_version,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                             (version_id, version_id, 1, raw, content_hash, generated.subskillId, generated.subject, 3, encode(generated.misconceptionTags), 'model_generated', 1, revision_id, getattr(adapter, 'model', '') if adapter else VisionAdapter().model, PROMPT_VERSION, COMPONENT_VERSION, security.clock.now()))
                selected = (conn.execute('SELECT * FROM activity_versions WHERE spec_sha256=?', (content_hash,)).fetchone(), generated)
            if selected is None:
                fallback = _matches(conn, target, blocked=latest_blocked, strong=False)
                selected = next((match for match in fallback if match[0]['origin'] == 'original_example'), fallback[0] if fallback else None)
            if selected is None:
                conn.execute('UPDATE activity_start_requests SET lease_token=NULL,lease_until=NULL WHERE kid_id=? AND request_key=?', (kid_id, key))
                # Raising outside this transaction below commits release for retry.
                session_id = None
            else:
                session_id = uid()
                conn.execute("INSERT INTO activity_sessions(id,kid_id,upload_id,evidence_id,activity_version_id,subskill_id,status,started_at) VALUES(?,?,?,?,?,?,'in_progress',?)", (session_id, kid_id, upload_id, current_evidence, selected[0]['id'], target['subskill_id'], security.clock.now()))
                _audit(conn, security, 'compose_activity', session_id, outcome, model=getattr(adapter, 'model', '') if adapter else '', prompt_version=PROMPT_VERSION, catalog_revision=target['revision'], explanation='Validated activity composed from catalog data.' if generated else 'Selected a validated matching activity.', kid_id=kid_id)
        if session_id:
            conn.execute('UPDATE activity_start_requests SET session_id=?,lease_token=NULL,lease_until=NULL WHERE kid_id=? AND request_key=?', (session_id, kid_id, key))
            return _view(conn, *_owned(conn, security, kid_id, session_id, active))
    raise AccountError('activity_unavailable', 'We could not prepare an activity right now. Please retry.', 503)


def _grade(scene, response):
    value = response
    if scene.component == 'fraction_builder' and isinstance(response, PartsResponse):
        if len(set(response.selectedParts)) != len(response.selectedParts) or any(part < 0 or part >= scene.params.denominator for part in response.selectedParts):
            raise ValueError
        value = f'{len(response.selectedParts)}/{scene.params.denominator}'
    elif scene.component == 'number_line' and isinstance(response, TickResponse):
        if response.tick > scene.params.denominator:
            raise ValueError
        value = f'{response.tick}/{scene.params.denominator}'
    elif scene.component == 'word_tiles' and isinstance(response, TilesResponse):
        by_id = {tile.id: tile.text for tile in scene.params.tiles}
        if len(set(response.tileIds)) != len(response.tileIds) or any(value not in by_id for value in response.tileIds):
            raise ValueError
        value = ''.join(by_id[value] for value in response.tileIds)
    elif scene.component == 'word_choice' and isinstance(response, ChoiceResponse):
        value = next((option.text for option in scene.params.options if option.id == response.choiceId), None)
        if value is None:
            raise ValueError
    elif scene.component not in {'independent_fraction', 'independent_word'} or not isinstance(response, str):
        raise ValueError
    if not isinstance(value, str) or not value.strip():
        raise ValueError
    if scene.component in {'fraction_builder', 'number_line', 'independent_fraction'}:
        if not re.fullmatch(r'\s*[+-]?\d{1,6}(?:\s*/\s*[1-9]\d{0,5})?\s*', value):
            # A clear nonnumeric answer remains an incorrect independent response.
            return value, False
        return value, Fraction(value.replace(' ', '')) == Fraction(scene.answer.value)
    return value, value.strip().casefold() == scene.answer.value.casefold()


def submit(security, kid_id, session_id, body, active):
    with security.db.transaction() as conn:
        row, spec = _owned(conn, security, kid_id, session_id, active)
        previous = conn.execute('SELECT * FROM activity_attempts WHERE session_id=? AND request_key=?', (session_id, body.idempotencyKey)).fetchone()
        serialized = encode(body.response.model_dump() if hasattr(body.response, 'model_dump') else body.response)
        if previous:
            if previous['scene_id'] != body.sceneId or previous['response_json'] != serialized:
                raise AccountError('idempotency_conflict', 'This response was already submitted. Please refresh.', 409)
            return _view(conn, row, spec)
        if row['status'] != 'in_progress' or spec.scenes[row['current_scene']].id != body.sceneId:
            raise AccountError('scene_changed', 'This step changed. Please refresh the activity.', 409)
        scene = spec.scenes[row['current_scene']]
        if scene.phase == 'independent' and conn.execute('SELECT 1 FROM activity_attempts WHERE session_id=? AND scene_id=?', (session_id, scene.id)).fetchone():
            raise AccountError('already_answered', 'Your first answer is saved. Continue to the next step.', 409)
        try:
            response_text, correct = _grade(scene, body.response)
        except (ValueError, TypeError, ZeroDivisionError):
            raise AccountError('invalid_response', 'Choose an answer for this step and try again.', 400) from None
        conn.execute('INSERT INTO activity_attempts(id,session_id,scene_id,request_key,phase,response_json,response_text,correct,created_at) VALUES(?,?,?,?,?,?,?,?,?)', (uid(), session_id, scene.id, body.idempotencyKey, scene.phase, serialized, response_text, int(correct), security.clock.now()))
        if scene.phase == 'independent':
            conn.execute("UPDATE activity_sessions SET status='completed',completed_at=? WHERE id=?", (security.clock.now(), session_id))
            row = conn.execute('SELECT * FROM activity_sessions WHERE id=?', (session_id,)).fetchone()
        return _view(conn, row, spec)


def hint(security, kid_id, session_id, body, active):
    with security.db.transaction() as conn:
        row, spec = _owned(conn, security, kid_id, session_id, active)
        scene = spec.scenes[row['current_scene']]
        attempt = conn.execute('SELECT * FROM activity_attempts WHERE session_id=? AND scene_id=? ORDER BY rowid DESC LIMIT 1', (session_id, scene.id)).fetchone()
        if row['status'] != 'in_progress' or scene.id != body.sceneId or scene.phase != 'guided' or not attempt:
            raise AccountError('hint_unavailable', 'Hints are available after a guided response.', 409)
        conn.execute('UPDATE activity_attempts SET hint_used=1 WHERE id=?', (attempt['id'],))
        conn.execute("INSERT OR IGNORE INTO activity_scene_events VALUES(?,?,?,'hint',?)", (session_id, 'hint_' + scene.id, scene.id, security.clock.now()))
        return _view(conn, row, spec)


def advance(security, kid_id, session_id, body, active):
    with security.db.transaction() as conn:
        row, spec = _owned(conn, security, kid_id, session_id, active)
        previous = conn.execute('SELECT * FROM activity_scene_events WHERE session_id=? AND request_key=?', (session_id, body.idempotencyKey)).fetchone()
        if previous:
            if previous['scene_id'] != body.sceneId or previous['kind'] != 'next':
                raise AccountError('idempotency_conflict', 'Please refresh this activity.', 409)
            return _view(conn, row, spec)
        scene = spec.scenes[row['current_scene']]
        if row['status'] != 'in_progress' or scene.id != body.sceneId or scene.phase != 'guided' or not conn.execute('SELECT 1 FROM activity_attempts WHERE session_id=? AND scene_id=?', (session_id, scene.id)).fetchone():
            raise AccountError('scene_changed', 'Answer this step before continuing.', 409)
        conn.execute("INSERT INTO activity_scene_events VALUES(?,?,?,'next',?)", (session_id, body.idempotencyKey, scene.id, security.clock.now()))
        conn.execute('UPDATE activity_sessions SET current_scene=current_scene+1 WHERE id=?', (session_id,))
        return _view(conn, conn.execute('SELECT * FROM activity_sessions WHERE id=?', (session_id,)).fetchone(), spec)


def history(security, kid_id, active):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, active, 'parent')
        rows = conn.execute('SELECT s.*,v.spec_json,v.origin FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.kid_id=? ORDER BY s.started_at DESC,s.id DESC LIMIT 100', (kid_id,)).fetchall()
        activities = []
        for row in rows:
            spec = ActivitySpec.model_validate_json(row['spec_json'])
            target = get_subskill(conn, row['subskill_id'])
            count = conn.execute("SELECT COUNT(DISTINCT scene_id) FROM activity_attempts WHERE session_id=? AND phase='guided' AND hint_used=1", (row['id'],)).fetchone()[0]
            activities.append(dict(id=row['id'], title=spec.title, subject=spec.subject, origin=row['origin'], targetSkill=target_view(target), status=row['status'], startedAt=row['started_at'], completedAt=row['completed_at'], finalResult=_result(conn, row, spec), guidedHintCount=count))
        return dict(activities=activities)
