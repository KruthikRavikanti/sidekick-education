"""Account authorization journeys, real persistent sessions, and adversarial transitions."""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
import hashlib
import sqlite3

import pytest
from fastapi.testclient import TestClient

from backend import main
from backend.tests.account_helpers import (
    PASSWORD, PIN, create_child, csrf, login, mutate, picker, select_child,
    setup_pin, signup, unlock,
)


def assert_error(response, status, message=None):
    assert response.status_code == status, response.text
    assert set(response.json()) == {"error"}
    assert set(response.json()["error"]) == {"code", "message"}
    if message:
        assert response.json()["error"]["message"] == message


def session(client):
    response = client.get("/api/auth/session")
    assert response.status_code == 200, response.text
    assert response.headers["cache-control"] == "no-store"
    return response.json()


def clone(client_factory, source):
    client = client_factory()
    client.cookies.update(source.cookies)
    return client


def child(client, **kwargs):
    response = create_child(client, **kwargs)
    assert response.status_code in (200, 201), response.text
    return response.json()


def test_signup_email_normalization_uniqueness_and_minimal_picker(raw_client, client_factory):
    response = signup(raw_client, email="  PARENT@Example.com  ")
    assert response.status_code in (200, 201), response.text
    assert response.json()["mode"] == "picker"
    assert response.json()["activeKidProfileId"] is None
    assert response.json()["activeKid"] is None
    assert "email" not in response.text and "hash" not in response.text.lower()
    assert raw_client.get("/api/profiles").json() == {"profiles": []}
    duplicate = signup(client_factory(), email="parent@example.com")
    assert_error(duplicate, 409)
    assert raw_client.get("/api/parent/gate").json()["pinSetupRequired"] is True


def test_generic_login_failures_and_fresh_sessions(raw_client, client_factory):
    assert signup(raw_client).status_code in (200, 201)
    original = raw_client.cookies.get("sidekick_session")
    other = client_factory()
    for email, password in [("missing@example.com", PASSWORD), ("parent@example.com", "incorrect"), ("not-an-email", PASSWORD)]:
        response = login(other, email=email, password=password)
        assert_error(response, 401, "Email or password is incorrect.")
    response = login(other, email="PARENT@EXAMPLE.COM")
    assert response.status_code == 200
    assert response.json()["mode"] == "picker"
    assert other.cookies.get("sidekick_session") != original
    assert len(other.cookies.get("sidekick_session")) >= 40


def test_login_rate_limit_is_persisted_across_browser_sessions(raw_client, client_factory):
    assert signup(raw_client).status_code in (200, 201)
    for _ in range(10):
        response = login(client_factory(), password="incorrect")
        assert response.status_code in (401, 429)
    assert_error(login(client_factory()), 429)


def test_account_cookie_security_and_thirty_day_expiry(raw_client, clock):
    response = signup(raw_client)
    cookie = next(value for value in response.headers.get_list("set-cookie") if value.startswith("sidekick_session="))
    assert "HttpOnly" in cookie
    assert "SameSite=" in cookie or "samesite=" in cookie.lower()
    assert "Max-Age=2592000" in cookie or "max-age=2592000" in cookie.lower()
    clock.advance(30 * 24 * 3600 - 1)
    assert raw_client.get("/api/auth/session").status_code == 200
    clock.advance(2)
    assert_error(raw_client.get("/api/auth/session"), 401)


def test_pin_setup_requires_password_confirmation_and_digit_string(raw_client):
    assert signup(raw_client).status_code in (200, 201)
    assert_error(setup_pin(raw_client, password="incorrect"), 401)
    for pin, confirm in [("123", "123"), ("1234567", "1234567"), ("12ab", "12ab"), ("0042", "0043")]:
        response = mutate(raw_client, "POST", "/api/parent/pin/setup", json={"password": PASSWORD, "pin": pin, "confirmPin": confirm})
        assert response.status_code in (400, 422), response.text
    assert setup_pin(raw_client, pin="0042").status_code == 200
    assert session(raw_client)["mode"] == "picker"
    assert_error(raw_client.get("/api/parent/settings"), 403)
    assert unlock(raw_client, pin="0042").status_code == 200
    assert session(raw_client)["mode"] == "parent"
    assert_error(setup_pin(raw_client), 409)


