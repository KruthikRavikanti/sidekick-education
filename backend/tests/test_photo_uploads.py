"""Real HEIF decoding, temporary previews, and private-original upload boundaries."""

import io
from pathlib import Path
from unittest.mock import AsyncMock

import pytest
from PIL import Image

from backend import main
from backend.gap import uploads
from backend.models import Extraction
from backend.tests.account_helpers import mutate, picker

ROOT = Path(__file__).resolve().parents[2]
HEIF_MIMES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"]


@pytest.fixture(autouse=True)
def no_live_provider(monkeypatch):
    monkeypatch.delenv("VISION_API_KEY", raising=False)
    monkeypatch.delenv("SIDEKICK_FIXTURE_MODE", raising=False)


@pytest.fixture
def heif_photo():
    output = io.BytesIO()
    image = Image.new("RGB", (120, 160), "white")
    exif = Image.Exif()
    exif[315] = "private camera metadata"
    image.save(output, "HEIF", quality=90, exif=exif)
    return output.getvalue()


def fixture_extraction():
    return Extraction.model_validate_json((ROOT / "fixtures/math.json").read_text())


@pytest.mark.parametrize("mime", HEIF_MIMES)
def test_heif_is_normalized_for_reader_but_original_stays_private(
    kid_client, heif_photo, monkeypatch, mime,
):
    reader = AsyncMock(return_value=fixture_extraction())
    monkeypatch.setattr(main, "extract_with_vision", reader)
    response = kid_client.post("/api/extract", files={"file": ("photo.heic", heif_photo, mime)})
    assert response.status_code == 200
    assert response.json()["source"] == "live"
    assert response.json()["problems"][0]["student_work"]["final_answer"]["text"] == "2/5"
    reader.assert_awaited_once()
    normalized_bytes = reader.await_args.args[0]
    with Image.open(io.BytesIO(normalized_bytes)) as normalized:
        assert normalized.format == "PNG"
        assert normalized.mode == "RGB"
        assert normalized.size == (120, 160)
        assert not normalized.getexif()
    assert b"private camera metadata" not in normalized_bytes
    upload_id = response.headers["X-Sidekick-Upload-Id"]
    original = kid_client.get(f"/api/learning/kid/uploads/{upload_id}/file")
    assert original.status_code == 200
    assert original.content == heif_photo
    assert original.headers["content-type"] == mime
    assert original.headers["cache-control"] == "no-store"


def test_parent_upload_accepts_heif(kid_client, heif_photo, monkeypatch):
    child_id = kid_client.get("/api/auth/session").json()["activeKidProfileId"]
    assert picker(kid_client).status_code == 200
    assert mutate(kid_client, "POST", "/api/parent/pin/verify", json={"pin": "0042"}).status_code == 200
    reader = AsyncMock(return_value=fixture_extraction())
    monkeypatch.setattr(uploads, "extract_with_vision", reader)
    response = mutate(kid_client, "POST", f"/api/learning/parent/{child_id}/uploads",
                      files={"file": ("photo.heic", heif_photo, "image/heic")})
    assert response.status_code == 200
    original = kid_client.get(f"/api/learning/parent/{child_id}/uploads/{response.json()['id']}/file")
    assert original.status_code == 200
    assert original.content == heif_photo
    reader.assert_awaited_once()


def test_preview_is_png_without_storage_or_model_call(
    kid_client, security_context, heif_photo, monkeypatch,
):
    reader = AsyncMock(side_effect=AssertionError("Selecting a photo must not call a model"))
    monkeypatch.setattr(main, "extract_with_vision", reader)
    response = kid_client.post("/api/images/preview", files={"file": ("photo.heic", heif_photo, "image/heic")})
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert response.headers["cache-control"] == "no-store"
    assert response.headers["x-content-type-options"] == "nosniff"
    with Image.open(io.BytesIO(response.content)) as preview:
        assert preview.format == "PNG" and preview.size == (120, 160)
        assert not preview.getexif()
    assert b"private camera metadata" not in response.content
    with security_context.db.transaction() as connection:
        assert connection.execute("SELECT count(*) FROM homework_uploads").fetchone()[0] == 0
    assert not (security_context.db.path.parent / "uploads").exists()
    reader.assert_not_called()


