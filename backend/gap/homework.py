"""Checkpointed private homework pipeline. Model calls are outside SQLite transactions."""
import hashlib
import inspect
import json
import os
import secrets
import sqlite3
from typing import Callable

from starlette.concurrency import run_in_threadpool

from backend.accounts.security import AccountError
from backend.models import Extraction, ExtractionResponse
from backend.provider import ExtractionError
from .grading import grade_homework, language_task_supported, ungraded
from .homework_models import GradeDecision, MappingDecision, SignatureDecision
from .storage import cleanup_references, content_hash, mask_header, prepare_pages, read_bytes, save_bytes
from .vision import PROMPT_VERSION, VisionAdapter, redact


def _json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True)


def assert_scope(security, connection, kid_id, expected_session=None):
    if expected_session is not None:
        session = security.assert_active(connection, expected_session, expected_session.mode)
        profile = security.owned_kid(connection, expected_session.account_id, kid_id)
        if session["mode"] == "kid" and session["active_kid_profile_id"] != kid_id:
            raise AccountError("profile_changed", "Your profile changed. Refresh the page and try again.", 409)
        if session["mode"] not in {"kid", "parent"}:
            raise AccountError("kid_required", "Choose a child profile to continue.", 403)
        return profile
    profile = connection.execute("SELECT * FROM kid_profiles WHERE id=?", (kid_id,)).fetchone()
    if not profile:
        raise AccountError("not_found", "That child profile was not found.", 404)
    return profile


def _owned_upload(security, connection, kid_id, upload_id, expected_session=None):
    assert_scope(security, connection, kid_id, expected_session)
    row = connection.execute("SELECT * FROM homework_uploads WHERE id=? AND kid_id=?", (upload_id, kid_id)).fetchone()
    if not row:
        raise AccountError("not_found", "That worksheet was not found.", 404)
    return row


def _audit(security, task, reference, outcome, *, confidence=None, revision="", model="",kid_id=None):
    from .service import audit_model
    # The explanation is deliberately a fixed operational label, not copied model text.
    audit_model(security, task, reference, outcome, model=model, prompt_version=PROMPT_VERSION, catalog_revision=revision, confidence=confidence, explanation="Structured decision validated; worksheet content omitted from audit.",kid_id=kid_id)


def fingerprint(problem, context):
    # Student work and printed page numbering do not create fresh question evidence.
    normalized = {"question": problem.get("question"), "choices": problem.get("answer_choices", []), "context": context}
    def normalize(value):
        if isinstance(value, str):
            return " ".join(value.casefold().split())
        if isinstance(value, dict):
            return {key: normalize(item) for key, item in value.items() if key != "id"}
        if isinstance(value, list):
            return [normalize(item) for item in value]
        return value
    return hashlib.sha256(_json(normalize(normalized)).encode()).hexdigest()


def aggregate_pages(pages, source):
    if len(pages) == 1:
        return {**pages[0], "source": source}
    worksheet = json.loads(_json(pages[0]["worksheet"]))
    worksheet["shared_context"] = []
    worksheet["directions"] = []
    problems = []
    subjects = {page["worksheet"]["subject"] for page in pages}
    worksheet["subject"] = next(iter(subjects)) if len(subjects) == 1 else "unknown"
    worksheet["subject_uncertain"] = any(page["worksheet"]["subject_uncertain"] for page in pages) or len(subjects) != 1
    for index, page in enumerate(pages, 1):
        worksheet["directions"].extend(page["worksheet"]["directions"])
        for context in page["worksheet"]["shared_context"]:
            worksheet["shared_context"].append({**context, "id": f"page{index}:{context['id']}"})
        for problem in page["problems"]:
            problems.append({**problem, "id": f"page{index}:{problem['id']}", "context_refs": [f"page{index}:{ref}" for ref in problem["context_refs"]]})
    return ExtractionResponse.model_validate({"worksheet": worksheet, "problems": problems, "source": source}).model_dump()


