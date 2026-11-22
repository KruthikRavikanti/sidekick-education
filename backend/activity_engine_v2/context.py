"""Owned, evidence-grounded learning information. No private work reaches composition."""
from __future__ import annotations

from dataclasses import dataclass
import json
import math
import re

from backend.accounts.security import AccountError
from backend.gap.catalog import get_subskill
from backend.gap.config import CONFIG
from .service import _authorize


def decode(value, default=None):
    try:
        parsed = json.loads(value) if isinstance(value, str) else value
        return default if parsed is None else parsed
    except (ValueError, TypeError):
        return default


def confidence(value):
    return float(value) if type(value) in {int, float} and math.isfinite(value) and 0 <= value <= 1 else None


@dataclass(frozen=True)
class TrustedContext:
    sanitized: dict
    private_sources: dict
    target_view: dict


def with_retry_design_feedback(context, source, *, account_id, kid_id, upload_id):
    """Pin one owned failed design as generated critique, never learner facts.

    The caller has authorized the exact retry source inside its reservation
    transaction. Defense-in-depth checks keep malformed/stale audit rows out of
    provider input. Existing source contexts are never rewritten.
    """
    private = dict(context.private_sources, retryOfGenerationId=source['id'])
    unchanged = TrustedContext(dict(context.sanitized), private, context.target_view)
    pinned = decode(source['context_json'], {})
    if (source['status'] != 'failed' or source['account_id'] != account_id
            or source['kid_id'] != kid_id or source['upload_id'] != upload_id
            or not isinstance(pinned, dict) or pinned.get('targets') != context.sanitized['targets']):
        return unchanged
    from pydantic import ValidationError
    from .game_design import GameDesign
    from .gameplay import GameplayReview, canonical_hash
    from .composer import SemanticReview
    try:
        design = GameDesign.model_validate(decode(source['game_design_json']), strict=True)
    except (ValidationError, ValueError, TypeError):
        return unchanged
    code, stage = source['reason_code'], source['stage']
    if not all(isinstance(value, str) and re.fullmatch(r'[a-z][a-z0-9_]{0,79}', value)
               for value in (code, stage)):
        return unchanged
    feedback = dict(source='rejected_generated_design', notLearnerEvidence=True,
                    selectedDesign=design.model_dump(), stage=stage, reasonCode=code)
    try:
        review = GameplayReview.model_validate(decode(source['gameplay_review_json']), strict=True)
        semantic = SemanticReview.model_validate(decode(source['review_json']), strict=True)
        manifest = decode(source['render_manifest_json'])
        if (not review.approved and review.reasonCode != 'approved' and isinstance(manifest, dict)
                and review.renderManifestHash == canonical_hash(manifest)
                and review.definitionHash == semantic.definitionHash):
            checks = ('meaningfulChoices', 'understandableConsequences', 'recoveryPossible',
                      'targetNecessary', 'briefGoalClear', 'finishAchievable', 'finishSatisfying',
                      'mainStagePlayable', 'structuralVariety', 'renderedAffordancesSuitable')
            feedback['gameplayFailure'] = dict(definitionHash=review.definitionHash,
                renderManifestHash=review.renderManifestHash, reasonCode=review.reasonCode,
                failedChecks=[name for name in checks if not getattr(review, name)], summary=review.summary)
    except (ValidationError, ValueError, TypeError):
        pass
    return TrustedContext(dict(context.sanitized, generatedDesignFeedback=[feedback]), private, context.target_view)


