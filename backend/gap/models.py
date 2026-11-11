"""Public request contracts. Child responses are deliberately constructed without keys."""
from typing import Literal, Any
from pydantic import BaseModel, ConfigDict, Field
from backend.accounts.models import KidView


class Input(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)


class Assistance(Input):
    hintUsed: bool = False
    answerRevealed: bool = False
    readAloud: bool = False


class Submit(Input):
    assignmentItemId: str = Field(min_length=1, max_length=100)
    idempotencyKey: str = Field(min_length=1, max_length=100)
    response: str | dict[str, Any] | list[Any]
    assistance: Assistance = Field(default_factory=Assistance)


class AdultSubmit(Input):
    assignmentItemId: str = Field(min_length=1, max_length=100)
    idempotencyKey: str = Field(min_length=1, max_length=100)
    correctness: Literal['correct', 'incorrect', 'ungraded']
    independent: bool
    readAloud: bool = False


class ExtraPractice(Input):
    subskillId: str = Field(min_length=1, max_length=100)


class Activity(Input):
    activeSeconds: int = Field(ge=0, le=120)
    finished: bool = False


class ParentSkill(Input):
    id: str
    subskillId: str
    name: str
    subject: Literal['math', 'ela']
    commonCoreCode: str
    status: Literal['unassessed', 'on_track', 'checking', 'gap', 'practicing', 'mastered']
    parentExplanation: str | None = None
    observedPattern: str | None = None
    homeTip: str | None = None
    evidence: list[dict[str, Any]] = Field(default_factory=list)
    traceback: list[dict[str, Any]] = Field(default_factory=list)
    stopReason: str | None = None
    currentPracticeTarget: str | None = None
    teacherSuggestion: str | None = None


class ParentAnalytics(Input):
    sessionsThisWeek: int
    timeSpentMinutes: int
    problemsAttempted: int
    problemsCorrect: int
    problemsUngraded: int


class ParentDashboardView(Input):
    profile: KidView
    sample: bool = False
    skills: list[ParentSkill]
    analytics: ParentAnalytics
    conversations: list[dict[str, Any]] = Field(default_factory=list)