def upload_view(security, kid_id, upload_id, *, expected_session=None, include_analysis=True):
    with security.db.transaction() as connection:
        row = _owned_upload(security, connection, kid_id, upload_id, expected_session)
        problems = connection.execute("SELECT * FROM homework_problems WHERE upload_id=? AND kid_id=? ORDER BY page_number,problem_order", (upload_id, kid_id)).fetchall()
        result = {"id": row["id"], "state": row["state"], "stage": row["stage"], "pageCount": len(json.loads(row["pages_json"])), "problemCount": len(problems), "retryCount": row["retry_count"], "createdAt": row["created_at"], "updatedAt": row["updated_at"], "error": {"code": row["error_code"], "message": "Processing paused. Retry this worksheet to continue."} if row["error_code"] else None, "extraction": json.loads(row["extraction_json"]) if row["extraction_json"] else None}
        if include_analysis:
            result["problems"] = [{"id": problem["id"], "page": problem["page_number"], "order": problem["problem_order"], "extracted": json.loads(problem["extraction_json"]), "context": json.loads(problem["context_json"]), "teacherMarks": json.loads(problem["teacher_marks_json"]), "teacherConflict": bool(problem["teacher_conflict"]), "grading": json.loads(problem["grading_json"]) if problem["grading_json"] else None, "mapping": json.loads(problem["mapping_json"]) if problem["mapping_json"] else None, "signature": json.loads(problem["signature_json"]) if problem["signature_json"] else None} for problem in problems]
    return result


def list_uploads(security, kid_id, expected_session=None):
    with security.db.transaction() as connection:
        assert_scope(security, connection, kid_id, expected_session)
        rows = connection.execute("SELECT id,state,stage,created_at,updated_at,extraction_json,pages_json FROM homework_uploads WHERE kid_id=? ORDER BY created_at DESC,id DESC LIMIT 100", (kid_id,)).fetchall()
        return [{"id": row["id"], "state": row["state"], "stage": row["stage"], "createdAt": row["created_at"], "updatedAt": row["updated_at"], "pageCount": len(json.loads(row["pages_json"])), "title": json.loads(row["extraction_json"])["worksheet"]["title"]["text"] if row["extraction_json"] else None} for row in rows]


def _existing_upload(connection,kid_id,digest,idempotency_key):
    if idempotency_key:
        request=connection.execute("SELECT upload_id,content_hash FROM homework_upload_requests WHERE kid_id=? AND request_key=?",(kid_id,idempotency_key)).fetchone()
        if request:
            if request["content_hash"] != digest:
                raise AccountError("idempotency_conflict","That request key already belongs to another worksheet.",409)
            return connection.execute("SELECT * FROM homework_uploads WHERE id=? AND kid_id=?",(request["upload_id"],kid_id)).fetchone()
    return connection.execute("SELECT * FROM homework_uploads WHERE kid_id=? AND content_hash=?",(kid_id,digest)).fetchone()


