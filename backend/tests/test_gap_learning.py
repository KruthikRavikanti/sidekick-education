"""Homework observations stay scoped and never schedule a removed quiz workflow."""
import json
import sqlite3

import pytest

from backend.accounts.database import Database, ROOT
from backend.accounts.security import AccountError, SessionRecord
from backend.gap.catalog import seed_catalog
from backend.gap.reducer import initial_state, reduce_state
from backend.gap import service
from backend.tests.account_helpers import create_child, mutate, select_child, picker, unlock


SUBSKILL = '3.OA.A.1-1'


def event(seq, source='homework', correctness='incorrect', **extra):
    return dict(seq=seq, source=source, correctness=correctness, eligible=True,
                source_ref=f'p{seq}', created_at=1_900_000_000 + seq) | extra


@pytest.fixture
def family(parent_client, security_context):
    seed_catalog(security_context.db)
    child = create_child(parent_client).json()
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='parent'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], None,
                               row['parent_expires_at'], row['version'])
    return child, active


def record(security, child, index, correctness='incorrect', *, eligible=True, confidence=.95, question=None, fingerprint=None):
    return service.record_homework_evidence(security, child['id'], f'p{index}', SUBSKILL,
        correctness, eligible, confidence, question=question or f'Distinct homework question {index}', fingerprint=fingerprint)


def test_two_distinct_errors_are_observations_without_diagnostic_actions():
    first, actions = reduce_state(None, [event(1)])
    assert first['status'] == 'unassessed' and not actions
    repeated, actions = reduce_state(first, [event(2, source_ref='p1')])
    assert repeated['incorrect_count'] == 1 and not actions
    supported, actions = reduce_state(repeated, [event(3)])
    assert supported['status'] == 'needs_support' and supported['incorrect_count'] == 2 and not actions
    assert not any(key in supported for key in ('streak', 'streak_dates', 'next_recheck_date', 'episode'))


@pytest.mark.parametrize('source', ['check', 'practice', 'recheck'])
def test_removed_workflow_events_and_assignment_results_never_claim_progress(source):
    state, actions = reduce_state(None, [event(i, source=source, correctness='correct') for i in range(1, 8)],
                                  [dict(id='old', purpose=source, grades=['correct'] * 5)])
    assert state['status'] == 'unassessed' and not state['observations'] and not actions


def test_only_usable_homework_contributes_and_correct_is_not_mastery():
    events = [event(1, correctness='ungraded'), event(2, eligible=False),
              event(3, correctness='correct'), event(4, correctness='incorrect', eligible=False)]
    state, actions = reduce_state(None, events)
    assert state['status'] == 'on_track' and state['correct_count'] == 1
    state, _ = reduce_state(state, [event(5), event(6)])
    assert state['status'] == 'needs_support'
    state, _ = reduce_state(state, [event(7, correctness='correct')])
    assert state['status'] == 'needs_support' and not actions


def test_evidence_retries_duplicates_and_low_confidence_do_not_schedule_work(security_context, family):
    child, _ = family
    first = record(security_context, child, 1, fingerprint='same-question')
    same = record(security_context, child, 1, fingerprint='same-question')
    duplicate = record(security_context, child, 2, fingerprint='same-question')
    record(security_context, child, 3, confidence=.59)
    record(security_context, child, 4, correctness='ungraded')
    assert first['evidenceId'] == same['evidenceId'] and not duplicate['eligible']
    assert record(security_context, child, 5)['state']['status'] == 'needs_support'
    with security_context.db.transaction() as conn:
        assert not conn.execute('SELECT 1 FROM practice_assignments').fetchone()
        assert not conn.execute('SELECT 1 FROM gap_chains').fetchone()
        assert not conn.execute('SELECT 1 FROM learning_sessions').fetchone()
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence WHERE eligible=1').fetchone()[0] == 2


def test_delete_homework_recomputes_observations_without_discarding_other_history(security_context, family):
    child, active = family
    record(security_context, child, 1)
    record(security_context, child, 2)
    with security_context.db.transaction() as conn:
        conn.execute("INSERT INTO learning_evidence(kid_id,subskill_id,source,source_ref,correctness,eligible,created_at) VALUES(?,?,'practice','historical','correct',1,?)", (child['id'], SUBSKILL, security_context.clock.now()))
    service.remove_homework_evidence(security_context, child['id'], ['p1'], expected_session=active)
    with security_context.db.transaction() as conn:
        assert service._state(conn, child['id'], SUBSKILL)['status'] == 'unassessed'
        assert conn.execute("SELECT 1 FROM learning_evidence WHERE source='practice'").fetchone()
    service.remove_homework_evidence(security_context, child['id'], ['p2'], expected_session=active)
    with security_context.db.transaction() as conn:
        assert service._state(conn, child['id'], SUBSKILL)['observations'] == {}


