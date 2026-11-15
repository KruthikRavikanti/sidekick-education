"""Runtime activity routing uses the reviewed per-subskill catalog coverage map.

There is no keyword gate here. A new family assignment is an inspectable data
change, and the same demonstration constraints gate generation and every reuse.
"""
from . import coverage, equivalent


def coverage_for(target):
    """Return the exact catalog demonstration and assessment plan, if mapped."""
    return coverage.for_subskill(target)


def mechanics_for(target):
    entry = coverage_for(target)
    return tuple(entry['mechanics']) if entry else ()


def validate_activity(spec, target):
    """A compatible action must demonstrate the mapped goal, including its mode."""
    from . import families, toolkit

    entry = coverage_for(target)
    if not entry:
        raise ValueError('No suitable activity mechanic for this catalog objective')
    allowed = set(entry['mechanics'])
    guided = [scene for scene in spec.scenes if scene.phase == 'guided']
    required = set(entry['constraints']['requiredGuidedMechanics'])
    if not any(scene.component in required & coverage.MEANINGFUL_COMPONENTS for scene in guided):
        raise ValueError('Activity must use a compatible guided action for this catalog demonstration')
    for scene in spec.scenes:
        if scene.component in coverage.COMPONENTS and scene.component not in allowed:
            raise ValueError('Control is not compatible with this catalog demonstration')
    if equivalent.is_equivalent_target(target):
        equivalent.validate_equivalent_activity(spec)
    if spec.schemaVersion == '1.2':
        families.validate_activity(spec, allowed_components=allowed)
    else:
        toolkit.validate_activity(spec, allowed_components=allowed)
    # Parent-scored speech, real handwriting, source/visual material, and
    # writing requirements cannot be replaced by an automatically scored card.
    families.validate_coverage(spec, entry)
    return spec
