"""Learning invariants with real SQLite/session isolation and stubbed models."""
import json
from datetime import datetime
from zoneinfo import ZoneInfo

import pytest

from backend.accounts.security import AccountError, SessionRecord
from backend.gap.catalog import seed_catalog
from backend.gap.config import CONFIG
from backend.gap.homework_models import VerificationDecision
from backend.gap.items import compile_practice_item
from backend.gap.models import Activity, AdultSubmit, Submit
from backend.gap.reducer import initial_state, reduce_state
from backend.gap import service
from backend.tests.account_helpers import create_child, mutate, select_child, unlock, picker


def event(seq, source='homework', correctness='incorrect', **extra):
    return dict(seq=seq, source=source, correctness=correctness, eligible=True, source_ref=f'p{seq}', created_at=1_900_000_000 + seq) | extra


def test_two_distinct_errors_and_no_replayed_check():
    state, actions = reduce_state(None, [event(1)], [], now=1_900_000_000)
    assert state['status'] == 'unassessed' and not actions
    state, actions = reduce_state(state, [event(2, source_ref='p1')], [])
    assert not actions
    state, actions = reduce_state(state, [event(3)], [])
    assert state['status'] == 'checking' and len(actions) == 1
    state, actions = reduce_state(state, [event(3), event(4)], [])
    assert not actions


@pytest.mark.parametrize('grades,status', [(['correct'] * 5, 'on_track'), (['incorrect'] + ['correct'] * 4, 'on_track'), (['incorrect'] * 2 + ['correct'] * 3, 'gap')])
def test_check_exact_complete_results_and_fresh_baseline(grades, status):
    state = initial_state() | dict(status='checking', incorrect_problem_ids=['p1', 'p2'])
    partial, _ = reduce_state(state, [], [dict(id='c', purpose='check', grades=grades[:-1])])
    assert partial['status'] == 'checking'
    state, _ = reduce_state(state, [], [dict(id='c', purpose='check', grades=grades)])
    assert state['status'] == status and state['incorrect_problem_ids'] == []
    if status == 'on_track':
        state, actions = reduce_state(state, [event(3)], [])
        assert state['status'] == 'on_track' and not actions


def test_ungraded_check_stays_pending():
    state, actions = reduce_state(initial_state() | {'status': 'checking'}, [], [dict(id='c', purpose='check', grades=['correct'] * 4 + ['ungraded'])])
    assert state['status'] == 'checking' and not actions


@pytest.mark.parametrize('status', ['checking', 'gap', 'practicing', 'mastered'])
def test_correct_homework_does_not_erase_existing_status(status):
    state, _ = reduce_state(initial_state() | {'status': status}, [event(1, correctness='correct')], [])
    assert state['status'] == status


def test_mastery_requires_independent_fresh_first_grade_and_two_local_dates():
    start = datetime(2030, 4, 2, 23, 59, tzinfo=ZoneInfo(CONFIG.timezone)).timestamp()
    state = initial_state() | dict(status='practicing')
    events = [event(i, source='practice', correctness='correct', hint_used=True) for i in range(1, 4)]
    state, _ = reduce_state(state, events, [])
    assert state['streak'] == 0
    events = [event(i, source='practice', correctness='correct', fresh=False) for i in range(4, 7)]
    state, _ = reduce_state(state, events, [])
    assert state['streak'] == 0
    for seq in range(7, 10):
        item = event(seq, source='practice', correctness='correct', read_aloud=True)
        item['created_at'] = start
        state, _ = reduce_state(state, [item], [])
    assert state['status'] == 'practicing' and state['streak'] == 3
    item = event(10, source='practice', correctness='correct')
    item['created_at'] = start + 120
    state, _ = reduce_state(state, [item], [])
    assert state['status'] == 'mastered' and state['next_recheck_date'] == '2030-04-24'


