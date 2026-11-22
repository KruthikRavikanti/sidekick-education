"""Closed provider authoring data compiled to the one authoritative runtime language.

The runtime's bindings and witness input maps cannot pass unchanged through the
shared strict-schema adapter: it closes arbitrary dictionaries. Authoring uses
explicit entries, and disjoint tagged unions use anyOf instead of discriminator/
oneOf. No authoring representation is interpreted by the player or runtime.
"""
from __future__ import annotations

import copy
from typing import Annotated, Literal

from pydantic import Field, StrictBool, StrictInt

from .models import (
    Action, ActivityProgram, AlwaysCondition, Closed, CompareCondition, Completion,
    Component, ContainsCondition, Evidence, FractionEqualCondition, Goal, Help, MaterialItem, ParentAssessment,
    Identifier, LearningIntent, Limits, Presentation, Rule, ShortText, SkillTarget,
    Text, World, WorldObject,
)
from .core import ProgramInvalid
from .registry import OBJECT_PORTS

AUTHORING_VERSION = 'sidekick-program-authoring-v1'
PROMPT_VERSION = 'sidekick-program-composer-v1'


class BindingEntry(Closed):
    port: Literal['count', 'rows', 'columns', 'cells', 'left', 'right', 'result',
                  'text', 'selection', 'order', 'artifact', 'value', 'denominator', 'pieces']
    stateRef: Identifier


class AuthoringObject(WorldObject):
    bindings: Annotated[list[BindingEntry], Field(min_length=1, max_length=8)]


class TileMaterial(Closed):
    id: Identifier
    kind: Literal['unit_tiles']
    text: None
    items: Annotated[list[MaterialItem], Field(max_length=0)]
    quantity: Annotated[StrictInt, Field(ge=1, le=120)]


class PromptMaterial(Closed):
    id: Identifier
    kind: Literal['prompt']
    text: Text
    items: Annotated[list[MaterialItem], Field(max_length=0)]
    quantity: None


class PassageMaterial(Closed):
    id: Identifier
    kind: Literal['passage']
    text: Text
    items: Annotated[list[MaterialItem], Field(min_length=2, max_length=120)]
    quantity: None


class WordsMaterial(Closed):
    id: Identifier
    kind: Literal['words']
    text: Text | None
    items: Annotated[list[MaterialItem], Field(min_length=2, max_length=120)]
    quantity: None


AuthoringMaterial = TileMaterial | PromptMaterial | PassageMaterial | WordsMaterial


class AuthoringWorld(World):
    objects: Annotated[list[AuthoringObject], Field(min_length=1, max_length=32)]
    materials: Annotated[list[AuthoringMaterial], Field(max_length=32)]


class AuthoringLogicCondition(Closed):
    kind: Literal['all', 'any']
    conditions: Annotated[list[AuthoringGoalCondition], Field(min_length=1, max_length=12)]


class AuthoringNotCondition(Closed):
    kind: Literal['not']
    condition: AuthoringGoalCondition


# Goal references are supported only outside goal definitions. This recursive
# provider subset forbids a goal reference at every depth rather than relying on
# an instruction that models can accidentally violate. It compiles unchanged.
AuthoringGoalCondition = (AlwaysCondition | CompareCondition | ContainsCondition | FractionEqualCondition
                          | AuthoringLogicCondition | AuthoringNotCondition)


class AuthoringGoal(Goal):
    when: AuthoringGoalCondition


class AuthoringAutomaticAssessment(Closed):
    kind: Literal['automatic']
    when: AuthoringGoalCondition


class AuthoringEvidence(Evidence):
    assessment: AuthoringAutomaticAssessment | ParentAssessment


class WitnessInputEntry(Closed):
    inputId: Identifier
    value: StrictInt | StrictBool | Annotated[str, Field(max_length=4000)] | Annotated[list[Identifier], Field(max_length=120)]


class AuthoringWitnessStep(Closed):
    actionId: Identifier
    inputs: Annotated[list[WitnessInputEntry], Field(min_length=1, max_length=4)]


def provider_union_schema(value):
    """Equivalent disjoint-tag union encoding supported by strict providers."""
    if isinstance(value, list):
        return [provider_union_schema(item) for item in value]
    if not isinstance(value, dict):
        return value
    result = {key: provider_union_schema(item) for key, item in value.items()
              if key != 'discriminator'}
    if 'oneOf' in result:
        result['anyOf'] = result.pop('oneOf')
    return result