def test_account_level_pin_lockout_survives_new_login_and_clears_after_clock_window(parent_client, client_factory, clock):
    assert picker(parent_client).status_code == 200
    for _ in range(4):
        assert_error(unlock(parent_client, "9999"), 401)
    fresh = client_factory()
    assert login(fresh).status_code == 200
    assert_error(unlock(fresh, "9999"), 429)
    assert_error(unlock(parent_client), 429)
    locked = fresh.get("/api/parent/gate").json()["lockedUntil"]
    assert locked > clock.now()
    clock.advance(299)
    assert_error(unlock(fresh), 429)
    clock.advance(2)
    assert unlock(fresh).status_code == 200
    assert picker(fresh).status_code == 200
    assert_error(unlock(fresh, "9999"), 401)
    assert fresh.get("/api/parent/gate").json()["lockedUntil"] is None


def test_concurrent_pin_failures_cannot_bypass_five_attempt_lock(parent_client, client_factory):
    picker(parent_client)
    clients = [clone(client_factory, parent_client) for _ in range(5)]
    with ThreadPoolExecutor(max_workers=5) as pool:
        responses = list(pool.map(lambda client: unlock(client, "9999"), clients))
    assert all(response.status_code in (401, 429) for response in responses)
    assert sum(response.status_code == 401 for response in responses) <= 4
    assert_error(unlock(parent_client), 429)


def test_parent_authorization_is_session_scoped_and_gets_do_not_extend_idle(parent_client, client_factory, clock):
    second = client_factory()
    assert login(second).status_code == 200
    assert_error(second.get("/api/parent/settings"), 403)
    initial = session(parent_client)["parentExpiresAt"]
    assert initial == pytest.approx(clock.now() + 1800)
    clock.advance(900)
    assert parent_client.get("/api/parent/settings").status_code == 200
    assert parent_client.get("/api/parent/gate").status_code == 200
    assert session(parent_client)["parentExpiresAt"] == initial
    clock.advance(901)
    assert_error(parent_client.get("/api/parent/settings"), 403)
    assert session(parent_client)["mode"] == "picker"
    assert session(parent_client)["activeKidProfileId"] is None
    assert unlock(parent_client).status_code == 200


def test_explicit_parent_interaction_extends_idle_deadline(parent_client, clock):
    initial = session(parent_client)["parentExpiresAt"]
    clock.advance(1700)
    response = mutate(parent_client, "POST", "/api/parent/activity")
    assert response.status_code == 200
    extended = session(parent_client)["parentExpiresAt"]
    assert extended > initial
    assert extended == pytest.approx(clock.now() + 1800)
    clock.advance(1799)
    assert parent_client.get("/api/parent/settings").status_code == 200
    clock.advance(2)
    assert_error(mutate(parent_client, "POST", "/api/parent/activity"), 403)


def test_profile_transitions_lock_parent_on_server_and_shared_tabs(parent_client, client_factory):
    alex = child(parent_client, name="Alex")
    maya = child(parent_client, name="Maya", avatar="owl")
    shared_tab = clone(client_factory, parent_client)
    assert select_child(parent_client, alex["id"]).status_code == 200
    state = session(shared_tab)
    assert state["mode"] == "kid" and state["activeKidProfileId"] == alex["id"]
    assert state["parentExpiresAt"] is None
    assert_error(shared_tab.get("/api/parent/settings"), 403)
    assert_error(shared_tab.get(f"/api/parent/dashboard/{alex['id']}"), 403)
    assert select_child(shared_tab, maya["id"]).status_code == 200
    assert session(parent_client)["activeKidProfileId"] == maya["id"]
    assert picker(shared_tab).status_code == 200
    state = session(parent_client)
    assert state["mode"] == "picker" and state["activeKidProfileId"] is None and state["activeKid"] is None
    assert state["parentExpiresAt"] is None