def test_wrong_practice_resets_streak_but_checks_cannot_create_it():
    state = initial_state() | dict(status='practicing', streak=2, streak_dates=['2030-04-01'])
    state, _ = reduce_state(state, [event(1, source='practice')], [])
    assert state['streak'] == 0 and state['streak_dates'] == []
    state, _ = reduce_state(state, [event(i, source='check', correctness='correct') for i in range(2, 8)], [])
    assert state['streak'] == 0


@pytest.mark.parametrize('grades,status', [(['correct', 'correct'], 'mastered'), (['incorrect', 'correct'], 'practicing'), (['incorrect', 'incorrect'], 'practicing')])
def test_recheck_outcomes(grades, status):
    state = initial_state() | dict(status='mastered', streak=3, streak_dates=['2030-01-01', '2030-01-02'])
    state, _ = reduce_state(state, [], [dict(id='r', purpose='recheck', grades=grades)], now=1_900_000_000)
    assert state['status'] == status
    assert bool(state['next_recheck_date']) == (status == 'mastered')
    if status == 'practicing':
        assert state['streak'] == 0


class FakeAdapter:
    counter = 100

    async def generate_items(self, subskill, count=3):
        result = []
        for _ in range(count):
            self.counter += 1
            compiled = compile_practice_item(question=f'{self.counter} + 1 = ?', answer=str(self.counter + 1), answer_type='Number', check_mode='Auto-checkable', grade=subskill['grade'])
            value = compiled.model_dump()
            value.update(readiness='pending', verified=False)
            result.append(value)
        return result

    async def verify_item(self, item):
        return VerificationDecision(verified=True, aligned_subskill=True, difficulty_match=True, method='stubbed_supported_exact_solver', explanation='Synthetic deterministic arithmetic.', independent_answer=item['answer'])


@pytest.fixture
def catalog(security_context, tmp_path):
    rows = []
    for skill_id, grade, first, root in [('3.OA.A.1', '3', 20, '2.OA.A.1-1'), ('2.OA.A.1', '2', 10, None), ('3.OA.A.2', '3', 30, '2.OA.A.1-1')]:
        rows.append(dict(skill_id=skill_id, subskill_id=skill_id + '-1', subject='Math', grade=grade, skill='Addition', subskill='Add one', p1_q=f'{first} + 1 = ?', p1_a=str(first + 1), p1_type='Number', p2_q=f'{first + 1} + 1 = ?', p2_a=str(first + 2), p2_type='Number', root_subskills=[root] if root else [], root_confidence='High', prerequisite_skills=[], check_mode='Auto-checkable', parent_explain='Work with one more.', home_tip='Try counters.'))
    path = tmp_path / 'catalog.json'
    path.write_text(json.dumps(rows))
    seed_catalog(security_context.db, path, now=security_context.clock.now())
    return rows


@pytest.fixture
def family(parent_client, security_context, catalog):
    child = create_child(parent_client).json()
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='parent'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], row['active_kid_profile_id'], row['parent_expires_at'], row['version'])
    return child, active


def record_errors(security, kid_id, subskill='3.OA.A.1-1', prefix='p'):
    for index in range(2):
        service.record_homework_evidence(security, kid_id, f'{prefix}{index}', subskill, 'incorrect', True, .95, question=f'{prefix} distinct question {index}')


def assignment(security, kid_id, subskill):
    with security.db.transaction() as conn:
        return dict(conn.execute("SELECT * FROM practice_assignments WHERE kid_id=? AND subskill_id=? AND status IN ('open','awaiting_items')", (kid_id, subskill)).fetchone())


def items(security, assignment_id):
    with security.db.transaction() as conn:
        return [dict(row) for row in conn.execute('SELECT ai.*,p.answer,p.readiness FROM assignment_items ai JOIN practice_items p ON p.id=ai.item_id WHERE assignment_id=? ORDER BY position', (assignment_id,))]


