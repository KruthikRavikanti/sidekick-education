"""Owned game play, parent history and the review gate.

A game run records what happened for the parent. It never changes skill states or
counts as evidence: games are practice, and the result comes from the child's browser.
"""
import hmac
import os
import secrets

from backend.accounts.security import AccountError
from backend.gap import targets
from backend.gap.catalog import get_subskill
from backend.gap.service import authorize

from . import library
from .config import GameSettings
from .frame import build_document, frame_headers


def model_configured():
    return bool(os.getenv('VISION_API_KEY', '').strip() and (os.getenv('GAMES_MODEL', '').strip() or os.getenv('VISION_MODEL', '').strip()))


def skill_view(subskill):
    return dict(id=subskill['subskill_id'], name=subskill['subskill'], subject=targets.subject_for(subskill))


def game_view(version):
    return dict(id=version['id'], title=version['title'], premise=version['premise'], emoji=version['emoji'])


def _pick(conn, security, kid_id, upload_id, active, settings):
    """The skill on this upload to play, preferring one that already has a game."""
    # Games exist for every grade in the skill map, high school included.
    candidates, reason = targets.candidates(conn, security, kid_id, upload_id, active, grade_of=library.grade_number)
    if not candidates:
        return None, None, reason or 'no_supported_skill'
    ranked = []
    for priority, target, _ in candidates:
        version = library.playable(conn, target['subskill_id'], settings.require_approval)
        ranked.append((0 if version else 1, priority, target, version))
    _, _, target, version = min(ranked, key=lambda item: item[:2])
    return target, version, None


def suggestion(security, kid_id, upload_id, active):
    settings = GameSettings.from_env()
    off = dict(enabled=False, state='off', reason=None, targetSkill=None, game=None, canRequest=False, runId=None)
    if not settings.enabled:
        with security.db.transaction() as conn:
            authorize(security, conn, kid_id, active, 'kid')
        return off
    with security.db.transaction() as conn:
        target, version, reason = _pick(conn, security, kid_id, upload_id, active, settings)
        if not target:
            return {**off, 'enabled': True, 'state': 'none', 'reason': reason}
        now = security.clock.now()
        run = conn.execute("SELECT id FROM game_runs WHERE kid_id=? AND upload_id=? AND status='in_progress' ORDER BY started_at DESC LIMIT 1", (kid_id, upload_id)).fetchone()
        if version:
            state = 'ready'
        elif library.open_job(conn, target['subskill_id'], now):
            state = 'building'
        elif library.waiting_for_review(conn, target['subskill_id']):
            state = 'in_review'
        else:
            state = 'none'
        can_request = state == 'none' and settings.autogenerate and model_configured() and not library.recently_failed(conn, target['subskill_id'], now)
        return dict(enabled=True, state=state, reason=None, targetSkill=skill_view(target), game=game_view(version) if version else None,
                    canRequest=can_request, runId=run['id'] if run and version else None)


def request_build(security, kid_id, upload_id, active):
    """Ask for a game to be invented for the skill on this upload. Returns whether a build was queued."""
    settings = GameSettings.from_env()
    if not settings.enabled or not settings.autogenerate or not model_configured():
        with security.db.transaction() as conn:
            authorize(security, conn, kid_id, active, 'kid')
        return dict(queued=False, state='off')
    with security.db.transaction() as conn:
        target, version, _ = _pick(conn, security, kid_id, upload_id, active, settings)
        if not target:
            return dict(queued=False, state='none')
        if version:
            return dict(queued=False, state='ready')
        if library.waiting_for_review(conn, target['subskill_id']):
            return dict(queued=False, state='in_review')
        # The job names a skill only. Nothing about the child or the upload reaches the model.
        job_id = library.enqueue(conn, target['subskill_id'], security.clock.now())
        building = bool(job_id or library.open_job(conn, target['subskill_id'], security.clock.now()))
        return dict(queued=bool(job_id), state='building' if building else 'none')


def _run_view(conn, run):
    version = conn.execute('SELECT * FROM game_versions WHERE id=?', (run['game_version_id'],)).fetchone()
    subskill = get_subskill(conn, run['subskill_id'])
    return dict(id=run['id'], status=run['status'], uploadId=run['upload_id'], game=game_view(version), targetSkill=skill_view(subskill),
                messageToken=run['message_token'], kitVersion=version['kit_version'], result=library.decode(run['result_json']))


