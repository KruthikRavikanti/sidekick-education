"""Private child artifacts and explicit parent assessment, never inferred correctness."""
import hashlib
import json
import secrets

from fastapi.responses import FileResponse
from pydantic import BaseModel, ConfigDict, Field

from backend.accounts.security import AccountError
from backend.gap.service import authorize
from backend.gap.storage import cleanup_references, file_path, save_bytes

MAX_RECORDING_BYTES = 8 * 1024 * 1024


class ParentReviewRequest(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    correct: bool
    note: str = Field(max_length=2000)
    parentObserved: bool
    idempotencyKey: str = Field(min_length=8, max_length=100)


def assessment_status(attempt):
    return attempt['assessment_status']


def result_details(conn, row, spec, attempt):
    if not attempt:
        return None
    from . import capabilities, general
    final = spec.scenes[-1]
    status = assessment_status(attempt)
    response = json.loads(attempt['response_json'])
    response = response if isinstance(response, dict) else {}
    review = json.loads(attempt['review_json']) if attempt['review_json'] else {}
    coverage = capabilities.coverage_for({'subskill_id': row['subskill_id']}) if hasattr(capabilities, 'coverage_for') else None
    return dict(question=general.scene_question(final), response=attempt['response_text'],
        correct=None if status == 'pending_parent_review' else bool(attempt['correct']),
        assessmentStatus=status, rubric=list(getattr(final.answer, 'rubric', [])),
        recordingId=response.get('recordingId'), strokes=response.get('strokes'),
        reviewNote=review.get('note'), parentParticipation=bool((coverage or {}).get('parentParticipation')))


def review(security, kid_id, session_id, body, active):
    from .service import uid
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, active, 'parent')
        row = conn.execute('SELECT s.*,v.spec_json FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=? AND s.kid_id=?', (session_id, kid_id)).fetchone()
        if not row:
            raise AccountError('not_found', 'That activity was not found.', 404)
        attempt = conn.execute("SELECT * FROM activity_attempts WHERE session_id=? AND phase='independent'", (session_id,)).fetchone()
        if not attempt or attempt['assessment_status'] == 'automatic':
            raise AccountError('review_unavailable', 'This activity does not need a parent review.', 409)
        previous = conn.execute('SELECT * FROM activity_parent_reviews WHERE session_id=? AND request_key=?', (session_id, body.idempotencyKey)).fetchone()
        note = body.note.strip()
        if previous:
            if (bool(previous['correct']) != body.correct or previous['note'] != note or bool(previous['parent_observed']) != body.parentObserved):
                raise AccountError('idempotency_conflict', 'This review was already saved. Refresh the activity.', 409)
        else:
            from . import capabilities
            path = capabilities.coverage_for({'subskill_id': row['subskill_id']}) if hasattr(capabilities, 'coverage_for') else None
            if (path or {}).get('parentParticipation') and not body.parentObserved:
                raise AccountError('observation_required', 'Confirm that you observed the activity before reviewing it.', 400)
            conn.execute('INSERT INTO activity_parent_reviews VALUES(?,?,?,?,?,?,?,?)',
                (uid(), session_id, attempt['id'], body.idempotencyKey, int(body.correct), note, int(body.parentObserved), security.clock.now()))
            conn.execute("UPDATE activity_attempts SET correct=?,assessment_status='parent_reviewed',review_json=? WHERE id=?",
                (int(body.correct), json.dumps({'note': note, 'parentObserved': body.parentObserved}), attempt['id']))
        # Reauthorize and serialize this exact session rather than relying on
        # the dashboard's most-recent-100 pagination window.
        from .models import ActivitySpec
        from .service import target_view
        from backend.gap.catalog import get_subskill
        spec = ActivitySpec.model_validate_json(row['spec_json'])
        attempt = conn.execute('SELECT * FROM activity_attempts WHERE id=?', (attempt['id'],)).fetchone()
        return dict(id=row['id'], finalResult=result_details(conn, row, spec, attempt), targetSkill=target_view(get_subskill(conn, row['subskill_id'])))


