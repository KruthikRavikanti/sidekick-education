"""Private homework decisions; transcription is always kept separately and verbatim."""
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class Decision(BaseModel):
    model_config = ConfigDict(extra="forbid",strict=True)


class GradeDecision(Decision):
    correctness: Literal["correct", "incorrect", "ungraded"]
    source: Literal["deterministic", "model", "adult", "none"]
    confidence: float = Field(ge=0, le=1)
    explanation: str = Field(max_length=800)


class MappingDecision(Decision):
    subskill_id: str | None
    confidence: float = Field(ge=0, le=1)
    explanation: str = Field(max_length=800)


class SignatureDecision(Decision):
    status: Literal["matched", "possible_slip", "other", "uncertain"]
    confidence: float = Field(ge=0, le=1)
    explanation: str = Field(max_length=800)


class VerificationDecision(Decision):
    verified: bool
    method: str
    explanation: str
    independent_answer: str | None
    model: str = ""
    prompt_version: str = "verify-v1"
    aligned_subskill: bool = False
    difficulty_match: bool = False


class TeacherMark(Decision):
    problem_id: str
    text: str | None
    uncertain: bool
    indicated_correctness: Literal["correct", "incorrect", "unknown"]


class TeacherMarks(Decision):
    marks: list[TeacherMark]


class SolverDecision(Decision):
    answer: str | None
    supported: bool
    context_grounded: bool
    aligned_subskill: bool = False
    difficulty_match: bool = False
    confidence: float = Field(ge=0, le=1)
    explanation: str


class GeneratedOption(Decision):
    id: str
    text: str


class GeneratedContext(Decision):
    passage: str | None
    table: str | None
    graphic_description: str | None


class GeneratedItem(Decision):
    question: str
    answer: str
    answer_type: Literal["number", "choice", "short_text", "adult"]
    options: list[GeneratedOption]
    context: GeneratedContext
    rubric: str | None
    unit: str | None
    representation: Literal["equivalent", "fraction", "decimal", "simplest_fraction", "integer"]
    adult_required: bool


class GeneratedItems(Decision):
    items: list[GeneratedItem]
