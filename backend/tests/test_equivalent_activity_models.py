"""Equal subdivisions preserve the whole and the requested final representation."""
import pytest
from pydantic import ValidationError

from backend.activities.equivalent import (
    EQUIVALENT_SUBSKILLS, fraction_form_response_correct, has_split_scene,
    is_equivalent_target, split_fraction, validate_equivalent_activity,
)
from backend.activities.models import ActivitySpec, FractionSplitResponse
from backend.tests.test_general_activity_models import general_activity


def equivalent_activity():
    def split(identifier, numerator, denominator, factor, following):
        return dict(id=identifier, component='fraction_split_compare', phase='guided',
                    prompt=f'Split each part of {numerator}/{denominator} into {factor} equal pieces.',
                    params=dict(context='Explore equal parts in a garden bed.',
                                teachingText='More equal pieces can describe the same planted area.',
                                wholeLabel='One garden bed', shadedLabel='planted',
                                numerator=numerator, denominator=denominator, splitFactors=[2, 3]),
                    answer=dict(splitFactor=factor), nextSceneId=following,
                    feedback=dict(correct='The planted area stayed the same.',
                                  incorrect='Try the requested split and compare the planted area.',
                                  hint='Count how many smaller pieces each original part becomes.'))

    return dict(schemaVersion='1.1', title='Same Garden, New Parts', subject='math',
                subskillId='3.NF.A.3-2', grade=3, misconceptionTags=['Adds the same number to top and bottom'],
                sourceRefs=[], scenes=[split('halves', 1, 2, 3, 'thirds'), split('thirds', 2, 3, 2, 'independent'),
                    dict(id='independent', component='independent_response', phase='independent',
                         prompt='Write 3/4 in eighths.', params=dict(context=None),
                         answer=dict(value='6/8', acceptedAnswers=[], comparison='fraction_form',
                                     sourceNumerator=3, sourceDenominator=4, targetDenominator=8),
                         feedback=dict(correct='The two fractions name the same amount.',
                                       incorrect='Your first independent response is recorded.',
                                       hint='No hints on this independent question.'), nextSceneId=None)])


def test_splitting_halves_in_three_changes_only_the_partition():
    spec = ActivitySpec.model_validate(equivalent_activity())
    params = spec.scenes[0].params
    assert has_split_scene(spec)
    assert split_fraction(params, 3) == '3/6'
    assert split_fraction(params, 2) == '2/4'
    assert params.numerator / params.denominator == 3 / 6 == 2 / 4
    assert validate_equivalent_activity(spec) is spec
    assert 'teachingText' not in spec.scenes[-1].params.model_dump()
    assert spec.scenes[-1].params.context is None


@pytest.mark.parametrize('subskill', sorted(EQUIVALENT_SUBSKILLS))
def test_exact_equivalent_targets_accept_the_reusable_mechanic(subskill):
    raw = equivalent_activity()
    raw['subskillId'] = subskill
    raw['grade'] = 4 if subskill.startswith('4.') else 3
    assert ActivitySpec.model_validate(raw)
    assert is_equivalent_target({'subskill_id': subskill})


@pytest.mark.parametrize('subskill', ['3.NF.A.3-3', '3.NF.A.3-4', '3.NF.A.1-2', 'L.3.1-2'])
def test_non_equivalent_siblings_do_not_get_the_new_mechanic(subskill):
    raw = equivalent_activity()
    raw['subskillId'] = subskill
    assert not is_equivalent_target(subskill)
    with pytest.raises(ValidationError, match='scoped'):
        ActivitySpec.model_validate(raw)


