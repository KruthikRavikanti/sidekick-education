"""Constructive schema witnesses for catalog-map compatibility, not AI evidence.

These deliberately simple scaffolds test that each joint modality/material/mode
constraint has an implementable state in the real schema and selection gate.
They are never seeded, shown to a child, or counted as generated/played coverage.
Semantic lesson quality still requires real generation and independent review.
"""
import json
from pathlib import Path

import pytest

from backend.activities import capabilities, coverage, families
from backend.activities.models import ActivitySpec


CATALOG = {row['subskill_id']: row for row in json.loads(
    (Path(__file__).resolve().parents[2] / 'data/sidekick_skill_map_v2.json').read_text())}
ENTRIES = coverage.catalog_map()


def visual(required, index):
    if required is None:
        return None
    kind = 'diagram' if required == 'geometry' else required

    def item(identifier, shape, label, x, y, width=12, height=12):
        return dict(id=identifier, kind=shape, label=label, x=x, y=y, width=width, height=height, color='green')

    if kind == 'chart':
        items = [item('axis', 'line', 'Count axis', 10, 10, 1, 70),
                 item('bar', 'rect', f'Category A has {index + 3} items', 30, 30, 12, 40),
                 item('label', 'text', f'{index + 3}', 12, 25)]
    elif kind == 'coins':
        items = [item('coin-a', ['penny', 'nickel', 'dime'][index], 'Coin A', 15, 20, 22, 22),
                 item('coin-b', 'quarter', 'Coin B', 50, 20, 28, 28)]
    elif kind == 'solid_shapes':
        items = [item('solid-a', 'cube', 'Object A', 15, 20, 25, 25), item('solid-b', 'sphere', 'Object B', 55, 20, 25, 25)]
    elif kind == 'scene':
        items = [item('fox', 'fox', 'Fox character', 10 + index * 5, 30, 20, 20), item('tree', 'tree', 'Tree', 60, 10, 25, 60)]
    elif kind == 'book_pages':
        items = [item('page-a', 'book', f'Opening page {index + 1}', 10, 20, 30, 45),
                 item('page-b', 'book', f'Following page {index + 2}', 55, 20, 30, 45)]
    elif kind == 'book_cover':
        items = [item('illustration', 'fox', 'Cover illustration', 30, 30, 35, 35)]
    else:
        items = [item('shape-a', ['rect', 'triangle', 'circle'][index], 'Shape A', 15, 20, 25, 25),
                 item('shape-b', 'rect', 'Shape B', 55, 20, 25, 35)]
    return dict(kind=kind, title=f'Original test material {index + 1}', author='Ren' if kind.startswith('book') else None,
                caption=f'Test material for scene {index + 1}.', items=items)


def shared(entry, index):
    return dict(context=None, teachingText='Use the control to demonstrate the stated goal.' if index < 2 else None,
                goal=entry['demonstration'], visual=visual(entry['constraints']['requiredVisual'], index))


def manual(entry):
    return dict(assessment='parent_review', rubric=[entry['demonstration']])


