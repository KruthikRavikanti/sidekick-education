"""Bounded planning and inspectable structural comparison, never a game runtime.

Plans are provider authoring data. Only an approved ActivityProgram executes.
Structural fingerprints deliberately ignore names, object IDs, numbers, colors,
coordinates and asset skins. They are conservative novelty signals, not a claim
that two experiences are pedagogically distinct or enjoyable.
"""
from __future__ import annotations

from collections import Counter
import hashlib
import json
from typing import Annotated, Literal

from pydantic import Field

from .models import ActivityProgram, Closed, Identifier, ShortText, SkillTarget
from .registry import PREVIEW_OPERATIONS

DESIGN_VERSION = 'sidekick-game-design-v1'
STRUCTURE_VERSION = 'sidekick-game-structure-v1'
WORLD_OPERATIONS = frozenset({'move_actor', 'place_piece', 'inspect_location'})


class DesignEvaluationError(ValueError):
    """Fixed reason plus bounded private plan evaluations, never an error body."""
    def __init__(self, code, evaluations):
        self.evaluations = evaluations
        super().__init__(code)


class DesignEntity(Closed):
    role: Identifier
    kind: Literal['actor', 'device', 'object', 'destination', 'location']
    purpose: ShortText


class DesignStep(Closed):
    operation: Identifier
    entityRole: Identifier
    childDecision: ShortText
    visibleConsequence: ShortText


class DesignRelationship(Closed):
    fromRole: Identifier
    toRole: Identifier
    kind: Literal['route', 'contains', 'attaches', 'informs', 'transforms']


class DesignConstraint(Closed):
    kind: Literal['topology', 'capacity', 'spatial', 'quantity', 'source', 'sequence', 'construction', 'revision', 'choice']
    description: ShortText


class DesignConsequence(Closed):
    operation: Identifier
    skillIds: Annotated[list[Annotated[str, Field(min_length=1, max_length=80)]], Field(min_length=1, max_length=8)]
    kind: Literal['route_usability', 'travel', 'reveal', 'placement', 'resource', 'artifact_presentation', 'transformation', 'inspection']
    conceptConnection: ShortText
    visibleChange: ShortText


class DesignEvidence(Closed):
    skillId: Annotated[str, Field(min_length=1, max_length=80)]
    actions: Annotated[list[Identifier], Field(min_length=1, max_length=12)]
    actualDemonstration: ShortText
    assessment: Literal['automatic', 'parent_review', 'mixed']
    limitation: ShortText


class GameDesign(Closed):
    id: Identifier
    title: ShortText
    learningObjective: ShortText
    supportedObservationIds: Annotated[list[Identifier], Field(max_length=16)]
    supportedHistoryIndices: Annotated[list[Annotated[int, Field(ge=0, le=15)]], Field(max_length=10)]
    uncertaintyAcknowledged: ShortText
    childGoal: Annotated[str, Field(min_length=1, max_length=220)]
    format: Literal['puzzle', 'investigation', 'construction', 'creative_studio', 'simulation', 'adventure']
    entities: Annotated[list[DesignEntity], Field(min_length=2, max_length=10)]
    actionLoop: Annotated[list[DesignStep], Field(min_length=2, max_length=7)]
    relationships: Annotated[list[DesignRelationship], Field(min_length=1, max_length=14)]
    decisions: Annotated[list[ShortText], Field(min_length=1, max_length=5)]
    constraints: Annotated[list[DesignConstraint], Field(min_length=1, max_length=8)]
    consequences: Annotated[list[DesignConsequence], Field(min_length=1, max_length=8)]
    help: ShortText
    recovery: ShortText
    completionKind: Literal['destination', 'network', 'construction', 'investigation', 'artifact', 'scenario']
    completion: ShortText
    evidence: Annotated[list[DesignEvidence], Field(min_length=1, max_length=8)]
    requiredCapabilities: Annotated[list[Identifier], Field(min_length=2, max_length=16)]
    missingCapabilities: Annotated[list[Identifier], Field(max_length=8)]


class GameDesignBatch(Closed):
    formatVersion: Literal['sidekick-game-design-v1']
    targets: Annotated[list[SkillTarget], Field(min_length=1, max_length=8)]
    concepts: Annotated[list[GameDesign], Field(min_length=5, max_length=5)]


