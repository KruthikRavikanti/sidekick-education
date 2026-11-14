"""Closed, versioned interaction vocabulary. Answer keys never enter public DTOs."""
import re
import unicodedata
from fractions import Fraction
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

SCHEMA_VERSION = '1.1'
COMPONENT_VERSION = 'sidekick-interactions-v2'
COMPATIBLE_COMPONENT_VERSIONS = ('sidekick-interactions-v1', COMPONENT_VERSION)
PROMPT_VERSION = 'sidekick-activity-v3'
SUPPORTED = {'3.NF.A.1-2': 'math', 'L.3.1-2': 'ela'}
GENERIC_COMPONENTS = frozenset({'guided_choice', 'guided_response', 'independent_response'})
DENOMINATORS = {2, 3, 4, 6, 8}
IRREGULAR = {'mouse': 'mice', 'man': 'men', 'woman': 'women', 'foot': 'feet', 'tooth': 'teeth', 'goose': 'geese', 'child': 'children', 'person': 'people'}
REGULAR = {'cat', 'dog', 'book', 'bird', 'tree', 'car', 'box', 'bus', 'dish', 'wish', 'class', 'brush', 'fox', 'baby', 'city', 'puppy', 'party', 'toy', 'key', 'boy', 'day'}


class Closed(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)


ShortText = Annotated[str, Field(min_length=1, max_length=500)]
Identifier = Annotated[str, Field(pattern=r'^[a-zA-Z0-9_.-]{1,80}$')]


def normalize_text(value):
    return ' '.join(unicodedata.normalize('NFKC', value).split()).casefold()


def numeric_answer(value):
    """Parse only bounded plain numbers/fractions, never expressions or code."""
    value = unicodedata.normalize('NFKC', value).strip()
    if len(value) > 80 or not re.fullmatch(r'[+-]?(?:\d{1,12}(?:\.\d{1,12})?|\.\d{1,12})(?:\s*/\s*[+-]?[1-9]\d{0,11})?', value, re.ASCII):
        raise ValueError('Expected a plain number or fraction')
    try:
        return Fraction(value.replace(' ', ''))
    except (ValueError, ZeroDivisionError):
        raise ValueError('Expected a plain number or fraction') from None


def _safe_generated_text(value):
    if not value.strip():
        raise ValueError('Activity text must not be blank')
    if re.search(r'<\s*/?\s*[A-Za-z][^>]*>|javascript\s*:|data\s*:\s*text/html', value, re.I):
        raise ValueError('Activity content must be plain text')


_CONTEXT_REFERENCE = re.compile(
    r'\b(?:passage|story|article|text|diagram|table|graph|chart|picture|image)\s+(?:above|below|provided|shown)\b'
    r'|\b(?:from|in|using|use|read|see|based on|refer to)\s+(?:the|this)\s+(?:passage|story|article|text|diagram|table|graph|chart|picture|image)\b',
    re.I,
)


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


class ActivityOption(Closed):
    id: Identifier
    text: ShortText


class GuidedResponseParams(Closed):
    context: Annotated[str, Field(min_length=1, max_length=4000)] | None
    teachingText: Annotated[str, Field(min_length=1, max_length=1200)]


class GuidedChoiceParams(GuidedResponseParams):
    options: Annotated[list[ActivityOption], Field(min_length=2, max_length=6)]


class IndependentResponseParams(Closed):
    context: Annotated[str, Field(min_length=1, max_length=4000)] | None


class ResponseAnswer(Closed):
    value: Annotated[str, Field(min_length=1, max_length=300)]
    acceptedAnswers: Annotated[list[Annotated[str, Field(min_length=1, max_length=300)]], Field(max_length=8)]
    comparison: Literal['text', 'number']


class ResponseSceneBase(SceneBase):
    answer: ResponseAnswer


class GuidedChoiceScene(ResponseSceneBase):
    component: Literal['guided_choice']
    params: GuidedChoiceParams


class GuidedResponseScene(ResponseSceneBase):
    component: Literal['guided_response']
    params: GuidedResponseParams


class IndependentResponseScene(ResponseSceneBase):
    component: Literal['independent_response']
    params: IndependentResponseParams


# A closed union emits JSON Schema anyOf supported by the existing strict
# provider transport. Each variant has a distinct literal component.
Scene = (FractionScene | LineScene | TilesScene | ChoiceScene | IndependentFractionScene | IndependentWordScene
         | GuidedChoiceScene | GuidedResponseScene | IndependentResponseScene)


