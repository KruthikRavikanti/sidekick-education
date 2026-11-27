"""Idea -> code -> static checks -> robot player -> repair -> model review -> rewrite.

The pipeline never approves anything. Its best outcome is a `verified` game that waits
for a person. It is run from a background job or the CLI, never while a child waits.

The model reviewer stops defects only: something false, a wrong rule, the wrong skill, unkind words.
Everything else it notices is kept as notes for the person who reviews the game.
"""
import asyncio
import dataclasses
from dataclasses import dataclass, field

from .checks import explain, static_issues
from .config import MAX_REPAIRS, MAX_REWRITES, GameSettings
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
        from backend.provider import ExtractionError
        try:
            return await structured_call(response_model, task=task, system=system, user=user, settings=self.settings)
        except ExtractionError as error:
            # One more try when the answer came back malformed or the provider hiccuped, so a whole build is not
            # lost to it. A timeout is not retried: it has already taken minutes.
            if error.code not in {'invalid_extraction', 'provider_unavailable'}:
                raise
        return await structured_call(response_model, task=task, system=system, user=user, settings=self.settings)

    async def draft(self, subskill, examples, context=None):
        return await self._call(GameDraft, 'write_game', prompts.draft_system(examples), prompts.draft_user(subskill, context))

    async def repair(self, subskill, examples, draft, problems, stage='robot'):
        how = prompts.REWRITE if stage == 'review' else prompts.REPAIR
        return await self._call(GameDraft, 'repair_game', prompts.draft_system(examples) + '\n' + how, prompts.repair_user(subskill, draft, problems))

    async def review(self, subskill, draft, manifest, earlier=None):
        return await self._call(GameReview, 'review_game', prompts.REVIEW + '\n# The kit\n' + prompts.kit_reference(), prompts.review_user(subskill, draft, manifest, earlier))


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


async def build_game(subskill, adapter, *, examples=None, context=None, robot=run_robot, max_repairs=MAX_REPAIRS, max_rewrites=MAX_REWRITES):
    """Returns a BuildResult. `ok` means static checks and the robot passed and the model reviewer found no defect."""
    examples = prompts.pick_examples(subskill, examples if examples is not None else prompts.load_examples())
    result = BuildResult(ok=False)
    draft = await adapter.draft(subskill, examples, context)
    result.model_calls += 1
    repairs = rewrites = 0
    raised = []   # defects the reviewer has asked for, so the next review checks them instead of starting over
    while True:
        report = review = None
        static = static_issues(draft.code, draft.css)
        if static:
            # History keeps the reason codes. The writer also gets what each one means and the text that tripped it.
            stage, problems, told = 'static', ['static_checks: ' + ', '.join(static)], explain(draft.code, draft.css)
        else:
            # The robot drives a real browser, so it must not block the server's event loop.
            report = await asyncio.to_thread(robot, draft.code, draft.css)
            result.robot_runs += 1
            stage, problems = 'robot', failures(report)
            if report.get('passed') and not problems:
                review = await adapter.review(subskill, draft, report.get('manifest'), raised)
                result.model_calls += 1
                if review.passed():
                    result.ok, result.draft, result.report, result.review = True, draft, report, review
                    return result
                stage, problems = 'review', ['review: ' + item for item in review.problems()]
                raised = (raised + review.problems())[-12:]
            told = problems = problems or ['robot: the game did not pass, and the robot gave no reason']
        result.draft, result.report, result.review = draft, report, review
        result.history.append({'stage': stage, 'problems': problems[:20]})
        # Each kind of fix has its own small budget. Past it, the skill needs a person or a fresh idea.
        if (rewrites if stage == 'review' else repairs) >= (max_rewrites if stage == 'review' else max_repairs):
            return result
        rewrites += stage == 'review'
        repairs += stage != 'review'
        draft = await adapter.repair(subskill, examples, draft, told, stage)
        result.model_calls += 1


__all__ = ['BuildResult', 'ModelGameAdapter', 'RobotUnavailable', 'build_game']