async def persist_ingest(security, kid_id: str, data: bytes, mime: str, *, extractor: Callable, expected_session=None, adapter=None, source="live", filename=None, idempotency_key=None, prepared_image=None, raise_extraction_errors=False, defer_processing=False):
    """Validate/store once, then resume checkpoints. Ownership never follows a changed profile."""
    if idempotency_key is not None and (len(idempotency_key) > 120 or not idempotency_key.strip()):
        raise AccountError("invalid_idempotency_key", "Use a shorter worksheet request key.", 400)
    digest = content_hash(data)
    with security.db.transaction() as connection:
        assert_scope(security, connection, kid_id, expected_session)
        existing = _existing_upload(connection,kid_id,digest,idempotency_key)
        if existing and existing["content_hash"] != digest:
            raise AccountError("idempotency_conflict", "That request key already belongs to another worksheet.", 409)
        if existing and existing["mime"] != mime:
            raise ExtractionError("invalid_image","The file contents do not match the selected file type.",400)
        existing_id = existing["id"] if existing else None
        if existing_id and idempotency_key:
            connection.execute("INSERT OR IGNORE INTO homework_upload_requests VALUES(?,?,?,?,?)",(kid_id,idempotency_key,existing_id,digest,security.clock.now()))
    if existing_id:
        if defer_processing:
            return upload_view(security,kid_id,existing_id,expected_session=expected_session)
        return await resume_upload(security, kid_id, existing_id, extractor=extractor, expected_session=expected_session, adapter=adapter, raise_extraction_errors=raise_extraction_errors)
    pages = [prepared_image] if prepared_image is not None else await run_in_threadpool(prepare_pages, data, mime)
    references = []
    try:
        references.append(await run_in_threadpool(save_bytes, security, data))
        for page in pages:
            references.append(await run_in_threadpool(save_bytes, security, page))
        upload_id = secrets.token_hex(16)
        now = security.clock.now()
        with security.db.transaction() as connection:
            assert_scope(security, connection, kid_id, expected_session)
            existing = _existing_upload(connection,kid_id,digest,idempotency_key)
            if existing:
                if existing["content_hash"] != digest:
                    raise AccountError("idempotency_conflict", "That request key already belongs to another worksheet.", 409)
                upload_id = existing["id"]
            else:
                connection.execute("INSERT INTO homework_uploads(id,kid_id,content_hash,idempotency_key,file_ref,mime,pages_json,source,state,stage,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", (upload_id,kid_id,digest,idempotency_key,references[0],mime,_json(references[1:]),source,"pending","extraction",now,now))
            if idempotency_key:
                connection.execute("INSERT OR IGNORE INTO homework_upload_requests VALUES(?,?,?,?,?)",(kid_id,idempotency_key,upload_id,digest,now))
        if existing:
            cleanup_references(security, references)
        references = []
    except BaseException:
        cleanup_references(security, references)
        raise
    if defer_processing:
        return upload_view(security,kid_id,upload_id,expected_session=expected_session)
    return await resume_upload(security, kid_id, upload_id, extractor=extractor, expected_session=expected_session, adapter=adapter, raise_extraction_errors=raise_extraction_errors)


async def _extract(extractor, png):
    value = extractor(png)
    if inspect.isawaitable(value):
        value = await value
    if isinstance(value, Extraction):
        return value.model_dump()
    if isinstance(value, dict):
        value = {key: item for key, item in value.items() if key != "source"}
    return Extraction.model_validate(value).model_dump()


