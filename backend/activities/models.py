"""Closed, versioned interaction vocabulary. Answer keys never enter public DTOs."""
import re
from fractions import Fraction
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

SCHEMA_VERSION = '1.0'
COMPONENT_VERSION = 'sidekick-interactions-v1'
PROMPT_VERSION = 'sidekick-activity-v1'
SUPPORTED = {'3.NF.A.1-2': 'math', 'L.3.1-2': 'ela'}
DENOMINATORS = {2, 3, 4, 6, 8}
IRREGULAR = {'mouse': 'mice', 'man': 'men', 'woman': 'women', 'foot': 'feet', 'tooth': 'teeth', 'goose': 'geese', 'child': 'children', 'person': 'people'}
REGULAR = {'cat', 'dog', 'book', 'bird', 'tree', 'car', 'box', 'bus', 'dish', 'wish', 'class', 'brush', 'fox', 'baby', 'city', 'puppy', 'party', 'toy', 'key', 'boy', 'day'}


class Closed(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)


ShortText = Annotated[str, Field(min_length=1, max_length=500)]
Identifier = Annotated[str, Field(pattern=r'^[a-zA-Z0-9_.-]{1,80}$')]


def plural(base):
    if base in IRREGULAR:
        return IRREGULAR[base]
    if base not in REGULAR:
        raise ValueError('Unsupported plural base word')
    if base.endswith(('s', 'x', 'ch', 'sh')):
        return base + 'es'
    if base.endswith('y') and base[-2] not in 'aeiou':
        return base[:-1] + 'ies'
    return base + 's'


def fraction(value):
    if not re.fullmatch(r'\d{1,2}\s*/\s*\d{1,2}', value):
        raise ValueError('Expected an explicit fraction')
    try:
        return Fraction(value.replace(' ', ''))
    except ZeroDivisionError:
        raise ValueError('A fraction denominator cannot be zero') from None


class Tile(Closed):
    id: Identifier
    text: Annotated[str, Field(min_length=1, max_length=20)]


class FractionParams(Closed):
    denominator: Annotated[int, Field(ge=2, le=8)]


class LineParams(FractionParams):
    min: Literal[0]
    max: Literal[1]


class TilesParams(Closed):
    baseWord: Annotated[str, Field(pattern=r'^[a-z]{2,12}$')]
    tiles: Annotated[list[Tile], Field(min_length=2, max_length=12)]


class ChoiceParams(Closed):
    baseWord: Annotated[str, Field(pattern=r'^[a-z]{2,12}$')]
    options: Annotated[list[Tile], Field(min_length=2, max_length=4)]


class IndependentFractionParams(Closed):
    unitDenominator: Annotated[int, Field(ge=2, le=8)]
    copies: Annotated[int, Field(ge=1, le=7)]


class IndependentWordParams(Closed):
    baseWord: Annotated[str, Field(pattern=r'^[a-z]{2,12}$')]


class Answer(Closed):
    value: Annotated[str, Field(min_length=1, max_length=40)]


class Feedback(Closed):
    correct: ShortText
    incorrect: ShortText
    hint: ShortText


class SceneBase(Closed):
    id: Identifier
    phase: Literal['guided', 'independent']
    prompt: ShortText
    answer: Answer
    feedback: Feedback
    nextSceneId: Identifier | None


class FractionScene(SceneBase):
    component: Literal['fraction_builder']
    params: FractionParams


class LineScene(SceneBase):
    component: Literal['number_line']
    params: LineParams


class TilesScene(SceneBase):
    component: Literal['word_tiles']
    params: TilesParams


class ChoiceScene(SceneBase):
    component: Literal['word_choice']
    params: ChoiceParams


class IndependentFractionScene(SceneBase):
    component: Literal['independent_fraction']
    params: IndependentFractionParams


class IndependentWordScene(SceneBase):
    component: Literal['independent_word']
    params: IndependentWordParams


# A closed union emits JSON Schema anyOf supported by the existing strict
# provider transport. Each variant has a distinct literal component.
Scene = FractionScene | LineScene | TilesScene | ChoiceScene | IndependentFractionScene | IndependentWordScene


