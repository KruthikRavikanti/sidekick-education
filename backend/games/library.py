"""The game library: versions, build jobs and which game a child may be offered."""
import hashlib
import json
import uuid

from backend.gap.catalog import get_subskill
from backend.gap.targets import subject_for

from .config import PROMPT_VERSION
from .frame import KIT_VERSION
from . import prompts
from .robot import failures, run_robot

FAILED_RETRY_SECONDS = 24 * 3600   # after the checks turned a game down
UNAVAILABLE_RETRY_SECONDS = 10 * 60   # after the model or the robot could not be reached at all
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
    subject, grade = subject_for(subskill), grade_number(subskill)
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
    if subject and subject_for(subskill or {}) != subject:
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

    items = [item for item in prompts.load_library() if not only or item['slug'] in only]
    with db.transaction() as conn:
        # One read for the whole pass: the library has a game for every skill.
        looked = [(item, get_subskill(conn, item['subskillId']),
                   conn.execute('SELECT id,status FROM game_versions WHERE source_sha256=?', (source_hash(item['code'], item['css']),)).fetchone()) for item in items]
    for item, subskill, known in looked:
        if not _wanted(item, subskill, only, subject, grades):
            continue
        if not subskill or not subskill['active']:
            done({'slug': item['slug'], 'result': 'skill_not_in_catalog'})
        elif subject_for(subskill) is None or grade_number(subskill) is None:
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
                                         code=item['code'], css=item['css'], report=report, review=None, origin=PREMADE_ORIGIN,
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


PREMADE_ORIGIN = 'seed_example'


def origin_filter(premade, column='origin'):
    """SQL that leaves out the games shipped with the app when they are switched off. Empty when they are on."""
    return '' if premade else f" AND {column}!='{PREMADE_ORIGIN}'"


def submitted_at(conn, kid_id, upload_id):
    """When this upload was last sent in, or None when it is not this child's. Sending the same page again counts."""
    row = conn.execute("""SELECT u.created_at AS made, (SELECT MAX(r.created_at) FROM homework_upload_requests r WHERE r.upload_id=u.id) AS sent
        FROM homework_uploads u WHERE u.id=? AND u.kid_id=?""", (upload_id, kid_id)).fetchone()
    return max(row['made'], row['sent'] or 0) if row else None


def already_made(conn, subskill_id, limit=6):
    """The games that exist for a skill, newest first, so a new build can be asked for something different."""
    rows = conn.execute("SELECT title,premise,idea FROM game_versions WHERE subskill_id=? AND status!='retired' ORDER BY created_at DESC, id LIMIT ?", (subskill_id, limit)).fetchall()
    return [{'title': row['title'], 'premise': row['premise'], 'idea': row['idea']} for row in rows]


def playable(conn, subskill_id, require_approval, premade=True, since=None):
    """The game a child may be offered for this skill, or None.

    Normally that is the newest one. With `since` (the time an upload was sent in) only a game written from then
    on counts, and the first of those is the one written for that upload.
    """
    statuses = ('approved',) if require_approval else ('approved', 'verified')
    marks = ','.join('?' for _ in statuses)
    fresh, order = ('', 'DESC') if since is None else (' AND created_at>=?', 'ASC')
    return conn.execute(f"SELECT * FROM game_versions WHERE subskill_id=? AND status IN ({marks}){origin_filter(premade)}{fresh} ORDER BY status='approved' DESC, created_at {order}, id LIMIT 1",
                        (subskill_id, *statuses, *(() if since is None else (since,)))).fetchone()


def waiting_for_review(conn, subskill_id, premade=True, since=None):
    fresh = '' if since is None else ' AND created_at>=?'
    return conn.execute(f"SELECT id FROM game_versions WHERE subskill_id=? AND status='verified'{origin_filter(premade)}{fresh} LIMIT 1",
                        (subskill_id, *(() if since is None else (since,)))).fetchone()


def open_job(conn, subskill_id, now):
    row = conn.execute("SELECT * FROM game_jobs WHERE subskill_id=? AND status IN ('queued','running')", (subskill_id,)).fetchone()
    if row and row['status'] == 'running' and (row['lease_until'] or 0) < now:
        # A worker died mid-build. Put the job back in line instead of blocking the skill forever.
        conn.execute("UPDATE game_jobs SET status='queued',lease_until=NULL,updated_at=? WHERE id=?", (now, row['id']))
        row = conn.execute('SELECT * FROM game_jobs WHERE id=?', (row['id'],)).fetchone()
    return row


def recently_failed(conn, subskill_id, now, since=None):
    """Whether the last build for this skill failed too recently to try again.

    A game the checks turned down waits a day: asking again would most likely fail the same way.
    A build that never got that far, because the model or the robot was unavailable, may try again in minutes.
    With `since` (the time an upload was sent in) a failure from before then does not count: new work gets a new try.
    """
    row = conn.execute("SELECT updated_at,failure_json FROM game_jobs WHERE subskill_id=? AND status='failed' ORDER BY updated_at DESC LIMIT 1", (subskill_id,)).fetchone()
    if not row or (since is not None and row['updated_at'] < since):
        return False
    turned_down = (decode(row['failure_json'], {}) or {}).get('code') == 'not_verified'
    return now - row['updated_at'] < (FAILED_RETRY_SECONDS if turned_down else UNAVAILABLE_RETRY_SECONDS)


def enqueue(conn, subskill_id, now, since=None):
    """Queue one build for a skill. Returns the job id, or None when one is open or one just failed."""
    if open_job(conn, subskill_id, now) or recently_failed(conn, subskill_id, now, since):
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
