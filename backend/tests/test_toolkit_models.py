"""Playable controls conserve objects and accept only reachable, private-keyed states."""
import copy

import pytest
from pydantic import ValidationError

from backend.activities.models import (
    ActivitySpec, BundleResponse, EvidenceResponse, OrderResponse, SubmitRequest,
)
from backend.activities.toolkit import grade_response, task_key, validate_activity
from backend.tests.test_general_activity_models import general_activity


def toolkit_activity(component='bundle_builder'):
    def scene(index, params, answer, prompt):
        independent = index == 2
        params.update(context=None, goal=prompt, teachingText=None if independent else 'Use each piece to show how the idea works.')
        return dict(id=f'step-{index}', component=component, phase='independent' if independent else 'guided',
                    prompt=prompt, params=params, answer=answer,
                    feedback=dict(correct='Your action shows the goal.', incorrect='Look at the pieces and try again.',
                                  hint='Use the information in this scene.'),
                    nextSceneId=None if independent else f'step-{index + 1}')

    if component == 'bundle_builder':
        subject, target = 'math', '1.NBT.B.2-1'
        scenes = [scene(index, dict(itemLabel='garden seeds', groupLabel='seed packet', total=total, groupSize=10),
                        dict(bundles=total // 10), f'Pack all the full groups of ten from {total} seeds.')
                  for index, total in enumerate((24, 36, 47))]
    elif component == 'tile_order':
        subject, target = 'ela', 'RL.2.3-1'
        events = [
            ['Mina dug a hole.', 'Mina placed a seed in the hole.', 'Mina covered the seed with soil.'],
            ['Cal mixed the bread dough.', 'Cal baked the dough.', 'Cal sliced the baked loaf.'],
            ['Uma put toothpaste on a brush.', 'Uma brushed her teeth.', 'Uma rinsed her mouth.'],
        ]
        scenes = [scene(index, dict(ordering='story', tiles=[dict(id='end', text=events[index][2]),
                             dict(id='start', text=events[index][0]), dict(id='middle', text=events[index][1])]),
                        dict(order=['start', 'middle', 'end']), f'Put scene {index + 1} in an order that makes the events work.')
                  for index in range(3)]
    else:
        subject, target = 'ela', 'RI.3.1-1'
        facts = [
            ['The boat floated because its hull pushed water aside.', 'The boat was painted blue.'],
            ['A thick coat kept Ren warm outside.', 'Ren chose a red hat.'],
            ['The metal spoon felt hot after sitting in the soup.', 'The soup tasted salty.'],
        ]
        scenes = [scene(index, dict(boardLabel='Clue board', sentences=[dict(id='evidence', text=facts[index][0]),
                                           dict(id='detail', text=facts[index][1])]),
                        dict(sentenceId='evidence', explanation='This sentence gives the fact needed for the conclusion.'),
                        f'Place the sentence that supports conclusion {index + 1} on the clue board.')
                  for index in range(3)]
    return dict(schemaVersion='1.1', title='A small learning adventure', subject=subject, subskillId=target,
                grade=2, misconceptionTags=['A catalog focus'], sourceRefs=[], scenes=scenes)


@pytest.mark.parametrize('component', ['bundle_builder', 'tile_order', 'evidence_board'])
def test_controls_allow_a_fresh_independent_challenge_with_teaching_removed(component):
    spec = ActivitySpec.model_validate(toolkit_activity(component))
    assert validate_activity(spec, {component}) is spec
    assert spec.scenes[-1].params.teachingText is None
    assert len({task_key(scene) for scene in spec.scenes}) == 3


@pytest.mark.parametrize('component', ['bundle_builder', 'tile_order', 'evidence_board'])
def test_the_same_control_instruction_can_teach_with_new_playable_content(component):
    raw = toolkit_activity(component)
    for scene in raw['scenes']:
        scene['prompt'] = 'Complete the goal for this delivery.'
    assert ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['params'].update(total=9),
    lambda raw: raw['scenes'][0]['params'].update(total=61),
    lambda raw: raw['scenes'][0]['params'].update(total=True),
    lambda raw: raw['scenes'][0]['params'].update(groupSize=5),
    lambda raw: raw['scenes'][0]['answer'].update(bundles=3),
    lambda raw: raw['scenes'][0]['params'].update(teachingText=None),
    lambda raw: raw['scenes'][2]['params'].update(teachingText='Here is how to bundle them.'),
    lambda raw: raw['scenes'][0]['params'].update(goal=' '),
    lambda raw: raw['scenes'][0]['params'].update(itemLabel='<script>bad</script>'),
    lambda raw: raw['scenes'][0]['params'].update(groupLabel='javascript:alert(1)'),
    lambda raw: raw.update(subject='ela'),
])
def test_bundling_rejects_unbounded_or_unachievable_tasks(mutation):
    raw = toolkit_activity()
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_bundling_conserves_objects_and_grades_the_demonstrated_grouping():
    scene = ActivitySpec.model_validate(toolkit_activity()).scenes[0]
    assert grade_response(scene, BundleResponse(bundles=1)) == ('1 groups of 10, 14 loose', False)
    assert grade_response(scene, BundleResponse(bundles=2)) == ('2 groups of 10, 4 loose', True)
    assert grade_response(scene, BundleResponse(bundles=0)) == ('0 groups of 10, 24 loose', False)
    with pytest.raises(ValueError, match='reachable'):
        grade_response(scene, BundleResponse(bundles=3))
    with pytest.raises(ValueError):
        grade_response(scene, '2')


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['answer'].update(order=['start', 'end']),
    lambda raw: raw['scenes'][0]['answer'].update(order=['start', 'middle', 'start']),
    lambda raw: raw['scenes'][0]['answer'].update(order=['start', 'middle', 'alien']),
    lambda raw: raw['scenes'][0]['answer'].update(order=['end', 'start', 'middle']),
    lambda raw: raw['scenes'][0]['params']['tiles'][1].update(id='end'),
    lambda raw: raw['scenes'][0]['params']['tiles'][1].update(text='MINA COVERED THE SEED WITH SOIL.'),
    lambda raw: raw['scenes'][0]['params']['tiles'][1].update(text='<img src="bad">'),
    lambda raw: raw.update(subject='math'),
])
def test_ordering_requires_a_scrambled_distinct_reachable_permutation(mutation):
    raw = toolkit_activity('tile_order')
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_ordering_grades_the_actual_sequence_and_retains_readable_tiles():
    scene = ActivitySpec.model_validate(toolkit_activity('tile_order')).scenes[0]
    text, correct = grade_response(scene, OrderResponse(order=['start', 'middle', 'end']))
    assert correct
    assert text == 'Mina dug a hole. → Mina placed a seed in the hole. → Mina covered the seed with soil.'
    assert not grade_response(scene, OrderResponse(order=['end', 'middle', 'start']))[1]
    for ids in [['start', 'end'], ['start', 'start', 'end'], ['start', 'middle', 'alien']]:
        with pytest.raises(ValueError, match='exactly once'):
            grade_response(scene, OrderResponse(order=ids))


