"""Closed reusable actions, exact math and honest parent-review responses.

The model supplies content and goals. No generated code or expressions execute;
fixed React controls implement each action. Language/visual semantics must also
pass independent model review before an activity is reusable.
"""
import ast
from fractions import Fraction
import hashlib
import json
import math
import re
import unicodedata


COMPONENTS = frozenset({'quantity_lab', 'math_workspace', 'sort_connect', 'text_editor', 'oral_studio', 'drawing_studio'})


def _safe(text):
    from .models import _safe_generated_text
    _safe_generated_text(text)


def _number(text):
    from .models import numeric_answer
    number = numeric_answer(text)
    if abs(number) > 10 ** 9 or number.denominator > 10 ** 9:
        raise ValueError('Board numbers must be bounded')
    return number


def _written(text):
    # Case is part of capitalization/grammar objectives, and must be preserved.
    return ' '.join(unicodedata.normalize('NFKC', text).split())


def word_count(text):
    return len(re.findall(r"\b\w+(?:['’\-]\w+)*\b", text, re.UNICODE))


def validate_math_rule(rule):
    values = [_number(value) for value in rule.operands]
    result = _number(rule.result)
    operation = rule.operation
    if operation == 'represent' and len(values) == 1:
        actual = values[0]
    elif operation == 'add' and len(values) >= 2:
        actual = sum(values, Fraction(0))
    elif operation == 'subtract' and len(values) == 2:
        actual = values[0] - values[1]
    elif operation == 'multiply' and len(values) == 2:
        actual = values[0] * values[1]
    elif operation == 'divide' and len(values) == 2 and values[1] != 0:
        actual = values[0] / values[1]
    else:
        raise ValueError('Math rule requires the correct nonzero operands')
    if actual != result:
        raise ValueError('Math rule result must equal its exact arithmetic')
    return result


def _unique(items, text_field='text', *, distinct_labels=True):
    identifiers = [item.id for item in items]
    if len(set(identifiers)) != len(identifiers):
        raise ValueError('Board IDs must be unique')
    texts = [getattr(item, text_field) for item in items]
    if distinct_labels and len({_written(text) for text in texts}) != len(texts):
        raise ValueError('Board labels must be distinct')
    for text in texts:
        _safe(text)
    return identifiers


def _point_key(point):
    return (round(point.x, 6), round(point.y, 6))


def _validate_marks(params, marks):
    points = [_point_key(point) for point in marks]
    if len(set(points)) != len(points):
        raise ValueError('Board marks must be distinct')
    if params.mode == 'clock':
        if len(points) != 1:
            raise ValueError('A clock has one selected hour and minute')
        hour, minute = points[0]
        if not (hour == int(hour) and minute == int(minute) and 0 <= hour <= 11 and 0 <= minute <= 59):
            raise ValueError('Clock hands require an hour 0..11 and minute 0..59')
    elif params.mode == 'angle':
        if len(points) != 1 or points[0][1] != 0 or points[0][0] != int(points[0][0]) or not 0 <= points[0][0] <= 180:
            raise ValueError('Protractor response requires one angle from 0 to 180 degrees')
    else:
        for x, y in points:
            if x != int(x) or y != int(y) or x > params.width or y > params.height:
                raise ValueError('Marks must use reachable integer board positions')
            if params.mode in {'ruler', 'number_line', 'balance', 'vessel'} and y != 0:
                raise ValueError('A ruler or number line has marks on its horizontal axis')
    return points


