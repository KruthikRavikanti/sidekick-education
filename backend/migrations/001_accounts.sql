CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    parent_pin_hash TEXT,
    failed_pin_attempts INTEGER NOT NULL DEFAULT 0,
    pin_locked_until REAL,
    created_at REAL NOT NULL
);
CREATE TABLE kid_profiles (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    grade TEXT NOT NULL CHECK (grade IN ('K','1','2','3','4','5')),
    avatar_key TEXT NOT NULL CHECK (avatar_key IN ('fox','owl','bear','bunny','cat','panda')),
    created_at REAL NOT NULL
);
CREATE INDEX kids_account ON kid_profiles(account_id);
CREATE TABLE sessions (
    token_digest TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    expires_at REAL NOT NULL,
    revoked_at REAL,
    mode TEXT NOT NULL DEFAULT 'picker' CHECK (mode IN ('picker','kid','parent')),
    active_kid_profile_id TEXT REFERENCES kid_profiles(id) ON DELETE SET NULL,
    parent_last_activity_at REAL,
    parent_expires_at REAL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at REAL NOT NULL,
    CHECK ((mode = 'kid' AND active_kid_profile_id IS NOT NULL) OR (mode != 'kid' AND active_kid_profile_id IS NULL))
);
CREATE INDEX sessions_account ON sessions(account_id);
CREATE TABLE csrf_tokens (
    token_digest TEXT PRIMARY KEY,
    session_digest TEXT REFERENCES sessions(token_digest) ON DELETE CASCADE,
    expires_at REAL NOT NULL
);
CREATE TABLE rate_limits (
    key TEXT PRIMARY KEY,
    attempts INTEGER NOT NULL,
    window_start REAL NOT NULL
);
