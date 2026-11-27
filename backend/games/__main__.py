"""Local tools for generated games.

  python -m backend.games seed                 load every shipped game (each must pass the robot here first)
  python -m backend.games seed --subject math --grades K,1,2 --workers 4      one slice at a time; safe to repeat or resume
  python -m backend.games robot <folder>       play one game folder (game.js, optional game.css) with the robot
  python -m backend.games generate --subskill 3.NF.A.1-2
  python -m backend.games generate --missing --grades K,1,2,3,4,5 --subject math --limit 50 --workers 3
  python -m backend.games verify               play every shipped game with the robot (--subject, --grades, --only narrow it)
  python -m backend.games coverage             which skills in the skill map have a game (writes data/games/COVERAGE.md)
  python -m backend.games list
"""
import argparse
import asyncio
import collections
import json
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

from backend.accounts.database import Database, ROOT
from backend.gap.catalog import get_subskill

from . import library, prompts
from .checks import static_issues
from .frame import build_document
from .robot import failures, run_robot


class _Clock:
    def now(self):
        return time.time()


def _read_game(folder):
    folder = Path(folder)
    code = (folder / 'game.js') if folder.is_dir() else folder
    css = code.with_name('game.css')
    return code.read_text(encoding='utf-8'), css.read_text(encoding='utf-8') if css.is_file() else ''


def _robot(args):
    code, css = _read_game(args.path)
    issues = static_issues(code, css)
    if issues:
        print('static checks:', ', '.join(issues))
        return 1
    if args.html:
        html, _ = build_document(code, css, seed=args.seed)
        Path(args.html).write_text(html, encoding='utf-8')
    report = run_robot(code, css, seed=args.seed, shots_dir=args.shots)
    print(('PASSED' if report['passed'] else 'FAILED') + f" {len(report['checks'])} checks", json.dumps(report.get('stats', {})))
    for line in failures(report):
        print('  -', line)
    return 0 if report['passed'] else 1


GRADE_ORDER = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9-10', '11-12', 'Algebra 1', 'Geometry', 'Algebra 2', 'Precalculus / advanced (+)']


def _grades(value):
    return [g.strip() for g in (value or '').split(',') if g.strip()]


def _skill_scope(args):
    """Skill ids allowed by --subject and --grades, or None when neither was given."""
    grades, subject = set(_grades(getattr(args, 'grades', None))), getattr(args, 'subject', None)
    if not grades and not subject:
        return None
    catalog = json.loads((ROOT / 'data' / 'sidekick_skill_map_v2.json').read_text(encoding='utf-8'))
    wanted = {'math': 'Math', 'ela': 'Reading/ELA'}.get(subject)
    return {item['subskill_id'] for item in catalog if (not wanted or item['subject'] == wanted) and (not grades or str(item['grade']) in grades)}


def _verify(args):
    """Play every shipped game with the robot. This is the gate a game passes before review."""
    from concurrent.futures import ThreadPoolExecutor
    scope = _skill_scope(args)
    games = [g for g in prompts.load_library() if (not args.only or g['slug'] in args.only) and (scope is None or g['subskillId'] in scope)]
    if not games:
        print('no games match')
        return 1

    def play(game):
        shots = str(Path(args.shots) / game['slug']) if args.shots else None
        return game, run_robot(game['code'], game['css'], shots_dir=shots)

    failed = 0
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        for game, report in pool.map(play, games):
            ok = report['passed']
            failed += not ok
            print(('PASSED ' if ok else 'FAILED ') + f"{game['slug']:28} {game['subskillId']:16} {len(report['checks'])} checks")
            for line in failures(report):
                print('    -', line)
    print(f'{len(games) - failed} of {len(games)} games passed')
    return 1 if failed else 0


def _seed(args, database):
    """Load shipped games into the database. Skips what is already stored, so it can be repeated or resumed."""
    counts, started = collections.Counter(), time.time()

    def progress(entry):
        counts[entry['result']] += 1
        if args.json or entry['result'] == 'unchanged':
            return
        print(f"{entry['result']:20} {entry['slug']}", flush=True)
        for line in entry.get('problems', [])[:6]:
            print('    -', line, flush=True)

    results = library.seed_examples(database, time.time(), approve=args.approve, workers=max(1, args.workers), only=args.only,
                                    subject=args.subject, grades=_grades(args.grades), limit=args.limit, progress=progress)
    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
    print(json.dumps({'games': len(results), **dict(sorted(counts.items())), 'seconds': round(time.time() - started)}, indent=2))
    return 1 if counts.get('robot_failed') else 0


