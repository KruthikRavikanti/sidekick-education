"""Opaque private files, strict image/PDF bounds, metadata stripping and header masking."""
import hashlib
import io
import json
import multiprocessing
import sys
import os
import re
import secrets
from pathlib import Path

from PIL import Image, ImageDraw
from backend.provider import ExtractionError


def setting_int(name, default, lower, upper):
    try:
        value = int(os.getenv(name, str(default)))
        if not lower <= value <= upper:
            raise ValueError
        return value
    except ValueError:
        raise ExtractionError("configuration_error", "Worksheet upload limits are not configured correctly.", 503) from None


def max_upload_bytes():
    return setting_int("SIDEKICK_MAX_UPLOAD_MB", 10, 1, 30) * 1024 * 1024


def private_root(security):
    configured = os.getenv("SIDEKICK_PRIVATE_UPLOAD_DIR", "").strip()
    path = Path(configured).expanduser() if configured else security.db.path.parent / "uploads"
    path = path.resolve()
    project_root=Path(__file__).resolve().parents[2]
    ignored_root=project_root/"backend"/"data"
    if (path == project_root or project_root in path.parents) and path != ignored_root and ignored_root not in path.parents:
        raise ExtractionError("configuration_error","Private worksheet storage must be outside source control or inside ignored backend/data.",503)
    public_root = project_root / "public"
    if path == public_root or public_root in path.parents:
        raise ExtractionError("configuration_error", "Private worksheet storage must be outside public assets.", 503)
    path.mkdir(parents=True, exist_ok=True, mode=0o700)
    path.chmod(0o700)
    return path


def file_path(security, reference):
    if not re.fullmatch(r"[a-f0-9]{48}", str(reference)):
        raise ExtractionError("invalid_file_reference", "That worksheet file was not found.", 404)
    return private_root(security) / reference


def save_bytes(security, data):
    reference = secrets.token_hex(24)
    path = file_path(security, reference)
    with path.open("xb") as target:
        os.chmod(path, 0o600)
        target.write(data)
    return reference


def read_bytes(security, reference):
    path = file_path(security, reference)
    try:
        return path.read_bytes()
    except FileNotFoundError:
        raise ExtractionError("file_not_found", "That worksheet file was not found. Upload it again.", 404) from None


def cleanup_references(security, references):
    for reference in set(references):
        file_path(security, reference).unlink(missing_ok=True)


def private_refs_for_child(connection, kid_id):
    rows = connection.execute("SELECT file_ref,pages_json FROM homework_uploads WHERE kid_id=?", (kid_id,)).fetchall()
    return [reference for row in rows for reference in [row["file_ref"], *json.loads(row["pages_json"])]]


def mask_header(png):
    try:
        fraction = float(os.getenv("SIDEKICK_HEADER_REDACTION_FRACTION", "0.06"))
        if not 0 <= fraction <= 0.2:
            raise ValueError
    except ValueError:
        raise ExtractionError("configuration_error", "Worksheet privacy settings are not configured correctly.", 503) from None
    if fraction == 0:
        return png
    with Image.open(io.BytesIO(png)) as image:
        image = image.convert("RGB")
        ImageDraw.Draw(image).rectangle((0, 0, image.width, round(image.height * fraction)), fill="white")
        output = io.BytesIO()
        image.save(output, format="PNG")
        return output.getvalue()


def prepare_pages(data: bytes, mime: str):
    if not data:
        raise ExtractionError("empty_file", "Choose a worksheet photo or PDF.", 400)
    if len(data) > max_upload_bytes():
        raise ExtractionError("file_too_large", "This worksheet file is too large. Choose a smaller file.", 413)
    if mime != "application/pdf":
        from backend.main import prepare_image
        return [prepare_image(data, mime)]
    if not data.startswith(b"%PDF-"):
        raise ExtractionError("invalid_pdf", "Choose a readable PDF and try again.", 400)
    timeout = setting_int("SIDEKICK_PDF_TIMEOUT_SECONDS",20,2,60)
    options = (setting_int("SIDEKICK_MAX_PDF_PAGES",6,1,12),setting_int("SIDEKICK_MAX_PAGE_PIXELS",24_000_000,4096,24_000_000),setting_int("SIDEKICK_MAX_TOTAL_PIXELS",72_000_000,4096,144_000_000),setting_int("SIDEKICK_PDF_MEMORY_MB",1024,256,2048),timeout)
    return _render_pdf_isolated(data,options,timeout)