def test_kid_endpoints_allow_only_active_owned_child_and_picker_is_minimal(parent_client, client_factory):
    alex = child(parent_client)
    maya = child(parent_client, name="Maya", avatar="owl")
    other = client_factory()
    assert signup(other, email="other@example.com").status_code in (200, 201)
    setup_pin(other)
    unlock(other)
    foreign = child(other, name="Foreign")
    assert_error(select_child(parent_client, foreign["id"]), 404)
    assert select_child(parent_client, alex["id"]).status_code == 200
    allowed = parent_client.get(f"/api/kid/profile/{alex['id']}")
    assert allowed.status_code == 200
    assert set(allowed.json()) == {"id", "firstName", "grade", "avatarKey"}
    assert_error(parent_client.get(f"/api/kid/profile/{maya['id']}"), 403)
    assert_error(parent_client.get(f"/api/kid/profile/{foreign['id']}"), 403)
    profiles = parent_client.get("/api/profiles").json()["profiles"]
    assert len(profiles) == 2
    assert all(set(profile) == {"id", "firstName", "avatarKey"} for profile in profiles)
    assert "email" not in parent_client.get("/api/auth/session").text
    assert_error(parent_client.get(f"/api/parent/dashboard/{alex['id']}"), 403)


def test_parent_ownership_checks_cover_dashboard_transcripts_and_crud(parent_client, client_factory):
    other = client_factory()
    signup(other, email="other@example.com")
    setup_pin(other)
    unlock(other)
    foreign = child(other)
    assert_error(parent_client.get(f"/api/parent/dashboard/{foreign['id']}"), 404)
    assert_error(parent_client.get(f"/api/parent/conversations/{foreign['id']}/sample-1"), 404)
    assert_error(mutate(parent_client, "PATCH", f"/api/parent/profiles/{foreign['id']}", json={"firstName": "Stolen", "grade": "2", "avatarKey": "fox"}), 404)
    assert_error(mutate(parent_client, "DELETE", f"/api/parent/profiles/{foreign['id']}"), 404)


def test_profile_validation_edit_and_six_profile_limit(parent_client):
    for values in [dict(name="", grade="3", avatar="fox"), dict(name="Alex", grade="6", avatar="fox"), dict(name="Alex", grade="K", avatar="url:https://example.com")]:
        response = create_child(parent_client, **values)
        assert response.status_code in (400, 422), response.text
    profiles = [child(parent_client, name=f"Kid {number}") for number in range(6)]
    assert_error(create_child(parent_client, name="Seventh"), 409)
    update = mutate(parent_client, "PATCH", f"/api/parent/profiles/{profiles[0]['id']}", json={"firstName": "Nickname", "grade": "K", "avatarKey": "panda"})
    assert update.status_code == 200
    assert update.json()["firstName"] == "Nickname"
    assert update.json()["grade"] == "K"


def test_profile_limit_is_atomic_under_concurrent_requests(parent_client, client_factory):
    for number in range(5):
        child(parent_client, name=f"Kid {number}")
    clients = [clone(client_factory, parent_client) for _ in range(3)]
    with ThreadPoolExecutor(max_workers=3) as pool:
        responses = list(pool.map(lambda pair: create_child(pair[1], name=f"Concurrent {pair[0]}"), enumerate(clients)))
    assert sum(response.status_code in (200, 201) for response in responses) == 1
    assert all(response.status_code in (200, 201, 409) for response in responses)
    assert len(parent_client.get("/api/profiles").json()["profiles"]) == 6


@pytest.mark.parametrize("transition,expected_status", [("switch", 403), ("expire", 403), ("revoke", 401)])
def test_parent_mutation_rechecks_authorization_inside_its_transaction(
    parent_client, security_context, clock, monkeypatch, transition, expected_status,
):
    from backend.accounts import api

    require_parent = api.require_parent

    def transition_after_initial_authorization(request):
        active = require_parent(request)
        if transition == "expire":
            clock.advance(1801)
        else:
            with security_context.db.transaction() as connection:
                if transition == "switch":
                    connection.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,parent_last_activity_at=NULL,parent_expires_at=NULL,version=version+1 WHERE token_digest=?", (active.token_digest,))
                else:
                    connection.execute("UPDATE sessions SET revoked_at=? WHERE token_digest=?", (clock.now(), active.token_digest))
        return active

    monkeypatch.setattr(api, "require_parent", transition_after_initial_authorization)
    response = create_child(parent_client, name="Must not be inserted")
    assert_error(response, expected_status)
    with sqlite3.connect(security_context.db.path) as connection:
        assert connection.execute("SELECT COUNT(*) FROM kid_profiles").fetchone()[0] == 0


