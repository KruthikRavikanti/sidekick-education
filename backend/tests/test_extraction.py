import copy
import io
import json
from pathlib import Path
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from pydantic import ValidationError

from backend import main, provider
from backend.models import Extraction

ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    for name in ["VISION_API_KEY", "VISION_MODEL", "VISION_BASE_URL", "VISION_TIMEOUT_SECONDS", "SIDEKICK_FIXTURE_MODE"]:
        monkeypatch.delenv(name, raising=False)


@pytest.fixture
def client():
    return TestClient(main.app)


@pytest.fixture
def math_payload():
    return json.loads((ROOT / "fixtures/math.json").read_text())


@pytest.fixture
def image_bytes():
    data = io.BytesIO()
    Image.new("RGB", (120, 160), "white").save(data, "PNG")
    return data.getvalue()


def upload(client, data, name="worksheet.png", mime="image/png"):
    return client.post("/api/extract", files={"file": (name, data, mime)})


@pytest.mark.parametrize("name,subject,incorrect", [
    ("math", "math", "2/5"), ("ela", "ela", "The story happens in winter."),
])
def test_complete_fixture_upload_preserves_work_and_uncertainty(client, monkeypatch, name, subject, incorrect):
    monkeypatch.setenv("SIDEKICK_FIXTURE_MODE", "true")
    data = (ROOT / f"public/samples/{name}-worksheet.png").read_bytes()
    response = upload(client, data)
    assert response.status_code == 200
    result = response.json()
    assert result["source"] == "fixture"
    assert result["worksheet"]["subject"] == subject
    assert result["problems"][0]["student_work"]["final_answer"]["text"] == incorrect
    assert [p["label"]["text"] for p in result["problems"]] == ["1", "2", "3", "4(a)"]
    blank = result["problems"][1]["student_work"]
    assert blank["status"] == "blank" and blank["steps"] == []
    assert blank["final_answer"] == {"text": None, "uncertain": False}
    unclear = result["problems"][2]["student_work"]
    assert unclear["status"] == "unclear"
    assert unclear["final_answer"] == {"text": None, "uncertain": True}
    assert unclear["steps"][0]["text"] is not None
    expected = json.loads((ROOT / f"fixtures/{name}.json").read_text())
    assert {k: v for k, v in result.items() if k != "source"} == expected
    assert response.headers["cache-control"] == "no-store"


def test_math_equations_transcribed_exactly(client, monkeypatch):
    monkeypatch.setenv("SIDEKICK_FIXTURE_MODE", "true")
    response = upload(client, (ROOT / "public/samples/math-worksheet.png").read_bytes())
    assert [step["text"] for step in response.json()["problems"][0]["student_work"]["steps"]] == [
        "1 + 1 = 2", "2 + 3 = 5", "1/2 + 1/3 = 2/5",
    ]


def test_fixture_mode_rejects_unrecognized_images(client, monkeypatch, image_bytes):
    monkeypatch.setenv("SIDEKICK_FIXTURE_MODE", "true")
    response = upload(client, image_bytes)
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "fixture_only"


def test_missing_credentials_never_silently_returns_fixture(client):
    response = upload(client, (ROOT / "public/samples/math-worksheet.png").read_bytes())
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "provider_not_configured"


@pytest.mark.parametrize("fmt,mime", [("PNG", "image/png"), ("JPEG", "image/jpeg"), ("WEBP", "image/webp")])
def test_live_adapter_receives_normalized_png(client, monkeypatch, math_payload, fmt, mime):
    data = io.BytesIO()
    Image.new("RGB", (120, 160), "white").save(data, fmt)
    reader = AsyncMock(return_value=Extraction.model_validate(math_payload))
    monkeypatch.setattr(main, "extract_with_vision", reader)
    response = upload(client, data.getvalue(), mime=mime)
    assert response.status_code == 200 and response.json()["source"] == "live"
    normalized = Image.open(io.BytesIO(reader.await_args.args[0]))
    assert normalized.format == "PNG" and normalized.mode == "RGB"
    assert not normalized.getexif()


@pytest.mark.parametrize("data,mime,code,status", [
    (b"pdf text", "application/pdf", "unsupported_file", 415),
    (b"secret worksheet text", "image/png", "invalid_image", 400),
    (b"", "image/png", "empty_file", 400),
    (b"x" * (10 * 1024 * 1024 + 1), "image/png", "file_too_large", 413),
    (b"x" * (11 * 1024 * 1024), "image/png", "file_too_large", 413),
])
def test_invalid_files(client, caplog, data, mime, code, status):
    response = upload(client, data, mime=mime)
    assert response.status_code == status
    assert response.json()["error"]["code"] == code
    assert "secret worksheet text" not in caplog.text
    assert "secret worksheet text" not in response.text


