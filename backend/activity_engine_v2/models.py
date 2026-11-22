"""Versioned ActivityProgram contract shared by offline checks and the opt-in preview."""
from __future__ import annotations

import re
from typing import Annotated, Literal, Union

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictInt, model_serializer, model_validator

SCHEMA_VERSION = '2.0-foundation'
COMPONENT_VERSION = 'sidekick-program-contract-v1'
MAX_PROGRAM_BYTES = 262144
MAX_JSON_DEPTH = 40
MAX_JSON_NODES = 20000


class Closed(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True, allow_inf_nan=False)


Identifier = Annotated[str, Field(pattern=r'^[a-zA-Z][a-zA-Z0-9_.-]{0,79}$')]
Text = Annotated[str, Field(min_length=1, max_length=4000)]
ShortText = Annotated[str, Field(min_length=1, max_length=500)]


class SlotBase(Closed):
    id: Identifier
    mutable: bool = True


class IntegerSlot(SlotBase):
    kind: Literal['integer']
    initial: StrictInt
    minimum: Annotated[int, Field(ge=-1000000, le=1000000)]
    maximum: Annotated[int, Field(ge=-1000000, le=1000000)]
    unit: Annotated[str, Field(min_length=1, max_length=40)] | None = None

    @model_validator(mode='after')
    def bounds(self):
        if not self.minimum <= self.initial <= self.maximum:
            raise ValueError('initial_integer_out_of_bounds')
        return self


class BooleanSlot(SlotBase):
    kind: Literal['boolean']
    initial: StrictBool


class TextSlot(SlotBase):
    kind: Literal['text']
    initial: Annotated[str, Field(max_length=4000)] = ''
    maxLength: Annotated[int, Field(ge=1, le=4000)]

    @model_validator(mode='after')
    def bounds(self):
        if len(self.initial) > self.maxLength:
            raise ValueError('initial_text_out_of_bounds')
        return self


class ChoiceSlot(SlotBase):
    kind: Literal['choice']
    initial: Identifier
    options: Annotated[list[Identifier], Field(min_length=1, max_length=120)]

    @model_validator(mode='after')
    def bounds(self):
        if len(set(self.options)) != len(self.options) or self.initial not in self.options:
            raise ValueError('invalid_choice_domain')
        return self


class CollectionSlot(SlotBase):
    kind: Literal['id_set', 'id_list']
    initial: Annotated[list[Identifier], Field(max_length=120)] = Field(default_factory=list)
    options: Annotated[list[Identifier], Field(min_length=1, max_length=120)]
    maxItems: Annotated[int, Field(ge=1, le=120)]

    @model_validator(mode='after')
    def bounds(self):
        if (len(set(self.options)) != len(self.options) or len(set(self.initial)) != len(self.initial)
                or not set(self.initial) <= set(self.options) or len(self.initial) > self.maxItems
                or self.maxItems > len(self.options)):
            raise ValueError('invalid_collection_domain')
        return self


class ArtifactSlot(SlotBase):
    kind: Literal['artifact']
    initial: None = None
    mediaKind: Literal['audio', 'drawing']


StateSlot = Annotated[Union[IntegerSlot, BooleanSlot, TextSlot, ChoiceSlot, CollectionSlot, ArtifactSlot], Field(discriminator='kind')]


class LiteralTerm(Closed):
    kind: Literal['literal']
    value: StrictInt | StrictBool | Annotated[str, Field(max_length=4000)]


class StateTerm(Closed):
    kind: Literal['state']
    ref: Identifier


class InputTerm(Closed):
    kind: Literal['input']
    ref: Identifier


class OperatorTerm(Closed):
    kind: Literal['operator']
    op: Literal['add', 'subtract', 'multiply', 'count', 'word_count', 'present']
    args: Annotated[list[Term], Field(min_length=1, max_length=4)]


Term = Annotated[Union[LiteralTerm, StateTerm, InputTerm, OperatorTerm], Field(discriminator='kind')]


class AlwaysCondition(Closed):
    kind: Literal['always']


class CompareCondition(Closed):
    kind: Literal['compare']
    op: Literal['eq', 'ne', 'lt', 'lte', 'gt', 'gte']
    left: Term
    right: Term