def numeric_ordering():
    raw = toolkit_activity('tile_order')
    raw.update(subject='math', subskillId='4.NF.C.7-1')
    for index, scene in enumerate(raw['scenes']):
        scene['params'].update(ordering='ascending', tiles=[dict(id='large', text=f'{index + 3}/4'),
                                                            dict(id='small', text=f'{index + 1}/4'),
                                                            dict(id='middle', text=f'{index + 2}/4')])
        scene['answer'] = dict(order=['small', 'middle', 'large'])
    return raw


def test_same_tile_control_supports_exact_fraction_and_decimal_ordering():
    raw = numeric_ordering()
    raw['scenes'][0]['params']['tiles'][0]['text'] = '.75'
    raw['scenes'][0]['params']['tiles'][2]['text'] = '0.5'
    spec = ActivitySpec.model_validate(raw)
    assert grade_response(spec.scenes[0], OrderResponse(order=['small', 'middle', 'large']))[1]
    raw['scenes'][0]['params']['ordering'] = 'descending'
    raw['scenes'][0]['answer']['order'] = ['large', 'middle', 'small']
    assert ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['answer'].update(order=['large', 'middle', 'small']),
    lambda raw: raw['scenes'][0]['params']['tiles'][0].update(text='0.25'),
    lambda raw: raw['scenes'][0]['params']['tiles'][0].update(text='1/0'),
    lambda raw: raw['scenes'][0]['params']['tiles'][0].update(text='1+2'),
    lambda raw: raw.update(subject='ela'),
])
def test_numeric_ordering_is_checked_independently_of_the_model_key(mutation):
    raw = numeric_ordering()
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['answer'].update(sentenceId='not-in-passage'),
    lambda raw: raw['scenes'][0]['params'].update(sentences=[dict(id='only', text='A lone fact.')]),
    lambda raw: raw['scenes'][0]['params']['sentences'][1].update(id='evidence'),
    lambda raw: raw['scenes'][0]['params']['sentences'][1].update(text='The boat floated because its hull pushed water aside.'),
    lambda raw: raw['scenes'][0]['answer'].update(explanation=' '),
    lambda raw: raw['scenes'][0]['params'].update(boardLabel='<iframe>board</iframe>'),
    lambda raw: raw.update(subject='math'),
])
def test_evidence_must_be_an_available_literal_sentence(mutation):
    raw = toolkit_activity('evidence_board')
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_evidence_grader_records_the_placed_sentence_verbatim():
    scene = ActivitySpec.model_validate(toolkit_activity('evidence_board')).scenes[0]
    assert grade_response(scene, EvidenceResponse(sentenceId='evidence')) == (
        'The boat floated because its hull pushed water aside.', True)
    assert grade_response(scene, EvidenceResponse(sentenceId='detail')) == ('The boat was painted blue.', False)
    with pytest.raises(ValueError):
        grade_response(scene, EvidenceResponse(sentenceId='invented'))


