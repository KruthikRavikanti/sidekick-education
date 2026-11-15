"""Inspectable component ports, bounded connections, and state-derived scoring.

These are descriptions and closed state transforms, never generated code. Saved
ActivitySpecs remain immutable; session views resolve connections from that
session's persisted responses, including a child's incorrect construction.
"""
import copy
import re
from contextlib import contextmanager


AREA_MODES = frozenset({'area_tile', 'area_design', 'area_expression'})


class SceneValidationError(ValueError):
    """Content-free location and correction constraint for one draft scene."""

    def __init__(self, index, constraint, *, category='schema', detail=None):
        self.scene_index = index
        self.constraint = constraint
        self.reason_code = f'{category}_scene_invalid'
        self.detail = detail
        super().__init__(f'Scene {index} failed {constraint}' + (f': {detail}' if detail else ''))


@contextmanager
def scene_validation(index):
    try:
        yield
    except SceneValidationError:
        raise
    except ValueError as error:
        # Every validator inside this boundary emits a fixed implementation
        # message, never uploaded/generated text. Only the code is audit-safe.
        raise SceneValidationError(index, safe_constraint(error), detail=str(error)) from None


def safe_constraint(error):
    """Translate known validators to stable reasons, never echo provider text."""
    text = str(error).casefold()
    checks = (
        ('area', 'area_state_or_goal'), ('quantity', 'quantity_state_or_math'),
        ('arithmetic', 'exact_arithmetic'), ('math rule', 'exact_arithmetic'),
        ('teaching', 'teaching_cue_contract'), ('independent', 'fresh_independent_challenge'),
        ('context', 'required_material'), ('visual', 'required_material'),
        ('fit', 'board_bounds'), ('reachable', 'reachable_goal'),
        ('marks', 'reachable_board_marks'), ('connection', 'compatible_connection'),
    )
    return next((code for needle, code in checks if needle in text), 'component_contract')


