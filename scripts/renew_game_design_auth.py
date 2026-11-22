"""Renew the isolated engineering account after a test-only auth interruption.

Never un-revoke a credential or change a password. Mint a fresh synthetic account
session through the host primitive, then select its owned child through the real
CSRF-protected API. Customer databases and accounts are explicitly refused.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient
from backend.accounts.security import SecurityContext, digest
from backend.accounts.settings import Settings
from scripts.compose_game_design_case import read_json, update_json


def renew(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_game_verification_required')
    config = read_json(args.private_config)
    database = Path(config['databaseUrl'].removeprefix('sqlite:///'))
    if (not config['databaseUrl'].startswith('sqlite:///') or not database.is_file() or database.is_symlink()
            or not database.name.startswith('sidekick-e2e-games-')
            or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise ValueError('isolated_game_database_required')
    security = SecurityContext(Settings(database_url=config['databaseUrl'], app_env='test', password_policy='dev',
        cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    state_path = Path(config['browserState'])
    state = read_json(state_path)
    old_cookie = next(item for item in state['cookies'] if item['name'] == security.settings.session_cookie)
    with security.db.transaction() as connection:
        row = connection.execute('''SELECT s.*,a.email,k.first_name FROM sessions s
            JOIN accounts a ON a.id=s.account_id JOIN kid_profiles k ON k.id=s.active_kid_profile_id AND k.account_id=a.id
            WHERE s.token_digest=?''', (digest(old_cookie['value']),)).fetchone()
        if (not row or not row['email'].startswith('benchmark-') or not row['email'].endswith('@example.com')
                or row['first_name'] != 'Preview' or row['mode'] != 'kid'):
            raise ValueError('synthetic_benchmark_owner_required')
        token = security.new_session(connection, row['account_id'])
        kid_id = row['active_kid_profile_id']
    from backend.main import app
    previous = getattr(app.state, 'security', None)
    app.state.security = security
    try:
        with TestClient(app, base_url='http://localhost:3000', cookies={security.settings.session_cookie: token}) as client:
            csrf = client.get('/api/auth/csrf').json()['csrfToken']
            selected = client.post('/api/session/kid', json={'profileId': kid_id},
                headers={'Origin': 'http://localhost:3000', 'X-CSRF-Token': csrf})
            if selected.status_code != 200:
                raise ValueError('synthetic_profile_selection_failed')
    finally:
        app.state.security = previous
    replacement = dict(old_cookie, value=token, expires=security.clock.now()+security.settings.session_seconds)
    update_json(state_path, lambda value: value.update(cookies=[replacement], origins=[]))
    state_path.chmod(0o600)
    print(json.dumps(dict(success=True, originalCredentialUnchanged=True, sourcesAndProgramsUnchanged=True)))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config', required=True, type=Path)
    try:
        renew(parser.parse_args())
    except Exception:
        print(json.dumps(dict(success=False, reasonCode='synthetic_auth_renewal_failed')))
        sys.exit(1)