async def resume_upload(security, kid_id, upload_id, *, extractor, expected_session=None, adapter=None, raise_extraction_errors=False):
    lease = secrets.token_hex(16)
    with security.db.transaction() as connection:
        row = _owned_upload(security, connection, kid_id, upload_id, expected_session)
        if row["stage"] == "deleting":
            raise AccountError("not_found","That worksheet is being deleted.",404)
        if row["state"] == "completed":
            completed = True
        else:
            completed = False
            if row["state"] == "processing" and row["lease_until"] and row["lease_until"] > security.clock.now():
                raise AccountError("upload_busy", "This worksheet is already being read. Check it again shortly.", 409)
            connection.execute("UPDATE homework_uploads SET state='processing',lease_token=?,lease_until=?,retry_count=retry_count+?,error_code=NULL,updated_at=? WHERE id=?", (lease,security.clock.now()+600,1 if row["state"] == "failed" else 0,security.clock.now(),upload_id))
        references = [row["file_ref"], *json.loads(row["pages_json"])]
        source = row["source"]
        profile = assert_scope(security, connection, kid_id, expected_session)
        grade = profile["grade"]
        account = connection.execute("SELECT email FROM accounts WHERE id=?", (profile["account_id"],)).fetchone()
        private_values = [profile["first_name"], profile["id"], profile["account_id"], account["email"]]
    if completed:
        return upload_view(security,kid_id,upload_id,expected_session=expected_session)
    # Fixtures are transcription demonstrations, never fabricated evidence. Unit tests inject adapters.
    if adapter is None:
        adapter = False if source == "fixture" else VisionAdapter(private_values=private_values)
    try:
        for page_number, reference in enumerate(references[1:], 1):
            with security.db.transaction() as connection:
                _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
                page = connection.execute("SELECT * FROM homework_pages WHERE upload_id=? AND page_number=?", (upload_id,page_number)).fetchone()
            if page:
                continue
            png = await run_in_threadpool(read_bytes, security, reference)
            # Top header masking and metadata stripping apply only to model input, not stored transcription.
            image_for_model = await run_in_threadpool(mask_header, png) if source == "live" else png
            extracted = await _extract(extractor, image_for_model)
            if not extracted["problems"]:
                raise ExtractionError("unreadable_page", "We couldn't find readable problems. Retake the photo with the whole worksheet in focus.", 422)
            with security.db.transaction() as connection:
                _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
                connection.execute("INSERT INTO homework_pages(upload_id,page_number,extraction_json,teacher_marks_json) VALUES(?,?,?,?)", (upload_id,page_number,_json(extracted),None))
                for index, problem in enumerate(extracted["problems"]):
                    contexts = [context for context in extracted["worksheet"]["shared_context"] if context["id"] in problem["context_refs"]]
                    directions=extracted["worksheet"].get("directions",[])
                    if any(item.get("text") or item.get("uncertain") for item in directions):
                        contexts.append({"id":"sidekick:worksheet-directions","type":"other","title":{"text":"Worksheet directions","uncertain":False},"content":{"text":"\n".join(item["text"] for item in directions if item.get("text")),"uncertain":any(item.get("uncertain") for item in directions)}})
                    marks = []
                    connection.execute("INSERT INTO homework_problems(id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,fingerprint,teacher_marks_json,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)", (secrets.token_hex(16),upload_id,kid_id,page_number,index,problem["id"],_json(problem),_json(contexts),fingerprint(problem,contexts),_json(marks),security.clock.now()))
            _audit(security,"worksheet_extract",f"{upload_id}:page{page_number}","extracted",model=os.getenv("VISION_MODEL","") if source == "live" else "fixture",kid_id=kid_id)
        with security.db.transaction() as connection:
            _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
            pages = [json.loads(page["extraction_json"]) for page in connection.execute("SELECT extraction_json FROM homework_pages WHERE upload_id=? ORDER BY page_number", (upload_id,))]
            extraction = aggregate_pages(pages,source)
            connection.execute("UPDATE homework_uploads SET extraction_json=?,stage='analysis',updated_at=? WHERE id=?", (_json(extraction),security.clock.now(),upload_id))
            problems = [dict(item) for item in connection.execute("SELECT * FROM homework_problems WHERE upload_id=? AND kid_id=? ORDER BY page_number,problem_order", (upload_id,kid_id))]
        if adapter is False:
            with security.db.transaction() as connection:
                _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
                connection.execute("UPDATE homework_uploads SET state='pending',stage='analysis_pending',lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=?", (security.clock.now(),upload_id))
            return upload_view(security,kid_id,upload_id,expected_session=expected_session)
        # Teacher observations are a separate resumable stage after transcription.
        for page_number, reference in enumerate(references[1:],1):
            with security.db.transaction() as connection:
                _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
                saved = connection.execute("SELECT teacher_marks_json FROM homework_pages WHERE upload_id=? AND page_number=?",(upload_id,page_number)).fetchone()
            if saved[0] is not None:
                continue
            teacher_marks=[]
            if hasattr(adapter,"observe_teacher_marks"):
                png=await run_in_threadpool(read_bytes,security,reference)
                input_image=await run_in_threadpool(mask_header,png) if source == "live" else png
                marks=await adapter.observe_teacher_marks(input_image)
                teacher_marks=[item.model_dump() if hasattr(item,"model_dump") else item for item in getattr(marks,"marks",marks)]
            with security.db.transaction() as connection:
                _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
                connection.execute("UPDATE homework_pages SET teacher_marks_json=? WHERE upload_id=? AND page_number=?",(_json(teacher_marks),upload_id,page_number))
                for stored_problem in connection.execute("SELECT id,extraction_json FROM homework_problems WHERE upload_id=? AND page_number=?",(upload_id,page_number)).fetchall():
                    raw=json.loads(stored_problem["extraction_json"])
                    observations=[mark for mark in teacher_marks if mark.get("problem_id") in {raw["id"],raw["label"]["text"]}]
                    connection.execute("UPDATE homework_problems SET teacher_marks_json=? WHERE id=?",(_json(observations),stored_problem["id"]))
            if hasattr(adapter,"observe_teacher_marks"):
                _audit(security,"teacher_marks",f"{upload_id}:page{page_number}","observed" if teacher_marks else "none",model=getattr(adapter,"model",""),kid_id=kid_id)
        with security.db.transaction() as connection:
            _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
            problems=[dict(item) for item in connection.execute("SELECT * FROM homework_problems WHERE upload_id=? AND kid_id=? ORDER BY page_number,problem_order",(upload_id,kid_id))]
        for problem in problems:
            page = pages[problem["page_number"]-1]
            await _analyze_problem(security,kid_id,upload_id,lease,problem,page["worksheet"]["subject"],grade,adapter,private_values,expected_session)
        with security.db.transaction() as connection:
            _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
            connection.execute("UPDATE homework_uploads SET state='completed',stage='completed',lease_token=NULL,lease_until=NULL,error_code=NULL,updated_at=? WHERE id=?", (security.clock.now(),upload_id))
    except BaseException as exc:
        with security.db.transaction() as connection:
            exists = connection.execute("SELECT extraction_json FROM homework_uploads WHERE id=? AND kid_id=?", (upload_id,kid_id)).fetchone()
            if exists:
                safe_code = exc.code if isinstance(exc,(ExtractionError,AccountError)) else "processing_failed"
                connection.execute("UPDATE homework_uploads SET state='failed',error_code=?,lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=?", (safe_code,security.clock.now(),upload_id,lease))
        if not exists:
            cleanup_references(security,references)
        if isinstance(exc,AccountError) or not isinstance(exc,Exception) or (raise_extraction_errors and (not exists or not exists["extraction_json"])):
            raise
        if not isinstance(exc,ExtractionError):
            # Unexpected exceptions remain a generic recoverable processing failure.
            pass
    return upload_view(security,kid_id,upload_id,expected_session=expected_session)