@pytest.mark.asyncio
async def test_persistent_errors_check_chain_shared_root_and_waiting_descendants(security_context, family, clock, parent_client):
    child, active = family
    record_errors(security_context, child['id'])
    record_errors(security_context, child['id'], '3.OA.A.2-1', 'other')
    for target in ('3.OA.A.1-1', '3.OA.A.2-1'):
        check = assignment(security_context, child['id'], target)
        await service.prepare_assignment(security_context, check['id'], child['id'], active, adapter=FakeAdapter())
        check_items = items(security_context, check['id'])
        assert len(check_items) == 5
        for index, item in enumerate(check_items):
            body = AdultSubmit(assignmentItemId=item['id'], idempotencyKey=f'{target}-{index}', correctness='incorrect' if index < 2 else 'correct', independent=True)
            await service.submit_response(security_context, child['id'], body, active, adult=True)
    root = assignment(security_context, child['id'], '2.OA.A.1-1')
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM practice_assignments WHERE subskill_id='2.OA.A.1-1' AND status='awaiting_items'").fetchone()[0] == 1
        assert conn.execute("SELECT COUNT(*) FROM gap_chains WHERE status='tracing'").fetchone()[0] == 2
    await service.prepare_assignment(security_context, root['id'], child['id'], active, adapter=FakeAdapter())
    for index, item in enumerate(items(security_context, root['id'])):
        await service.submit_response(security_context, child['id'], AdultSubmit(assignmentItemId=item['id'], idempotencyKey=f'root-{index}', correctness='incorrect' if index < 2 else 'correct', independent=True), active, adult=True)
    with security_context.db.transaction() as conn:
        assert {row[0] for row in conn.execute('SELECT current_target_id FROM gap_chains')} == {'2.OA.A.1-1'}
        assert service._state(conn, child['id'], '3.OA.A.1-1')['status'] == 'gap'
        assert service._state(conn, child['id'], '2.OA.A.1-1')['status'] == 'practicing'
    practice = assignment(security_context, child['id'], '2.OA.A.1-1')
    await service.prepare_assignment(security_context, practice['id'], child['id'], active, adapter=FakeAdapter())
    practice_items = items(security_context, practice['id'])
    for index, item in enumerate(practice_items[:2]):
        await service.submit_response(security_context, child['id'], AdultSubmit(assignmentItemId=item['id'], idempotencyKey=f'practice-{index}', correctness='correct', independent=True, readAloud=True), active, adult=True)
    clock.advance(86400)
    assert unlock(parent_client).status_code == 200
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='parent'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], None, row['parent_expires_at'], row['version'])
    item = practice_items[2]
    await service.submit_response(security_context, child['id'], AdultSubmit(assignmentItemId=item['id'], idempotencyKey='practice-2', correctness='correct', independent=True), active, adult=True)
    with security_context.db.transaction() as conn:
        assert service._state(conn, child['id'], '2.OA.A.1-1')['status'] == 'mastered'
        assert {row[0] for row in conn.execute('SELECT current_target_id FROM gap_chains')} == {'3.OA.A.1-1', '3.OA.A.2-1'}
        assert service._state(conn, child['id'], '3.OA.A.1-1')['status'] == 'practicing'


def test_reducer_full_history_replay_matches_incremental():
    events = [event(1), event(2)] + [event(i, source='check', correctness='incorrect') for i in range(3, 8)]
    for seq in range(8, 11):
        item = event(seq, source='practice', correctness='correct')
        item['created_at'] += 86400 if seq == 10 else 0
        events.append(item)
    completed = [dict(id='c', purpose='check', grades=['incorrect'] * 5, completion_seq=7)]
    replayed, _ = reduce_state(None, events, completed)
    incremental = None
    for item in events:
        incremental, _ = reduce_state(incremental, [item], completed if item['seq'] >= 7 else [])
    assert replayed == incremental and replayed['status'] == 'mastered'


