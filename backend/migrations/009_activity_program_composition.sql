CREATE TABLE activity_program_generations (
 id TEXT PRIMARY KEY,
 account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 upload_id TEXT NOT NULL REFERENCES homework_uploads(id) ON DELETE CASCADE,
 status TEXT NOT NULL CHECK(status IN ('processing','ready','failed')),
 stage TEXT NOT NULL,
 reason_code TEXT,
 lease_token TEXT,
 lease_until REAL,
 context_json TEXT NOT NULL,
 private_sources_json TEXT NOT NULL,
 target_json TEXT NOT NULL,
 session_id TEXT REFERENCES activity_program_sessions(id) ON DELETE SET NULL,
 requested_model TEXT,
 returned_models_json TEXT,
 model_calls_json TEXT,
 review_json TEXT,
 approved_definition_sha256 TEXT,
 call_count INTEGER,
 created_at REAL NOT NULL,
 updated_at REAL NOT NULL
);
CREATE INDEX activity_program_generation_owner ON activity_program_generations(kid_id,created_at);
CREATE TABLE activity_program_generation_requests (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL,
 upload_id TEXT NOT NULL REFERENCES homework_uploads(id) ON DELETE CASCADE,
 generation_id TEXT NOT NULL REFERENCES activity_program_generations(id) ON DELETE CASCADE,
 PRIMARY KEY(kid_id,request_id)
);
