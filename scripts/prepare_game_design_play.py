"""Make isolated engineering attempts of an exact approved live world.

No provider calls. The original generated starting attempt remains untouched;
the planner and browser receive only public projections, never its witness.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from starlette.requests import Request
from backend.accounts.security import SecurityContext
from backend.accounts.settings import Settings
from backend.activity_engine_v2.service import session_view, start_approved
from scripts.compose_game_design_case import clear_browser_evidence, clear_play_binding, read_json, update_json
from scripts.prepare_activity_benchmark_verification import source_approval


def prepare(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_game_verification_required')
    config = read_json(args.private_config)
    database_url = config['databaseUrl']
    if not database_url.startswith('sqlite:///') or not Path(database_url[10:]).name.startswith('sidekick-e2e-games-'):
        raise ValueError('isolated_game_database_required')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev',
        cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    job = config['jobs'][args.case]
    report = read_json(Path(config['report']))
    record = next(item for item in report['cases'] if item['case'] == args.case)
    approved, snapshot, _ = source_approval(security.db.path,
        dict(localUrl='http://localhost:3000/kid/activity-preview/'+job['sessionId'], definitionHash=record['definitionHash']))
    if snapshot != dict(actionCount=0, revision=0):
        raise ValueError('pristine_generation_changed')
    state = read_json(Path(config['browserState']))
    cookie = next(item for item in state['cookies'] if item['name'] == security.settings.session_cookie)
    active = security.session(Request({'type': 'http', 'headers': [(b'cookie', (cookie['name']+'='+cookie['value']).encode())]}))
    digest = approved.definition_hash
    # Missing legacy bindings are unsafe to infer. Create new isolated attempts
    # rather than pairing an old plan/session with another approved definition.
    bindings = ('definitionHash', 'rehearsalDefinitionHash', 'playDefinitionHash', 'publicPlanDefinitionHash')
    reset = any(job.get(key) != digest for key in bindings)
    if reset:
        clear_play_binding(job)
    job['definitionHash'] = digest
    new_play = reset or args.new_play_attempt or 'playSessionId' not in job
    with security.db.transaction() as connection:
        for key in ('rehearsalSessionId', 'playSessionId'):
            if key in job and not (key == 'playSessionId' and args.new_play_attempt):
                continue
            created = start_approved(connection, security, active.active_kid_profile_id, approved, active)
            job[key] = created['id']
    for key in ('rehearsalSessionId', 'playSessionId'):
        view = session_view(security, active.active_kid_profile_id, job[key], active)
        if view['definitionHash'] != digest:
            raise ValueError('engineering_attempt_definition_mismatch')
        if key == 'playSessionId' and new_play and (view['actionCount'] != 0 or view['revision'] != 0
                                                   or view['assistance']['received']):
            raise ValueError('fresh_engineering_play_required')
    job.setdefault('publicPlan', [])
    job.update(rehearsalDefinitionHash=digest, playDefinitionHash=digest, publicPlanDefinitionHash=digest)
    update_json(args.private_config, lambda current: current['jobs'].__setitem__(args.case, job))
    if new_play:
        def reset_report(current):
            clear_browser_evidence(next(item for item in current['cases'] if item['case'] == args.case))
            current['success'] = False
        update_json(Path(config['report']), reset_report)
    projection = session_view(security, active.active_kid_profile_id, job['rehearsalSessionId'], active)
    path = args.private_config.with_name(args.private_config.stem+'-'+args.case+'-public.json')
    path.write_text(json.dumps(projection, indent=2)+'\n')
    path.chmod(0o600)
    print(json.dumps(dict(success=True, publicSnapshot=str(path), rehearsalActionCount=projection['actionCount'],
                         playActionCount=view['actionCount'], playRevision=view['revision'])))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config', type=Path, required=True)
    parser.add_argument('--case', required=True)
    parser.add_argument('--new-play-attempt', action='store_true')
    try:
        prepare(parser.parse_args())
    except Exception as error:
        print(json.dumps(dict(success=False, reasonCode=getattr(error, 'code', 'game_play_preparation_failed'))))
        sys.exit(1)
