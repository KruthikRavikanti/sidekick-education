"""Runs the robot player (scripts/game-robot.mjs) against one game and returns its report."""
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from .checks import static_issues
from .frame import ROOT, build_document, content_security_policy

ROBOT_SCRIPT = ROOT / 'scripts' / 'game-robot.mjs'
ROBOT_TIMEOUT_SECONDS = 240


class RobotUnavailable(RuntimeError):
    """The robot could not run at all (no Node, no browser). Never treat this as a pass."""


def _failed(name, detail):
    return {'passed': False, 'kit': None, 'manifest': None, 'stats': {}, 'screenshots': [], 'checks': [{'name': name, 'ok': False, 'detail': detail}]}


def run_robot(code, css='', *, seed=None, shots_dir=None, trials=30, timeout=ROBOT_TIMEOUT_SECONDS):
    """Statically check, then play the game in a locked headless browser. Returns the report dict."""
    issues = static_issues(code, css)
    if issues:
        return _failed('static_checks', ', '.join(issues))
    return play(code, css, seed=seed, shots_dir=shots_dir, trials=trials, timeout=timeout)


def play(code, css='', *, seed=None, shots_dir=None, trials=30, timeout=ROBOT_TIMEOUT_SECONDS):
    """Play source in the locked frame without the static checks. Tests use this to probe the frame itself."""
    node = shutil.which('node')
    if not node or not ROBOT_SCRIPT.exists():
        raise RobotUnavailable('Node.js and scripts/game-robot.mjs are required to verify a game.')
    html, nonce = build_document(code, css, seed=seed)
    # frame-ancestors only matters when embedded; the robot loads the frame as a top-level page.
    policy = content_security_policy(nonce).replace("; frame-ancestors 'self'", '')
    with tempfile.TemporaryDirectory(prefix='sidekick-game-') as work:
        page = Path(work) / 'game.html'
        page.write_text(html, encoding='utf-8')
        command = [node, str(ROBOT_SCRIPT), '--file', str(page), '--csp', policy, '--trials', str(int(trials))]
        if shots_dir:
            Path(shots_dir).mkdir(parents=True, exist_ok=True)
            command += ['--out', str(shots_dir)]
        env = {key: value for key, value in os.environ.items() if key in {'PATH', 'HOME', 'NODE_PATH', 'PLAYWRIGHT_BROWSERS_PATH', 'LANG', 'TMPDIR'}}
        env.setdefault('NODE_PATH', str(ROOT / 'node_modules'))
        try:
            done = subprocess.run(command, cwd=str(ROOT), env=env, capture_output=True, text=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            return _failed('robot_time_limit', f'The game did not finish a robot run in {timeout} seconds.')
    if done.returncode != 0:
        raise RobotUnavailable((done.stderr or 'The robot exited without a report.').strip()[-400:])
    try:
        report = json.loads(done.stdout.strip().splitlines()[-1])
    except (ValueError, IndexError) as exc:
        raise RobotUnavailable('The robot did not return a readable report.') from exc
    if not isinstance(report, dict) or not isinstance(report.get('checks'), list) or not isinstance(report.get('passed'), bool):
        raise RobotUnavailable('The robot report has the wrong shape.')
    report['passed'] = bool(report['passed'] and report['checks'] and all(item.get('ok') is True for item in report['checks']))
    return report


def failures(report):
    return [f"{item['name']}: {item.get('detail') or 'failed'}" for item in report.get('checks', []) if not item.get('ok')]