@pytest.mark.parametrize("view", ["dashboard", "conversation"])
@pytest.mark.parametrize("transition,expected_status", [("switch", 403), ("expire", 403), ("revoke", 401)])
def test_parent_learning_reads_cannot_return_data_after_authorization_changes(
    parent_client, security_context, clock, monkeypatch, view, transition, expected_status,
):
    from backend.accounts import api

    profile = child(parent_client)
    require_parent = api.require_parent

    def transition_after_initial_authorization(request):
        active = require_parent(request)
        if transition == "expire":
            clock.advance(1801)
        else:
            with security_context.db.transaction() as connection:
                if transition == "switch":
                    connection.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,parent_last_activity_at=NULL,parent_expires_at=NULL,version=version+1 WHERE token_digest=?", (active.token_digest,))
                else:
                    connection.execute("UPDATE sessions SET revoked_at=? WHERE token_digest=?", (clock.now(), active.token_digest))
        return active

    monkeypatch.setattr(api, "require_parent", transition_after_initial_authorization)
    path = f"/api/parent/dashboard/{profile['id']}" if view == "dashboard" else f"/api/parent/conversations/{profile['id']}/{profile['id']}-sample-1"
    response = parent_client.get(path)
    assert_error(response, expected_status)
    assert all(field not in response.json() for field in ("skills", "analytics", "conversations", "messages", "profile"))


def test_kid_profile_read_rechecks_selected_child_before_returning_sibling_information(
    parent_client, security_context, monkeypatch,
):
    alex = child(parent_client, name="Alex", grade="3")
    maya = child(parent_client, name="Maya", grade="1", avatar="owl")
    assert select_child(parent_client, alex["id"]).status_code == 200
    path = f"/api/kid/profile/{alex['id']}"
    original_session = security_context.session
    calls = 0

    def session_then_switch(request):
        nonlocal calls
        active = original_session(request)
        if request.url.path == path:
            calls += 1
            # Middleware checks first; the route then captures its own child snapshot.
            if calls == 2:
                with security_context.db.transaction() as connection:
                    connection.execute("UPDATE sessions SET active_kid_profile_id=?,version=version+1 WHERE token_digest=?", (maya["id"], active.token_digest))
        return active

    monkeypatch.setattr(security_context, "session", session_then_switch)
    response = parent_client.get(path)
    assert_error(response, 409)
    assert "firstName" not in response.json()
    assert session(parent_client)["activeKidProfileId"] == maya["id"]


def test_deleting_active_profile_clears_referencing_sessions(parent_client, client_factory):
    profile = child(parent_client)
    child_browser = client_factory()
    assert login(child_browser).status_code == 200
    assert select_child(child_browser, profile["id"]).status_code == 200
    response = mutate(parent_client, "DELETE", f"/api/parent/profiles/{profile['id']}")
    assert response.status_code in (200, 204)
    assert session(child_browser)["mode"] == "picker"
    assert session(child_browser)["activeKidProfileId"] is None
    assert_error(child_browser.get(f"/api/kid/profile/{profile['id']}"), 403)


def test_pin_reset_requires_password_and_invalidates_all_parent_unlocks(parent_client, client_factory):
    other = client_factory()
    login(other)
    unlock(other)
    assert_error(mutate(parent_client, "POST", "/api/parent/pin/reset", json={"password": "incorrect", "pin": "000123", "confirmPin": "000123"}), 401)
    assert session(parent_client)["mode"] == "parent"
    assert mutate(parent_client, "POST", "/api/parent/pin/reset", json={"password": PASSWORD, "pin": "000123", "confirmPin": "000123"}).status_code == 200
    for browser in (parent_client, other):
        assert session(browser)["mode"] == "picker"
        assert_error(browser.get("/api/parent/settings"), 403)
    assert_error(unlock(parent_client), 401)
    assert unlock(parent_client, "000123").status_code == 200


def test_password_verification_for_pin_reset_is_rate_limited(parent_client, client_factory):
    for _ in range(5):
        response = mutate(parent_client, "POST", "/api/parent/pin/reset", json={"password": "incorrect", "pin": "7777", "confirmPin": "7777"})
        assert response.status_code in (401, 429)
    fresh = client_factory()
    assert login(fresh).status_code == 200
    response = mutate(fresh, "POST", "/api/parent/pin/reset", json={"password": PASSWORD, "pin": "7777", "confirmPin": "7777"})
    assert_error(response, 429)