def test_parent_dashboard_is_read_only_and_homework_only(security_context, family, monkeypatch):
    child, active = family
    record(security_context, child, 1)
    record(security_context, child, 2)
    with security_context.db.transaction() as conn:
        conn.execute("INSERT INTO learning_evidence(kid_id,subskill_id,source,source_ref,correctness,eligible,created_at) VALUES(?,?,'practice','old-mastered','correct',1,?)", (child['id'], '3.OA.A.2-1', security_context.clock.now()))
    original_connect = security_context.db.connect
    statements = []
    def traced_connection():
        connection = original_connect()
        connection.set_trace_callback(statements.append)
        return connection
    monkeypatch.setattr(security_context.db, 'connect', traced_connection)
    data = service.parent_dashboard(security_context, active.account_id, child['id'], expected_session=active)
    assert not any(statement.lstrip().upper().startswith(('INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP')) for statement in statements)
    with security_context.db.transaction() as conn:
        assert not conn.execute('SELECT 1 FROM practice_assignments').fetchone()
    by_id = {skill['id']: skill for skill in data['skills']}
    assert by_id[SUBSKILL]['status'] == 'needs_support'
    assert by_id['3.OA.A.2-1']['status'] == 'unassessed'
    assert all(skill['traceback'] == [] and skill['currentPracticeTarget'] is None for skill in data['skills'])
    assert set(skill['status'] for skill in data['skills']) <= {'unassessed', 'on_track', 'needs_support'}
    assert data['analytics']['sessionsThisWeek'] == data['analytics']['timeSpentMinutes'] == 0


def test_homework_analytics_use_first_usable_grade_per_question_even_when_unmapped(security_context, family):
    child, _ = family
    with security_context.db.transaction() as conn:
        now = security_context.clock.now()
        conn.execute("INSERT INTO homework_uploads(id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at) VALUES('upload',?,'hash','opaque','image/png','[]','fixture','completed','completed',?,?)", (child['id'], now, now))
        for index, (fingerprint, grade) in enumerate([('one', None), ('one', 'correct'), ('one', 'incorrect'), ('two', 'ungraded'), ('three', 'incorrect'), ('four', 'correct')]):
            conn.execute("INSERT INTO homework_problems(id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,fingerprint,teacher_marks_json,grading_json,created_at) VALUES(?,'upload',?,1,?,'label','{}','[]',?,'[]',?,?)", (f'problem-{index}', child['id'], index, fingerprint, json.dumps({'correctness': grade}) if grade else None, now))
        metrics = service._homework_metrics(conn, child['id'])
    assert metrics == dict(sessionsThisWeek=0, timeSpentMinutes=0, problemsAttempted=4, problemsCorrect=2, problemsUngraded=1)


@pytest.mark.parametrize('path', ['/api/learning/kid/next', '/api/learning/kid/submit', '/api/learning/kid/session/old/activity'])
def test_retired_kid_routes_refuse_all_work_without_mutating(parent_client, security_context, family, path):
    child, _ = family
    select_child(parent_client, child['id'])
    response = mutate(parent_client, 'POST', path, json={})
    assert response.status_code == 410 and response.json()['error']['code'] == 'feature_removed'
    with security_context.db.transaction() as conn:
        assert not conn.execute('SELECT 1 FROM practice_attempts').fetchone()
        assert not conn.execute('SELECT 1 FROM practice_assignments').fetchone()
        assert not conn.execute('SELECT 1 FROM learning_sessions').fetchone()
    assert parent_client.post(path, json={}, headers={'Origin': 'http://testserver'}).status_code == 403


@pytest.mark.parametrize('suffix,method', [('adult', 'GET'), ('adult/submit', 'POST'), ('extra-practice', 'POST')])
def test_retired_parent_routes_retain_mode_and_ownership_isolation(parent_client, family, suffix, method):
    child, _ = family
    path = f"/api/learning/parent/{child['id']}/{suffix}"
    response = parent_client.get(path) if method == 'GET' else mutate(parent_client, method, path, json={})
    assert response.status_code == 410 and response.json()['error']['code'] == 'feature_removed'
    foreign = f'/api/learning/parent/foreign/{suffix}'
    response = parent_client.get(foreign) if method == 'GET' else mutate(parent_client, method, foreign, json={})
    assert response.status_code == 404
    select_child(parent_client, child['id'])
    response = parent_client.get(path) if method == 'GET' else mutate(parent_client, method, path, json={})
    assert response.status_code == 403


