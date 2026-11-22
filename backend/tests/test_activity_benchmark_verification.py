"""Verification copies use synthetic ownership and never alter evaluation history."""
import json
from pathlib import Path
import sqlite3
import stat
import tempfile
import uuid

import pytest
from starlette.requests import Request

from backend.accounts.settings import Settings
from backend.activity_engine_v2.composer import ApprovedProgram, SemanticReview
from backend.activity_engine_v2.service import _hash, start_approved
from backend.tests.program_composition_examples import make_program
from scripts.prepare_activity_benchmark_verification import prepare


def source_benchmark(client, security):
    program = make_program('tile')
    program.provenance = program.provenance.model_copy(update=dict(origin='ai_composed', model='synthetic-provider', promptVersion='synthetic-v1'))
    digest = _hash(program.model_dump())
    review = SemanticReview(definitionHash=digest, approved=True, targetNecessary=True,
        meaningfulConsequences=True, materialsSuitable=True, goalAchievable=True, helpRelevant=True,
        scoringCorrectAcrossRoutes=True, shortcutsPrevented=True, parentAssessmentAppropriate=True,
        requiresParentReview=False, reasonCode='approved', summary='Synthetic review receipt for isolation test.')
    approved = ApprovedProgram(program, digest, 'synthetic-provider', ['synthetic-returned'], review, 2, [])
    token = client.cookies.get(security.settings.session_cookie)
    active = security.session(Request({'type': 'http', 'headers': [(b'cookie', ('sidekick_session='+token).encode())]}))
    with security.db.transaction() as connection:
        view = start_approved(connection, security, active.active_kid_profile_id, approved, active)
        source = uuid.uuid4().hex
        connection.execute('''INSERT INTO homework_uploads(id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at)
            VALUES(?,?,?,'private-original','image/png','[]','fixture','completed','completed',?,?)''',
            (source, active.active_kid_profile_id, uuid.uuid4().hex, security.clock.now(), security.clock.now()))
        record = dict(id=uuid.uuid4().hex, account=active.account_id, kid=active.active_kid_profile_id, upload=source,
            context=json.dumps(dict(grade='3')), target=json.dumps(dict(id=program.intent.targets[0].skillId)),
            session=view['id'], review=review.model_dump_json(), digest=digest, now=security.clock.now())
        connection.execute('''INSERT INTO activity_program_generations
            (id,account_id,kid_id,upload_id,status,stage,context_json,private_sources_json,target_json,
             session_id,requested_model,returned_models_json,model_calls_json,review_json,approved_definition_sha256,call_count,created_at,updated_at)
            VALUES(:id,:account,:kid,:upload,'ready','ready',:context,'{}',:target,:session,
                   'synthetic-provider','["synthetic-returned"]','[]',:review,:digest,2,:now,:now)''', record)
    return dict(success=True, localUrl='http://localhost:3000/kid/activity-preview/'+view['id'], definitionHash=digest)


def database_dump(path):
    connection = sqlite3.connect('file:'+str(path)+'?mode=ro', uri=True)
    try:
        return '\n'.join(connection.iterdump())
    finally:
        connection.close()


def test_preparer_copies_exact_approved_definition_to_synthetic_account_without_source_writes(kid_client, security_context, tmp_path):
    report = source_benchmark(kid_client, security_context)
    report_path, browser, config = tmp_path/'report.json', tmp_path/'state.json', tmp_path/'config.json'
    report_path.write_text(json.dumps(report))
    before = database_dump(security_context.db.path)
    settings = Settings(database_url='sqlite:///'+str(security_context.db.path), app_env='development',
                        password_policy='dev', cookie_secure=False, trusted_origins=('http://localhost:3000',))
    result = prepare(report_path, browser, config, security_context.db.path, source_settings=settings)
    assert result == dict(success=True, privateConfig=str(config.resolve()))
    assert database_dump(security_context.db.path) == before
    copied_report = json.loads(report_path.read_text())
    private = json.loads(config.read_text())
    database = Path(private['databaseUrl'].removeprefix('sqlite:///'))
    assert database.parent == Path(tempfile.gettempdir()).resolve()
    assert database.name.startswith('sidekick-benchmark-')
    assert stat.S_IMODE(database.stat().st_mode) == 0o600
    assert stat.S_IMODE(browser.stat().st_mode) == stat.S_IMODE(config.stat().st_mode) == 0o600
    assert copied_report['localUrl'] == report['localUrl']
    assert copied_report['evaluationPreparationUnchanged']
    assert copied_report['verificationIsolation'] == 'synthetic_separate_database'
    assert len(copied_report['verificationAttempts']) == 2
    assert copied_report['verificationPristineId'] not in {item['id'] for item in copied_report['verificationAttempts']}
    connection = sqlite3.connect(database)
    try:
        assert connection.execute('SELECT COUNT(*) FROM homework_uploads').fetchone()[0] == 0
        assert connection.execute('SELECT COUNT(*) FROM catalog_subskills').fetchone()[0] == 0
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0] == 3
        assert connection.execute('SELECT COUNT(*) FROM activity_program_events').fetchone()[0] == 0
        assert connection.execute('SELECT definition_sha256 FROM activity_program_versions').fetchone()[0] == report['definitionHash']
        source_id = report['localUrl'].split('/')[-1]
        assert connection.execute('SELECT 1 FROM activity_program_sessions WHERE id=?', (source_id,)).fetchone() is None
    finally:
        connection.close()
        database.unlink()


def test_preparer_rejects_wrong_approval_hash_before_creating_private_outputs(kid_client, security_context, tmp_path):
    report = source_benchmark(kid_client, security_context)
    report['definitionHash'] = '0'*64
    report_path, browser, config = tmp_path/'report.json', tmp_path/'state.json', tmp_path/'config.json'
    report_path.write_text(json.dumps(report))
    before = database_dump(security_context.db.path)
    settings = Settings(database_url='sqlite:///'+str(security_context.db.path), app_env='development',
                        password_policy='dev', cookie_secure=False, trusted_origins=('http://localhost:3000',))
    with pytest.raises(ValueError, match='owned_ready_approved_benchmark_required'):
        prepare(report_path, browser, config, security_context.db.path, source_settings=settings)
    assert not browser.exists() and not config.exists()
    assert database_dump(security_context.db.path) == before
