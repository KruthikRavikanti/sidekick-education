"""Shipped games for Playwright's isolated SQLite database only.

Loads a slice of the game library as `verified`, the way `games seed` does, so the review page has
real games to filter, page through and play. The robot is replaced by a stand-in report here: the
real robot is exercised by the backend tests and by `games verify`, and it is too slow for a browser test.
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


def main():
    database_url = sys.argv[1]
    database_path = Path(database_url.removeprefix('sqlite:///'))
    if not database_url.startswith('sqlite:///') or not database_path.is_absolute() or not database_path.name.startswith('sidekick-e2e-') or not database_path.is_file():
        raise RuntimeError('Browser fixtures require an existing isolated sidekick-e2e- SQLite file.')
    database = Database(database_url)
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