def _coverage(args):
    """Compare the shipped games with the whole skill map, and write the map to data/games/COVERAGE.md."""
    catalog = json.loads((ROOT / 'data' / 'sidekick_skill_map_v2.json').read_text(encoding='utf-8'))
    games = collections.defaultdict(list)
    for game in prompts.load_library():
        games[game['subskillId']].append(game)
    known = {item['subskill_id'] for item in catalog}
    cells = collections.defaultdict(lambda: [0, 0])
    for item in catalog:
        cell = cells[(item['subject'], str(item['grade']))]
        cell[0] += 1
        cell[1] += item['subskill_id'] in games
    def rank(grade):
        return (GRADE_ORDER.index(grade), grade) if grade in GRADE_ORDER else (99, grade)
    covered = sum(1 for item in catalog if item['subskill_id'] in games)
    lines = ['# Game coverage', '',
             'Written by `python -m backend.games coverage`. A skill counts as covered when a game for it ships in this repo',
             'and passes the robot. Every other skill is waiting for `python -m backend.games generate --missing`.', '',
             f'**{covered} of {len(catalog)} skills have a game** ({sum(len(v) for v in games.values())} games).', '',
             '| Subject | Grade | Skills | With a game |', '|---|---|---|---|']
    for (subject, grade), (total, have) in sorted(cells.items(), key=lambda kv: (kv[0][0], rank(kv[0][1]))):
        lines.append(f'| {subject} | {grade} | {total} | {have} |')
    everything = [game for group in games.values() for game in group]
    authors = collections.Counter(game.get('author', 'hand-written') for game in everything)
    built = collections.Counter(kind for game in everything for kind in (['built by hand on the kit'] if not game.get('play') else sorted({'play pattern: ' + k for k in game['play'].split('+')})))
    lines += ['', '## Who wrote them, and how', '',
              'Every shipped game still waits for a person in the review page before a child can play it.',
              '`claude-stand-in` means Claude wrote the game while standing in for the model the app will call; no live model run produced it.', '',
              '| Author | Games |', '|---|---|'] + [f'| {name} | {count} |' for name, count in authors.most_common()]
    lines += ['', 'A game that mixes patterns across its rounds is counted under each one.', '', '| How it is built | Games |', '|---|---|'] + [f'| {name} | {count} |' for name, count in built.most_common()]
    lines += ['', '## Games', '', '| Skill | Grade | Game | What the child does |', '|---|---|---|---|']
    by_id = {item['subskill_id']: item for item in catalog}
    for subskill_id in sorted(games, key=lambda sid: (by_id.get(sid, {}).get('subject', ''), rank(str(by_id.get(sid, {}).get('grade', ''))), sid)):
        item = by_id.get(subskill_id, {})
        for game in games[subskill_id]:
            lines.append(f"| `{subskill_id}` {item.get('subskill', '(not in the skill map)')} | {item.get('grade', '')} | {game.get('emoji', '')} {game['title']} | {game['premise']} |")
    lines += ['', '## Skills still waiting', '']
    for (subject, grade), (total, have) in sorted(cells.items(), key=lambda kv: (kv[0][0], rank(kv[0][1]))):
        waiting = [item['subskill_id'] for item in catalog if item['subject'] == subject and str(item['grade']) == grade and item['subskill_id'] not in games]
        lines.append(f"- **{subject}, grade {grade}** ({len(waiting)}): " + ', '.join(f'`{sid}`' for sid in waiting))
    out = ROOT / 'data' / 'games' / 'COVERAGE.md'
    out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    unknown = sorted(set(games) - known)
    print(json.dumps({'skills': len(catalog), 'withGame': covered, 'games': sum(len(v) for v in games.values()), 'notInSkillMap': unknown, 'written': str(out.relative_to(ROOT))}, indent=2))
    return 1 if unknown else 0


async def _generate(args, database):
    from .jobs import build_one
    with database.transaction() as conn:
        if args.subskill:
            targets = list(args.subskill)
        else:
            marks, values = '', []
            grades = _grades(args.grades) + ([args.grade] if args.grade else [])
            if grades:
                marks += ' AND s.grade IN (' + ','.join('?' for _ in grades) + ')'
                values += grades
            if args.subject:
                marks += ' AND s.subject=?'
                values.append('Math' if args.subject == 'math' else 'Reading/ELA')
            # A skill with a game shipped in data/games counts as covered even before `seed` has run.
            # The shipped set is filtered here, not in SQL: it is far larger than a query's parameter limit on older SQLite.
            shipped = {game['subskillId'] for game in prompts.load_library()}
            targets = [row[0] for row in conn.execute(
                f"""SELECT s.id FROM catalog_subskills s WHERE s.active=1{marks}
                    AND NOT EXISTS (SELECT 1 FROM game_versions v WHERE v.subskill_id=s.id AND v.status!='retired')
                    ORDER BY s.grade, s.id""", values) if row[0] not in shipped][:max(0, args.limit)]
            print(len(targets), 'skills to build', flush=True)
    clock = _Clock()
    gate = asyncio.Semaphore(max(1, args.workers))

    results = await asyncio.gather(*[_guarded(database, clock, subskill_id, build_one, gate) for subskill_id in targets])
    return 1 if any(results) else 0