DESCRIPTORS = {
    'fraction_builder': dict(
        childActions=['shade equal unit fractions of one explicitly identified whole'],
        visibleChanges=['selected equal parts shade or clear while the whole stays fixed'],
        outputs=[], inputs=[], connectsTo=[], schemaVersions=['1.0'],
        serverAssesses=['exact selected-part numerator over the fixed denominator']),
    'number_line': dict(
        childActions=['move a point to an equal fractional interval on a zero-to-one line'],
        visibleChanges=['the selected point moves along equally spaced ticks'],
        outputs=[], inputs=[], connectsTo=[], schemaVersions=['1.0'],
        serverAssesses=['exact selected tick over the fixed denominator']),
    'word_tiles': dict(
        childActions=['assemble letter tiles into a plural noun'],
        visibleChanges=['the written word is rebuilt in the chosen tile order'],
        outputs=[], inputs=[], connectsTo=[], schemaVersions=['1.0'],
        serverAssesses=['deterministic supported regular or irregular plural']),
    'word_choice': dict(
        childActions=['choose a plural form'],
        visibleChanges=['the selected word changes'],
        outputs=[], inputs=[], connectsTo=[], schemaVersions=['1.0'],
        serverAssesses=['deterministic supported plural; insufficient as the only teaching action']),
    'quantity_lab': dict(
        childActions=['move a unit into or out of a named container'],
        visibleChanges=['container quantities and loose stock change together; total is conserved'],
        outputs=['quantity_total'], inputs=['context_material'],
        connectsTo=['math_workspace:quantity_equation', 'any contextual control:context_material'],
        serverAssesses=['piece conservation', 'reachable allocations', 'exact equal groups or arithmetic']),
    'math_workspace': dict(
        childActions=['mark or measure a board', 'construct an expression', 'tile every square in a rectangle',
                      'change rectangle rows and columns to use a fixed tile stock'],
        visibleChanges=['marks, ruler selection, geometry or expression update',
                        'placed unit squares cover the region', 'dimensions reshape the rectangle'],
        modes=['grid', 'ruler', 'number_line', 'clock', 'chart', 'equation', 'shape', 'angle', 'balance', 'vessel',
               'area_tile', 'area_design', 'area_expression'],
        outputs=['area_rectangle'], inputs=['area_rectangle', 'quantity_equation', 'context_material'],
        connectsTo=['math_workspace:area_rectangle', 'any contextual control:context_material'],
        serverAssesses=['reachable marks and exact scale', 'complete unit-square covering',
                        'any in-bounds rectangle with the required area', 'rows times columns equation derived from actual rectangle']),
    'sort_connect': dict(
        childActions=['place each piece into a group', 'connect pieces to meaningful destinations'],
        visibleChanges=['pieces move from bank to groups or connected pairs'],
        modes=['sort', 'connect'],
        outputs=[], inputs=['context_material'], connectsTo=[],
        serverAssesses=['one placement per offered piece', 'objective classification key or parent rubric']),
    'text_editor': dict(
        childActions=['edit a draft', 'assemble words', 'write an original response'],
        visibleChanges=['the actual draft changes as the child types or adds words'],
        modes=['compose', 'edit', 'assemble'],
        outputs=['written_text'], inputs=['draft_text', 'context_material'],
        connectsTo=['text_editor:draft_text', 'any contextual control:context_material'],
        serverAssesses=['objective edit variants with case preserved', 'written artifact and word bounds',
                        'parent-reviewed original composition']),
    'oral_studio': dict(
        childActions=['listen to source audio', 'record actual reading, sounds, or spoken response'],
        visibleChanges=['recording timer, saved-recording state and private playback become available'],
        modes=['read_aloud', 'say_sounds', 'listen_respond', 'perform'],
        outputs=[], inputs=['context_material'], connectsTo=[],
        serverAssesses=['owned recording bound to the scene', 'parent-reviewed spoken performance']),
    'drawing_studio': dict(
        childActions=['draw actual strokes on the board', 'clear and revise the drawing'],
        visibleChanges=['the child-created drawing appears and changes'],
        outputs=[], inputs=['context_material'], connectsTo=[],
        serverAssesses=['real bounded strokes', 'parent-reviewed visual artifact']),
    'bundle_builder': dict(
        childActions=['pack or unpack ten loose objects'],
        visibleChanges=['tens, loose ones and linked number display change while total stays fixed'],
        outputs=[], inputs=['context_material'], connectsTo=[],
        serverAssesses=['all complete tens packed', 'answer derived as total divided by ten']),
    'tile_order': dict(
        childActions=['place and reorder tiles on a sequence track'],
        visibleChanges=['a story, procedure, sentence or numerical sequence is rebuilt'],
        orderingModes=['story', 'sentence', 'ascending', 'descending'],
        outputs=['ordered_text'], inputs=['context_material'],
        connectsTo=['text_editor:draft_text', 'any contextual control:context_material'],
        serverAssesses=['complete permutation', 'numerical order derived from values', 'reviewed semantic order']),
    'evidence_board': dict(
        childActions=['move a sentence from an original passage onto a clue board'],
        visibleChanges=['the selected literal evidence appears beside the conclusion'],
        outputs=['selected_evidence'], inputs=['context_material'],
        connectsTo=['text_editor:context_material', 'oral_studio:context_material'],
        serverAssesses=['offered sentence ID', 'independently reviewed support for the claim']),
    'fraction_split_compare': dict(
        childActions=['choose an equal subdivision factor'],
        visibleChanges=['new partition lines animate while shaded area remains fixed; fraction label changes'],
        outputs=[], inputs=[], connectsTo=[],
        serverAssesses=['allowed split factor', 'same exact fraction value and requested denominator']),
    'guided_choice': dict(childActions=['select an answer'], visibleChanges=['selected option changes'],
        outputs=[], inputs=['context_material'], connectsTo=[],
        serverAssesses=['reviewed option key; insufficient as the only teaching interaction']),
    'guided_response': dict(childActions=['write a short objective answer'], visibleChanges=['response text changes'],
        outputs=[], inputs=['context_material'], connectsTo=[],
        serverAssesses=['exact numeric result or reviewed text variants; insufficient alone']),
    'independent_response': dict(childActions=['write a fresh objective answer'], visibleChanges=['response text changes'],
        outputs=[], inputs=[], connectsTo=[], serverAssesses=['exact number, requested fraction form, or reviewed variants']),
}


