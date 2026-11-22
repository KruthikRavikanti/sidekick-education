"""Bounded live composition, authoring compilation and hash-bound admission.

No finished-program library or fixture loader is read here. Provider calls use
the existing configured transport; only approved data reaches the owned runtime.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
import inspect
import re
import time
import uuid
from typing import Annotated, Literal

from pydantic import Field, ValidationError

from backend.accounts.security import AccountError
from backend.gap.vision import DATA_POLICY, SAFE_STAGE_MODEL_CODES, activity_schema_diagnostic, structured_call
from backend.provider import ExtractionError, VisionSettings
from .authoring import ActivityAuthoring, PROMPT_VERSION, compile_authoring
from .composer_prompt import COMPOSE_INSTRUCTION, REVIEW_INSTRUCTION
from .core import ExecutionCore, ProgramInvalid
from .models import ActivityProgram, Closed, ShortText
from .preview import validate_runtime_compatibility
from .registry import OBJECT_PORTS, PREVIEW_OPERATIONS, component_contracts
from .validator import validate_program
from .game_design import GameDesignBatch, GameDesignReview, evaluate_designs, select_reviewed_design, structural_signature
from .gameplay import GameplayReview, canonical_hash, render_manifest, require_gameplay_review
from .gameplay_prompt import DESIGN_INSTRUCTION, DESIGN_REVIEW_INSTRUCTION, WORLD_AUTHORING_INSTRUCTION, GAMEPLAY_REVIEW_INSTRUCTION

MAX_CANDIDATES = 3
MAX_MODEL_CALLS = 6
TOTAL_BUDGET_SECONDS = 360
MAX_DESIGN_BRIEF_LENGTH = 2000
GAME_MAX_CANDIDATES = 3
GAME_MAX_MODEL_CALLS = 8
GAME_TOTAL_BUDGET_SECONDS = 480
GAME_OUTPUT_LIMITS = {
    'design_activity_game': 9000, 'repair_activity_game_design': 9000,
    'review_activity_game_design': 3500,
    'compose_activity_game': 18000, 'repair_activity_game': 18000,
    'review_activity_program': 2000, 'review_activity_gameplay': 2500,
}


class SemanticReview(Closed):
    definitionHash: Annotated[str, Field(pattern=r'^[a-f0-9]{64}$')]
    approved: bool
    targetNecessary: bool
    meaningfulConsequences: bool
    materialsSuitable: bool
    goalAchievable: bool
    helpRelevant: bool
    scoringCorrectAcrossRoutes: bool
    shortcutsPrevented: bool
    parentAssessmentAppropriate: bool
    requiresParentReview: bool
    reasonCode: Literal['approved', 'target_not_necessary', 'decorative_interaction',
        'missing_or_unsuitable_materials', 'unreachable_goal', 'irrelevant_help',
        'invalid_scoring', 'shortcut_bypasses_skill', 'parent_review_required', 'unsupported_concept']
    summary: ShortText


class CompositionFailure(ValueError):
    """Safe stage/code only; candidate bodies never become public diagnostics."""
    def __init__(self, stage, code, path=''):
        self.stage, self.code, self.path = stage, code, path
        self.requested_model = None
        self.returned_models = []
        self.model_calls = []
        self.call_count = 0
        self.diagnostic_events = []
        # Ephemeral generated-definition feedback for the next repair only.
        # It is never part of public errors, persisted diagnostic events or logs.
        self._review_feedback = None
        self.game_design = None
        self.design_evaluations = []
        self.semantic_review = None
        self.gameplay_review = None
        self.render_manifest = None
        super().__init__(code)


@dataclass(frozen=True)
class ApprovedProgram:
    program: ActivityProgram
    definition_hash: str
    requested_model: str
    returned_models: list[str]
    review: SemanticReview
    call_count: int
    model_calls: list[dict]
    diagnostic_events: list[dict] = field(default_factory=list)
    game_design: dict | None = None
    design_evaluations: list[dict] = field(default_factory=list)
    gameplay_review: GameplayReview | None = None
    structural_fingerprint: dict | None = None
    render_manifest: dict | None = None


class ConfiguredComposerAdapter:
    def __init__(self, settings=None):
        self.settings = settings or VisionSettings.from_env()
        self.model = self.settings.model
        self.metadata = []

    async def call(self, response_model, task, system, data):
        metadata = {'task': task}
        self.metadata.append(metadata)
        started = time.monotonic()
        options = {'max_output_tokens': GAME_OUTPUT_LIMITS[task]} if task in GAME_OUTPUT_LIMITS else {}
        try:
            return await structured_call(response_model, task=task, system=DATA_POLICY + system,
                                         user=data, settings=self.settings, metadata=metadata, **options)
        finally:
            metadata['elapsedMs'] = round((time.monotonic() - started) * 1000)


def capabilities():
    return dict(
        operations={name: value for name, value in component_contracts().items() if name in PREVIEW_OPERATIONS},
        objectPorts={name: ports for name, ports in OBJECT_PORTS.items()
                     if name in {'grid', 'equation', 'evidence_board', 'text_artifact', 'progress', 'fraction_strip', 'stage_piece', 'stage_map'}},
        unavailableOperations=sorted(set(component_contracts()) - PREVIEW_OPERATIONS),
        rendererConstraints=dict(onePrimaryObjectPerOperation=True, otherComponentsOneObjectOfEachKind=True,
            oneActionOfEachOperationPerComponent=True, maxBoardCells=120,
            gridWorkspace=dict(
                stock='For EACH grid, the number of selected cells cannot exceed its own unit_tiles material.quantity; the core rejects tile_stock_exceeded. A bounded cells.maxItems may further restrict that grid.',
                reversible='Lifting a selected tile removes it from that grid and frees one unit of its stock; placement/lifting use the same toggle_tile action.',
                sharedStockAcrossGrids=False,
                resizing='Rows/columns change without painting cells. Lift cells outside a proposed smaller footprint before resizing; out-of-bounds constructions reject atomically.',
                assessment='Actual covered unit squares and exact child-authored multiplication can be assessed against dimensions/area; no world arrival establishes math success.'),
            fractionWorkspace=dict(immutableReferenceStrips=1, mutableWorkingStrips=1,
                recommendedInitialWorkingPiecesEmpty=True, matchingWholeIdAndWidth=True,
                denominatorMinimum=2, denominatorMaximum=24, denominatorMultipleOfWidth=True,
                fixedBaseColumnsMinimum=1, fixedBaseColumnsMaximum=12,
                pieceIds='p0 through p23; only indices below current denominator are visible',
                pieceIndex='column * (denominator / width) + row',
                repartitionPreservesExactSpatialShading=True, mixedCellRepartitionRejected=True,
                comparison='fraction_equal compares trusted counts by cross-multiplication on the same whole',
                visibleAffordances=['Direct placement/removal and movement of shaded pieces',
                    'Partition buttons show common-integer refinement factors when applicable',
                    'Both numerator/denominator count readouts update with the actual visible divisions',
                    'For a constructed equal amount under integer refinement, linked numerator-times-factor and denominator-times-factor equations explain the displayed counts; no answer is filled into an empty construction',
                    'Equal-sized whole geometry and aligned covered-area comparison remain visible'],
                assessableEvidence=['Child-created shaded construction',
                    'Child-requested common-integer refinement of an already constructed amount',
                    'Server-verified unchanged shaded region with numerator and denominator scaled together'],
                unsupportedClaims=['Unaided arithmetic recall', 'Unobserved verbal explanation', 'Mastery']),
            worldStage=dict(maxLocations=12, maxEntities=12, maxConnections=24, maxTools=12, maxReactions=24,
                locations='Percent-coordinate locations with capacities and accepted entity kinds',
                entities='Movable typed pieces/actors or fixed objects, with real representationObjectId bindings',
                connections='Derived open/blocked routes from current authoritative concept predicates',
                constructionMount=dict(sourceKind='grid',field='connection.construction={objectId,rows,columns}',
                    rowsMinimum=1,columnsMinimum=1,rowsMaximum=12,columnsMaximum=12,maxArea=120,
                    gate='Declared connection.when AND exact actual rows/columns matching target AND every current grid cell covered. Derived from the actual source, not a stored correct flag.',
                    sourceBounds='Target dimensions must fit the source grid maximum rows/columns.',
                    surface='The same source grid must have a full-object surface anchored on that connection, layout object and cellIds [].',
                    visibleAffordance='A dashed target-unit footprint and actual source cells share the same fixed unit-cell scale; wrong dimensions and incomplete coverage are visibly distinct. Collision-resolved clear lanes and adaptive canvas height keep mounts apart; the displayed route runs through the actual target entry/exit ports. Direct cells need at least 24px, otherwise contextual tools remain.',
                    limitation='A rectangular footprint/coverage construction, not arbitrary packing, path finding or fraction/beam physics.'),
                inspectionState='Every stage_map inspected id_set options contains ALL declared stage location IDs exactly once, with maxItems equal to their count; initial may be empty. Individual inspect actions/guards may offer only relevant locations.',
                tools='Every non-world_stage component attaches to one or more actionable entities; a compound component may attach to different entities, never duplicate component/entity pairs. world_stage controls render natively and are forbidden here. A represented concept object must be bound by a component attached to that entity.',
                surfaces=dict(maximum=8, sourceKinds=['grid','fraction_strip','equation','evidence_board','text_artifact'],
                    anchor='Exactly one declared locationId or connectionId; source objectId is separate',
                    geometry='Actual grid cells can form row/column planks on a connection; whole objects can mount at a location. Geometry is presentation, not an invented physics simulation.',
                    gridSubset='Distinct actual source cellIds, at most 24 per declared subset; [] uses the actual current grid',
                    fractions='Always the complete same-whole strip with layout object and cellIds []; no extracted-piece subset or row/column flattening',
                    directActions='Optional existing toggle_tile or toggle_fraction_piece for this same mutable source; same ExecutionCore action and guards. Small geometry stays readonly with contextual tools.',
                    visibility='Display follows surface.visibleWhen plus a bound visible presentation space for mutable sources; editing independently requires current tool availability. Discovered construction can remain visible readonly after travel. Immutable references need no tool. Put discovery hiding explicitly in surface.visibleWhen.',
                    layouts=['object','row','column']),
                reactions='Post-action derived statuses/messages; no stored correctness flags or rule cascades',
                automaticAssessment=False,
                assets=['dot','person','cart','boat','parcel','lens','bridge','gate','home','tree','lamp','book','clue','flag','flower','gear'])),
    )


def admit_authoring(authored, context, model):
    """Computational admission before review; no missing-witness loophole."""
    if not (authored.get('witness') if isinstance(authored, dict) else getattr(authored, 'witness', None)):
        raise CompositionFailure('witness', 'verified_finish_required')
    try:
        program = compile_authoring(authored, context, model=model)
    except ProgramInvalid as error:
        raise CompositionFailure('schema', error.code, error.path) from None
    except ValidationError as error:
        raise _authoring_schema_failure(error) from None
    except (ValueError, KeyError, TypeError):
        raise CompositionFailure('schema', 'authoring_invalid') from None
    if any(action.operation not in PREVIEW_OPERATIONS for action in program.actions):
        raise CompositionFailure('capability', 'runtime_adapter_unavailable')
    report = validate_program(program, check_witness=True)
    if not report.valid:
        issue = report.issues[0]
        raise CompositionFailure('witness' if report.computational == 'failed' else 'schema', issue.code, issue.path)
    if (not program.witness or report.computational != 'witness_verified'
            or report.witnessSteps < 1):
        raise CompositionFailure('witness', 'verified_finish_required')
    try:
        validate_runtime_compatibility(program)
    except AccountError as error:
        raise CompositionFailure('capability', error.code) from None
    core = ExecutionCore(program)
    state, count, used = core.initial, 0, set()
    for step in program.witness:
        result = core.transition(state, step.actionId, step.inputs, action_count=count)
        state, count = result.state, result.action_count
        used.add(step.actionId)
    for evidence in program.evidence:
        if evidence.assessment.kind == 'automatic':
            # A known-correct initial key or a finish with a false assessment
            # cannot establish a new automatic demonstration.
            if core.evaluate(evidence.assessment.when, core.initial, {}):
                raise CompositionFailure('scoring', 'assessment_initially_satisfied')
            if set(evidence.actionIds).intersection(used) and not core.evaluate(evidence.assessment.when, state, {}):
                raise CompositionFailure('scoring', 'finish_assessment_inconsistent')
    return program, report.definitionSha256


async def _progress(callback, stage):
    if callback:
        pending = callback(stage)
        if inspect.isawaitable(pending):
            await pending


def _model_name(value):
    return value if isinstance(value, str) and re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:/@+\-]{0,99}', value) else 'configured-model'


def _design_brief(value):
    """Optional curated development direction, never browser/learner evidence."""
    if value is None:
        return None
    if (type(value) is not str or not 1 <= len(value) <= MAX_DESIGN_BRIEF_LENGTH or not value.strip()
            or re.search(r'<\s*(?:/\s*)?[A-Za-z][^<>]*>|javascript\s*:|data\s*:\s*text/html', value, re.I)
            or re.search(r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|https?://|file://|/Users/|/home/', value, re.I)):
        raise CompositionFailure('context', 'design_brief_invalid')
    return value.strip()


def repair_guidance(code, path=''):
    """Static code-owned advice; no interpolation of private validation input."""
    if code == 'invalid_tile_material':
        return 'For every unit_tiles material, text MUST be null, items MUST be [], and quantity MUST be an integer from 1 to 120. Put narrative instructions in a separate prompt material (nonempty text, items [], quantity null). Do not relabel one as the other.'
    if code == 'invalid_goal_reference':
        return ('A goal.when AND an automatic evidence.assessment.when predicate must not reference any goal, including itself, at any nesting depth. Inline concrete state comparisons or contains/all/any/not predicates inside each goal and automatic assessment. '
                'Only completion, help, rules or space visibility may reference declared goal IDs; every such ID must exist in goals. Completion.goalIds must exactly match its goal references.')
    if code in {'authoring_invalid', 'activity_schema_invalid'}:
        return 'Follow the exact closed authoring union branch for each material: unit_tiles requires null text, empty items and integer quantity; prompt requires nonempty text, empty items and null quantity; passage requires nonempty text, at least two literal sentence items and null quantity. Inside goal.when AND automatic assessment.when use only inline concrete state predicates, never goal references at any depth.'
    if code == 'grid_tile_material_required':
        return 'Each grid object must reference exactly one unit_tiles material by its materialIds. That material has null text, empty items and positive integer quantity; attach a separate prompt for instructions.'
    if code == 'witness_action_budget_exceeded':
        return 'Set limits.maxActions to 100 and ensure it is at least the number of individual witness steps. This budget counts every tile placement, not the number of action definitions. Keep the mission and witness short.'
    if code == 'fraction_piece_domain_invalid':
        return 'For EACH fraction_strip, read the maximum of its bound denominator slot. Its pieces slot options must be EXACTLY p0 through p(maximum-1), in order, and maxItems must EQUAL that denominator maximum. This applies to immutable references as well as mutable or initially empty working strips. The initial selected pieces are only a subset of this full declared domain; do not shrink the options or maxItems to the current numerator, initial denominator or selected-piece count.'
    if code in {'stage_tool_binding_invalid', 'stage_tools_must_be_contextual'}:
        return 'stage.tools must reference existing non-world_stage components and existing entities. Attach EVERY non-world_stage component at least once. NEVER attach world_stage components: their native movement, placement and inspection controls render automatically. The same component may attach to different entities, but a componentId/entityId pair must not repeat.'
    if code == 'stage_tool_component_unknown':
        return 'The indicated stage.tools.componentId must exactly match an existing non-world_stage component ID in components; do not use an object ID, action ID or invented component.'
    if code == 'stage_tool_world_component_forbidden':
        return 'Remove the world_stage attachment from stage.tools. Native movement, placement and inspection controls render automatically on the stage. Only non-world_stage contextual concept components belong in stage.tools; each such component must be attached at least once.'
    if code == 'stage_tool_entity_unknown':
        return 'The indicated stage.tools.entityId must exactly match an entity ID declared in presentation.stage.entities, not an object, component or location ID.'
    if code == 'stage_tool_attachment_duplicate':
        return 'Remove the repeated componentId/entityId pair from stage.tools. A component may attach to multiple different entities, but the identical pair must appear only once.'
    if code == 'stage_representation_not_bound_to_tool':
        return 'The indicated entity representationObjectId must point to an ACTUAL concept object in objectIds of at least one non-world_stage component attached to that same entity. Keep entity.objectId for the movable stage_piece separate from representationObjectId for the actual construction. A compound component may attach to multiple different entities representing its different bound objects.'
    if code == 'stage_entity_requires_one_placement':
        return 'Each StageEntity must declare EXACTLY one placement: either objectId for a movable stage_piece with a bound location state, OR locationId for a fixed location. The other field must be null. A representationObjectId is separate concept content and does not count as placement.'
    if code == 'stage_actor_requires_object':
        return 'An actor must be movable: set objectId to its actual stage_piece and locationId to null. For a fixed constructed structure or contextual tool use kind device with locationId, not an actor without movement state.'
    if code == 'stage_destination_requires_location':
        return 'A destination is fixed: set locationId to a declared stage location and objectId to null. Movable objects or devices use their own stage_piece instead of a destination entity.'
    if code == 'stage_inspection_domain_incomplete':
        return 'For EVERY stage_map, its bound inspected id_set options MUST contain ALL declared stage location IDs exactly once, and maxItems MUST equal the total number of declared locations. Initial can be []. Do not shrink the stored domain to currently inspectable places; an inspect action choice list or rule guard may restrict where inspection is offered.'
    if code == 'stage_surface_requires_one_anchor':
        return 'Each stage surface must have EXACTLY one anchor: locationId for a whole/object mounted at a location, OR connectionId for an actual construction along a declared route. Set the unused field to null. Its objectId names the actual concept object, separate from either anchor.'
    if code in {'stage_surface_object_unknown', 'stage_surface_object_unsupported'}:
        return 'A stage surface objectId must name an existing actual grid, fraction_strip, equation, evidence_board or text_artifact. It must not name an entity, location, stage_piece or invented rendered object.'
    if code in {'stage_surface_location_unknown', 'stage_surface_connection_unknown'}:
        return 'Use exactly one declared stage anchor: locationId must resolve in stage.locations OR connectionId must resolve in stage.connections. Set the other field to null; neither anchor is a concept object ID.'
    if code == 'stage_surface_mutable_requires_tool':
        return 'A mutable surface object must also be bound by a non-world_stage contextual component attached through stage.tools. Display uses surface.visibleWhen and a bound visible presentation space; current tool availability controls editing separately. A discovered construction can persist readonly after travel, without remote editing. Put discovery hiding explicitly in surface.visibleWhen. Immutable reference surfaces may be visible without a tool.'
    if code in {'stage_surface_cells_outside_object', 'stage_surface_direct_cell_budget_exceeded'}:
        return 'Only a grid surface can select cellIds, using distinct existing IDs from the actual bound grid cells domain. A direct surface exposes at most 24 declared cells; use a small meaningful subset or a small grid. Never copy a second board or silently change a source cell identity.'
    if code in {'stage_surface_subset_requires_grid', 'stage_surface_fraction_whole_layout_required'}:
        return 'A fraction_strip surface MUST display its whole with layout object and cellIds []. Fraction pieces must never be extracted into a row/column subset or given a different whole. Only actual grid cells support a selected subset and row/column layout.'
    if code in {'stage_surface_action_unknown', 'stage_surface_action_unsupported', 'stage_surface_action_wrong_object', 'stage_surface_readonly_action_forbidden'}:
        return 'For an interactive grid surface, actionId must be an existing toggle_tile action writing THIS object cells slot. For an interactive fraction surface it must be toggle_fraction_piece writing THIS object pieces slot. All other kinds and immutable references use actionId null. Direct surfaces reuse the same action, component, guards and ExecutionCore; they do not define a new operation.'
    if code in {'stage_construction_object_unknown', 'stage_construction_requires_grid'}:
        return 'connection.construction.objectId must name an existing actual grid object. This mount checks a rectangular unit-square footprint; fractions, evidence, stage_piece and invented objects are unsupported here.'
    if code in {'stage_construction_area_budget_exceeded', 'stage_construction_outside_source_bounds'}:
        return 'A construction mount target has integer rows/columns from 1 to 12, area at most 120, and each dimension within its source grid maximum bounds. The source needs enough unit_tiles stock to cover that achievable target; resizing alone does not paint cells.'
    if code == 'stage_construction_whole_surface_required':
        return 'The construction connection MUST have a stage surface on that SAME connectionId with the SAME source objectId, layout object and cellIds []. Display the full actual source footprint against the target mount; do not flatten it or use an unrelated/partial-cell surface. when is an additional guard; exact dimensions plus full coverage are derived automatically.'
    return 'Correct the identified declared-contract constraint, preserving the learning goal. Produce a fully valid new candidate and finish witness; no rule or assessment is normalized by the server.'


def _authoring_schema_failure(error):
    diagnostic = activity_schema_diagnostic(error, ActivityAuthoring)
    code = diagnostic['code'] if diagnostic['code'] in SAFE_STAGE_MODEL_CODES else 'authoring_invalid'
    return CompositionFailure('schema', code, diagnostic.get('field') or '')


def _provider_authoring_code(error):
    code = (error.diagnostic or {}).get('code')
    return code if error.code == 'activity_schema_invalid' and code in SAFE_STAGE_MODEL_CODES else error.code


def validate_review(program, digest, review):
    """One semantic approval gate for composition and the trusted start boundary."""
    try:
        result = SemanticReview.model_validate(review.model_dump(warnings=False) if isinstance(review, SemanticReview) else review)
    except (ValidationError, ValueError, TypeError):
        raise CompositionFailure('review', 'review_response_invalid') from None
    if result.definitionHash != digest:
        raise CompositionFailure('review', 'review_hash_mismatch')
    checks = ('targetNecessary', 'meaningfulConsequences', 'materialsSuitable', 'goalAchievable',
              'helpRelevant', 'scoringCorrectAcrossRoutes', 'shortcutsPrevented', 'parentAssessmentAppropriate')
    actual_parent = any(item.assessment.kind == 'parent_review' for item in program.evidence)
    if (not result.approved or result.reasonCode != 'approved'
            or not all(getattr(result, name) for name in checks)
            or result.requiresParentReview != actual_parent):
        error = CompositionFailure('review', result.reasonCode if result.reasonCode != 'approved' else 'semantic_review_rejected')
        error._review_feedback = result.model_dump(warnings=False)
        raise error
    return result


def validate_gameplay_review(program, digest, review, manifest=None):
    """Shared exact-hash stage approval gate for composition and owned start."""
    try:
        return require_gameplay_review(program, digest, review, manifest)
    except ProgramInvalid as error:
        raise CompositionFailure('gameplay_review', error.code, error.path) from None


async def compose(context, *, adapter=None, progress=None, budget_seconds=TOTAL_BUDGET_SECONDS, design_brief=None):
    """Compose at most three candidates/six calls inside one total deadline.

    ``context`` is built only by trusted ownership-checked server code. It is
    not an accepted browser request body. ``design_brief`` is optional curated
    server-only development direction, separate from the learner's evidence and
    subordinate to its exact targets and all admission gates. It has no HTTP
    input route. Test adapters implement ``call``.
    """
    design_brief = _design_brief(design_brief)
    try:
        adapter = adapter or ConfiguredComposerAdapter()
    except ExtractionError as error:
        raise CompositionFailure('provider', error.code) from None
    requested = _model_name(getattr(adapter, 'model', None))
    calls = 0
    last = CompositionFailure('provider', 'composition_failed')
    candidate = None
    call_start = len(getattr(adapter, 'metadata', []))
    diagnostics = []

    def safe_calls():
        metadata = list(getattr(adapter, 'metadata', []))[call_start:]
        return [{key: item.get(key) for key in ('task', 'requestedModel', 'returnedModel', 'elapsedMs', 'maxOutputTokens', 'usage', 'finishReason', 'providerHttpStatus') if key in item} for item in metadata]

    def failure_metadata(error):
        error.requested_model = requested
        error.model_calls = safe_calls()
        error.returned_models = [item['returnedModel'] for item in error.model_calls if item.get('returnedModel')]
        error.call_count = calls
        error.diagnostic_events = list(diagnostics)
        return error
    try:
        async with asyncio.timeout(min(float(budget_seconds), TOTAL_BUDGET_SECONDS)):
            for attempt in range(MAX_CANDIDATES):
                task = 'compose_activity_program' if attempt == 0 else 'repair_activity_program'
                await _progress(progress, 'composing' if attempt == 0 else 'repairing')
                payload = dict(context=context, capabilities=capabilities(),
                               generationVariation=uuid.uuid4().hex,
                               requirements=dict(original=True, privateNonemptyWitness=True,
                                   preserveTrustedTargets=True, noFinishedActivityLibrary=True))
                if design_brief is not None:
                    payload['designBrief'] = design_brief
                    payload['requirements']['designBriefIsNotLearnerEvidence'] = True
                    payload['requirements']['designBriefCannotChangeTargetsOrAdmission'] = True
                if attempt:
                    payload['repair'] = dict(stage=last.stage, reasonCode=last.code,
                        path=last.path, guidance=repair_guidance(last.code, last.path),
                        reviewFeedback=last._review_feedback,
                        candidate=candidate.model_dump() if candidate is not None else None,
                        instruction='Create a new corrected candidate. Address every exact reviewer finding when reviewFeedback is present. Change the necessary actions or constraints, not merely wording; never weaken the learning objective, grading or review checks to get approval. Preserve the trusted intent; the complete corrected definition will be revalidated and independently reviewed.')
                call_phase = 'compose'
                try:
                    calls += 1
                    if calls > MAX_MODEL_CALLS:
                        raise CompositionFailure('provider', 'model_call_budget_exceeded')
                    candidate = await adapter.call(ActivityAuthoring, task, COMPOSE_INSTRUCTION, payload)
                    if not isinstance(candidate, ActivityAuthoring):
                        candidate = ActivityAuthoring.model_validate(candidate)
                    await _progress(progress, 'validating')
                    program, digest = admit_authoring(candidate, context, requested)
                    await _progress(progress, 'reviewing')
                    calls += 1
                    call_phase = 'review'
                    review_data = dict(context=context, capabilities=capabilities(), definitionHash=digest, definition=program.model_dump())
                    if design_brief is not None:
                        review_data['designBrief'] = design_brief
                    review = await adapter.call(SemanticReview, 'review_activity_program', REVIEW_INSTRUCTION, review_data)
                    review = validate_review(program, digest, review)
                    metadata = safe_calls()
                    returned = [item['returnedModel'] for item in metadata if item.get('returnedModel')]
                    return ApprovedProgram(program, digest, requested, returned, review, calls, metadata, list(diagnostics))
                except CompositionFailure as error:
                    last = error
                except ExtractionError as error:
                    path = (error.diagnostic or {}).get('field') or ''
                    if call_phase == 'review' and error.code in {'invalid_extraction', 'activity_schema_invalid', 'activity_provider_invalid'}:
                        last = CompositionFailure('review', 'review_response_invalid', path)
                    else:
                        last = CompositionFailure('schema' if error.code == 'activity_schema_invalid' else 'provider', _provider_authoring_code(error), path)
                    if call_phase != 'review':
                        candidate = None
                except ValidationError as error:
                    last = CompositionFailure('review', 'review_response_invalid') if call_phase == 'review' else _authoring_schema_failure(error)
                    if call_phase != 'review':
                        candidate = None
                except (ValueError, KeyError, TypeError):
                    last = CompositionFailure('review', 'review_response_invalid') if call_phase == 'review' else CompositionFailure('schema', 'authoring_invalid')
                    if call_phase != 'review':
                        candidate = None
                diagnostic = dict(attempt=attempt + 1, stage=last.stage, code=last.code)
                if last.path:
                    diagnostic['path'] = last.path
                diagnostics.append(diagnostic)
            raise last
    except TimeoutError:
        diagnostics.append(dict(attempt=min(MAX_CANDIDATES, len(diagnostics) + 1), stage='provider', code='generation_deadline_exceeded'))
        raise failure_metadata(CompositionFailure('provider', 'generation_deadline_exceeded')) from None
    except CompositionFailure as error:
        raise failure_metadata(error) from None


async def compose_gameplay(context, *, adapter=None, progress=None,
                           budget_seconds=GAME_TOTAL_BUDGET_SECONDS, design_brief=None):
    """Plan five concepts, select deterministically, author and review one world.

    At most two planning calls and three authored candidates, with an absolute
    eight-call/480-second cap across design, authoring and both reviews. Legacy
    ``compose`` remains an explicit plain-V2 tool; normal generation uses this.
    """
    design_brief = _design_brief(design_brief)
    try:
        adapter = adapter or ConfiguredComposerAdapter()
    except ExtractionError as error:
        raise CompositionFailure('provider', error.code) from None
    requested = _model_name(getattr(adapter, 'model', None))
    calls, candidate, selected, evaluations, manifest = 0, None, None, [], None
    last_semantic_review, last_gameplay_review = None, None
    review_audit_semantic, review_audit_manifest = None, None
    call_start = len(getattr(adapter, 'metadata', []))
    diagnostics = []
    planning_evaluations = {}
    last = CompositionFailure('design', 'game_design_failed')

    def safe_calls():
        return [{key: item.get(key) for key in ('task', 'requestedModel', 'returnedModel', 'elapsedMs', 'maxOutputTokens', 'usage', 'finishReason', 'providerHttpStatus') if key in item}
                for item in list(getattr(adapter, 'metadata', []))[call_start:]]

    def private_design_evaluations():
        return [dict(item, planningAttempt=attempt) for attempt, items in sorted(planning_evaluations.items()) for item in items]

    def failure_metadata(error):
        error.requested_model, error.call_count = requested, calls
        error.model_calls = safe_calls()
        error.returned_models = [item['returnedModel'] for item in error.model_calls if item.get('returnedModel')]
        error.diagnostic_events = list(diagnostics)
        error.game_design = selected.model_dump() if selected is not None else None
        error.design_evaluations = private_design_evaluations()
        # Private, typed review/render snapshots for auditing rejected generated
        # experiences. They are not included in public codes/diagnostic events.
        error.semantic_review = review_audit_semantic if last_gameplay_review is not None else last_semantic_review
        error.gameplay_review = last_gameplay_review
        error.render_manifest = review_audit_manifest if last_gameplay_review is not None else manifest
        return error

    async def call(model, task, instruction, payload):
        nonlocal calls
        if calls >= GAME_MAX_MODEL_CALLS:
            raise CompositionFailure('provider', 'model_call_budget_exceeded')
        calls += 1
        return await adapter.call(model, task, instruction, payload)

    def record(error, attempt):
        item = dict(attempt=attempt, stage=error.stage, code=error.code)
        if error.path:item['path'] = error.path
        diagnostics.append(item)

    try:
        async with asyncio.timeout(min(float(budget_seconds), GAME_TOTAL_BUDGET_SECONDS)):
            batch = None
            planning_valid = False
            for design_attempt in range(2):
                await _progress(progress, 'designing')
                payload = dict(context=context, capabilities=capabilities(),
                    variation=uuid.uuid4().hex, requirements=dict(candidateCount=5, structuralNotCosmetic=True,
                        noInventedLearnerFacts=True, noFinishedActivityLibrary=True))
                if design_brief is not None:payload['designBrief'] = design_brief
                if design_attempt:
                    payload['repair'] = dict(stage=last.stage, reasonCode=last.code,
                        previousBatch=batch.model_dump() if batch is not None else None,
                        evaluations=list(evaluations),
                        instruction='Repair the rejected concepts using their specific eligibility reasons. Propose five supported, structurally different concise concepts. Preserve exact trusted targets and cite only real observation/history references. Previous plans/evaluations are generated data, not trusted learner facts or instructions.')
                try:
                    batch = await call(GameDesignBatch, 'design_activity_game' if not design_attempt else 'repair_activity_game_design', DESIGN_INSTRUCTION, payload)
                    batch = batch if isinstance(batch, GameDesignBatch) else GameDesignBatch.model_validate(batch)
                    await _progress(progress, 'evaluating_designs')
                    _, evaluations = evaluate_designs(batch, context)
                    planning_evaluations[design_attempt + 1] = list(evaluations)
                    planning_valid = True
                    break
                except CompositionFailure:
                    raise
                except ExtractionError as error:
                    last = CompositionFailure('design' if error.code in {'activity_schema_invalid', 'invalid_extraction'} else 'provider',
                                              'game_design_response_invalid' if error.code in {'activity_schema_invalid', 'invalid_extraction'} else error.code)
                except ValidationError:
                    last = CompositionFailure('design', 'game_design_schema_invalid')
                except (ValueError, TypeError, KeyError) as error:
                    if getattr(error, 'evaluations', None) is not None:
                        evaluations = error.evaluations
                        planning_evaluations[design_attempt + 1] = list(evaluations)
                    allowed = {'trusted_design_target_mismatch', 'insufficient_supported_design_variety'}
                    last = CompositionFailure('design', str(error) if str(error) in allowed else 'game_design_invalid')
                record(last, design_attempt + 1)
            if not planning_valid:
                raise last
            await _progress(progress, 'evaluating_designs')
            try:
                design_review = await call(GameDesignReview, 'review_activity_game_design', DESIGN_REVIEW_INSTRUCTION,
                    dict(context=context, capabilities=capabilities(), designBatch=batch.model_dump(),
                        designBatchHash=canonical_hash(batch.model_dump()), deterministicEligibility=evaluations,
                        recentStructures=context.get('previousSignatures', [])))
                selected, evaluations = select_reviewed_design(batch, evaluations, design_review)
                planning_evaluations[design_attempt + 1] = list(evaluations)
            except CompositionFailure:
                raise
            except ExtractionError as error:
                raise CompositionFailure('design_review', 'design_review_response_invalid' if error.code in {'invalid_extraction','activity_schema_invalid'} else error.code) from None
            except ValidationError:
                raise CompositionFailure('design_review', 'design_review_response_invalid') from None
            except (ValueError, TypeError, KeyError) as error:
                if getattr(error, 'evaluations', None) is not None:
                    evaluations = error.evaluations
                    planning_evaluations[design_attempt + 1] = list(evaluations)
                allowed = {'design_review_hash_mismatch','design_review_candidate_mismatch','no_approved_game_design'}
                raise CompositionFailure('design_review', str(error) if str(error) in allowed else 'design_review_invalid') from None

            for attempt in range(GAME_MAX_CANDIDATES):
                if GAME_MAX_MODEL_CALLS - calls < 3:
                    # Never spend an author call without enough room for both
                    # reviews. Retain the useful concrete failure from the last
                    # candidate instead of replacing it with a budget label.
                    break
                await _progress(progress, 'composing' if not attempt else 'repairing')
                payload = dict(context=context, capabilities=capabilities(), gameDesign=selected.model_dump(),
                    requirements=dict(selectedDesignId=selected.id, playableMainStage=True,
                        preserveTrustedTargets=True, privateNonemptyWitness=True, noFinishedActivityLibrary=True))
                if design_brief is not None:payload['designBrief'] = design_brief
                if attempt:
                    payload['repair'] = dict(stage=last.stage, reasonCode=last.code, path=last.path,
                        guidance=repair_guidance(last.code, last.path), reviewFeedback=last._review_feedback,
                        candidate=candidate.model_dump() if candidate is not None else None,
                        instruction='Repair the actual experience, not its name. Preserve the chosen learning intent/design; revalidation and both exact-hash reviews are required again.')
                phase = 'authoring'
                try:
                    candidate = await call(ActivityAuthoring, 'compose_activity_game' if not attempt else 'repair_activity_game',
                        COMPOSE_INSTRUCTION + WORLD_AUTHORING_INSTRUCTION, payload)
                    candidate = candidate if isinstance(candidate, ActivityAuthoring) else ActivityAuthoring.model_validate(candidate)
                    if candidate.selectedDesignId != selected.id:
                        raise CompositionFailure('design', 'selected_design_mismatch')
                    await _progress(progress, 'validating')
                    program, digest = admit_authoring(candidate, context, requested)
                    if program.presentation.stage is None:
                        raise CompositionFailure('gameplay_review', 'playable_stage_required')
                    actual_operations = {item.operation for item in program.actions}
                    if not set(selected.requiredCapabilities) <= actual_operations:
                        raise CompositionFailure('design', 'selected_design_capability_missing')
                    try:
                        manifest = render_manifest(program)
                    except ProgramInvalid as error:
                        raise CompositionFailure('gameplay_review', error.code, error.path) from None
                    common = dict(context=context, capabilities=capabilities(), gameDesign=selected.model_dump(),
                        definitionHash=digest, definition=program.model_dump(), renderManifest=manifest,
                        recentStructures=context.get('previousSignatures', []))
                    if design_brief is not None:common['designBrief'] = design_brief
                    await _progress(progress, 'reviewing')
                    phase = 'semantic_review'
                    semantic = await call(SemanticReview, 'review_activity_program', REVIEW_INSTRUCTION, common)
                    try:
                        last_semantic_review = SemanticReview.model_validate(semantic.model_dump(warnings=False) if isinstance(semantic, SemanticReview) else semantic).model_dump(warnings=False)
                    except (ValidationError, ValueError, TypeError):
                        last_semantic_review = None
                    semantic = validate_review(program, digest, semantic)
                    last_semantic_review = semantic.model_dump(warnings=False)
                    await _progress(progress, 'reviewing_gameplay')
                    phase = 'gameplay_review'
                    review_payload = dict(**common, renderManifestHash=canonical_hash(manifest))
                    gameplay = await call(GameplayReview, 'review_activity_gameplay', GAMEPLAY_REVIEW_INSTRUCTION, review_payload)
                    try:
                        typed_gameplay_review = GameplayReview.model_validate(gameplay.model_dump(warnings=False) if isinstance(gameplay, GameplayReview) else gameplay).model_dump(warnings=False)
                        last_gameplay_review = typed_gameplay_review
                        review_audit_semantic = last_semantic_review
                        review_audit_manifest = manifest
                    except (ValidationError, ValueError, TypeError):
                        pass
                    try:
                        gameplay = validate_gameplay_review(program, digest, gameplay, manifest)
                    except CompositionFailure as error:
                        if isinstance(gameplay, GameplayReview):
                            error._review_feedback = gameplay.model_dump(warnings=False)
                        raise
                    metadata = safe_calls()
                    return ApprovedProgram(program=program, definition_hash=digest, requested_model=requested,
                        returned_models=[item['returnedModel'] for item in metadata if item.get('returnedModel')],
                        review=semantic, call_count=calls, model_calls=metadata, diagnostic_events=list(diagnostics),
                        game_design=selected.model_dump(), design_evaluations=private_design_evaluations(), gameplay_review=gameplay,
                        structural_fingerprint=structural_signature(program), render_manifest=manifest)
                except CompositionFailure as error:
                    last = error
                except ExtractionError as error:
                    invalid = error.code in {'invalid_extraction', 'activity_schema_invalid', 'activity_provider_invalid'}
                    stage = ('gameplay_review' if phase == 'gameplay_review' else 'review' if phase == 'semantic_review' else 'schema') if invalid else 'provider'
                    code = ('gameplay_review_response_invalid' if phase == 'gameplay_review' else 'review_response_invalid' if phase == 'semantic_review' else _provider_authoring_code(error)) if invalid else error.code
                    last = CompositionFailure(stage, code, (error.diagnostic or {}).get('field') or '')
                    if phase == 'authoring':candidate = None
                except ValidationError as error:
                    last = _authoring_schema_failure(error) if phase == 'authoring' else CompositionFailure('gameplay_review' if phase == 'gameplay_review' else 'review',
                                              'gameplay_review_response_invalid' if phase == 'gameplay_review' else 'review_response_invalid')
                    if phase == 'authoring':candidate = None
                except (ValueError, TypeError, KeyError):
                    last = CompositionFailure('gameplay_review' if phase == 'gameplay_review' else 'review' if phase == 'semantic_review' else 'schema',
                                              'gameplay_review_response_invalid' if phase == 'gameplay_review' else 'review_response_invalid' if phase == 'semantic_review' else 'authoring_invalid')
                    if phase == 'authoring':candidate = None
                record(last, attempt + 1)
            raise last
    except AccountError as error:
        # Ownership/session changes still abort immediately. Preserve only the
        # completed call audit before re-raising the same authorization error.
        failure_metadata(error)
        raise
    except TimeoutError:
        error = CompositionFailure('provider', 'generation_deadline_exceeded')
        record(error, len(diagnostics) + 1)
        raise failure_metadata(error) from None
    except CompositionFailure as error:
        raise failure_metadata(error) from None