async def _guarded(database, clock, subskill_id, build_one, gate):
    """Build one game. Returns 1 when it did not verify."""
    async with gate:
        with database.transaction() as conn:
            if not get_subskill(conn, subskill_id):
                print(subskill_id, 'is not in the catalog')
                return 1
            row = library.open_job(conn, subskill_id, clock.now())
            job_id = row['id'] if row else library.uid()
            if not row:
                conn.execute('INSERT INTO game_jobs VALUES (?,?,?,?,?,?,?,?)', (job_id, subskill_id, 'running', None, None, clock.now() + library.JOB_LEASE_SECONDS, clock.now(), clock.now()))
            else:
                conn.execute("UPDATE game_jobs SET status='running',lease_until=? WHERE id=?", (clock.now() + library.JOB_LEASE_SECONDS, job_id))
        version_id, failure = await build_one(database, clock, {'id': job_id, 'subskill_id': subskill_id})
        if version_id:
            print(subskill_id, 'verified, waiting for review:', version_id, flush=True)
            return 0
        print(subskill_id, 'not verified:', json.dumps(failure, ensure_ascii=False)[:1200], flush=True)
        return 1


def main():
    load_dotenv(ROOT / 'backend/.env')
    parser = argparse.ArgumentParser(description='Sidekick generated games')
    parser.add_argument('--database-url', default=os.getenv('DATABASE_URL', 'sqlite:///backend/data/sidekick.db'))
    commands = parser.add_subparsers(dest='command', required=True)
    seed = commands.add_parser('seed', help='load the shipped games; each must pass the robot first')
    seed.add_argument('--approve', action='store_true', help='also approve them (local development only)')
    seed.add_argument('--workers', type=int, default=2, help='games the robot plays at the same time')
    seed.add_argument('--subject', choices=['math', 'ela'])
    seed.add_argument('--grades', help='comma-separated, as the skill map writes them: K,1,2 or "Algebra 1",9-10')
    seed.add_argument('--only', action='append', help='a game folder name; repeat for more')
    seed.add_argument('--limit', type=int, help='stop after this many robot runs')
    seed.add_argument('--json', action='store_true', help='print every result as JSON instead of progress lines')
    robot = commands.add_parser('robot', help='play one game with the robot')
    robot.add_argument('path')
    robot.add_argument('--seed', type=int)
    robot.add_argument('--shots', help='folder for screenshots')
    robot.add_argument('--html', help='also write the locked frame document here')
    generate = commands.add_parser('generate', help='have the model write games now')
    generate.add_argument('--subskill', action='append')
    generate.add_argument('--missing', action='store_true')
    generate.add_argument('--grade')
    generate.add_argument('--grades', help='comma-separated, for example K,1,2,3,4,5')
    generate.add_argument('--subject', choices=['math', 'ela'])
    generate.add_argument('--limit', type=int, default=5)
    generate.add_argument('--workers', type=int, default=1, help='games to build at the same time')
    verify = commands.add_parser('verify', help='play every shipped game with the robot')
    verify.add_argument('--only', action='append', help='a game folder name; repeat for more')
    verify.add_argument('--workers', type=int, default=3)
    verify.add_argument('--subject', choices=['math', 'ela'])
    verify.add_argument('--grades', help='comma-separated, as the skill map writes them')
    verify.add_argument('--shots', help='folder for screenshots')
    commands.add_parser('list', help='every stored game')
    commands.add_parser('coverage', help='which skills in the skill map have a game')
    args = parser.parse_args()
    if args.command == 'robot':
        sys.exit(_robot(args))
    if args.command == 'verify':
        sys.exit(_verify(args))
    if args.command == 'coverage':
        sys.exit(_coverage(args))
    database = Database(args.database_url)
    database.assert_migrated()
    if args.command == 'seed':
        sys.exit(_seed(args, database))
    elif args.command == 'generate':
        if not args.subskill and not args.missing:
            parser.error('generate needs --subskill ID or --missing')
        sys.exit(asyncio.run(_generate(args, database)))
    elif args.command == 'list':
        with database.transaction() as conn:
            for row in conn.execute('SELECT id,subskill_id,status,origin,title FROM game_versions ORDER BY created_at'):
                print(f"{row['status']:9} {row['origin']:16} {row['subskill_id']:14} {row['title']}  ({row['id']})")
        with database.transaction() as conn:
            total = conn.execute('SELECT COUNT(*) FROM catalog_subskills WHERE active=1').fetchone()[0]
            counts = {row[0]: row[1] for row in conn.execute("SELECT status,COUNT(DISTINCT subskill_id) FROM game_versions GROUP BY status")}
        print(json.dumps({'skills': total, 'withApprovedGame': counts.get('approved', 0), 'waitingForReview': counts.get('verified', 0)}, indent=2))


if __name__ == '__main__':
    main()
