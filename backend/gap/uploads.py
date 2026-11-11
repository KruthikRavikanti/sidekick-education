"""Account/profile-scoped upload, resume, private-file and parent deletion routes."""
from fastapi import APIRouter, BackgroundTasks, Request
from fastapi.responses import Response
from starlette.datastructures import UploadFile

from backend.accounts.security import AccountError, get_security, require_kid, require_parent, require_session
from backend.provider import ExtractionError, extract_with_vision
from .homework import authorized_file, delete_upload, list_uploads, persist_ingest, resume_upload, upload_view
from .storage import max_upload_bytes, setting_int

router = APIRouter(prefix="/api/learning")


@router.get('/upload-limits')
def upload_limits(request: Request):
    require_session(request)
    return {"maxBytes":max_upload_bytes(),"maxPages":setting_int("SIDEKICK_MAX_PDF_PAGES",6,1,12)}


def scope(request, kid_id=None):
    session = require_parent(request) if kid_id is not None else require_session(request)
    if kid_id is None:
        kid_id = require_kid(request).id
    return get_security(request),session,kid_id


async def upload(request,kid_id=None,background=None):
    security,session,kid_id = scope(request,kid_id)
    try:
        form = await request.form(max_files=1,max_fields=0,max_part_size=max_upload_bytes()+65536)
    except Exception:
        raise ExtractionError("invalid_upload","Choose one worksheet photo or PDF and try again.",400) from None
    files = list(form.multi_items())
    if len(files) != 1 or files[0][0] != "file" or not isinstance(files[0][1],UploadFile):
        raise ExtractionError("invalid_upload","Choose one worksheet photo or PDF and try again.",400)
    file = files[0][1]
    try:
        data = await file.read(max_upload_bytes()+1)
    finally:
        await file.close()
    if file.content_type not in {"image/jpeg","image/png","image/webp","application/pdf"}:
        raise ExtractionError("unsupported_file","Choose a JPG, PNG, WEBP photo or a PDF.",415)
    source = "live"
    import os
    extractor = extract_with_vision
    if os.getenv("SIDEKICK_FIXTURE_MODE","").lower() == "true":
        from backend.main import extract_fixture
        source = "fixture"
        def extractor(_png):
            return extract_fixture(data)
    adapter = getattr(request.app.state,"gap_adapter",None)
    result = await persist_ingest(security,kid_id,data,file.content_type,extractor=extractor,expected_session=session,adapter=adapter,source=source,idempotency_key=request.headers.get("Idempotency-Key"),defer_processing=background is not None)
    if background is not None and result["state"] != "completed":
        background.add_task(background_resume,security,kid_id,result["id"],extractor=extractor,expected_session=session,adapter=adapter)
    if session.mode != "parent":
        result.pop("problems",None)
    return result


async def background_resume(security,kid_id,upload_id,*,extractor,expected_session,adapter=None):
    """A restart leaves resumable checkpoints; failures never emit private payloads."""
    try:
        await resume_upload(security,kid_id,upload_id,extractor=extractor,expected_session=expected_session,adapter=adapter)
    except Exception:
        # resume_upload has already persisted the safe failure code (when authorized).
        return


@router.post('/kid/uploads')
async def kid_upload(request: Request,background_tasks: BackgroundTasks):
    return await upload(request,background=background_tasks)


@router.post('/uploads')
async def active_upload(request: Request,background_tasks: BackgroundTasks):
    return await upload(request,background=background_tasks)


@router.post('/parent/{kid_id}/uploads')
async def parent_upload(kid_id: str,request: Request,background_tasks: BackgroundTasks):
    return await upload(request,kid_id,background_tasks)


@router.get('/kid/uploads')
def kid_list(request: Request):
    security,session,kid_id=scope(request)
    return {"uploads":list_uploads(security,kid_id,session)}


@router.get('/parent/{kid_id}/uploads')
def parent_list(kid_id: str,request: Request):
    security,session,kid_id=scope(request,kid_id)
    return {"uploads":list_uploads(security,kid_id,session)}


@router.get('/kid/uploads/{upload_id}')
def kid_get(upload_id: str,request: Request):
    security,session,kid_id=scope(request)
    return upload_view(security,kid_id,upload_id,expected_session=session,include_analysis=False)


@router.get('/parent/{kid_id}/uploads/{upload_id}')
def parent_get(kid_id: str,upload_id: str,request: Request):
    security,session,kid_id=scope(request,kid_id)
    return upload_view(security,kid_id,upload_id,expected_session=session)


@router.get('/kid/uploads/{upload_id}/file')
def kid_file(upload_id: str,request: Request):
    security,session,kid_id=scope(request)
    data,mime=authorized_file(security,kid_id,upload_id,session)
    return Response(data,media_type=mime,headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Disposition":"inline; filename=worksheet"})


@router.get('/parent/{kid_id}/uploads/{upload_id}/file')
def parent_file(kid_id: str,upload_id: str,request: Request):
    security,session,kid_id=scope(request,kid_id)
    data,mime=authorized_file(security,kid_id,upload_id,session)
    return Response(data,media_type=mime,headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Disposition":"inline; filename=worksheet"})


async def retry(request,upload_id,kid_id=None,background=None):
    security,session,kid_id=scope(request,kid_id)
    # Original fixture bytes are recovered privately; unknown files still cannot use a fixture.
    with security.db.transaction() as connection:
        from .homework import _owned_upload
        stored=_owned_upload(security,connection,kid_id,upload_id,session)
        source=stored["source"]
    extractor=extract_with_vision
    if source == "fixture":
        from backend.main import extract_fixture
        data,_=authorized_file(security,kid_id,upload_id,session)
        def extractor(_png):
            return extract_fixture(data)
    adapter=getattr(request.app.state,"gap_adapter",None)
    if background is not None:
        result=upload_view(security,kid_id,upload_id,expected_session=session,include_analysis=session.mode == "parent")
        if result["state"] != "completed":
            background.add_task(background_resume,security,kid_id,upload_id,extractor=extractor,expected_session=session,adapter=adapter)
    else:
        result=await resume_upload(security,kid_id,upload_id,extractor=extractor,expected_session=session,adapter=adapter)
    if session.mode != "parent":
        result.pop("problems",None)
    return result


@router.post('/kid/uploads/{upload_id}/retry')
async def kid_retry(upload_id: str,request: Request,background_tasks: BackgroundTasks):
    return await retry(request,upload_id,background=background_tasks)


@router.post('/parent/{kid_id}/uploads/{upload_id}/retry')
async def parent_retry(kid_id: str,upload_id: str,request: Request,background_tasks: BackgroundTasks):
    return await retry(request,upload_id,kid_id,background_tasks)


@router.delete('/parent/{kid_id}/uploads/{upload_id}')
def parent_delete(kid_id: str,upload_id: str,request: Request):
    security,session,kid_id=scope(request,kid_id)
    return delete_upload(security,kid_id,upload_id,session)
