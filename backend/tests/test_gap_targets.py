"""Which skill a page of uploaded work points at, and so which game a child is offered."""
import json
import uuid

import pytest

from backend.accounts.security import SessionRecord
from backend.games import library
from backend.gap import targets
from backend.gap.catalog import get_subskill, seed_catalog
from backend.gap.service import _homework_state, record_homework_evidence
from backend.tests.account_helpers import create_child, mutate, picker, select_child, signup, setup_pin, unlock

MATH, ELA, ALGEBRA = '3.NF.A.1-2', 'L.3.1-2', 'A-SSE.A.1-1'
REPORT = {'passed': True, 'kit': 'kit-1', 'stats': {}, 'checks': [{'name': 'boots', 'ok': True, 'detail': ''}],
          'manifest': {'rounds': [{'id': 'a', 'phase': 'solo', 'say': 'Go', 'mistakes': [{'tag': 't'}]}]}}


def key():
    return uuid.uuid4().hex


@pytest.fixture(autouse=True)
def games_on(monkeypatch):
    monkeypatch.setenv('SIDEKICK_GAMES_ENABLED', 'true')
    monkeypatch.setenv('SIDEKICK_GAMES_REQUIRE_APPROVAL', 'true')
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'false')


@pytest.fixture
def family(parent_client, security_context):
    seed_catalog(security_context.db)
    child = create_child(parent_client).json()
    select_child(parent_client, child['id'])
    return child, parent_client


def new_upload(security, child, state='completed'):
    upload_id, now = key(), security.clock.now()
    with security.db.transaction() as conn:
        conn.execute("INSERT INTO homework_uploads(id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at) VALUES(?,?,?,'opaque','image/png','[]','fixture',?,'completed',?,?)",
                     (upload_id, child['id'], key(), state, now, now))
    return upload_id


def add_problem(security, child, upload_id, subskill=MATH, *, correctness='incorrect', eligible=True, confidence=.99,
                page=1, order=0, conflict=False, mapped=False, uncertain=False, question='Private homework wording.'):
    """One problem on an upload. `mapped` stores a mapping checkpoint, the way current uploads do."""
    problem_id, now = key(), security.clock.now()
    extraction = {'question': {'text': question, 'uncertain': uncertain}} if mapped else {}
    mapping = json.dumps({'subskill_id': subskill, 'confidence': confidence, 'explanation': 'Synthetic skill mapping.'}) if mapped else None
    with security.db.transaction() as conn:
        conn.execute("INSERT INTO homework_problems(id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,fingerprint,mapping_json,teacher_conflict,created_at) VALUES(?,?,?,?,?,'1',?,'[]',?,?,?,?)",
                     (problem_id, upload_id, child['id'], page, order, json.dumps(extraction), key(), mapping, int(conflict), now))
    graded = correctness != 'ungraded'
    record_homework_evidence(security, child['id'], problem_id, subskill, correctness, eligible and graded and not conflict,
                             confidence if graded else 0, question=question, fingerprint=key())
    return problem_id


def upload(security, child, subskill=MATH, *, state='completed', **problem):
    upload_id = new_upload(security, child, state)
    add_problem(security, child, upload_id, subskill, **problem)
    return upload_id


def approve_game(security, subskill, title):
    with security.db.transaction() as conn:
        library.save_version(conn, security.clock.now(), get_subskill(conn, subskill), title=title, emoji='🎲', premise='A premise.', idea='An idea.',
                             code=f'// {title}', css='', report=REPORT, review=None, origin='seed_example', model='test', status='approved')


def suggestion(client, upload_id):
    return client.get('/api/games/kid/suggestion', params={'uploadId': upload_id})


def test_subject_for_reads_the_catalog_labels():
    assert targets.subject_for({'subject': 'Math'}) == 'math'
    assert targets.subject_for({'subject': 'Reading/ELA'}) == 'ela' and targets.subject_for({'subject': 'ELA'}) == 'ela'
    assert targets.subject_for({'subject': 'Science'}) is None and targets.subject_for({}) is None and targets.subject_for(None) is None


def test_reliably_marked_work_offers_the_game_for_its_skill(family, security_context):
    child, client = family
    approve_game(security_context, MATH, 'Fraction Game')
    view = suggestion(client, upload(security_context, child)).json()
    assert view['state'] == 'ready' and view['targetSkill'] == {'id': MATH, 'name': 'Know a/b is a copies of 1/b', 'subject': 'math'}
    assert view['game']['title'] == 'Fraction Game'


def test_work_that_is_all_correct_still_gets_a_game_and_the_skill_picture_is_untouched(family, security_context):
    child, client = family
    approve_game(security_context, MATH, 'Fraction Game')
    upload(security_context, child)
    upload(security_context, child)
    second = upload(security_context, child, correctness='correct')
    with security_context.db.transaction() as conn:
        before = _homework_state(conn, child['id'], MATH)
    assert before['status'] == 'needs_support'
    view = suggestion(client, second).json()
    assert view['state'] == 'ready' and view['targetSkill']['id'] == MATH
    started = mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': second, 'idempotencyKey': key()})
    assert started.status_code == 200
    with security_context.db.transaction() as conn:
        assert _homework_state(conn, child['id'], MATH) == before


