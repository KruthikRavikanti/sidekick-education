"""Activities inherit the existing cookie, profile version, parent PIN and CSRF boundary."""
from fastapi import APIRouter, Request

from backend.accounts.security import AccountError, get_security, require_parent, require_session
from .models import NextRequest, SceneRequest, StartRequest, SubmitRequest
from . import service
from . import assessment

router = APIRouter(prefix='/api/activities')


def kid_context(request):
    active = require_session(request)
    if active.mode != 'kid' or not active.active_kid_profile_id:
        raise AccountError('kid_required', 'Choose a child profile to continue.', 403)
    return get_security(request), active.active_kid_profile_id, active


@router.get('/kid/suggestion')
def suggestion(uploadId: str, request: Request):
    security, kid_id, active = kid_context(request)
    return service.suggestion(security, kid_id, uploadId, active)


@router.post('/kid/start')
async def start(body: StartRequest, request: Request):
    security, kid_id, active = kid_context(request)
    return await service.start(security, kid_id, body, active, adapter=getattr(request.app.state, 'activity_adapter', None))


@router.get('/kid/sessions/{session_id}')
def session(session_id: str, request: Request):
    security, kid_id, active = kid_context(request)
    return service.session_view(security, kid_id, session_id, active)


@router.post('/kid/sessions/{session_id}/submit')
def submit(session_id: str, body: SubmitRequest, request: Request):
    security, kid_id, active = kid_context(request)
    return service.submit(security, kid_id, session_id, body, active)


@router.post('/kid/sessions/{session_id}/hint')
def hint(session_id: str, body: SceneRequest, request: Request):
    security, kid_id, active = kid_context(request)
    return service.hint(security, kid_id, session_id, body, active)


@router.post('/kid/sessions/{session_id}/next')
def advance(session_id: str, body: NextRequest, request: Request):
    security, kid_id, active = kid_context(request)
    return service.advance(security, kid_id, session_id, body, active)


@router.get('/parent/{kid_id}/history')
def history(kid_id: str, request: Request):
    return service.history(get_security(request), kid_id, require_parent(request))


@router.get('/parent/{kid_id}/sessions/{session_id}')
def parent_attempt(kid_id: str, session_id: str, request: Request):
    return service.parent_attempt(get_security(request), kid_id, session_id, require_parent(request))


@router.post('/kid/sessions/{session_id}/recording')
async def recording(session_id: str, request: Request):
    security, kid_id, active = kid_context(request)
    # BoundedBodyMiddleware limits bytes before multipart parsing begins.
    async with request.form(max_files=1, max_fields=2, max_part_size=assessment.MAX_RECORDING_BYTES) as form:
        file = form.get('file')
        if not hasattr(file, 'read') or set(form.keys()) != {'file', 'sceneId', 'idempotencyKey'}:
            raise AccountError('invalid_recording', 'Record your voice and try again.', 400)
        data = await file.read(assessment.MAX_RECORDING_BYTES + 1)
        return assessment.save_recording(security, kid_id, session_id, str(form['sceneId']),
            str(form['idempotencyKey']), data, file.content_type or '', active)


@router.get('/kid/sessions/{session_id}/recordings/{recording_id}')
def child_recording(session_id: str, recording_id: str, request: Request):
    security, kid_id, active = kid_context(request)
    return assessment.recording_response(security, kid_id, recording_id, active, session_id=session_id)


@router.get('/parent/{kid_id}/recordings/{recording_id}')
def parent_recording(kid_id: str, recording_id: str, request: Request):
    return assessment.recording_response(get_security(request), kid_id, recording_id, require_parent(request))


@router.post('/parent/{kid_id}/sessions/{session_id}/review')
def parent_review(kid_id: str, session_id: str, body: assessment.ParentReviewRequest, request: Request):
    return assessment.review(get_security(request), kid_id, session_id, body, require_parent(request))