class ActivitySpec(Closed):
    schemaVersion: Literal['1.0', '1.1']
    title: Annotated[str, Field(min_length=1, max_length=100)]
    subject: Literal['math', 'ela']
    subskillId: Identifier
    grade: Annotated[int, Field(ge=0, le=8)]
    misconceptionTags: Annotated[list[ShortText], Field(min_length=1, max_length=4)]
    sourceRefs: Annotated[list[Identifier], Field(max_length=11)]
    scenes: Annotated[list[Scene], Field(min_length=3, max_length=6)]

    @model_validator(mode='after')
    def verify(self):
        if self.schemaVersion == '1.1':
            return self.verify_general()
        if self.subskillId not in SUPPORTED or self.grade != 3:
            raise ValueError('Legacy activities require their original grade-three skill')
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

    def verify_general(self):
        ids = [scene.id for scene in self.scenes]
        if len(set(ids)) != len(ids):
            raise ValueError('Scene IDs must be unique')
        for value in [self.title, *self.misconceptionTags]:
            _safe_generated_text(value)
        tasks = set()
        for index, scene in enumerate(self.scenes):
            final = index == len(self.scenes) - 1
            if scene.component not in GENERIC_COMPONENTS:
                raise ValueError('General activities require general response components')
            if scene.phase != ('independent' if final else 'guided') or scene.nextSceneId != (None if final else ids[index + 1]):
                raise ValueError('Scenes require a linear guided-to-independent transition')
            allowed = {'independent_response'} if final else {'guided_choice', 'guided_response'}
            if scene.component not in allowed:
                raise ValueError('Component is not aligned with its phase')
            for value in [scene.prompt, scene.feedback.correct, scene.feedback.incorrect, scene.feedback.hint]:
                _safe_generated_text(value)
            if scene.params.context is not None:
                _safe_generated_text(scene.params.context)
            elif _CONTEXT_REFERENCE.search(scene.prompt):
                raise ValueError('Activity task refers to missing context')
            if not final:
                _safe_generated_text(scene.params.teachingText)
            task = normalize_text(scene.prompt) + '\n' + normalize_text(scene.params.context or '')
            if task in tasks:
                raise ValueError('Activity tasks must be distinct')
            tasks.add(task)
            _safe_generated_text(scene.answer.value)
            for value in scene.answer.acceptedAnswers:
                _safe_generated_text(value)
            if scene.component == 'guided_choice':
                options = scene.params.options
                if len({option.id for option in options}) != len(options) or len({normalize_text(option.text) for option in options}) != len(options):
                    raise ValueError('Choice controls require distinct IDs and labels')
                if scene.answer.value not in {option.id for option in options} or scene.answer.acceptedAnswers or scene.answer.comparison != 'text':
                    raise ValueError('Choice answer must name exactly one option ID')
                for option in options:
                    _safe_generated_text(option.text)
            elif scene.answer.comparison == 'number':
                expected = numeric_answer(scene.answer.value)
                if any(numeric_answer(value) != expected for value in scene.answer.acceptedAnswers):
                    raise ValueError('Numeric alternatives must equal the canonical answer')
            elif len({normalize_text(value) for value in scene.answer.acceptedAnswers}) != len(scene.answer.acceptedAnswers):
                raise ValueError('Accepted answers must be distinct')
        # Review separately checks semantic freshness. Here we reject overt answer
        # disclosures without confusing a recurring small number or common word
        # with a leaked solution to a different, otherwise fresh task.
        final = self.scenes[-1]
        guided_text = self.title + ' ' + ' '.join(' '.join((scene.prompt, scene.feedback.correct, scene.feedback.incorrect,
            scene.feedback.hint, scene.params.model_dump_json())) for scene in self.scenes[:-1])
        for answer in [final.answer.value, *final.answer.acceptedAnswers]:
            if re.search(rf'\b(?:independent|final)\s+(?:answer|response)\s*(?:is|:|=)\s*{re.escape(answer.strip())}(?!\w)', guided_text, re.I):
                raise ValueError('Guided content must not disclose the independent answer')
        return self


class ActivityReview(Closed):
    approved: bool
    reason: Literal['approved', 'incorrect_answer', 'misaligned_skill', 'missing_context', 'answer_leak', 'not_fresh', 'unsafe_content', 'unsuitable_task']

    @model_validator(mode='after')
    def verdict_consistent(self):
        if self.approved != (self.reason == 'approved'):
            raise ValueError('Review decision and reason disagree')
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
    response: Annotated[str, Field(min_length=1, max_length=500)] | PartsResponse | TickResponse | TilesResponse | ChoiceResponse


class SceneRequest(Closed):
    sceneId: Identifier


class NextRequest(SceneRequest):
    idempotencyKey: Annotated[str, Field(min_length=8, max_length=100)]