def test_mime_mismatch_and_truncated_image(client, image_bytes):
    assert upload(client, image_bytes, mime="image/jpeg").status_code == 400
    assert upload(client, image_bytes[:30]).status_code == 400


def test_corrupt_png_checksum_returns_safe_photo_error(client, image_bytes):
    corrupted = bytearray(image_bytes)
    corrupted[corrupted.index(b"IDAT") + 4] ^= 1
    response = upload(client, bytes(corrupted))
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "invalid_image"


def test_chunked_upload_body_is_bounded_before_parser(client):
    response = client.post("/api/extract", content=iter([b"x" * 600_000] * 20),
                           headers={"Content-Type": "multipart/form-data; boundary=sample"})
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "file_too_large"


def test_live_image_orientation_corrected_and_metadata_removed(client, monkeypatch, math_payload):
    image = Image.new("RGB", (120, 160), "white")
    exif = Image.Exif()
    exif[274] = 6  # Camera rotation: 90 degrees clockwise.
    exif[315] = "private student metadata"
    data = io.BytesIO()
    image.save(data, "JPEG", exif=exif)
    reader = AsyncMock(return_value=Extraction.model_validate(math_payload))
    monkeypatch.setattr(main, "extract_with_vision", reader)
    assert upload(client, data.getvalue(), mime="image/jpeg").status_code == 200
    normalized_bytes = reader.await_args.args[0]
    normalized = Image.open(io.BytesIO(normalized_bytes))
    assert normalized.size == (160, 120)
    assert not normalized.getexif()
    assert b"private student metadata" not in normalized_bytes


def test_animated_and_oversized_dimensions_rejected(client):
    data = io.BytesIO()
    frame = Image.new("RGB", (120, 160), "white")
    second = Image.new("RGB", (120, 160), "black")
    frame.save(data, "PNG", save_all=True, append_images=[second])
    assert upload(client, data.getvalue()).status_code == 400
    # A highly compressed image can have a tiny file size and unsafe dimensions.
    large = io.BytesIO()
    Image.new("1", (6000, 5000)).save(large, "PNG")
    assert upload(client, large.getvalue()).status_code == 400


@pytest.mark.parametrize("kwargs", [
    {"json": {"file": "x"}},
    {"files": {"wrong": ("photo.png", b"x", "image/png")}},
    {"files": [("file", ("one.png", b"x", "image/png")), ("file", ("two.png", b"x", "image/png"))]},
    {"files": {"file": ("photo.png", b"x", "image/png")}, "data": {"extra": "x"}},
])
def test_invalid_multipart_has_safe_error(client, kwargs):
    response = client.post("/api/extract", **kwargs)
    assert response.status_code == 400
    assert set(response.json()) == {"error"}


def test_unknown_context_and_inconsistent_blank_are_rejected(math_payload):
    data = copy.deepcopy(math_payload)
    data["problems"][0]["context_refs"] = ["missing"]
    with pytest.raises(ValidationError):
        Extraction.model_validate(data)
    data = copy.deepcopy(math_payload)
    data["problems"][0]["student_work"]["status"] = "blank"
    with pytest.raises(ValidationError):
        Extraction.model_validate(data)


def configure_mock_provider(monkeypatch, handler):
    monkeypatch.setenv("VISION_API_KEY", "test-secret")
    monkeypatch.setenv("VISION_MODEL", "configurable-vision-model")
    monkeypatch.setenv("VISION_BASE_URL", "https://vision.example.test/v1")
    original = httpx.AsyncClient
    monkeypatch.setattr(provider.httpx, "AsyncClient", lambda **kwargs: original(transport=httpx.MockTransport(handler), **kwargs))


def provider_result(payload, finish_reason="stop", refusal=None):
    return {"choices": [{"finish_reason": finish_reason, "message": {"content": json.dumps(payload), "refusal": refusal}}]}


def test_live_provider_request_and_schema_validation(client, monkeypatch, math_payload, image_bytes, caplog):
    def handler(request):
        body = json.loads(request.content)
        assert str(request.url) == "https://vision.example.test/v1/chat/completions"
        assert request.headers["Authorization"] == "Bearer test-secret"
        assert body["model"] == "configurable-vision-model"
        schema = body["response_format"]["json_schema"]
        assert schema["strict"] is True
        assert schema["schema"]["additionalProperties"] is False
        assert body["messages"][1]["content"][1]["image_url"]["url"].startswith("data:image/png;base64,")
        return httpx.Response(200, json=provider_result(math_payload))
    configure_mock_provider(monkeypatch, handler)
    result = upload(client, image_bytes)
    assert result.status_code == 200
    assert result.json()["problems"][0]["student_work"]["final_answer"]["text"] == "2/5"
    assert "test-secret" not in caplog.text
    assert "2/5" not in caplog.text