def test_incorrect_work_comes_first_then_page_order(family, security_context):
    child, client = family
    approve_game(security_context, MATH, 'Fraction Game')
    approve_game(security_context, ELA, 'Plural Game')
    # Correct reading work first on the page, incorrect math work after it: the math skill needs the practice.
    mixed = new_upload(security_context, child)
    add_problem(security_context, child, mixed, ELA, correctness='correct', order=0)
    add_problem(security_context, child, mixed, MATH, correctness='incorrect', order=1)
    assert suggestion(client, mixed).json()['targetSkill']['id'] == MATH
    # When everything is correct, the first usable problem in page order is the one to play.
    correct = new_upload(security_context, child)
    add_problem(security_context, child, correct, ELA, correctness='correct', order=0)
    add_problem(security_context, child, correct, MATH, correctness='correct', order=1)
    add_problem(security_context, child, correct, '3.OA.A.1-1', eligible=False, page=2)
    assert suggestion(client, correct).json()['targetSkill']['id'] == ELA


def test_a_skill_that_already_has_a_game_is_preferred(family, security_context):
    child, client = family
    approve_game(security_context, ELA, 'Plural Game')
    both = new_upload(security_context, child)
    add_problem(security_context, child, both, MATH, correctness='incorrect', order=0)
    add_problem(security_context, child, both, ELA, correctness='correct', order=1)
    view = suggestion(client, both).json()
    assert view['state'] == 'ready' and view['targetSkill']['id'] == ELA and view['game']['title'] == 'Plural Game'


def test_a_reliable_skill_match_is_enough_even_when_grading_abstained(family, security_context):
    child, client = family
    approve_game(security_context, MATH, 'Fraction Game')
    ungraded = upload(security_context, child, correctness='ungraded', mapped=True)
    view = suggestion(client, ungraded).json()
    assert view['state'] == 'ready' and view['targetSkill']['id'] == MATH
    # Offering a game never turns that observation into evidence.
    with security_context.db.transaction() as conn:
        assert _homework_state(conn, child['id'], MATH)['status'] == 'unassessed'


@pytest.mark.parametrize('problem', [
    dict(mapped=True, confidence=.2),                        # the skill match is a guess
    dict(mapped=True, uncertain=True),                       # the question could not be read reliably
    dict(mapped=True, question='   '),                       # there is no question text
    dict(mapped=True, conflict=True),                        # the teacher's mark disagrees with the grading
    dict(eligible=False),                                    # evidence that was not eligible, with no skill match stored
    dict(correctness='correct', eligible=False),
    dict(correctness='ungraded'),
    dict(correctness='correct', confidence=.1),
    dict(correctness='correct', conflict=True),
])
def test_only_a_reliable_readable_skill_match_can_offer_a_game(family, security_context, problem):
    child, client = family
    approve_game(security_context, MATH, 'Fraction Game')
    upload_id = upload(security_context, child, **problem)
    view = suggestion(client, upload_id).json()
    assert view['state'] == 'none' and view['reason'] == 'no_supported_skill' and view['game'] is None and view['targetSkill'] is None
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).status_code == 409


def test_unfinished_or_failed_reading_says_so_and_looking_changes_nothing(family, security_context, monkeypatch):
    child, client = family
    approve_game(security_context, MATH, 'Fraction Game')
    uploads = [(upload(security_context, child, state='processing'), 'analysis_pending'),
               (upload(security_context, child, state='failed'), 'analysis_failed'),
               (upload(security_context, child, eligible=False), 'no_supported_skill')]
    statements = []
    original = security_context.db.connect

    def traced():
        connection = original()
        connection.set_trace_callback(statements.append)
        return connection
    monkeypatch.setattr(security_context.db, 'connect', traced)
    for upload_id, reason in uploads:
        view = suggestion(client, upload_id).json()
        assert view['state'] == 'none' and view['reason'] == reason
    # Asking what to play only reads. Session middleware only reads existing sessions for these requests.
    assert not any(value.lstrip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')) for value in statements)


def test_high_school_skills_count_because_games_cover_every_grade(family, security_context):
    child, client = family
    with security_context.db.transaction() as conn:
        skill = get_subskill(conn, ALGEBRA)
    assert skill and skill['grade'] == 'Algebra 1'
    approve_game(security_context, ALGEBRA, 'Algebra Game')
    upload_id = upload(security_context, child, ALGEBRA)
    assert suggestion(client, upload_id).json()['targetSkill']['id'] == ALGEBRA

    # The caller decides which grades it can serve.
    with security_context.db.transaction() as conn:
        row = conn.execute("SELECT * FROM sessions WHERE active_kid_profile_id=?", (child['id'],)).fetchone()
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], row['active_kid_profile_id'], row['parent_expires_at'], row['version'])
        every_grade, reason = targets.candidates(conn, security_context, child['id'], upload_id, active, library.grade_number)
        assert reason is None and [(priority, skill['subskill_id']) for priority, skill, _ in every_grade] == [(0, ALGEBRA)]
        to_grade_8 = lambda skill: library.grade_number(skill) if (library.grade_number(skill) or 99) <= 8 else None  # noqa: E731
        assert targets.candidates(conn, security_context, child['id'], upload_id, active, to_grade_8) == ([], None)


def test_another_childs_work_and_unknown_work_are_not_found(family, security_context, client_factory):
    child, client = family
    upload_id = upload(security_context, child)
    assert suggestion(client, 'missing').status_code == 404
    # A sibling in the same family cannot see it.
    picker(client); unlock(client)
    sibling = create_child(client, name='Maya', grade='1', avatar='owl').json()
    select_child(client, sibling['id'])
    assert suggestion(client, upload_id).status_code == 404
    # Neither can another family.
    other = client_factory()
    assert signup(other, email='other@example.com').status_code in (200, 201)
    assert setup_pin(other).status_code == 200 and unlock(other).status_code == 200
    theirs = create_child(other).json()
    select_child(other, theirs['id'])
    assert suggestion(other, upload_id).status_code == 404
    # A parent session is not a child session.
    picker(client); unlock(client)
    assert suggestion(client, upload_id).status_code == 403
