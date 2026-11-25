"""Idea -> code -> static checks -> robot player -> repair -> model review.

The pipeline never approves anything. Its best outcome is a `verified` game that waits
for a person. It is run from a background job or the CLI, never while a child waits.
"""
import asyncio
import dataclasses
from dataclasses import dataclass, field

from .checks import static_issues
from .config import MAX_REPAIRS, GameSettings
from .models import GameDraft, GameReview
from . import prompts
from .robot import RobotUnavailable, failures, run_robot


class ModelGameAdapter:
    """Uses Sidekick's one shared model transport. Curriculum data in, a game out."""

    def __init__(self, settings=None):
        from backend.provider import VisionSettings
        base = VisionSettings.from_env()
        games = settings or GameSettings.from_env()
        self.settings = dataclasses.replace(base, model=games.model or base.model, timeout=games.timeout)
        self.model = self.settings.model

    async def _call(self, response_model, task, system, user):
        from backend.gap.vision import structured_call
        return await structured_call(response_model, task=task, system=system, user=user, settings=self.settings)

    async def draft(self, subskill, examples, context=None):
        return await self._call(GameDraft, 'write_game', prompts.draft_system(examples), prompts.draft_user(subskill, context))

    async def repair(self, subskill, examples, draft, problems):
        return await self._call(GameDraft, 'repair_game', prompts.draft_system(examples) + '\n' + prompts.REPAIR, prompts.repair_user(subskill, draft, problems))

    async def review(self, subskill, draft, manifest):
        return await self._call(GameReview, 'review_game', prompts.REVIEW + '\n# The kit\n' + prompts.kit_reference(), prompts.review_user(subskill, draft, manifest))


@dataclass
class BuildResult:
    ok: bool
    draft: GameDraft | None = None
    report: dict | None = None
    review: GameReview | None = None
    model_calls: int = 0
    robot_runs: int = 0
    history: list = field(default_factory=list)   # what went wrong on each try, for people debugging a failed build

    def reasons(self):
        return self.history[-1]['problems'] if self.history and not self.ok else []


async def build_game(subskill, adapter, *, examples=None, context=None, robot=run_robot, max_repairs=MAX_REPAIRS):
    """Returns a BuildResult. `ok` means static checks, the robot and the model review all passed."""
    examples = prompts.pick_examples(subskill, examples if examples is not None else prompts.load_examples())
    result = BuildResult(ok=False)
    draft = await adapter.draft(subskill, examples, context)
    result.model_calls += 1
    repairs = review_repairs = 0
    while True:
        report = review = None
        static = static_issues(draft.code, draft.css)
        if static:
            stage, problems = 'static', ['static_checks: ' + ', '.join(static)]
        else:
            # The robot drives a real browser, so it must not block the server's event loop.
            report = await asyncio.to_thread(robot, draft.code, draft.css)
            result.robot_runs += 1
            stage, problems = 'robot', failures(report)
            if report.get('passed') and not problems:
                review = await adapter.review(subskill, draft, report.get('manifest'))
                result.model_calls += 1
                if review.passed():
                    result.ok, result.draft, result.report, result.review = True, draft, report, review
                    return result
                stage, problems = 'review', ['review: ' + issue for issue in review.issues] or ['review: the reviewer did not pass this game']
        result.draft, result.report, result.review = draft, report, review
        result.history.append({'stage': stage, 'problems': problems[:20]})
        # One review-driven rewrite is enough; a second miss needs a person or a fresh idea.
        if repairs >= max_repairs or (stage == 'review' and review_repairs >= 1):
            return result
        repairs += 1
        review_repairs += stage == 'review'
        draft = await adapter.repair(subskill, examples, draft, problems)
        result.model_calls += 1


__all__ = ['BuildResult', 'ModelGameAdapter', 'RobotUnavailable', 'build_game']