def test_preview_keeps_image_upload_cap_instead_of_auth_json_cap(kid_client):
    # A legitimate uncompressed PNG larger than 64KiB must reach image decoding.
    image = Image.effect_noise((256, 256), 64).convert("RGB")
    output = io.BytesIO()
    image.save(output, "PNG", compress_level=0)
    assert len(output.getvalue()) > 65536
    response = kid_client.post("/api/images/preview", files={"file": ("photo.png", output.getvalue(), "image/png")})
    assert response.status_code == 200
    assert response.content.startswith(b"\x89PNG\r\n\x1a\n")


def test_preview_requires_child_and_csrf(client_factory, kid_client, heif_photo):
    files = {"file": ("photo.heic", heif_photo, "image/heic")}
    # Valid anonymous CSRF still cannot access the private preview route.
    raw_client = client_factory()
    assert mutate(raw_client, "POST", "/api/images/preview", files=files).status_code == 401
    assert kid_client.post("/api/images/preview", files=files,
                           headers={"X-CSRF-Token": "invalid"}).status_code == 403
    assert picker(kid_client).status_code == 200
    assert mutate(kid_client, "POST", "/api/images/preview", files=files).status_code == 403


def test_preview_rechecks_profile_after_decoding(kid_client, client_factory, heif_photo, monkeypatch):
    other_tab = client_factory()
    other_tab.cookies.update(kid_client.cookies)
    prepare = main.prepare_image

    def switch_profile(data, mime):
        image = prepare(data, mime)
        assert picker(other_tab).status_code == 200
        return image

    monkeypatch.setattr(main, "prepare_image", switch_profile)
    response = kid_client.post("/api/images/preview", files={"file": ("photo.heic", heif_photo, "image/heic")})
    assert response.status_code == 403
    assert response.headers["content-type"] == "application/json"
    assert set(response.json()) == {"error"}


@pytest.mark.parametrize("path", ["/api/extract", "/api/images/preview"])
@pytest.mark.parametrize("failure", ["corrupt", "mismatch", "multiple", "dimensions"])
def test_heif_rejects_bad_data_before_reader(kid_client, heif_photo, monkeypatch, path, failure):
    reader = AsyncMock(side_effect=AssertionError("Invalid photos must not reach the model"))
    monkeypatch.setattr(main, "extract_with_vision", reader)
    data = heif_photo
    mime = "image/heic"
    if failure == "corrupt":
        data = b"private unreadable HEIC contents"
    elif failure == "mismatch":
        mime = "image/jpeg"
    elif failure == "multiple":
        output = io.BytesIO()
        Image.new("RGB", (120, 160), "white").save(
            output, "HEIF", save_all=True,
            append_images=[Image.new("RGB", (120, 160), "black")],
        )
        data = output.getvalue()
    else:
        monkeypatch.setattr(main, "MAX_PIXELS", 4096)
    response = kid_client.post(path, files={"file": ("photo.heic", data, mime)})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "invalid_image"
    assert "private unreadable HEIC contents" not in response.text
    reader.assert_not_called()


def test_preview_bounds_chunked_body_before_multipart_parser(kid_client):
    response = kid_client.post("/api/images/preview", content=iter([b"x" * 600_000] * 20),
                               headers={"Content-Type": "multipart/form-data; boundary=sample"})
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "file_too_large"


@pytest.mark.parametrize("kwargs", [
    {"json": {"file": "private contents"}},
    {"files": {"wrong": ("photo.heic", b"x", "image/heic")}},
    {"files": [("file", ("one.heic", b"x", "image/heic")), ("file", ("two.heic", b"x", "image/heic"))]},
    {"files": {"file": ("photo.heic", b"x", "image/heic")}, "data": {"extra": "x"}},
])
def test_preview_invalid_multipart_returns_safe_error(kid_client, kwargs):
    response = kid_client.post("/api/images/preview", **kwargs)
    assert response.status_code == 400
    assert set(response.json()) == {"error"}
    assert "private contents" not in response.text
