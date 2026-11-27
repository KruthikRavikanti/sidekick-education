"""The game library: versions, build jobs and which game a child may be offered."""
import hashlib
import json
import uuid

from backend.activities import general
from backend.gap.catalog import get_subskill

from .config import PROMPT_VERSION
from .frame import KIT_VERSION
from . import prompts
from .robot import failures, run_robot

FAILED_RETRY_SECONDS = 24 * 3600
JOB_LEASE_SECONDS = 20 * 60


def uid():
    return uuid.uuid4().hex


# The skill map names high school by course or band. Games cover all of it, so each gets a sortable number.
_COURSE_GRADES = {'algebra 1': 9, 'geometry': 10, 'algebra 2': 11, '9-10': 9, '11-12': 11}
SUBJECT_LABELS = {'math': 'Math', 'ela': 'Reading/ELA'}


def grade_number(subskill):
    """K is 0, grades 1 to 8 are themselves, and high school courses and bands map to 9 to 12. None when unknown."""
    value = str((subskill or {}).get('grade', '')).strip()
    if value == 'K':
        return 0
    if value.isascii() and value.isdigit():
        return int(value) if 0 <= int(value) <= 12 else None
    lowered = value.casefold()
    return 12 if lowered.startswith('precalculus') else _COURSE_GRADES.get(lowered)


def source_hash(code, css=''):
    return hashlib.sha256((code + '\x00' + (css or '')).encode('utf-8')).hexdigest()