def component_descriptors(available_mechanics):
    from .families import COMPONENTS
    return [dict(component=name, schemaVersions=DESCRIPTORS[name].get('schemaVersions', ['1.2', '1.3'] if name in COMPONENTS else ['1.1', '1.2', '1.3']),
                 **copy.deepcopy({key: value for key, value in DESCRIPTORS[name].items() if key != 'schemaVersions'}))
            for name in dict.fromkeys([*available_mechanics, 'guided_choice', 'guided_response', 'independent_response'])
            if name in DESCRIPTORS]


def connection_options(available_mechanics):
    """The exact implemented port matrix, suitable for model and human review.

    A mode is null when the port is available in every supported mode of that
    component. These are prior-GUIDED-scene links; no independent input port is
    offered. Recordings/drawings deliberately have no invented text output.
    """
    available = {row['component'] for row in component_descriptors(available_mechanics)
                 if '1.3' in row['schemaVersions']}
    sources = []
    if 'math_workspace' in available:
        sources.extend(('math_workspace', 'area_rectangle', mode) for mode in ('area_tile', 'area_design'))
    sources.extend((component, output, None) for component, output in (
        ('quantity_lab', 'quantity_total'), ('tile_order', 'ordered_text'),
        ('evidence_board', 'selected_evidence'), ('text_editor', 'written_text')) if component in available)
    options = []

    def add(source, output, target, input_port, source_mode=None, target_mode=None, assessment=None):
        options.append(dict(sourceComponent=source, sourceOutput=output,
            targetComponent=target, targetInput=input_port,
            requiredSourceMode=source_mode, requiredTargetMode=target_mode,
            requiredTargetAssessment=assessment))

    for source, output, source_mode in sources:
        for target in sorted(available):
            if 'context_material' in DESCRIPTORS[target]['inputs']:
                add(source, output, target, 'context_material', source_mode)
        if output == 'area_rectangle' and 'math_workspace' in available:
            add(source, output, 'math_workspace', 'area_rectangle', source_mode, 'area_expression')
        elif output == 'quantity_total' and 'math_workspace' in available:
            add(source, output, 'math_workspace', 'quantity_equation', None, 'equation')
        elif output in {'ordered_text', 'written_text'} and 'text_editor' in available:
            add(source, output, 'text_editor', 'draft_text', None, 'edit', 'parent_review')
    return options


def connection_constraint(source, target, connection):
    """Precise schema-owned correction text, containing no activity strings."""
    output_modes = {
        'area_rectangle': 'math_workspace in area_tile or area_design mode',
        'quantity_total': 'quantity_lab', 'ordered_text': 'tile_order',
        'selected_evidence': 'evidence_board', 'written_text': 'text_editor',
    }
    input_modes = {
        'area_rectangle': 'math_workspace in area_expression mode, receiving area_rectangle',
        'quantity_equation': 'math_workspace in equation mode, receiving quantity_total',
        'context_material': 'a component with a context_material input',
        'draft_text': 'text_editor in edit mode with parent_review, receiving ordered_text or written_text',
    }
    # Components and ports have already passed their closed literal schemas.
    return (f'Connection from {source.component} to {target.component} is incompatible. '
            f'Output {connection.sourceOutput} requires {output_modes[connection.sourceOutput]}; '
            f'input {connection.targetInput} requires {input_modes[connection.targetInput]}. '
            'Choose an exact connectionOptions row or set connection to null; never invent an output for speech or drawings.')


def _area_answer(mode, area):
    rows, columns, total = area['rows'], area['columns'], area['targetArea']
    return dict(assessment='automatic',
        expectedMarks=([dict(x=x, y=y) for y in range(rows) for x in range(columns)] if mode == 'area_tile'
                       else []),
        expectedText=f'{rows} × {columns} = {total}' if mode == 'area_expression' else None,
        mathRule=dict(operation='multiply', operands=[str(rows), str(columns)], result=str(rows * columns))
            if mode != 'area_design' else dict(operation='represent', operands=[str(total)], result=str(total)))


