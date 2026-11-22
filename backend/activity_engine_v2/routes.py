"""Development-only owned shared-workspace sessions, using existing CSRF middleware."""
import os
from typing import Annotated

from fastapi import APIRouter, Request
from fastapi.routing import APIRoute
from pydantic import BaseModel, ConfigDict, Field, StrictInt, StrictStr

from backend.accounts.security import AccountError, get_security, require_session
from . import service

class PreviewRoute(APIRoute):
    """Bound nesting before the JSON decoder can recurse into private input."""
    def get_route_handler(self):
        original = super().get_route_handler()

        async def bounded(request):
            if request.method in {'POST', 'PUT', 'PATCH', 'DELETE'}:
                # Existing SessionSecurityMiddleware already bounds bytes at
                # 64KiB. This scan is linear and does not interpret body text.
                depth, quoted, escaped = 0, False, False
                for char in await request.body():
                    if quoted:
                        if escaped:
                            escaped = False
                        elif char == 92:
                            escaped = True
                        elif char == 34:
                            quoted = False
                    elif char == 34:
                        quoted = True
                    elif char in {91, 123}:
                        depth += 1
                        if depth > 16:
                            raise AccountError('request_nesting_exceeded', 'This request is too complex.', 400)
                    elif char in {93, 125}:
                        depth -= 1
            return await original(request)
        return bounded


router = APIRouter(prefix='/api/activity-programs', route_class=PreviewRoute)
RequestId = Annotated[str, Field(min_length=1, max_length=100, pattern=r'^[A-Za-z0-9_-]+$')]
InputName = Annotated[StrictStr, Field(min_length=1, max_length=80)]
InputValue = (Annotated[StrictInt, Field(ge=-1000000, le=1000000)]
              | Annotated[StrictStr, Field(max_length=4000)]
              | Annotated[list[Annotated[StrictStr, Field(max_length=80)]], Field(max_length=120)])


class Input(BaseModel):
    model_config = ConfigDict(extra='forbid')


class StartInput(Input):
    requestId: RequestId


class RevisionInput(Input):
    expectedRevision: Annotated[StrictInt, Field(ge=0, le=10000)]


class ActionInput(RevisionInput):
    requestId: RequestId
    actionId: Annotated[str, Field(min_length=1, max_length=80)]
    inputs: Annotated[dict[InputName, InputValue], Field(max_length=4)]


class HelpInput(RevisionInput):
    requestId: RequestId
    helpId: Annotated[str, Field(min_length=1, max_length=80)]


def kid_context(request):
    security = get_security(request)
    if (os.getenv('SIDEKICK_ACTIVITY_V2_PREVIEW', '').lower() != 'true'
            or security.settings.app_env not in {'development', 'test'}):
        raise AccountError('not_found', 'This page could not be found.', 404)
    active = require_session(request)
    if active.mode != 'kid' or not active.active_kid_profile_id:
        raise AccountError('kid_required', 'Choose a child profile to continue.', 403)
    supplied = request.headers.get('X-Sidekick-Profile-Version')
    if request.method in {'POST', 'PUT', 'PATCH', 'DELETE'} and supplied is None:
        raise AccountError('profile_version_required', 'Refresh the page and try again.', 409)
    if supplied is not None and supplied != str(active.version):
        raise AccountError('profile_changed', 'Your profile changed. Refresh the page and try again.', 409)
    return security, active.active_kid_profile_id, active


@router.get('/preview')
def previews(request: Request):
    return service.previews(*kid_context(request))


@router.post('/preview/{program_key}/sessions')
def start(program_key: str, body: StartInput, request: Request):
    security, kid_id, active = kid_context(request)
    return service.start(security, kid_id, program_key, body.requestId, active)


@router.get('/sessions/{session_id}')
def session(session_id: str, request: Request):
    security, kid_id, active = kid_context(request)
    return service.session_view(security, kid_id, session_id, active)


@router.post('/sessions/{session_id}/actions')
def action(session_id: str, body: ActionInput, request: Request):
    security, kid_id, active = kid_context(request)
    return service.mutate(security, kid_id, session_id, 'action', body.model_dump(), active)


@router.post('/sessions/{session_id}/help')
def help_item(session_id: str, body: HelpInput, request: Request):
    security, kid_id, active = kid_context(request)
    return service.mutate(security, kid_id, session_id, 'help', body.model_dump(), active)


@router.post('/sessions/{session_id}/replay')
def replay(session_id: str, body: RevisionInput, request: Request):
    security, kid_id, active = kid_context(request)
    return service.replay(security, kid_id, session_id, body.expectedRevision, active)