def _expression(text):
    """Evaluate a tiny arithmetic tree, without eval or names/calls/attributes."""
    text = text.replace('×', '*').replace('÷', '/').replace('−', '-').strip()
    if len(text) > 300 or not re.fullmatch(r'[0-9.\s+*/()\-]+', text):
        raise ValueError('Expected a bounded arithmetic expression')
    try:
        tree = ast.parse(text, mode='eval')
    except (SyntaxError, ValueError):
        raise ValueError('Expected a bounded arithmetic expression') from None
    if len(list(ast.walk(tree))) > 80:
        raise ValueError('Arithmetic expression is too large')

    def visit(node, depth=0):
        if depth > 12:
            raise ValueError('Arithmetic expression is too deep')
        if isinstance(node, ast.Expression):
            return visit(node.body, depth + 1)
        if isinstance(node, ast.Constant) and type(node.value) in {int, float}:
            return _number(str(node.value))
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
            value = visit(node.operand, depth + 1)
            return -value if isinstance(node.op, ast.USub) else value
        if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Add, ast.Sub, ast.Mult, ast.Div)):
            left, right = visit(node.left, depth + 1), visit(node.right, depth + 1)
            if isinstance(node.op, ast.Add):
                value = left + right
            elif isinstance(node.op, ast.Sub):
                value = left - right
            elif isinstance(node.op, ast.Mult):
                value = left * right
            elif right:
                value = left / right
            else:
                raise ValueError('Cannot divide by zero')
            if abs(value) > 10 ** 9 or value.denominator > 10 ** 9:
                raise ValueError('Arithmetic expression is out of bounds')
            return value
        raise ValueError('Unsupported arithmetic expression')

    return visit(tree)


def _validate_expression_result(text, expected):
    sides = text.split('=')
    if len(sides) > 2 or any(_expression(side) != expected for side in sides):
        raise ValueError('Workspace answer must agree with its exact math rule')


def _workspace_text_correct(params, answer, text):
    expected = answer.expectedText
    if answer.mathRule is not None:
        try:
            value = _number(expected)
        except ValueError:
            # Preserve the requested equation structure while accepting the
            # keyboard and printed forms of its signs and harmless spacing.
            def equation_form(value):
                return re.sub(r'\s+', '', value.replace('×', '*').replace('÷', '/').replace('−', '-'))
            return equation_form(text) == equation_form(expected)
        try:
            return _number(text) == value
        except ValueError:
            return False
    if params.mode == 'clock':
        expected_match = re.fullmatch(r'\s*(\d{1,2}):(\d{2})\s*', expected)
        actual_match = re.fullmatch(r'\s*(\d{1,2}):(\d{2})\s*', text)
        if expected_match and actual_match:
            return tuple(map(int, expected_match.groups())) == tuple(map(int, actual_match.groups()))
    return _written(text) == _written(expected)


