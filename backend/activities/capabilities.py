"""Conservative curriculum-to-control capabilities, independent of activity settings.

These are objective families, not one flow or template per catalog subskill.
An unsupported family stays unavailable rather than receiving a question-card quiz.
"""
import re

from . import equivalent


def mechanics_for(target):
    """Return controls that can demonstrate this catalog objective as implemented."""
    sid = target.get('subskill_id', target.get('subskillId', ''))
    if equivalent.is_equivalent_target(target):
        return ('fraction_split_compare',)
    # The two original activities have existing, deterministically checked tools.
    if sid == '3.NF.A.1-2':
        return ('fraction_builder', 'number_line')
    if sid == 'L.3.1-2':
        return ('word_tiles', 'word_choice')
    subject = str(target.get('subject', '')).casefold()
    skill = str(target.get('skill', '')).casefold()
    objective = str(target.get('subskill', '')).casefold()
    text = skill + ' ' + objective
    result = []
    if subject == 'math':
        # This concrete control currently exchanges ten ONES for one TEN, not
        # hundreds, multi-digit arithmetic, ratios, or arbitrary equal groups.
        if (re.search(r'\b(?:tens and ones in two-digit|10 ones as one ten|ten ones as one ten)\b', text)
                and not re.search(r'\b(?:hundred|thousand|multiply|divide|add|subtract)\b', objective)):
            result.append('bundle_builder')
        if (re.search(r'\b(?:order|sort|compare)\b', objective)
                and re.search(r'\b(?:numbers|fractions|decimals|integers)\b', objective)):
            result.append('tile_order')
    elif subject in {'ela', 'reading/ela'}:
        # Writing a whole narrative/essay, fluent oral reading and listening
        # cannot be demonstrated by this small on-screen toolkit.
        if sid.startswith(('W.', 'SL.', 'RF.')):
            return ()
        if re.search(r'\b(?:retell|summarize|write|writing|speaking|compose|create|perform|read aloud)\b', objective):
            return ()
        if (re.search(r'\b(?:sequence|sequenced|sequencing|beginning|ending|order)\b', text)
                and re.search(r'\b(?:events|story|stories|steps|procedure|sentence|sentences|action)\b', text)):
            result.append('tile_order')
        if (re.search(r'\b(?:refer(?:ring)?|explicit(?:ly)?|evidence|inference|infer)\b|\b(?:details?|reasons?)\b.*\b(?:support|prove)\b', objective)
                and re.search(r'\b(?:text|passage|story|stories|article|author|read|reading|main idea)\b', text)):
            result.append('evidence_board')
    return tuple(result)


def validate_activity(spec, target):
    """Apply the same interaction/objective gate to generation and every reuse."""
    from . import toolkit
    from .models import SUPPORTED

    allowed = mechanics_for(target)
    if not allowed:
        raise ValueError('No suitable activity mechanic for this objective')
    if equivalent.is_equivalent_target(target):
        equivalent.validate_equivalent_activity(spec)
    elif spec.subskillId in SUPPORTED and spec.schemaVersion == '1.0':
        # Its math/word keys remain deterministic. Word choices alone are no
        # substitute for constructing the word in a meaningful guided scene.
        toolkit.validate_activity(spec)
    else:
        toolkit.validate_activity(spec, allowed_components=set(allowed))
        for scene in spec.scenes:
            if scene.component in toolkit.COMPONENTS and scene.component not in allowed:
                raise ValueError('Control is not compatible with the learning objective')
    return spec
