CREATE TABLE activity_library_revisions (
 id TEXT PRIMARY KEY,
 source_sha256 TEXT NOT NULL,
 imported_at REAL NOT NULL,
 source_count INTEGER NOT NULL,
 sources_json TEXT NOT NULL
);
CREATE TABLE activity_sources (
 id TEXT PRIMARY KEY,
 source TEXT NOT NULL,
 summary TEXT NOT NULL,
 used_in TEXT NOT NULL,
 link TEXT NOT NULL,
 source_revision TEXT NOT NULL REFERENCES activity_library_revisions(id),
 raw_json TEXT NOT NULL,
 active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE activity_versions (
 id TEXT PRIMARY KEY,
 activity_id TEXT NOT NULL,
 version INTEGER NOT NULL,
 spec_json TEXT NOT NULL,
 spec_sha256 TEXT NOT NULL UNIQUE,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 subject TEXT NOT NULL CHECK(subject IN ('math','ela')),
 grade INTEGER NOT NULL,
 misconception_tags_json TEXT NOT NULL,
 origin TEXT NOT NULL CHECK(origin IN ('original_example','model_generated')),
 verified INTEGER NOT NULL CHECK(verified IN (0,1)),
 source_revision TEXT NOT NULL REFERENCES activity_library_revisions(id),
 model TEXT NOT NULL,
 prompt_version TEXT NOT NULL,
 component_version TEXT NOT NULL,
 created_at REAL NOT NULL,
 active INTEGER NOT NULL DEFAULT 1,
 UNIQUE(activity_id,version)
);
CREATE INDEX activity_matches ON activity_versions(subskill_id,grade,verified);
CREATE TABLE activity_sessions (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 upload_id TEXT REFERENCES homework_uploads(id) ON DELETE SET NULL,
 evidence_id INTEGER REFERENCES learning_evidence(id) ON DELETE SET NULL,
 activity_version_id TEXT NOT NULL REFERENCES activity_versions(id),
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 status TEXT NOT NULL CHECK(status IN ('in_progress','completed')),
 current_scene INTEGER NOT NULL DEFAULT 0,
 started_at REAL NOT NULL,
 completed_at REAL
);
CREATE UNIQUE INDEX one_open_activity_upload ON activity_sessions(kid_id,upload_id) WHERE status='in_progress';
CREATE TABLE activity_start_requests (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 request_key TEXT NOT NULL,
 upload_id TEXT REFERENCES homework_uploads(id) ON DELETE SET NULL,
 session_id TEXT REFERENCES activity_sessions(id) ON DELETE CASCADE,
 lease_token TEXT,
 lease_until REAL,
 created_at REAL NOT NULL,
 PRIMARY KEY(kid_id,request_key)
);
CREATE TABLE activity_attempts (
 id TEXT PRIMARY KEY,
 session_id TEXT NOT NULL REFERENCES activity_sessions(id) ON DELETE CASCADE,
 scene_id TEXT NOT NULL,
 request_key TEXT NOT NULL,
 phase TEXT NOT NULL CHECK(phase IN ('guided','independent')),
 response_json TEXT NOT NULL,
 response_text TEXT NOT NULL,
 correct INTEGER NOT NULL CHECK(correct IN (0,1)),
 hint_used INTEGER NOT NULL DEFAULT 0,
 created_at REAL NOT NULL,
 UNIQUE(session_id,request_key)
);
CREATE UNIQUE INDEX one_independent_activity_attempt ON activity_attempts(session_id,scene_id) WHERE phase='independent';
CREATE TABLE activity_scene_events (
 session_id TEXT NOT NULL REFERENCES activity_sessions(id) ON DELETE CASCADE,
 request_key TEXT NOT NULL,
 scene_id TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('next','hint')),
 created_at REAL NOT NULL,
 PRIMARY KEY(session_id,request_key)
);
