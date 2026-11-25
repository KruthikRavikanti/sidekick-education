"""Local tools for generated games.

  python -m backend.games seed                 load the reference games (each must pass the robot)
  python -m backend.games robot <folder>       play one game folder (game.js, optional game.css) with the robot
  python -m backend.games generate --subskill 3.NF.A.1-2
  python -m backend.games generate --missing --grade 3 --limit 5
  python -m backend.games list | coverage
"""
import argparse
import asyncio
import json
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

from backend.accounts.database import Database, ROOT
from backend.gap.catalog import get_subskill

from . import library
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


async def _generate(args, database):
    from .jobs import build_one
    with database.transaction() as conn:
        if args.subskill:
            targets = list(args.subskill)
        else:
            marks, values = '', []
            if args.grade:
                marks, values = ' AND s.grade=?', [args.grade]
            targets = [row[0] for row in conn.execute(
                f"""SELECT s.id FROM catalog_subskills s WHERE s.active=1{marks}
                    AND NOT EXISTS (SELECT 1 FROM game_versions v WHERE v.subskill_id=s.id AND v.status!='retired')
                    ORDER BY s.grade, s.id LIMIT ?""", (*values, args.limit))]
    clock, code = _Clock(), 0
    for subskill_id in targets:
        with database.transaction() as conn:
            if not get_subskill(conn, subskill_id):
                print(subskill_id, 'is not in the catalog')
                code = 1
                continue
            row = library.open_job(conn, subskill_id, clock.now())
            job_id = row['id'] if row else library.uid()
            if not row:
                conn.execute('INSERT INTO game_jobs VALUES (?,?,?,?,?,?,?,?)', (job_id, subskill_id, 'running', None, None, clock.now() + library.JOB_LEASE_SECONDS, clock.now(), clock.now()))
            else:
                conn.execute("UPDATE game_jobs SET status='running',lease_until=? WHERE id=?", (clock.now() + library.JOB_LEASE_SECONDS, job_id))
        version_id, failure = await build_one(database, clock, {'id': job_id, 'subskill_id': subskill_id})
        if version_id:
            print(subskill_id, 'verified, waiting for review:', version_id)
        else:
            code = 1
            print(subskill_id, 'not verified:', json.dumps(failure, ensure_ascii=False)[:1200])
    return code


def main():
    load_dotenv(ROOT / 'backend/.env')
    parser = argparse.ArgumentParser(description='Sidekick generated games')
    parser.add_argument('--database-url', default=os.getenv('DATABASE_URL', 'sqlite:///backend/data/sidekick.db'))
    commands = parser.add_subparsers(dest='command', required=True)
    seed = commands.add_parser('seed', help='load the reference games')
    seed.add_argument('--approve', action='store_true', help='also approve them (local development only)')
    robot = commands.add_parser('robot', help='play one game with the robot')
    robot.add_argument('path')
    robot.add_argument('--seed', type=int)
    robot.add_argument('--shots', help='folder for screenshots')
    robot.add_argument('--html', help='also write the locked frame document here')
    generate = commands.add_parser('generate', help='have the model write games now')
    generate.add_argument('--subskill', action='append')
    generate.add_argument('--missing', action='store_true')
    generate.add_argument('--grade')
    generate.add_argument('--limit', type=int, default=5)
    commands.add_parser('list', help='every stored game')
    commands.add_parser('coverage', help='how many skills have a game')
    args = parser.parse_args()
    if args.command == 'robot':
        sys.exit(_robot(args))
    database = Database(args.database_url)
    database.assert_migrated()
    if args.command == 'seed':
        print(json.dumps(library.seed_examples(database, time.time(), approve=args.approve), indent=2, ensure_ascii=False))
    elif args.command == 'generate':
        if not args.subskill and not args.missing:
            parser.error('generate needs --subskill ID or --missing')
        sys.exit(asyncio.run(_generate(args, database)))
    elif args.command == 'list':
        with database.transaction() as conn:
            for row in conn.execute('SELECT id,subskill_id,status,origin,title FROM game_versions ORDER BY created_at'):
                print(f"{row['status']:9} {row['origin']:16} {row['subskill_id']:14} {row['title']}  ({row['id']})")
    elif args.command == 'coverage':
        with database.transaction() as conn:
            total = conn.execute('SELECT COUNT(*) FROM catalog_subskills WHERE active=1').fetchone()[0]
            counts = {row[0]: row[1] for row in conn.execute("SELECT status,COUNT(DISTINCT subskill_id) FROM game_versions GROUP BY status")}
        print(json.dumps({'skills': total, 'withApprovedGame': counts.get('approved', 0), 'waitingForReview': counts.get('verified', 0)}, indent=2))


if __name__ == '__main__':
    main()