def _history(connection, kid_id, account_id, skill_id):
    history, signatures, references = [], [], []
    rows = connection.execute('''SELECT s.id,s.status,s.assistance_json,s.completion_snapshot_json,v.definition_json,
            (SELECT g.game_design_json FROM activity_program_generations g WHERE g.session_id=s.id
                AND g.account_id=s.account_id AND g.kid_id=s.kid_id AND g.status='ready'
                AND g.approved_definition_sha256=v.definition_sha256 ORDER BY g.rowid DESC LIMIT 1) AS game_design_json
        FROM activity_program_sessions s JOIN activity_program_versions v ON v.id=s.program_version_id
        WHERE s.kid_id=? AND s.account_id=? ORDER BY s.started_at DESC,s.rowid DESC LIMIT 30''',
        (kid_id, account_id)).fetchall()
    for row in rows:
        program = decode(row['definition_json'], {})
        if skill_id not in {item.get('skillId') for item in program.get('intent', {}).get('targets', [])}:
            continue
        outcome = decode(row['completion_snapshot_json'], {}).get('outcome', {})
        delivered = decode(row['assistance_json'], {})
        history.append(dict(source='saved_v2_activity', completion=row['status'],
            assessment=outcome.get('assessment', 'not_assessed'),
            assistanceReceived=bool(delivered), helpDeliveries=sum(item.get('uses', 0) for item in delivered.values()),
            confidence=None))
        from .game_design import design_signature, structural_signature
        signature = dict(operations=sorted({action['operation'] for action in program.get('actions', [])}),
                         componentKinds=sorted({item['kind'] for item in program.get('components', [])}),
                         structuralSignature=structural_signature(program))
        plan = decode(row['game_design_json'])
        if isinstance(plan, dict):
            signature['designSignature'] = design_signature(plan)
        signatures.append(signature)
        references.append(dict(source='activity_program', id=row['id']))
        if len(history) >= 6:
            break
    for row in connection.execute('''SELECT s.id,s.status,a.correct,a.assessment_status,
            EXISTS(SELECT 1 FROM activity_attempts h WHERE h.session_id=s.id AND h.hint_used=1) AS helped
        FROM activity_sessions s LEFT JOIN activity_attempts a ON a.session_id=s.id AND a.phase='independent'
        WHERE s.kid_id=? AND s.subskill_id=? ORDER BY s.started_at DESC,s.rowid DESC LIMIT 4''', (kid_id, skill_id)):
        history.append(dict(source='saved_v1_activity', completion=row['status'],
            assessment='pending_parent_review' if row['assessment_status'] == 'pending_parent_review' else
                ('correct' if row['correct'] else 'incorrect') if row['correct'] is not None else 'not_assessed',
            assistanceReceived=bool(row['helped']), confidence=None))
        references.append(dict(source='v1_activity', id=row['id']))
    return history, signatures, references