def test_dashboard_and_evidence_cannot_cross_child_or_switched_context(security_context, family, parent_client):
    child, active = family
    sibling = create_child(parent_client, name='Maya', grade='1').json()
    record(security_context, child, 1)
    record(security_context, child, 2)
    other = service.parent_dashboard(security_context, active.account_id, sibling['id'], expected_session=active)
    assert all(skill['status'] == 'unassessed' and not skill['evidence'] for skill in other['skills'])
    select_child(parent_client, child['id'])
    with pytest.raises(AccountError):
        service.record_homework_evidence(security_context, child['id'], 'late', SUBSKILL, 'incorrect', True, .9, question='Late work', expected_session=active)


def test_migration_retires_work_rebuilds_observations_and_preserves_history(tmp_path):
    # Apply exactly the old schema, populate a real scoped family, then upgrade.
    from backend.gap.items import compile_practice_item, save_generated_item
    db = Database('sqlite:///' + str(tmp_path / 'old.db'))
    db.path.parent.mkdir(parents=True, exist_ok=True)
    conn = db.connect()
    conn.execute('CREATE TABLE schema_migrations(version TEXT PRIMARY KEY)')
    for migration in sorted((ROOT / 'backend/migrations').glob('*.sql')):
        if migration.name.startswith('005'):
            break
        for statement in migration.read_text().split(';'):
            if statement.strip(): conn.execute(statement)
        conn.execute('INSERT INTO schema_migrations VALUES(?)', (migration.name,))
    conn.close()
    # Create source records using the old schema with explicit synthetic IDs.
    with db.transaction() as conn:
        conn.execute("INSERT INTO accounts(id,email,password_hash,created_at) VALUES('account','synthetic@example.test','not-used',1)")
        conn.execute("INSERT INTO kid_profiles(id,account_id,first_name,grade,avatar_key,created_at) VALUES('kid','account','Synthetic','3','fox',1)")
    seed_catalog(db)
    with db.transaction() as conn:
        compiled = compile_practice_item(question='1 + 1 = ?', answer='2', answer_type='Number', check_mode='Auto-checkable')
        item = save_generated_item(conn, SUBSKILL, 'historical-item', compiled, now=1)
        conn.execute("INSERT INTO skill_states VALUES('kid',?,'mastered',?,1)", (SUBSKILL, json.dumps({'status': 'mastered', 'streak': 3, 'next_recheck_date': '2030-01-01'})))
        conn.execute("INSERT INTO practice_assignments(id,kid_id,subskill_id,purpose,status,required_count,episode,created_at) VALUES('assignment','kid',?,'practice','open',5,1,1)", (SUBSKILL,))
        conn.execute("INSERT INTO assignment_items(id,assignment_id,item_id,position,fingerprint) VALUES('slot','assignment',?,0,'fingerprint')", (item['id'],))
        conn.execute("INSERT INTO learning_sessions VALUES('session','kid','open','[\"assignment\"]',1,1,60,NULL)")
        conn.execute("INSERT INTO practice_attempts VALUES('attempt','kid','slot','session','key','\"2\"','correct','deterministic',1,1,0,0,0,1,1,1)")
        for index in range(2):
            conn.execute("INSERT INTO learning_evidence(kid_id,subskill_id,source,source_ref,fingerprint,correctness,eligible,created_at) VALUES('kid',?,'homework',?,?,'incorrect',1,1)", (SUBSKILL, f'p{index}', f'question-{index}'))
        conn.execute("INSERT INTO gap_chains VALUES('chain','kid',?,'assignment','practicing',?,NULL,1,1)", (SUBSKILL, SUBSKILL))
    db.migrate()
    db.migrate()
    with db.transaction() as conn:
        state = conn.execute('SELECT * FROM skill_states').fetchone()
        assert state['status'] == 'needs_support' and json.loads(state['state_json'])['incorrect_count'] == 2
        assert 'next_recheck_date' not in json.loads(state['state_json'])
        assert json.loads(conn.execute('SELECT state_json FROM retired_skill_states').fetchone()[0])['status'] == 'mastered'
        assert conn.execute('SELECT status FROM practice_assignments').fetchone()[0] == 'cancelled'
        assert conn.execute('SELECT COUNT(*) FROM practice_attempts').fetchone()[0] == 1
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 2
        assert conn.execute('SELECT state FROM learning_sessions').fetchone()[0] == 'completed'
        assert conn.execute('SELECT status,stop_reason FROM gap_chains').fetchone()[1] == 'standalone_practice_removed'
        with pytest.raises(sqlite3.IntegrityError):
            conn.execute("UPDATE skill_states SET status='checking'")