class ReviewedDesign(Closed):
    designId: Identifier
    approved: bool
    targetIntegrated: bool
    understandablePlay: bool
    meaningfulChoice: bool
    recoverable: bool
    supportedNeed: bool
    rank: Annotated[int, Field(ge=1, le=5)]
    reasonCode: Literal['approved', 'target_detached', 'unclear_play', 'decorative_choice',
        'no_recovery', 'unsupported_need', 'unsupported_capability', 'too_complex', 'repetitive_structure']
    evidence: ShortText


class GameDesignReview(Closed):
    designBatchHash: Annotated[str, Field(pattern=r'^[a-f0-9]{64}$')]
    candidates: Annotated[list[ReviewedDesign], Field(min_length=5, max_length=5)]


def _digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()).hexdigest()


def design_signature(design):
    """Invariant to narrative wording and role-ID renaming; structural only."""
    d = design if isinstance(design, GameDesign) else GameDesign.model_validate(design)
    kinds = {entity.role: entity.kind for entity in d.entities}
    features = Counter()
    features['loop:' + '>'.join(step.operation for step in d.actionLoop)] += 1
    for operation in sorted({step.operation for step in d.actionLoop}):
        features['action:' + operation] += 1
    features['finish:' + d.completionKind] += 1
    for entity in d.entities:
        features['entity:' + entity.kind] += 1
    for relation in d.relationships:
        features['relation:' + kinds.get(relation.fromRole, '?') + ':' + relation.kind + ':' + kinds.get(relation.toRole, '?')] += 1
    for constraint in d.constraints:
        features['constraint:' + constraint.kind] += 1
    for consequence in d.consequences:
        features['consequence:' + consequence.operation + ':' + consequence.kind] += 1
    return _signature(features)


def _signature(features):
    tokens = sorted(f'{name}#{count}' for name, count in features.items())
    return dict(version=STRUCTURE_VERSION, digest=_digest(tokens), features=tokens)


def _history_features(context):
    result = []
    for item in context.get('previousSignatures', []):
        # Planning signatures are compared to plans; actual runtime signatures
        # remain separately retained for verification and final variety review.
        candidates = [item.get('designSignature'), item.get('planningSignature'),
                      item.get('structuralSignature'), item.get('structuralFingerprint'), item]
        for value in candidates:
            if isinstance(value, dict) and value.get('version') == STRUCTURE_VERSION and isinstance(value.get('features'), list):
                result.append(set(value['features']))
                break
    return result


def evaluate_designs(batch, context):
    """Deterministic eligibility and conservative structural-novelty ranking.

    This does not certify gameplay quality: the exact authored definition must
    still pass independent semantic and gameplay reviews of its real affordances.
    """
    batch = batch if isinstance(batch, GameDesignBatch) else GameDesignBatch.model_validate(batch)
    targets = [SkillTarget.model_validate(item).model_dump() for item in context['targets']]
    if [item.model_dump() for item in batch.targets] != targets:
        raise ValueError('trusted_design_target_mismatch')
    skill_ids = {item['skillId'] for item in targets}
    observations = {item['id'] for item in context.get('observations', [])}
    history_count = len(context.get('history', []))
    recent = _history_features(context)
    seen_ids, seen_structures = set(), set()
    evaluations = []
    for index, concept in enumerate(batch.concepts):
        issues = []
        if concept.id in seen_ids:
            issues.append('duplicate_design_id')
        seen_ids.add(concept.id)
        roles = [entity.role for entity in concept.entities]
        if len(roles) != len(set(roles)):
            issues.append('duplicate_entity_role')
        operations = {step.operation for step in concept.actionLoop}
        required = set(concept.requiredCapabilities)
        if concept.missingCapabilities or not required <= PREVIEW_OPERATIONS or not operations <= required:
            issues.append('unimplemented_design_capability')
        if not operations & WORLD_OPERATIONS or not operations - WORLD_OPERATIONS:
            issues.append('bare_tools_or_decorative_world')
        if any(step.entityRole not in roles for step in concept.actionLoop):
            issues.append('unknown_design_entity')
        if any(item.fromRole not in roles or item.toRole not in roles for item in concept.relationships):
            issues.append('unknown_design_relationship')
        if (not set(concept.supportedObservationIds) <= observations
                or any(number >= history_count for number in concept.supportedHistoryIndices)):
            issues.append('invented_design_support')
        if {item.skillId for item in concept.evidence} != skill_ids:
            issues.append('design_evidence_target_mismatch')
        if any(not set(item.actions) <= required for item in concept.evidence):
            issues.append('unknown_design_evidence_action')
        if any(not set(item.skillIds) <= skill_ids or item.operation not in required for item in concept.consequences):
            issues.append('design_concept_connection_invalid')
        fingerprint = design_signature(concept)
        if fingerprint['digest'] in seen_structures:
            issues.append('cosmetic_design_duplicate')
        seen_structures.add(fingerprint['digest'])
        current = set(fingerprint['features'])
        novelty = min((1 - len(current & old) / max(1, len(current | old)) for old in recent), default=1.0)
        # This is only a novelty prior, never a quality score based on the count
        # of listed concepts/clicks. Independent design review ranks quality.
        score = round(novelty, 6)
        evaluations.append(dict(index=index, designId=concept.id, candidate=concept.model_dump(), eligible=not issues, reasonCodes=issues,
            score=score, structuralNovelty=round(novelty, 6), historyAvailable=bool(recent), signature=fingerprint))
    eligible = [item for item in evaluations if item['eligible']]
    if len(eligible) < 3:
        raise DesignEvaluationError('insufficient_supported_design_variety', evaluations)
    selected = max(eligible, key=lambda item: (item['score'], -item['index']))
    return batch.concepts[selected['index']], evaluations


