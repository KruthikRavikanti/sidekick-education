"""The extraction contract. Nullable fields preserve gaps without inventing text."""

from typing import Literal

from pydantic import BaseModel, ConfigDict, model_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class TranscribedField(StrictModel):
    text: str | None
    uncertain: bool


class SharedContext(StrictModel):
    id: str
    type: Literal["passage", "table", "diagram", "other"]
    title: TranscribedField
    content: TranscribedField


class Worksheet(StrictModel):
    title: TranscribedField
    subject: Literal["math", "ela", "unknown"]
    subject_uncertain: bool
    printed_grade: TranscribedField
    directions: list[TranscribedField]
    shared_context: list[SharedContext]


class AnswerChoice(StrictModel):
    label: TranscribedField
    text: TranscribedField


class StudentWork(StrictModel):
    steps: list[TranscribedField]
    final_answer: TranscribedField
    selected_choice: TranscribedField
    status: Literal["answered", "blank", "unclear"]

    @model_validator(mode="after")
    def status_matches_visible_work(self):
        # Readable steps do not resolve a wholly unreadable answer or selection.
        # Keep the transcription untouched and expose that uncertainty in the status.
        if self.status == "answered" and any(
            field.text is None and field.uncertain
            for field in [self.final_answer, self.selected_choice]
        ):
            self.status = "unclear"
        has_work = bool(self.steps) or self.final_answer.text is not None or self.selected_choice.text is not None
        if self.status == "blank" and (has_work or self.final_answer.uncertain or self.selected_choice.uncertain):
            raise ValueError("A blank response cannot contain visible or uncertain work")
        if self.status == "answered" and not has_work:
            raise ValueError("An answered response requires identifiable visible work")
        if self.status == "unclear" and not any(field.uncertain for field in [*self.steps, self.final_answer, self.selected_choice]):
            raise ValueError("An unclear response must identify its uncertain fields")
        return self


class Problem(StrictModel):
    id: str
    label: TranscribedField
    question: TranscribedField
    answer_choices: list[AnswerChoice]
    context_refs: list[str]
    student_work: StudentWork


class Extraction(StrictModel):
    worksheet: Worksheet
    problems: list[Problem]

    @model_validator(mode="after")
    def validate_references(self):
        context_ids = [context.id for context in self.worksheet.shared_context]
        problem_ids = [problem.id for problem in self.problems]
        if len(context_ids) != len(set(context_ids)) or len(problem_ids) != len(set(problem_ids)):
            raise ValueError("Identifiers must be unique")
        if any(ref not in context_ids for problem in self.problems for ref in problem.context_refs):
            raise ValueError("Shared context reference does not exist")
        return self


class ExtractionResponse(Extraction):
    source: Literal["live", "fixture"]


class ErrorDetail(StrictModel):
    code: str
    message: str


class ErrorResponse(StrictModel):
    error: ErrorDetail
