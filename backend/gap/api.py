"""Learning routes reuse the existing session, parent PIN, and CSRF boundary."""
from fastapi import APIRouter, Request
from backend.accounts.security import AccountError, get_security, require_parent, require_session
from .models import Activity, AdultSubmit, ExtraPractice, ParentDashboardView, Submit
from . import service

router = APIRouter(prefix='/api/learning')


def kid_context(request):
    active = require_session(request)
    if active.mode != 'kid' or not active.active_kid_profile_id:
        raise AccountError('kid_required', 'Choose a child profile to continue.', 403)
    return get_security(request), active.active_kid_profile_id, active


@router.post('/kid/next')
async def next_practice(request: Request):
    return await service.get_next_practice(*kid_context(request), adapter=getattr(request.app.state, 'gap_adapter', None))


@router.post('/kid/submit')
async def submit(body: Submit, request: Request):
    security, kid_id, active = kid_context(request)
    return await service.submit_response(security, kid_id, body, active, adapter=getattr(request.app.state, 'gap_adapter', None))


@router.post('/kid/session/{session_id}/activity')
def activity(session_id: str, body: Activity, request: Request):
    security, kid_id, active = kid_context(request)
    return service.record_activity(security, kid_id, session_id, body, active)


@router.get('/parent/{kid_id}/dashboard', response_model=ParentDashboardView)
def dashboard(kid_id: str, request: Request):
    active = require_parent(request)
    return service.parent_dashboard(get_security(request), active.account_id, kid_id, expected_session=active)


@router.post('/parent/{kid_id}/extra-practice')
async def extra_practice(kid_id: str, body: ExtraPractice, request: Request):
    return await service.extra_practice(get_security(request), kid_id, body.subskillId, require_parent(request), adapter=getattr(request.app.state, 'gap_adapter', None))


@router.get('/parent/{kid_id}/adult')
async def adult_queue(kid_id: str, request: Request):
    return await service.adult_queue(get_security(request), kid_id, require_parent(request))


@router.post('/parent/{kid_id}/adult/submit')
async def adult_submit(kid_id: str, body: AdultSubmit, request: Request):
    return await service.submit_response(get_security(request), kid_id, body, require_parent(request), adult=True)
