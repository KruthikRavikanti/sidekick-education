"""Which skills a piece of uploaded work reliably points at.

Read-only. Games use this to choose what a child plays after their work is read.
It never changes a skill state and never promotes an observation into evidence.
"""
from backend.accounts.security import AccountError

from .catalog import get_subskill
from .config import CONFIG
from .service import authorize, decode


def subject_for(subskill):
    """'math' or 'ela' for a catalog skill, None for anything else."""
    value = str((subskill or {}).get('subject', '')).casefold()
    return 'math' if value == 'math' else 'ela' if value in {'reading/ela', 'ela'} else None


def candidates(conn, security, kid_id, upload_id, active, grade_of):
    """Every reliably matched skill on an owned upload, as (priority, skill, evidence id).

    Priority 0 is work that was reliably marked incorrect, 1 is correct work, 2 is a reliable
    skill match where grading abstained. `grade_of` decides which grades count: it returns a
    number for a skill the caller can serve and None for one it cannot.

    Returns (candidates, reason). The reason is 'analysis_pending' or 'analysis_failed' while
    the upload has no finished reading, and None otherwise.
    """
    authorize(security, conn, kid_id, active, 'kid')
    upload = conn.execute('SELECT * FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
    if not upload:
        raise AccountError('not_found', 'That student work was not found.', 404)
    if upload['state'] != 'completed':
        return [], 'analysis_failed' if upload['state'] == 'failed' else 'analysis_pending'
    # A reliable skill match is enough to practice it, even where automatic grading
    # abstained. This does not promote that observation into support evidence.
    rows = conn.execute("""SELECT p.*, e.id AS evidence_id,
        e.subskill_id AS evidence_skill, e.correctness AS evidence_correctness,
        e.eligible AS evidence_eligible, e.confidence AS evidence_confidence
        FROM homework_problems p LEFT JOIN learning_evidence e
          ON e.source_ref=p.id AND e.kid_id=p.kid_id AND e.source='homework'
        WHERE p.upload_id=? AND p.kid_id=? AND p.teacher_conflict=0
        ORDER BY p.page_number,p.problem_order,p.id""", (upload_id, kid_id)).fetchall()
    found = []
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
        if not target or not target['active'] or subject_for(target) is None or grade_of(target) is None:
            continue
        priority = 0 if row['evidence_eligible'] and row['evidence_correctness'] == 'incorrect' else 1 if row['evidence_correctness'] == 'correct' else 2
        found.append((priority, target, row['evidence_id']))
    return found, None
