"""Bounded multipart worksheet extraction with temporary image processing only."""

import hashlib
import io
import json
import os
import warnings
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, ImageOps, UnidentifiedImageError
from pydantic import ValidationError
from starlette.datastructures import UploadFile
from starlette.concurrency import run_in_threadpool
from starlette.exceptions import HTTPException as StarletteHTTPException

from .models import Extraction, ExtractionResponse
from .provider import ExtractionError, extract_with_vision

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "backend" / ".env")
MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_BODY_BYTES = MAX_IMAGE_BYTES + 64 * 1024
MAX_PIXELS = 24_000_000
Image.MAX_IMAGE_PIXELS = MAX_PIXELS
MIME_FORMATS = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP"}


def error_response(code: str, message: str, status: int):
    return JSONResponse({"error": {"code": code, "message": message}}, status_code=status,
                        headers={"Cache-Control": "no-store"})


class BoundedBodyMiddleware:
    """Reject oversized bodies before any multipart parsing/spooling can begin."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or scope["path"] != "/api/extract":
            return await self.app(scope, receive, send)
        headers = dict(scope.get("headers", []))
        too_large = False
        try:
            too_large = int(headers.get(b"content-length", b"0")) > MAX_BODY_BYTES
        except ValueError:
            return await error_response("invalid_upload", "Choose one worksheet image and try again.", 400)(scope, receive, send)
        body = bytearray()
        if not too_large:
            while True:
                message = await receive()
                if message["type"] == "http.disconnect":
                    return
                body.extend(message.get("body", b""))
                if len(body) > MAX_BODY_BYTES:
                    too_large = True
                    break
                if not message.get("more_body", False):
                    break
        if too_large:
            return await error_response("file_too_large", "This photo is too large. Choose an image under 10 MB.", 413)(scope, receive, send)
        delivered = False

        async def bounded_receive():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {"type": "http.request", "body": bytes(body), "more_body": False}
            return await receive()

        await self.app(scope, bounded_receive, send)


app = FastAPI(title="Sidekick Worksheet Extraction", version="0.1.0")
app.add_middleware(BoundedBodyMiddleware)
app.add_middleware(CORSMiddleware,
                   allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")],
                   allow_methods=["GET", "POST"], allow_headers=["Content-Type"])


@app.exception_handler(ExtractionError)
async def extraction_error_handler(_request, exc):
    return error_response(exc.code, exc.message, exc.status)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request, _exc):
    return error_response("invalid_upload", "Choose one worksheet image and try again.", 400)


@app.exception_handler(StarletteHTTPException)
async def http_error_handler(_request, exc):
    return error_response("invalid_upload", "Choose one worksheet image and try again.", exc.status_code)


def prepare_image(data: bytes, mime: str) -> bytes:
    if not data:
        raise ExtractionError("empty_file", "This image is empty. Please choose another photo.", 400)
    if len(data) > MAX_IMAGE_BYTES:
        raise ExtractionError("file_too_large", "This photo is too large. Choose an image under 10 MB.", 413)
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(data)) as image:
                if image.format != MIME_FORMATS[mime] or getattr(image, "n_frames", 1) != 1:
                    raise ValueError
                if image.width * image.height > MAX_PIXELS or min(image.size) < 64:
                    raise ValueError
                image.verify()
            with Image.open(io.BytesIO(data)) as image:
                image.load()
                normalized = ImageOps.exif_transpose(image).convert("RGB")
                out = io.BytesIO()
                normalized.save(out, format="PNG")
                return out.getvalue()
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise ExtractionError("invalid_image", "We couldn't open this photo. Use a clear, single-page JPG, PNG, or WebP image (up to 24 megapixels).", 400) from None


def fixture_mode() -> bool:
    return os.getenv("SIDEKICK_FIXTURE_MODE", "").lower() == "true"


def extract_fixture(data: bytes) -> Extraction:
    try:
        manifest = json.loads((ROOT / "fixtures" / "manifest.json").read_text())
        name = manifest.get(hashlib.sha256(data).hexdigest())
        if name not in {"math", "ela"}:
            raise ExtractionError("fixture_only", "Demo mode reads the two sample worksheets. Try a sample, or connect the reader to use your own photo.", 422)
        return Extraction.model_validate_json((ROOT / "fixtures" / f"{name}.json").read_text())
    except (OSError, ValueError, ValidationError):
        raise ExtractionError("fixture_unavailable", "The sample reading is unavailable. Please try again later.", 503) from None


@app.get("/api/health")
async def health():
    return JSONResponse({"status": "ok", "mode": "fixture" if fixture_mode() else "live"},
                        headers={"Cache-Control": "no-store"})


@app.post("/api/extract", response_model=ExtractionResponse)
async def extract(request: Request):
    if not request.headers.get("content-type", "").lower().startswith("multipart/form-data"):
        raise ExtractionError("invalid_upload", "Choose one worksheet image and try again.", 400)
    async with request.form(max_files=1, max_fields=0, max_part_size=MAX_IMAGE_BYTES) as form:
        entries = form.multi_items()
        if len(entries) != 1 or entries[0][0] != "file" or not isinstance(entries[0][1], UploadFile):
            raise ExtractionError("invalid_upload", "Choose one worksheet image and try again.", 400)
        upload = entries[0][1]
        mime = (upload.content_type or "").lower()
        if mime not in MIME_FORMATS:
            raise ExtractionError("unsupported_file", "Choose a JPG, PNG, or WebP photo of your worksheet.", 415)
        data = await upload.read(MAX_IMAGE_BYTES + 1)
        image = await run_in_threadpool(prepare_image, data, mime)
        source = "fixture" if fixture_mode() else "live"
        result = extract_fixture(data) if source == "fixture" else await extract_with_vision(image)
        if not result.problems:
            raise ExtractionError("unreadable_page", "We couldn't find readable problems. Retake the photo with the whole worksheet in focus.", 422)
        response = ExtractionResponse(**result.model_dump(), source=source)
        return JSONResponse(response.model_dump(), headers={"Cache-Control": "no-store"})
