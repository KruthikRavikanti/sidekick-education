"""Strict shapes for model output and for what the browser may send back."""
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field


class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid')


class GameDraft(Strict):
    ideas: list[str] = Field(min_length=3, max_length=3, description='Three different game ideas for this skill, one sentence each.')
    chosen: int = Field(ge=0, le=2, description='Index of the idea with the most play and the least quiz.')
    title: str = Field(min_length=3, max_length=60)
    emoji: str = Field(min_length=1, max_length=8)
    premise: str = Field(min_length=10, max_length=180)
    idea: str = Field(min_length=10, max_length=320, description='How the skill is the rule that makes this game work.')
    code: str = Field(min_length=200, max_length=60_000, description='The whole game: JavaScript that calls Sidekick.game once.')
    css: str = Field(max_length=8_000, description='Optional extra CSS, or an empty string.')


class GameReview(Strict):
    conceptIsTheRule: bool = Field(description='Winning is only possible by using the skill; the world itself shows why.')
    playNotQuiz: bool = Field(description='The child moves or changes things in a world. It could not be printed on paper.')
    contentCorrect: bool = Field(description='Every number, word and statement is correct for the skill and grade.')
    kidAppropriate: bool = Field(description='Kind, simple language. Nothing scary, commercial or off-topic.')
    soloIsFresh: bool = Field(description='The last round uses new numbers or words and gives no help.')
    mistakeIsRealistic: bool = Field(description='The declared mistakes are ones a real child makes on this skill.')
    issues: list[str] = Field(max_length=6, description='Short, specific problems to fix. Empty when everything passes.')

    def passed(self):
        return all([self.conceptIsTheRule, self.playNotQuiz, self.contentCorrect, self.kidAppropriate, self.soloIsFresh, self.mistakeIsRealistic])


Tag = Annotated[str, Field(max_length=60)]


class UploadRef(Strict):
    uploadId: str = Field(min_length=1, max_length=64)


class StartRequest(Strict):
    uploadId: str = Field(min_length=1, max_length=64)
    idempotencyKey: str = Field(min_length=8, max_length=64, pattern=r'^[A-Za-z0-9_-]+$')


class RoundResult(Strict):
    id: str = Field(max_length=40)
    phase: Literal['guided', 'solo']
    attempts: int = Field(ge=0, le=500)
    hints: int = Field(ge=0, le=500)
    solved: bool
    firstTry: bool | None
    mistakes: list[Tag] = Field(max_length=6)


class SoloResult(Strict):
    solved: bool
    firstTry: bool
    attempts: int = Field(ge=0, le=500)
    mistakes: list[Tag] = Field(max_length=6)


class GameResult(Strict):
    rounds: list[RoundResult] = Field(max_length=8)
    solo: SoloResult | None
    ms: int = Field(ge=0, le=86_400_000)


class FinishRequest(Strict):
    token: str = Field(min_length=16, max_length=64)
    result: GameResult


class DecisionRequest(Strict):
    decision: Literal['approve', 'retire']
    note: str = Field(default='', max_length=300)
