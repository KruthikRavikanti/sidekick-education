CREATE TABLE learning_evidence (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 subskill_id TEXT REFERENCES catalog_subskills(id),
 source TEXT NOT NULL CHECK(source IN ('homework','check','practice','recheck')),
 source_ref TEXT NOT NULL,
 fingerprint TEXT,
 question TEXT,
 correctness TEXT NOT NULL CHECK(correctness IN ('correct','incorrect','ungraded')),
 eligible INTEGER NOT NULL DEFAULT 0,
 independent INTEGER NOT NULL DEFAULT 1,
 hint_used INTEGER NOT NULL DEFAULT 0,
 answer_revealed INTEGER NOT NULL DEFAULT 0,
 read_aloud INTEGER NOT NULL DEFAULT 0,
 first_graded INTEGER NOT NULL DEFAULT 1,
 fresh INTEGER NOT NULL DEFAULT 1,
 confidence REAL,
 signature_json TEXT,
 created_at REAL NOT NULL,
 UNIQUE(kid_id,source,source_ref)
);
CREATE UNIQUE INDEX homework_first_question ON learning_evidence(kid_id,fingerprint) WHERE source='homework' AND eligible=1 AND fingerprint IS NOT NULL;
CREATE INDEX evidence_kid_skill ON learning_evidence(kid_id,subskill_id,id);
CREATE TABLE skill_states (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 status TEXT NOT NULL CHECK(status IN ('unassessed','on_track','checking','gap','practicing','mastered')),
 state_json TEXT NOT NULL,
 updated_at REAL NOT NULL,
 PRIMARY KEY(kid_id,subskill_id)
);
CREATE TABLE practice_assignments (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 purpose TEXT NOT NULL CHECK(purpose IN ('check','practice','recheck')),
 status TEXT NOT NULL CHECK(status IN ('awaiting_items','open','completed','cancelled')),
 required_count INTEGER NOT NULL,
 episode INTEGER NOT NULL,
 created_at REAL NOT NULL,
 completed_at REAL,
 preparation_until REAL,
 preparation_error TEXT
);
CREATE UNIQUE INDEX one_active_skill_assignment ON practice_assignments(kid_id,subskill_id) WHERE status IN ('awaiting_items','open');
CREATE TABLE assignment_items (
 id TEXT PRIMARY KEY,
 assignment_id TEXT NOT NULL REFERENCES practice_assignments(id) ON DELETE CASCADE,
 item_id TEXT NOT NULL REFERENCES practice_items(id),
 position INTEGER NOT NULL,
 fingerprint TEXT NOT NULL,
 correctness TEXT CHECK(correctness IN ('correct','incorrect','ungraded')),
 graded_attempt_id TEXT,
 UNIQUE(assignment_id,position),
 UNIQUE(assignment_id,fingerprint)
);
CREATE TABLE learning_sessions (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 state TEXT NOT NULL CHECK(state IN ('open','completed')),
 assignment_ids_json TEXT NOT NULL,
 started_at REAL NOT NULL,
 last_activity_at REAL NOT NULL,
 active_seconds REAL NOT NULL DEFAULT 0,
 completed_at REAL
);
CREATE UNIQUE INDEX one_open_learning_session ON learning_sessions(kid_id) WHERE state='open';
CREATE TABLE practice_attempts (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 assignment_item_id TEXT NOT NULL REFERENCES assignment_items(id) ON DELETE CASCADE,
 session_id TEXT REFERENCES learning_sessions(id) ON DELETE SET NULL,
 idempotency_key TEXT NOT NULL,
 response_json TEXT,
 correctness TEXT NOT NULL CHECK(correctness IN ('correct','incorrect','ungraded')),
 grading_source TEXT NOT NULL,
 confidence REAL,
 independent INTEGER NOT NULL,
 hint_used INTEGER NOT NULL DEFAULT 0,
 answer_revealed INTEGER NOT NULL DEFAULT 0,
 read_aloud INTEGER NOT NULL DEFAULT 0,
 first_graded INTEGER NOT NULL DEFAULT 0,
 fresh INTEGER NOT NULL DEFAULT 0,
 created_at REAL NOT NULL,
 UNIQUE(kid_id,idempotency_key)
);
CREATE TABLE gap_chains (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 original_subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 trigger_assignment_id TEXT NOT NULL UNIQUE REFERENCES practice_assignments(id) ON DELETE CASCADE,
 status TEXT NOT NULL CHECK(status IN ('tracing','practicing','completed')),
 current_target_id TEXT REFERENCES catalog_subskills(id),
 stop_reason TEXT,
 created_at REAL NOT NULL,
 updated_at REAL NOT NULL
);
CREATE TABLE gap_chain_steps (
 chain_id TEXT NOT NULL REFERENCES gap_chains(id) ON DELETE CASCADE,
 position INTEGER NOT NULL,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 outcome TEXT NOT NULL CHECK(outcome IN ('checking','gap','passed','mastered')),
 assignment_id TEXT REFERENCES practice_assignments(id) ON DELETE SET NULL,
 PRIMARY KEY(chain_id,position),
 UNIQUE(chain_id,subskill_id)
);
CREATE TABLE model_audits (
 id TEXT PRIMARY KEY,
 kid_id TEXT REFERENCES kid_profiles(id) ON DELETE CASCADE,
 task TEXT NOT NULL,
 record_ref TEXT NOT NULL,
 model TEXT NOT NULL,
 prompt_version TEXT NOT NULL,
 catalog_revision TEXT NOT NULL,
 outcome TEXT NOT NULL,
 confidence REAL,
 explanation TEXT NOT NULL,
 created_at REAL NOT NULL
);
