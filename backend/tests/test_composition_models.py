"""State links and derived keys remain real actions, not prose-only templates."""
import copy

import pytest
from pydantic import ValidationError

from backend.activities import capabilities, composition, families
from backend.activities.models import ActivitySpec, WorkspaceResponse, WrittenResponse
from backend.tests.test_family_activity_models import family_activity


def area_activity(action='area_tile'):
    raw = family_activity('math_workspace')
    raw.update(schemaVersion='1.3', subskillId='3.MD.C.7-1', title='Build a habitat from square units')
    for index, scene in enumerate(raw['scenes']):
        mode = action if index == 0 else 'area_expression'
        rows, columns = (2, 3) if index < 2 else (3, 4)
        if mode == 'area_design':
            rows, columns = 1, 1
        scene['params'].update(mode=mode, width=8, height=8, step='1', origin='0', objects=[], tokens=[],
                               area=dict(rows=rows, columns=columns, targetArea=6 if index < 2 else 12))
        scene['prompt'] = ['Cover the habitat using square units.' if mode == 'area_tile' else 'Use six square units to design the habitat.',
                           'Write rows times columns equals area for your habitat.',
                           'Write rows times columns equals area for this fresh habitat.'][index]
    raw['scenes'][1]['connection'] = dict(sourceSceneId='scene-0', sourceOutput='area_rectangle', targetInput='area_rectangle')
    return composition.derive_answers(raw)


def parse(raw):
    return ActivitySpec.model_validate(composition.derive_answers(raw))


def test_ai_gets_inspectable_component_actions_effects_connections_and_assessment():
    descriptors = composition.component_descriptors(['math_workspace', 'text_editor', 'quantity_lab', 'tile_order', 'oral_studio'])
    assert len(descriptors) == 8
    for descriptor in descriptors:
        assert descriptor['childActions'] and descriptor['visibleChanges'] and descriptor['serverAssesses']
        assert {'inputs', 'outputs', 'connectsTo'} <= descriptor.keys()
    assert {'area_tile', 'area_design', 'area_expression'} <= set(descriptors[0]['modes'])


def test_connection_options_are_exact_and_do_not_invent_speech_or_drawing_outputs():
    rows = composition.connection_options(['math_workspace', 'quantity_lab', 'text_editor', 'tile_order', 'oral_studio', 'drawing_studio'])
    assert all(row['sourceComponent'] not in {'oral_studio', 'drawing_studio'} for row in rows)
    area = [row for row in rows if row['targetInput'] == 'area_rectangle']
    assert {row['requiredSourceMode'] for row in area} == {'area_tile', 'area_design'}
    assert all(row['requiredTargetMode'] == 'area_expression' for row in area)
    drafts = [row for row in rows if row['targetInput'] == 'draft_text']
    assert all(row['requiredTargetMode'] == 'edit' and row['requiredTargetAssessment'] == 'parent_review' for row in drafts)
    assert all(row['targetComponent'] == 'text_editor' for row in drafts)


def test_invalid_connection_explains_implemented_ports_without_scene_content():
    raw = area_activity()
    raw['scenes'][1]['connection']['sourceOutput'] = 'written_text'
    with pytest.raises(ValidationError) as caught:
        parse(raw)
    error = caught.value.errors()[0]['ctx']['error']
    assert 'written_text requires text_editor' in error.repair_constraint
    assert 'area_expression mode, receiving area_rectangle' in error.repair_constraint
    assert 'habitat' not in error.repair_constraint


@pytest.mark.parametrize('action', ['area_tile', 'area_design'])
def test_area_compositions_have_real_actions_and_fresh_independent_challenge(action):
    spec = parse(area_activity(action))
    assert spec.scenes[0].params.mode == action
    assert spec.scenes[-1].params.teachingText is None
    target = {'subskill_id': spec.subskillId, 'subject': 'Math', 'grade': '3', 'subskill': 'Tile a rectangle and show area = side x side'}
    assert capabilities.validate_activity(spec, target) is spec


def test_area_keys_are_derived_from_component_geometry_not_provider_claims():
    raw = area_activity()
    raw['scenes'][0]['answer'] = {'madeUpAnswer': '999'}
    raw['scenes'][2]['answer'] = {'assessment': 'automatic', 'expectedMarks': [], 'expectedText': '3*4=999', 'mathRule': None}
    spec = parse(raw)
    assert len(spec.scenes[0].answer.expectedMarks) == 6
    assert spec.scenes[2].answer.expectedText == '3 × 4 = 12'
    assert spec.scenes[2].answer.mathRule.result == '12'
    # Direct parsing of a forged saved definition fails closed.
    saved = spec.model_dump()
    saved['scenes'][2]['answer']['expectedText'] = '3 × 4 = 999'
    with pytest.raises(ValidationError, match='scoring must be derived'):
        ActivitySpec.model_validate(saved)


