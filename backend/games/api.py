"""Game routes. They reuse the app's cookie, profile version, parent PIN and CSRF boundary."""
from fastapi import APIRouter, BackgroundTasks, Request
from fastapi.responses import Response

from backend.accounts.security import AccountError, get_security, require_parent, require_session
from . import jobs, service
from .models import DecisionRequest, FinishRequest, StartRequest, UploadRef

router = APIRouter(prefix='/api/games')


def kid_context(request):
    active = require_session(request)
    if active.mode != 'kid' or not active.active_kid_profile_id:
        raise AccountError('kid_required', 'Choose a child profile to continue.', 403)
    return get_security(request), active.active_kid_profile_id, active


@router.get('/kid/suggestion')
def suggestion(uploadId: str, request: Request):
    security, kid_id, active = kid_context(request)
    return service.suggestion(security, kid_id, uploadId, active)


@router.post('/kid/request')
def request_build(body: UploadRef, request: Request, background: BackgroundTasks):
    security, kid_id, active = kid_context(request)
    result = service.request_build(security, kid_id, body.uploadId, active)
    if result['queued']:
        # Runs after the response. The child never waits on a model.
        background.add_task(jobs.drain, security.db, security.clock, getattr(request.app.state, 'game_adapter', None), getattr(request.app.state, 'game_robot', None))
    return result


@router.post('/kid/start')
def start(body: StartRequest, request: Request):
    security, kid_id, active = kid_context(request)
    return service.start(security, kid_id, body, active)


@router.get('/kid/runs/{run_id}')
def run(run_id: str, request: Request):
    security, kid_id, active = kid_context(request)
    return service.run_view(security, kid_id, run_id, active)


@router.get('/kid/runs/{run_id}/frame')
def run_frame(run_id: str, request: Request):
    security, kid_id, active = kid_context(request)
    html, headers = service.run_frame(security, kid_id, run_id, active)
    return Response(content=html, headers=headers)


@router.post('/kid/runs/{run_id}/finish')
def finish(run_id: str, body: FinishRequest, request: Request):
    security, kid_id, active = kid_context(request)
    return service.finish(security, kid_id, run_id, body, active)


@router.get('/parent/{kid_id}/history')
def history(kid_id: str, request: Request):
    return service.history(get_security(request), kid_id, require_parent(request))


@router.get('/review/me')
def reviewer(request: Request):
    return service.is_reviewer(get_security(request), require_parent(request))


@router.get('/review')
def review_list(request: Request):
    return service.review_list(get_security(request), require_parent(request))


@router.get('/review/{version_id}')
def review_detail(version_id: str, request: Request):
    return service.review_detail(get_security(request), version_id, require_parent(request))


@router.get('/review/{version_id}/frame')
def review_frame(version_id: str, request: Request, seed: int | None = None):
    html, headers = service.review_frame(get_security(request), version_id, require_parent(request), seed)
    return Response(content=html, headers=headers)


@router.post('/review/{version_id}/decision')
def decide(version_id: str, body: DecisionRequest, request: Request):
    return service.decide(get_security(request), version_id, body, require_parent(request))