def _owned_run(conn, security, kid_id, run_id, active):
    authorize(security, conn, kid_id, active, 'kid')
    run = conn.execute('SELECT * FROM game_runs WHERE id=? AND kid_id=?', (run_id, kid_id)).fetchone()
    if not run:
        raise AccountError('not_found', 'That game was not found.', 404)
    return run


def start(security, kid_id, body, active):
    settings = GameSettings.from_env()
    if not settings.enabled:
        raise AccountError('not_found', 'Games are not turned on.', 404)
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, active, 'kid')
        earlier = conn.execute('SELECT run_id FROM game_start_requests WHERE kid_id=? AND request_key=?', (kid_id, body.idempotencyKey)).fetchone()
        if earlier:
            return _run_view(conn, conn.execute('SELECT * FROM game_runs WHERE id=?', (earlier['run_id'],)).fetchone())
        target, version, _ = _pick(conn, security, kid_id, body.uploadId, active, settings)
        if not target or not version:
            raise AccountError('no_game_ready', 'No game is ready for this skill yet.', 409)
        now, run_id = security.clock.now(), library.uid()
        conn.execute('INSERT INTO game_runs VALUES (?,?,?,?,?,?,?,?,?,?,?)', (run_id, kid_id, body.uploadId, version['id'], target['subskill_id'],
                     secrets.randbelow(2_000_000_000) + 1, secrets.token_urlsafe(24), 'in_progress', None, now, None))
        conn.execute('INSERT INTO game_start_requests VALUES (?,?,?,?)', (kid_id, body.idempotencyKey, run_id, now))
        return _run_view(conn, conn.execute('SELECT * FROM game_runs WHERE id=?', (run_id,)).fetchone())


def run_view(security, kid_id, run_id, active):
    with security.db.transaction() as conn:
        return _run_view(conn, _owned_run(conn, security, kid_id, run_id, active))


def run_frame(security, kid_id, run_id, active):
    """The locked document for one run: (html, headers). Carries no information about the child."""
    with security.db.transaction() as conn:
        run = _owned_run(conn, security, kid_id, run_id, active)
        version = conn.execute('SELECT * FROM game_versions WHERE id=?', (run['game_version_id'],)).fetchone()
        if version['status'] == 'retired':
            raise AccountError('game_retired', 'This game is no longer available.', 410)
    html, nonce = build_document(version['code'], version['css'], seed=run['seed'], title=version['title'], kit_version=version['kit_version'], token=run['message_token'])
    return html, frame_headers(nonce)


def finish(security, kid_id, run_id, body, active):
    with security.db.transaction() as conn:
        run = _owned_run(conn, security, kid_id, run_id, active)
        if not hmac.compare_digest(run['message_token'], body.token):
            raise AccountError('invalid_request', 'Check the information and try again.', 400)
        if run['status'] == 'in_progress':
            # First finish wins. A replay or a second tab cannot rewrite the record.
            conn.execute("UPDATE game_runs SET status='completed',result_json=?,completed_at=? WHERE id=? AND status='in_progress'",
                         (library.encode(body.result.model_dump()), security.clock.now(), run_id))
            run = conn.execute('SELECT * FROM game_runs WHERE id=?', (run_id,)).fetchone()
        return _run_view(conn, run)


def history(security, kid_id, active):
    with security.db.transaction() as conn:
        authorize(security, conn, kid_id, active, 'parent')
        rows = conn.execute("""SELECT r.*, v.title, v.emoji FROM game_runs r JOIN game_versions v ON v.id=r.game_version_id
            WHERE r.kid_id=? ORDER BY r.started_at DESC LIMIT 50""", (kid_id,)).fetchall()
        out = []
        for row in rows:
            subskill = get_subskill(conn, row['subskill_id'])
            result = library.decode(row['result_json'], {}) or {}
            solo = result.get('solo') or None
            out.append(dict(id=row['id'], title=row['title'], emoji=row['emoji'], status=row['status'], startedAt=row['started_at'], completedAt=row['completed_at'],
                            targetSkill=skill_view(subskill) if subskill else None,
                            solo=dict(solved=bool(solo.get('solved')), firstTry=bool(solo.get('firstTry')), attempts=int(solo.get('attempts') or 0), mistakes=list(solo.get('mistakes') or [])[:6]) if solo else None,
                            hints=sum(int(item.get('hints') or 0) for item in result.get('rounds', []))))
        return dict(enabled=GameSettings.from_env().enabled, runs=out)


