"""Bounded, deterministic rules for splitting the same fraction into finer parts."""
import re
from fractions import Fraction


EQUIVALENT_SUBSKILLS = frozenset({
    '3.NF.A.3-1', '3.NF.A.3-2', '4.NF.A.1-1', '4.NF.A.1-2',
})
_FRACTION = re.compile(r'(?<![\w/+\-])([0-9]{1,2})\s*/\s*([1-9][0-9]?)(?![\w/])')
_DENOMINATOR_WORDS = {
    2: ('halves', 'seconds'), 3: ('thirds',), 4: ('fourths', 'quarters'),
    5: ('fifths',), 6: ('sixths',), 7: ('sevenths',), 8: ('eighths',),
    9: ('ninths',), 10: ('tenths',), 11: ('elevenths',), 12: ('twelfths',),
    16: ('sixteenths',), 18: ('eighteenths',), 20: ('twentieths',),
    24: ('twenty-fourths', 'twenty fourths'), 30: ('thirtieths',),
    36: ('thirty-sixths', 'thirty sixths'), 48: ('forty-eighths', 'forty eighths'),
}


def _field(value, name, default=None):
    return value.get(name, default) if isinstance(value, dict) else getattr(value, name, default)


def is_equivalent_target(target):
    identifier = target if isinstance(target, str) else _field(target, 'subskill_id', _field(target, 'subskillId'))
    return isinstance(identifier, str) and identifier in EQUIVALENT_SUBSKILLS


def has_split_scene(spec):
    return any(_field(scene, 'component') == 'fraction_split_compare'
               and _field(scene, 'phase') == 'guided'
               for scene in _field(spec, 'scenes', []))


def split_fraction(params, factor):
    """Return the unreduced fraction produced by an allowed equal subdivision."""
    numerator, denominator = _field(params, 'numerator'), _field(params, 'denominator')
    choices = _field(params, 'splitFactors', [])
    if (type(factor) is not int or factor not in choices or not 2 <= factor <= 6
            or type(numerator) is not int or type(denominator) is not int
            or not 0 < numerator < denominator or not 2 <= denominator <= 12
            or denominator * factor > 48):
        raise ValueError('Choose an allowed equal split')
    return f'{numerator * factor}/{denominator * factor}'


def validate_fraction_form(answer):
    numerator, denominator = _field(answer, 'sourceNumerator'), _field(answer, 'sourceDenominator')
    target = _field(answer, 'targetDenominator')
    if (type(numerator) is not int or type(denominator) is not int or type(target) is not int
            or not 0 < numerator < denominator or not 2 <= denominator <= 12
            or not denominator < target <= 48 or target % denominator
            or not 2 <= target // denominator <= 6):
        raise ValueError('Equivalent fraction requires a bounded equal subdivision')
    expected = f'{numerator * (target // denominator)}/{target}'
    value = _field(answer, 'value', '')
    if not isinstance(value, str) or re.sub(r'\s+', '', value) != expected or _field(answer, 'acceptedAnswers', []):
        raise ValueError('Equivalent fraction answer must retain the requested denominator')
    return expected


def fraction_form_response_correct(answer, response):
    """A mathematically equivalent decimal/simplified fraction is not the requested form."""
    validate_fraction_form(answer)
    if not isinstance(response, str):
        return False
    match = re.fullmatch(r'\s*\+?([0-9]{1,3})\s*/\s*([1-9][0-9]{0,2})\s*', response)
    if not match:
        return False
    numerator, denominator = (int(value) for value in match.groups())
    target = _field(answer, 'targetDenominator')
    return denominator == target and Fraction(numerator, denominator) == Fraction(
        _field(answer, 'sourceNumerator'), _field(answer, 'sourceDenominator'))


def _text(value):
    if isinstance(value, dict):
        return ' '.join(_text(item) for item in value.values())
    if isinstance(value, (list, tuple)):
        return ' '.join(_text(item) for item in value)
    if hasattr(value, 'model_dump'):
        return _text(value.model_dump())
    return value if isinstance(value, str) else ''


def validate_equivalent_activity(spec):
    """Selection/generation policy; old saved sessions can still parse old question cards."""
    if not is_equivalent_target(spec):
        if has_split_scene(spec) or any(_field(_field(scene, 'answer'), 'comparison') == 'fraction_form'
                                        for scene in _field(spec, 'scenes', [])):
            raise ValueError('Split and compare is scoped to equivalent fractions')
        return spec
    if _field(spec, 'subject') != 'math' or not has_split_scene(spec):
        raise ValueError('Equivalent-fractions activities require a guided split-and-compare scene')
    scenes = _field(spec, 'scenes', [])
    final = scenes[-1]
    answer = _field(final, 'answer')
    if (_field(spec, 'schemaVersion') == '1.2' and _field(spec, 'subskillId') == '4.NF.A.1-2'
            and _field(final, 'component') in {'text_editor', 'oral_studio'}
            and _field(final, 'phase') == 'independent'
            and _field(answer, 'assessment') == 'parent_review' and _field(answer, 'rubric')):
        return spec
    if (_field(final, 'component') != 'independent_response'
            or _field(final, 'phase') != 'independent'
            or _field(answer, 'comparison') != 'fraction_form'):
        raise ValueError('Equivalent fractions finish with an independent requested fraction form')
    validate_fraction_form(answer)
    source = (_field(answer, 'sourceNumerator'), _field(answer, 'sourceDenominator'))
    target = _field(answer, 'targetDenominator')
    expected_pair = (source[0] * (target // source[1]), target)
    prompt = _field(final, 'prompt', '')
    if _field(_field(final, 'params'), 'context') is not None:
        raise ValueError('Independent equivalent fraction has no teaching context or hints')
    task_text = prompt
    fractions = [(int(match[0]), int(match[1])) for match in _FRACTION.findall(task_text)]
    if source not in fractions:
        raise ValueError('Independent prompt must state its source fraction')
    if not (re.search(rf'(?<![\w/]){target}(?!\w)', task_text)
            or re.search(rf'(?:\?|_{{1,5}})\s*/\s*{target}\b', task_text)
            or any(re.search(rf'\b{re.escape(word)}\b', task_text, re.I) for word in _DENOMINATOR_WORDS.get(target, ()))):
        raise ValueError('Independent prompt must name the requested denominator')
    if expected_pair in fractions:
        raise ValueError('Independent prompt must not reveal its target fraction')
    independent_amount = Fraction(*source)
    guided_text = _field(spec, 'title', '') + ' ' + ' '.join(_text(scene) for scene in scenes[:-1])
    if any(Fraction(int(numerator), int(denominator)) == independent_amount
           for numerator, denominator in _FRACTION.findall(guided_text)):
        raise ValueError('Independent fraction amount must be fresh relative to guided content')
    for scene in scenes[:-1]:
        if _field(scene, 'component') == 'fraction_split_compare':
            params = _field(scene, 'params')
            if Fraction(_field(params, 'numerator'), _field(params, 'denominator')) == independent_amount:
                raise ValueError('Independent fraction amount must differ from the visual')
    return spec