class LogicCondition(Closed):
    kind: Literal['all', 'any']
    conditions: Annotated[list[Condition], Field(min_length=1, max_length=12)]


class NotCondition(Closed):
    kind: Literal['not']
    condition: Condition


class ContainsCondition(Closed):
    kind: Literal['contains']
    collection: Term
    item: Term


class GoalCondition(Closed):
    kind: Literal['goal']
    goalId: Identifier


class FractionEqualCondition(Closed):
    kind: Literal['fraction_equal']
    leftObject: Identifier
    rightObject: Identifier


Condition = Annotated[Union[AlwaysCondition, CompareCondition, LogicCondition, NotCondition, ContainsCondition, GoalCondition, FractionEqualCondition], Field(discriminator='kind')]


class SetEffect(Closed):
    kind: Literal['set']
    target: Identifier
    value: Term


class ItemEffect(Closed):
    kind: Literal['add_item', 'remove_item', 'toggle_item']
    target: Identifier
    item: Term


class TransferEffect(Closed):
    kind: Literal['transfer']
    source: Identifier
    target: Identifier
    amount: Term


class RepartitionEffect(Closed):
    kind: Literal['repartition']
    target: Identifier
    piecesTarget: Identifier
    value: Term


class MoveItemEffect(Closed):
    kind: Literal['move_item']
    target: Identifier
    fromItem: Term
    toItem: Term


Effect = Annotated[Union[SetEffect, ItemEffect, TransferEffect, RepartitionEffect, MoveItemEffect], Field(discriminator='kind')]


class SkillTarget(Closed):
    skillId: Annotated[str, Field(min_length=1, max_length=80)]
    demonstration: ShortText


class Observation(Closed):
    id: Identifier
    skillId: Annotated[str, Field(min_length=1, max_length=80)]
    kind: Literal['incorrect_response', 'correct_response', 'assisted_success', 'unclear_response', 'observed_strategy']
    source: Literal['uploaded_work', 'activity_history', 'parent_observation']
    confidence: Annotated[float, Field(ge=0, le=1)]
    summary: ShortText | None = None


class Misconception(Closed):
    skillId: Annotated[str, Field(min_length=1, max_length=80)]
    description: ShortText
    confidence: Annotated[float, Field(ge=0, le=1)]
    observationIds: Annotated[list[Identifier], Field(min_length=1, max_length=8)]


class LearningIntent(Closed):
    targets: Annotated[list[SkillTarget], Field(min_length=1, max_length=8)]
    observations: Annotated[list[Observation], Field(max_length=16)] = Field(default_factory=list)
    misconceptions: Annotated[list[Misconception], Field(max_length=8)] = Field(default_factory=list)
    successEvidence: Annotated[list[Identifier], Field(min_length=1, max_length=16)]


class MaterialItem(Closed):
    id: Identifier
    text: ShortText


class Material(Closed):
    id: Identifier
    kind: Literal['unit_tiles', 'passage', 'words', 'prompt']
    text: Text | None = None
    items: Annotated[list[MaterialItem], Field(max_length=120)] = Field(default_factory=list)
    quantity: Annotated[int, Field(ge=1, le=120)] | None = None


class WorldObject(Closed):
    id: Identifier
    kind: Literal['quantity_pool', 'grid', 'equation', 'text_artifact', 'evidence_board', 'sequence', 'audio_artifact', 'drawing_artifact', 'progress', 'fraction_strip', 'stage_piece', 'stage_map']
    bindings: Annotated[dict[Identifier, Identifier], Field(min_length=1, max_length=8)]
    materialIds: Annotated[list[Identifier], Field(max_length=8)] = Field(default_factory=list)
    width: Annotated[int, Field(ge=1, le=12)] | None = None
    height: Annotated[int, Field(ge=1, le=12)] | None = None
    wholeId: Identifier | None = None

    @model_serializer(mode='wrap')
    def preserve_legacy_object_shape(self, serialize):
        # model_serializer is available throughout the declared Pydantic 2.x
        # range; Field(exclude_if=...) requires a newer release. Omitting only
        # this newly added null field preserves historical definition hashes.
        result = serialize(self)
        if self.wholeId is None:
            result.pop('wholeId', None)
        return result