def _check_lease(security,connection,kid_id,upload_id,lease,expected_session):
    row = _owned_upload(security,connection,kid_id,upload_id,expected_session)
    if row["lease_token"] != lease:
        raise AccountError("upload_busy", "This worksheet is being read in another request.", 409)
    connection.execute("UPDATE homework_uploads SET lease_until=? WHERE id=?", (security.clock.now()+600,upload_id))


def _save_decision(security,kid_id,upload_id,lease,problem_id,column,value,expected_session):
    if column not in {"grading_json","mapping_json","signature_json"}:
        raise ValueError("Unknown decision column")
    with security.db.transaction() as connection:
        _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
        connection.execute(f"UPDATE homework_problems SET {column}=? WHERE id=? AND kid_id=?", (_json(value.model_dump()),problem_id,kid_id))


def retrieve_candidates(security,subject,grade,problem):
    from .catalog import search_candidates
    return search_candidates(security,subject,grade,problem.get("question",{}).get("text") or "",limit=10) if subject in {"math","ela"} else []


def readable_response(problem,context):
    work=problem.get("student_work",{})
    if work.get("status") != "answered" or problem.get("question",{}).get("uncertain") or not problem.get("question",{}).get("text"):
        return False
    if any(work.get(key,{}).get("uncertain") for key in ("final_answer","selected_choice")):
        return False
    if not (work.get("final_answer",{}).get("text") or work.get("selected_choice",{}).get("text")):
        return False
    selected=work.get("selected_choice",{}).get("text")
    if selected:
        matching=[choice for choice in problem.get("answer_choices",[]) if choice.get("label",{}).get("text") == selected]
        if len(matching) != 1 or matching[0].get("text",{}).get("uncertain") or matching[0].get("label",{}).get("uncertain"):
            return False
    return not any(item.get("content",{}).get("uncertain") for item in context)