def validate_scene(scene, subject):
    params, answer = scene.params, scene.answer
    _safe(params.goal)
    if params.context is not None:
        _safe(params.context)
    if params.visual is not None:
        _validate_visual(params.visual)
    if scene.phase == 'guided':
        if not params.teachingText:
            raise ValueError('Guided family scenes require teaching text')
        _safe(params.teachingText)
    elif params.teachingText is not None:
        raise ValueError('Independent family scenes must remove teaching cues')
    manual = answer.assessment == 'parent_review'
    if manual:
        for criterion in answer.rubric:
            _safe(criterion)
    component = scene.component
    if component == 'quantity_lab':
        if subject != 'math':
            raise ValueError('Quantity lab is a Math control')
        _unique(params.containers, 'label')
        unit = _number(params.unitValue)
        if unit <= 0:
            raise ValueError('Quantity units must be positive')
        if params.stock == 0:
            raise ValueError('Quantity lab requires pieces the child can actually move')
        if len(params.initialCounts) != len(params.containers) or sum(params.initialCounts) > params.stock:
            raise ValueError('Initial allocations must conserve available pieces')
        if not manual:
            counts, rule = answer.expectedCounts, answer.mathRule
            result = validate_math_rule(rule)
            values = [_number(value) for value in rule.operands]
            if len(counts) != len(params.containers) or sum(counts) > params.stock:
                raise ValueError('Quantity goal must be reachable from the stock')
            if counts == params.initialCounts:
                raise ValueError('Quantity goal requires a meaningful scene change')
            if rule.operation == 'divide':
                if (params.taskOperation != 'distribute' or values[1].denominator != 1
                        or len(counts) != values[1] or params.stock * unit != values[0]
                        or any(count * unit != result for count in counts)):
                    raise ValueError('Division must distribute the entire stock equally')
            else:
                if sum(counts) * unit != result:
                    raise ValueError('Allocated quantity must represent the arithmetic result')
                if rule.operation == 'subtract':
                    if params.taskOperation != 'remove' or sum(params.initialCounts) * unit != values[0]:
                        raise ValueError('Subtraction must remove pieces from the initial quantity')
                elif rule.operation == 'add' and params.taskOperation != 'combine':
                    raise ValueError('Addition combines quantities')
                elif rule.operation in {'represent', 'multiply'} and params.taskOperation != 'build':
                    raise ValueError('Representation and multiplication build quantities')
                if rule.operation == 'multiply' and (values[0].denominator != 1 or len(counts) != values[0]
                        or any(count * unit != values[1] for count in counts)):
                    raise ValueError('Multiplication must build the stated number of equal groups')
    elif component == 'math_workspace':
        _safe(params.unitLabel)
        if _number(params.step) <= 0:
            raise ValueError('Board scale must be positive')
        _number(params.origin)
        _unique(params.objects, 'label', distinct_labels=False)
        _unique(params.tokens, distinct_labels=False)
        for obj in params.objects:
            if obj.x + obj.width > params.width or obj.y + obj.height > params.height:
                raise ValueError('Objects must fit the visible board')
            if obj.shape in {'rect', 'circle', 'triangle'} and (obj.width == 0 or obj.height == 0):
                raise ValueError('Shapes must have positive dimensions')
            if obj.shape == 'line' and obj.width == obj.height == 0:
                raise ValueError('A visible line must have length')
            if obj.value is not None:
                value = _number(obj.value)
                if params.mode == 'clock':
                    if value.denominator != 1 or not 0 <= value < 720:
                        raise ValueError('Given clock must use minutes from 0 to 719')
                elif params.mode == 'angle':
                    if not 0 <= value <= 180:
                        raise ValueError('Given protractor angle must lie from 0 to 180 degrees')
                elif value <= 0:
                    raise ValueError('Visual measurement values must be positive')
        if params.mode in {'balance', 'vessel'} and not any(obj.value is not None for obj in params.objects):
            raise ValueError('Mass and capacity controls require actual measurement objects')
        if params.mode == 'equation' and len(params.tokens) < 2:
            raise ValueError('Equation assembly requires available number or symbol tokens')
        if not manual:
            points = _validate_marks(params, answer.expectedMarks)
            if not points and not answer.expectedText:
                raise ValueError('Workspace goal requires an action or a written construction')
            if answer.expectedText is not None:
                _safe(answer.expectedText)
            if answer.mathRule:
                if subject != 'math':
                    raise ValueError('Arithmetic workspace rules require Math')
                result = validate_math_rule(answer.mathRule)
                if answer.expectedText is not None:
                    _validate_expression_result(answer.expectedText, result)
                if params.mode in {'ruler', 'number_line', 'balance', 'vessel'} and points:
                    value = (_number(params.origin) + Fraction(int(points[0][0])) * _number(params.step)
                             if len(points) == 1 else Fraction(abs(int(points[-1][0]) - int(points[0][0]))) * _number(params.step))
                    if value != result:
                        raise ValueError('Selected measure must agree with the arithmetic result')
                if params.mode == 'angle' and points and points[0][0] != result:
                    raise ValueError('Selected angle must agree with its degree measure')
    elif component == 'sort_connect':
        _unique(params.pieces)
        _unique(params.targets, 'label')
        if not manual:
            _validate_placements(params, answer.placements)
            if len({placement.targetId for placement in answer.placements}) < 2:
                raise ValueError('Automatic sorting must distinguish at least two target relationships')
    elif component == 'text_editor':
        if (params.minLength > params.maxLength or len(params.initialText) > params.maxLength
                or params.maxLength < 2 * params.minWords - 1):
            raise ValueError('Writing bounds must be reachable')
        if params.initialText:
            _safe(params.initialText)
        if params.mode == 'edit' and not params.initialText.strip():
            raise ValueError('Editing requires an original draft')
        if params.mode == 'assemble' and len(params.wordBank) < 2:
            raise ValueError('Text assembly requires word pieces')
        for word in params.wordBank:
            _safe(word)
        if not manual:
            if params.mode == 'compose':
                raise ValueError('Original writing needs parent review rather than one exact phrase')
            normalized = [_written(value) for value in answer.acceptedTexts]
            if len(set(normalized)) != len(normalized):
                raise ValueError('Writing keys must be distinct')
            for value in answer.acceptedTexts:
                _safe(value)
                if not params.minLength <= len(value.strip()) <= params.maxLength:
                    raise ValueError('Writing key must fit its response bounds')
                if word_count(value) < params.minWords:
                    raise ValueError('Writing key must meet the requested word count')
                if _written(value) == _written(params.initialText):
                    raise ValueError('Editing must change the initial draft')
    elif component == 'oral_studio':
        if not manual:
            raise ValueError('Actual speech needs parent review')
        _safe(params.passage)
        if params.listenText is not None:
            _safe(params.listenText)
        if params.mode == 'listen_respond' and params.listenText is None:
            raise ValueError('Listening requires an audible source text')
    elif component == 'drawing_studio':
        if not manual:
            raise ValueError('Actual drawings need parent review')
        _safe(params.backgroundPrompt)
        for label in params.labels:
            _safe(label)
    else:
        raise ValueError('Unknown family control')
    return scene