def select_reviewed_design(batch, evaluations, review):
    batch = batch if isinstance(batch, GameDesignBatch) else GameDesignBatch.model_validate(batch)
    review = GameDesignReview.model_validate(review.model_dump() if isinstance(review, GameDesignReview) else review)
    if review.designBatchHash != _digest(batch.model_dump()):
        raise ValueError('design_review_hash_mismatch')
    names = [item.designId for item in review.candidates]
    if len(set(names)) != 5 or set(names) != {item.id for item in batch.concepts}:
        raise ValueError('design_review_candidate_mismatch')
    by_id = {item.designId: item for item in review.candidates}
    merged = []
    for item in evaluations:
        judgment = by_id[item['designId']]
        quality = (judgment.approved and judgment.reasonCode == 'approved'
                   and all(getattr(judgment, key) for key in ('targetIntegrated','understandablePlay',
                                                            'meaningfulChoice','recoverable','supportedNeed')))
        merged.append(dict(**item, designReview=judgment.model_dump(), approvedForAuthoring=bool(item['eligible'] and quality)))
    eligible = [item for item in merged if item['approvedForAuthoring']]
    if not eligible:
        raise DesignEvaluationError('no_approved_game_design', merged)
    selected = min(eligible, key=lambda item: (item['designReview']['rank'], -item['structuralNovelty'], item['index']))
    return batch.concepts[selected['index']], merged


