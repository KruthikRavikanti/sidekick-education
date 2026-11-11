"""Real cookie/CSRF test clients; no authorization dependency bypasses."""

from fastapi.testclient import TestClient

ORIGIN = "http://testserver"
PASSWORD = "password"
PIN = "0042"


def csrf(client: TestClient) -> str:
    response = client.get("/api/auth/csrf")
    assert response.status_code == 200, response.text
    return response.json()["csrfToken"]


def mutate(client: TestClient, method: str, path: str, **kwargs):
    headers = {"Origin": ORIGIN, "X-CSRF-Token": csrf(client)}
    headers.update(kwargs.pop("headers", {}))
    return client.request(method, path, headers=headers, **kwargs)


def signup(client: TestClient, email="parent@example.com", password=PASSWORD):
    return mutate(client, "POST", "/api/auth/signup", json={"email": email, "password": password})


def login(client: TestClient, email="parent@example.com", password=PASSWORD):
    return mutate(client, "POST", "/api/auth/login", json={"email": email, "password": password})


def setup_pin(client: TestClient, pin=PIN, password=PASSWORD):
    return mutate(client, "POST", "/api/parent/pin/setup", json={"password": password, "pin": pin, "confirmPin": pin})


def unlock(client: TestClient, pin=PIN):
    return mutate(client, "POST", "/api/parent/pin/verify", json={"pin": pin})


def create_child(client: TestClient, name="Alex", grade="3", avatar="fox"):
    return mutate(client, "POST", "/api/parent/profiles", json={"firstName": name, "grade": grade, "avatarKey": avatar})


def select_child(client: TestClient, profile_id: str):
    return mutate(client, "POST", "/api/session/kid", json={"profileId": profile_id})


def picker(client: TestClient):
    return mutate(client, "POST", "/api/session/picker")