def test_duplicate_question_and_unmapped_never_manufacture_errors(security_context, family):
    child, _ = family
    for index in range(3):
        service.record_homework_evidence(security_context, child['id'], f'p{index}', '3.OA.A.1-1', 'incorrect', True, .95, question='Same question')
    service.record_homework_evidence(security_context, child['id'], 'unreadable', None, 'ungraded', False, .1, question='Unknown')
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT SUM(eligible) FROM learning_evidence').fetchone()[0] == 1
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 4
        assert not conn.execute('SELECT 1 FROM practice_assignments').fetchone()


@pytest.mark.asyncio
async def test_provider_failure_keeps_awaiting_items_no_partial_check(security_context, family):
    child, active = family
    record_errors(security_context, child['id'])
    class Failed:
        async def generate_items(self, *args, **kwargs):
            raise RuntimeError('private provider response must not escape')
    check = assignment(security_context, child['id'], '3.OA.A.1-1')
    await service.prepare_assignment(security_context, check['id'], child['id'], active, adapter=Failed())
    assert items(security_context, check['id']) == []
    check = assignment(security_context, child['id'], '3.OA.A.1-1')
    assert check['status'] == 'awaiting_items' and check['preparation_error'] == 'provider_unavailable'


@pytest.mark.asyncio
async def test_retry_submission_once_and_ungraded_remains_pending(security_context, family):
    child, active = family
    record_errors(security_context, child['id'])
    check = assignment(security_context, child['id'], '3.OA.A.1-1')
    await service.prepare_assignment(security_context, check['id'], child['id'], active, adapter=FakeAdapter())
    item = items(security_context, check['id'])[0]
    unclear = AdultSubmit(assignmentItemId=item['id'], idempotencyKey='unclear', correctness='ungraded', independent=False)
    await service.submit_response(security_context, child['id'], unclear, active, adult=True)
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT graded_attempt_id FROM assignment_items WHERE id=?', (item['id'],)).fetchone()[0] is None
    body = AdultSubmit(assignmentItemId=item['id'], idempotencyKey='first-grade', correctness='correct', independent=True)
    result = await service.submit_response(security_context, child['id'], body, active, adult=True)
    assert result == await service.submit_response(security_context, child['id'], body, active, adult=True)
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM practice_attempts WHERE idempotency_key='first-grade'").fetchone()[0] == 1
        assert conn.execute('SELECT SUM(eligible) FROM learning_evidence WHERE source=\'check\'').fetchone()[0] == 1


@pytest.mark.asyncio
async def test_child_dto_no_answers_resume_and_activity_bound(security_context, family, parent_client, clock):
    child, _ = family
    record_errors(security_context, child['id'])
    select_child(parent_client, child['id'])
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='kid'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], 'kid', child['id'], None, row['version'])
    first = await service.get_next_practice(security_context, child['id'], active, adapter=FakeAdapter())
    again = await service.get_next_practice(security_context, child['id'], active, adapter=FakeAdapter())
    assert len(first['items']) == 5 and first['sessionId'] == again['sessionId']
    assert not any(word in json.dumps(first) for word in ('gradingSpec', 'exactFraction', 'answer_type', 'expectedResponse'))
    clock.advance(300)
    service.record_activity(security_context, child['id'], first['sessionId'], Activity(activeSeconds=120), active)
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT active_seconds FROM learning_sessions').fetchone()[0] == 120


def test_parent_dashboard_real_unassessed_and_sibling_isolation(security_context, family, parent_client):
    child, active = family
    other = create_child(parent_client, name='Other').json()
    record_errors(security_context, child['id'])
    dash = service.parent_dashboard(security_context, active.account_id, other['id'], expected_session=active)
    assert dash['sample'] is False and all(skill['status'] == 'unassessed' for skill in dash['skills'])
    assert dash['analytics']['problemsAttempted'] == 0
    assert all(not skill['evidence'] for skill in dash['skills'])


