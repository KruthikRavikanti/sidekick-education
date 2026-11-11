"""Public request contracts. Child responses are deliberately constructed without keys."""
from typing import Literal, Any
from pydantic import BaseModel, ConfigDict, Field
from backend.accounts.models import KidView


class Input(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)


class ParentSkill(Input):
    id: str
    subskillId: str
    name: str
    subject: Literal['math', 'ela']
    commonCoreCode: str
    status: Literal['unassessed', 'on_track', 'needs_support']
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
