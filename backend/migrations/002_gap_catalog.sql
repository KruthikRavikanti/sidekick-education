CREATE TABLE catalog_revisions (
    id TEXT PRIMARY KEY,
    source_filename TEXT NOT NULL,
    imported_at REAL NOT NULL,
    report_json TEXT NOT NULL
);
CREATE TABLE catalog_skills (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    name TEXT NOT NULL,
    raw_json TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    revision TEXT NOT NULL REFERENCES catalog_revisions(id),
    active INTEGER NOT NULL DEFAULT 1,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);
CREATE TABLE catalog_subskills (
    id TEXT PRIMARY KEY,
    skill_id TEXT NOT NULL REFERENCES catalog_skills(id),
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    name TEXT NOT NULL,
    subskill_order INTEGER NOT NULL,
    raw_json TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    revision TEXT NOT NULL REFERENCES catalog_revisions(id),
    active INTEGER NOT NULL DEFAULT 1,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);
CREATE INDEX catalog_subskills_scope ON catalog_subskills(subject, grade, active);
CREATE TABLE catalog_row_versions (
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    raw_json TEXT NOT NULL,
    revision TEXT NOT NULL REFERENCES catalog_revisions(id),
    created_at REAL NOT NULL,
    PRIMARY KEY(entity_type, entity_id, content_hash)
);
CREATE TABLE catalog_roots (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES catalog_subskills(id),
    target_id TEXT NOT NULL,
    rank INTEGER NOT NULL,
    confidence TEXT NOT NULL,
    raw_confidence TEXT NOT NULL,
    usable INTEGER NOT NULL,
    reason TEXT,
    revision TEXT NOT NULL REFERENCES catalog_revisions(id),
    active INTEGER NOT NULL DEFAULT 1,
    UNIQUE(source_id, rank, revision)
);
CREATE INDEX catalog_roots_source ON catalog_roots(source_id, active, rank);
CREATE TABLE catalog_prerequisites (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES catalog_skills(id),
    target_id TEXT NOT NULL,
    rank INTEGER NOT NULL,
    source_text TEXT NOT NULL,
    usable INTEGER NOT NULL,
    reason TEXT,
    revision TEXT NOT NULL REFERENCES catalog_revisions(id),
    active INTEGER NOT NULL DEFAULT 1,
    UNIQUE(source_id, target_id, revision)
);
CREATE TABLE practice_items (
    id TEXT PRIMARY KEY,
    logical_id TEXT NOT NULL,
    subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
    source TEXT NOT NULL CHECK(source IN ('seed', 'generated')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    answer_type TEXT NOT NULL,
    original_json TEXT NOT NULL,
    context_json TEXT NOT NULL,
    response_spec_json TEXT NOT NULL,
    grading_spec_json TEXT NOT NULL,
    readiness TEXT NOT NULL CHECK(readiness IN ('pending', 'ready', 'adult_required', 'missing_context')),
    verified INTEGER NOT NULL DEFAULT 0,
    verification_method TEXT NOT NULL,
    verification_result_json TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    catalog_revision TEXT NOT NULL REFERENCES catalog_revisions(id),
    active INTEGER NOT NULL DEFAULT 1,
    created_at REAL NOT NULL,
    UNIQUE(logical_id, content_hash)
);
CREATE UNIQUE INDEX practice_items_current ON practice_items(logical_id) WHERE active=1;
CREATE INDEX practice_items_available ON practice_items(subskill_id, active, readiness, verified);