def test_stale_profile_snapshot_cannot_write_evidence(security_context, family, parent_client):
    child, active = family
    select_child(parent_client, child['id'])
    with pytest.raises(AccountError):
        service.record_homework_evidence(security_context, child['id'], 'p', '3.OA.A.1-1', 'incorrect', True, .9, question='Q', expected_session=active)


@pytest.mark.parametrize('removed', [['p0'], ['p0', 'p1']])
def test_delete_upload_evidence_replays_unconfirmed_state(security_context, family, removed):
    child, active = family
    record_errors(security_context, child['id'])
    service.remove_homework_evidence(security_context, child['id'], removed, expected_session=active)
    with security_context.db.transaction() as conn:
        assert service._state(conn, child['id'], '3.OA.A.1-1')['status'] == 'unassessed'
        assert conn.execute("SELECT COUNT(*) FROM practice_assignments WHERE status IN ('open','awaiting_items')").fetchone()[0] == 0


def test_learning_api_csrf_parent_mode_and_child_scope(security_context, family, parent_client, monkeypatch):
    from backend import main
    child, _ = family
    sibling = create_child(parent_client, name='Sibling').json()
    monkeypatch.setitem(main.app.state._state, 'gap_adapter', FakeAdapter())
    record_errors(security_context, child['id'])
    assert parent_client.post('/api/learning/kid/next').status_code == 403
    assert mutate(parent_client, 'POST', '/api/learning/kid/next').status_code == 403
    assert select_child(parent_client, child['id']).status_code == 200
    result = mutate(parent_client, 'POST', '/api/learning/kid/next')
    assert result.status_code == 200 and len(result.json()['items']) == 5
    item = result.json()['items'][0]
    assert parent_client.get(f"/api/learning/parent/{child['id']}/dashboard").status_code == 403
    assert select_child(parent_client, sibling['id']).status_code == 200
    response = mutate(parent_client, 'POST', '/api/learning/kid/submit', json=dict(assignmentItemId=item['assignmentItemId'], idempotencyKey='sibling-theft', response='21'))
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_due_recheck_exact_two_and_miss_resumes_practice(security_context, family, parent_client, clock):
    child, _ = family
    with security_context.db.transaction() as conn:
        state = initial_state() | dict(status='mastered', next_recheck_date=CONFIG.date(clock.now()))
        service._save_state(conn, child['id'], '3.OA.A.1-1', state, clock.now())
    select_child(parent_client, child['id'])
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='kid'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], child['id'], None, row['version'])
    session = await service.get_next_practice(security_context, child['id'], active, adapter=FakeAdapter())
    assert len(session['items']) == 2 and {item['purpose'] for item in session['items']} == {'recheck'}
    for index, item in enumerate(session['items']):
        await service.submit_response(security_context, child['id'], Submit(assignmentItemId=item['assignmentItemId'], idempotencyKey=f'recheck{index}', response='0'), active, adapter=False)
    with security_context.db.transaction() as conn:
        assert service._state(conn, child['id'], '3.OA.A.1-1')['status'] == 'practicing'
        assert conn.execute("SELECT 1 FROM practice_assignments WHERE purpose='practice' AND status='awaiting_items'").fetchone()


@pytest.mark.asyncio
async def test_adult_needed_items_read_aloud_and_unclear_queue(security_context, family, parent_client):
    from backend.gap.catalog_models import CompiledItem
    from backend.gap.items import save_generated_item
    child, active = family
    with security_context.db.transaction() as conn:
        conn.execute("UPDATE kid_profiles SET grade='K' WHERE id=?", (child['id'],))
        for index in range(5):
            compiled = compile_practice_item(question=f'Say the number {index}.', answer=str(index), answer_type='Say / do aloud', grade='K', home_tip='Give time to respond.')
            save_generated_item(conn, '3.OA.A.1-1', f'adult-{index}', compiled, now=security_context.clock.now())
        task = service._assignment(conn, child['id'], '3.OA.A.1-1', 'practice', security_context.clock.now())
    await service.prepare_assignment(security_context, task['id'], child['id'], active, adapter=False)
    queue = await service.adult_queue(security_context, child['id'], active)
    assert queue['items'] and all(item['readAloud'] == 'Read this aloud to your child' for item in queue['items'])
    item = queue['items'][0]
    assert item['expectedResponse'] is not None and item['rubric']
    result = await service.submit_response(security_context, child['id'], AdultSubmit(assignmentItemId=item['assignmentItemId'], idempotencyKey='adult-unclear', correctness='ungraded', independent=False), active, adult=True)
    assert not result['assignmentComplete']