def test_pin_change_requires_current_pin_and_locks_all_sessions(parent_client, client_factory):
    other = client_factory()
    login(other)
    unlock(other)
    assert_error(mutate(parent_client, "POST", "/api/parent/pin/change", json={"currentPin": "9999", "pin": "2222", "confirmPin": "2222"}), 401)
    assert mutate(parent_client, "POST", "/api/parent/pin/change", json={"currentPin": PIN, "pin": "2222", "confirmPin": "2222"}).status_code == 200
    assert session(parent_client)["mode"] == "picker"
    assert session(other)["mode"] == "picker"
    assert_error(unlock(parent_client), 401)
    assert unlock(parent_client, "2222").status_code == 200


def test_password_change_verifies_current_password_rotates_cookie_and_revokes_old_sessions(parent_client, client_factory):
    other = client_factory()
    login(other)
    stale_copy = clone(client_factory, parent_client)
    old_cookie = parent_client.cookies.get("sidekick_session")
    assert_error(mutate(parent_client, "POST", "/api/auth/password", json={"currentPassword": "incorrect", "newPassword": "a-new-parent-password"}), 401)
    response = mutate(parent_client, "POST", "/api/auth/password", json={"currentPassword": PASSWORD, "newPassword": "a-new-parent-password"})
    assert response.status_code == 200
    assert parent_client.cookies.get("sidekick_session") != old_cookie
    assert session(parent_client)["mode"] == "picker"
    assert_error(other.get("/api/auth/session"), 401)
    assert_error(stale_copy.get("/api/auth/session"), 401)
    assert_error(login(client_factory()), 401, "Email or password is incorrect.")
    assert login(client_factory(), password="a-new-parent-password").status_code == 200
    # A revoked browser must be able to initialize fresh CSRF and log in again.
    assert login(other, password="a-new-parent-password").status_code == 200


def test_logout_revokes_server_session_and_clears_cookie(parent_client, client_factory):
    copy_of_session = clone(client_factory, parent_client)
    response = mutate(parent_client, "POST", "/api/auth/logout")
    assert response.status_code == 200
    assert parent_client.cookies.get("sidekick_session") is None
    assert_error(copy_of_session.get("/api/auth/session"), 401)
    assert_error(parent_client.get("/api/profiles"), 401)


def test_csrf_and_trusted_origin_required_even_for_authentication(raw_client):
    body = {"email": "parent@example.com", "password": PASSWORD}
    assert_error(raw_client.post("/api/auth/signup", json=body, headers={"Origin": "http://testserver"}), 403)
    token = csrf(raw_client)
    for headers in [
        {"Origin": "http://testserver"},
        {"Origin": "http://testserver", "X-CSRF-Token": "wrong"},
        {"Origin": "https://evil.example", "X-CSRF-Token": token},
        {"X-CSRF-Token": token},
    ]:
        assert_error(raw_client.post("/api/auth/signup", json=body, headers=headers), 403)
    assert signup(raw_client).status_code in (200, 201)


def test_csrf_token_is_bound_to_browser_and_rotated_after_login(raw_client, client_factory):
    anonymous_token = csrf(raw_client)
    other = client_factory()
    csrf(other)
    response = other.post("/api/auth/signup", json={"email": "parent@example.com", "password": PASSWORD}, headers={"Origin": "http://testserver", "X-CSRF-Token": anonymous_token})
    assert_error(response, 403)
    assert signup(raw_client).status_code in (200, 201)
    assert csrf(raw_client) != anonymous_token
    response = raw_client.post("/api/session/picker", headers={"Origin": "http://testserver", "X-CSRF-Token": anonymous_token})
    assert_error(response, 403)


def test_malformed_non_ascii_csrf_fails_with_auth_error_instead_of_server_error(raw_client):
    response = raw_client.post(
        "/api/auth/login",
        json={"email": "parent@example.com", "password": PASSWORD},
        headers=[
            (b"origin", b"http://testserver"),
            (b"x-csrf-token", b"\xff"),
            (b"cookie", b"sidekick_csrf=\xff"),
        ],
    )
    assert_error(response, 403)