# ------------------------------------------------------------------ review gate

def _reviewer(security, conn, active):
    security.assert_active(conn, active, 'parent')
    account = conn.execute('SELECT email FROM accounts WHERE id=?', (active.account_id,)).fetchone()
    settings = GameSettings.from_env()
    listed = bool(account) and account['email'].casefold() in settings.reviewers
    # With no reviewer list, local development and tests let any parent review. Production never does.
    local = not settings.reviewers and security.settings.app_env in {'development', 'test'}
    if not (listed or local):
        raise AccountError('reviewer_required', 'Game review is limited to the Sidekick team.', 403)
    return settings


def is_reviewer(security, active):
    with security.db.transaction() as conn:
        try:
            settings = _reviewer(security, conn, active)
        except AccountError as error:
            if error.code != 'reviewer_required':
                raise
            return dict(reviewer=False, enabled=GameSettings.from_env().enabled)
        waiting = conn.execute("SELECT COUNT(*) FROM game_versions WHERE status='verified'").fetchone()[0]
        return dict(reviewer=True, enabled=settings.enabled, waiting=waiting, requireApproval=settings.require_approval)


def _review_row(conn, row, full=False):
    subskill = get_subskill(conn, row['subskill_id'])
    report = library.decode(row['robot_report_json'], {}) or {}
    plays = conn.execute('SELECT COUNT(*) FROM game_runs WHERE game_version_id=?', (row['id'],)).fetchone()[0]
    view = dict(id=row['id'], title=row['title'], emoji=row['emoji'], premise=row['premise'], idea=row['idea'], status=row['status'], origin=row['origin'],
                model=row['model'], grade=row['grade'], gradeLabel=str((subskill or {}).get('grade', row['grade'])), subject=row['subject'],
                createdAt=row['created_at'], decidedAt=row['decided_at'], plays=plays,
                targetSkill=dict(id=row['subskill_id'], name=subskill['subskill'] if subskill else row['subskill_id'],
                                 misconception=(subskill or {}).get('common_misconception', '')),
                robot=dict(passed=bool(report.get('passed')), checks=len(report.get('checks', [])), stats=report.get('stats', {})))
    if full:
        manifest = library.decode(row['manifest_json'], {}) or {}
        view.update(code=row['code'], css=row['css'], kitVersion=row['kit_version'], promptVersion=row['prompt_version'], decisionNote=row['decision_note'],
                    robotChecks=report.get('checks', []), modelReview=library.decode(row['review_json']),
                    rounds=[dict(id=r.get('id'), phase=r.get('phase'), say=r.get('say'), hints=r.get('hints', []), win=r.get('win', ''),
                                 mistakes=[dict(tag=m.get('tag'), say=m.get('say', '')) for m in r.get('mistakes', [])]) for r in manifest.get('rounds', [])])
    return view


REVIEW_PAGE = 50
_REVIEW_STATUS = {'waiting': 'verified', 'verified': 'verified', 'approved': 'approved', 'retired': 'retired'}


