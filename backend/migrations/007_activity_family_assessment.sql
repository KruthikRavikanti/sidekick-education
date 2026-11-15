ALTER TABLE activity_attempts ADD COLUMN assessment_status TEXT NOT NULL DEFAULT 'automatic' CHECK(assessment_status IN ('automatic','pending_parent_review','parent_reviewed'));
ALTER TABLE activity_attempts ADD COLUMN review_json TEXT;
CREATE TABLE activity_recordings (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 session_id TEXT NOT NULL REFERENCES activity_sessions(id) ON DELETE CASCADE,
 scene_id TEXT NOT NULL,
 request_key TEXT NOT NULL,
 file_ref TEXT NOT NULL,
 content_sha256 TEXT NOT NULL,
 mime TEXT NOT NULL,
 byte_count INTEGER NOT NULL,
 created_at REAL NOT NULL,
 UNIQUE(session_id,request_key)
);
CREATE TABLE activity_parent_reviews (
 id TEXT PRIMARY KEY,
 session_id TEXT NOT NULL REFERENCES activity_sessions(id) ON DELETE CASCADE,
 attempt_id TEXT NOT NULL REFERENCES activity_attempts(id) ON DELETE CASCADE,
 request_key TEXT NOT NULL,
 correct INTEGER NOT NULL CHECK(correct IN (0,1)),
 note TEXT NOT NULL,
 parent_observed INTEGER NOT NULL CHECK(parent_observed IN (0,1)),
 created_at REAL NOT NULL,
 UNIQUE(session_id,request_key)
);
