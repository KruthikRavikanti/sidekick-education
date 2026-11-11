"""Synthetic learning rows for Playwright's isolated SQLite database only.

Accounts, PINs, sessions and authorization are created through the real API.
This script adds learning facts/items without model calls or production bypasses.
"""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.accounts.security import SecurityContext
from backend.accounts.settings import Settings
from backend.gap.items import compile_practice_item, save_generated_item
from backend.gap.reducer import initial_state
from backend.gap import service


def main():
    database_url, kid_id, mode = sys.argv[1:]
    database_path = Path(database_url.removeprefix('sqlite:///'))
    if not database_url.startswith('sqlite:///') or not database_path.is_absolute() or not database_path.name.startswith('sidekick-e2e-') or not database_path.is_file():
        raise RuntimeError('Browser fixtures require an existing isolated sidekick-e2e- SQLite file.')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev', cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    now = time.time()
    with security.db.transaction() as conn:
        kid = conn.execute('SELECT * FROM kid_profiles WHERE id=?', (kid_id,)).fetchone()
        if not kid:
            raise RuntimeError('Create the test child through the authenticated API first.')
        readiness = 'adult_required' if mode == 'adult' else 'ready'
        subject = 'Reading/ELA' if mode == 'adult' else 'Math'
        target = conn.execute("SELECT s.* FROM catalog_subskills s JOIN practice_items p ON p.subskill_id=s.id WHERE s.grade=? AND s.subject=? AND s.active=1 AND p.active=1 AND p.source='seed' GROUP BY s.id HAVING COUNT(*)=2 AND SUM(CASE WHEN p.readiness=? THEN 1 ELSE 0 END)=2 ORDER BY s.id LIMIT 1", (kid['grade'], subject, readiness)).fetchone()
        if not target:
            raise RuntimeError('The seeded catalog does not include the expected synthetic-test interaction.')
        subskill_id = target['id']
        raw = json.loads(target['raw_json'])
        for index in range(5):
            if mode == 'adult':
                compiled = compile_practice_item(question=f'Say the word practice {index + 1} aloud.', answer=f'practice {index + 1}', answer_type='Say / do aloud', grade=kid['grade'], home_tip='Listen and allow time to respond.')
            else:
                compiled = compile_practice_item(question=f'{91 + index} + 1 = ?', answer=str(92 + index), answer_type='Number', check_mode='Auto-checkable', grade=kid['grade'])
            save_generated_item(conn, subskill_id, f'e2e:{kid_id}:{mode}:{index}', compiled, now=now)
        if mode == 'solo':
            service._save_state(conn, kid_id, subskill_id, initial_state() | {'status': 'practicing'}, now)
            assignment = service._assignment(conn, kid_id, subskill_id, 'practice', now)
            pool = service._pool(conn, assignment)
            first_answer = pool[0]['answer']
        else:
            first_answer = None
    if mode == 'adult':
        for index in range(2):
            service.record_homework_evidence(security, kid_id, f'e2e:{kid_id}:problem:{index}', subskill_id, 'incorrect', True, .99, {'status': 'other', 'explanation': 'Two distinct synthetic reading responses need a closer look.'}, question=f'Synthetic visible word task {index + 1}')
    print(json.dumps({'subskillId': subskill_id, 'name': raw.get('subskill') or target['name'], 'answer': first_answer}))


if __name__ == '__main__':
    main()