def family_scene(entry, component, index):
    params = shared(entry, index)
    if component == 'quantity_lab':
        amount = index + 3
        params.update(stock=12, containers=[dict(id='collection', label='Collection')], unitValue='1', taskOperation='build', initialCounts=[0])
        answer = dict(assessment='automatic', expectedCounts=[amount], mathRule=dict(operation='represent', operands=[str(amount)], result=str(amount)))
    elif component == 'math_workspace':
        modes = entry['constraints']['workspaceModes']
        mode = modes[0] if modes else ('shape' if entry['constraints']['requiredVisual'] in {'geometry', 'solid_shapes'} else 'equation')
        value = index + 3
        params.update(mode=mode, width=12, height=12, step='1', origin='0', unitLabel='units', objects=[], tokens=[])
        if mode == 'clock':
            mark = dict(x=index + 2, y=15)
            params['objects'] = [dict(id='given', label='Given clock', x=1, y=1, width=8, height=8, shape='circle', value=str((index + 2) * 60 + 15))]
            answer = dict(assessment='automatic', expectedMarks=[mark], expectedText=None, mathRule=None)
        elif mode == 'angle':
            degree = 30 + index * 15
            params['objects'] = [dict(id='given', label='Given angle', x=1, y=1, width=4, height=0, shape='line', value=str(degree))]
            answer = dict(assessment='automatic', expectedMarks=[dict(x=degree, y=0)], expectedText=None,
                          mathRule=dict(operation='represent', operands=[str(degree)], result=str(degree)))
        elif mode in {'ruler', 'number_line', 'balance', 'vessel'}:
            params['objects'] = [dict(id='given', label='Given sample', x=1, y=1, width=value, height=1, shape='rect',
                                      value=str(value) if mode in {'balance', 'vessel'} else None)]
            answer = dict(assessment='automatic', expectedMarks=[dict(x=value, y=0)], expectedText=str(value),
                          mathRule=dict(operation='represent', operands=[str(value)], result=str(value)))
        elif mode == 'chart':
            params['objects'] = [dict(id='bar', label='Category A', x=1, y=0, width=1, height=value, shape='rect', value=str(value))]
            answer = dict(assessment='automatic', expectedMarks=[dict(x=1, y=value)], expectedText=None, mathRule=None)
        elif mode == 'equation':
            params['tokens'] = [dict(id='a', text=str(value)), dict(id='plus', text='+'), dict(id='b', text='2'), dict(id='equals', text='=')]
            answer = dict(assessment='automatic', expectedMarks=[], expectedText=f'{value}+2={value + 2}',
                          mathRule=dict(operation='add', operands=[str(value), '2'], result=str(value + 2)))
        else:
            params['objects'] = [dict(id='given', label='Given shape', x=index + 1, y=1, width=2, height=2, shape='rect', value=None)]
            answer = dict(assessment='automatic', expectedMarks=[dict(x=index + 1, y=1)], expectedText=None, mathRule=None)
    elif component == 'sort_connect':
        params.update(mode='sort', pieces=[dict(id='first', text=f'First piece {index + 1}'), dict(id='second', text=f'Second piece {index + 1}')],
                      targets=[dict(id='left', label='Left category'), dict(id='right', label='Right category')])
        answer = dict(assessment='automatic', placements=[dict(pieceId='first', targetId='left'), dict(pieceId='second', targetId='right')])
    elif component == 'text_editor':
        min_words = entry['constraints']['minWrittenWords']
        is_manual = entry['assessment'] == 'parent_review' or entry['constraints']['requiredResponse'] == 'writing'
        params.update(mode='compose' if is_manual else 'edit', initialText='' if is_manual else f'the fox found {index + 1} keys.',
                      minLength=1, maxLength=5000, minWords=min_words, wordBank=[])
        answer = manual(entry) if is_manual else dict(assessment='automatic', acceptedTexts=[params['initialText'].capitalize()])
    elif component == 'oral_studio':
        audible = 'audible_word_or_sound_material' in entry['requirements']
        params.update(mode='say_sounds' if audible else 'read_aloud',
                      passage=f'Show the spoken goal for sample {index + 1}.' if audible else ['The fox found a key.', 'A bird landed by the gate.', 'The rabbit rested in the grass.'][index],
                      listenText=['cat', 'ship', 'dog'][index] if audible else None)
        answer = manual(entry)
    elif component == 'drawing_studio':
        params.update(backgroundPrompt=f'Create a new drawing for case {index + 1}: {entry["demonstration"]}', labels=[])
        answer = manual(entry)
    else:
        raise ValueError(f'Unsupported structural witness mechanic {component}')
    return dict(component=component, params=params, answer=answer)


def split_scene(index):
    numerator, denominator, factor = [(1, 2, 3), (2, 3, 2)][index]
    return dict(component='fraction_split_compare', params=dict(context=None, teachingText='Splitting equally keeps the shaded area fixed.',
        wholeLabel='One whole', shadedLabel='shaded', numerator=numerator, denominator=denominator, splitFactors=[2, 3]),
        answer=dict(splitFactor=factor))


def witness(entry):
    required_response = entry['constraints']['requiredResponse']
    allowed = entry['mechanics']
    guided_component = entry['primaryMechanic']
    if guided_component not in families.COMPONENTS and guided_component != 'fraction_split_compare':
        guided_component = next(component for component in allowed if component in families.COMPONENTS)
    final_component = {'writing': 'text_editor', 'oral': 'oral_studio', 'drawing': 'drawing_studio'}.get(required_response, guided_component)
    scenes = []
    for index in range(3):
        if guided_component == 'fraction_split_compare' and index < 2:
            scene = split_scene(index)
        elif guided_component == 'fraction_split_compare' and required_response is None:
            scene = dict(component='independent_response', params=dict(context=None),
                         answer=dict(comparison='fraction_form', value='6/8', acceptedAnswers=[], sourceNumerator=3, sourceDenominator=4, targetDenominator=8))
        else:
            scene = family_scene(entry, final_component if index == 2 else guided_component, index)
        scene.update(id=f'scene-{index}', phase='independent' if index == 2 else 'guided',
                     prompt='Write 3/4 in eighths.' if scene['component'] == 'independent_response' else f'Show case {index + 1}: {entry["demonstration"]}',
                     feedback=dict(correct='The demonstrated state meets the goal.', incorrect='Look at the scene and try again.', hint='Use the control to show the stated idea.'),
                     nextSceneId=f'scene-{index + 1}' if index < 2 else None)
        scenes.append(scene)
    return dict(schemaVersion='1.2', title='STRUCTURAL TEST ONLY: not a generated or verified lesson',
                subject=entry['subject'], grade=entry['grade'], subskillId=entry['subskillId'],
                misconceptionTags=[CATALOG[entry['subskillId']]['common_misconception']], sourceRefs=[], scenes=scenes)


@pytest.mark.parametrize('subskill', sorted(ENTRIES))
def test_every_catalog_record_has_a_constructible_constraint_path(subskill):
    """This counts structural compatibility only, never model/learning evidence."""
    entry = ENTRIES[subskill]
    try:
        spec = ActivitySpec.model_validate(witness(entry))
        capabilities.validate_activity(spec, CATALOG[subskill])
    except (ValueError, StopIteration) as error:
        pytest.fail(f'{subskill}: {entry["family"]} has incompatible {entry["constraints"]}: {error}', pytrace=False)