def _render_pdf_isolated(data,options,timeout):
    """Kill the native renderer on deadline; it never receives database or account data."""
    context=multiprocessing.get_context("spawn")
    receive,send=context.Pipe(duplex=False)
    worker=context.Process(target=_pdf_worker,args=(send,data,options),daemon=True)
    worker.start(); send.close()
    try:
        if not receive.poll(timeout):
            raise ExtractionError("pdf_timeout","This PDF took too long to render. Try a smaller PDF or a photo.",422)
        try:
            status,result=receive.recv()
        except (EOFError,OSError):
            raise ExtractionError("invalid_pdf","This PDF could not be rendered safely. Try a photo.",400) from None
        if status != "ok":
            raise ExtractionError(*result)
        return result
    finally:
        receive.close()
        if worker.is_alive():
            worker.terminate()
        worker.join(timeout=1)
        if worker.is_alive():
            worker.kill(); worker.join(timeout=1)


def _pdf_worker(connection,data,options):
    page_limit,pixel_limit,total_limit,memory_mb,timeout=options
    try:
        # Native PDF parser diagnostics may quote document tokens. Keep the isolated
        # worker silent; the parent receives only the fixed safe error envelope.
        with open(os.devnull,"wb") as quiet:
            os.dup2(quiet.fileno(),1)
            os.dup2(quiet.fileno(),2)
        # Linux enforces a process address-space ceiling. macOS's VM accounting
        # includes large shared mappings, so constrain its heap/data segment instead.
        try:
            import resource
            resource.setrlimit(resource.RLIMIT_CPU,(timeout,timeout+1))
            resource.setrlimit(resource.RLIMIT_DATA if sys.platform == "darwin" else resource.RLIMIT_AS,(memory_mb*1024*1024,memory_mb*1024*1024))
        except (ImportError,ValueError,OSError):
            pass
        pages=_render_pdf(data,page_limit,pixel_limit,total_limit)
        connection.send(("ok",pages))
    except ExtractionError as exc:
        connection.send(("error",(exc.code,exc.message,exc.status)))
    except BaseException:
        connection.send(("error",("invalid_pdf","This PDF could not be rendered safely. Try a photo.",400)))
    finally:
        connection.close()


def _render_pdf(data,page_limit,pixel_limit,total_limit):
    try:
        import pymupdf as fitz
    except ImportError:
        raise ExtractionError("pdf_not_configured","Install the backend requirements to enable PDF uploads.",503) from None
    pages = []
    try:
        with fitz.open(stream=data, filetype="pdf") as document:
            if document.needs_pass:
                raise ExtractionError("encrypted_pdf", "Unlock this PDF before uploading it.", 400)
            if not 1 <= document.page_count <= page_limit:
                raise ExtractionError("pdf_page_limit", f"Choose a PDF with no more than {page_limit} pages.", 413)
            total = 0
            for page in document:
                width, height = page.rect.width, page.rect.height
                if not 32 <= width <= 4000 or not 32 <= height <= 4000:
                    raise ExtractionError("invalid_pdf", "This PDF has unsupported page dimensions.", 400)
                scale = min(2.0, (pixel_limit / (width * height)) ** 0.5)
                pixels = int(width * scale + 1) * int(height * scale + 1)
                total += pixels
                if pixels > pixel_limit or total > total_limit:
                    raise ExtractionError("pdf_pixel_limit", "This PDF has too much image detail. Upload fewer or smaller pages.", 413)
                pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False, colorspace=fitz.csRGB)
                pages.append(pixmap.tobytes("png"))
                if sum(len(value) for value in pages) > 128*1024*1024:
                    raise ExtractionError("pdf_pixel_limit","This PDF renders too much image data. Upload fewer pages.",413)
    except ExtractionError:
        raise
    except Exception:
        raise ExtractionError("invalid_pdf", "This PDF could not be opened. Try a photo or another PDF.", 400) from None
    return pages


def content_hash(data):
    return hashlib.sha256(data).hexdigest()