async def grade_content(problem,context,subject,adapter):
    if not readable_response(problem,context):
        return ungraded("The response is blank, unreadable, uncertain, or incomplete.")
    if subject == "math":
        return grade_homework(problem,context)
    if subject == "ela":
        if not language_task_supported(problem,context):
            return ungraded("A required passage is missing or this task requires adult judgment.")
        result=await adapter.grade_problem(problem,context)
        return GradeDecision.model_validate(result.model_dump() if hasattr(result,"model_dump") else result)
    return ungraded("The worksheet subject is not supported for automatic grading.")


async def map_content(problem,context,grade,candidates,adapter):
    from .config import CONFIG
    mapping=await adapter.map_problem(problem,grade,candidates,context) if candidates and not problem.get("question",{}).get("uncertain") else MappingDecision(subskill_id=None,confidence=0,explanation="No supported, readable catalog candidate was available.")
    mapping=MappingDecision.model_validate(mapping.model_dump() if hasattr(mapping,"model_dump") else mapping)
    if mapping.subskill_id not in {item.get("subskill_id",item.get("id")) for item in candidates} or mapping.confidence < CONFIG.mapping_confidence:
        mapping=MappingDecision(subskill_id=None,confidence=mapping.confidence,explanation="The candidate mapping did not meet the routing threshold.")
    return mapping


async def signature_content(problem,context,grading,mapping,candidates,adapter):
    candidate=next((item for item in candidates if item.get("subskill_id",item.get("id")) == mapping.subskill_id),None)
    signature=await adapter.match_signature(problem,candidate,context) if grading.correctness == "incorrect" and candidate else SignatureDecision(status="uncertain",confidence=0,explanation="No confidently mapped incorrect response was available for pattern comparison.")
    return SignatureDecision.model_validate(signature.model_dump() if hasattr(signature,"model_dump") else signature)


async def analyze_content(security,problem,subject,grade,context,adapter):
    """Evaluation and ingestion use these exact retrieval/grade/map/signature functions."""
    candidates=retrieve_candidates(security,subject,grade,problem)
    grading=await grade_content(problem,context,subject,adapter)
    mapping=await map_content(problem,context,grade,candidates,adapter)
    signature=await signature_content(problem,context,grading,mapping,candidates,adapter)
    return {"grading":grading.model_dump(),"mapping":mapping.model_dump(),"signature":signature.model_dump()}


