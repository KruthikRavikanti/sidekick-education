"""Trusted, pure ActivityProgram execution shared by witnesses and live sessions.

This module does no I/O. Callers supply an approved, structurally validated
definition and authoritative state; ownership, artifacts and event persistence
remain host responsibilities. Every rejected transition leaves its input intact.
"""
from __future__ import annotations

import copy
from dataclasses import dataclass
import re
from typing import Any

from .models import ActivityProgram
from .registry import CAPABILITIES

RUNTIME_VERSION = 'sidekick-program-runtime-v1'


class ProgramInvalid(ValueError):
    """Content-safe reason and contract path, never a child's submitted value."""

    def __init__(self, code: str, path: str = ''):
        self.code, self.path = code, path
        super().__init__(code)


def fail(code: str, path: str = ''):
    raise ProgramInvalid(code, path)


@dataclass(frozen=True)
class Transition:
    state: dict[str, Any]
    action_count: int
    changed_slots: tuple[str, ...]
    applied_rule_ids: tuple[str, ...]
    achieved_goal_ids: tuple[str, ...]
    completed: bool
    visible_space_ids: tuple[str, ...]


class ExecutionCore:
    """Version-pinned semantics; no generated code or rule cascades.

    ``program`` must already have passed authoring validation. Historical replay
    uses its saved approved definition, not a new current-catalog interpretation.
    State and every action input are checked again at the execution boundary.
    """

    def __init__(self, program: ActivityProgram):
        self.p = program
        self.slots = {slot.id: slot for slot in program.world.state}
        self.materials = {item.id: item for item in program.world.materials}
        self.objects = {item.id: item for item in program.world.objects}
        self.components = {item.id: item for item in program.components}
        self.actions = {item.id: item for item in program.actions}
        self.goals = {item.id: item for item in program.goals}
        self.evidence = {item.id: item for item in program.evidence}
        self.spaces = {item.id: item for item in program.presentation.spaces}
        self.rules = {identifier: [] for identifier in self.actions}
        for rule in program.rules:
            if rule.onAction in self.rules:
                self.rules[rule.onAction].append(rule)
        self.initial = {slot.id: copy.deepcopy(slot.initial) for slot in program.world.state}

    def term(self, node, state, inputs):
        if node.kind == 'literal':
            return node.value
        if node.kind == 'state':
            return state[node.ref]
        if node.kind == 'input':
            return inputs[node.ref]
        values = [self.term(arg, state, inputs) for arg in node.args]
        if node.op == 'add':
            result = values[0] + values[1]
        elif node.op == 'subtract':
            result = values[0] - values[1]
        elif node.op == 'multiply':
            result = values[0] * values[1]
        elif node.op == 'count':
            return len(values[0])
        elif node.op == 'word_count':
            return len(values[0].split())
        elif node.op == 'present':
            return values[0] is not None
        else:
            fail('unsupported_operator')
        if abs(result) > 1_000_000_000_000:
            fail('arithmetic_budget_exceeded')
        return result

    def evaluate(self, node, state, inputs):
        if node.kind == 'always':
            return True
        if node.kind == 'goal':
            return self.evaluate(self.goals[node.goalId].when, state, {})
        if node.kind == 'all':
            return all(self.evaluate(child, state, inputs) for child in node.conditions)
        if node.kind == 'any':
            return any(self.evaluate(child, state, inputs) for child in node.conditions)
        if node.kind == 'not':
            return not self.evaluate(node.condition, state, inputs)
        if node.kind == 'contains':
            return self.term(node.item, state, inputs) in self.term(node.collection, state, inputs)
        left = self.term(node.left, state, inputs)
        right = self.term(node.right, state, inputs)
        if node.left.kind == 'state' and self.slots[node.left.ref].kind == 'id_set':
            left, right = set(left), set(right)
        comparisons = {
            'eq': lambda: left == right, 'ne': lambda: left != right,
            'lt': lambda: left < right, 'lte': lambda: left <= right,
            'gt': lambda: left > right, 'gte': lambda: left >= right,
        }
        if node.op not in comparisons:
            fail('unsupported_comparison')
        return comparisons[node.op]()

    def check_state(self, state):
        if not isinstance(state, dict) or set(state) != set(self.slots):
            fail('state_signature_invalid', 'world.state')
        for ref, slot in self.slots.items():
            value = state[ref]
            if not slot.mutable and value != slot.initial:
                fail('immutable_state_changed', 'world.state')
            if slot.kind == 'integer' and (type(value) is not int or not slot.minimum <= value <= slot.maximum):
                fail('state_integer_bounds_violated', 'world.state')
            if slot.kind == 'boolean' and type(value) is not bool:
                fail('state_type_violated', 'world.state')
            if slot.kind == 'text' and (not isinstance(value, str) or len(value) > slot.maxLength):
                fail('state_text_bounds_violated', 'world.state')
            if slot.kind == 'choice' and (not isinstance(value, str) or value not in slot.options):
                fail('state_choice_domain_violated', 'world.state')
            if slot.kind in {'id_set', 'id_list'}:
                if (not isinstance(value, list) or len(value) > slot.maxItems
                        or any(not isinstance(item, str) for item in value)
                        or len(set(value)) != len(value) or not set(value) <= set(slot.options)):
                    fail('state_collection_bounds_violated', 'world.state')
            if slot.kind == 'artifact' and value is not None and (
                    not isinstance(value, str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_.-]{0,79}', value)):
                fail('state_artifact_reference_invalid', 'world.state')
        for invariant in self.p.world.invariants:
            if sum(state[ref] for ref in invariant.stateRefs) != invariant.total:
                fail('quantity_conservation_violated', 'world.invariants')
        for obj in self.objects.values():
            if obj.kind != 'grid':
                continue
            rows = state[obj.bindings['rows']]
            columns = state[obj.bindings['columns']]
            cells = state[obj.bindings['cells']]
            if rows * columns > 120:
                fail('grid_area_budget_exceeded', 'world.objects')
            if any(int(re.fullmatch(r'r(\d{1,2})c(\d{1,2})', cell)[1]) >= rows
                   or int(re.fullmatch(r'r(\d{1,2})c(\d{1,2})', cell)[2]) >= columns for cell in cells):
                fail('tile_outside_current_rectangle', 'world.objects')
            tiles = next(self.materials[ref] for ref in obj.materialIds if self.materials[ref].kind == 'unit_tiles')
            if len(cells) > tiles.quantity:
                fail('tile_stock_exceeded', 'world.objects')

    def visible_spaces(self, state):
        return tuple(space.id for space in self.p.presentation.spaces
                     if space.visibleWhen is None or self.evaluate(space.visibleWhen, state, {}))

    def goal_status(self, state):
        return {goal.id: self.evaluate(goal.when, state, {}) for goal in self.p.goals}

    def completed(self, state):
        return self.evaluate(self.p.completion.when, state, {})

    def action_objects(self, action_id):
        """The operation's real primary objects, using its declared write ports."""
        if action_id not in self.actions:
            fail('unknown_action', 'actions')
        action = self.actions[action_id]
        cap = CAPABILITIES[action.operation]
        targets = {effect.target for rule in self.rules[action_id] for effect in rule.effects}
        return tuple(self.objects[ref] for ref in self.components[action.componentId].objectIds
                     if self.objects[ref].kind == cap['objectKind']
                     and targets.intersection(self.objects[ref].bindings.values()))

    def _check_inputs(self, action, inputs):
        if not isinstance(inputs, dict):
            fail('action_input_signature_invalid', 'actions.inputs')
        params = {item.id: item for item in action.inputs}
        cap = CAPABILITIES.get(action.operation)
        component = self.components[action.componentId]
        if (not cap or component.kind != cap['component']
                or {key: value.kind for key, value in params.items()} != cap['inputKinds']):
            fail('action_capability_invalid', 'actions')
        if set(params) != set(inputs):
            fail('action_input_signature_invalid', 'actions.inputs')
        for ref, param in params.items():
            value = inputs[ref]
            if param.kind == 'integer' and (type(value) is not int or not param.minimum <= value <= param.maximum):
                fail('action_integer_input_invalid', 'actions.inputs')
            if param.kind == 'text' and (not isinstance(value, str)
                    or len(value.strip()) < (param.minLength or 1) or len(value) > param.maxLength):
                fail('action_text_input_invalid', 'actions.inputs')
            if param.kind == 'choice' and (not isinstance(value, str) or value not in param.options):
                fail('action_choice_input_invalid', 'actions.inputs')
            if param.kind == 'id_list' and (not isinstance(value, list)
                    or any(not isinstance(item, str) for item in value)
                    or len(value) != len(param.options) or set(value) != set(param.options)):
                fail('action_order_input_invalid', 'actions.inputs')
            if param.kind == 'artifact' and (not isinstance(value, str)
                    or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_.-]{0,79}', value)):
                fail('action_artifact_reference_invalid', 'actions.inputs')

    def transition(self, state, action_id, inputs, *, action_count=0):
        """Apply one child action atomically against the same pre-action state.

        A rejected request consumes no action budget. A finished mission is
        readable but frozen; a new attempt is a new owned session.
        """
        self.check_state(state)
        if type(action_count) is not int or action_count < 0:
            fail('action_count_invalid')
        if action_count >= self.p.limits.maxActions:
            fail('action_budget_exceeded')
        if self.completed(state):
            fail('mission_already_complete')
        if not isinstance(action_id, str) or action_id not in self.actions:
            fail('unknown_action', 'actions')
        action = self.actions[action_id]
        component = self.components[action.componentId]
        if component.spaceId not in self.visible_spaces(state):
            fail('action_space_unavailable', 'actions')
        self._check_inputs(action, inputs)
        active = [rule for rule in self.rules[action_id] if self.evaluate(rule.when, state, inputs)]
        if not active:
            fail('action_guard_unsatisfied', 'rules')
        if len(active) > self.p.limits.maxRulesPerAction or sum(len(rule.effects) for rule in active) > self.p.limits.maxEffectsPerAction:
            fail('action_effect_budget_exceeded', 'rules')
        if action.operation == 'revise_text':
            for obj in self.action_objects(action_id):
                if not state[obj.bindings['text']] or state[obj.bindings['text']] == inputs['text']:
                    fail('revision_requires_changed_existing_draft', 'actions')
        next_state = copy.deepcopy(state)
        written = set()
        for rule in active:
            for effect in rule.effects:
                targets = {effect.source, effect.target} if effect.kind == 'transfer' else {effect.target}
                if targets.intersection(written):
                    fail('conflicting_effects', 'rules.effects')
                if any(not self.slots[ref].mutable for ref in targets):
                    fail('immutable_state_write', 'rules.effects')
                written.update(targets)
                if effect.kind == 'set':
                    next_state[effect.target] = copy.deepcopy(self.term(effect.value, state, inputs))
                elif effect.kind == 'transfer':
                    amount = self.term(effect.amount, state, inputs)
                    if amount <= 0:
                        fail('positive_transfer_required', 'rules.effects')
                    next_state[effect.source] = state[effect.source] - amount
                    next_state[effect.target] = state[effect.target] + amount
                else:
                    item = self.term(effect.item, state, inputs)
                    collection = next_state[effect.target]
                    if effect.kind == 'toggle_item':
                        collection.remove(item) if item in collection else collection.append(item)
                    elif effect.kind == 'add_item':
                        if item not in collection:
                            collection.append(item)
                    elif effect.kind == 'remove_item':
                        if item in collection:
                            collection.remove(item)
                    else:
                        fail('unsupported_effect', 'rules.effects')
        self.check_state(next_state)
        changed = tuple(ref for ref in self.slots if next_state[ref] != state[ref])
        if not changed:
            fail('action_has_no_visible_change', 'actions')
        return Transition(
            state=next_state, action_count=action_count + 1, changed_slots=changed,
            applied_rule_ids=tuple(rule.id for rule in active),
            achieved_goal_ids=tuple(identifier for identifier, achieved in self.goal_status(next_state).items() if achieved),
            completed=self.completed(next_state), visible_space_ids=self.visible_spaces(next_state),
        )