def _validate_visual(visual):
    _safe(visual.title)
    if visual.author is not None:
        _safe(visual.author)
    if visual.caption is not None:
        _safe(visual.caption)
    _unique(visual.items, 'label', distinct_labels=False)
    if any(item.x + item.width > 100 or item.y + item.height > 100 for item in visual.items):
        raise ValueError('Visual pieces must fit their scene')
    for item in visual.items:
        if item.kind == 'line':
            if item.width == item.height == 0:
                raise ValueError('A visible diagram line needs length')
        elif item.width == 0 or item.height == 0:
            raise ValueError('Visual objects need positive dimensions')
    if visual.kind == 'coins' and not any(item.kind in {'penny', 'nickel', 'dime', 'quarter'} for item in visual.items):
        raise ValueError('A coin visual must contain recognizable coin faces')
    if visual.kind == 'solid_shapes' and not any(item.kind in {'cube', 'sphere', 'cone', 'cylinder'} for item in visual.items):
        raise ValueError('A solid-shape visual must show a solid')
    if visual.kind == 'chart':
        kinds = {item.kind for item in visual.items}
        if not ('line' in kinds and 'text' in kinds and kinds.intersection({'rect', 'circle'})):
            raise ValueError('A chart visual requires real axes, labels and data marks')


def _validate_placements(params, placements):
    piece_ids = {piece.id for piece in params.pieces}
    target_ids = {target.id for target in params.targets}
    if (len(placements) != len(piece_ids) or {item.pieceId for item in placements} != piece_ids
            or any(item.targetId not in target_ids for item in placements)):
        raise ValueError('Place every offered piece exactly once into an offered target')
    return {item.pieceId: item.targetId for item in placements}


def task_key(scene):
    """Fingerprints actual starting content, not arbitrary scene IDs or settings."""
    component = scene.component
    params = scene.params
    if component == 'quantity_lab':
        content = [component, params.stock, params.unitValue, params.taskOperation, params.initialCounts,
                   len(params.containers), scene.answer.mathRule.model_dump() if scene.answer.assessment == 'automatic' else scene.prompt]
    elif component == 'math_workspace':
        content = [component, params.mode, params.width, params.height, params.step, params.origin,
                   [(o.shape, o.x, o.y, o.width, o.height, o.label) for o in params.objects],
                   sorted(t.text for t in params.tokens), scene.prompt]
    elif component == 'sort_connect':
        content = [component, sorted(p.text for p in params.pieces), sorted(t.label for t in params.targets),
                   params.visual.model_dump() if params.visual else None]
    elif component == 'text_editor':
        content = [component, params.mode, params.initialText, sorted(params.wordBank), params.context, scene.prompt]
    elif component == 'oral_studio':
        content = [component, params.mode, params.passage, params.listenText]
    elif component == 'drawing_studio':
        content = [component, params.backgroundPrompt, params.labels, scene.prompt]
    else:
        content = [component, scene.prompt, getattr(params, 'context', None)]
    return ('family', hashlib.sha256(json.dumps(content, ensure_ascii=False, sort_keys=True).encode()).hexdigest())


def answer_texts(scene):
    if scene.answer.assessment == 'parent_review':
        return []
    if scene.component == 'text_editor':
        return scene.answer.acceptedTexts
    if scene.component == 'math_workspace' and scene.answer.expectedText:
        return [scene.answer.expectedText]
    return []