def build_context(connection, security, kid_id, upload_id, active):
    """Resolve only this child's completed upload; treat content as data, never instructions."""
    _authorize(connection, security, kid_id, active)
    upload = connection.execute('SELECT * FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
    if not upload:
        raise AccountError('not_found', 'That student work was not found.', 404)
    if upload['state'] != 'completed':
        raise AccountError('analysis_failed' if upload['state'] == 'failed' else 'analysis_pending',
                           'Wait for your work to finish reading, then try again.', 409)
    candidates = []
    for row in connection.execute('''SELECT * FROM homework_problems
        WHERE upload_id=? AND kid_id=? AND teacher_conflict=0 ORDER BY page_number,problem_order,id''', (upload_id, kid_id)):
        mapping = decode(row['mapping_json'], {})
        problem = decode(row['extraction_json'], {})
        question = problem.get('question', {})
        score = confidence(mapping.get('confidence'))
        if score is None or score < CONFIG.mapping_confidence or question.get('uncertain') or not str(question.get('text') or '').strip():
            continue
        target = get_subskill(connection, mapping.get('subskill_id'))
        if not target or not target['active'] or str(target.get('grade')) not in {'K', '1', '2', '3', '4', '5'}:
            continue
        grade = decode(row['grading_json'], {})
        grade_confidence = confidence(grade.get('confidence'))
        work = problem.get('student_work', {})
        readable = (work.get('status') == 'answered' and not any(work.get(name, {}).get('uncertain')
                    for name in ('final_answer', 'selected_choice'))
                    and bool(work.get('final_answer', {}).get('text') or work.get('selected_choice', {}).get('text')))
        correctness = grade.get('correctness') if (readable and grade_confidence is not None and grade_confidence >= .85
            and grade.get('source') in {'model', 'deterministic', 'adult'}) else 'ungraded'
        correctness = correctness if correctness in {'correct', 'incorrect'} else 'ungraded'
        candidates.append((0 if correctness == 'incorrect' else 1 if correctness == 'correct' else 2,
                           row, target, score, grade_confidence, correctness))
    if not candidates:
        raise AccountError('no_supported_skill', 'We could not identify a reliable skill in this work yet.', 422)
    _, row, target, mapping_confidence, grade_confidence, correctness = min(candidates, key=lambda item: item[0])
    skill_id = target['subskill_id']
    subject = 'math' if target['subject'].casefold() == 'math' else 'ela'
    observations, hypotheses, uncertainties = [], [], []
    if correctness in {'correct', 'incorrect'}:
        observations.append(dict(id='upload-response', skillId=skill_id,
            kind='correct_response' if correctness == 'correct' else 'incorrect_response', source='uploaded_work',
            confidence=grade_confidence, summary='The reliably mapped uploaded response was graded '+correctness+'.'))
    else:
        uncertainties.append('This response has no reliable correctness judgment. Explore the mapped skill without treating it as incorrect.')
    signature = decode(row['signature_json'], {})
    signature_confidence = confidence(signature.get('confidence'))
    supported_pattern = (dict(status=signature['status'], confidence=signature_confidence)
        if correctness == 'incorrect' and signature.get('status') in {'matched', 'possible_slip', 'other'}
        and signature_confidence is not None and signature_confidence >= CONFIG.mapping_confidence else None)
    if (correctness == 'incorrect' and signature.get('status') == 'matched'
            and signature_confidence is not None and signature_confidence >= CONFIG.mapping_confidence):
        raw = target.get('raw', {})
        raw = decode(raw, {})
        description = str(target.get('common_misconception') or raw.get('common_misconception') or '').strip()
        if description:
            observations.append(dict(id='upload-pattern', skillId=skill_id, kind='observed_strategy', source='uploaded_work',
                confidence=signature_confidence, summary='Visible work was matched to a catalog error pattern; this is a supported possibility, not a diagnosis.'))
            hypotheses.append(dict(skillId=skill_id, description=description[:500],
                                   confidence=signature_confidence, observationIds=['upload-pattern']))
    else:
        uncertainties.append('No specific strategy, prerequisite diagnosis or misconception is established by this work.')
    history, signatures, refs = _history(connection, kid_id, active.account_id, skill_id)
    if not history:
        uncertainties.append('No recent relevant saved activity outcome is included.')
    intent = dict(targets=[dict(skillId=skill_id, demonstration=target['subskill'])],
                  observations=observations, misconceptions=hypotheses)
    selected_problem = decode(row['extraction_json'], {})
    work = selected_problem.get('student_work', {})
    problem_type = ('selected_response' if selected_problem.get('answer_choices') else
                    'worked_response' if work.get('steps') else 'written_response' if work.get('status') == 'answered' else 'ungraded_response')
    sanitized = dict(**intent, grade=str(target['grade']), subject=subject, mappingConfidence=mapping_confidence,
        learningGoal='support_current_skill' if correctness == 'incorrect' else 'reinforce_correct_work' if correctness == 'correct' else 'explore_skill',
        problemType=problem_type, errorPatternObservation=supported_pattern, history=history, uncertainties=uncertainties,
        previousSignatures=signatures)
    return TrustedContext(sanitized=sanitized,
        private_sources=dict(uploadId=upload_id, problemId=row['id'], history=refs),
        target_view=dict(id=skill_id, name=target['subskill'], subject=subject))