@pytest.mark.parametrize("unreadable_field", ["final_answer", "selected_choice"])
def test_provider_unreadable_answer_normalizes_status_and_preserves_work(
    client, monkeypatch, math_payload, image_bytes, unreadable_field,
):
    work = math_payload["problems"][2]["student_work"]
    work["status"] = "answered"
    work["steps"] = [{"text": "3/ [unreadable]", "uncertain": True}]
    work["final_answer"] = {"text": None, "uncertain": False}
    work["selected_choice"] = {"text": None, "uncertain": False}
    work[unreadable_field]["uncertain"] = True
    expected_work = {**copy.deepcopy(work), "status": "unclear"}
    configure_mock_provider(monkeypatch, lambda request: httpx.Response(200, json=provider_result(math_payload)))

    response = upload(client, image_bytes)

    assert response.status_code == 200
    problems = response.json()["problems"]
    assert problems[2]["student_work"] == expected_work
    assert problems[1]["student_work"]["status"] == "blank"


def test_provider_legible_final_answer_stays_answered_with_uncertain_earlier_step(
    client, monkeypatch, math_payload, image_bytes,
):
    work = math_payload["problems"][0]["student_work"]
    work["steps"][0] = {"text": "1 + [unreadable] = 2", "uncertain": True}
    expected_work = copy.deepcopy(work)
    configure_mock_provider(monkeypatch, lambda request: httpx.Response(200, json=provider_result(math_payload)))

    response = upload(client, image_bytes)

    assert response.status_code == 200
    assert response.json()["problems"][0]["student_work"] == expected_work
    assert expected_work["status"] == "answered"
    assert expected_work["final_answer"]["text"] == "2/5"


@pytest.mark.parametrize("response_body", [
    {"malformed": "secret student text"},
    provider_result({"invalid": "secret student text"}),
    provider_result({}, finish_reason="length"),
    provider_result({}, refusal="secret student text"),
])
def test_invalid_provider_responses_are_safe(client, monkeypatch, image_bytes, caplog, response_body):
    configure_mock_provider(monkeypatch, lambda request: httpx.Response(200, json=response_body))
    response = upload(client, image_bytes)
    assert response.status_code == 502
    assert response.json()["error"]["code"] == "invalid_extraction"
    assert "secret student text" not in response.text + caplog.text


@pytest.mark.parametrize("status,expected", [(401, 502), (429, 503), (500, 503)])
def test_provider_http_failure(client, monkeypatch, image_bytes, status, expected):
    configure_mock_provider(monkeypatch, lambda request: httpx.Response(status, text="secret provider payload"))
    response = upload(client, image_bytes)
    assert response.status_code == expected
    assert response.json()["error"]["code"] == "provider_unavailable"
    assert "secret provider payload" not in response.text


@pytest.mark.parametrize("exc,status,code", [
    (httpx.ReadTimeout("private details"), 504, "provider_timeout"),
    (httpx.ConnectError("private details"), 503, "provider_unavailable"),
])
def test_provider_network_failures(client, monkeypatch, image_bytes, exc, status, code):
    def handler(request):
        raise exc
    configure_mock_provider(monkeypatch, handler)
    response = upload(client, image_bytes)
    assert response.status_code == status
    assert response.json()["error"]["code"] == code
    assert "private details" not in response.text


def test_no_problems_offers_retake(client, monkeypatch, image_bytes, math_payload):
    math_payload["problems"] = []
    configure_mock_provider(monkeypatch, lambda request: httpx.Response(200, json=provider_result(math_payload)))
    response = upload(client, image_bytes)
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "unreadable_page"


def test_invalid_provider_config_is_safe(client, monkeypatch, image_bytes):
    monkeypatch.setenv("VISION_BASE_URL", "https://user:secret@example.test/v1")
    response = upload(client, image_bytes)
    assert response.status_code == 503
    assert "secret" not in response.text


def test_health_exposes_no_credentials(client, monkeypatch):
    monkeypatch.setenv("VISION_API_KEY", "private")
    assert client.get("/api/health").json() == {"status": "ok", "mode": "live"}
    monkeypatch.setenv("SIDEKICK_FIXTURE_MODE", "true")
    assert client.get("/api/health").json() == {"status": "ok", "mode": "fixture"}
