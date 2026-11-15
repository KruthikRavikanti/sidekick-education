"""Finite family controls use reachable states and never invent automatic scores."""
import copy

from pydantic import ValidationError
import pytest

from backend.activities import families
from backend.activities.models import (
    ActivitySpec, DrawingResponse, MathRule, OralResponse, QuantityResponse,
    SortResponse, SubmitRequest, WorkspaceResponse, WrittenResponse,
)


def family_activity(component='quantity_lab'):
    scenes = []
    for index in range(3):
        shared = dict(context=None, teachingText='Use the pieces to demonstrate the goal.' if index < 2 else None,
                      goal=f'Complete the new mission {index + 1}.', visual=None)
        manual = dict(assessment='parent_review', rubric=['Check the response demonstrates the stated goal using the actual child work.'])
        if component == 'quantity_lab':
            size = 4 + index
            params = dict(shared, stock=3 * size + 3, unitValue='1', taskOperation='build', initialCounts=[0, 0, 0],
                          containers=[dict(id=f'order-{n}', label=f'Order {n + 1}') for n in range(3)])
            answer = dict(assessment='automatic', expectedCounts=[size] * 3,
                          mathRule=dict(operation='multiply', operands=['3', str(size)], result=str(3 * size)))
        elif component == 'math_workspace':
            value = 4 + index
            params = dict(shared, mode='ruler', width=12, height=2, step='1/2', origin='0', unitLabel='inches',
                          objects=[dict(id='ribbon', label='Ribbon', x=0, y=1, width=value, height=0, shape='line', value=None)], tokens=[])
            answer = dict(assessment='automatic', expectedMarks=[dict(x=value, y=0)], expectedText=f'{value}/2',
                          mathRule=dict(operation='multiply', operands=[str(value), '1/2'], result=f'{value}/2'))
        elif component == 'sort_connect':
            words = [('cat', 'ship'), ('dog', 'three'), ('pig', 'thin')][index]
            params = dict(shared, mode='sort', pieces=[dict(id='a', text=words[0]), dict(id='b', text=words[1])],
                          targets=[dict(id='single', label='One-letter beginning'), dict(id='digraph', label='Two letters, one beginning sound')])
            answer = dict(assessment='automatic', placements=[dict(pieceId='a', targetId='single'), dict(pieceId='b', targetId='digraph')])
        elif component == 'text_editor':
            drafts = ['the fox ran.', 'the bird sang.', 'the fish swam.']
            params = dict(shared, mode='edit', initialText=drafts[index], minLength=3, maxLength=500, minWords=0, wordBank=[])
            answer = dict(assessment='automatic', acceptedTexts=[drafts[index].capitalize()])
        elif component == 'oral_studio':
            params = dict(shared, mode='read_aloud', passage=['The cat can nap.', 'The ship is red.', 'The duck can swim.'][index], listenText=None)
            answer = manual
        else:
            params = dict(shared, backgroundPrompt=f'Draw a shape with {index + 3} sides.', labels=[])
            answer = manual
        scenes.append(dict(id=f'scene-{index}', component=component, phase='guided' if index < 2 else 'independent',
                           prompt=f'Show the goal in mission {index + 1}.', params=params, answer=answer,
                           feedback=dict(correct='Your action shows the idea.', incorrect='Check how the parts work together.', hint='Use the scene to show the goal.'),
                           nextSceneId=f'scene-{index + 1}' if index < 2 else None))
    return dict(schemaVersion='1.2', title='An original family activity', subject='math' if component in {'quantity_lab', 'math_workspace', 'drawing_studio'} else 'ela',
                grade=3, subskillId='3.OA.A.1-1' if component in {'quantity_lab', 'math_workspace', 'drawing_studio'} else 'L.3.1-1',
                misconceptionTags=['Curriculum focus'], sourceRefs=[], scenes=scenes)


@pytest.mark.parametrize('component', sorted(families.COMPONENTS))
def test_new_families_require_fresh_independent_content_and_cue_removal(component):
    spec = ActivitySpec.model_validate(family_activity(component))
    assert families.validate_activity(spec, {component}) is spec
    assert spec.scenes[-1].params.teachingText is None
    assert len({families.task_key(scene) for scene in spec.scenes}) == 3


