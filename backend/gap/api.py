"""Homework observations use the existing account, PIN, and CSRF boundary."""
from fastapi import APIRouter, Request

from backend.accounts.security import AccountError, get_security, require_parent, require_session
from .models import ParentDashboardView
from . import service

router = APIRouter(prefix='/api/learning')


def removed():
    raise AccountError('feature_removed', 'Standalone checks and practice have been removed. Your homework observations remain available.', 410)


def retired_kid_context(request):
    active = require_session(request)
    if active.mode != 'kid' or not active.active_kid_profile_id:
        raise AccountError('kid_required', 'Choose a child profile to continue.', 403)
    security = get_security(request)
    with security.db.transaction() as conn:
        service.authorize(security, conn, active.active_kid_profile_id, active, 'kid')


def retired_parent_context(request, kid_id):
    active = require_parent(request)
    security = get_security(request)
    with security.db.transaction() as conn:
        service.authorize(security, conn, kid_id, active, 'parent')


@router.get('/parent/{kid_id}/dashboard', response_model=ParentDashboardView)
def dashboard(kid_id: str, request: Request):
    active = require_parent(request)
    return service.parent_dashboard(get_security(request), active.account_id, kid_id, expected_session=active)


@router.post('/kid/next')
@router.post('/kid/submit')
@router.post('/kid/session/{session_id}/activity')
def retired_kid_workflow(request: Request, session_id: str | None = None):
    retired_kid_context(request)
    removed()


@router.post('/parent/{kid_id}/extra-practice')
@router.get('/parent/{kid_id}/adult')
@router.post('/parent/{kid_id}/adult/submit')
def retired_parent_workflow(kid_id: str, request: Request):
    retired_parent_context(request, kid_id)
    removed()
