"""Source provenance and immutable activity versions survive safe reseeding."""
import csv
import hashlib
import json

import pytest

from backend.activities.library import DEFAULT_ACTIVITIES, DEFAULT_SOURCES, REQUIRED_SOURCE_COLUMNS, load_sources, seed_library, source_id
from backend.activities.models import ActivitySpec
from backend.gap.catalog import seed_catalog
from backend.tests.account_helpers import create_child


def write_sources(path, rows):
    with path.open('w', newline='', encoding='utf-8') as stream:
        writer = csv.DictWriter(stream, fieldnames=REQUIRED_SOURCE_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    return path


def source_row(**overrides):
    return {'Source': 'Synthetic reference', 'What it says, in our words': 'A provided design note.',
            'Where we used it': 'Original test activity', 'Link': 'https://example.test/reference'} | overrides


def test_supplied_csv_is_preserved_and_only_imported_as_provenance():
    assert hashlib.sha256(DEFAULT_SOURCES.read_bytes()).hexdigest() == '77abb65b85cdc1a8b18f2e19843f31c2bfb3b829c048c3ec938e59d099f5e3d7'
    sources = load_sources()
    assert len(sources) == 11 and len({row['id'] for row in sources}) == 11
    assert all(set(REQUIRED_SOURCE_COLUMNS) <= set(row['raw']) for row in sources)
    assert all('spec' not in row for row in sources)
    assert sources[-1]['raw']['Link'] == 'sidekick_skill_map_v2.json'


def test_source_identity_survives_descriptive_edits(tmp_path):
    path = write_sources(tmp_path / 'sources.csv', [source_row()])
    original = load_sources(path)[0]
    path = write_sources(path, [source_row(Source='A corrected source title')])
    changed = load_sources(path)[0]
    assert original['id'] == changed['id'] == source_id('https://example.test/reference')
    assert original['content_hash'] != changed['content_hash']


@pytest.mark.parametrize('rows,error', [
    ([source_row(), source_row()], 'duplicates a reference'),
    ([source_row(Link='javascript:alert(1)')], 'unsupported reference link'),
    ([source_row(Link='https://user:secret@example.test/reference')], 'unsupported reference link'),
    ([source_row(Source='')], 'missing reference fields'),
])
def test_invalid_sources_are_rejected_before_import(tmp_path, rows, error):
    with pytest.raises(ValueError, match=error):
        load_sources(write_sources(tmp_path / 'sources.csv', rows))


def write_manifest(path, manifest):
    path.write_text(json.dumps(manifest))
    return path


def test_imports_eleven_references_and_two_clearly_original_verified_examples(security_context):
    db = security_context.db
    seed_catalog(db)
    report = seed_library(db, now=10)
    assert report['referenceRowsImported'] == 11
    assert report['originalExamplesImported'] == 2
    assert report['workbookActivityDefinitionsImported'] == 0
    assert not report['issues']
    with db.transaction() as conn:
        rows = conn.execute('SELECT * FROM activity_versions WHERE active=1').fetchall()
        assert {row['subskill_id'] for row in rows} == {'3.NF.A.1-2', 'L.3.1-2'}
        assert all(row['origin'] == 'original_example' and row['verified'] for row in rows)
        assert conn.execute('SELECT COUNT(*) FROM activity_sources WHERE active=1').fetchone()[0] == 11
        for row in rows:
            spec = ActivitySpec.model_validate_json(row['spec_json'])
            assert len(spec.scenes) == 3 and spec.scenes[-1].phase == 'independent'
            assert all(scene.phase == 'guided' for scene in spec.scenes[:-1])
    repeated = seed_library(db, now=11)
    assert repeated['unchanged'] and repeated['activities'] == report['activities']
    with db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 2
        assert conn.execute('SELECT COUNT(*) FROM activity_library_revisions').fetchone()[0] == 1


def test_edits_retirement_and_reactivation_preserve_exact_session_versions(parent_client, security_context, tmp_path):
    db = security_context.db
    seed_catalog(db)
    child = create_child(parent_client).json()
    first = seed_library(db, now=10)
    old_id = first['activities'][0]['versionId']
    with db.transaction() as conn:
        original = conn.execute('SELECT spec_json FROM activity_versions WHERE id=?', (old_id,)).fetchone()[0]
        conn.execute("INSERT INTO activity_sessions(id,kid_id,activity_version_id,subskill_id,status,current_scene,started_at,completed_at) VALUES('past',?,?,'3.NF.A.1-2','completed',2,1,2)", (child['id'], old_id))
        conn.execute("INSERT INTO activity_attempts(id,session_id,scene_id,request_key,phase,response_json,response_text,correct,hint_used,created_at) VALUES('response','past','independent','request','independent','\"3/8\"','3/8',1,0,2)")
    manifest = json.loads(DEFAULT_ACTIVITIES.read_text())
    manifest['activities'][0]['spec']['title'] = 'Equal Pieces: A Revised Original'
    manifest['activities'] = manifest['activities'][:1]
    path = write_manifest(tmp_path / 'activities.json', manifest)
    edited = seed_library(db, activities_path=path, now=12)
    assert edited['activities'][0]['version'] == 2 and not edited['unchanged']
    with db.transaction() as conn:
        history = conn.execute("SELECT v.spec_json,v.active,a.response_text FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id JOIN activity_attempts a ON a.session_id=s.id WHERE s.id='past'").fetchone()
        assert history['spec_json'] == original and not history['active'] and history['response_text'] == '3/8'
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE activity_id='original-word-lab' AND active=1").fetchone()[0] == 0
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 3
    reactivated = seed_library(db, now=13)
    assert not reactivated['unchanged'] and reactivated['activities'][0]['versionId'] == old_id
    with db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 3
        assert conn.execute('SELECT active FROM activity_versions WHERE id=?', (old_id,)).fetchone()[0] == 1


def test_changed_source_wording_keeps_immutable_provenance_snapshot(security_context, tmp_path):
    db = security_context.db
    seed_catalog(db)
    original = seed_library(db, now=10)
    with DEFAULT_SOURCES.open(newline='', encoding='utf-8-sig') as stream:
        rows = list(csv.DictReader(stream))
    old_summary = rows[0]['What it says, in our words']
    rows[0]['What it says, in our words'] = 'A reviewed provenance note.'
    changed_path = write_sources(tmp_path / 'sources.csv', rows)
    changed = seed_library(db, sources_path=changed_path, now=11)
    assert changed['revision'] != original['revision']
    assert changed['activities'] == original['activities']
    with db.transaction() as conn:
        past = json.loads(conn.execute('SELECT sources_json FROM activity_library_revisions WHERE id=?', (original['revision'],)).fetchone()[0])
        assert past[0]['What it says, in our words'] == old_summary
        source = conn.execute('SELECT raw_json FROM activity_sources WHERE id=?', (source_id(rows[0]['Link']),)).fetchone()
        assert json.loads(source[0])['What it says, in our words'] == 'A reviewed provenance note.'


def test_invalid_skill_context_and_components_are_reported_and_not_served(security_context, tmp_path):
    db = security_context.db
    seed_catalog(db)
    seed_library(db)
    manifest = json.loads(DEFAULT_ACTIVITIES.read_text())
    invalid = json.loads(json.dumps(manifest['activities'][0]))
    invalid['id'] = 'missing-skill'
    invalid['spec']['subskillId'] = 'not-in-the-catalog'
    context = json.loads(json.dumps(manifest['activities'][1]))
    context['id'] = 'missing-context'
    context['spec']['scenes'][0]['prompt'] = 'Use the story above. One mouse, two ___. Build the plural word.'
    component = json.loads(json.dumps(manifest['activities'][0]))
    component['id'] = 'unsupported-control'
    component['spec']['scenes'][0]['component'] = 'arbitrary_html'
    manifest['activities'] = [invalid, context, component]
    report = seed_library(db, activities_path=write_manifest(tmp_path / 'activities.json', manifest))
    assert report['originalExamplesImported'] == 0
    assert len(report['issues']) == 3
    assert {row['code'] for row in report['issues']} == {'missing_skill_link', 'unsupported_interaction', 'missing_context'}
    with db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM activity_versions WHERE origin='original_example' AND active=1").fetchone()[0] == 0
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 2


def test_invalid_source_file_leaves_previous_library_untouched(security_context, tmp_path):
    db = security_context.db
    seed_catalog(db)
    original = seed_library(db)
    invalid = write_sources(tmp_path / 'sources.csv', [source_row(), source_row()])
    with pytest.raises(ValueError, match='duplicates a reference'):
        seed_library(db, sources_path=invalid)
    with db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_library_revisions').fetchone()[0] == 1
        assert conn.execute('SELECT COUNT(*) FROM activity_versions WHERE active=1').fetchone()[0] == 2
        assert conn.execute('SELECT id FROM activity_library_revisions').fetchone()[0] == original['revision']


def test_reseeding_does_not_retire_verified_generated_activities(security_context):
    db = security_context.db
    seed_catalog(db)
    report = seed_library(db)
    with db.transaction() as conn:
        existing = conn.execute('SELECT * FROM activity_versions WHERE id=?', (report['activities'][0]['versionId'],)).fetchone()
        spec = json.loads(existing['spec_json'])
        spec['title'] = 'A previously generated equivalent activity'
        conn.execute('''INSERT INTO activity_versions(id,activity_id,version,spec_json,spec_sha256,subskill_id,subject,grade,
            misconception_tags_json,origin,verified,source_revision,model,prompt_version,component_version,created_at,active)
            VALUES('generated-version','generated-activity',1,?,'generated-hash',?,'math',3,?,'model_generated',1,?,'stub','stub','stub',1,1)''',
            (json.dumps(spec), existing['subskill_id'], existing['misconception_tags_json'], report['revision']))
    seed_library(db)
    with db.transaction() as conn:
        assert conn.execute("SELECT active FROM activity_versions WHERE id='generated-version'").fetchone()[0] == 1