def test_multipart_extraction_requires_csrf_session_and_active_child(client_factory, parent_client):
    # A valid multipart shape cannot bypass account/profile checks.
    response = mutate(client_factory(), "POST", "/api/extract", files={"file": ("photo.png", b"not an image", "image/png")})
    assert_error(response, 401)
    response = mutate(parent_client, "POST", "/api/extract", files={"file": ("photo.png", b"not an image", "image/png")})
    assert_error(response, 403)
    profile = child(parent_client)
    select_child(parent_client, profile["id"])
    response = parent_client.post("/api/extract", files={"file": ("photo.png", b"not an image", "image/png")}, headers={"Origin": "http://testserver"})
    assert_error(response, 403)
    response = mutate(parent_client, "POST", "/api/extract", files={"file": ("photo.png", b"not an image", "image/png")}, headers={"Origin": "https://evil.example"})
    assert_error(response, 403)


def test_protected_endpoints_never_return_cached_parent_data(parent_client):
    profile = child(parent_client)
    for path in ["/api/auth/session", "/api/profiles", "/api/parent/gate", "/api/parent/settings", f"/api/parent/dashboard/{profile['id']}"]:
        response = parent_client.get(path)
        assert response.status_code == 200, response.text
        assert response.headers["cache-control"] == "no-store"


def test_unauthed_direct_parent_and_kid_apis_return_authorization_errors(raw_client):
    for path in ["/api/auth/session", "/api/profiles", "/api/parent/gate", "/api/parent/settings", "/api/parent/dashboard/foreign", "/api/kid/profile/foreign"]:
        assert_error(raw_client.get(path), 401)


def test_session_and_pin_lockout_survive_security_context_restart(parent_client, security_context, clock, monkeypatch):
    from backend.accounts import SecurityContext

    picker(parent_client)
    for _ in range(5):
        unlock(parent_client, "9999")
    replacement = SecurityContext(settings=security_context.settings, clock=clock)
    monkeypatch.setitem(main.app.state._state, "security", replacement)
    assert session(parent_client)["mode"] == "picker"
    assert_error(unlock(parent_client), 429)
    clock.advance(301)
    assert unlock(parent_client).status_code == 200