@pytest.mark.parametrize('rule,expected', [
    ({'operation': 'add', 'operands': ['1/3', '1/6'], 'result': '1/2'}, '1/2'),
    ({'operation': 'subtract', 'operands': ['2.5', '0.75'], 'result': '1.75'}, '7/4'),
    ({'operation': 'multiply', 'operands': ['3', '4'], 'result': '12'}, '12'),
    ({'operation': 'divide', 'operands': ['9', '4'], 'result': '2.25'}, '9/4'),
    ({'operation': 'represent', 'operands': ['0'], 'result': '0'}, '0'),
])
def test_math_rules_solve_exact_rational_arithmetic(rule, expected):
    assert str(families.validate_math_rule(MathRule.model_validate(rule))) == expected


@pytest.mark.parametrize('rule', [
    {'operation': 'add', 'operands': ['2', '3'], 'result': '6'},
    {'operation': 'divide', 'operands': ['2', '0'], 'result': '0'},
    {'operation': 'represent', 'operands': ['2', '3'], 'result': '2'},
    {'operation': 'multiply', 'operands': ['2'], 'result': '2'},
    {'operation': 'add', 'operands': ['__import__("os")', '1'], 'result': '2'},
    {'operation': 'represent', 'operands': ['10000000000'], 'result': '10000000000'},
])
def test_invalid_math_never_becomes_a_key(rule):
    with pytest.raises(ValidationError):
        MathRule.model_validate(rule)


def test_quantity_actions_preserve_stock_and_grade_equal_groups():
    scene = ActivitySpec.model_validate(family_activity()).scenes[0]
    response = QuantityResponse(allocations=[dict(containerId=f'order-{n}', count=4) for n in range(3)])
    assert families.grade_response(scene, response) == ('Order 1: 4; Order 2: 4; Order 3: 4; 3 loose', True)
    wrong = response.model_copy(deep=True)
    wrong.allocations[0].count = 3
    assert families.grade_response(scene, wrong)[1] is False
    wrong.allocations[0].count = 120
    with pytest.raises(ValueError, match='more pieces'):
        families.grade_response(scene, wrong)
    with pytest.raises(ValueError, match='every offered'):
        families.grade_response(scene, QuantityResponse(allocations=[dict(containerId='invented', count=1)]))


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['params'].update(stock=11),
    lambda raw: raw['scenes'][0]['params'].update(unitValue='0'),
    lambda raw: raw['scenes'][0]['params'].update(initialCounts=[0]),
    lambda raw: raw['scenes'][0]['params'].update(initialCounts=[4, 4, 4]),
    lambda raw: raw['scenes'][0]['answer'].update(expectedCounts=[1, 5, 6]),
    lambda raw: raw['scenes'][0]['answer']['mathRule'].update(result='11'),
    lambda raw: raw['scenes'][0]['params'].update(taskOperation='combine'),
    lambda raw: raw['scenes'][2]['params'].update(teachingText='The answer is three groups.'),
    lambda raw: raw.update(subject='ela'),
    lambda raw: raw.update(schemaVersion='1.1'),
])
def test_quantity_rejects_unreachable_or_decorative_math(mutation):
    raw = family_activity()
    mutation(raw)
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_division_requires_distributing_the_full_stock_equally():
    raw = family_activity()
    scene = raw['scenes'][0]
    scene['params'].update(stock=12, taskOperation='distribute')
    scene['answer']['mathRule'] = dict(operation='divide', operands=['12', '3'], result='4')
    parsed = ActivitySpec.model_validate(raw).scenes[0]
    assert families.grade_response(parsed, QuantityResponse(allocations=[dict(containerId=f'order-{n}', count=4) for n in range(3)]))[1] is True
    scene['answer']['expectedCounts'] = [2, 5, 5]
    with pytest.raises(ValidationError, match='equally'):
        ActivitySpec.model_validate(raw)


def test_parent_review_does_not_make_an_empty_disabled_quantity_board_playable():
    raw = family_activity()
    scene = raw['scenes'][0]
    scene['params'].update(stock=0, initialCounts=[0, 0, 0])
    scene['answer'] = dict(assessment='parent_review', rubric=['The child actually moves quantities to demonstrate the goal.'])
    with pytest.raises(ValidationError, match='actually move'):
        ActivitySpec.model_validate(raw)


def test_subtraction_requires_the_initial_quantity_and_a_real_removal():
    raw = family_activity()
    scene = raw['scenes'][0]
    scene['params'].update(stock=12, taskOperation='remove', initialCounts=[12, 0, 0])
    scene['answer'].update(expectedCounts=[9, 0, 0], mathRule=dict(operation='subtract', operands=['12', '3'], result='9'))
    assert ActivitySpec.model_validate(raw)
    scene['params']['initialCounts'] = [10, 0, 0]
    with pytest.raises(ValidationError, match='initial quantity'):
        ActivitySpec.model_validate(raw)


