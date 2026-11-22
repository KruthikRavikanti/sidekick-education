"""Trusted, pure ActivityProgram execution shared by witnesses and live sessions.

This module does no I/O. Callers supply an approved, structurally validated
definition and authoritative state; ownership, artifacts and event persistence
remain host responsibilities. Every rejected transition leaves its input intact.
"""
from __future__ import annotations

import copy
from dataclasses import dataclass
from fractions import Fraction
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
        self.stage = program.presentation.stage

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
        if node.kind == 'fraction_equal':
            return self.fraction_comparison(state, node.leftObject, node.rightObject)['equalAmount']
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
        if self.stage is not None:
            locations = {item.id: item for item in self.stage.locations}
            occupied = {identifier: [] for identifier in locations}
            for entity in self.stage.entities:
                if entity.objectId is None:
                    continue
                location = state[self.objects[entity.objectId].bindings['location']]
                if location not in locations:
                    fail('stage_location_unknown', 'world.state')
                role = 'actor' if entity.kind == 'actor' else 'device'
                if locations[location].accepts not in {'any', role}:
                    fail('stage_location_rejects_entity', 'world.state')
                occupied[location].append(entity.id)
            if any(len(entities) > locations[identifier].capacity for identifier, entities in occupied.items()):
                fail('stage_location_capacity_exceeded', 'world.state')
        for obj in self.objects.values():
            if obj.kind == 'fraction_strip':
                denominator = state[obj.bindings['denominator']]
                pieces = state[obj.bindings['pieces']]
                if not 2 <= denominator <= 24 or not obj.width or denominator % obj.width:
                    fail('fraction_partition_invalid', 'world.objects')
                if any(not re.fullmatch(r'p(?:[0-9]|1[0-9]|2[0-3])', piece)
                       or int(piece[1:]) >= denominator for piece in pieces):
                    fail('fraction_piece_outside_whole', 'world.objects')
                continue
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

    def fraction_comparison(self, state, left_id, right_id):
        left, right = self.objects[left_id], self.objects[right_id]
        same = (left.kind == right.kind == 'fraction_strip' and left_id != right_id
                and left.wholeId == right.wholeId and left.wholeId is not None and left.width == right.width
                and any(relation.kind == 'same_whole' and {relation.source, relation.target} == {left_id, right_id}
                        for relation in self.p.world.relationships))
        left_amount = len(state[left.bindings['pieces']]) * state[right.bindings['denominator']] if same else None
        right_amount = len(state[right.bindings['pieces']]) * state[left.bindings['denominator']] if same else None
        equal = same and left_amount == right_amount
        comparison = ('equal' if equal else 'less' if left_amount < right_amount else 'greater') if same else None
        return dict(leftObject=left_id, rightObject=right_id, sameWhole=bool(same), equalAmount=bool(equal), comparison=comparison)

    def repartition_fraction(self, state, obj, denominator):
        """Exact spatial resampling: a new cell must be wholly shaded or clear.

        Each immutable base column is split into rows. Column-major indexes
        preserve the same geometry as these normalized rational intervals.
        No rounding or a client-provided numerator participates in the result.
        """
        slot = self.slots[obj.bindings['denominator']]
        if (type(denominator) is not int or not slot.minimum <= denominator <= slot.maximum
                or not 2 <= denominator <= 24 or denominator % obj.width):
            fail('fraction_partition_invalid', 'actions.inputs')
        old_denominator = state[obj.bindings['denominator']]
        if denominator == old_denominator:
            fail('fraction_partition_unchanged', 'actions.inputs')
        selected = state[obj.bindings['pieces']]
        intervals = [(Fraction(int(piece[1:]), old_denominator), Fraction(int(piece[1:]) + 1, old_denominator))
                     for piece in selected]
        pieces = []
        for index in range(denominator):
            start, end = Fraction(index, denominator), Fraction(index + 1, denominator)
            covered = sum((max(Fraction(0), min(end, right) - max(start, left)) for left, right in intervals), Fraction(0))
            if covered == end - start:
                pieces.append(f'p{index}')
            elif covered:
                fail('fraction_partition_cuts_shaded_piece', 'actions.inputs')
        if len(selected) * denominator != len(pieces) * old_denominator:
            fail('fraction_amount_not_preserved', 'rules.effects')
        return pieces

    def fraction_views(self, state, object_ids=None):
        visible = set(object_ids) if object_ids is not None else set(self.objects)
        spaces = set(self.visible_spaces(state))
        views = []
        for obj in self.objects.values():
            if obj.kind != 'fraction_strip' or obj.id not in visible:
                continue
            actions = [action for action in self.p.actions if action.operation in {
                'set_fraction_partition', 'toggle_fraction_piece', 'move_fraction_piece'}
                and self.components[action.componentId].spaceId in spaces
                and obj.id in {item.id for item in self.action_objects(action.id)}]
            allowed = []
            for action in actions:
                if action.operation != 'set_fraction_partition':
                    continue
                parameter = next(item for item in action.inputs if item.id == 'denominator')
                for denominator in range(parameter.minimum, parameter.maximum + 1):
                    try:
                        if self.completed(state):
                            # Finished workspaces are frozen by the host. Keep
                            # their historical projection/cache shape while
                            # active choices use the exact execution semantics.
                            self.repartition_fraction(state, obj, denominator)
                        else:
                            self.transition(state, action.id, {'denominator': denominator}, action_count=0)
                        allowed.append(denominator)
                    except ProgramInvalid:
                        pass
            pieces = list(state[obj.bindings['pieces']])
            views.append(dict(objectId=obj.id, wholeId=obj.wholeId, numerator=len(pieces),
                denominator=state[obj.bindings['denominator']], pieces=pieces, width=obj.width,
                editable=bool(actions), allowedDenominators=sorted(set(allowed))))
        comparisons = [self.fraction_comparison(state, relation.source, relation.target)
            for relation in self.p.world.relationships if relation.kind == 'same_whole'
            and relation.source in visible and relation.target in visible
            and self.objects[relation.source].kind == self.objects[relation.target].kind == 'fraction_strip']
        return views, comparisons

    def visible_spaces(self, state):
        return tuple(space.id for space in self.p.presentation.spaces
                     if space.visibleWhen is None or self.evaluate(space.visibleWhen, state, {}))

    def goal_status(self, state):
        return {goal.id: self.evaluate(goal.when, state, {}) for goal in self.p.goals}

    def completed(self, state):
        return self.evaluate(self.p.completion.when, state, {})

    def stage_component_ids(self, state, visible_component_ids=None):
        """Contextual material visibility is authoritative, not a client toggle."""
        visible = (set(visible_component_ids) if visible_component_ids is not None else
                   {item.id for item in self.p.components if item.spaceId in self.visible_spaces(state)})
        if self.stage is None:
            return visible
        gated = {tool.componentId for tool in self.stage.tools}
        available = {tool.componentId for tool in self.stage.tools if self.evaluate(tool.availableWhen, state, {})}
        return visible - (gated - available)

    def stage_surface_views(self, state, visible_component_ids=None):
        """Physical surfaces borrow the actual concept object; never a copy.

        Immutable references may be explicitly revealed without an interactive
        tool. Mutable artifacts require their bound presentation space and the
        surface's explicit visibility condition, while tool availability gates
        editing separately. Direct cells use the same checked transition.
        """
        if self.stage is None or not self.stage.surfaces:
            return []
        visible=self.stage_component_ids(state,visible_component_ids)
        visible_spaces=set(self.visible_spaces(state))
        result=[]
        for surface in self.stage.surfaces:
            if not self.evaluate(surface.visibleWhen,state,{}):continue
            obj=self.objects[surface.objectId]
            mutable=any(self.slots[ref].mutable for ref in obj.bindings.values())
            if mutable and not any(component.spaceId in visible_spaces and obj.id in component.objectIds for component in self.p.components):
                continue
            action=self.actions.get(surface.actionId) if surface.actionId is not None else None
            if action is not None and action.componentId not in visible:action=None
            ids=[];selected=set();input_id=None
            if obj.kind=='grid':
                rows,columns=state[obj.bindings['rows']],state[obj.bindings['columns']]
                current=[f'r{row}c{column}' for row in range(rows) for column in range(columns)]
                ids=[identifier for identifier in surface.cellIds if identifier in current] if surface.cellIds else current
                selected=set(state[obj.bindings['cells']]);input_id='cell'
            elif obj.kind=='fraction_strip':
                ids=[f'p{index}' for index in range(state[obj.bindings['denominator']])]
                selected=set(state[obj.bindings['pieces']]);input_id='piece'
            cells=[]
            for identifier in ids:
                allowed=False;reason=None
                if action is not None:
                    try:
                        self.transition(state,action.id,{input_id:identifier},action_count=0)
                        allowed=True
                    except ProgramInvalid as error:
                        reason=error.code
                cells.append(dict(id=identifier,selected=identifier in selected,allowed=allowed,reasonCode=reason))
            result.append(dict(id=surface.id,label=surface.label,objectId=obj.id,kind=obj.kind,
                locationId=surface.locationId,connectionId=surface.connectionId,layout=surface.layout,
                cellIds=ids,actionId=action.id if action is not None else None,
                inputId=input_id if action is not None else None,cells=cells))
        return result

    def _stage_action(self, state, action, inputs):
        if action.operation not in {'move_actor', 'place_piece', 'inspect_location'}:
            return
        if self.stage is None:
            fail('world_stage_required', 'presentation.stage')
        objects = self.action_objects(action.id)
        if len(objects) != 1:
            fail('stage_action_binding_invalid', 'actions')
        obj = objects[0]
        locations = {item.id: item for item in self.stage.locations}
        destination = inputs['location' if action.operation == 'inspect_location' else 'destination']
        if destination not in locations:
            fail('stage_location_unknown', 'actions.inputs')
        if action.operation == 'inspect_location':
            return
        entity = next((item for item in self.stage.entities if item.objectId == obj.id), None)
        if entity is None or (action.operation == 'move_actor') != (entity.kind == 'actor'):
            fail('stage_action_entity_mismatch', 'actions')
        if action.operation == 'move_actor':
            origin = state[obj.bindings['location']]
            edges = [edge for edge in self.stage.connections if
                     (edge.fromLocation == origin and edge.toLocation == destination)
                     or (edge.bidirectional and edge.toLocation == origin and edge.fromLocation == destination)]
            if not edges:
                fail('stage_destination_not_adjacent', 'actions.inputs')
            if not any(self.stage_connection_open(edge,state) for edge in edges):
                fail('stage_connection_closed', 'actions.inputs')

    def construction_fit(self, connection, state):
        """Exact grid fit, derived from the same source that the child edits."""
        mount=connection.construction
        if mount is None:return None
        obj=self.objects[mount.objectId]
        rows,columns=state[obj.bindings['rows']],state[obj.bindings['columns']]
        cells=set(state[obj.bindings['cells']])
        covered=len(cells)
        dimensions_match=rows==mount.rows and columns==mount.columns
        complete=cells=={f'r{row}c{column}' for row in range(rows) for column in range(columns)}
        return dict(objectId=obj.id,rows=mount.rows,columns=mount.columns,requiredCells=mount.rows*mount.columns,
                    actualRows=rows,actualColumns=columns,coveredCells=covered,
                    dimensionsMatch=dimensions_match,complete=complete,fits=dimensions_match and complete)

    def stage_connection_open(self, connection, state):
        """One authoritative route check used by travel and projection."""
        fit=self.construction_fit(connection,state)
        return self.evaluate(connection.when,state,{}) and (fit is None or fit['fits'])

    def stage_view(self, state, visible_component_ids=None):
        """One deterministic post-state projection; reactions never write state.

        Conditions consume only the accepted state and bounded existing goal
        language. They cannot reference this projection or trigger an action.
        First matching reaction wins per entity; global reactions remain ordered.
        """
        if self.stage is None:
            return None
        visible = self.stage_component_ids(state, visible_component_ids)
        public_objects = {ref for component in self.p.components if component.id in visible for ref in component.objectIds}
        surfaces=self.stage_surface_views(state,visible)
        public_objects.update(surface['objectId'] for surface in surfaces)
        tools = [dict(componentId=tool.componentId, entityId=tool.entityId, label=tool.label,
                      available=tool.componentId in visible and self.evaluate(tool.availableWhen,state,{}))
                 for tool in self.stage.tools]
        reactions = [dict(id=item.id, entityId=item.entityId, status=item.status, text=item.text)
                     for item in self.stage.reactions if self.evaluate(item.when, state, {})]
        inspect_actions = [action for action in self.p.actions if action.operation == 'inspect_location'
                           and action.componentId in visible]
        inspected = {location for obj in self.objects.values() if obj.kind == 'stage_map'
                     for location in state[obj.bindings['inspected']]}
        locations = [{**item.model_dump(), 'inspected': item.id in inspected,
                      'actionIds': [action.id for action in inspect_actions if item.id in action.inputs[0].options]}
                     for item in self.stage.locations]
        entities = []
        for entity in self.stage.entities:
            current = next((item for item in reactions if item['entityId'] == entity.id), None)
            actions = [action.id for action in self.p.actions if action.componentId in visible
                       and action.operation in {'move_actor', 'place_piece'}
                       and entity.objectId in {item.id for item in self.action_objects(action.id)}]
            entities.append(dict(id=entity.id, label=entity.label, kind=entity.kind, asset=entity.asset,
                objectId=entity.objectId,
                locationId=state[self.objects[entity.objectId].bindings['location']] if entity.objectId else entity.locationId,
                representationObjectId=entity.representationObjectId if entity.representationObjectId in public_objects else None,
                currentStatus=current['status'] if current else 'idle', reactionText=current['text'] if current else None,
                actionIds=actions, toolComponentIds=[tool['componentId'] for tool in tools
                                                   if tool['entityId'] == entity.id and tool['available']]))
        connections=[]
        for edge in self.stage.connections:
            projected=dict(id=edge.id,fromLocation=edge.fromLocation,toLocation=edge.toLocation,
                bidirectional=edge.bidirectional,open=self.stage_connection_open(edge,state),
                label=edge.label,blockedLabel=edge.blockedLabel)
            fit=self.construction_fit(edge,state)
            if fit is not None:
                source_visible=fit['objectId'] in public_objects
                if not source_visible:
                    fit.update({key:None for key in ('actualRows','actualColumns','coveredCells',
                                                    'dimensionsMatch','complete','fits')})
                projected['construction']=dict(fit,sourceVisible=source_visible)
            connections.append(projected)
        targets = []
        for action in self.p.actions:
            if action.componentId not in visible or action.operation not in {'move_actor', 'place_piece', 'inspect_location'}:
                continue
            parameter = action.inputs[0]
            offered = []
            for identifier in parameter.options:
                try:
                    self.transition(state, action.id, {parameter.id: identifier}, action_count=0)
                    offered.append(dict(id=identifier, allowed=True, reasonCode=None))
                except ProgramInvalid as error:
                    offered.append(dict(id=identifier, allowed=False, reasonCode=error.code))
            targets.append(dict(actionId=action.id, inputId=parameter.id, targets=offered))
        result=dict(locations=locations, entities=entities, connections=connections, tools=tools,
                    reactions=reactions, actionTargets=targets)
        if self.stage.surfaces:
            result['surfaces']=surfaces
        return result

    def action_objects(self, action_id):
        """The operation's real primary objects, using its declared write ports."""
        if action_id not in self.actions:
            fail('unknown_action', 'actions')
        action = self.actions[action_id]
        cap = CAPABILITIES[action.operation]
        targets = {effect.target for rule in self.rules[action_id] for effect in rule.effects}
        targets.update(effect.piecesTarget for rule in self.rules[action_id] for effect in rule.effects if effect.kind == 'repartition')
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
        if self.stage is not None and component.id not in self.stage_component_ids(state):
            fail('stage_tool_unavailable', 'actions')
        self._check_inputs(action, inputs)
        active = [rule for rule in self.rules[action_id] if self.evaluate(rule.when, state, inputs)]
        if not active:
            fail('action_guard_unsatisfied', 'rules')
        self._stage_action(state, action, inputs)
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
                targets = ({effect.source, effect.target} if effect.kind == 'transfer' else
                           {effect.target, effect.piecesTarget} if effect.kind == 'repartition' else {effect.target})
                if targets.intersection(written):
                    fail('conflicting_effects', 'rules.effects')
                if any(not self.slots[ref].mutable for ref in targets):
                    fail('immutable_state_write', 'rules.effects')
                written.update(targets)
                if effect.kind == 'set':
                    next_state[effect.target] = copy.deepcopy(self.term(effect.value, state, inputs))
                elif effect.kind == 'repartition':
                    objects = [obj for obj in self.action_objects(action_id) if obj.kind == 'fraction_strip'
                               and obj.bindings['denominator'] == effect.target and obj.bindings['pieces'] == effect.piecesTarget]
                    if len(objects) != 1:
                        fail('fraction_partition_binding_invalid', 'rules.effects')
                    denominator = self.term(effect.value, state, inputs)
                    next_state[effect.piecesTarget] = self.repartition_fraction(state, objects[0], denominator)
                    next_state[effect.target] = denominator
                elif effect.kind == 'move_item':
                    source, destination = self.term(effect.fromItem, state, inputs), self.term(effect.toItem, state, inputs)
                    if source == destination or source not in state[effect.target] or destination in state[effect.target]:
                        fail('fraction_move_requires_filled_and_empty_places', 'actions.inputs')
                    collection = next_state[effect.target]
                    collection.remove(source)
                    collection.append(destination)
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