class Relationship(Closed):
    id: Identifier
    kind: Literal['represents', 'derived_from', 'same_whole']
    source: Identifier
    target: Identifier


class ConservationInvariant(Closed):
    kind: Literal['conserved_total']
    stateRefs: Annotated[list[Identifier], Field(min_length=2, max_length=12)]
    total: Annotated[int, Field(ge=0, le=1000000)]
    unit: Annotated[str, Field(min_length=1, max_length=40)]


class World(Closed):
    state: Annotated[list[StateSlot], Field(min_length=1, max_length=64)]
    materials: Annotated[list[Material], Field(max_length=32)] = Field(default_factory=list)
    objects: Annotated[list[WorldObject], Field(min_length=1, max_length=32)]
    relationships: Annotated[list[Relationship], Field(max_length=32)] = Field(default_factory=list)
    invariants: Annotated[list[ConservationInvariant], Field(max_length=8)] = Field(default_factory=list)


class Component(Closed):
    id: Identifier
    kind: Literal['quantity_lab', 'math_workspace', 'text_editor', 'evidence_board', 'tile_order', 'oral_studio', 'drawing_studio', 'fraction_workspace', 'world_stage']
    objectIds: Annotated[list[Identifier], Field(min_length=1, max_length=8)]
    spaceId: Identifier


class ActionInput(Closed):
    id: Identifier
    kind: Literal['integer', 'text', 'choice', 'id_list', 'artifact']
    minimum: StrictInt | None = None
    maximum: StrictInt | None = None
    minLength: Annotated[int, Field(ge=1, le=4000)] | None = None
    maxLength: Annotated[int, Field(ge=1, le=4000)] | None = None
    options: Annotated[list[Identifier], Field(min_length=1, max_length=120)] | None = None
    maxItems: Annotated[int, Field(ge=1, le=120)] | None = None
    mediaKind: Literal['audio', 'drawing'] | None = None

    @model_validator(mode='after')
    def fields_for_type(self):
        applicable = {'integer': {'minimum','maximum'}, 'text': {'minLength','maxLength'},
            'choice': {'options'}, 'id_list': {'options','maxItems'}, 'artifact': {'mediaKind'}}[self.kind]
        for name in {'minimum','maximum','minLength','maxLength','options','maxItems','mediaKind'} - applicable:
            if getattr(self,name) is not None:
                raise ValueError('input_field_incompatible_with_type')
        if self.kind == 'integer' and (self.minimum is None or self.maximum is None or not -1000000 <= self.minimum <= self.maximum <= 1000000):
            raise ValueError('input_integer_bounds_required')
        if self.kind == 'text' and (self.maxLength is None or (self.minLength or 1) > self.maxLength):
            raise ValueError('input_text_bounds_required')
        if self.kind in {'choice','id_list'} and (not self.options or len(set(self.options)) != len(self.options)):
            raise ValueError('input_domain_required')
        if self.kind == 'id_list' and (self.maxItems is None or self.maxItems > len(self.options)):
            raise ValueError('input_collection_bounds_required')
        if self.kind == 'artifact' and self.mediaKind is None:
            raise ValueError('input_artifact_kind_required')
        return self


class Action(Closed):
    id: Identifier
    componentId: Identifier
    operation: Literal['transfer_quantity', 'toggle_tile', 'resize_rectangle', 'assemble_product', 'replace_text', 'revise_text', 'select_evidence', 'reorder', 'record_voice', 'draw', 'set_fraction_partition', 'toggle_fraction_piece', 'move_fraction_piece', 'move_actor', 'place_piece', 'inspect_location']
    inputs: Annotated[list[ActionInput], Field(min_length=1, max_length=4)]
    label: ShortText


class Rule(Closed):
    id: Identifier
    onAction: Identifier
    when: Condition
    effects: Annotated[list[Effect], Field(min_length=1, max_length=8)]


class Goal(Closed):
    id: Identifier
    description: ShortText
    when: Condition


class Completion(Closed):
    when: Condition
    goalIds: Annotated[list[Identifier], Field(min_length=1, max_length=16)]
    allowAssisted: Literal[True] = True