def test_workspace_measurement_uses_the_actual_ruler_scale():
    scene = ActivitySpec.model_validate(family_activity('math_workspace')).scenes[0]
    assert families.grade_response(scene, WorkspaceResponse(marks=[dict(x=4, y=0)], text='4/2'))[1] is True
    assert families.grade_response(scene, WorkspaceResponse(marks=[dict(x=4, y=0)], text='2.0'))[1] is True
    assert families.grade_response(scene, WorkspaceResponse(marks=[dict(x=5, y=0)], text='4/2'))[1] is False
    with pytest.raises(ValueError, match='reachable'):
        families.grade_response(scene, WorkspaceResponse(marks=[dict(x=13, y=0)], text='4/2'))
    with pytest.raises(ValueError, match='horizontal'):
        families.grade_response(scene, WorkspaceResponse(marks=[dict(x=4, y=1)], text='4/2'))


def test_workspace_equation_keys_are_solved_without_executing_code():
    raw = family_activity('math_workspace')
    scene = raw['scenes'][0]
    scene['params'].update(mode='equation', objects=[], tokens=[dict(id='three', text='3'), dict(id='four', text='4'), dict(id='times', text='×')])
    scene['answer'].update(expectedMarks=[], expectedText='3 × 4 = 12', mathRule=dict(operation='multiply', operands=['3', '4'], result='12'))
    parsed = ActivitySpec.model_validate(raw).scenes[0]
    assert families.grade_response(parsed, WorkspaceResponse(marks=[], text='3*4=12'))[1] is True
    assert families.grade_response(parsed, WorkspaceResponse(marks=[], text='1+11=12'))[1] is False
    scene['answer']['expectedText'] = '3 × 4 = 11'
    with pytest.raises(ValidationError, match='exact math'):
        ActivitySpec.model_validate(raw)
    scene['answer']['expectedText'] = '__import__("os")'
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('mode,mark', [('clock', {'x': 3, 'y': 45}), ('angle', {'x': 135, 'y': 0})])
def test_clock_and_protractor_use_real_time_and_angle_states(mode, mark):
    raw = family_activity('math_workspace')
    scene = raw['scenes'][0]
    scene['params'].update(mode=mode, objects=[], tokens=[])
    scene['answer'].update(expectedMarks=[mark], expectedText=None, mathRule=None)
    parsed = ActivitySpec.model_validate(raw).scenes[0]
    assert families.grade_response(parsed, WorkspaceResponse(marks=[mark], text=''))[1] is True
    mark['x'] = 12 if mode == 'clock' else 181
    with pytest.raises((ValidationError, ValueError)):
        families.grade_response(parsed, WorkspaceResponse(marks=[mark], text=''))


def test_sorting_checks_every_actual_piece_and_preserves_chosen_relationships():
    scene = ActivitySpec.model_validate(family_activity('sort_connect')).scenes[0]
    response = SortResponse(placements=[dict(pieceId='a', targetId='single'), dict(pieceId='b', targetId='digraph')])
    assert families.grade_response(scene, response) == ('cat → One-letter beginning; ship → Two letters, one beginning sound', True)
    response.placements[1].targetId = 'single'
    assert families.grade_response(scene, response)[1] is False
    response.placements[1].pieceId = 'a'
    with pytest.raises(ValueError, match='every offered'):
        families.grade_response(scene, response)


def test_sorting_every_piece_into_one_named_box_is_not_a_meaningful_classification():
    raw = family_activity('sort_connect')
    for placement in raw['scenes'][0]['answer']['placements']:
        placement['targetId'] = 'single'
    with pytest.raises(ValidationError, match='distinguish at least two'):
        ActivitySpec.model_validate(raw)


def test_editing_checks_case_and_retains_an_incorrect_attempt_verbatim():
    scene = ActivitySpec.model_validate(family_activity('text_editor')).scenes[0]
    assert families.grade_response(scene, WrittenResponse(writtenText='The fox ran.')) == ('The fox ran.', True)
    assert families.grade_response(scene, WrittenResponse(writtenText='THE FOX RAN.')) == ('THE FOX RAN.', False)
    with pytest.raises(ValueError, match='Edit the draft'):
        families.grade_response(scene, WrittenResponse(writtenText='the fox ran.'))


