CREATE TABLE activity_program_versions (
 id TEXT PRIMARY KEY,
 program_key TEXT NOT NULL,
 definition_json TEXT NOT NULL,
 definition_sha256 TEXT NOT NULL UNIQUE,
 schema_version TEXT NOT NULL,
 component_version TEXT NOT NULL,
 runtime_version TEXT NOT NULL,
 created_at REAL NOT NULL
);
CREATE TABLE activity_program_sessions (
 id TEXT PRIMARY KEY,
 account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 program_version_id TEXT NOT NULL REFERENCES activity_program_versions(id),
 status TEXT NOT NULL CHECK(status IN ('in_progress','completed')),
 state_json TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0),
 action_count INTEGER NOT NULL DEFAULT 0 CHECK(action_count>=0),
 assistance_json TEXT NOT NULL,
 completion_snapshot_json TEXT,
 started_at REAL NOT NULL,
 completed_at REAL
);
CREATE INDEX activity_program_owned_sessions ON activity_program_sessions(kid_id,started_at);
CREATE TABLE activity_program_start_requests (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL,
 request_sha256 TEXT NOT NULL,
 session_id TEXT NOT NULL REFERENCES activity_program_sessions(id) ON DELETE CASCADE,
 response_json TEXT NOT NULL,
 PRIMARY KEY(kid_id,request_id)
);
CREATE TABLE activity_program_events (
 id TEXT PRIMARY KEY,
 session_id TEXT NOT NULL REFERENCES activity_program_sessions(id) ON DELETE CASCADE,
 request_id TEXT NOT NULL,
 request_sha256 TEXT NOT NULL,
 revision INTEGER NOT NULL CHECK(revision>0),
 kind TEXT NOT NULL CHECK(kind IN ('action','help')),
 payload_json TEXT NOT NULL,
 state_json TEXT NOT NULL,
 evidence_json TEXT NOT NULL,
 response_json TEXT NOT NULL,
 created_at REAL NOT NULL,
 UNIQUE(session_id,request_id),
 UNIQUE(session_id,revision)
);