def review_list(security, active, *, status='waiting', subject=None, grade=None, q=None, limit=REVIEW_PAGE, offset=0):
    """One page of games for reviewers, with counts for every filter.

    The library holds a game for every skill, so the list is filtered (status, subject, grade, search)
    and paged. Games are ordered by subject, grade and skill so a reviewer can work through a grade.
    """
    limit, offset = max(1, min(int(limit or REVIEW_PAGE), 100)), max(0, int(offset or 0))
    where, values = [], []
    if status in _REVIEW_STATUS:
        where.append('v.status=?')
        values.append(_REVIEW_STATUS[status])
    if subject in library.SUBJECT_LABELS:
        where.append('v.subject=?')
        values.append(subject)
    if grade not in (None, ''):
        # The skill map's own label ('K', '5', 'Algebra 1', '9-10'), so bands that share a number stay apart.
        where.append('s.grade=?')
        values.append(str(grade))
    text = ' '.join(str(q or '').split())[:80]
    if text:
        like = '%' + text.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_') + '%'
        where.append("(v.title LIKE ? ESCAPE '\\' OR v.subskill_id LIKE ? ESCAPE '\\' OR s.name LIKE ? ESCAPE '\\')")
        values += [like, like, like]
    clause = (' WHERE ' + ' AND '.join(where)) if where else ''
    source = 'FROM game_versions v JOIN catalog_subskills s ON s.id=v.subskill_id'
    with security.db.transaction() as conn:
        settings = _reviewer(security, conn, active)
        total = conn.execute(f'SELECT COUNT(*) {source}{clause}', values).fetchone()[0]
        rows = conn.execute(f"""SELECT v.* {source}{clause}
            ORDER BY CASE v.status WHEN 'verified' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, v.subject DESC, v.grade, s.grade, v.subskill_id, v.created_at DESC
            LIMIT ? OFFSET ?""", (*values, limit, offset)).fetchall()
        counts = {row[0]: row[1] for row in conn.execute('SELECT status,COUNT(*) FROM game_versions GROUP BY status')}
        grades = [dict(subject=row['subject'], grade=row['label'], waiting=row['waiting'], total=row['total']) for row in conn.execute(
            f"""SELECT v.subject AS subject, s.grade AS label, MIN(v.grade) AS number, SUM(v.status='verified') AS waiting, COUNT(*) AS total
                {source} GROUP BY v.subject, s.grade ORDER BY v.subject DESC, number, s.grade""")]
        jobs = conn.execute("SELECT j.*, s.name AS skill_name FROM game_jobs j JOIN catalog_subskills s ON s.id=j.subskill_id WHERE j.status!='done' ORDER BY j.updated_at DESC LIMIT 30").fetchall()
        return dict(enabled=settings.enabled, requireApproval=settings.require_approval, autogenerate=settings.autogenerate, modelConfigured=model_configured(),
                    games=[_review_row(conn, row) for row in rows], total=total, offset=offset, limit=limit,
                    counts=dict(verified=counts.get('verified', 0), approved=counts.get('approved', 0), retired=counts.get('retired', 0)), grades=grades,
                    jobs=[dict(id=j['id'], status=j['status'], skill=dict(id=j['subskill_id'], name=j['skill_name']), updatedAt=j['updated_at'],
                               failure=_failure_view(library.decode(j['failure_json']))) for j in jobs])


def _failure_view(failure):
    if not failure:
        return None
    history = failure.get('history') or []
    return dict(code=str(failure.get('code'))[:60], problems=[str(p)[:300] for p in (history[-1].get('problems', []) if history else [])][:8])


def _version(conn, version_id):
    row = conn.execute('SELECT * FROM game_versions WHERE id=?', (version_id,)).fetchone()
    if not row:
        raise AccountError('not_found', 'That game was not found.', 404)
    return row


def review_detail(security, version_id, active):
    with security.db.transaction() as conn:
        _reviewer(security, conn, active)
        return _review_row(conn, _version(conn, version_id), full=True)


def review_frame(security, version_id, active, seed=None):
    with security.db.transaction() as conn:
        _reviewer(security, conn, active)
        row = _version(conn, version_id)
    html, nonce = build_document(row['code'], row['css'], seed=seed, title=row['title'], kit_version=row['kit_version'])
    return html, frame_headers(nonce)


def decide(security, version_id, body, active):
    with security.db.transaction() as conn:
        _reviewer(security, conn, active)
        row = _version(conn, version_id)
        status = 'approved' if body.decision == 'approve' else 'retired'
        if row['status'] == 'retired' and status == 'approved':
            raise AccountError('game_retired', 'A retired game stays retired. Build a new one instead.', 409)
        conn.execute('UPDATE game_versions SET status=?,decided_at=?,decided_by=?,decision_note=? WHERE id=?',
                     (status, security.clock.now(), active.account_id, body.note.strip()[:300] or None, version_id))
        return _review_row(conn, _version(conn, version_id), full=True)
