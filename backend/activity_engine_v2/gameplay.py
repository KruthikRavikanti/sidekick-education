"""Exact-definition gameplay checks and a manifest of the actual stage renderer.

This module describes/validates rendering. All checkpoint consequences are
computed by ExecutionCore; it contains no second rule interpreter.
"""
from __future__ import annotations

import hashlib
import json
from collections import deque
from typing import Annotated, Literal

from pydantic import Field, ValidationError

from .core import ExecutionCore, ProgramInvalid
from .game_design import WORLD_OPERATIONS, structural_signature
from .models import Closed, ShortText
from .registry import component_contracts

RENDER_MANIFEST_VERSION = 'sidekick-world-render-v1'


class GameplayReview(Closed):
    definitionHash: Annotated[str, Field(pattern=r'^[a-f0-9]{64}$')]
    renderManifestHash: Annotated[str, Field(pattern=r'^[a-f0-9]{64}$')]
    approved: bool
    meaningfulChoices: bool
    understandableConsequences: bool
    recoveryPossible: bool
    targetNecessary: bool
    briefGoalClear: bool
    finishAchievable: bool
    finishSatisfying: bool
    mainStagePlayable: bool
    structuralVariety: bool
    renderedAffordancesSuitable: bool
    reasonCode: Literal['approved', 'bare_teaching_tool', 'decorative_world', 'weak_choices',
        'unclear_consequences', 'no_recovery', 'target_detached', 'goal_unclear',
        'finish_unsatisfying', 'repetitive_structure', 'rendered_affordances_unsuitable',
        'missing_world_consequences']
    summary: ShortText


def canonical_hash(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()).hexdigest()


def _world_only_probe(core):
    """Bounded counterfactual through the SAME core, never a reachability claim."""
    queue = deque([(core.initial, 0)])
    seen = {canonical_hash(core.initial)}
    transitions = 0
    while queue and transitions < 256 and len(seen) <= 64:
        state, count = queue.popleft()
        for action in core.p.actions:
            if action.operation not in WORLD_OPERATIONS:
                continue
            parameter = action.inputs[0]
            for value in parameter.options or []:
                if transitions >= 256:
                    break
                transitions += 1
                try:
                    result = core.transition(state, action.id, {parameter.id: value}, action_count=count)
                except ProgramInvalid:
                    continue
                if result.completed:
                    raise ProgramInvalid('world_only_completion_bypasses_concept', 'completion')
                key = canonical_hash(result.state)
                if key not in seen and len(seen) < 64:
                    seen.add(key); queue.append((result.state, result.action_count))
    return dict(statesChecked=len(seen), transitionsChecked=transitions,
                exhaustedDeclaredWorldOnlySearch=not queue,
                completedWithoutConcept=False,
                limit='64 distinct states and 256 attempted world transitions; not general solvability proof')


