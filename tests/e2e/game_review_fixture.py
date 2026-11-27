"""Shipped games for Playwright's isolated SQLite database only.

Loads a slice of the game library as `verified`, the way `games seed` does, so the review page has
real games to filter, page through and play. The robot is replaced by a stand-in report here: the
real robot is exercised by the backend tests and by `games verify`, and it is too slow for a browser test.

With `model` as a second argument it instead stores one model-written game with the model reviewer's notes, and one
build that the model reviewer stopped, so the page that shows them can be checked without calling a model.
"""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.accounts.database import Database
from backend.games import library

REPORT = {'passed': True, 'kit': 'kit-1', 'stats': {}, 'checks': [{'name': 'stand_in_for_browser_test', 'ok': True, 'detail': ''}],
          'manifest': {'rounds': [{'id': 'your-turn', 'phase': 'solo', 'say': 'Try it by yourself.', 'mistakes': [{'tag': 'mix_up'}]}]}}


# What a model-written game looks like once the pipeline is done with it: the reviewer's opinion and its notes.
MODEL_SKILL, STOPPED_SKILL = '5.G.A.1-2', '5.G.A.1-1'
MODEL_REVIEW = {'conceptIsTheRule': True, 'playNotQuiz': False, 'contentCorrect': True, 'kidAppropriate': True, 'soloIsFresh': True, 'mistakeIsRealistic': True,
                'blockers': [], 'issues': ['The last round plays like a quiz.', 'The second hint gives a lot away.']}
STOPPED = {'code': 'not_verified', 'modelCalls': 6, 'robotRuns': 3, 'lastDraft': None, 'history': [
    {'stage': 'review', 'problems': ['review: Round 2 says the x-axis runs up and down.']},
    {'stage': 'review', 'problems': ['review: Round 2 still says the x-axis runs up and down.', 'review: The last round shows the answer on the sign.']}]}


def model_game(database):
    """One game the model wrote, waiting for a person, and one build the model reviewer stopped."""
    from backend.gap.catalog import get_subskill
    from backend.games import prompts
    source = next(item for item in prompts.load_library() if item['subskillId'] == MODEL_SKILL)
    now = time.time()
    with database.transaction() as conn:
        version_id, _ = library.save_version(conn, now, get_subskill(conn, MODEL_SKILL), title='Beacon Courier', emoji='🚀', premise='Fly the rocket to each beacon on the grid.',
                                             idea='The ordered pair is the flight plan.', code=source['code'] + '\n// model-written stand-in for the browser test', css=source['css'],
                                             report=REPORT, review=MODEL_REVIEW, origin='model_generated', model='explicit-synthetic-game-test')
        if not conn.execute('SELECT 1 FROM game_jobs WHERE subskill_id=?', (STOPPED_SKILL,)).fetchone():
            conn.execute('INSERT INTO game_jobs VALUES (?,?,?,?,?,?,?,?)', (library.uid(), STOPPED_SKILL, 'failed', None, library.encode(STOPPED), None, now, now))
    print(json.dumps({'id': version_id, 'title': 'Beacon Courier', 'skill': MODEL_SKILL, 'stoppedSkill': STOPPED_SKILL}))


def main():
    database_url = sys.argv[1]
    database_path = Path(database_url.removeprefix('sqlite:///'))
    if not database_url.startswith('sqlite:///') or not database_path.is_absolute() or not database_path.name.startswith('sidekick-e2e-') or not database_path.is_file():
        raise RuntimeError('Browser fixtures require an existing isolated sidekick-e2e- SQLite file.')
    database = Database(database_url)
    if sys.argv[2:] == ['model']:
        return model_game(database)
    robot = lambda code, css: REPORT  # noqa: E731
    counts = {}
    for subject, grades, limit in (('math', ['K'], None), ('math', ['Algebra 1'], 3), ('ela', ['9-10'], 4)):
        out = library.seed_examples(database, time.time(), robot=robot, subject=subject, grades=grades, limit=limit)
        counts[f'{subject}:{grades[0]}'] = sum(1 for item in out if item['result'] in {'added', 'unchanged'})
    with database.transaction() as conn:
        waiting = conn.execute("SELECT COUNT(*) FROM game_versions WHERE status='verified'").fetchone()[0]
        algebra = conn.execute("SELECT title, subskill_id FROM game_versions WHERE grade=9 AND subject='math' ORDER BY subskill_id LIMIT 1").fetchone()
    print(json.dumps({'waiting': waiting, 'counts': counts, 'algebraTitle': algebra['title'], 'algebraSkill': algebra['subskill_id']}))


if __name__ == '__main__':
    main()