def test_sample_data_has_both_subjects_codes_statuses_and_owned_transcript(parent_client):
    profile = child(parent_client)
    response = parent_client.get(f"/api/parent/dashboard/{profile['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["sample"] is True
    assert data["profile"]["id"] == profile["id"]
    assert data["skills"] and data["analytics"] and data["conversations"]
    assert {skill["subject"] for skill in data["skills"]} == {"math", "ela"}
    assert {skill["status"] for skill in data["skills"]} == {"gap", "practicing", "mastered", "unassessed"}
    assert all(skill["name"] and skill["commonCoreCode"] for skill in data["skills"])
    assert set(data["analytics"]) == {"sessionsThisWeek", "timeSpentMinutes", "problemsAttempted", "problemsCorrect"}
    assert "password" not in response.text.lower() and "hash" not in response.text.lower()
    conversation = data["conversations"][0]
    transcript = parent_client.get(f"/api/parent/conversations/{profile['id']}/{conversation['id']}")
    assert transcript.status_code == 200
    assert transcript.json()["sample"] is True
    assert transcript.headers["cache-control"] == "no-store"


def test_password_and_pin_hashes_use_argon2id_unique_salts_and_sessions_store_only_digests(parent_client, client_factory, database_path):
    second = client_factory()
    assert signup(second, email="other@example.com").status_code in (200, 201)
    assert setup_pin(second).status_code == 200
    with sqlite3.connect(database_path) as connection:
        connection.row_factory = sqlite3.Row
        accounts = connection.execute("SELECT * FROM accounts ORDER BY email").fetchall()
        assert len(accounts) == 2
        for account in accounts:
            assert account["password_hash"].startswith("$argon2id$")
            assert account["parent_pin_hash"].startswith("$argon2id$")
            assert account["password_hash"] != PASSWORD
            assert account["parent_pin_hash"] != PIN
        assert accounts[0]["password_hash"] != accounts[1]["password_hash"]
        assert accounts[0]["parent_pin_hash"] != accounts[1]["parent_pin_hash"]
        token = parent_client.cookies.get("sidekick_session")
        stored = connection.execute("SELECT token_digest FROM sessions").fetchall()
        digests = [row["token_digest"] for row in stored]
        assert token not in digests
        assert hashlib.sha256(token.encode()).hexdigest() in digests


def test_strict_policy_rejects_simple_password_and_dev_policy_requires_explicit_local_environment(raw_client, security_context, clock, monkeypatch):
    from backend.accounts import SecurityContext, Settings

    assert Settings(app_env="production").password_policy == "strict"
    with pytest.raises(ValueError):
        Settings(app_env="production", password_policy="dev")
    strict = SecurityContext(settings=replace(security_context.settings, password_policy="strict"), clock=clock)
    monkeypatch.setitem(main.app.state._state, "security", strict)
    assert_error(signup(raw_client), 400)
    assert signup(raw_client, password="Correct-Horse-Battery-2026").status_code in (200, 201)


def test_https_configuration_uses_secure_host_cookies(security_context, clock, monkeypatch):
    from backend.accounts import SecurityContext

    secure = SecurityContext(settings=replace(security_context.settings, cookie_secure=True, trusted_origins=("https://testserver",)), clock=clock)
    monkeypatch.setitem(main.app.state._state, "security", secure)
    with TestClient(main.app, base_url="https://testserver") as client:
        token = client.get("/api/auth/csrf").json()["csrfToken"]
        response = client.post("/api/auth/signup", json={"email": "secure@example.com", "password": PASSWORD}, headers={"Origin": "https://testserver", "X-CSRF-Token": token})
        assert response.status_code in (200, 201)
        cookie = next(value for value in response.headers.get_list("set-cookie") if value.startswith("__Host-sidekick_session="))
        assert "Secure" in cookie and "HttpOnly" in cookie and "Path=/" in cookie
        assert "Domain=" not in cookie


@pytest.mark.parametrize("method,path,body", [
    ("POST", "/api/auth/login", {"email": "parent@example.com", "password": PASSWORD}),
    ("POST", "/api/auth/logout", None),
    ("POST", "/api/session/picker", None),
    ("POST", "/api/session/kid", {"profileId": "foreign"}),
    ("POST", "/api/parent/pin/verify", {"pin": PIN}),
    ("POST", "/api/parent/activity", None),
    ("POST", "/api/auth/password", {"currentPassword": PASSWORD, "newPassword": "new-password"}),
    ("POST", "/api/parent/profiles", {"firstName": "Alex", "grade": "3", "avatarKey": "fox"}),
    ("PATCH", "/api/parent/profiles/foreign", {"firstName": "Alex", "grade": "3", "avatarKey": "fox"}),
    ("DELETE", "/api/parent/profiles/foreign", None),
])
def test_all_mutations_reject_missing_csrf(parent_client, method, path, body):
    response = parent_client.request(method, path, json=body, headers={"Origin": "http://testserver"})
    assert_error(response, 403)


def test_migrations_and_development_seed_are_idempotent_and_preserve_existing_records(security_context, database_path):
    from backend.accounts.seed import seed_demo

    context = security_context
    context.db.migrate()
    context.db.migrate()
    seed_demo(context)
    with sqlite3.connect(database_path) as connection:
        connection.row_factory = sqlite3.Row
        demo = dict(connection.execute("SELECT * FROM accounts").fetchone())
        profiles = [dict(row) for row in connection.execute("SELECT * FROM kid_profiles ORDER BY id").fetchall()]
        assert demo["parent_pin_hash"] is None
        assert context.verify_secret(demo["password_hash"], "password")
        assert len(profiles) == 2
        connection.execute("UPDATE kid_profiles SET first_name='Parent-edited nickname' WHERE id=?", (profiles[0]["id"],))
        connection.commit()
    seed_demo(context)
    with sqlite3.connect(database_path) as connection:
        connection.row_factory = sqlite3.Row
        after = dict(connection.execute("SELECT * FROM accounts").fetchone())
        assert after == demo
        assert connection.execute("SELECT COUNT(*) FROM kid_profiles").fetchone()[0] == 2
        assert connection.execute("SELECT first_name FROM kid_profiles WHERE id=?", (profiles[0]["id"],)).fetchone()[0] == "Parent-edited nickname"


def test_seed_rejects_production(security_context, clock):
    from backend.accounts import SecurityContext
    from backend.accounts.seed import seed_demo

    context = SecurityContext(settings=replace(security_context.settings, app_env="production", password_policy="strict", cookie_secure=True, trusted_origins=("https://testserver",)), clock=clock)
    with pytest.raises((ValueError, RuntimeError)):
        seed_demo(context)