def render_manifest(program):
    """Bounded actual initial/final/intermediate stage projections for review."""
    if program.presentation.stage is None:
        raise ProgramInvalid('playable_stage_required', 'presentation.stage')
    core = ExecutionCore(program)
    if not any(action.operation in WORLD_OPERATIONS for action in program.actions):
        raise ProgramInvalid('world_decisions_required', 'actions')
    concept_objects = {obj.id for obj in program.world.objects if obj.kind not in {'stage_piece', 'stage_map', 'progress'}}
    represented = {entity.representationObjectId for entity in program.presentation.stage.entities
                   if entity.representationObjectId is not None}
    represented.update(surface.objectId for surface in program.presentation.stage.surfaces)
    if not represented.intersection(concept_objects):
        raise ProgramInvalid('concept_representation_required', 'presentation.stage.entities')
    counterfactual = _world_only_probe(core)
    state = core.initial
    initial = core.stage_view(state)
    def representation_views(current, projection):
        visible_representations = {item.get('representationObjectId') for item in projection.get('entities', [])}
        visible_representations.update(item.get('objectId') for item in projection.get('surfaces', []))
        result = []
        for obj in program.world.objects:
            if obj.id not in represented or obj.id not in visible_representations:
                continue
            material = [core.materials[ref].model_dump() for ref in obj.materialIds]
            result.append(dict(objectId=obj.id, kind=obj.kind,
                boundValues={port: current[ref] for port, ref in obj.bindings.items()},
                materials=material))
        return result
    initial_representations = representation_views(state, initial)
    snapshots = []
    used_world_action = False
    prior = canonical_hash(dict(stage=initial, representations=initial_representations))
    trace = program.witness or []
    indices = set(range(len(trace))) if len(trace) <= 8 else (
        {round(index * (len(trace) - 1) / 5) for index in range(6)} | {len(trace) - 2, len(trace) - 1})
    for count, step in enumerate(trace):
        transition = core.transition(state, step.actionId, step.inputs, action_count=count)
        used_world_action = used_world_action or core.actions[step.actionId].operation in WORLD_OPERATIONS
        state = transition.state
        if count not in indices:
            continue
        projection = core.stage_view(state)
        representations = representation_views(state, projection)
        current = canonical_hash(dict(stage=projection, representations=representations))
        if current != prior:
            snapshots.append(dict(afterOperation=core.actions[step.actionId].operation,
                                  missionComplete=transition.completed, stage=projection, representations=representations))
        prior = current
    if not snapshots:
        raise ProgramInvalid('visible_world_consequences_required', 'presentation.stage')
    if not used_world_action:
        raise ProgramInvalid('finish_trace_missing_world_decision', 'witness')
    if not any(not item['missionComplete'] for item in snapshots):
        raise ProgramInvalid('precompletion_world_consequence_required', 'presentation.stage')
    # Preserve initial/final plus a bounded representative spread, not every
    # animation frame or every repeated piece placement in a witness.
    if len(snapshots) > 8:
        indices = sorted({round(index * (len(snapshots) - 1) / 7) for index in range(8)})
        snapshots = [snapshots[index] for index in indices]
    operations = {action.operation for action in program.actions}
    result = dict(version=RENDER_MANIFEST_VERSION,
        renderer=dict(mainSurface='A spatial world stage with actionable locations/entities/connections',
            tools='Contextual existing controls attached to stage entities; not the universal main layout',
            representation='Actual bound fraction/grid/evidence/text state is resolved on visible stage entities',
            consequences='Server-derived from authoritative post-action state, with zero rule cascades',
            accessibility='Keyboard and touch buttons, responsive scrolling/layout and reduced-motion support',
            mobileGeometry=dict(stageHeightPx=410, topInsetPx=118, sideInsetPx=45, bottomInsetPx=77,
                                actorIllustrationPx=48, locationWidthPx=80, locationMinimumHeightPx=62),
            desktopGeometry=dict(stageHeightPx=500, topInsetPx=120, sideInsetPx=52, bottomInsetPx=78,
                                 locationWidthPx=92, contextualSidebarMinimumViewportPx=1050),
            gestures='Native keyboard/click selection and location targets; drag for movable entities',
            animation='Accepted world movement animates left/top; reduced motion disables animation',
            scope='Render-contract and computed-state evidence, not actual child testing or a screenshot-based enjoyment claim'),
        layout=program.presentation.stage.model_dump(), initialStage=initial, initialRepresentations=initial_representations,
        authoritativeCheckpoints=snapshots,
        counterfactual=counterfactual,
        actualOperations={name: value for name, value in component_contracts().items() if name in operations},
        actualStructure=structural_signature(program))
    if program.presentation.stage.surfaces:
        def geometry(projection):
            surfaces = projection.get('surfaces', [])
            mounts = any(surface.get('locationId') for surface in surfaces)
            # Public construction targets render a readonly path footprint even
            # while the corresponding source surface/object remains hidden.
            has_surface = bool(surfaces) or any(connection.get('construction') for connection in projection.get('connections', []))
            paths = {surface['connectionId'] for surface in surfaces if surface.get('connectionId')}
            paths.update(connection['id'] for connection in projection.get('connections', []) if connection.get('construction'))
            location_count = sum(bool(surface.get('locationId')) for surface in surfaces)
            extra_mobile = max(0,len(paths)-1)*400 + (location_count*160 if len(paths)>1 else 0)
            extra_desktop = max(0,len(paths)-1)*220 + (location_count*80 if len(paths)>1 else 0)
            return dict(mobileStageHeightPx=(580 if mounts else 500 if has_surface else 410)+extra_mobile,
                        tabletStageHeightPx=(580 if mounts else 500 if has_surface else 440)+extra_mobile,
                        desktopStageHeightPx=(620 if mounts else 550 if has_surface else 500)+extra_desktop)
        initial_geometry = geometry(initial)
        result['renderer']['mobileGeometry']['stageHeightPx'] = initial_geometry['mobileStageHeightPx']
        result['renderer']['desktopGeometry']['stageHeightPx'] = initial_geometry['desktopStageHeightPx']
        result['initialGeometry'] = initial_geometry
        for checkpoint in result['authoritativeCheckpoints']:
            checkpoint['geometry'] = geometry(checkpoint['stage'])
        result['renderer']['representation'] = 'Actual bound concept objects appear on visible entities and physical stage surfaces; sources are not copies or correctness badges'
        result['renderer']['physicalSurfaces'] = dict(
            anchors='Bounded clear-lane placement prefers declared route midpoint/location anchors, then avoids full artifact and native control bounds. A relocated path runs through the actual target footprint entry/exit ports; location mounts retain an anchor connector.',
            grid='Actual source cell IDs, selection and row/column coordinates; declared subset may form the actual route planks',
            fraction='Complete same-whole strip, fixed base columns and current denominator rows; never a selected-piece subset',
            artifacts='Actual saved text, literal selected evidence or bound expression',
            directActions='Existing server-checked toggle_tile/toggle_fraction_piece with the same source object and input; readonly when no direct action or cells are too small',
            minimumDirectCellPx=24, fractionWholePx=dict(width=164,height=112),
            conditionalCanvasHeights=dict(
                mobileMaximumViewportPx=520,desktopMinimumViewportPx=1050,
                noVisibleSurfaces=dict(mobile=410,tablet=440,desktop=500),
                visiblePathSurfaces=dict(mobile=500,tablet=500,desktop=550),
                anyVisibleLocationMount=dict(mobile=580,tablet=580,desktop=620),
                perAdditionalDistinctPath=dict(mobile=400,tablet=400,desktop=220),
                perVisibleLocationWhenMultiplePaths=dict(mobile=160,tablet=160,desktop=80),
                pathCounting='Distinct connection IDs from visible surfaces and all public construction targets, including hidden-source target-only frames'),
            placement='Preferred anchors plus bounded five-column lanes in 24px vertical steps; overlap with native entity/location safety bounds and prior full artifacts outweighs distance. Bounds include actual/target geometry and headers/feedback.',
            visibility='Display follows server-derived surface.visibleWhen and a bound visible presentation space for mutable sources; current tool availability controls editing separately. Display can persist readonly after travel; immutable references can be visible independently.',
            limitation='A rendered source-to-route relationship, not an additional physics or client-side scoring engine')
        if any(connection.construction is not None for connection in program.presentation.stage.connections):
            result['renderer']['physicalSurfaces']['constructionMounts'] = dict(
                target='Dashed target unit squares share exact row/column coordinates and one cell scale with the actual full source grid; a wrong footprint occupies visibly different positions',
                unitScale='Fixed across reshapes using public source maximum bounds and target dimensions: min(44px,224px/columns,176px/rows). Hidden source bounds are not inferred.',
                directCellMinimumPx=24,
                feedback='Authoritative dimensionsMatch/complete/fits distinguish wrong dimensions, matching but incomplete coverage, and a fully covered fitting construction',
                route='ExecutionCore requires declared connection.when AND exact target rows/columns AND every current source cell covered; no stored success flag',
                assessment='Route fit is a world affordance; learning assessment still references actual construction and child-authored expression/artifact',
                layout='Collision-resolved clear lane, with actual/target union and asymmetric 40px heading/64px footer bounds. SVG route runs source to target entry, across its physical footprint, then from opposite exit to destination; port orientation follows dominant endpoint axis.')
    return result