def test_tile_area_requires_each_actual_cell_and_rejects_text_count_bypass():
    scene = parse(area_activity()).scenes[0]
    all_tiles = [dict(x=x, y=y) for y in range(2) for x in range(3)]
    assert families.grade_response(scene, WorkspaceResponse(marks=all_tiles, text=''))[1] is True
    assert families.grade_response(scene, WorkspaceResponse(marks=all_tiles[:-1], text=''))[1] is False
    for response in [WorkspaceResponse(marks=[], text='6'), WorkspaceResponse(marks=[dict(x=3, y=0)], text='')]:
        with pytest.raises(ValueError, match='actual unit tiles'):
            families.grade_response(scene, response)
    with pytest.raises(ValueError, match='distinct'):
        families.grade_response(scene, WorkspaceResponse(marks=[all_tiles[0], all_tiles[0]], text=''))


@pytest.mark.parametrize('rows,columns,correct', [(2, 3, True), (3, 2, True), (1, 6, True), (2, 2, False), (7, 1, False)])
def test_fixed_stock_area_design_grades_factor_pairs_not_a_single_model_key(rows, columns, correct):
    scene = parse(area_activity('area_design')).scenes[0]
    readable, actual = families.grade_response(scene, WorkspaceResponse(marks=[dict(x=columns, y=rows)], text=''))
    assert actual is correct
    assert f'{rows} rows × {columns} columns' in readable


@pytest.mark.parametrize('text,correct', [('3 × 4 = 12', True), ('4*3=12', True), ('3x4=12', True),
                                         ('12', False), ('1+11=12', False), ('3*4=11', False), ('6*2=12', False)])
def test_area_expression_requires_actual_rows_and_columns(text, correct):
    scene = parse(area_activity()).scenes[-1]
    assert families.grade_response(scene, WorkspaceResponse(marks=[], text=text))[1] is correct


def test_linked_rectangle_uses_actual_saved_design_and_retains_original_spec():
    spec = parse(area_activity('area_design'))
    before = spec.model_dump_json()
    resolved = composition.resolve_scene(spec, spec.scenes[1], {'scene-0': {'marks': [dict(x=2, y=3)], 'text': ''}})
    assert resolved.params.area.rows == 3 and resolved.params.area.columns == 2
    assert resolved.answer.expectedText == '3 × 2 = 6'
    assert families.grade_response(resolved, WorkspaceResponse(marks=[], text='3*2=6'))[1] is True
    assert families.grade_response(resolved, WorkspaceResponse(marks=[], text='1*1=1'))[1] is False
    assert spec.model_dump_json() == before
    # A prior incorrect construction remains the child's actual construction;
    # the next teaching scene can correctly explain the area it actually has.
    actual = composition.resolve_scene(spec, spec.scenes[1], {'scene-0': {'marks': [dict(x=2, y=2)], 'text': ''}})
    assert actual.answer.expectedText == '2 × 2 = 4'


def test_connected_scene_requires_its_own_persisted_prior_response():
    spec = parse(area_activity())
    with pytest.raises(ValueError, match='Complete the connected'):
        composition.resolve_scene(spec, spec.scenes[1], {})


@pytest.mark.parametrize('mutation,reason', [
    (lambda raw: raw['scenes'][1]['connection'].update(sourceSceneId='missing'), 'prior_guided'),
    (lambda raw: raw['scenes'][1]['connection'].update(sourceOutput='written_text'), 'compatible_ports'),
    (lambda raw: raw['scenes'][1]['params']['area'].update(rows=3, columns=3, targetArea=9), 'same_tile_stock'),
    (lambda raw: raw['scenes'][2].update(connection=raw['scenes'][1]['connection']), 'prior_guided'),
    (lambda raw: raw.update(schemaVersion='1.2'), 'schema 1.3'),
])
def test_invalid_connections_cannot_leak_guided_work_or_invent_state(mutation, reason):
    raw = area_activity()
    mutation(raw)
    with pytest.raises(ValidationError, match=reason):
        parse(raw)


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['scenes'][0]['params']['area'].update(rows=9, columns=3, targetArea=27),
    lambda raw: raw['scenes'][0]['params']['area'].update(rows=2, columns=3, targetArea=5),
    lambda raw: raw['scenes'][0]['params'].update(step='2'),
    lambda raw: raw['scenes'][0]['params']['area'].update(rows=1, columns=1, targetArea=1),
])
def test_area_failures_are_localized_to_the_broken_scene_without_echoing_content(mutation):
    raw = area_activity()
    mutation(raw)
    with pytest.raises(ValidationError) as caught:
        parse(raw)
    diagnostic = caught.value.errors()[0]['ctx']['error']
    assert isinstance(diagnostic, composition.SceneValidationError)
    assert diagnostic.scene_index == 0
    assert diagnostic.reason_code == 'schema_scene_invalid'
    assert diagnostic.constraint == 'area_state_or_goal'


