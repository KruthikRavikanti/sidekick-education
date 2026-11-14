"""Explicit, versioned imports. Source and activity strings are data, not instructions."""
import csv
import hashlib
import json
import re
import time
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

from backend.accounts.database import ROOT


DEFAULT_SOURCES = ROOT / 'data/activities/sources.csv'
DEFAULT_ACTIVITIES = ROOT / 'data/activities/original_examples.json'
REQUIRED_SOURCE_COLUMNS = ('Source', 'What it says, in our words', 'Where we used it', 'Link')
IMPORTER_VERSION = 'sidekick-activity-library-v1'
MISSING_CONTEXT = re.compile(r'\b(?:passage|story|article|text)\s+(?:above|below|provided)\b|\b(?:from|in)\s+(?:the|this)\s+(?:passage|story|article)\b', re.I)


def canonical_json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def content_hash(value):
    return hashlib.sha256(canonical_json(value).encode()).hexdigest()


def source_id(link):
    """A reference keeps its identity when its descriptive wording changes."""
    return 'src_' + hashlib.sha256(link.strip().encode()).hexdigest()[:20]


def load_sources(path=DEFAULT_SOURCES):
    path = Path(path)
    if path.stat().st_size > 2 * 1024 * 1024:
        raise ValueError('Activity source file exceeds the import limit.')
    with path.open(newline='', encoding='utf-8-sig') as stream:
        reader = csv.DictReader(stream)
        if not set(REQUIRED_SOURCE_COLUMNS).issubset(reader.fieldnames or []):
            raise ValueError('Activity source file is missing required columns.')
        sources, seen = [], set()
        for number, row in enumerate(reader, 2):
            if number > 10001 or any(value is None or not isinstance(value, str) or len(value) > 20000 for value in row.values()):
                raise ValueError('Activity source row exceeds the import limit.')
            if any(not row[column].strip() for column in REQUIRED_SOURCE_COLUMNS):
                raise ValueError(f'Activity source row {number} has missing reference fields.')
            link = row['Link'].strip()
            parsed = urlparse(link)
            if link != 'sidekick_skill_map_v2.json' and (parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password):
                raise ValueError(f'Activity source row {number} has an unsupported reference link.')
            identity = source_id(link)
            if identity in seen:
                raise ValueError(f'Activity source row {number} duplicates a reference.')
            seen.add(identity)
            sources.append({'id': identity, 'row': number, 'raw': row, 'content_hash': content_hash(row)})
    return sources


def _read_manifest(path):
    path = Path(path)
    if path.stat().st_size > 2 * 1024 * 1024:
        raise ValueError('Activity definitions exceed the import limit.')
    manifest = json.loads(path.read_text())
    if not isinstance(manifest, dict) or manifest.get('schemaVersion') != '1.0' or not isinstance(manifest.get('activities'), list):
        raise ValueError('Activity definitions require a version1.0 activities manifest.')
    if len(manifest['activities']) > 1000:
        raise ValueError('Activity definitions exceed the row limit.')
    return manifest


def _validated_rows(connection, manifest, source_ids):
    from .models import ActivitySpec
    rows = manifest['activities']
    counts = Counter(row.get('id') for row in rows if isinstance(row, dict) and isinstance(row.get('id'), str))
    valid, issues = [], []
    for index, entry in enumerate(rows, 1):
        identity = entry.get('id') if isinstance(entry, dict) else None
        code = None
        spec = None
        if not isinstance(identity, str) or not re.fullmatch(r'[a-zA-Z0-9_.-]{1,80}', identity):
            code = 'invalid_activity_id'
        elif counts[identity] != 1:
            code = 'duplicate_activity_id'
        elif entry.get('origin', 'original_example') != 'original_example':
            code = 'unsupported_import_origin'
        else:
            raw_spec = entry.get('spec')
            raw_skill = raw_spec.get('subskillId') if isinstance(raw_spec, dict) else None
            if not isinstance(raw_skill, str) or not connection.execute('SELECT 1 FROM catalog_subskills WHERE id=? AND active=1', (raw_skill,)).fetchone():
                code = 'missing_skill_link'
            elif isinstance(raw_spec.get('scenes'), list) and any(isinstance(scene, dict) and scene.get('component') not in {'fraction_builder', 'number_line', 'word_tiles', 'word_choice', 'independent_fraction', 'independent_word'} for scene in raw_spec['scenes']):
                code = 'unsupported_interaction'
            elif isinstance(raw_spec.get('scenes'), list) and any(isinstance(scene, dict) and isinstance(scene.get('prompt'), str) and MISSING_CONTEXT.search(scene['prompt']) for scene in raw_spec['scenes']):
                code = 'missing_context'
            else:
                try:
                    spec = ActivitySpec.model_validate(raw_spec)
                except (TypeError, ValueError, ArithmeticError):
                    code = 'invalid_or_unsupported_activity_spec'
        if spec:
            skill = connection.execute('SELECT subject,grade,raw_json FROM catalog_subskills WHERE id=? AND active=1', (spec.subskillId,)).fetchone()
            if not skill:
                code = 'missing_skill_link'
            elif skill['subject'] != {'math': 'Math', 'ela': 'Reading/ELA'}[spec.subject] or skill['grade'] != str(spec.grade):
                code = 'incompatible_skill_link'
            elif not spec.sourceRefs or set(spec.sourceRefs) - source_ids:
                code = 'missing_source_reference'
        if code:
            # No provider output or source text in errors. Review the original
            # row by its stable ID and manifest index in the supplied data file.
            issues.append({'row': index, 'activityId': identity if isinstance(identity, str) else None, 'code': code})
        else:
            valid.append((identity, spec))
    return valid, issues


