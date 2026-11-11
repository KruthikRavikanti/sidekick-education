"""Typed, private practice specifications. Answer keys never enter public_item()."""
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

UIKind = Literal["number", "choice", "short_text", "ordering", "matching", "number_line", "graph", "adult"]
Readiness = Literal["pending", "ready", "adult_required", "missing_context"]


class PracticeContext(BaseModel):
    model_config = ConfigDict(extra="forbid")
    passages: list[dict[str, Any]] = Field(default_factory=list)
    tables: list[dict[str, Any]] = Field(default_factory=list)
    graphics: list[dict[str, Any]] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    missing: list[str] = Field(default_factory=list)


class ResponseSpec(BaseModel):
    model_config = ConfigDict(extra="forbid")
    kind: UIKind
    fields: list[dict[str, Any]] = Field(default_factory=list)
    options: list[dict[str, str]] = Field(default_factory=list)
    items: list[dict[str, str]] = Field(default_factory=list)
    graph: dict[str, Any] | None = None
    readAloud: bool = False


class GradingSpec(BaseModel):
    model_config = ConfigDict(extra="forbid")
    kind: UIKind
    exactFraction: str | None = None
    expectedValues: list[dict[str, Any]] = Field(default_factory=list)
    unit: str | None = None
    representation: str = "equivalent"
    correctOptionId: str | None = None
    expectedOrder: list[str] = Field(default_factory=list)
    expectedMatches: dict[str, str] = Field(default_factory=dict)
    acceptedText: list[str] = Field(default_factory=list)
    expectedGraph: dict[str, Any] | None = None
    rubric: str | None = None
    expectedResponse: str | None = None
    homeTip: str | None = None


class CompiledItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question: str
    answer: str
    answerType: str
    context: PracticeContext
    responseSpec: ResponseSpec
    gradingSpec: GradingSpec
    readiness: Readiness
    verified: bool = False
    verificationMethod: str = "pending"
    verificationResult: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def ready_requires_verification(self):
        if self.readiness == "ready" and not self.verified:
            raise ValueError("A ready item must have completed answer verification")
        if self.readiness == "ready" and self.context.missing:
            raise ValueError("A ready item cannot have missing context")
        return self