def validate_activity(spec, allowed_components=None):
    from . import toolkit
    guided = spec.scenes[:-1]
    if not any(scene.component in COMPONENTS | toolkit.MEANINGFUL_COMPONENTS for scene in guided):
        raise ValueError('Activity must teach through a meaningful child action')
    if allowed_components is not None:
        for scene in spec.scenes:
            if scene.component in COMPONENTS and scene.component not in allowed_components:
                raise ValueError('Family mechanic is incompatible with the catalog demonstration')
    final = spec.scenes[-1]
    if final.component in COMPONENTS:
        key = task_key(final)
        if any(scene.component in COMPONENTS and task_key(scene) == key for scene in guided):
            raise ValueError('Independent family challenge requires fresh content')
        if final.component == 'text_editor' and final.params.mode == 'edit':
            for scene in guided:
                if scene.component == 'text_editor' and _written(scene.params.initialText) == _written(final.params.initialText):
                    raise ValueError('Independent editing needs a fresh original draft')
        if final.component == 'text_editor' and final.answer.assessment == 'automatic':
            final_answers = {_written(text) for text in final.answer.acceptedTexts}
            for scene in guided:
                if (scene.component == 'text_editor' and scene.answer.assessment == 'automatic'
                        and final_answers.intersection(_written(text) for text in scene.answer.acceptedTexts)):
                    raise ValueError('Independent editing must not copy a rehearsed written answer')
    return spec


def validate_coverage(spec, entry):
    """Apply inspectable catalog requirements to actual rendered parameters.

    These constraints supplement independent semantic review; a parent rubric
    cannot substitute for a missing microphone, passage, illustration or board.
    They apply to selection too, without changing immutable history parsing.
    """
    constraints = entry.get('constraints', {})
    final = spec.scenes[-1]
    required_response = constraints.get('requiredResponse')
    component_for_response = {'oral': 'oral_studio', 'drawing': 'drawing_studio', 'writing': 'text_editor'}
    if required_response and final.component != component_for_response[required_response]:
        raise ValueError('Catalog demonstration requires its actual response modality')
    if entry.get('assessment') == 'parent_review' and getattr(final.answer, 'assessment', None) != 'parent_review':
        raise ValueError('This catalog demonstration requires an honest parent review')
    required_words = constraints.get('minWrittenWords', 0)
    if required_words and (final.component != 'text_editor' or final.params.minWords < required_words):
        raise ValueError('Catalog writing demonstration requires the stated word count')
    required_guided = set(constraints.get('requiredGuidedMechanics', []))
    guided = spec.scenes[:-1]
    if required_guided and not required_guided.intersection(scene.component for scene in guided):
        raise ValueError('Catalog demonstration requires its specified guided mechanic')
    modes = set(constraints.get('workspaceModes', []))
    if modes and any(scene.component == 'math_workspace' and scene.params.mode not in modes for scene in spec.scenes):
        raise ValueError('Workspace mode does not demonstrate this catalog objective')
    visual_kind = constraints.get('requiredVisual')
    if visual_kind:
        if not any(_has_visual(scene, visual_kind) for scene in guided):
            raise ValueError('Catalog demonstration requires actual visual material in teaching')
        # Producing a new geometric drawing removes the worked visual cue. Other
        # visual-reading tasks still need their original independent material.
        if not (visual_kind == 'geometry' and final.component == 'drawing_studio') and not _has_visual(final, visual_kind):
            raise ValueError('Independent visual task requires its actual visual material')
    requirements = set(entry.get('requirements', []))
    if 'target_word_not_read_to_child' in requirements:
        if (final.component != 'oral_studio' or final.params.mode not in {'read_aloud', 'perform'}
                or final.params.listenText is not None):
            raise ValueError('Independent decoding requires print without reading its answer aloud')
    if 'audible_word_or_sound_material' in requirements:
        if (final.component != 'oral_studio' or not final.params.listenText
                or final.params.mode not in {'say_sounds', 'listen_respond', 'perform'}):
            raise ValueError('Sound awareness requires an actual audible word or sound source')
    return spec