class ActivitySpec(Closed):
    schemaVersion: Literal['1.0']
    title: Annotated[str, Field(min_length=1, max_length=100)]
    subject: Literal['math', 'ela']
    subskillId: Literal['3.NF.A.1-2', 'L.3.1-2']
    grade: Literal[3]
    misconceptionTags: Annotated[list[ShortText], Field(min_length=1, max_length=4)]
    sourceRefs: Annotated[list[Identifier], Field(max_length=11)]
    scenes: Annotated[list[Scene], Field(min_length=3, max_length=6)]

    @model_validator(mode='after')
    def verify(self):
        if SUPPORTED[self.subskillId] != self.subject:
            raise ValueError('Subject and target disagree')
        ids = [scene.id for scene in self.scenes]
        if len(set(ids)) != len(ids):
            raise ValueError('Scene IDs must be unique')
        answers, bases = [], []
        for index, scene in enumerate(self.scenes):
            final = index == len(self.scenes) - 1
            if scene.phase != ('independent' if final else 'guided') or scene.nextSceneId != (None if final else ids[index + 1]):
                raise ValueError('Scenes require a linear guided-to-independent transition')
            allowed = {'independent_fraction'} if final and self.subject == 'math' else {'independent_word'} if final else {'fraction_builder', 'number_line'} if self.subject == 'math' else {'word_tiles', 'word_choice'}
            if scene.component not in allowed:
                raise ValueError('Component is not aligned with its subject and phase')
            if re.search(r'\b(?:passage|story|article|text|diagram|table)\s+(?:above|below|provided)\b|\b(?:from|in)\s+(?:the|this)\s+(?:passage|story|article)\b', scene.prompt, re.I):
                raise ValueError('Activity task refers to missing context')
            if self.subject == 'math':
                answer = fraction(scene.answer.value)
                denominator = scene.params.unitDenominator if final else scene.params.denominator
                printed_denominator = int(scene.answer.value.split('/')[1].strip())
                if denominator not in DENOMINATORS or not 0 < answer < 1 or printed_denominator != denominator:
                    raise ValueError('Fraction must use supported grade-three equal parts')
                tokens = re.findall(r'\b\d+\s*/\s*\d+\b', scene.prompt)
                if final:
                    if scene.params.copies >= denominator or answer != Fraction(scene.params.copies, denominator):
                        raise ValueError('Independent fraction answer does not follow from copies')
                    if not re.fullmatch(rf'What fraction is {scene.params.copies} copies of 1/{denominator}\?', scene.prompt, re.I):
                        raise ValueError('Independent prompt must state copies of a unit fraction')
                    if answer in answers:
                        raise ValueError('Independent answer must be fresh')
                elif not any(fraction(token) == answer for token in tokens) or any(fraction(token) not in {answer, Fraction(1, denominator)} for token in tokens):
                    raise ValueError('Guided task must unambiguously name its target and equal unit fraction')
                answers.append(answer)
            else:
                base = scene.params.baseWord
                expected = plural(base)
                if scene.answer.value != expected or not re.search(rf'\b{re.escape(base)}\b', scene.prompt, re.I) or 'plural' not in scene.prompt.casefold():
                    raise ValueError('Word task must explicitly ask for a deterministically supported plural')
                if final:
                    if base in bases or expected in answers:
                        raise ValueError('Independent word must be fresh')
                    if re.search(rf'\b{re.escape(expected)}\b', scene.prompt, re.I):
                        raise ValueError('Independent prompt cannot reveal its answer')
                    if not (re.fullmatch(rf'One {base}, two _{{1,5}}\. Write the plural word\.', scene.prompt, re.I) or re.fullmatch(rf'Write the plural of {base}\.', scene.prompt, re.I)):
                        raise ValueError('Independent word task must unambiguously ask for its plural')
                else:
                    choices = scene.params.tiles if scene.component == 'word_tiles' else scene.params.options
                    if len({tile.id for tile in choices}) != len(choices):
                        raise ValueError('Control IDs must be unique')
                    if scene.component == 'word_choice' and sum(tile.text == expected for tile in choices) != 1:
                        raise ValueError('Choices require exactly one correct plural')
                    if scene.component == 'word_tiles':
                        if sorted(''.join(tile.text for tile in choices)) != sorted(expected):
                            raise ValueError('Tiles must exactly construct the expected plural')
                        @lru_cache(maxsize=None)
                        def constructible(offset, used):
                            if offset == len(expected):
                                return used == (1 << len(choices)) - 1
                            return any(not used & (1 << index) and expected.startswith(tile.text, offset)
                                       and constructible(offset + len(tile.text), used | (1 << index))
                                       for index, tile in enumerate(choices))
                        if not constructible(0, 0):
                            raise ValueError('Whole tiles cannot be ordered into the expected plural')
                bases.append(base)
                answers.append(expected)
        final = self.scenes[-1]
        guided_text = self.title + ' ' + ' '.join(' '.join((scene.prompt, scene.feedback.correct, scene.feedback.incorrect, scene.feedback.hint, scene.params.model_dump_json())) for scene in self.scenes[:-1])
        if self.subject == 'ela':
            if any(re.search(rf'\b{re.escape(value)}\b', guided_text, re.I) for value in (final.params.baseWord, final.answer.value)):
                raise ValueError('Guided content must not reveal the fresh independent word')
        elif any(fraction(token) == fraction(final.answer.value) for token in re.findall(r'\b\d+\s*/\s*\d+\b', guided_text)):
            raise ValueError('Guided content must not reveal the fresh independent fraction')
        return self


class StartRequest(Closed):
    uploadId: Identifier
    idempotencyKey: Annotated[str, Field(min_length=8, max_length=100)]


class PartsResponse(Closed):
    selectedParts: Annotated[list[int], Field(max_length=8)]


class TickResponse(Closed):
    tick: Annotated[int, Field(ge=0, le=8)]


class TilesResponse(Closed):
    tileIds: Annotated[list[Identifier], Field(max_length=12)]


class ChoiceResponse(Closed):
    choiceId: Identifier


class SubmitRequest(Closed):
    sceneId: Identifier
    idempotencyKey: Annotated[str, Field(min_length=8, max_length=100)]
    response: Annotated[str, Field(min_length=1, max_length=100)] | PartsResponse | TickResponse | TilesResponse | ChoiceResponse


class SceneRequest(Closed):
    sceneId: Identifier


class NextRequest(SceneRequest):
    idempotencyKey: Annotated[str, Field(min_length=8, max_length=100)]