@pytest.mark.parametrize('mode,reason', [('cycle', 'cycle_or_visited'), ('passed', 'root_passed'), ('none', 'no_valid_root')])
def test_runtime_root_order_cycles_and_stop_reasons(security_context, family, monkeypatch, mode, reason):
    from backend.gap import catalog as catalog_module
    child, _ = family
    target, root = '3.OA.A.1-1', '2.OA.A.1-1'
    def roots(conn, subskill):
        if mode == 'none':
            return [dict(target_id=root, confidence='low', usable=True)]
        if subskill == target:
            return [dict(target_id='3.OA.A.2-1', confidence='low', usable=True), dict(target_id=root, confidence='medium', usable=True)]
        return [dict(target_id=target, confidence='high', usable=True)]
    monkeypatch.setattr(catalog_module, 'get_roots', roots)
    with security_context.db.transaction() as conn:
        now = security_context.clock.now()
        service._save_state(conn, child['id'], target, initial_state() | dict(status='gap'), now)
        service._save_state(conn, child['id'], root, initial_state() | dict(status='on_track' if mode == 'passed' else 'gap', last_check_outcome='passed' if mode == 'passed' else 'gap'), now)
        task = service._assignment(conn, child['id'], target, 'check', now)
        conn.execute("UPDATE practice_assignments SET status='completed',completed_at=? WHERE id=?", (now, task['id']))
        conn.execute("INSERT INTO gap_chains VALUES ('chain',?,?,?,'tracing',NULL,NULL,?,?)", (child['id'], target, task['id'], now, now))
        conn.execute("INSERT INTO gap_chain_steps VALUES ('chain',0,?,'gap',?)", (target, task['id']))
        service._progress_chains(conn, child['id'], now)
        chain = conn.execute("SELECT * FROM gap_chains WHERE id='chain'").fetchone()
        assert chain['stop_reason'] == reason
        assert chain['current_target_id'] == (root if mode == 'cycle' else target)
        assert not conn.execute("SELECT 1 FROM skill_states WHERE subskill_id='3.OA.A.2-1'").fetchone()


def test_unresolved_early_reading_teacher_suggestion_after_two_rounds(security_context, family):
    child, active = family
    with security_context.db.transaction() as conn:
        now = security_context.clock.now()
        conn.execute("UPDATE kid_profiles SET grade='1' WHERE id=?", (child['id'],))
        conn.execute("UPDATE catalog_subskills SET subject='Reading/ELA' WHERE id='3.OA.A.1-1'")
        service._save_state(conn, child['id'], '3.OA.A.1-1', initial_state() | dict(status='practicing'), now)
        for _ in range(2):
            task = service._assignment(conn, child['id'], '3.OA.A.1-1', 'practice', now)
            conn.execute("UPDATE practice_assignments SET status='completed',completed_at=? WHERE id=?", (now, task['id']))
    dashboard = service.parent_dashboard(security_context, active.account_id, child['id'], expected_session=active)
    skill = next(item for item in dashboard['skills'] if item['id'] == '3.OA.A.1-1')
    assert skill['teacherSuggestion'] == 'Consider talking with your child’s teacher about this.'