def derive_answers(raw):
    """Canonicalize checkable keys from component state before schema validation.

    A model cannot make a twelve-square rectangle have an answer of eleven.
    Semantic reading/edit keys still need independent review; they are not
    falsely presented as consequences of geometry or other unrelated state.
    """
    from .models import AreaBoard
    from .models import numeric_answer
    result = copy.deepcopy(raw)
    if not isinstance(result, dict) or not isinstance(result.get('scenes'), list):
        return result
    for index, scene in enumerate(result['scenes']):
        if not isinstance(scene, dict) or not isinstance(scene.get('params'), dict):
            continue
        params = scene['params']
        if scene.get('component') == 'math_workspace' and params.get('mode') in AREA_MODES:
            try:
                area = AreaBoard.model_validate(params.get('area')).model_dump()
            except ValueError:
                raise SceneValidationError(index, 'area_requires_bounded_rows_columns_and_target') from None
            scene['answer'] = _area_answer(params['mode'], area)
        elif scene.get('component') == 'bundle_builder' and type(params.get('total')) is int:
            scene['answer'] = dict(bundles=params['total'] // 10)
        elif scene.get('component') == 'tile_order' and params.get('ordering') in {'ascending', 'descending'}:
            try:
                tiles = params['tiles']
                values = [(numeric_answer(tile['text']), tile['id']) for tile in tiles]
                if len({value for value, _ in values}) == len(values):
                    scene['answer'] = dict(order=[identifier for _, identifier in sorted(values, reverse=params['ordering'] == 'descending')])
            except (ValueError, KeyError, TypeError):
                pass  # The ordinary scene validator reports malformed material.
    return result


def validate_area_scene(scene, subject):
    """Validate action goals against the same board the child can manipulate."""
    params, area = scene.params, scene.params.area
    if subject != 'math' or area is None:
        raise ValueError('Area action requires Math and its actual rectangle state')
    if params.objects or params.tokens or params.step != '1' or params.origin != '0':
        raise ValueError('Area board uses equal unit squares, zero origin and its actual rectangle state')
    if area.rows > params.height or area.columns > params.width or area.rows * area.columns > 120:
        raise ValueError('Area rectangle must fit the reachable board and tile bound')
    if area.targetArea < 2:
        raise ValueError('Area mission requires more than one unit square')
    if params.mode == 'area_design':
        if area.rows * area.columns == area.targetArea:
            raise ValueError('Area design must require changing the starting rectangle')
        if not any(rows * columns == area.targetArea for rows in range(1, min(params.height, 12) + 1)
                   for columns in range(1, min(params.width, 12) + 1)):
            raise ValueError('Area target needs a reachable rectangle factor pair')
    elif area.rows * area.columns != area.targetArea:
        raise ValueError('Area target must equal the rectangle unit-square count')
    if scene.answer.assessment != 'automatic' or scene.answer.model_dump() != _area_answer(params.mode, area.model_dump()):
        raise ValueError('Area scoring must be derived from the actual component state')
    return scene


def grade_area_response(scene, response):
    from .models import WorkspaceResponse
    params, area = scene.params, scene.params.area
    if not isinstance(response, WorkspaceResponse):
        raise ValueError('Manipulate the offered area board')
    points = [(point.x, point.y) for point in response.marks]
    if len(set(points)) != len(points) or any(x != int(x) or y != int(y) for x, y in points):
        raise ValueError('Area response requires distinct whole unit positions')
    if params.mode == 'area_tile':
        if response.text or any(not 0 <= x < area.columns or not 0 <= y < area.rows for x, y in points):
            raise ValueError('Place actual unit tiles inside this rectangle')
        if not points:
            raise ValueError('Place at least one unit tile')
        return f'Tiled {len(points)} of {area.rows * area.columns} unit squares in a {area.rows} × {area.columns} rectangle.', len(points) == area.targetArea
    if params.mode == 'area_design':
        if response.text or len(points) != 1:
            raise ValueError('Design one rectangle by changing its rows and columns')
        columns, rows = map(int, points[0])
        if not (1 <= rows <= min(params.height, 12) and 1 <= columns <= min(params.width, 12)) or rows * columns > 120:
            raise ValueError('Area design must fit its board and tile bound')
        if (rows, columns) == (area.rows, area.columns):
            raise ValueError('Change the rectangle before saving its design')
        return f'Designed {rows} rows × {columns} columns = {rows * columns} square units; tile stock {area.targetArea}.', rows * columns == area.targetArea
    if points or not response.text.strip():
        raise ValueError('Construct the rectangle area expression')
    # Both factor orders are valid, but a bare area number or an unrelated sum
    # does not demonstrate connecting rows and columns to multiplication.
    expression = re.sub(r'\s+', '', response.text.replace('×', '*').replace('x', '*').replace('X', '*'))
    expected = {f'{area.rows}*{area.columns}={area.targetArea}', f'{area.columns}*{area.rows}={area.targetArea}'}
    return response.text.strip(), expression in expected


def _compatible(source, target, connection):
    output, input_port = connection.sourceOutput, connection.targetInput
    source_ok = {
        'area_rectangle': source.component == 'math_workspace' and source.params.mode in {'area_tile', 'area_design'},
        'quantity_total': source.component == 'quantity_lab',
        'ordered_text': source.component == 'tile_order',
        'selected_evidence': source.component == 'evidence_board',
        'written_text': source.component == 'text_editor',
    }[output]
    target_ok = {
        'area_rectangle': output == 'area_rectangle' and target.component == 'math_workspace' and target.params.mode == 'area_expression',
        'quantity_equation': output == 'quantity_total' and target.component == 'math_workspace' and target.params.mode == 'equation',
        'context_material': target.component in DESCRIPTORS and 'context_material' in DESCRIPTORS[target.component]['inputs'],
        'draft_text': output in {'ordered_text', 'written_text'} and target.component == 'text_editor' and target.params.mode == 'edit',
    }[input_port]
    return source_ok and target_ok


def validate_connections(spec):
    indexed = {}
    for index, scene in enumerate(spec.scenes):
        connection = scene.connection
        if connection is not None:
            if spec.schemaVersion != '1.3' or scene.phase != 'guided' or connection.sourceSceneId not in indexed:
                raise SceneValidationError(index, 'connection_requires_prior_guided_scene')
            source = indexed[connection.sourceSceneId]
            if source.phase != 'guided' or not _compatible(source, scene, connection):
                error = SceneValidationError(index, 'connection_requires_compatible_ports')
                error.repair_constraint = connection_constraint(source, scene, connection)
                raise error
            if connection.targetInput == 'draft_text' and getattr(scene.answer, 'assessment', None) != 'parent_review':
                raise SceneValidationError(index, 'child_draft_requires_parent_review')
            if connection.targetInput == 'quantity_equation' and len(source.params.containers) > 4:
                raise SceneValidationError(index, 'connected_expression_supports_up_to_four_quantity_terms')
            if connection.targetInput == 'area_rectangle':
                if source.params.area.targetArea != scene.params.area.targetArea:
                    raise SceneValidationError(index, 'linked_area_requires_same_tile_stock', category='scoring')
                if source.params.mode == 'area_tile' and (source.params.area.rows, source.params.area.columns) != (scene.params.area.rows, scene.params.area.columns):
                    raise SceneValidationError(index, 'linked_area_requires_source_rectangle', category='scoring')
        indexed[scene.id] = scene
    if spec.schemaVersion == '1.3' and spec.subskillId == '3.MD.C.7-1':
        guided = spec.scenes[:-1]
        if not any(scene.component == 'math_workspace' and scene.params.mode in {'area_tile', 'area_design'} for scene in guided):
            raise SceneValidationError(0, 'rectangle_area_requires_actual_covering_or_design')
        if not any(scene.component == 'math_workspace' and scene.params.mode == 'area_expression'
                   and scene.connection is not None and scene.connection.targetInput == 'area_rectangle'
                   and scene.connection.sourceOutput == 'area_rectangle' for scene in guided):
            raise SceneValidationError(1, 'rectangle_area_requires_guided_link_from_construction_to_expression')
        final = spec.scenes[-1]
        if final.component != 'math_workspace' or final.params.mode not in {'area_design', 'area_expression'}:
            raise SceneValidationError(len(spec.scenes) - 1, 'rectangle_area_final_requires_factor_design_or_expression')
    final = spec.scenes[-1]
    if final.component == 'math_workspace' and final.params.mode in AREA_MODES:
        for prior in spec.scenes[:-1]:
            if prior.component != 'math_workspace' or prior.params.mode not in AREA_MODES:
                continue
            duplicate = (prior.params.area.targetArea == final.params.area.targetArea if final.params.mode == 'area_design'
                         else sorted((prior.params.area.rows, prior.params.area.columns)) == sorted((final.params.area.rows, final.params.area.columns)))
            if duplicate:
                raise SceneValidationError(len(spec.scenes) - 1, 'independent_area_requires_fresh_rectangle_or_stock')
    return spec


def _area_output(source, response):
    area = source.params.area.model_dump()
    if source.params.mode == 'area_design':
        points = response.get('marks', [])
        if len(points) != 1:
            raise ValueError('A saved rectangle design is required for this connection')
        columns, rows = points[0].get('x'), points[0].get('y')
        if (type(columns) not in {int, float} or type(rows) not in {int, float}
                or columns != int(columns) or rows != int(rows)
                or not 1 <= columns <= min(12, source.params.width)
                or not 1 <= rows <= min(12, source.params.height) or columns * rows > 120):
            raise ValueError('A bounded rectangle design is required for this connection')
        area = dict(rows=int(rows), columns=int(columns), targetArea=int(rows * columns))
    return area


def _output_material(source, response, output):
    if output == 'area_rectangle':
        area = _area_output(source, response)
        return f"Your rectangle: {area['rows']} rows and {area['columns']} columns."
    if output == 'quantity_total':
        allocations = response.get('allocations', [])
        labels = {container.id: container.label for container in source.params.containers}
        return '; '.join(f"{labels.get(item['containerId'], 'Container')}: {item['count']} pieces" for item in allocations)
    if output == 'ordered_text':
        tiles = {tile.id: tile.text for tile in source.params.tiles}
        return ' '.join(tiles[identifier] for identifier in response.get('order', []))
    if output == 'selected_evidence':
        return next(sentence.text for sentence in source.params.sentences if sentence.id == response.get('sentenceId'))
    return response.get('writtenText', '')


def resolve_scene(spec, scene, responses):
    """Resolve only saved scene-local outputs, never state from a public request."""
    connection = scene.connection
    if connection is None:
        return scene
    source = next(item for item in spec.scenes if item.id == connection.sourceSceneId)
    response = responses.get(source.id)
    if response is None:
        raise ValueError('Complete the connected activity step first')
    if hasattr(response, 'model_dump'):
        response = response.model_dump()
    resolved = scene.model_copy(deep=True)
    if connection.targetInput == 'area_rectangle':
        from .models import AreaBoard, WorkspaceAnswer
        area = _area_output(source, response)
        resolved.params.area = AreaBoard.model_validate(area)
        resolved.params.width = max(resolved.params.width, area['columns'])
        resolved.params.height = max(resolved.params.height, area['rows'])
        resolved.answer = WorkspaceAnswer.model_validate(_area_answer(resolved.params.mode, area))
    elif connection.targetInput == 'quantity_equation':
        from .models import MathRule, WorkspaceAnswer
        from .models import numeric_answer
        # The actual saved allocations determine this following expression.
        counts = {item['containerId']: item['count'] for item in response.get('allocations', [])}
        unit = numeric_answer(source.params.unitValue)
        values = [counts[container.id] * unit for container in source.params.containers]
        if not values:
            raise ValueError('Complete the connected quantities first')
        total = sum(values)
        if len(values) > 1 and len(set(values)) == 1:
            expression = f'{len(values)} × {values[0]} = {total}'
            rule = dict(operation='multiply', operands=[str(len(values)), str(values[0])], result=str(total))
        elif len(values) > 1:
            expression = ' + '.join(map(str, values)) + f' = {total}'
            rule = dict(operation='add', operands=list(map(str, values)), result=str(total))
        else:
            expression = str(total)
            rule = dict(operation='represent', operands=[str(total)], result=str(total))
        resolved.answer = WorkspaceAnswer(assessment='automatic', expectedMarks=[], expectedText=expression,
                                         mathRule=MathRule.model_validate(rule))
        material = _output_material(source, response, connection.sourceOutput)
        resolved.params.context = '\n\n'.join(value for value in [resolved.params.context, material] if value)
    else:
        material = _output_material(source, response, connection.sourceOutput)
        if connection.targetInput == 'draft_text':
            resolved.params.initialText = material
        else:
            resolved.params.context = '\n\n'.join(value for value in [resolved.params.context, material] if value)
    return resolved
