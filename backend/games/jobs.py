"""Background game builds. One at a time per process, never in a child's request."""
import asyncio

from backend.gap.catalog import get_subskill
from backend.provider import ExtractionError

from . import library
from .pipeline import ModelGameAdapter, RobotUnavailable, build_game

_drain_lock = asyncio.Lock()


async def build_one(db, clock, job, adapter=None, robot=None):
    """Run one claimed job to the end and record what happened."""
    with db.transaction() as conn:
        subskill = get_subskill(conn, job['subskill_id'])
        # Titles and ideas of games that exist for this skill: game data only, nothing about a child.
        made = library.already_made(conn, job['subskill_id'])
    failure, version_id = None, None
    try:
        if not subskill or not subskill['active']:
            raise ValueError('skill_retired')
        adapter = adapter or ModelGameAdapter()
        kwargs = {'robot': robot} if robot else {}
        result = await build_game(subskill, adapter, context=made or None, **kwargs)
        if result.ok:
            with db.transaction() as conn:
                version_id, _ = library.save_version(conn, clock.now(), subskill, title=result.draft.title, emoji=result.draft.emoji,
                    premise=result.draft.premise, idea=result.draft.idea, code=result.draft.code, css=result.draft.css,
                    report=result.report, review=result.review.model_dump(), origin='model_generated', model=getattr(adapter, 'model', '') or 'unknown')
        else:
            draft = result.draft
            failure = {'code': 'not_verified', 'modelCalls': result.model_calls, 'robotRuns': result.robot_runs, 'history': result.history[-8:],
                       'lastDraft': {'title': draft.title, 'premise': draft.premise, 'code': draft.code[:60_000]} if draft else None}
    except ExtractionError as error:
        # The provider code is safe to keep; provider bodies and prompts are never stored.
        failure = {'code': error.code}
    except RobotUnavailable:
        failure = {'code': 'robot_unavailable'}
    except ValueError as error:
        failure = {'code': str(error)[:60] or 'invalid'}
    with db.transaction() as conn:
        library.close_job(conn, job['id'], clock.now(), version_id=version_id, failure=failure)
    return version_id, failure


async def drain(db, clock, adapter=None, robot=None, limit=20):
    """Work through queued builds. Safe to call often: only one drain runs at a time."""
    if _drain_lock.locked():
        return 0
    done = 0
    async with _drain_lock:
        while done < limit:
            with db.transaction() as conn:
                job = library.claim_next(conn, clock.now())
            if not job:
                break
            await build_one(db, clock, job, adapter, robot)
            done += 1
    return done