class Help(Closed):
    id: Identifier
    kind: Literal['hint','demonstration','cue']
    text: Text
    availableWhen: Condition
    actionIds: Annotated[list[Identifier], Field(min_length=1, max_length=16)]
    maxUses: Annotated[int, Field(ge=1, le=8)] = 3


class AutomaticAssessment(Closed):
    kind: Literal['automatic']
    when: Condition


class ParentAssessment(Closed):
    kind: Literal['parent_review']
    rubric: Annotated[list[ShortText], Field(min_length=1, max_length=8)]


Assessment = Annotated[Union[AutomaticAssessment,ParentAssessment], Field(discriminator='kind')]


class Evidence(Closed):
    id: Identifier
    skillIds: Annotated[list[Annotated[str, Field(min_length=1, max_length=80)]], Field(min_length=1,max_length=8)]
    actionIds: Annotated[list[Identifier], Field(min_length=1,max_length=16)]
    stateRefs: Annotated[list[Identifier], Field(min_length=1,max_length=16)]
    assessment: Assessment
    assistance: Literal['server_event_history'] = 'server_event_history'


class Space(Closed):
    id: Identifier
    title: ShortText
    visibleWhen: Condition | None = None


StageAsset = Literal['dot', 'person', 'cart', 'boat', 'parcel', 'lens', 'bridge', 'gate', 'home', 'tree', 'lamp', 'book', 'clue', 'flag', 'flower', 'gear']
StageStatus = Literal['idle', 'active', 'blocked', 'discovered', 'complete']
StageLabel = Annotated[str, Field(min_length=1, max_length=100)]


class StageLocation(Closed):
    id: Identifier
    label: StageLabel
    x: Annotated[int, Field(ge=0, le=100)]
    y: Annotated[int, Field(ge=0, le=100)]
    capacity: Annotated[int, Field(ge=1, le=8)] = 4
    accepts: Literal['any', 'actor', 'device'] = 'any'


class StageEntity(Closed):
    id: Identifier
    label: StageLabel
    kind: Literal['actor', 'device', 'object', 'destination']
    objectId: Identifier | None = None
    locationId: Identifier | None = None
    asset: StageAsset = 'dot'
    representationObjectId: Identifier | None = None

    @model_validator(mode='after')
    def one_placement(self):
        if (self.objectId is None) == (self.locationId is None):
            raise ValueError('stage_entity_requires_one_placement')
        if self.kind == 'actor' and self.objectId is None:
            raise ValueError('stage_actor_requires_object')
        if self.kind == 'destination' and self.locationId is None:
            raise ValueError('stage_destination_requires_location')
        return self


class StageConstruction(Closed):
    objectId: Identifier
    rows: Annotated[StrictInt, Field(ge=1, le=12)]
    columns: Annotated[StrictInt, Field(ge=1, le=12)]


class StageConnection(Closed):
    id: Identifier
    fromLocation: Identifier
    toLocation: Identifier
    bidirectional: bool = True
    when: Condition
    label: StageLabel
    blockedLabel: StageLabel
    construction: StageConstruction | None = None

    @model_serializer(mode='wrap')
    def preserve_legacy_connection_shape(self, serialize):
        result = serialize(self)
        if self.construction is None:
            result.pop('construction', None)
        return result


class StageTool(Closed):
    componentId: Identifier
    entityId: Identifier
    availableWhen: Condition
    label: StageLabel


class StageReaction(Closed):
    id: Identifier
    entityId: Identifier | None = None
    when: Condition
    status: StageStatus
    text: Annotated[str, Field(min_length=1, max_length=180)]


class StageSurface(Closed):
    id: Identifier
    label: StageLabel
    objectId: Identifier
    locationId: Identifier | None = None
    connectionId: Identifier | None = None
    cellIds: Annotated[list[Identifier], Field(max_length=24)] = Field(default_factory=list)
    layout: Literal['object', 'row', 'column'] = 'object'
    actionId: Identifier | None = None
    visibleWhen: Condition

    @model_validator(mode='after')
    def one_anchor(self):
        if (self.locationId is None) == (self.connectionId is None):
            raise ValueError('stage_surface_requires_one_anchor')
        return self