def test_requested_fraction_form_is_scoped_to_equivalent_fractions():
    raw = general_activity()
    raw['scenes'][-1] = equivalent_activity()['scenes'][-1]
    raw['scenes'][1]['nextSceneId'] = raw['scenes'][-1]['id']
    with pytest.raises(ValidationError, match='scoped'):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['params'].update(numerator=2),
    lambda raw: raw['scenes'][0]['params'].update(numerator=0),
    lambda raw: raw['scenes'][0]['params'].update(denominator=1),
    lambda raw: raw['scenes'][0]['params'].update(denominator=13),
    lambda raw: raw['scenes'][0]['params'].update(splitFactors=[1, 3]),
    lambda raw: raw['scenes'][0]['params'].update(splitFactors=[2, 7]),
    lambda raw: raw['scenes'][0]['params'].update(splitFactors=[2, 2]),
    lambda raw: raw['scenes'][0]['params'].update(splitFactors=[3]),
    lambda raw: raw['scenes'][0]['params'].update(denominator=12, splitFactors=[2, 6]),
    lambda raw: raw['scenes'][0]['params'].update(splitFactors=[2, 4]),
    lambda raw: raw['scenes'][0]['answer'].update(splitFactor=1),
    lambda raw: raw['scenes'][0]['params'].update(wholeLabel='<script>bad</script>'),
    lambda raw: raw['scenes'][0]['params'].update(shadedLabel=' '),
])
def test_invalid_visual_parameters_cannot_be_shown(mutation):
    raw = equivalent_activity()
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][-1]['answer'].update(value='5/8'),
    lambda raw: raw['scenes'][-1]['answer'].update(value='3/4'),
    lambda raw: raw['scenes'][-1]['answer'].update(value='0.75'),
    lambda raw: raw['scenes'][-1]['answer'].update(targetDenominator=9),
    lambda raw: raw['scenes'][-1]['answer'].update(sourceNumerator=4),
    lambda raw: raw['scenes'][-1]['answer'].update(sourceDenominator=13),
    lambda raw: raw['scenes'][-1]['answer'].update(acceptedAnswers=['3/4']),
    lambda raw: raw['scenes'][-1]['answer'].update(targetDenominator=32, value='24/32'),
    lambda raw: raw['scenes'][-1].update(prompt='Write 2/3 in eighths.'),
    lambda raw: raw['scenes'][-1].update(prompt='Write -3/4 in eighths.'),
    lambda raw: raw['scenes'][-1].update(prompt='Write 3/4 in tenths.'),
    lambda raw: raw['scenes'][-1].update(prompt='Write 3/4 in eighths: 6/8.'),
    lambda raw: raw['scenes'][-1]['params'].update(context='Multiply both numbers by two.'),
    lambda raw: raw['scenes'][-1]['params'].update(teachingText='Multiply both numbers by two.'),
])
def test_invalid_independent_math_or_grounding_is_rejected(mutation):
    raw = equivalent_activity()
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('prompt', ['Write 3/4 in eighths.', 'Write 3/4 with denominator 8.', 'Complete 3/4 = ?/8.'])
def test_independent_prompt_can_use_words_or_a_requested_denominator(prompt):
    raw = equivalent_activity()
    raw['scenes'][-1]['prompt'] = prompt
    assert ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('location', ['prompt', 'title', 'teaching', 'feedback', 'visual'])
def test_fresh_fraction_cannot_already_appear_in_guided_content(location):
    raw = equivalent_activity()
    if location == 'prompt':
        raw['scenes'][0]['prompt'] += ' Also consider 3/4.'
    elif location == 'title':
        raw['title'] = 'Explore 6/8'
    elif location == 'teaching':
        raw['scenes'][0]['params']['teachingText'] += ' For example, 9/12 names this amount.'
    elif location == 'feedback':
        raw['scenes'][0]['feedback']['hint'] += ' Think about 3/4.'
    else:
        raw['scenes'][0]['params'].update(numerator=3, denominator=4)
    with pytest.raises(ValidationError, match='fresh|differ'):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('value,correct', [('6/8', True), (' 6 / 8 ', True), ('+6/8', True),
    ('3/4', False), ('0.75', False), ('12/16', False), ('5/8', False), ('6/0', False),
    ('3/4 = 6/8', False), ('6/8; print(1)', False)])
def test_final_grading_requires_the_requested_partition(value, correct):
    answer = ActivitySpec.model_validate(equivalent_activity()).scenes[-1].answer
    assert fraction_form_response_correct(answer, value) is correct


def test_old_question_cards_remain_readable_but_cannot_win_selection_policy():
    raw = general_activity()
    raw.update(subskillId='3.NF.A.3-2', grade=3)
    old = ActivitySpec.model_validate(raw)
    assert not has_split_scene(old)
    with pytest.raises(ValueError, match='require a guided'):
        validate_equivalent_activity(old)


def test_other_generic_activities_are_not_forced_to_split_fractions():
    old = ActivitySpec.model_validate(general_activity())
    assert validate_equivalent_activity(old) is old


@pytest.mark.parametrize('value', [1, 0, 7, True, '3'])
def test_initial_or_invalid_partition_is_not_a_submittable_action(value):
    with pytest.raises(ValidationError):
        FractionSplitResponse(splitFactor=value)


def test_a_valid_but_unoffered_split_is_not_accepted():
    params = ActivitySpec.model_validate(equivalent_activity()).scenes[0].params
    with pytest.raises(ValueError, match='allowed'):
        split_fraction(params, 4)
