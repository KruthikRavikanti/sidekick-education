"""Owned activity orchestration. Reusable definitions contain curriculum data only."""
import hashlib
import asyncio
import json
import re
import uuid
from fractions import Fraction

from backend.accounts.security import AccountError
from backend.gap.catalog import get_subskill
from backend.gap.service import _audit, _homework_state, authorize, decode, encode
from backend.gap.config import CONFIG
from backend.gap.vision import VisionAdapter
from .models import (ActivitySpec, COMPONENT_VERSION, COMPATIBLE_COMPONENT_VERSIONS, PROMPT_VERSION,
                     ChoiceResponse, FractionSplitResponse, PartsResponse, TickResponse, TilesResponse)
from . import capabilities, equivalent, general, toolkit

COMPOSITION_TIMEOUT_SECONDS = 480


def uid():
    return uuid.uuid4().hex


def target_view(target):
    return dict(id=target['subskill_id'], name=target['subskill'], subject=general.subject_for(target))


def _candidates(conn, security, kid_id, upload_id, active, grade_of=general.grade_for):
    """Every reliably matched skill on an owned upload, as (priority, skill, evidence id).

    `grade_of` decides which grades count. Activities cover K to 8; games pass their own, wider mapping.
    """
    authorize(security, conn, kid_id, active, 'kid')
    upload = conn.execute('SELECT * FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
    if not upload:
        raise AccountError('not_found', 'That student work was not found.', 404)
    if upload['state'] != 'completed':
        return [], 'analysis_failed' if upload['state'] == 'failed' else 'analysis_pending'
    # A reliable skill match is enough to teach it, even where automatic grading
    # abstained. This does not promote that observation into support evidence.
    rows = conn.execute("""SELECT p.*, e.id AS evidence_id,
        e.subskill_id AS evidence_skill, e.correctness AS evidence_correctness,
        e.eligible AS evidence_eligible, e.confidence AS evidence_confidence
        FROM homework_problems p LEFT JOIN learning_evidence e
          ON e.source_ref=p.id AND e.kid_id=p.kid_id AND e.source='homework'
        WHERE p.upload_id=? AND p.kid_id=? AND p.teacher_conflict=0
        ORDER BY p.page_number,p.problem_order,p.id""", (upload_id, kid_id)).fetchall()
    candidates = []
    for row in rows:
        problem = decode(row['extraction_json'], {})
        question = problem.get('question', {})
        mapping = decode(row['mapping_json'], None)
        if mapping is not None:
            if (not isinstance(mapping, dict) or not isinstance(mapping.get('confidence'), (int, float))
                    or mapping['confidence'] < CONFIG.mapping_confidence
                    or not isinstance(question, dict) or question.get('uncertain')
                    or not str(question.get('text') or '').strip()):
                continue
            subskill = mapping.get('subskill_id')
        elif row['evidence_eligible'] and (row['evidence_confidence'] or 0) >= CONFIG.mapping_confidence:
            # Historical verified evidence may predate stored mapping checkpoints.
            if not isinstance(question, dict) or question.get('uncertain'):
                continue
            subskill = row['evidence_skill']
        else:
            continue
        target = get_subskill(conn, subskill)
        if not target or not target['active'] or general.subject_for(target) is None or grade_of(target) is None:
            continue
        priority = 0 if row['evidence_eligible'] and row['evidence_correctness'] == 'incorrect' else 1 if row['evidence_correctness'] == 'correct' else 2
        candidates.append((priority, target, row['evidence_id']))
    return candidates, None


def _target(conn, security, kid_id, upload_id, active):
    candidates, reason = _candidates(conn, security, kid_id, upload_id, active)
    if reason:
        return None, None, reason
    # A reliably mapped playable item must not be hidden by an earlier or
    # incorrect question whose skill has no available interaction.
    ranked = [(0 if capabilities.mechanics_for(target) else 1, priority, target, evidence_id) for priority, target, evidence_id in candidates]
    if ranked:
        _, _, target, evidence_id = min(ranked, key=lambda candidate: candidate[:2])
        return target, evidence_id, None
    return None, None, 'no_supported_skill'


def suggestion(security, kid_id, upload_id, active):
    with security.db.transaction() as conn:
        target, _, reason = _target(conn, security, kid_id, upload_id, active)
        session = conn.execute("SELECT id FROM activity_sessions WHERE kid_id=? AND upload_id=? AND status='in_progress' ORDER BY started_at DESC LIMIT 1", (kid_id, upload_id)).fetchone()
        available = bool(target and capabilities.mechanics_for(target))
        if target and not available:
            reason = 'no_suitable_mechanic'
        # An existing immutable session keeps its original behavior/version.
        if session:
            available, reason = True, None
        return dict(available=available, reason=reason, targetSkill=target_view(target) if target else None, sessionId=session['id'] if session else None)


def _owned(conn, security, kid_id, session_id, active):
    authorize(security, conn, kid_id, active, 'kid')
    row = conn.execute('SELECT * FROM activity_sessions WHERE id=? AND kid_id=?', (session_id, kid_id)).fetchone()
    if not row:
        raise AccountError('not_found', 'That activity was not found.', 404)
    version = conn.execute('SELECT * FROM activity_versions WHERE id=?', (row['activity_version_id'],)).fetchone()
    return row, ActivitySpec.model_validate_json(version['spec_json'])


def _result(conn, row, spec):
    attempt = conn.execute("SELECT * FROM activity_attempts WHERE session_id=? AND phase='independent'", (row['id'],)).fetchone()
    from .assessment import result_details
    return result_details(conn, row, spec, attempt)


def _resolved_scene(conn, row, spec, scene):
    from .composition import resolve_scene
    responses = {}
    for attempt in conn.execute('SELECT scene_id,response_json FROM activity_attempts WHERE session_id=? ORDER BY rowid', (row['id'],)):
        responses[attempt['scene_id']] = decode(attempt['response_json'])
    return resolve_scene(spec, scene, responses)


def _view(conn, row, spec):
    scene = spec.scenes[row['current_scene']] if row['status'] == 'in_progress' else None
    if scene:
        scene = _resolved_scene(conn, row, spec, scene)
    attempt = conn.execute('SELECT * FROM activity_attempts WHERE session_id=? AND scene_id=? ORDER BY rowid DESC LIMIT 1', (row['id'], scene.id)).fetchone() if scene else None
    hinted = bool(conn.execute('SELECT 1 FROM activity_attempts WHERE session_id=? AND scene_id=? AND hint_used=1', (row['id'], scene.id)).fetchone()) if scene else False
    origin = conn.execute('SELECT origin FROM activity_versions WHERE id=?', (row['activity_version_id'],)).fetchone()[0]
    target = get_subskill(conn, row['subskill_id'])
    path = capabilities.coverage_for(target)
    final_result = _result(conn, row, spec)
    if final_result:
        # Parent criteria and review notes stay behind the parent PIN boundary.
        final_result = {**final_result, 'rubric': [], 'reviewNote': None}
    public_params = scene.params.model_dump() if scene else None
    if scene and scene.phase == 'independent' and scene.component == 'math_workspace' and scene.params.mode == 'area_expression':
        # The child sees the rectangle and side counts, then determines its
        # area. Retain the derived total only in the immutable private spec.
        public_params['area']['targetArea'] = None
    # Deliberate allowlist: never serialize ActivitySpec or a later scene.
    return dict(id=row['id'], title=spec.title, subject=spec.subject, origin=origin, targetSkill=target_view(target), status=row['status'], sceneIndex=row['current_scene'], sceneCount=len(spec.scenes),
                currentScene=dict(id=scene.id, component=scene.component, phase=scene.phase, prompt=scene.prompt, params=public_params,
                    parentParticipation=bool((path or {}).get('parentParticipation'))) if scene else None,
                currentResponse=decode(attempt['response_json']) if attempt else None,
                feedback=dict(correct=None if attempt['assessment_status'] == 'pending_parent_review' else bool(attempt['correct']),
                    message=scene.feedback.hint if attempt['assessment_status'] == 'pending_parent_review' else scene.feedback.correct if attempt['correct'] else scene.feedback.incorrect) if attempt else None,
                hint=scene.feedback.hint if attempt and hinted and scene.phase == 'guided' else None,
                canAdvance=bool(attempt and scene.phase == 'guided'), finalResult=final_result)


def session_view(security, kid_id, session_id, active):
    with security.db.transaction() as conn:
        return _view(conn, *_owned(conn, security, kid_id, session_id, active))


def _task_key(scene):
    from . import families
    if scene.component in families.COMPONENTS:
        return families.task_key(scene)
    if scene.component in toolkit.COMPONENTS:
        return toolkit.task_key(scene)
    if getattr(scene.answer, 'comparison', None) == 'fraction_form':
        return ('math', str(Fraction(scene.answer.sourceNumerator, scene.answer.sourceDenominator)))
    if scene.component == 'independent_response':
        return general.task_key(scene.prompt, scene.params.context)
    return ('math', str(Fraction(scene.answer.value))) if scene.component == 'independent_fraction' else ('ela', scene.params.baseWord)


def _source_keys(text):
    """Local fingerprints for substantial original passage/panel sentences."""
    from .models import normalize_text
    keys = set()
    for piece in [text or '', *re.split(r'(?<=[.!?])\s+|\n+', text or '')]:
        normalized = ' '.join(re.findall(r'\w+', normalize_text(piece)))
        if len(normalized) >= 16 and len(normalized.split()) >= 4:
            keys.add(('source_piece', hashlib.sha256(normalized.encode()).hexdigest()))
    return keys


def _scene_source_keys(scene):
    # Instructions may recur with new content ("Pack all full crates"). It is
    # the objects/passage/panels, not that reusable instruction, that must vary.
    material = [getattr(scene.params, 'context', None) or '']
    if scene.component in {'tile_order', 'evidence_board'}:
        pieces = scene.params.tiles if scene.component == 'tile_order' else scene.params.sentences
        material.extend(piece.text for piece in pieces)
    if scene.component in {'text_editor', 'oral_studio', 'drawing_studio', 'quantity_lab', 'math_workspace', 'sort_connect'}:
        for name in ('initialText', 'passage', 'listenText', 'backgroundPrompt'):
            material.append(getattr(scene.params, name, None) or '')
    return set().union(*(_source_keys(text) for text in material))


def _task_blocked(scene, blocked):
    return (_task_key(scene) in blocked
            or (scene.component not in toolkit.COMPONENTS
                and general.task_key(scene.prompt, getattr(scene.params, 'context', None)) in blocked)
            or (scene.component in toolkit.COMPONENTS | {'text_editor', 'oral_studio', 'drawing_studio', 'quantity_lab', 'math_workspace', 'sort_connect'} and bool(_scene_source_keys(scene) & set(blocked))))


def _blocked_tasks(conn, kid_id, upload_id, subject, *, equivalent_skill=False):
    """Compare original tasks locally. No original question crosses model boundary."""
    from .models import IRREGULAR, REGULAR
    keys = set()
    for row in conn.execute('SELECT extraction_json,context_json FROM homework_problems WHERE kid_id=? AND upload_id=?', (kid_id, upload_id)):
        problem = decode(row[0], {})
        question = problem.get('question', {})
        text = question.get('text', '') if isinstance(question, dict) else str(question)
        context = general.context_text(decode(row['context_json'], []))
        keys.add(general.task_key(text, context))
        keys.update(_source_keys(text))
        keys.update(_source_keys(context))
        if subject == 'ela':
            keys.update(('ela', base) for base in set(IRREGULAR) | REGULAR if re.search(rf'\b{base}\b', text or '', re.I))
        else:
            for token in re.findall(r'(?<![\w.])\d{2}(?![\w.])', text or ''):
                if 10 <= int(token) <= 60:
                    keys.add(toolkit.task_key(dict(component='bundle_builder', params=dict(total=int(token), groupSize=10))))
            for token in re.findall(r'\b\d{1,2}\s*/\s*[1-9]\d?\b', text or ''):
                keys.add(('math', str(Fraction(token.replace(' ', '')))))
            for copies, denominator in re.findall(r'\b([1-9]\d?)\s+copies\s+of\s+1\s*/\s*([1-9]\d?)\b', text or '', re.I):
                keys.add(('math', str(Fraction(int(copies), int(denominator)))))
    # Retained evidence has the original visible question even when an old
    # extraction checkpoint does not. Never send either representation out.
    for row in conn.execute("SELECT e.question FROM learning_evidence e JOIN homework_problems p ON p.id=e.source_ref WHERE e.kid_id=? AND p.upload_id=? AND e.source='homework'", (kid_id, upload_id)):
        text = row[0] or ''
        keys.update(_source_keys(text))
        if subject == 'ela':
            keys.update(('ela', base) for base in set(IRREGULAR) | REGULAR if re.search(rf'\b{base}\b', text, re.I))
        else:
            for token in re.findall(r'\b\d{1,2}\s*/\s*[1-9]\d?\b', text):
                keys.add(('math', str(Fraction(token.replace(' ', '')))))
            for copies, denominator in re.findall(r'\b([1-9]\d?)\s+copies\s+of\s+1\s*/\s*([1-9]\d?)\b', text, re.I):
                keys.add(('math', str(Fraction(int(copies), int(denominator)))))
    for row in conn.execute('SELECT v.spec_json FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.kid_id=?', (kid_id,)):
        final = ActivitySpec.model_validate_json(row[0]).scenes[-1]
        keys.add(_task_key(final))
        if final.component in toolkit.COMPONENTS | {'text_editor', 'oral_studio', 'drawing_studio', 'quantity_lab', 'math_workspace', 'sort_connect'}:
            keys.update(_scene_source_keys(final))
        if equivalent_skill:
            # Old question-only activities may have used general response keys.
            # Keep their equivalent amounts fresh without changing other skills.
            for token in re.findall(r'\b\d{1,2}\s*/\s*[1-9]\d?\b', final.prompt):
                keys.add(('math', str(Fraction(token.replace(' ', '')))))
    return keys


def _matches(conn, target, *, blocked=(), strong=True):
    tag = target['common_misconception']
    matches = []
    versions = sorted(COMPATIBLE_COMPONENT_VERSIONS)
    for row in conn.execute(f"SELECT * FROM activity_versions WHERE subskill_id=? AND grade=? AND active=1 AND verified=1 AND component_version IN ({','.join('?' for _ in versions)}) ORDER BY created_at,id", (target['subskill_id'], general.grade_for(target), *versions)):
        try:
            spec = ActivitySpec.model_validate_json(row['spec_json'])
            capabilities.validate_activity(spec, target)
        except ValueError:
            continue
        if (not strong or tag in spec.misconceptionTags) and spec.subject == general.subject_for(target) and not _task_blocked(spec.scenes[-1], blocked):
            matches.append((row, spec))
    return matches


def _learning_goal(conn, kid_id, upload_id, target, evidence_id):
    """Use only categorical, supported observations; original work stays local."""
    goal = dict(intent='explore_skill',
                objective=target['subskill'],
                supportedObservation=None)
    path = capabilities.coverage_for(target)
    goal['problemType'] = dict(family=(path or {}).get('family'), responseForm='unknown')
    # Characterize the reliably mapped task locally. Only categorical features
    # leave this boundary; worksheet wording/examples never steer the scenario.
    for problem_row in conn.execute('SELECT extraction_json,mapping_json FROM homework_problems WHERE kid_id=? AND upload_id=? AND teacher_conflict=0 ORDER BY page_number,problem_order', (kid_id, upload_id)):
        mapping = decode(problem_row['mapping_json'], {}) or {}
        if (not isinstance(mapping, dict) or mapping.get('subskill_id') != target['subskill_id']
                or not isinstance(mapping.get('confidence'), (int, float))
                or mapping['confidence'] < CONFIG.mapping_confidence):
            continue
        problem = decode(problem_row['extraction_json'], {}) or {}
        if not isinstance(problem, dict):
            continue
        form = 'selected_choice' if problem.get('answer_choices') else 'written_response'
        goal['problemType']['responseForm'] = form
        break
    if equivalent.is_equivalent_target(target):
        goal['objective'] = 'Use equal subdivisions to show that equivalent fractions name the same shaded amount of the same whole.'
    if target['subskill_id'] in {'3.NF.A.3-2', '4.NF.A.1-1'}:
        goal['objective'] = 'Generate an equivalent fraction by multiplying the number of shaded parts and total equal parts by the same split factor.'
    if evidence_id is None:
        return goal
    row = conn.execute("""SELECT e.eligible,e.correctness,e.confidence,e.signature_json
        FROM learning_evidence e JOIN homework_problems p ON p.id=e.source_ref AND p.kid_id=e.kid_id
        WHERE e.id=? AND e.kid_id=? AND e.subskill_id=? AND e.source='homework'
          AND p.upload_id=? AND p.teacher_conflict=0""",
        (evidence_id, kid_id, target['subskill_id'], upload_id)).fetchone()
    if not row or not row['eligible'] or (row['confidence'] or 0) < CONFIG.mapping_confidence:
        return goal
    if row['correctness'] == 'correct':
        goal.update(intent='reinforce_correct_work', supportedObservation=dict(kind='correct_response'))
    elif row['correctness'] == 'incorrect':
        observation = dict(kind='incorrect_response')
        signature = decode(row['signature_json'], {}) or {}
        if (isinstance(signature, dict) and signature.get('status') == 'matched'
                and isinstance(signature.get('confidence'), (int, float)) and signature['confidence'] >= .85):
            observation = dict(kind='matched_catalog_pattern', pattern=target['common_misconception'])
        goal.update(intent='support_current_skill', supportedObservation=observation)
    return goal


async def _generate(adapter, target, source_refs, seen_tasks, variation=0, learning_goal=None,
                    *, previous_interactions=None, on_event=None):
    # All new live activities use the same compositional toolkit. The old 1.0
    # definitions remain readable for immutable sessions/offline examples only.
    return await general.compose(adapter, target, source_refs, seen_tasks, variation,
        learning_goal=learning_goal, previous_interactions=previous_interactions, on_event=on_event)


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
        if not capabilities.mechanics_for(target):
            raise AccountError('no_suitable_mechanic', 'An activity is not available for this skill yet.', 409)
        if prior and prior['lease_until'] and prior['lease_until'] > security.clock.now():
            raise AccountError('activity_preparing', 'Your activity is being prepared. Please retry in a moment.', 409)
        now = security.clock.now()
        conn.execute('INSERT INTO activity_start_requests(kid_id,request_key,upload_id,lease_token,lease_until,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(kid_id,request_key) DO UPDATE SET lease_token=excluded.lease_token,lease_until=excluded.lease_until', (kid_id, key, upload_id, lease, now + 600, now))
        blocked = _blocked_tasks(conn, kid_id, upload_id, general.subject_for(target),
                                 equivalent_skill=equivalent.is_equivalent_target(target))
        learning_goal = _learning_goal(conn, kid_id, upload_id, target, evidence_id)
        matches = _matches(conn, target, blocked=blocked) if adapter is False else []
        seen = {row[0] for row in conn.execute('SELECT activity_version_id FROM activity_sessions WHERE kid_id=?', (kid_id,))}
        selected = next((match for match in matches if match[0]['id'] not in seen), None) if adapter is False else None
        seen_tasks, previous_interactions = [], []
        for row in conn.execute('SELECT v.spec_json FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.kid_id=? AND s.subskill_id=? ORDER BY s.started_at,s.rowid', (kid_id, target['subskill_id'])):
            previous_spec = ActivitySpec.model_validate_json(row[0])
            scene = previous_spec.scenes[-1]
            seen_tasks.append(general.scene_question(scene))
            previous_interactions.append([dict(component=item.component, mode=getattr(item.params, 'mode', None))
                for item in previous_spec.scenes if item.phase == 'guided'])
        refs = [row[0] for row in conn.execute('SELECT id FROM activity_sources WHERE active=1 ORDER BY id')]
        revision = conn.execute('SELECT id FROM activity_library_revisions ORDER BY imported_at DESC,id LIMIT 1').fetchone()
        if revision:
            revision_id = revision['id']
        else:
            # Composition also works before the optional example library is seeded.
            # This records the genuine empty source snapshot, not invented sources.
            source_hash = hashlib.sha256(b'[]').hexdigest()
            revision_id = 'alr_' + source_hash[:40]
            conn.execute('INSERT INTO activity_library_revisions VALUES(?,?,?,?,?)',
                         (revision_id, source_hash, security.clock.now(), 0, '[]'))
    # No transaction spans provider work. Only curriculum fields cross this boundary.
    generated, outcome, generation_events = None, 'reused_offline', []
    if selected is None and adapter is not False and revision_id:
        composition_deadline = asyncio.get_running_loop().time() + COMPOSITION_TIMEOUT_SECONDS
        for variation in range(2):
            try:
                # Keep bounded recovery inside the start lease and HTTP proxy
                # budgets, even if several provider calls each hit their limit.
                async with asyncio.timeout_at(composition_deadline):
                    generated = await _generate(adapter or VisionAdapter(), target, refs, seen_tasks, variation, learning_goal=learning_goal,
                        previous_interactions=previous_interactions[-10:], on_event=generation_events.append)
                if _task_blocked(generated.scenes[-1], blocked):
                    generated = None
                    outcome = 'freshness_rejected'
                    generation_events.append(dict(category='review', code='source_or_previous_task_reused', sceneIndex=None, field=None, constraint=None, mode='original', action='validation_failed'))
                    continue
                outcome = 'generated'
                break
            except TimeoutError:
                generated, outcome = None, 'composition_timeout'
                generation_events.append(dict(category='provider', code='composition_timeout', sceneIndex=None,
                    field=None, constraint=None, mode='original', action='compose_failed'))
                break
            except Exception:
                # Never include exception text or raw model output in a log/audit.
                outcome = 'composition_failed'
                # compose() already attempted scene-local repair and one simpler
                # composition for this exact goal; do not restart a hidden loop.
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
        for event in generation_events:
            # Safe fixed reason codes and schema-owned locations only. Neither
            # candidate scenes, original work, nor arbitrary exceptions are logged.
            audit_event = {name: event.get(name) for name in ('category', 'code', 'sceneIndex', 'field', 'mode', 'action')}
            _audit(conn, security, 'compose_activity_stage', upload_id, event['code'],
                model=getattr(adapter, 'model', '') if adapter else '', prompt_version=PROMPT_VERSION,
                catalog_revision=target['revision'], explanation=encode(audit_event), kid_id=kid_id)
        opened = conn.execute("SELECT id FROM activity_sessions WHERE kid_id=? AND upload_id=? AND status='in_progress'", (kid_id, upload_id)).fetchone()
        if opened:
            session_id = opened['id']
        else:
            latest_blocked = _blocked_tasks(conn, kid_id, upload_id, general.subject_for(target),
                                            equivalent_skill=equivalent.is_equivalent_target(target))
            if generated is not None and _task_blocked(generated.scenes[-1], latest_blocked):
                generated = None
            if selected and _task_blocked(selected[1].scenes[-1], latest_blocked):
                selected = None
            if generated is not None:
                raw = json.dumps(generated.model_dump(), ensure_ascii=False, sort_keys=True, separators=(',', ':'))
                content_hash = hashlib.sha256(raw.encode()).hexdigest()
                version_id = 'generated_' + content_hash[:40]
                conn.execute('INSERT OR IGNORE INTO activity_versions(id,activity_id,version,spec_json,spec_sha256,subskill_id,subject,grade,misconception_tags_json,origin,verified,source_revision,model,prompt_version,component_version,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                             (version_id, version_id, 1, raw, content_hash, generated.subskillId, generated.subject, generated.grade, encode(generated.misconceptionTags), 'model_generated', 1, revision_id, getattr(adapter, 'model', '') if adapter else VisionAdapter().model, PROMPT_VERSION, COMPONENT_VERSION, security.clock.now()))
                selected = (conn.execute('SELECT * FROM activity_versions WHERE spec_sha256=?', (content_hash,)).fetchone(), generated)
            if selected is None and adapter is False:
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
    from . import families
    if scene.component in families.COMPONENTS:
        return families.grade_response(scene, response)
    if scene.component in toolkit.COMPONENTS:
        return toolkit.grade_response(scene, response)
    if scene.component == 'fraction_split_compare':
        if not isinstance(response, FractionSplitResponse) or response.splitFactor not in scene.params.splitFactors:
            raise ValueError('Choose an offered equal split')
        factor = response.splitFactor
        value = equivalent.split_fraction(scene.params, factor)
        return value, factor == scene.answer.splitFactor
    if scene.component in {'guided_choice', 'guided_response', 'independent_response'}:
        return general.grade_response(scene, response)
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
        scene = _resolved_scene(conn, row, spec, spec.scenes[row['current_scene']])
        if scene.phase == 'independent' and conn.execute('SELECT 1 FROM activity_attempts WHERE session_id=? AND scene_id=?', (session_id, scene.id)).fetchone():
            raise AccountError('already_answered', 'Your first answer is saved. Continue to the next step.', 409)
        try:
            if scene.component == 'oral_studio':
                from .assessment import require_recording
                require_recording(conn, kid_id, session_id, scene.id, body.response)
            response_text, correct = _grade(scene, body.response)
        except (ValueError, TypeError, ZeroDivisionError):
            raise AccountError('invalid_response', 'Choose an answer for this step and try again.', 400) from None
        conn.execute('INSERT INTO activity_attempts(id,session_id,scene_id,request_key,phase,response_json,response_text,correct,created_at,assessment_status) VALUES(?,?,?,?,?,?,?,?,?,?)',
            (uid(), session_id, scene.id, body.idempotencyKey, scene.phase, serialized, response_text, int(bool(correct)), security.clock.now(), 'pending_parent_review' if correct is None else 'automatic'))
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


def parent_attempt(security, kid_id, session_id, active):
    """Review the exact persisted composition and every saved child action."""
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, active, 'parent')
        row = conn.execute('SELECT * FROM activity_sessions WHERE id=? AND kid_id=?', (session_id, kid_id)).fetchone()
        if not row:
            raise AccountError('not_found', 'That activity was not found.', 404)
        version = conn.execute('SELECT spec_json,origin,spec_sha256 FROM activity_versions WHERE id=?', (row['activity_version_id'],)).fetchone()
        spec = ActivitySpec.model_validate_json(version['spec_json'])
        responded_scenes = {item[0] for item in conn.execute('SELECT DISTINCT scene_id FROM activity_attempts WHERE session_id=?', (session_id,))}
        scenes = []
        for scene in spec.scenes:
            connection_pending = bool(scene.connection and scene.connection.sourceSceneId not in responded_scenes)
            resolved = scene if connection_pending else _resolved_scene(conn, row, spec, scene)
            attempts = conn.execute('SELECT * FROM activity_attempts WHERE session_id=? AND scene_id=? ORDER BY rowid', (session_id, scene.id)).fetchall()
            scenes.append(dict(id=scene.id, component=scene.component, phase=scene.phase,
                prompt=resolved.prompt, params=resolved.params.model_dump(),
                connection=scene.connection.model_dump() if getattr(scene, 'connection', None) else None,
                connectionPending=connection_pending,
                responses=[dict(response=decode(attempt['response_json']), responseText=attempt['response_text'],
                    correct=None if attempt['assessment_status'] == 'pending_parent_review' else bool(attempt['correct']),
                    assessmentStatus=attempt['assessment_status'], hintUsed=bool(attempt['hint_used']),
                    createdAt=attempt['created_at']) for attempt in attempts]))
        return dict(id=row['id'], title=spec.title, subject=spec.subject, schemaVersion=spec.schemaVersion,
            definitionHash=version['spec_sha256'], origin=version['origin'], status=row['status'],
            targetSkill=target_view(get_subskill(conn, row['subskill_id'])), scenes=scenes,
            finalResult=_result(conn, row, spec))