@pytest.mark.asyncio
@pytest.mark.parametrize('closed_status', ['cancelled', 'completed'])
async def test_closed_assignment_cannot_create_evidence_or_mastery(security_context, family, closed_status):
    child, active = family
    with security_context.db.transaction() as conn:
        service._save_state(conn, child['id'], '3.OA.A.1-1', initial_state() | dict(status='practicing'), security_context.clock.now())
        task = service._assignment(conn, child['id'], '3.OA.A.1-1', 'practice', security_context.clock.now())
    await service.prepare_assignment(security_context, task['id'], child['id'], active, adapter=FakeAdapter())
    item = items(security_context, task['id'])[0]
    with security_context.db.transaction() as conn:
        conn.execute('UPDATE practice_assignments SET status=? WHERE id=?', (closed_status, task['id']))
    with pytest.raises(AccountError) as error:
        await service.submit_response(security_context, child['id'], AdultSubmit(assignmentItemId=item['id'], idempotencyKey='closed-first', correctness='correct', independent=True), active, adult=True)
    assert error.value.code == 'activity_closed'
    with security_context.db.transaction() as conn:
        assert not conn.execute('SELECT 1 FROM practice_attempts').fetchone()
        assert not conn.execute('SELECT 1 FROM learning_evidence').fetchone()
        assert service._state(conn, child['id'], '3.OA.A.1-1')['streak'] == 0


@pytest.mark.asyncio
async def test_completed_assignment_replays_accepted_key_but_rejects_new_attempt(security_context, family):
    child, active = family
    record_errors(security_context, child['id'])
    task = assignment(security_context, child['id'], '3.OA.A.1-1')
    await service.prepare_assignment(security_context, task['id'], child['id'], active, adapter=FakeAdapter())
    for index, item in enumerate(items(security_context, task['id'])):
        body = AdultSubmit(assignmentItemId=item['id'], idempotencyKey=f'complete-{index}', correctness='correct', independent=True)
        last = await service.submit_response(security_context, child['id'], body, active, adult=True)
    assert last['assignmentComplete']
    assert await service.submit_response(security_context, child['id'], body, active, adult=True) == last
    replacement = body.model_copy(update={'idempotencyKey': 'closed-new-key'})
    with pytest.raises(AccountError) as error:
        await service.submit_response(security_context, child['id'], replacement, active, adult=True)
    assert error.value.code == 'activity_closed'
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM practice_attempts').fetchone()[0] == 5


@pytest.mark.asyncio
async def test_assignment_cancelled_during_grading_cannot_accept_result(security_context, family, parent_client, monkeypatch):
    from backend.gap import vision
    from backend.gap.homework_models import GradeDecision
    child, parent_active = family
    record_errors(security_context, child['id'])
    task = assignment(security_context, child['id'], '3.OA.A.1-1')
    await service.prepare_assignment(security_context, task['id'], child['id'], parent_active, adapter=FakeAdapter())
    item = items(security_context, task['id'])[0]
    select_child(parent_client, child['id'])
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='kid'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], child['id'], None, row['version'])
    async def cancelled_during_call(*args, **kwargs):
        with security_context.db.transaction() as conn:
            conn.execute("UPDATE practice_assignments SET status='cancelled' WHERE id=?", (task['id'],))
        return GradeDecision(correctness='correct', source='deterministic', confidence=1, explanation='Synthetic grade.')
    monkeypatch.setattr(vision, 'grade_response', cancelled_during_call)
    with pytest.raises(AccountError) as error:
        await service.submit_response(security_context, child['id'], Submit(assignmentItemId=item['id'], idempotencyKey='closed-during-call', response=item['answer']), active, adapter=FakeAdapter())
    assert error.value.code == 'activity_closed'
    with security_context.db.transaction() as conn:
        assert not conn.execute('SELECT 1 FROM practice_attempts').fetchone()
        assert conn.execute("SELECT COUNT(*) FROM learning_evidence WHERE source='check'").fetchone()[0] == 0