def require_gameplay_review(program, digest, review, manifest=None):
    """No model call: recheck exact approved definition and render contract."""
    if program.presentation.stage is None:
        raise ProgramInvalid('playable_stage_required', 'presentation.stage')
    if canonical_hash(program.model_dump()) != digest:
        raise ProgramInvalid('gameplay_definition_hash_mismatch', 'gameplay_review')
    actual_manifest = render_manifest(program)
    if manifest is not None and canonical_hash(manifest) != canonical_hash(actual_manifest):
        raise ProgramInvalid('render_manifest_integrity_failed', 'gameplay_review')
    try:
        result = GameplayReview.model_validate(review.model_dump(warnings=False) if isinstance(review, GameplayReview) else review)
    except (ValidationError, ValueError, TypeError):
        raise ProgramInvalid('gameplay_review_invalid', 'gameplay_review') from None
    if result.definitionHash != digest or result.renderManifestHash != canonical_hash(actual_manifest):
        raise ProgramInvalid('gameplay_review_hash_mismatch', 'gameplay_review')
    flags = ('meaningfulChoices', 'understandableConsequences', 'recoveryPossible', 'targetNecessary',
             'briefGoalClear', 'finishAchievable', 'finishSatisfying', 'mainStagePlayable',
             'structuralVariety', 'renderedAffordancesSuitable')
    if not result.approved or result.reasonCode != 'approved' or not all(getattr(result, name) for name in flags):
        raise ProgramInvalid(result.reasonCode if result.reasonCode != 'approved' else 'gameplay_review_rejected', 'gameplay_review')
    return result