def audio_mime(data, supplied):
    supplied = supplied.split(';')[0].strip().lower()
    if data.startswith(b'RIFF') and data[8:12] == b'WAVE' and supplied in {'audio/wav', 'audio/x-wav'}:
        import io
        import wave
        try:
            with wave.open(io.BytesIO(data)) as source:
                if not (0 < source.getnframes() / source.getframerate() <= 125 and source.getnchannels() in {1, 2}):
                    raise ValueError
        except (wave.Error, EOFError, ZeroDivisionError):
            raise ValueError('Invalid recording') from None
        return 'audio/wav'
    if supplied == 'audio/webm' and data.startswith(b'\x1aE\xdf\xa3') and b'OpusHead' in data[:8192]:
        return 'audio/webm'
    if supplied == 'audio/ogg' and data.startswith(b'OggS') and (b'OpusHead' in data[:8192] or b'vorbis' in data[:8192]):
        return 'audio/ogg'
    if supplied in {'audio/mp4', 'audio/x-m4a'} and data[4:8] == b'ftyp' and len(data) > 128:
        return 'audio/mp4'
    raise ValueError('Invalid recording')


def save_recording(security, kid_id, session_id, scene_id, request_key, data, mime, active):
    from .service import _owned
    if not 8 <= len(request_key) <= 100:
        raise AccountError('invalid_recording', 'Please record this step again.', 400)
    if not data or len(data) > MAX_RECORDING_BYTES:
        raise AccountError('invalid_recording', 'Use a recording under 8 MB and two minutes.', 413)
    try:
        canonical = audio_mime(data, mime)
    except ValueError:
        raise AccountError('invalid_recording', 'That audio could not be opened. Record it again.', 400) from None
    digest = hashlib.sha256(data).hexdigest()
    saved = None
    try:
        with security.db.transaction() as conn:
            row, spec = _owned(conn, security, kid_id, session_id, active)
            previous = conn.execute('SELECT * FROM activity_recordings WHERE session_id=? AND request_key=?', (session_id, request_key)).fetchone()
            if previous:
                if previous['scene_id'] != scene_id or previous['content_sha256'] != digest:
                    raise AccountError('idempotency_conflict', 'This recording was already saved.', 409)
                return dict(recordingId=previous['id'])
            if row['status'] != 'in_progress':
                raise AccountError('scene_changed', 'This activity is already complete.', 409)
            scene = spec.scenes[row['current_scene']]
            if scene.id != scene_id or scene.component != 'oral_studio':
                raise AccountError('scene_changed', 'Record only the current speaking step.', 409)
            saved = save_bytes(security, data)
            identifier = secrets.token_hex(16)
            conn.execute('INSERT INTO activity_recordings VALUES(?,?,?,?,?,?,?,?,?,?)',
                (identifier, kid_id, session_id, scene_id, request_key, saved, digest, canonical, len(data), security.clock.now()))
        return dict(recordingId=identifier)
    except BaseException:
        if saved:
            cleanup_references(security, [saved])
        raise


def recording_response(security, kid_id, recording_id, active, *, session_id=None):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, active, 'kid' if session_id else 'parent')
        row = conn.execute('SELECT * FROM activity_recordings WHERE id=? AND kid_id=?', (recording_id, kid_id)).fetchone()
        if not row or (session_id is not None and row['session_id'] != session_id):
            raise AccountError('not_found', 'That recording was not found.', 404)
        path = file_path(security, row['file_ref'])
        if not path.is_file():
            raise AccountError('not_found', 'That recording was not found.', 404)
    return FileResponse(path, media_type=row['mime'], headers={'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'})


def require_recording(conn, kid_id, session_id, scene_id, response):
    identifier = getattr(response, 'recordingId', None)
    if not identifier or not conn.execute('SELECT 1 FROM activity_recordings WHERE id=? AND kid_id=? AND session_id=? AND scene_id=?',
        (identifier, kid_id, session_id, scene_id)).fetchone():
        raise ValueError('Record and save your reading first')