@pytest.mark.asyncio
async def test_concurrent_key_reuse_for_different_slot_is_rejected(security_context, family, parent_client, monkeypatch):
    from backend.gap import vision
    from backend.gap.homework_models import GradeDecision
    child, parent_active = family
    record_errors(security_context, child['id'])
    task = assignment(security_context, child['id'], '3.OA.A.1-1')
    await service.prepare_assignment(security_context, task['id'], child['id'], parent_active, adapter=FakeAdapter())
    first, second = items(security_context, task['id'])[:2]
    select_child(parent_client, child['id'])
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE mode='kid'").fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], child['id'], None, row['version'])
    async def concurrent_first_submission(*args, **kwargs):
        await service.submit_response(security_context, child['id'], Submit(assignmentItemId=first['id'], idempotencyKey='concurrent-key', response=first['answer']), active, adapter=False)
        return GradeDecision(correctness='correct', source='deterministic', confidence=1, explanation='Synthetic grade.')
    monkeypatch.setattr(vision, 'grade_response', concurrent_first_submission)
    with pytest.raises(AccountError) as error:
        await service.submit_response(security_context, child['id'], Submit(assignmentItemId=second['id'], idempotencyKey='concurrent-key', response=second['answer']), active, adapter=FakeAdapter())
    assert error.value.code == 'idempotency_conflict'
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM practice_attempts').fetchone()[0] == 1
        assert conn.execute('SELECT graded_attempt_id FROM assignment_items WHERE id=?', (second['id'],)).fetchone()[0] is None


def test_new_chain_waits_for_shared_root_check_despite_prior_pass(security_context, family):
    child, _ = family
    root = '2.OA.A.1-1'
    targets = ('3.OA.A.1-1', '3.OA.A.2-1')
    with security_context.db.transaction() as conn:
        now = security_context.clock.now()
        # A previously passed prerequisite has new homework errors and is being
        # checked again. Its old outcome cannot stand in for the pending episode.
        service._save_state(conn, child['id'], root, initial_state() | dict(status='checking', episode=3, last_check_outcome='passed'), now)
        pending = service._assignment(conn, child['id'], root, 'check', now)
        for index, target in enumerate(targets):
            service._save_state(conn, child['id'], target, initial_state() | dict(status='gap'), now)
            trigger = service._assignment(conn, child['id'], target, 'check', now)
            conn.execute("UPDATE practice_assignments SET status='completed',completed_at=? WHERE id=?", (now, trigger['id']))
            chain_id = f'new-descendant-{index}'
            conn.execute("INSERT INTO gap_chains VALUES (?,?,?,?,'tracing',NULL,NULL,?,?)", (chain_id, child['id'], target, trigger['id'], now, now))
            conn.execute("INSERT INTO gap_chain_steps VALUES (?,0,?,'gap',?)", (chain_id, target, trigger['id']))
        # First traversal adds the existing root check. A second traversal also
        # exercises outcome refresh for the recorded root step.
        service._progress_chains(conn, child['id'], now)
        service._progress_chains(conn, child['id'], now)
        chains = conn.execute('SELECT * FROM gap_chains ORDER BY id').fetchall()
        assert len(chains) == 2
        assert all(chain['status'] == 'tracing' and chain['current_target_id'] is None and chain['stop_reason'] is None for chain in chains)
        steps = conn.execute('SELECT * FROM gap_chain_steps WHERE subskill_id=?', (root,)).fetchall()
        assert len(steps) == 2 and all(step['outcome'] == 'checking' and step['assignment_id'] == pending['id'] for step in steps)
        assert conn.execute("SELECT COUNT(*) FROM practice_assignments WHERE subskill_id=? AND status IN ('open','awaiting_items')", (root,)).fetchone()[0] == 1
        assert all(service._state(conn, child['id'], target)['status'] == 'gap' for target in targets)
