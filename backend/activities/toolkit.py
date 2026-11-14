"""Finite playable controls with server-owned goals and private scoring keys.

No generated expression is evaluated. React implements each control's fixed state
transition; a model supplies its original setting and bounded content. Semantic
story/evidence alignment is additionally checked by the independent model review.
"""
import hashlib
import json
import re


COMPONENTS = frozenset({'bundle_builder', 'tile_order', 'evidence_board'})
MEANINGFUL_COMPONENTS = COMPONENTS | {'fraction_split_compare', 'fraction_builder', 'number_line', 'word_tiles'}
_REFERENCED_MATERIAL = re.compile(
    r'\b(passage|story|article|text|diagram|table|graph|chart|picture|image)\s+(?:above|below|provided|shown)\b'
    r'|\b(?:from|in|using|use|read|see|based on|refer to)\s+(?:the|this)\s+'
    r'(passage|story|article|text|diagram|table|graph|chart|picture|image)\b', re.I,
)


def _field(value, name, default=None):
    return value.get(name, default) if isinstance(value, dict) else getattr(value, name, default)


def _items(params, name):
    return _field(params, name, [])


def _safe_items(items):
    from .models import _safe_generated_text, normalize_text
    ids = [_field(item, 'id') for item in items]
    labels = [_field(item, 'text') for item in items]
    if len(set(ids)) != len(ids) or len({normalize_text(text) for text in labels}) != len(labels):
        raise ValueError('Control pieces require unique IDs and distinct text')
    for text in labels:
        _safe_generated_text(text)
    return ids


def validate_scene(scene, subject):
    """Validate achievable goals before a scene can be stored or graded."""
    from .models import _safe_generated_text, numeric_answer
    component, params, answer = scene.component, scene.params, scene.answer
    if component not in COMPONENTS:
        raise ValueError('Unknown toolkit control')
    if params.context is None:
        # A control can carry its own passage or story panels. Bundles and
        # numeric tiles cannot silently stand in for an absent passage/diagram.
        available_material = ({'passage', 'story', 'article', 'text'} if component == 'evidence_board'
                              else {'story', 'text'} if component == 'tile_order' and params.ordering in {'story', 'sentence'}
                              else set())
        references = {word.casefold() for pair in _REFERENCED_MATERIAL.findall(scene.prompt) for word in pair if word}
        if references - available_material:
            raise ValueError('Activity task refers to missing context')
    _safe_generated_text(params.goal)
    if scene.phase == 'guided':
        if params.teachingText is None:
            raise ValueError('Guided controls require teaching text')
        _safe_generated_text(params.teachingText)
    elif params.teachingText is not None:
        raise ValueError('Independent controls must remove teaching cues')
    if component == 'bundle_builder':
        if subject != 'math':
            raise ValueError('Bundling is a Math control')
        _safe_generated_text(params.itemLabel)
        _safe_generated_text(params.groupLabel)
        if answer.bundles != params.total // params.groupSize:
            raise ValueError('Bundling goal must conserve all objects into full groups')
    elif component == 'tile_order':
        ids = _safe_items(params.tiles)
        if len(answer.order) != len(ids) or len(set(answer.order)) != len(ids) or set(answer.order) != set(ids):
            raise ValueError('Ordering key must use every offered tile exactly once')
        if answer.order == ids:
            raise ValueError('Tiles must be scrambled rather than display the solution')
        if params.ordering in {'ascending', 'descending'}:
            if subject != 'math':
                raise ValueError('Numeric ordering is a Math control')
            values = {tile.id: numeric_answer(tile.text) for tile in params.tiles}
            if len(set(values.values())) != len(values):
                raise ValueError('Numeric tiles require distinct values and an unambiguous order')
            expected = sorted(ids, key=values.__getitem__, reverse=params.ordering == 'descending')
            if answer.order != expected:
                raise ValueError('Ordering key must match the requested numeric order')
        elif subject != 'ela':
            raise ValueError('Story and sentence ordering are ELA controls')
    else:
        if subject != 'ela':
            raise ValueError('Passage evidence is an ELA control')
        ids = _safe_items(params.sentences)
        _safe_generated_text(params.boardLabel)
        _safe_generated_text(answer.explanation)
        if answer.sentenceId not in ids:
            raise ValueError('Evidence key must identify an offered passage sentence')
    return scene