def test_area_cannot_be_a_decorative_click_followed_by_unrelated_questions():
    raw = area_activity()
    raw['scenes'][2] = dict(family_activity('quantity_lab')['scenes'][2])
    with pytest.raises(ValidationError, match='guided_link_from_construction|factor_design_or_expression'):
        parse(raw)


def test_area_requires_a_real_guided_connection_not_just_two_unrelated_boards():
    raw = area_activity()
    raw['scenes'][1]['connection'] = None
    with pytest.raises(ValidationError, match='guided_link_from_construction'):
        parse(raw)


def test_independent_area_is_not_a_replayed_rectangle_with_new_wording():
    raw = area_activity()
    raw['scenes'][2]['params']['area'] = dict(rows=3, columns=2, targetArea=6)
    with pytest.raises(ValidationError, match='fresh_rectangle'):
        parse(raw)


def test_existing_closed_controls_also_derive_simple_checkable_keys():
    raw = {'scenes': [dict(component='bundle_builder', params={'total': 37}, answer={'bundles': 0}),
                      dict(component='tile_order', params={'ordering': 'ascending', 'tiles': [dict(id='b', text='1/2'), dict(id='a', text='0.25')]}, answer={'order': ['b', 'a']})]}
    derived = composition.derive_answers(raw)
    assert derived['scenes'][0]['answer'] == {'bundles': 3}
    assert derived['scenes'][1]['answer'] == {'order': ['a', 'b']}
    assert raw['scenes'][0]['answer'] == {'bundles': 0}


def test_quantity_scene_connects_to_equation_using_actual_allocations():
    raw = family_activity()
    raw['schemaVersion'] = '1.3'
    equation = copy.deepcopy(family_activity('math_workspace')['scenes'][1])
    equation['params'].update(mode='equation', objects=[], tokens=[dict(id='three', text='3'), dict(id='four', text='4')])
    equation['answer'].update(expectedMarks=[], expectedText='3 × 4 = 12', mathRule=dict(operation='multiply', operands=['3', '4'], result='12'))
    equation['connection'] = dict(sourceSceneId='scene-0', sourceOutput='quantity_total', targetInput='quantity_equation')
    raw['scenes'][1] = equation
    spec = parse(raw)
    response = {'allocations': [dict(containerId=f'order-{n}', count=5) for n in range(3)]}
    linked = composition.resolve_scene(spec, spec.scenes[1], {'scene-0': response})
    assert linked.answer.expectedText == '3 × 5 = 15'
    assert 'Order 1: 5 pieces' in linked.params.context
    assert families.grade_response(linked, WorkspaceResponse(marks=[], text='3*5=15'))[1] is True


def test_dynamic_child_draft_uses_parent_assessment_instead_of_a_fabricated_key():
    raw = family_activity('text_editor')
    raw['schemaVersion'] = '1.3'
    raw['scenes'][1]['connection'] = dict(sourceSceneId='scene-0', sourceOutput='written_text', targetInput='draft_text')
    with pytest.raises(ValidationError, match='child_draft_requires_parent_review'):
        parse(raw)
    raw['scenes'][1]['answer'] = dict(assessment='parent_review', rubric=['Review the actual child draft and its revision.'])
    spec = parse(raw)
    linked = composition.resolve_scene(spec, spec.scenes[1], {'scene-0': {'writtenText': 'my own draft.'}})
    assert linked.params.initialText == 'my own draft.'
    assert families.grade_response(linked, WrittenResponse(writtenText='My own draft.'))[1] is None


def test_live_draft_then_revision_may_leave_the_incoming_draft_placeholder_empty():
    raw = family_activity('text_editor')
    raw['schemaVersion'] = '1.3'
    raw['scenes'][0]['params'].update(mode='compose', initialText='')
    raw['scenes'][0]['answer'] = dict(assessment='parent_review', rubric=['The child writes an original beginning.'])
    raw['scenes'][1]['params']['initialText'] = ''
    raw['scenes'][1]['answer'] = dict(assessment='parent_review', rubric=['The child revises the saved original beginning.'])
    raw['scenes'][1]['connection'] = dict(sourceSceneId='scene-0', sourceOutput='written_text', targetInput='draft_text')
    spec = parse(raw)
    linked = composition.resolve_scene(spec, spec.scenes[1], {'scene-0': {'writtenText': 'The fox ran into a quiet garden.'}})
    assert linked.params.mode == 'edit'
    assert linked.params.initialText == 'The fox ran into a quiet garden.'
    assert families.grade_response(linked, WrittenResponse(writtenText='The fox hurried into a quiet garden to find its lost friend.'))[1] is None
    with pytest.raises(ValueError, match='Edit the draft'):
        families.grade_response(linked, WrittenResponse(writtenText='The fox ran into a quiet garden.'))
