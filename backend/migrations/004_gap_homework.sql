CREATE TABLE homework_uploads (
    id TEXT PRIMARY KEY,
    kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
    content_hash TEXT NOT NULL,
    idempotency_key TEXT,
    file_ref TEXT NOT NULL,
    mime TEXT NOT NULL,
    pages_json TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('live','fixture')),
    state TEXT NOT NULL CHECK(state IN ('pending','processing','completed','failed')),
    stage TEXT NOT NULL,
    extraction_json TEXT,
    lease_token TEXT,
    lease_until REAL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_code TEXT,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL,
    UNIQUE(kid_id,content_hash)
);
CREATE UNIQUE INDEX homework_request_key ON homework_uploads(kid_id,idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX homework_uploads_owner ON homework_uploads(kid_id,created_at);
CREATE TABLE homework_upload_requests (
    kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
    request_key TEXT NOT NULL,
    upload_id TEXT NOT NULL REFERENCES homework_uploads(id) ON DELETE CASCADE,
    content_hash TEXT NOT NULL,
    created_at REAL NOT NULL,
    PRIMARY KEY(kid_id,request_key)
);
CREATE TABLE homework_pages (
    upload_id TEXT NOT NULL REFERENCES homework_uploads(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    extraction_json TEXT NOT NULL,
    teacher_marks_json TEXT,
    PRIMARY KEY(upload_id,page_number)
);
CREATE TABLE homework_problems (
    id TEXT PRIMARY KEY,
    upload_id TEXT NOT NULL REFERENCES homework_uploads(id) ON DELETE CASCADE,
    kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    problem_order INTEGER NOT NULL,
    printed_id TEXT NOT NULL,
    extraction_json TEXT NOT NULL,
    context_json TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    teacher_marks_json TEXT NOT NULL DEFAULT '[]',
    teacher_conflict INTEGER NOT NULL DEFAULT 0,
    grading_json TEXT,
    mapping_json TEXT,
    signature_json TEXT,
    evidence_recorded INTEGER NOT NULL DEFAULT 0,
    created_at REAL NOT NULL,
    UNIQUE(upload_id,page_number,problem_order)
);
CREATE INDEX homework_problems_owner ON homework_problems(kid_id,upload_id);
CREATE INDEX homework_problem_fingerprints ON homework_problems(kid_id,fingerprint);