class ActivityAuthoring(Closed):
    formatVersion: Literal['sidekick-program-authoring-v1']
    id: Identifier
    title: ShortText
    targets: Annotated[list[SkillTarget], Field(min_length=1, max_length=8)]
    successEvidence: Annotated[list[Identifier], Field(min_length=1, max_length=16)]
    world: AuthoringWorld
    components: Annotated[list[Component], Field(min_length=1, max_length=24)]
    actions: Annotated[list[Action], Field(min_length=1, max_length=32)]
    rules: Annotated[list[Rule], Field(min_length=1, max_length=64)]
    goals: Annotated[list[AuthoringGoal], Field(min_length=1, max_length=16)]
    completion: Completion
    help: Annotated[list[Help], Field(min_length=1, max_length=16)]
    evidence: Annotated[list[AuthoringEvidence], Field(min_length=1, max_length=16)]
    presentation: Presentation
    limits: Limits
    witness: Annotated[list[AuthoringWitnessStep], Field(min_length=1, max_length=256)]

    @classmethod
    def model_json_schema(cls, **kwargs):
        return provider_union_schema(super().model_json_schema(**kwargs))


for _model in (AuthoringLogicCondition, AuthoringNotCondition, AuthoringGoal,
               AuthoringAutomaticAssessment, AuthoringEvidence, ActivityAuthoring):
    _model.model_rebuild()


def compile_authoring(value, context, *, model, prompt_version=PROMPT_VERSION):
    """No model-controlled observations, private refs, confidence or provenance."""
    authored = value if isinstance(value, ActivityAuthoring) else ActivityAuthoring.model_validate(value)
    targets = [SkillTarget.model_validate(item).model_dump() for item in context['targets']]
    if [item.model_dump() for item in authored.targets] != targets:
        raise ProgramInvalid('trusted_target_mismatch', 'targets')
    raw = authored.model_dump()
    raw.pop('formatVersion')
    raw.pop('targets')
    success = raw.pop('successEvidence')
    for obj in raw['world']['objects']:
        entries = obj['bindings']
        ports = [entry['port'] for entry in entries]
        if len(ports) != len(set(ports)):
            raise ProgramInvalid('duplicate_binding_entry', 'world.objects.bindings')
        if set(ports) != set(OBJECT_PORTS[obj['kind']]):
            raise ProgramInvalid('unknown_binding_entry', 'world.objects.bindings')
        obj['bindings'] = {entry['port']: entry['stateRef'] for entry in entries}
    actions = {action.id: action for action in authored.actions}
    for step in raw['witness']:
        entries = step['inputs']
        names = [entry['inputId'] for entry in entries]
        if len(names) != len(set(names)):
            raise ProgramInvalid('duplicate_witness_input_entry', 'witness')
        action = actions.get(step['actionId'])
        if action is None or set(names) != {param.id for param in action.inputs}:
            raise ProgramInvalid('unknown_witness_input_entry', 'witness')
        step['inputs'] = {entry['inputId']: entry['value'] for entry in entries}
    intent = LearningIntent.model_validate(dict(
        targets=targets, observations=copy.deepcopy(context.get('observations', [])),
        misconceptions=copy.deepcopy(context.get('misconceptions', [])), successEvidence=success))
    raw.update(schemaVersion='2.0-foundation', componentVersion='sidekick-program-contract-v1',
               definitionVersion=1, intent=intent.model_dump(), provenance=dict(
                   origin='ai_composed', author='Sidekick AI', sourceRefs=[],
                   model=model, promptVersion=prompt_version))
    return ActivityProgram.model_validate(raw)


def to_authoring(program):
    """Lossless behavior encoding for tests/repair, not a fixture-selection path."""
    raw = program.model_dump() if isinstance(program, ActivityProgram) else copy.deepcopy(program)
    raw.pop('schemaVersion'); raw.pop('componentVersion'); raw.pop('definitionVersion', None)
    intent = raw.pop('intent'); raw.pop('provenance')
    raw.update(formatVersion=AUTHORING_VERSION, targets=intent['targets'], successEvidence=intent['successEvidence'])
    for obj in raw['world']['objects']:
        obj['bindings'] = [dict(port=port, stateRef=ref) for port, ref in obj['bindings'].items()]
    for step in raw.get('witness') or []:
        step['inputs'] = [dict(inputId=name, value=value) for name, value in step['inputs'].items()]
    return ActivityAuthoring.model_validate(raw)