@pytest.mark.parametrize('component', ['bundle_builder', 'tile_order', 'evidence_board'])
def test_toolkit_controls_cannot_refer_to_an_absent_diagram(component):
    raw = toolkit_activity(component)
    raw['scenes'][0]['prompt'] = 'Use the diagram to decide what to do.'
    with pytest.raises(ValidationError, match='missing context'):
        ActivitySpec.model_validate(raw)


def test_inline_passage_sentences_are_sufficient_for_evidence_context():
    raw = toolkit_activity('evidence_board')
    raw['scenes'][0]['prompt'] = 'Read the passage and choose the sentence about why the boat floats.'
    assert ActivitySpec.model_validate(raw)
    raw = toolkit_activity('bundle_builder')
    raw['scenes'][0]['prompt'] = 'Read the passage and pack the requested objects.'
    with pytest.raises(ValidationError, match='missing context'):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('component', ['bundle_builder', 'tile_order', 'evidence_board'])
def test_paraphrasing_the_prompt_or_changing_piece_ids_does_not_make_a_fresh_final(component):
    raw = toolkit_activity(component)
    raw['scenes'][2]['params'] = copy.deepcopy(raw['scenes'][0]['params'])
    raw['scenes'][2]['params']['teachingText'] = None
    raw['scenes'][2]['answer'] = copy.deepcopy(raw['scenes'][0]['answer'])
    with pytest.raises(ValidationError, match='fresh content'):
        ActivitySpec.model_validate(raw)


def test_question_cards_still_parse_for_history_but_cannot_win_new_activity_selection():
    spec = ActivitySpec.model_validate(general_activity())
    with pytest.raises(ValueError, match='meaningful'):
        validate_activity(spec)
    interactive = ActivitySpec.model_validate(toolkit_activity())
    with pytest.raises(ValueError, match='compatible'):
        validate_activity(interactive, {'tile_order'})


@pytest.mark.parametrize('component,answer', [
    ('bundle_builder', '4'),
    ('tile_order', 'Uma put toothpaste on a brush. Uma brushed her teeth. Uma rinsed her mouth.'),
    ('evidence_board', 'The metal spoon felt hot after sitting in the soup.'),
])
def test_control_keys_cannot_be_explicitly_disclosed_in_guided_text(component, answer):
    raw = toolkit_activity(component)
    raw['scenes'][0]['params']['teachingText'] += f' The final answer is {answer}'
    with pytest.raises(ValidationError, match='disclose'):
        ActivitySpec.model_validate(raw)


def test_fresh_passage_cannot_reuse_the_guided_correct_evidence_as_its_answer():
    raw = toolkit_activity('evidence_board')
    raw['scenes'][2]['params']['sentences'][0]['text'] = raw['scenes'][0]['params']['sentences'][0]['text']
    with pytest.raises(ValidationError, match='supporting sentence'):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('response', [dict(bundles=True), dict(bundles=-1), dict(bundles=7),
                                      dict(order=['a', 'b'], sentenceId='c'), dict(sentenceId='a', correct=True)])
def test_new_response_contracts_reject_extra_keys_and_invalid_values(response):
    with pytest.raises(ValidationError):
        SubmitRequest(sceneId='s', idempotencyKey='request-key', response=response)
