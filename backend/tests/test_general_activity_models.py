"""Generic activities remain bounded teaching scenes with private answer keys."""
import copy
import json
from fractions import Fraction
from pathlib import Path

import pytest
from pydantic import ValidationError

from backend.activities.models import ActivityReview, ActivitySpec, numeric_answer, normalize_text


def general_activity(subject='math'):
    def response(value, comparison='number', alternatives=None):
        return dict(value=value, comparison=comparison, acceptedAnswers=alternatives or [])

    def scene(scene_id, component, prompt, params, answer, next_id, phase='guided'):
        return dict(id=scene_id, component=component, phase=phase, prompt=prompt,
                    params=params, answer=answer, nextSceneId=next_id,
                    feedback=dict(correct='That follows the pattern.', incorrect='Look at each part of the explanation.', hint='Use the worked example to choose a method.'))

    if subject == 'math':
        scenes = [
            scene('explore', 'guided_choice', 'Which operation finds the cost of one notebook?',
                  dict(context='Four notebooks cost twelve dollars.', teachingText='A unit price compares the total cost with one item. Divide the total cost by the number of items.',
                       options=[dict(id='divide', text='Divide the total cost by four.'), dict(id='multiply', text='Multiply the total cost by four.')]),
                  response('divide', 'text'), 'apply'),
            scene('apply', 'guided_response', 'Six tickets cost eighteen dollars. How many dollars does one ticket cost?',
                  dict(context=None, teachingText='Find the cost of one ticket by dividing eighteen dollars into six equal groups.'), response('3'), 'independent'),
            scene('independent', 'independent_response', 'Five pencils cost ten dollars. How many dollars does one pencil cost?',
                  dict(context=None), response('2', alternatives=['2.0', '4/2']), None, 'independent'),
        ]
        target, grade = '6.RP.A.2-1', 6
    else:
        scenes = [
            scene('explore', 'guided_choice', 'What word names the place where Maya planted seeds?',
                  dict(context='Maya planted seeds in a garden beside her home.', teachingText='A setting tells where or when an event happens. Look for the place named in the sentence.',
                       options=[dict(id='garden', text='garden'), dict(id='seeds', text='seeds')]), response('garden', 'text'), 'apply'),
            scene('apply', 'guided_response', 'Which word in the passage names where Lee read?',
                  dict(context='Lee read a book in the library.', teachingText='The word after “in the” names the place where Lee read.'), response('library', 'text'), 'independent'),
            scene('independent', 'independent_response', 'Which word in the passage names where Ana played?',
                  dict(context='Ana played basketball at the park.'), response('park', 'text', ['the park']), None, 'independent'),
        ]
        target, grade = 'RL.2.3-1', 2
    return dict(schemaVersion='1.1', title='Explore a useful skill', subject=subject,
                subskillId=target, grade=grade, misconceptionTags=['A catalog focus'], sourceRefs=[], scenes=scenes)


@pytest.mark.parametrize('subject', ['math', 'ela'])
def test_general_activity_accepts_new_catalog_skills_and_inline_context(subject):
    spec = ActivitySpec.model_validate(general_activity(subject))
    assert spec.schemaVersion == '1.1'
    assert spec.scenes[-1].phase == 'independent'
    assert spec.scenes[-1].component == 'independent_response'
    assert 'teachingText' not in spec.scenes[-1].params.model_dump()