def test_original_writing_stays_pending_review_and_is_not_scored_incorrect():
    raw = family_activity('text_editor')
    scene = raw['scenes'][0]
    scene['params'].update(mode='compose', initialText='')
    with pytest.raises(ValidationError, match='parent review'):
        ActivitySpec.model_validate(raw)
    scene['answer'] = dict(assessment='parent_review', rubric=['The story has a beginning, an event, and an ending.'])
    parsed = ActivitySpec.model_validate(raw).scenes[0]
    written = 'First the fox dug a hole. It found a key. At last it opened the box.'
    assert families.grade_response(parsed, WrittenResponse(writtenText=written)) == (written, None)


def test_long_writing_uses_actual_words_and_keeps_the_parent_review_pending():
    raw = family_activity('text_editor')
    scene = raw['scenes'][0]
    scene['params'].update(mode='compose', initialText='', minWords=5)
    scene['answer'] = dict(assessment='parent_review', rubric=['The child writes a complete short event.'])
    parsed = ActivitySpec.model_validate(raw).scenes[0]
    with pytest.raises(ValueError, match='enough words'):
        families.grade_response(parsed, WrittenResponse(writtenText='Lots-of-letters without enough words.'))
    assert families.grade_response(parsed, WrittenResponse(writtenText='A fox ran into the garden.'))[1] is None
    scene['params']['maxLength'] = 5
    with pytest.raises(ValidationError, match='reachable'):
        ActivitySpec.model_validate(raw)


def test_oral_response_requires_actual_recording_reference_and_parent_review():
    scene = ActivitySpec.model_validate(family_activity('oral_studio')).scenes[0]
    assert families.grade_response(scene, OralResponse(recordingId='recording-123')) == ('Voice recording saved for parent review.', None)
    with pytest.raises(ValueError, match='Record your voice'):
        families.grade_response(scene, WrittenResponse(writtenText='Pretend I read it aloud.'))


def test_drawing_requires_visible_real_strokes_and_never_auto_grades_the_picture():
    scene = ActivitySpec.model_validate(family_activity('drawing_studio')).scenes[0]
    assert families.grade_response(scene, DrawingResponse(strokes=[[dict(x=1, y=2), dict(x=40, y=30)]])) == ('Drawing saved: 1 strokes.', None)
    with pytest.raises(ValueError, match='visible stroke'):
        families.grade_response(scene, DrawingResponse(strokes=[[dict(x=1, y=2), dict(x=1, y=2)]]))
    with pytest.raises(ValidationError):
        DrawingResponse(strokes=[[dict(x=0, y=0), dict(x=101, y=2)]])


@pytest.mark.parametrize('component', sorted(families.COMPONENTS))
def test_required_new_visual_fields_are_closed_and_generated_text_is_safe(component):
    raw = family_activity(component)
    raw['scenes'][0]['params']['visual'] = dict(kind='scene', title='A little scene', author=None, caption=None,
        items=[dict(id='fox', kind='fox', label='A fox', x=10, y=10, width=20, height=20, color='brown')])
    assert ActivitySpec.model_validate(raw)
    raw['scenes'][0]['params']['visual']['items'][0]['kind'] = 'javascript'
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_freshness_uses_numeric_premises_not_a_different_setting():
    raw = family_activity()
    raw['scenes'][2]['params'] = copy.deepcopy(raw['scenes'][0]['params'])
    raw['scenes'][2]['params']['teachingText'] = None
    raw['scenes'][2]['answer'] = copy.deepcopy(raw['scenes'][0]['answer'])
    raw['scenes'][2]['prompt'] = 'A completely different mission with the same arithmetic.'
    with pytest.raises(ValidationError, match='fresh content'):
        ActivitySpec.model_validate(raw)


def coverage_entry(**constraints):
    defaults = dict(requiredResponse=None, requiredVisual=None, workspaceModes=[], minWrittenWords=0,
                    requiredGuidedMechanics=['text_editor', 'sort_connect'])
    defaults.update(constraints)
    return dict(assessment='automatic', requirements=[], constraints=defaults)


def test_catalog_constraints_require_real_modalities_and_review_instead_of_typed_substitutes():
    spec = ActivitySpec.model_validate(family_activity('text_editor'))
    entry = coverage_entry()
    assert families.validate_coverage(spec, entry) is spec
    entry['constraints']['requiredResponse'] = 'oral'
    with pytest.raises(ValueError, match='modality'):
        families.validate_coverage(spec, entry)
    entry['constraints']['requiredResponse'] = None
    entry['assessment'] = 'parent_review'
    with pytest.raises(ValueError, match='honest parent review'):
        families.validate_coverage(spec, entry)