def seed_library(database, sources_path=DEFAULT_SOURCES, activities_path=DEFAULT_ACTIVITIES, *, now=None):
    """Atomically import references and verified originals without changing history.

    Reseeding retires removed/invalid original definitions from future selection.
    Existing sessions retain their exact immutable version. Generated versions
    are separate and are never retired by this source-manifest import.
    """
    from .models import COMPONENT_VERSION, PROMPT_VERSION
    sources_path, activities_path = Path(sources_path), Path(activities_path)
    sources = load_sources(sources_path)
    manifest = _read_manifest(activities_path)
    source_sha = hashlib.sha256(sources_path.read_bytes()).hexdigest()
    revision = 'alr_' + content_hash({'sources': [row['raw'] for row in sources], 'manifest': manifest, 'importer': IMPORTER_VERSION})[:40]
    now = time.time() if now is None else now
    imported = []
    with database.transaction() as connection:
        valid, issues = _validated_rows(connection, manifest, {row['id'] for row in sources})
        active_specs = {(row['activity_id'], row['spec_sha256']) for row in connection.execute("SELECT activity_id,spec_sha256 FROM activity_versions WHERE origin='original_example' AND active=1")}
        expected_specs = {(identity, content_hash(spec.model_dump())) for identity, spec in valid}
        active_sources = {(row['id'], row['source_revision']) for row in connection.execute('SELECT id,source_revision FROM activity_sources WHERE active=1')}
        unchanged = bool(connection.execute('SELECT 1 FROM activity_library_revisions WHERE id=?', (revision,)).fetchone()) and active_specs == expected_specs and active_sources == {(row['id'], revision) for row in sources}
        connection.execute('INSERT OR IGNORE INTO activity_library_revisions(id,source_sha256,imported_at,source_count,sources_json) VALUES(?,?,?,?,?)',
                           (revision, source_sha, now, len(sources), canonical_json([row['raw'] for row in sources])))
        connection.execute('UPDATE activity_sources SET active=0')
        for source in sources:
            raw = source['raw']
            connection.execute('''INSERT INTO activity_sources(id,source,summary,used_in,link,source_revision,raw_json,active)
                VALUES(?,?,?,?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET source=excluded.source,summary=excluded.summary,
                used_in=excluded.used_in,link=excluded.link,source_revision=excluded.source_revision,raw_json=excluded.raw_json,active=1''',
                (source['id'], raw['Source'], raw['What it says, in our words'], raw['Where we used it'], raw['Link'], revision, canonical_json(raw)))
        connection.execute("UPDATE activity_versions SET active=0 WHERE origin='original_example'")
        for identity, spec in valid:
            spec_json = canonical_json(spec.model_dump())
            digest = hashlib.sha256(spec_json.encode()).hexdigest()
            existing = connection.execute('SELECT id,activity_id,version FROM activity_versions WHERE spec_sha256=?', (digest,)).fetchone()
            if existing and existing['activity_id'] != identity:
                # The same content cannot silently acquire a different identity.
                issues.append({'activityId': identity, 'code': 'duplicate_activity_content'})
                continue
            if existing:
                item_id, version = existing['id'], existing['version']
                connection.execute('UPDATE activity_versions SET active=1 WHERE id=?', (item_id,))
            else:
                version = connection.execute('SELECT COALESCE(MAX(version),0)+1 FROM activity_versions WHERE activity_id=?', (identity,)).fetchone()[0]
                item_id = 'av_' + content_hash({'activityId': identity, 'specSha256': digest})[:40]
                connection.execute('''INSERT INTO activity_versions(id,activity_id,version,spec_json,spec_sha256,subskill_id,
                    subject,grade,misconception_tags_json,origin,verified,source_revision,model,prompt_version,component_version,created_at,active)
                    VALUES(?,?,?,?,?,?,?,?,?,'original_example',1,?,'',?,?,?,1)''',
                    (item_id, identity, version, spec_json, digest, spec.subskillId, spec.subject, spec.grade,
                     canonical_json(spec.misconceptionTags), revision, PROMPT_VERSION, COMPONENT_VERSION, now))
            imported.append({'activityId': identity, 'versionId': item_id, 'version': version, 'subskillId': spec.subskillId,
                             'title': spec.title, 'origin': 'original_example'})
    return {'revision': revision, 'sourceSha256': source_sha, 'referenceRowsImported': len(sources),
            'workbookActivityDefinitionsImported': 0, 'originalExamplesImported': len(imported),
            'unchanged': unchanged, 'issues': issues, 'activities': imported}