def task_key(scene):
    """Local content fingerprint; never send private student work to the model."""
    from .models import normalize_text
    component, params = _field(scene, 'component'), _field(scene, 'params')
    if component == 'bundle_builder':
        content = [component, _field(params, 'total'), _field(params, 'groupSize')]
    elif component in {'tile_order', 'evidence_board'}:
        pieces = _items(params, 'tiles' if component == 'tile_order' else 'sentences')
        # A shuffle, new IDs, or paraphrased instruction does not make new content.
        content = [component, sorted(normalize_text(_field(piece, 'text')) for piece in pieces)]
    else:
        content = [component, normalize_text(_field(scene, 'prompt', '')), normalize_text(_field(params, 'context') or '')]
    return ('toolkit', hashlib.sha256(json.dumps(content, ensure_ascii=False, sort_keys=True).encode()).hexdigest())


def answer_texts(scene):
    """Private readable keys used only by local answer-disclosure checks."""
    if scene.component == 'bundle_builder':
        return [str(scene.answer.bundles)]
    if scene.component == 'tile_order':
        labels = {tile.id: tile.text for tile in scene.params.tiles}
        ordered = [labels[identifier] for identifier in scene.answer.order]
        return [' '.join(ordered), ' → '.join(ordered)]
    if scene.component == 'evidence_board':
        return [next(sentence.text for sentence in scene.params.sentences if sentence.id == scene.answer.sentenceId)]
    return []


def validate_fresh_challenge(spec):
    """A fresh final challenge cannot simply replay guided objects or passage."""
    final = spec.scenes[-1]
    if final.component not in COMPONENTS:
        return spec
    key = task_key(final)
    if any(task_key(scene) == key for scene in spec.scenes[:-1]):
        raise ValueError('Independent control must use fresh content')
    if final.component in {'tile_order', 'evidence_board'}:
        name = 'tiles' if final.component == 'tile_order' else 'sentences'
        from .models import normalize_text
        independent_text = {normalize_text(item.text) for item in getattr(final.params, name)}
        for guided in spec.scenes[:-1]:
            if guided.component == final.component:
                guided_text = {normalize_text(item.text) for item in getattr(guided.params, name)}
                if independent_text <= guided_text:
                    raise ValueError('Independent control must not reuse guided content')
        if final.component == 'evidence_board':
            chosen = normalize_text(answer_texts(final)[0])
            for guided in spec.scenes[:-1]:
                public_content = ' '.join((guided.prompt, guided.params.model_dump_json(),
                                           guided.feedback.correct, guided.feedback.incorrect, guided.feedback.hint))
                if chosen in normalize_text(public_content):
                    raise ValueError('Independent evidence must not reuse the guided supporting sentence')
    return spec


def validate_activity(spec, allowed_components=None):
    """Selection policy: stored question cards may parse, but cannot win new starts."""
    guided = [scene for scene in spec.scenes if scene.phase == 'guided']
    if not any(scene.component in MEANINGFUL_COMPONENTS for scene in guided):
        raise ValueError('Activity requires a meaningful guided interaction')
    if allowed_components is not None:
        allowed = set(allowed_components)
        for scene in spec.scenes:
            if scene.component in COMPONENTS and scene.component not in allowed:
                raise ValueError('Control is not compatible with this learning objective')
    for scene in spec.scenes:
        if scene.component in COMPONENTS:
            validate_scene(scene, spec.subject)
    return validate_fresh_challenge(spec)


def grade_response(scene, response):
    """Grade bounded control state; return readable, exact child actions for history."""
    from .models import BundleResponse, OrderResponse, EvidenceResponse
    if scene.component == 'bundle_builder':
        if not isinstance(response, BundleResponse) or response.bundles > scene.params.total // scene.params.groupSize:
            raise ValueError('Choose a reachable number of full bundles')
        loose = scene.params.total - response.bundles * scene.params.groupSize
        return f'{response.bundles} groups of {scene.params.groupSize}, {loose} loose', response.bundles == scene.answer.bundles
    if scene.component == 'tile_order':
        ids = {tile.id for tile in scene.params.tiles}
        if (not isinstance(response, OrderResponse) or len(response.order) != len(ids)
                or len(set(response.order)) != len(ids) or set(response.order) != ids):
            raise ValueError('Arrange every offered tile exactly once')
        labels = {tile.id: tile.text for tile in scene.params.tiles}
        return ' → '.join(labels[identifier] for identifier in response.order), response.order == scene.answer.order
    if scene.component == 'evidence_board':
        labels = {sentence.id: sentence.text for sentence in scene.params.sentences}
        if not isinstance(response, EvidenceResponse) or response.sentenceId not in labels:
            raise ValueError('Place a sentence from this passage on the board')
        return labels[response.sentenceId], response.sentenceId == scene.answer.sentenceId
    raise ValueError('Unknown toolkit control')
