"""Bounded live composition, authoring compilation and hash-bound admission.

No finished-program library or fixture loader is read here. Provider calls use
the existing configured transport; only approved data reaches the owned runtime.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
import inspect
import re
import uuid
from typing import Annotated, Literal

from pydantic import Field, ValidationError

from backend.accounts.security import AccountError
from backend.gap.vision import DATA_POLICY, structured_call
from backend.provider import ExtractionError, VisionSettings
from .authoring import ActivityAuthoring, PROMPT_VERSION, compile_authoring
from .composer_prompt import COMPOSE_INSTRUCTION, REVIEW_INSTRUCTION
from .core import ExecutionCore, ProgramInvalid
from .models import ActivityProgram, Closed, ShortText
from .preview import validate_runtime_compatibility
from .registry import OBJECT_PORTS, PREVIEW_OPERATIONS, component_contracts
from .validator import validate_program

MAX_CANDIDATES = 3
MAX_MODEL_CALLS = 6
TOTAL_BUDGET_SECONDS = 360
MAX_DESIGN_BRIEF_LENGTH = 2000


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


class ConfiguredComposerAdapter:
    def __init__(self, settings=None):
        self.settings = settings or VisionSettings.from_env()
        self.model = self.settings.model
        self.metadata = []

    async def call(self, response_model, task, system, data):
        metadata = {'task': task}
        self.metadata.append(metadata)
        return await structured_call(response_model, task=task, system=DATA_POLICY + system,
                                     user=data, settings=self.settings, metadata=metadata)


def capabilities():
    return dict(
        operations={name: value for name, value in component_contracts().items() if name in PREVIEW_OPERATIONS},
        objectPorts={name: ports for name, ports in OBJECT_PORTS.items()
                     if name in {'grid', 'equation', 'evidence_board', 'text_artifact', 'progress', 'fraction_strip'}},
        unavailableOperations=sorted(set(component_contracts()) - PREVIEW_OPERATIONS),
        rendererConstraints=dict(onePrimaryObjectPerOperation=True, otherComponentsOneObjectOfEachKind=True,
            oneActionOfEachOperationPerComponent=True, maxBoardCells=120,
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
                unsupportedClaims=['Unaided arithmetic recall', 'Unobserved verbal explanation', 'Mastery'])),
    )


def admit_authoring(authored, context, model):
    """Computational admission before review; no missing-witness loophole."""
    if not (authored.get('witness') if isinstance(authored, dict) else getattr(authored, 'witness', None)):
        raise CompositionFailure('witness', 'verified_finish_required')
    try:
        program = compile_authoring(authored, context, model=model)
    except ProgramInvalid as error:
        raise CompositionFailure('schema', error.code, error.path) from None
    except (ValidationError, ValueError, KeyError, TypeError):
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
    return 'Correct the identified declared-contract constraint, preserving the learning goal. Produce a fully valid new candidate and finish witness; no rule or assessment is normalized by the server.'


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
        return [{key: item.get(key) for key in ('task', 'requestedModel', 'returnedModel')} for item in metadata]

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
                        last = CompositionFailure('schema' if error.code == 'activity_schema_invalid' else 'provider', error.code, path)
                    if call_phase != 'review':
                        candidate = None
                except (ValidationError, ValueError, KeyError, TypeError):
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