class StageDefinition(Closed):
    locations: Annotated[list[StageLocation], Field(min_length=2, max_length=12)]
    entities: Annotated[list[StageEntity], Field(min_length=1, max_length=12)]
    connections: Annotated[list[StageConnection], Field(max_length=24)] = Field(default_factory=list)
    tools: Annotated[list[StageTool], Field(min_length=1, max_length=12)]
    reactions: Annotated[list[StageReaction], Field(min_length=1, max_length=24)]
    surfaces: Annotated[list[StageSurface], Field(max_length=8)] = Field(default_factory=list)

    @model_serializer(mode='wrap')
    def preserve_legacy_stage_shape(self, serialize):
        result = serialize(self)
        if not self.surfaces:
            result.pop('surfaces', None)
        return result


class Presentation(Closed):
    entrySpace: Identifier
    spaces: Annotated[list[Space], Field(min_length=1,max_length=8)]
    assets: Annotated[list[Identifier], Field(max_length=8)] = Field(default_factory=list)
    theme: Literal['sidekick'] = 'sidekick'
    stage: StageDefinition | None = None

    @model_serializer(mode='wrap')
    def preserve_legacy_presentation_shape(self, serialize):
        result = serialize(self)
        if self.stage is None:
            result.pop('stage', None)
        return result


class Provenance(Closed):
    origin: Literal['original_contract_fixture', 'human_authored', 'ai_composed']
    author: ShortText
    sourceRefs: Annotated[list[Identifier], Field(max_length=16)] = Field(default_factory=list)
    model: Annotated[str, Field(min_length=1,max_length=100)] | None = None
    promptVersion: Identifier | None = None


class Limits(Closed):
    maxActions: Annotated[int, Field(ge=1,le=256)] = 100
    maxRulesPerAction: Annotated[int, Field(ge=1,le=8)] = 8
    maxEffectsPerAction: Annotated[int, Field(ge=1,le=32)] = 16
    maxExpressionDepth: Annotated[int, Field(ge=1,le=8)] = 8
    maxExpressionNodes: Annotated[int, Field(ge=1,le=128)] = 64


class WitnessStep(Closed):
    actionId: Identifier
    inputs: Annotated[dict[Identifier, StrictInt | StrictBool | str | list[str]], Field(max_length=4)]


class ActivityProgram(Closed):
    schemaVersion: Literal['2.0-foundation']
    id: Identifier
    title: ShortText
    definitionVersion: Annotated[int, Field(ge=1,le=1000000)] = 1
    componentVersion: Literal['sidekick-program-contract-v1']
    intent: LearningIntent
    world: World
    components: Annotated[list[Component], Field(min_length=1,max_length=24)]
    actions: Annotated[list[Action], Field(min_length=1,max_length=32)]
    rules: Annotated[list[Rule], Field(min_length=1,max_length=64)]
    goals: Annotated[list[Goal], Field(min_length=1,max_length=16)]
    completion: Completion
    help: Annotated[list[Help], Field(max_length=16)] = Field(default_factory=list)
    evidence: Annotated[list[Evidence], Field(min_length=1,max_length=16)]
    presentation: Presentation
    provenance: Provenance
    limits: Limits = Field(default_factory=Limits)
    witness: Annotated[list[WitnessStep], Field(max_length=256)] | None = None


class ValidationIssue(Closed):
    code: Identifier
    path: Annotated[str, Field(max_length=160)]


class ValidationReport(Closed):
    valid: bool
    structural: Literal['passed','failed']
    computational: Literal['witness_verified','not_checked','failed']
    semanticReview: Literal['required'] = 'required'
    childTesting: Literal['not_performed'] = 'not_performed'
    runtimeIntegration: Literal['not_connected'] = 'not_connected'
    artifactVerification: Literal['not_performed'] = 'not_performed'
    definitionSha256: str | None = None
    witnessSteps: int = 0
    achievedGoalIds: list[str] = Field(default_factory=list)
    issues: list[ValidationIssue] = Field(default_factory=list)


for _model in (OperatorTerm, LogicCondition, NotCondition, CompareCondition, ContainsCondition,
               Rule, Goal, Completion, Help, AutomaticAssessment, Space, ActivityProgram):
    _model.model_rebuild()
