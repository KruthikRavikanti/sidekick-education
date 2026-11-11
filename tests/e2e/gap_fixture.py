"""Synthetic student work facts for Playwright's isolated SQLite database only.

Accounts, PINs, sessions and authorization are created through the real API.
This script adds upload observations without model calls or active assignments.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.accounts.security import SecurityContext
from backend.accounts.settings import Settings
from backend.gap import service


def main():
    database_url, kid_id = sys.argv[1:]
    database_path = Path(database_url.removeprefix('sqlite:///'))
    if not database_url.startswith('sqlite:///') or not database_path.is_absolute() or not database_path.name.startswith('sidekick-e2e-') or not database_path.is_file():
        raise RuntimeError('Browser fixtures require an existing isolated sidekick-e2e- SQLite file.')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev', cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    with security.db.transaction() as conn:
        kid = conn.execute('SELECT * FROM kid_profiles WHERE id=?', (kid_id,)).fetchone()
        if not kid:
            raise RuntimeError('Create the test child through the authenticated API first.')
        target = conn.execute("SELECT * FROM catalog_subskills WHERE grade=? AND subject='Reading/ELA' AND active=1 ORDER BY id LIMIT 1", (kid['grade'],)).fetchone()
        if not target:
            raise RuntimeError('The seeded catalog does not include the expected student work skill.')
        subskill_id = target['id']
        raw = json.loads(target['raw_json'])
    service.record_homework_evidence(security, kid_id, f'e2e:{kid_id}:problem:0', subskill_id, 'incorrect', True, .99,
        {'status': 'other', 'explanation': 'One synthetic reading response shows where support may help.'},
        fingerprint=f'e2e:{kid_id}:question:0', question='Synthetic visible word task 1')
    with security.db.transaction() as conn:
        assignments = conn.execute('SELECT COUNT(*) FROM practice_assignments WHERE kid_id=?', (kid_id,)).fetchone()[0]
        chains = conn.execute('SELECT COUNT(*) FROM gap_chains WHERE kid_id=?', (kid_id,)).fetchone()[0]
    print(json.dumps({'subskillId': subskill_id, 'name': raw.get('subskill') or target['name'], 'assignmentCount': assignments, 'chainCount': chains}))


if __name__ == '__main__':
    main()
