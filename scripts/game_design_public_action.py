"""Rehearse one engineering action derived from the public synthetic world.

This calls the real owned/CSRF/profile-version API. The accepted plan can later
be played through React in a new zero-action browser attempt for a short video.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
from fastapi.testclient import TestClient
from scripts.compose_game_design_case import read_json, update_json


def act(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_game_verification_required')
    config = read_json(args.private_config)
    database = config['databaseUrl']
    if not database.startswith('sqlite:///') or not Path(database[10:]).name.startswith('sidekick-e2e-games-'):
        raise ValueError('isolated_game_database_required')
    load_dotenv(ROOT / 'backend/.env')
    os.environ.update(DATABASE_URL=database, APP_ENV='test', PASSWORD_POLICY='dev', COOKIE_SECURE='false',
        SIDEKICK_ACTIVITY_V2_PREVIEW='true', SIDEKICK_FIXTURE_MODE='false', TRUSTED_ORIGINS='http://localhost:3000',
        SIDEKICK_PRIVATE_UPLOAD_DIR=config['privateUploadDirectory'])
    from backend.main import app
    from backend.accounts.security import SecurityContext
    security = SecurityContext.from_env()
    app.state.security = security
    state = read_json(Path(config['browserState']))
    cookie = next(item for item in state['cookies'] if item['name'] == security.settings.session_cookie)
    job = config['jobs'][args.case]
    base = '/api/activity-programs/sessions/'+job['rehearsalSessionId']
    commands = read_json(args.request) if args.request else []
    if isinstance(commands, dict):
        commands = [commands]
    with TestClient(app, base_url='http://localhost:3000', cookies={cookie['name']: cookie['value']}) as client:
        current = client.get(base)
        if current.status_code != 200:
            raise ValueError('owned_rehearsal_unavailable')
        world = current.json()
        if any(job.get(key) != world['definitionHash'] for key in
               ('definitionHash', 'rehearsalDefinitionHash', 'publicPlanDefinitionHash')):
            raise ValueError('public_plan_definition_mismatch')
        for command in commands:
            action = next(item for item in world['actions'] if item['id'] == command['actionId'])
            if set(command['inputs']) != {item['id'] for item in action['inputs']}:
                raise ValueError('public_action_signature_mismatch')
            account = client.get('/api/auth/session').json()
            csrf = client.get('/api/auth/csrf').json()['csrfToken']
            response = client.post(base+'/actions', json=dict(actionId=command['actionId'], inputs=command['inputs'],
                requestId=uuid.uuid4().hex, expectedRevision=world['revision']), headers=dict(Origin='http://localhost:3000',
                    **{'X-CSRF-Token': csrf, 'X-Sidekick-Profile-Version': str(account['version'])}))
            if response.status_code != 200:
                print(json.dumps(dict(accepted=False, reasonCode=response.json().get('error', {}).get('code', 'action_rejected'))))
                return 1
            world = response.json()
            command['operation'] = action['operation']
            job['publicPlan'].append(command)
            update_json(args.private_config, lambda value: value['jobs'].__setitem__(args.case, job))
        path = args.private_config.with_name(args.private_config.stem+'-'+args.case+'-public.json')
        path.write_text(json.dumps(world, indent=2)+'\n')
        path.chmod(0o600)
        print(json.dumps(dict(accepted=True, status=world['status'], revision=world['revision'],
                             actionCount=world['actionCount'], publicSnapshot=str(path))))
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config', type=Path, required=True)
    parser.add_argument('--case', required=True)
    parser.add_argument('--request', type=Path)
    try:
        sys.exit(act(parser.parse_args()))
    except Exception as error:
        print(json.dumps(dict(success=False, reasonCode=getattr(error, 'code', 'public_action_failed'))))
        sys.exit(1)
