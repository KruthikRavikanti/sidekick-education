"""The earlier activity system is retired. Its code and routes are gone; its stored history is kept and cleaned up with the child."""
from pathlib import Path

import pytest

from backend import main
from backend.gap.catalog import seed_catalog
from backend.gap.storage import file_path, save_bytes
from backend.tests.account_helpers import create_child, mutate, select_child


def test_the_activity_module_and_its_routes_no_longer_exist(parent_client):
    # A stale `__pycache__` folder may linger in an old checkout, so look for source, not for the folder.
    assert not list((Path(main.__file__).parent / 'activities').glob('*.py'))
    child = create_child(parent_client).json()
    select_child(parent_client, child['id'])
    assert parent_client.get('/api/activities/kid/suggestion', params={'uploadId': 'any'}).status_code == 404
    assert mutate(parent_client, 'POST', '/api/activities/kid/start', json={'uploadId': 'any', 'idempotencyKey': 'a' * 12}).status_code == 404
    # A recording upload path gets no special body allowance any more.
    assert mutate(parent_client, 'POST', '/api/activities/kid/sessions/any/recording', content=b'x' * 70_000,
                  headers={'Content-Type': 'application/octet-stream'}).status_code in {404, 413}


@pytest.fixture
def old_activity(parent_client, security_context):
    """A finished activity with a voice recording, the way the retired system stored one."""
    seed_catalog(security_context.db)
    child = create_child(parent_client).json()
    recording = save_bytes(security_context, b'synthetic private recording')
    now = security_context.clock.now()
    with security_context.db.transaction() as conn:
        conn.execute("INSERT INTO activity_library_revisions VALUES('rev','sha',?,0,'[]')", (now,))
        conn.execute("""INSERT INTO activity_versions(id,activity_id,version,spec_json,spec_sha256,subskill_id,subject,grade,misconception_tags_json,origin,verified,source_revision,model,prompt_version,component_version,created_at)
                        VALUES('version','activity',1,'{}','spec-sha','3.NF.A.1-2','math',3,'[]','original_example',1,'rev','','','',?)""", (now,))
        conn.execute("INSERT INTO activity_sessions(id,kid_id,activity_version_id,subskill_id,status,started_at,completed_at) VALUES('session',?,'version','3.NF.A.1-2','completed',?,?)", (child['id'], now, now))
        conn.execute("INSERT INTO activity_attempts(id,session_id,scene_id,request_key,phase,response_json,response_text,correct,created_at) VALUES('attempt','session','final','key','independent','{}','3/4',1,?)", (now,))
        conn.execute("INSERT INTO activity_recordings(id,kid_id,session_id,scene_id,request_key,file_ref,content_sha256,mime,byte_count,created_at) VALUES('recording',?,'session','final','key',?,'sha','audio/webm',27,?)", (child['id'], recording, now))
    return child, recording


def test_old_activity_history_is_kept_and_removed_with_the_child(parent_client, security_context, old_activity):
    child, recording = old_activity
    # Running migrations again leaves the history alone.
    security_context.db.migrate()
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 1
        assert conn.execute('SELECT response_text FROM activity_attempts').fetchone()[0] == '3/4'
    assert file_path(security_context, recording).is_file()
    # Deleting the child removes that child's old sessions, attempts and the private recording file.
    assert mutate(parent_client, 'DELETE', f"/api/parent/profiles/{child['id']}").status_code == 200
    with security_context.db.transaction() as conn:
        for table in ('activity_sessions', 'activity_attempts', 'activity_recordings'):
            assert conn.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0] == 0
        # Reusable definitions held no child data and stay as history.
        assert conn.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] == 1
    assert not file_path(security_context, recording).exists()