async def _analyze_problem(security,kid_id,upload_id,lease,stored,subject,grade,adapter,private_values,expected_session):
    from .service import record_homework_evidence
    problem = json.loads(stored["extraction_json"])
    context = json.loads(stored["context_json"])
    safe_problem, safe_context = redact(problem,private_values), redact(context,private_values)
    if stored["grading_json"]:
        grading = GradeDecision.model_validate_json(stored["grading_json"])
    else:
        grading = await grade_content(safe_problem,safe_context,subject,adapter)
        _save_decision(security,kid_id,upload_id,lease,stored["id"],"grading_json",grading,expected_session)
        _audit(security,"homework_grade",stored["id"],grading.correctness,confidence=grading.confidence,model=getattr(adapter,"model","") if grading.source == "model" else "deterministic",kid_id=kid_id)
    candidates = retrieve_candidates(security,subject,grade,problem)
    revision = candidates[0].get("revision","") if candidates else ""
    if stored["mapping_json"]:
        mapping = MappingDecision.model_validate_json(stored["mapping_json"])
    else:
        mapping = await map_content(safe_problem,safe_context,grade,candidates,adapter)
        _save_decision(security,kid_id,upload_id,lease,stored["id"],"mapping_json",mapping,expected_session)
        _audit(security,"homework_map",stored["id"],mapping.subskill_id or "abstained",confidence=mapping.confidence,revision=revision,model=getattr(adapter,"model",""),kid_id=kid_id)
    if stored["signature_json"]:
        signature = SignatureDecision.model_validate_json(stored["signature_json"])
    else:
        signature = await signature_content(safe_problem,safe_context,grading,mapping,candidates,adapter)
        _save_decision(security,kid_id,upload_id,lease,stored["id"],"signature_json",signature,expected_session)
        _audit(security,"homework_signature",stored["id"],signature.status,confidence=signature.confidence,revision=revision,model=getattr(adapter,"model",""),kid_id=kid_id)
    teacher_marks = json.loads(stored["teacher_marks_json"])
    conflict = any(not mark.get("uncertain") and mark.get("indicated_correctness") in {"correct","incorrect"} and mark["indicated_correctness"] != grading.correctness for mark in teacher_marks) if grading.correctness != "ungraded" else False
    with security.db.transaction() as connection:
        _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
        connection.execute("UPDATE homework_problems SET teacher_conflict=? WHERE id=?", (int(conflict),stored["id"]))
    if not stored["evidence_recorded"]:
        eligible = bool(mapping.subskill_id and grading.correctness in {"correct","incorrect"} and not conflict)
        record_homework_evidence(security,kid_id,stored["id"],mapping.subskill_id,grading.correctness,eligible,min(mapping.confidence,grading.confidence),signature.model_dump(),fingerprint=stored["fingerprint"],question=problem["question"].get("text"),expected_session=expected_session,expected_upload_id=upload_id)
        with security.db.transaction() as connection:
            _check_lease(security,connection,kid_id,upload_id,lease,expected_session)
            connection.execute("UPDATE homework_problems SET evidence_recorded=1 WHERE id=?", (stored["id"],))


def authorized_file(security,kid_id,upload_id,expected_session):
    with security.db.transaction() as connection:
        row = _owned_upload(security,connection,kid_id,upload_id,expected_session)
        data,mime = read_bytes(security,row["file_ref"]),row["mime"]
    return data,mime


def delete_upload(security,kid_id,upload_id,expected_session):
    if expected_session.mode != "parent":
        raise AccountError("parent_required","Enter your parent PIN to continue.",403)
    with security.db.transaction() as connection:
        row = _owned_upload(security,connection,kid_id,upload_id,expected_session)
        references = [row["file_ref"],*json.loads(row["pages_json"])]
        connection.execute("UPDATE homework_uploads SET state='failed',stage='deleting',lease_token=NULL,lease_until=NULL WHERE id=?",(upload_id,))
        problem_ids = [row[0] for row in connection.execute("SELECT id FROM homework_problems WHERE upload_id=? AND kid_id=?",(upload_id,kid_id))]
        # Keep learning history independent from the original private image. The learning
        # service removes/recomputes linked homework evidence before the upload is removed.
    from .service import remove_homework_evidence
    remove_homework_evidence(security,kid_id,problem_ids,expected_session=expected_session)
    with security.db.transaction() as connection:
        _owned_upload(security,connection,kid_id,upload_id,expected_session)
        connection.execute("DELETE FROM homework_uploads WHERE id=? AND kid_id=?",(upload_id,kid_id))
    cleanup_references(security,references)
    return {"ok":True}