def _has_visual(scene, required):
    visual = getattr(scene.params, 'visual', None)
    if required == 'geometry':
        if scene.component == 'math_workspace' and scene.params.mode in {'grid', 'shape', 'angle'}:
            return True
        return visual is not None and (visual.kind == 'solid_shapes' or any(item.kind in {'rect', 'circle', 'triangle', 'line', 'cube', 'sphere', 'cone', 'cylinder'} for item in visual.items))
    if required == 'chart':
        return ((scene.component == 'math_workspace' and scene.params.mode == 'chart' and bool(scene.params.objects))
                or (visual is not None and visual.kind == 'chart'))
    return visual is not None and visual.kind == required


def grade_response(scene, response):
    """Return exact readable actions and bool, or None for a real parent review."""
    from .models import QuantityResponse, WorkspaceResponse, SortResponse, WrittenResponse, OralResponse, DrawingResponse
    params, answer = scene.params, scene.answer
    manual = answer.assessment == 'parent_review'
    component = scene.component
    if component == 'quantity_lab':
        if not isinstance(response, QuantityResponse):
            raise ValueError('Move pieces into the offered containers')
        ids = [container.id for container in params.containers]
        if len(response.allocations) != len(ids) or {item.containerId for item in response.allocations} != set(ids):
            raise ValueError('Save one allocation for every offered container')
        counts_by_id = {item.containerId: item.count for item in response.allocations}
        counts = [counts_by_id[identifier] for identifier in ids]
        if sum(counts) > params.stock:
            raise ValueError('Cannot allocate more pieces than are available')
        if counts == params.initialCounts:
            raise ValueError('Move at least one piece to demonstrate the goal')
        labels = [f'{container.label}: {count}' for container, count in zip(params.containers, counts)]
        text = '; '.join([*labels, f'{params.stock - sum(counts)} loose'])
        return text, None if manual else counts == answer.expectedCounts
    if component == 'math_workspace':
        if not isinstance(response, WorkspaceResponse):
            raise ValueError('Build or mark the offered board')
        points = _validate_marks(params, response.marks)
        if not points and not response.text.strip():
            raise ValueError('Change the board or construct a response')
        text = response.text.strip()
        mark_text = ', '.join(f'({x:g}, {y:g})' for x, y in points)
        readable = '\n'.join(value for value in [text, f'Marks: {mark_text}' if points else ''] if value)
        if manual:
            return readable, None
        expected_points = _validate_marks(params, answer.expectedMarks)
        correct = sorted(points) == sorted(expected_points)
        if answer.expectedText is not None:
            correct = correct and _workspace_text_correct(params, answer, text)
        elif text:
            correct = False
        return readable, correct
    if component == 'sort_connect':
        if not isinstance(response, SortResponse):
            raise ValueError('Place or connect each offered piece')
        actual = _validate_placements(params, response.placements)
        pieces = {piece.id: piece.text for piece in params.pieces}
        targets = {target.id: target.label for target in params.targets}
        readable = '; '.join(f'{pieces[piece.id]} → {targets[actual[piece.id]]}' for piece in params.pieces)
        return readable, None if manual else actual == _validate_placements(params, answer.placements)
    if component == 'text_editor':
        if not isinstance(response, WrittenResponse):
            raise ValueError('Write or edit your response')
        text = response.writtenText
        if not params.minLength <= len(text.strip()) <= params.maxLength:
            raise ValueError('Write a response within the requested length')
        if word_count(text) < params.minWords:
            raise ValueError('Write enough words to demonstrate the requested writing goal')
        if params.mode == 'edit' and _written(text) == _written(params.initialText):
            raise ValueError('Edit the draft before saving')
        return text, None if manual else _written(text) in {_written(value) for value in answer.acceptedTexts}
    if component == 'oral_studio':
        if not isinstance(response, OralResponse):
            raise ValueError('Record your voice for this step')
        # The service separately checks ownership, actual media and scene binding.
        return 'Voice recording saved for parent review.', None
    if component == 'drawing_studio':
        if not isinstance(response, DrawingResponse):
            raise ValueError('Draw your response on the board')
        if sum(len(stroke) for stroke in response.strokes) > 2000:
            raise ValueError('Drawing contains too many points')
        if not any(sum(math.dist((a.x, a.y), (b.x, b.y)) for a, b in zip(stroke, stroke[1:])) >= 1
                   for stroke in response.strokes):
            raise ValueError('Draw a visible stroke before saving')
        return f'Drawing saved: {len(response.strokes)} strokes.', None
    raise ValueError('Unknown family response')
