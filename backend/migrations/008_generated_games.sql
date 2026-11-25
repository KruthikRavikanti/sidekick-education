CREATE TABLE game_versions (
 id TEXT PRIMARY KEY,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 subject TEXT NOT NULL CHECK(subject IN ('math','ela')),
 grade INTEGER NOT NULL,
 title TEXT NOT NULL,
 premise TEXT NOT NULL,
 idea TEXT NOT NULL,
 emoji TEXT NOT NULL,
 code TEXT NOT NULL,
 css TEXT NOT NULL,
 source_sha256 TEXT NOT NULL UNIQUE,
 manifest_json TEXT NOT NULL,
 kit_version TEXT NOT NULL,
 origin TEXT NOT NULL CHECK(origin IN ('seed_example','model_generated')),
 model TEXT NOT NULL,
 prompt_version TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('verified','approved','retired')),
 robot_report_json TEXT NOT NULL,
 review_json TEXT,
 created_at REAL NOT NULL,
 decided_at REAL,
 decided_by TEXT REFERENCES accounts(id) ON DELETE SET NULL,
 decision_note TEXT
);
CREATE INDEX game_matches ON game_versions(subskill_id,status);
CREATE TABLE game_jobs (
 id TEXT PRIMARY KEY,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 status TEXT NOT NULL CHECK(status IN ('queued','running','done','failed')),
 game_version_id TEXT REFERENCES game_versions(id) ON DELETE SET NULL,
 failure_json TEXT,
 lease_until REAL,
 created_at REAL NOT NULL,
 updated_at REAL NOT NULL
);
CREATE UNIQUE INDEX one_open_game_job ON game_jobs(subskill_id) WHERE status IN ('queued','running');
CREATE TABLE game_runs (
 id TEXT PRIMARY KEY,
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 upload_id TEXT REFERENCES homework_uploads(id) ON DELETE SET NULL,
 game_version_id TEXT NOT NULL REFERENCES game_versions(id),
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 seed INTEGER NOT NULL,
 message_token TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('in_progress','completed')),
 result_json TEXT,
 started_at REAL NOT NULL,
 completed_at REAL
);
CREATE INDEX game_runs_by_kid ON game_runs(kid_id,started_at);
CREATE TABLE game_start_requests (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 request_key TEXT NOT NULL,
 run_id TEXT NOT NULL REFERENCES game_runs(id) ON DELETE CASCADE,
 created_at REAL NOT NULL,
 PRIMARY KEY(kid_id,request_key)
)