def test_legacy_originals_keep_their_original_validation():
    path = Path(__file__).resolve().parents[2] / 'data/activities/original_examples.json'
    originals = json.loads(path.read_text())['activities']
    assert len(originals) == 2
    for original in originals:
        raw = original['spec']
        assert ActivitySpec.model_validate(raw).schemaVersion == '1.0'
        changed = copy.deepcopy(raw)
        changed['subskillId'] = '6.RP.A.2-1'
        with pytest.raises(ValidationError):
            ActivitySpec.model_validate(changed)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw.update(grade=9),
    lambda raw: raw.update(subskillId='not a catalog identifier'),
    lambda raw: raw['scenes'][0]['params'].update(teachingText=''),
    lambda raw: raw['scenes'][0]['params'].pop('teachingText'),
    lambda raw: raw['scenes'][0]['answer'].update(value='missing-option'),
    lambda raw: raw['scenes'][0]['answer'].update(acceptedAnswers=['divide']),
    lambda raw: raw['scenes'][0]['params']['options'][1].update(id='divide'),
    lambda raw: raw['scenes'][0]['params']['options'][1].update(text='Divide the total cost by four.'),
    lambda raw: raw['scenes'][0].update(nextSceneId='explore'),
    lambda raw: raw['scenes'][0].update(phase='independent'),
    lambda raw: raw['scenes'][2].update(component='guided_response'),
    lambda raw: raw['scenes'][2]['params'].update(teachingText='The answer is two.'),
    lambda raw: raw['scenes'][1]['answer'].update(value='__import__("os")'),
    lambda raw: raw['scenes'][2]['answer'].update(acceptedAnswers=['3']),
    lambda raw: raw['scenes'][1]['params'].update(teachingText='<script>alert(1)</script>'),
    lambda raw: raw['scenes'][0]['params']['options'][0].update(text='<iframe src="https://example.com"></iframe>'),
    lambda raw: raw['scenes'][2]['params'].update(context=' '),
])
def test_invalid_general_activity_cannot_be_rendered(mutation):
    raw = general_activity()
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_passage_reference_requires_supplied_context():
    raw = general_activity('ela')
    raw['scenes'][2]['params']['context'] = None
    with pytest.raises(ValidationError, match='missing context'):
        ActivitySpec.model_validate(raw)


def test_independent_task_cannot_repeat_a_guided_task():
    raw = general_activity()
    raw['scenes'][2]['prompt'] = raw['scenes'][1]['prompt'].upper()
    with pytest.raises(ValidationError, match='distinct'):
        ActivitySpec.model_validate(raw)


def test_guided_content_cannot_explicitly_disclose_the_independent_answer():
    raw = general_activity()
    raw['scenes'][0]['params']['teachingText'] += ' The independent answer is 2.'
    with pytest.raises(ValidationError, match='disclose'):
        ActivitySpec.model_validate(raw)


def test_recurring_small_numbers_do_not_falsely_disqualify_fresh_tasks():
    raw = general_activity()
    raw['scenes'][0]['params']['teachingText'] += ' You can also divide two objects into equal groups.'
    raw['scenes'][1]['params']['context'] = 'There are 2 examples to explore.'
    assert ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('value,expected', [('2', Fraction(2)), ('-2.5', Fraction(-5, 2)), ('3/4', Fraction(3, 4)), ('.5', Fraction(1, 2)), (' 4 / 2 ', Fraction(2))])
def test_numeric_answers_are_parsed_without_executing_expressions(value, expected):
    assert numeric_answer(value) == expected


@pytest.mark.parametrize('value', ['2+2', '1/0', '1e1000', 'inf', 'NaN', '2 dollars', '__import__("os")', '2' * 81])
def test_expressions_and_unbounded_numbers_are_not_numeric_answers(value):
    with pytest.raises(ValueError):
        numeric_answer(value)


def test_text_comparison_normalizes_only_unicode_case_and_spacing():
    assert normalize_text('  THE\nＰＡＲＫ ') == 'the park'
    assert normalize_text('park') != normalize_text('garden')


@pytest.mark.parametrize('approved,reason', [(True, 'incorrect_answer'), (False, 'approved')])
def test_review_decision_requires_consistent_closed_reason(approved, reason):
    with pytest.raises(ValidationError):
        ActivityReview(approved=approved, reason=reason)
    assert ActivityReview(approved=True, reason='approved').approved


def test_review_cannot_return_provider_content_in_freeform_error():
    with pytest.raises(ValidationError):
        ActivityReview(approved=False, reason='private worksheet content')