def test_catalog_visual_constraints_reject_a_written_description_as_a_book_cover():
    raw = family_activity('text_editor')
    entry = coverage_entry()
    entry['constraints']['requiredVisual'] = 'book_cover'
    for scene in raw['scenes']:
        scene['params']['context'] = 'Pretend a book cover says The Fox by Ren.'
    with pytest.raises(ValueError, match='actual visual'):
        families.validate_coverage(ActivitySpec.model_validate(raw), entry)
    for scene in raw['scenes']:
        scene['params']['visual'] = dict(kind='book_cover', title='The Fox', author='Ren', caption=None,
            items=[dict(id='fox', kind='fox', label='Fox illustration', x=10, y=10, width=20, height=20, color='brown')])
    assert families.validate_coverage(ActivitySpec.model_validate(raw), entry)


def test_shared_chart_material_can_use_real_axes_with_zero_width_or_height():
    raw = family_activity('text_editor')
    for scene in raw['scenes']:
        scene['params']['visual'] = dict(kind='chart', title='Seed counts', author=None, caption=None,
            items=[dict(id='axis', kind='line', label='Count axis', x=10, y=10, width=0, height=70, color='gray'),
                   dict(id='bar', kind='rect', label='Beans', x=30, y=30, width=15, height=50, color='green'),
                   dict(id='label', kind='text', label='Five seeds', x=10, y=20, width=20, height=10, color='gray')])
    spec = ActivitySpec.model_validate(raw)
    assert families.validate_coverage(spec, coverage_entry(requiredVisual='chart'))
    raw['scenes'][0]['params']['visual']['items'][1]['width'] = 0
    with pytest.raises(ValidationError, match='positive dimensions'):
        ActivitySpec.model_validate(raw)


def test_independent_decoding_cannot_be_completed_by_parroting_the_target_audio():
    spec = ActivitySpec.model_validate(family_activity('oral_studio'))
    entry = coverage_entry()
    entry['assessment'] = 'parent_review'
    entry['requirements'] = ['target_word_not_read_to_child']
    entry['constraints'].update(requiredResponse='oral', requiredGuidedMechanics=['oral_studio'])
    assert families.validate_coverage(spec, entry)
    spec.scenes[-1].params.listenText = spec.scenes[-1].params.passage
    with pytest.raises(ValueError, match='without reading its answer aloud'):
        families.validate_coverage(spec, entry)


def test_sound_awareness_requires_actual_audible_material():
    spec = ActivitySpec.model_validate(family_activity('oral_studio'))
    entry = coverage_entry()
    entry['assessment'] = 'parent_review'
    entry['requirements'] = ['audible_word_or_sound_material']
    entry['constraints'].update(requiredResponse='oral', requiredGuidedMechanics=['oral_studio'])
    with pytest.raises(ValueError, match='actual audible'):
        families.validate_coverage(spec, entry)
    spec.scenes[-1].params.mode = 'say_sounds'
    spec.scenes[-1].params.listenText = 'cat'
    assert families.validate_coverage(spec, entry)


@pytest.mark.parametrize('mode', ['balance', 'vessel'])
def test_mass_and_capacity_have_visible_measured_values_and_reachable_scale_states(mode):
    raw = family_activity('math_workspace')
    scene = raw['scenes'][0]
    scene['params'].update(mode=mode, step='5', objects=[dict(id='sample', label='Sample', x=1, y=0, width=1, height=1, shape='rect', value='35')])
    scene['answer'].update(expectedMarks=[dict(x=7, y=0)], expectedText='35', mathRule=dict(operation='represent', operands=['35'], result='35'))
    parsed = ActivitySpec.model_validate(raw).scenes[0]
    assert families.grade_response(parsed, WorkspaceResponse(marks=[dict(x=7, y=0)], text='35'))[1] is True
    scene['params']['objects'][0]['value'] = None
    with pytest.raises(ValidationError, match='actual measurement objects'):
        ActivitySpec.model_validate(raw)


@pytest.mark.parametrize('response', [
    {'allocations': [{'containerId': 'x', 'count': True}]},
    {'placements': [{'pieceId': 'a', 'targetId': 'x'}, {'pieceId': 'b', 'targetId': 'x'}], 'answer': 'private'},
    {'recordingId': '../another-child'},
    {'strokes': [[{'x': 0, 'y': 0}, {'x': 1, 'y': 2, 'script': 'bad'}]]},
])
def test_response_shapes_reject_forged_or_unbounded_fields(response):
    with pytest.raises(ValidationError):
        SubmitRequest.model_validate(dict(sceneId='s', idempotencyKey='a-valid-test-key', response=response))
