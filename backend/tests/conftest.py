"""Isolated persistent SQLite/clock fixtures for backend security and extraction tests."""

from dataclasses import dataclass

import pytest
from fastapi.testclient import TestClient

from backend import main
from backend.tests.account_helpers import create_child, csrf, select_child, setup_pin, signup, unlock


@dataclass
class Clock:
    timestamp: float = 1_900_000_000.0

    def now(self):
        return self.timestamp

    def advance(self, seconds):
        self.timestamp += seconds


@pytest.fixture
def clock():
    return Clock()


@pytest.fixture
def database_path(tmp_path):
    return tmp_path / "accounts.sqlite3"


@pytest.fixture(autouse=True)
def security_context(database_path, clock, monkeypatch):
    # The explicit context prevents tests from ever opening the developer's database.
    from backend.accounts import SecurityContext, Settings

    settings = Settings(
        database_url=f"sqlite:///{database_path}",
        app_env="test",
        password_policy="dev",
        cookie_secure=False,
        trusted_origins=("http://testserver", "http://localhost:3000"),
    )
    context = SecurityContext(settings=settings, clock=clock)
    context.db.migrate()
    monkeypatch.setitem(main.app.state._state, "security", context)
    # Existing extraction tests stub transcription only; dedicated gap tests
    # inject their own task adapters instead of making additional model calls.
    monkeypatch.setitem(main.app.state._state, "gap_adapter", False)
    return context


@pytest.fixture
def client_factory(security_context):
    clients = []

    def make():
        client = TestClient(main.app, base_url="http://testserver")
        clients.append(client)
        return client

    yield make
    for client in clients:
        client.close()


@pytest.fixture
def raw_client(client_factory):
    return client_factory()


@pytest.fixture
def parent_client(raw_client):
    assert signup(raw_client).status_code in (200, 201)
    assert setup_pin(raw_client).status_code == 200
    assert unlock(raw_client).status_code == 200
    return raw_client


@pytest.fixture
def kid_client(parent_client):
    response = create_child(parent_client)
    assert response.status_code in (200, 201), response.text
    profile = response.json()
    assert select_child(parent_client, profile["id"]).status_code == 200
    # Original extraction tests intentionally send their own request bodies directly.
    parent_client.headers.update({"Origin": "http://testserver", "X-CSRF-Token": csrf(parent_client)})
    return parent_client