def structural_signature(program):
    """Canonical feature bag of actual runtime behavior, not generated claims."""
    p = program.model_dump() if isinstance(program, ActivityProgram) else program
    objects = {item['id']: item for item in p.get('world', {}).get('objects', [])}
    slots = {item['id']: item for item in p.get('world', {}).get('state', [])}
    state_roles = {}
    for obj in objects.values():
        for role, ref in obj.get('bindings', {}).items():
            state_roles.setdefault(ref, set()).add(obj['kind'] + '.' + role)
    def state_role(ref):
        return '|'.join(sorted(state_roles.get(ref, {slots.get(ref, {}).get('kind', '?')})))
    def shape(node):
        if isinstance(node, list):
            return '[' + ','.join(sorted(shape(item) for item in node)) + ']'
        if not isinstance(node, dict):
            return '_'
        kind = node.get('kind', '?')
        if kind == 'state':return 'state:' + state_role(node.get('ref'))
        if kind == 'input':return 'input'
        if kind == 'literal':return 'literal:' + ('boolean' if type(node.get('value')) is bool else 'number' if type(node.get('value')) is int else 'label')
        if kind == 'fraction_equal':return 'fraction_equal:' + ':'.join(sorted(objects.get(node.get(name), {}).get('kind', '?') for name in ('leftObject','rightObject')))
        parts = [kind]
        for key in ('op',):
            if key in node:parts.append(str(node[key]))
        for key in ('args','conditions','condition','left','right','collection','item','value','amount','fromItem','toItem'):
            if key in node:parts.append(key + ':' + shape(node[key]))
        if 'target' in node:parts.append('target:' + state_role(node['target']))
        if 'piecesTarget' in node:parts.append('piecesTarget:' + state_role(node['piecesTarget']))
        return '(' + '|'.join(parts) + ')'
    features = Counter()
    actions = {item['id']: item for item in p.get('actions', [])}
    for obj in objects.values():features['object:' + obj['kind']] += 1
    for component in p.get('components', []):features['component:' + component['kind']] += 1
    for action in actions.values():features['action:' + action['operation']] += 1
    for rule in p.get('rules', []):
        operation = actions.get(rule['onAction'], {}).get('operation', '?')
        features['rule:' + operation + ':' + shape(rule.get('when')) + ':' + shape(rule.get('effects', []))] += 1
    for goal in p.get('goals', []):features['goal:' + shape(goal.get('when'))] += 1
    features['completion:' + shape(p.get('completion', {}).get('when'))] += 1
    for invariant in p.get('world', {}).get('invariants', []):
        features['resource:' + invariant.get('kind', '?') + ':' + '|'.join(sorted(state_role(ref) for ref in invariant.get('stateRefs', [])))] += 1
    for relation in p.get('world', {}).get('relationships', []):
        features['relation:' + objects.get(relation['source'], {}).get('kind', '?') + ':' + relation['kind'] + ':' + objects.get(relation['target'], {}).get('kind', '?')] += 1
    stage = p.get('presentation', {}).get('stage') or {}
    locations = {item['id']: item for item in stage.get('locations', [])}
    incoming, outgoing = Counter(), Counter()
    for link in stage.get('connections', []):
        outgoing[link['fromLocation']] += 1; incoming[link['toLocation']] += 1
        if link.get('bidirectional'):
            outgoing[link['toLocation']] += 1; incoming[link['fromLocation']] += 1
        features['edge:' + str(bool(link.get('bidirectional'))) + ':' + shape(link.get('when'))] += 1
        if link.get('construction'):
            source=objects.get(link['construction'].get('objectId'),{})
            features['construction_mount:' + source.get('kind','?') + ':exact_footprint_and_coverage'] += 1
    for loc in locations.values():
        features['location:' + loc.get('accepts', 'any') + ':in' + str(incoming[loc['id']]) + ':out' + str(outgoing[loc['id']])] += 1
    entities = {item['id']: item for item in stage.get('entities', [])}
    for entity in entities.values():features['entity:' + entity['kind'] + ':' + ('movable' if entity.get('objectId') else 'fixed')] += 1
    for tool in stage.get('tools', []):
        component = next((item for item in p.get('components', []) if item['id'] == tool['componentId']), {})
        features['tool:' + component.get('kind', '?') + ':' + entities.get(tool.get('entityId'), {}).get('kind', '?') + ':' + shape(tool.get('availableWhen'))] += 1
    for reaction in stage.get('reactions', []):features['consequence:' + reaction.get('status', '?') + ':' + shape(reaction.get('when'))] += 1
    links = {item['id']: item for item in stage.get('connections', [])}
    for surface in stage.get('surfaces', []):
        source = objects.get(surface.get('objectId'), {})
        link = links.get(surface.get('connectionId'), {})
        anchor = ('connection:' + str(bool(link.get('bidirectional'))) + ':' + shape(link.get('when'))
                  if surface.get('connectionId') else 'location:' + locations.get(surface.get('locationId'), {}).get('accepts', 'any'))
        operation = actions.get(surface.get('actionId'), {}).get('operation', 'read_only')
        features['surface:' + source.get('kind', '?') + ':' + anchor + ':' + surface.get('layout', 'object')
                 + ':' + ('subset' if surface.get('cellIds') else 'whole') + ':' + operation
                 + ':' + shape(surface.get('visibleWhen'))] += 1
    return _signature(features)