def encode(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def decode(value, default=None):
    try:
        return json.loads(value) if value else default
    except (TypeError, ValueError):
        return default


def slim_report(report):
    """Keep what a reviewer reads; drop bulky run details."""
    return {'passed': bool(report.get('passed')), 'kit': report.get('kit'), 'stats': report.get('stats', {}),
            'checks': [{'name': str(c.get('name'))[:80], 'ok': bool(c.get('ok')), 'detail': str(c.get('detail') or '')[:300]} for c in report.get('checks', [])][:200]}


def save_version(conn, now, subskill, *, title, emoji, premise, idea, code, css, report, review, origin, model, status='verified', decided_by=None):
    """Store a game that passed the robot. Returns (id, created)."""
    if not report or not report.get('passed'):
        raise ValueError('Only games that passed the robot can be stored')
    subject, grade = general.subject_for(subskill), grade_number(subskill)
    if subject is None or grade is None:
        raise ValueError('Unsupported subject or grade')
    sha = source_hash(code, css)
    existing = conn.execute('SELECT id FROM game_versions WHERE source_sha256=?', (sha,)).fetchone()
    if existing:
        return existing['id'], False
    version_id = uid()
    conn.execute('INSERT INTO game_versions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', (
        version_id, subskill['subskill_id'], subject, grade, title[:60], premise[:180], idea[:320], emoji[:8], code, css or '', sha,
        encode(report.get('manifest') or {}), KIT_VERSION, origin, model[:120], PROMPT_VERSION, status,
        encode(slim_report(report)), encode(review) if review is not None else None, now,
        now if status == 'approved' else None, decided_by if status == 'approved' else None, None))
    return version_id, True


def _wanted(item, subskill, only, subject, grades):
    if only and item['slug'] not in only:
        return False
    if subject and general.subject_for(subskill or {}) != subject:
        return False
    return not grades or str((subskill or {}).get('grade', '')) in grades


def seed_examples(db, now, *, robot=run_robot, approve=False, workers=1, only=None, subject=None, grades=None, limit=None, progress=None):
    """Load the games shipped with the repo. Each one must pass the robot on this machine first.

    They are stored as `verified`, like any other game, and wait for a person in the
    review page unless `approve` is passed explicitly (local development only).

    The library is large, so a run can be narrowed (`only` folder names, `subject` 'math' or 'ela',
    `grades` as the skill map writes them, `limit` on robot runs) and the robot can play several
    games at once (`workers`). Games already stored are skipped, so a run can be repeated or resumed.
    `progress` is called with each finished entry.
    """
    only, grades = set(only or ()), {str(g) for g in (grades or ())}
    out, todo = [], []

    def done(entry):
        out.append(entry)
        if progress:
            progress(entry)

    for item in prompts.load_library():
        with db.transaction() as conn:
            subskill = get_subskill(conn, item['subskillId'])
            known = conn.execute('SELECT id,status FROM game_versions WHERE source_sha256=?', (source_hash(item['code'], item['css']),)).fetchone()
        if not _wanted(item, subskill, only, subject, grades):
            continue
        if not subskill or not subskill['active']:
            done({'slug': item['slug'], 'result': 'skill_not_in_catalog'})
        elif general.subject_for(subskill) is None or grade_number(subskill) is None:
            done({'slug': item['slug'], 'result': 'unsupported_grade'})
        elif known:
            if approve and known['status'] == 'verified':
                with db.transaction() as conn:
                    conn.execute("UPDATE game_versions SET status='approved',decided_at=? WHERE id=? AND status='verified'", (now, known['id']))
            done({'slug': item['slug'], 'result': 'unchanged', 'id': known['id']})
        elif limit is None or len(todo) < limit:
            todo.append((item, subskill))

    def save(item, subskill, report):
        if not report.get('passed'):
            return {'slug': item['slug'], 'result': 'robot_failed', 'problems': failures(report)}
        with db.transaction() as conn:
            version_id, _ = save_version(conn, now, subskill, title=item['title'], emoji=item.get('emoji', '🎮'), premise=item['premise'], idea=item.get('idea', ''),
                                         code=item['code'], css=item['css'], report=report, review=None, origin='seed_example',
                                         model=item.get('author', 'hand-written'), status='approved' if approve else 'verified')
        return {'slug': item['slug'], 'result': 'added', 'id': version_id}

    if workers <= 1 or len(todo) <= 1:
        for item, subskill in todo:
            done(save(item, subskill, robot(item['code'], item['css'])))
    else:
        from concurrent.futures import ThreadPoolExecutor
        # The robot (a browser) runs in the pool. Every database write stays on this thread.
        with ThreadPoolExecutor(max_workers=workers) as pool:
            for (item, subskill), report in zip(todo, pool.map(lambda pair: robot(pair[0]['code'], pair[0]['css']), todo)):
                done(save(item, subskill, report))
    return out


def playable(conn, subskill_id, require_approval):
    """The newest game a child may be offered for this skill, or None."""
    statuses = ('approved',) if require_approval else ('approved', 'verified')
    marks = ','.join('?' for _ in statuses)
    return conn.execute(f"SELECT * FROM game_versions WHERE subskill_id=? AND status IN ({marks}) ORDER BY status='approved' DESC, created_at DESC, id LIMIT 1",
                        (subskill_id, *statuses)).fetchone()


def waiting_for_review(conn, subskill_id):
    return conn.execute("SELECT id FROM game_versions WHERE subskill_id=? AND status='verified' LIMIT 1", (subskill_id,)).fetchone()


def open_job(conn, subskill_id, now):
    row = conn.execute("SELECT * FROM game_jobs WHERE subskill_id=? AND status IN ('queued','running')", (subskill_id,)).fetchone()
    if row and row['status'] == 'running' and (row['lease_until'] or 0) < now:
        # A worker died mid-build. Put the job back in line instead of blocking the skill forever.
        conn.execute("UPDATE game_jobs SET status='queued',lease_until=NULL,updated_at=? WHERE id=?", (now, row['id']))
        row = conn.execute('SELECT * FROM game_jobs WHERE id=?', (row['id'],)).fetchone()
    return row


def recently_failed(conn, subskill_id, now):
    row = conn.execute("SELECT updated_at FROM game_jobs WHERE subskill_id=? AND status='failed' ORDER BY updated_at DESC LIMIT 1", (subskill_id,)).fetchone()
    return bool(row and now - row['updated_at'] < FAILED_RETRY_SECONDS)


def enqueue(conn, subskill_id, now):
    """Queue one build for a skill. Returns the job id, or None when one is open or one just failed."""
    if open_job(conn, subskill_id, now) or recently_failed(conn, subskill_id, now):
        return None
    job_id = uid()
    conn.execute('INSERT INTO game_jobs VALUES (?,?,?,?,?,?,?,?)', (job_id, subskill_id, 'queued', None, None, None, now, now))
    return job_id


def claim_next(conn, now):
    row = conn.execute("SELECT * FROM game_jobs WHERE status='queued' ORDER BY created_at,id LIMIT 1").fetchone()
    if not row:
        return None
    conn.execute("UPDATE game_jobs SET status='running',lease_until=?,updated_at=? WHERE id=? AND status='queued'", (now + JOB_LEASE_SECONDS, now, row['id']))
    return row


def close_job(conn, job_id, now, *, version_id=None, failure=None):
    conn.execute('UPDATE game_jobs SET status=?,game_version_id=?,failure_json=?,lease_until=NULL,updated_at=? WHERE id=?',
                 ('done' if version_id else 'failed', version_id, encode(failure) if failure else None, now, job_id))
