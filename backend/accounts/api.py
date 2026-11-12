"""FastAPI routes for account-owned profiles and session-scoped parent access."""
import sqlite3
import uuid
from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

from .models import (
    ChangePin, ChooseKid, ConversationView, Credentials, CsrfView, DashboardView,
    GateView, KidInput, KidView, OkView, PasswordChange, PickerKid, PickerView,
    Pin, ProfilesView, SessionView, SettingsView, SetupPin,
)
from .samples import get_conversation, get_dashboard
from backend.gap.models import ParentDashboardView
from backend.gap.service import parent_dashboard
from .security import AccountError, digest, get_security, kid_view, require_kid, require_parent, require_session

router = APIRouter(prefix='/api')
PUBLIC = {'/api/health', '/api/auth/csrf', '/api/auth/signup', '/api/auth/login', '/api/auth/recovery'}


class SessionSecurityMiddleware:
    """Stateful CSRF before handlers; no caching of account or worksheet responses."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http' or not scope.get('path', '').startswith('/api/'):
            return await self.app(scope, receive, send)
        request = Request(scope)
        try:
            security = get_security(request)
            if scope['path'] != '/api/health':
                security.db.assert_migrated()
            if scope['method'] in {'POST', 'PUT', 'PATCH', 'DELETE'}:
                security.validate_csrf(request)
            elif scope['path'] == '/api/auth/csrf' and request.headers.get('origin') and request.headers['origin'] not in security.settings.trusted_origins:
                raise AccountError('csrf_failed', 'This request could not be verified. Refresh the page and try again.', 403)
            if scope['path'] not in PUBLIC and scope['method'] != 'OPTIONS':
                require_session(request)
            # Bound JSON/auth input separately from the existing multipart image cap.
            if scope['method'] in {'POST', 'PUT', 'PATCH', 'DELETE'} and scope['path'] not in {'/api/extract', '/api/images/preview'} and not scope['path'].endswith('/uploads'):
                body = bytearray()
                while True:
                    message = await receive()
                    if message['type'] == 'http.disconnect':
                        return
                    body.extend(message.get('body', b''))
                    if len(body) > 65536:
                        raise AccountError('request_too_large', 'This request is too large.', 413)
                    if not message.get('more_body', False):
                        break
                delivered = False
                original_receive = receive
                async def receive_body():
                    nonlocal delivered
                    if not delivered:
                        delivered = True
                        return {'type': 'http.request', 'body': bytes(body), 'more_body': False}
                    return await original_receive()
                receive = receive_body
        except AccountError as exc:
            return await JSONResponse({'error': {'code': exc.code, 'message': exc.message}}, status_code=exc.status, headers={'Cache-Control': 'no-store'})(scope, receive, send)

        async def no_store(message):
            if message['type'] == 'http.response.start':
                headers = [(key, value) for key, value in message.get('headers', []) if key.lower() != b'cache-control']
                message['headers'] = headers + [(b'cache-control', b'no-store'), (b'vary', b'Cookie')]
            await send(message)
        await self.app(scope, receive, no_store)


@router.get('/auth/csrf', response_model=CsrfView)
def csrf(request: Request, response: Response):
    return CsrfView(csrfToken=get_security(request).csrf(request, response))


@router.get('/auth/recovery')
def recovery():
    # TODO: email delivery and verified password recovery before pilot.
    return {'message': 'Email password recovery is coming soon. Contact the parent who owns this account.'}


def revoke_current(connection, request, security):
    token = request.cookies.get(security.settings.session_cookie)
    if token:
        connection.execute('UPDATE sessions SET revoked_at=? WHERE token_digest=?', (security.clock.now(), digest(token)))


@router.post('/auth/signup', response_model=SessionView, status_code=201)
def signup(body: Credentials, request: Request, response: Response):
    security = get_security(request)
    email = security.normalize_email(body.email)
    security.validate_password(body.password)
    password_hash = security.hash_secret(body.password)
    try:
        with security.db.transaction() as connection:
            security.rate_limit(connection, 'signup', request.client.host if request.client else 'local', 20)
            account_id = uuid.uuid4().hex
            connection.execute('INSERT INTO accounts(id,email,password_hash,created_at) VALUES (?,?,?,?)', (account_id, email, password_hash, security.clock.now()))
            revoke_current(connection, request, security)
            token = security.new_session(connection, account_id)
    except sqlite3.IntegrityError:
        raise AccountError('email_exists', 'An account with this email already exists.', 409) from None
    return security.install_session(request, response, token)


@router.post('/auth/login', response_model=SessionView)
def login(body: Credentials, request: Request, response: Response):
    security = get_security(request)
    try:
        email = security.normalize_email(body.email)
    except AccountError:
        email = body.email.strip().casefold()
    valid = False
    with security.db.transaction() as connection:
        security.rate_limit(connection, 'login-email', email, 10)
        security.rate_limit(connection, 'login-ip', request.client.host if request.client else 'local', 40)
        account = connection.execute('SELECT * FROM accounts WHERE email=?', (email,)).fetchone()
        valid = security.verify_secret(account['password_hash'] if account else None, body.password)
        if account and valid:
            if security.hasher.check_needs_rehash(account['password_hash']):
                connection.execute('UPDATE accounts SET password_hash=? WHERE id=?', (security.hash_secret(body.password), account['id']))
            revoke_current(connection, request, security)
            token = security.new_session(connection, account['id'])
    if not account or not valid:
        raise AccountError('invalid_credentials', 'Email or password is incorrect.', 401)
    return security.install_session(request, response, token)


@router.get('/auth/session', response_model=SessionView)
def session(request: Request):
    security = get_security(request)
    return security.session_view(require_session(request))


@router.post('/auth/logout', response_model=OkView)
def logout(request: Request, response: Response):
    security = get_security(request)
    active = require_session(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        connection.execute('UPDATE sessions SET revoked_at=? WHERE token_digest=?', (security.clock.now(), active.token_digest))
        connection.execute('DELETE FROM csrf_tokens WHERE session_digest=?', (active.token_digest,))
    response.delete_cookie(security.settings.session_cookie, path='/', secure=security.settings.cookie_secure, httponly=True, samesite='lax')
    response.delete_cookie(security.settings.csrf_cookie, path='/', secure=security.settings.cookie_secure, httponly=True, samesite='lax')
    return OkView()


@router.post('/auth/password', response_model=SessionView)
def password_change(body: PasswordChange, request: Request, response: Response):
    security = get_security(request)
    active = require_parent(request)
    security.validate_password(body.newPassword)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        valid = security.account_password(connection, active.account_id, body.currentPassword)
        if valid:
            connection.execute('UPDATE accounts SET password_hash=? WHERE id=?', (security.hash_secret(body.newPassword), active.account_id))
            connection.execute('UPDATE sessions SET revoked_at=? WHERE account_id=? AND revoked_at IS NULL', (security.clock.now(), active.account_id))
            token = security.new_session(connection, active.account_id)
    if not valid:
        raise AccountError('invalid_password', 'The account password is incorrect.', 401)
    return security.install_session(request, response, token)


@router.get('/profiles', response_model=PickerView)
def picker_profiles(request: Request):
    security = get_security(request)
    active = require_session(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        rows = connection.execute('SELECT id,first_name,avatar_key FROM kid_profiles WHERE account_id=? ORDER BY created_at,id', (active.account_id,)).fetchall()
    return PickerView(profiles=[PickerKid(id=row['id'], firstName=row['first_name'], avatarKey=row['avatar_key']) for row in rows])


@router.post('/session/picker', response_model=SessionView)
def select_picker(request: Request):
    security = get_security(request)
    active = require_session(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        connection.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,parent_last_activity_at=NULL,parent_expires_at=NULL,version=version+1 WHERE token_digest=?", (active.token_digest,))
    return security.session_view(require_session(request))


@router.post('/session/kid', response_model=SessionView)
def select_kid(body: ChooseKid, request: Request):
    security = get_security(request)
    active = require_session(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        security.owned_kid(connection, active.account_id, body.profileId)
        connection.execute("UPDATE sessions SET mode='kid',active_kid_profile_id=?,parent_last_activity_at=NULL,parent_expires_at=NULL,version=version+1 WHERE token_digest=?", (body.profileId, active.token_digest))
    return security.session_view(require_session(request))


@router.get('/parent/gate', response_model=GateView)
def parent_gate(request: Request):
    security = get_security(request)
    active = require_session(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        account = connection.execute('SELECT parent_pin_hash,pin_locked_until FROM accounts WHERE id=?', (active.account_id,)).fetchone()
    locked = account['pin_locked_until']
    return GateView(pinSetupRequired=account['parent_pin_hash'] is None, lockedUntil=locked if locked and locked > security.clock.now() else None)


def check_pin_confirmation(body):
    if body.pin != body.confirmPin:
        raise AccountError('pin_mismatch', 'The two PINs do not match.')


def replace_pin(body: SetupPin, request: Request, initial: bool):
    security = get_security(request)
    active = require_session(request)
    check_pin_confirmation(body)
    already_set = False
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        account = connection.execute('SELECT * FROM accounts WHERE id=?', (active.account_id,)).fetchone()
        already_set = initial and account['parent_pin_hash'] is not None
        valid = security.account_password(connection, active.account_id, body.password)
        if valid and not already_set:
            connection.execute('UPDATE accounts SET parent_pin_hash=?,failed_pin_attempts=0,pin_locked_until=NULL WHERE id=?', (security.hash_secret(body.pin), active.account_id))
            security.invalidate_parent_unlocks(connection, active.account_id)
            connection.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,parent_last_activity_at=NULL,parent_expires_at=NULL,version=version+1 WHERE token_digest=?", (active.token_digest,))
    if not valid:
        raise AccountError('invalid_password', 'The account password is incorrect.', 401)
    if already_set:
        raise AccountError('pin_already_set', 'A parent PIN already exists. Use Forgot PIN to reset it.', 409)
    return security.session_view(require_session(request))


@router.post('/parent/pin/setup', response_model=SessionView)
def setup_pin(body: SetupPin, request: Request):
    return replace_pin(body, request, True)


@router.post('/parent/pin/reset', response_model=SessionView)
def reset_pin(body: SetupPin, request: Request):
    return replace_pin(body, request, False)


def verify_account_pin(security, connection, account_id, pin):
    account = connection.execute('SELECT * FROM accounts WHERE id=?', (account_id,)).fetchone()
    now = security.clock.now()
    if account['parent_pin_hash'] is None:
        return AccountError('pin_not_set', 'Set up a parent PIN first.', 409)
    if account['pin_locked_until'] and account['pin_locked_until'] > now:
        return AccountError('pin_locked', 'Too many incorrect PINs. Try again in five minutes.', 429)
    if security.verify_secret(account['parent_pin_hash'], pin):
        connection.execute('UPDATE accounts SET failed_pin_attempts=0,pin_locked_until=NULL WHERE id=?', (account_id,))
        return None
    failures = 1 if account['pin_locked_until'] else account['failed_pin_attempts'] + 1
    locked_until = now + security.settings.pin_lock_seconds if failures >= 5 else None
    connection.execute('UPDATE accounts SET failed_pin_attempts=?,pin_locked_until=? WHERE id=?', (failures, locked_until, account_id))
    return AccountError('pin_locked' if locked_until else 'invalid_pin', 'Too many incorrect PINs. Try again in five minutes.' if locked_until else 'That PIN is incorrect.', 429 if locked_until else 401)


@router.post('/parent/pin/verify', response_model=SessionView)
def verify_pin(body: Pin, request: Request):
    security = get_security(request)
    active = require_session(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active)
        error = verify_account_pin(security, connection, active.account_id, body.pin)
        if error is None:
            now = security.clock.now()
            connection.execute("UPDATE sessions SET mode='parent',active_kid_profile_id=NULL,parent_last_activity_at=?,parent_expires_at=?,version=version+1 WHERE token_digest=?", (now, now + security.settings.parent_idle_seconds, active.token_digest))
    if error:
        raise error
    return security.session_view(require_session(request))


@router.post('/parent/pin/change', response_model=SessionView)
def change_pin(body: ChangePin, request: Request):
    security = get_security(request)
    active = require_parent(request)
    check_pin_confirmation(body)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        error = verify_account_pin(security, connection, active.account_id, body.currentPin)
        if error is None:
            connection.execute('UPDATE accounts SET parent_pin_hash=?,failed_pin_attempts=0,pin_locked_until=NULL WHERE id=?', (security.hash_secret(body.pin), active.account_id))
            security.invalidate_parent_unlocks(connection, active.account_id)
    if error:
        raise error
    return security.session_view(require_session(request))


@router.post('/parent/activity', response_model=SessionView)
def parent_activity(request: Request):
    security = get_security(request)
    active = require_parent(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        # Recheck inside the write transaction so expiry cannot be revived by a race.
        now = security.clock.now()
        changed = connection.execute("UPDATE sessions SET parent_last_activity_at=?,parent_expires_at=? WHERE token_digest=? AND mode='parent' AND parent_expires_at>? AND revoked_at IS NULL", (now, now + security.settings.parent_idle_seconds, active.token_digest, now)).rowcount
    if not changed:
        raise AccountError('parent_required', 'Enter your parent PIN to continue.', 403)
    return security.session_view(require_session(request))


@router.get('/parent/settings', response_model=SettingsView)
def parent_settings(request: Request):
    security = get_security(request)
    active = require_parent(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        account = connection.execute('SELECT email FROM accounts WHERE id=?', (active.account_id,)).fetchone()
    return SettingsView(email=account['email'])


@router.get('/parent/profiles', response_model=ProfilesView)
def parent_profiles(request: Request):
    security = get_security(request)
    active = require_parent(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        rows = connection.execute('SELECT * FROM kid_profiles WHERE account_id=? ORDER BY created_at,id', (active.account_id,)).fetchall()
    return ProfilesView(profiles=[kid_view(row) for row in rows])


@router.post('/parent/profiles', response_model=KidView, status_code=201)
def create_profile(body: KidInput, request: Request):
    security = get_security(request)
    active = require_parent(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        if connection.execute('SELECT COUNT(*) FROM kid_profiles WHERE account_id=?', (active.account_id,)).fetchone()[0] >= 6:
            raise AccountError('profile_limit', 'You can add up to six child profiles.', 409)
        profile_id = uuid.uuid4().hex
        connection.execute('INSERT INTO kid_profiles VALUES (?,?,?,?,?,?)', (profile_id, active.account_id, body.firstName, body.grade, body.avatarKey, security.clock.now()))
        profile = security.owned_kid(connection, active.account_id, profile_id)
    return kid_view(profile)


@router.patch('/parent/profiles/{profile_id}', response_model=KidView)
def edit_profile(profile_id: str, body: KidInput, request: Request):
    security = get_security(request)
    active = require_parent(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        security.owned_kid(connection, active.account_id, profile_id)
        connection.execute('UPDATE kid_profiles SET first_name=?,grade=?,avatar_key=? WHERE id=? AND account_id=?', (body.firstName, body.grade, body.avatarKey, profile_id, active.account_id))
        # Invalidate the child snapshot in other tabs without granting any new access.
        connection.execute('UPDATE sessions SET version=version+1 WHERE active_kid_profile_id=?', (profile_id,))
        profile = security.owned_kid(connection, active.account_id, profile_id)
    return kid_view(profile)


@router.delete('/parent/profiles/{profile_id}', response_model=OkView)
def delete_profile(profile_id: str, request: Request):
    security = get_security(request)
    active = require_parent(request)
    with security.db.transaction() as connection:
        security.assert_active(connection, active, 'parent')
        security.owned_kid(connection, active.account_id, profile_id)
        from backend.gap.storage import private_refs_for_child
        file_refs = private_refs_for_child(connection, profile_id)
        connection.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,parent_last_activity_at=NULL,parent_expires_at=NULL,version=version+1 WHERE active_kid_profile_id=?", (profile_id,))
        connection.execute('DELETE FROM kid_profiles WHERE id=? AND account_id=?', (profile_id, active.account_id))
    from backend.gap.storage import cleanup_references
    cleanup_references(security, file_refs)
    return OkView()


@router.get('/parent/dashboard/{profile_id}', response_model=ParentDashboardView)
def dashboard(profile_id: str, request: Request):
    security = get_security(request)
    active = require_parent(request)
    return parent_dashboard(security, active.account_id, profile_id, expected_session=active)


@router.get('/parent/conversations/{profile_id}/{conversation_id}', response_model=ConversationView)
def conversation(profile_id: str, conversation_id: str, request: Request):
    security = get_security(request)
    active = require_parent(request)
    return get_conversation(security, active.account_id, profile_id, conversation_id, expected_session=active)


@router.get('/kid/profile/{profile_id}', response_model=KidView)
def child_profile(profile_id: str, request: Request):
    profile = require_kid(request)
    if profile.id != profile_id:
        raise AccountError('kid_required', 'Choose this child profile before viewing its information.', 403)
    return profile
