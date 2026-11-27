"""Content-safe offline compiler and optional bounded witness checker.

The witness interpreter is a verification helper, not the application runtime:
it does not accept live sessions, persist events, grade children, or run assets.
"""
from __future__ import annotations

import copy
import hashlib
import json
import re
from functools import lru_cache
from pathlib import Path

from pydantic import ValidationError

from .models import ActivityProgram, MAX_JSON_DEPTH, MAX_JSON_NODES, MAX_PROGRAM_BYTES, ValidationIssue, ValidationReport
from .registry import ASSETS, CAPABILITIES, COMPONENT_OBJECTS, OBJECT_PORTS

ROOT = Path(__file__).resolve().parents[2]


class ProgramInvalid(ValueError):
    """Fixed code/path only: no validation inputs, provider text or child content."""
    def __init__(self, code, path=''):
        self.code, self.path = code, path
        super().__init__(code)


def fail(code, path=''):
    raise ProgramInvalid(code,path)


@lru_cache(maxsize=1)
def catalog():
    rows = json.loads((ROOT/'data/sidekick_skill_map_v2.json').read_text())
    return {row['subskill_id']:row for row in rows if row['grade'] in {'K','1','2','3','4','5'}}


def _json_depth(value, depth=0, budget=None):
    if budget is None:budget=[MAX_JSON_NODES]
    budget[0]-=1
    if budget[0]<0:fail('json_node_budget_exceeded')
    if depth > MAX_JSON_DEPTH:
        fail('json_depth_exceeded')
    if isinstance(value,dict):
        for item in value.values(): _json_depth(item,depth+1,budget)
    elif isinstance(value,list):
        for item in value: _json_depth(item,depth+1,budget)


def _plain(value):
    if isinstance(value,str) and re.search(r'<\s*(?:/\s*)?[A-Za-z][^<>]*>|javascript\s*:|data\s*:\s*text/html',value,re.I):
        fail('executable_markup_forbidden')
    if isinstance(value,dict):
        for item in value.values(): _plain(item)
    elif isinstance(value,list):
        for item in value: _plain(item)


def _decode(payload):
    if isinstance(payload,ActivityProgram): payload=payload.model_dump()
    try:
        if isinstance(payload,bytes):
            if len(payload)>MAX_PROGRAM_BYTES: fail('program_size_exceeded')
            payload=payload.decode('utf-8')
        if isinstance(payload,str):
            if len(payload.encode('utf-8'))>MAX_PROGRAM_BYTES: fail('program_size_exceeded')
            # Bound parser nesting before Python/Pydantic recursively inspect it.
            nesting=0; in_string=False; escape=False
            for char in payload:
                if in_string:
                    if escape: escape=False
                    elif char=='\\': escape=True
                    elif char=='"': in_string=False
                elif char=='"': in_string=True
                elif char in '{[':
                    nesting+=1
                    if nesting>MAX_JSON_DEPTH: fail('json_depth_exceeded')
                elif char in '}]': nesting-=1
            def unique_fields(pairs):
                result={}
                for key,value in pairs:
                    if key in result:fail('duplicate_json_key')
                    result[key]=value
                return result
            payload=json.loads(payload,parse_constant=lambda _:fail('non_finite_number'),object_pairs_hook=unique_fields)
        _json_depth(payload)
        encoded=json.dumps(payload,allow_nan=False,ensure_ascii=False,separators=(',',':')).encode('utf-8')
        if len(encoded)>MAX_PROGRAM_BYTES: fail('program_size_exceeded')
        _plain(payload)
        return payload
    except ProgramInvalid: raise
    except (ValueError,TypeError,UnicodeError,RecursionError,OverflowError):
        fail('invalid_json')


def _index(items,path):
    result={}
    for item in items:
        if item.id in result: fail('duplicate_id',path)
        result[item.id]=item
    return result


def _kind(value):
    kind=getattr(value,'kind',None)
    return 'text' if kind=='choice' else kind


def _distinct(values,path):
    if len(set(values))!=len(values):fail('duplicate_reference',path)


def _nodes(node,depth=1):
    if hasattr(node,'model_dump'):
        yield node,depth
        for item in node.__dict__.values():
            if hasattr(item,'model_dump'): yield from _nodes(item,depth+1)
            elif isinstance(item,list):
                for child in item:
                    if hasattr(child,'model_dump'): yield from _nodes(child,depth+1)


class Compiler:
    def __init__(self,program):
        self.p=program
        self.slots=_index(program.world.state,'world.state')
        self.materials=_index(program.world.materials,'world.materials')
        self.objects=_index(program.world.objects,'world.objects')
        self.components=_index(program.components,'components')
        self.actions=_index(program.actions,'actions')
        self.goals=_index(program.goals,'goals')
        self.evidence=_index(program.evidence,'evidence')
        self.spaces=_index(program.presentation.spaces,'presentation.spaces')
        self.rules={identifier:[] for identifier in self.actions}
        self.initial={identifier:copy.deepcopy(slot.initial) for identifier,slot in self.slots.items()}

    def slot(self,ref,path):
        if ref not in self.slots: fail('unknown_state_reference',path)
        return self.slots[ref]

    def term_type(self,node,inputs,path):
        if node.kind=='literal':
            if type(node.value) is bool:return 'boolean'
            if type(node.value) is int:
                if abs(node.value)>1000000:fail('literal_number_out_of_bounds',path)
                return 'integer'
            return 'text'
        if node.kind=='state': return _kind(self.slot(node.ref,path))
        if node.kind=='input':
            if node.ref not in inputs: fail('unknown_action_input',path)
            return _kind(inputs[node.ref])
        types=[self.term_type(arg,inputs,path) for arg in node.args]
        if node.op in {'add','subtract','multiply'}:
            if len(types)!=2 or types!=['integer','integer']:fail('numeric_operator_type_mismatch',path)
            return 'integer'
        if len(types)!=1:fail('operator_arity_invalid',path)
        expected={'count':{'id_set','id_list'},'word_count':{'text'},'present':{'artifact'}}[node.op]
        if types[0] not in expected: fail('operator_type_mismatch',path)
        return 'boolean' if node.op=='present' else 'integer'

    def condition(self,node,inputs,path,*,allow_goal=True):
        nodes=list(_nodes(node))
        if len(nodes)>self.p.limits.maxExpressionNodes or max(depth for _,depth in nodes)>self.p.limits.maxExpressionDepth:
            fail('expression_budget_exceeded',path)
        if node.kind=='always':return
        if node.kind=='goal':
            if not allow_goal or node.goalId not in self.goals:fail('invalid_goal_reference',path)
            return
        if node.kind in {'all','any'}:
            for child in node.conditions:self.condition(child,inputs,path,allow_goal=allow_goal)
            return
        if node.kind=='not':return self.condition(node.condition,inputs,path,allow_goal=allow_goal)
        if node.kind=='compare':
            left=self.term_type(node.left,inputs,path);right=self.term_type(node.right,inputs,path)
            if left!=right:fail('comparison_type_mismatch',path)
            if node.op not in {'eq','ne'} and left!='integer':fail('ordered_comparison_requires_integer',path)
        elif node.kind=='contains':
            if self.term_type(node.collection,inputs,path) not in {'id_set','id_list'} or self.term_type(node.item,inputs,path)!='text':
                fail('membership_type_mismatch',path)

    def validate(self):
        p=self.p
        targets={item.skillId for item in p.intent.targets}
        if len(targets)!=len(p.intent.targets): fail('duplicate_skill_target','intent.targets')
        for target in p.intent.targets:
            if target.skillId not in catalog(): fail('unknown_k5_skill','intent.targets')
            if target.demonstration != catalog()[target.skillId]['subskill']:
                fail('catalog_demonstration_mismatch','intent.targets')
        observations=_index(p.intent.observations,'intent.observations')
        for observation in observations.values():
            if observation.skillId not in targets:fail('observation_skill_mismatch','intent.observations')
        for misconception in p.intent.misconceptions:
            _distinct(misconception.observationIds,'intent.misconceptions.observationIds')
            refs=[observations.get(ref) for ref in misconception.observationIds]
            if (misconception.skillId not in targets or any(ref is None or ref.skillId!=misconception.skillId for ref in refs)
                    or misconception.confidence>max((ref.confidence for ref in refs if ref),default=0)):
                fail('misconception_provenance_invalid','intent.misconceptions')
        if not set(p.intent.successEvidence)<=set(self.evidence):fail('unknown_success_evidence','intent.successEvidence')
        _distinct(p.intent.successEvidence,'intent.successEvidence')
        selected_skills={skill for ref in p.intent.successEvidence for skill in self.evidence[ref].skillIds}
        if not targets<=selected_skills:fail('selected_target_evidence_missing','intent.successEvidence')
        if p.provenance.origin=='ai_composed' and (not p.provenance.model or not p.provenance.promptVersion):
            fail('generation_provenance_required','provenance')
        self._materials();self._objects()
        # Check goal references before evaluating entry-space visibility. A
        # self-referential goal must never recurse through a presentation guard.
        for goal in self.goals.values():self.condition(goal.when,{},'goals',allow_goal=False)
        self._components();self._actions_rules();self._goals_evidence();self.check_state(self.initial)
        if self.evaluate(p.completion.when,self.initial,{}):fail('mission_initially_complete','completion')
        return self

    def _materials(self):
        for material in self.materials.values():
            _index(material.items,'world.materials.items')
            if material.kind=='unit_tiles':
                if material.quantity is None or material.text is not None or material.items:fail('invalid_tile_material','world.materials')
            elif material.kind=='passage':
                if not material.text or len(material.items)<2 or material.quantity is not None:fail('complete_passage_required','world.materials')
                if any(item.text not in material.text for item in material.items):fail('passage_sentence_not_in_material','world.materials')
            elif material.kind=='words':
                if len(material.items)<2 or material.quantity is not None:fail('word_pieces_required','world.materials')
            elif not material.text or material.quantity is not None:fail('prompt_material_required','world.materials')

    def _objects(self):
        _index(self.p.world.relationships,'world.relationships')
        for obj in self.objects.values():
            expected=OBJECT_PORTS[obj.kind]
            if set(obj.bindings)!=set(expected):fail('object_ports_invalid','world.objects.bindings')
            for role,ref in obj.bindings.items():
                if self.slot(ref,'world.objects.bindings').kind!=expected[role]:fail('object_port_type_mismatch','world.objects.bindings')
            if len(set(obj.bindings.values()))!=len(obj.bindings):fail('aliased_object_ports','world.objects.bindings')
            if not set(obj.materialIds)<=set(self.materials):fail('unknown_material_reference','world.objects.materialIds')
            _distinct(obj.materialIds,'world.objects.materialIds')
            materials=[self.materials[ref] for ref in obj.materialIds]
            if obj.kind=='grid':
                if obj.width is None or obj.height is None:fail('grid_bounds_required','world.objects')
                rows=self.slots[obj.bindings['rows']];columns=self.slots[obj.bindings['columns']]
                if rows.minimum<1 or rows.maximum>obj.height or columns.minimum<1 or columns.maximum>obj.width:
                    fail('grid_dimensions_out_of_bounds','world.objects')
                tiles=[item for item in materials if item.kind=='unit_tiles']
                if len(tiles)!=1:fail('grid_tile_material_required','world.objects')
                cells=self.slots[obj.bindings['cells']]
                if cells.maxItems>min(120,obj.width*obj.height):fail('grid_cell_budget_invalid','world.objects')
                for cell in cells.options:
                    match=re.fullmatch(r'r(\d{1,2})c(\d{1,2})',cell)
                    if not match or int(match[1])>=obj.height or int(match[2])>=obj.width:fail('grid_cell_reference_invalid','world.objects')
            elif obj.width is not None or obj.height is not None:fail('bounds_only_apply_to_grid','world.objects')
            if obj.kind=='quantity_pool' and self.slots[obj.bindings['count']].minimum<0:fail('negative_quantity_domain','world.objects')
            if obj.kind=='evidence_board' and not any(item.kind=='passage' for item in materials):fail('evidence_passage_required','world.objects')
            if obj.kind=='sequence' and not any(item.kind=='words' for item in materials):fail('sequence_material_required','world.objects')
            if obj.kind in {'evidence_board','sequence'}:
                material_kind='passage' if obj.kind=='evidence_board' else 'words'
                identifiers=[item.id for material in materials if material.kind==material_kind for item in material.items]
                if len(set(identifiers))!=len(identifiers):fail('ambiguous_material_item_reference','world.objects.materialIds')
            if obj.kind in {'audio_artifact','drawing_artifact'}:
                if self.slots[obj.bindings['artifact']].mediaKind!=('audio' if obj.kind=='audio_artifact' else 'drawing'):
                    fail('artifact_media_mismatch','world.objects')
        for relation in self.p.world.relationships:
            if relation.source not in self.objects or relation.target not in self.objects or relation.source==relation.target:
                fail('invalid_relationship_reference','world.relationships')
            if relation.kind=='same_whole' and (self.objects[relation.source].kind!='grid' or self.objects[relation.target].kind!='grid'):
                fail('same_whole_requires_grids','world.relationships')
        for invariant in self.p.world.invariants:
            slots=[self.slot(ref,'world.invariants') for ref in invariant.stateRefs]
            if len(set(invariant.stateRefs))!=len(slots) or any(slot.kind!='integer' or slot.minimum<0 or slot.unit!=invariant.unit for slot in slots):
                fail('quantity_conservation_domain_invalid','world.invariants')

    def _components(self):
        if self.p.presentation.entrySpace not in self.spaces:fail('unknown_entry_space','presentation.entrySpace')
        if not set(self.p.presentation.assets)<=ASSETS:fail('unsupported_asset','presentation.assets')
        _distinct(self.p.presentation.assets,'presentation.assets')
        for space in self.spaces.values():
            if space.visibleWhen:self.condition(space.visibleWhen,{},'presentation.spaces')
        entry=self.spaces[self.p.presentation.entrySpace]
        if entry.visibleWhen and not self.evaluate(entry.visibleWhen,self.initial,{}):fail('entry_space_not_visible','presentation.entrySpace')
        for component in self.components.values():
            if component.spaceId not in self.spaces:fail('unknown_component_space','components')
            if not set(component.objectIds)<=set(self.objects) or len(set(component.objectIds))!=len(component.objectIds):fail('unknown_component_object','components')
            if any(self.objects[ref].kind not in COMPONENT_OBJECTS[component.kind] for ref in component.objectIds):fail('incompatible_component_object','components')

    def _actions_rules(self):
        _index(self.p.rules,'rules')
        for rule in self.p.rules:
            if rule.onAction not in self.actions:fail('unknown_rule_action','rules.onAction')
            self.rules[rule.onAction].append(rule)
        for action in self.actions.values():
            if action.componentId not in self.components:fail('unknown_action_component','actions')
            component=self.components[action.componentId];cap=CAPABILITIES[action.operation]
            if component.kind!=cap['component']:fail('operation_component_mismatch','actions')
            inputs=_index(action.inputs,'actions.inputs')
            if {key:value.kind for key,value in inputs.items()}!=cap['inputKinds']:fail('operation_input_signature_invalid','actions.inputs')
            objects=[self.objects[ref] for ref in component.objectIds]
            relevant=[obj for obj in objects if obj.kind==cap['objectKind']]
            if not relevant:fail('operation_object_required','actions')
            rules=self.rules[action.id]
            if not rules or len(rules)>self.p.limits.maxRulesPerAction or sum(len(rule.effects) for rule in rules)>self.p.limits.maxEffectsPerAction:
                fail('action_effect_budget_invalid','rules')
            operation_roles={
                'toggle_tile':{'cells'},'resize_rectangle':{'rows','columns'},
                'assemble_product':{'left','right','result'},'replace_text':{'text'},'revise_text':{'text'},
                'transfer_quantity':{'count'},'select_evidence':{'selection'},'reorder':{'order'},
                'record_voice':{'artifact'},'draw':{'artifact'},
            }[action.operation]
            writable={obj.bindings[role] for obj in relevant for role in operation_roles}
            if 'set' in cap['effectKinds']:
                writable.update(obj.bindings['value'] for obj in objects if obj.kind=='progress')
            changed=set();written_by_rule={}
            for rule in rules:
                self.condition(rule.when,inputs,'rules.when')
                local=set()
                for effect in rule.effects:
                    if effect.kind not in cap['effectKinds']:fail('operation_effect_not_supported','rules.effects')
                    nodes=list(_nodes(effect))
                    if len(nodes)>self.p.limits.maxExpressionNodes or max(depth for _,depth in nodes)>self.p.limits.maxExpressionDepth:fail('expression_budget_exceeded','rules.effects')
                    targets={effect.source,effect.target} if effect.kind=='transfer' else {effect.target}
                    if not targets<=writable:fail('effect_outside_component_state','rules.effects')
                    for ref in targets:
                        if not self.slot(ref,'rules.effects').mutable:fail('immutable_state_write','rules.effects')
                        if ref in local:fail('conflicting_effects','rules.effects')
                        if ref in written_by_rule:
                            for previous in written_by_rule[ref]:
                                complementary=((rule.when.kind=='not' and rule.when.condition==previous.when)
                                               or (previous.when.kind=='not' and previous.when.condition==rule.when))
                                if not complementary:fail('potentially_conflicting_rules','rules')
                        written_by_rule.setdefault(ref,[]).append(rule)
                    local.update(targets);changed.update(targets)
                    if effect.kind=='set':
                        if self.term_type(effect.value,inputs,'rules.effects')!=_kind(self.slots[effect.target]):fail('effect_value_type_mismatch','rules.effects')
                        if any(effect.target in inv.stateRefs for inv in self.p.world.invariants):fail('conserved_quantity_requires_transfer','rules.effects')
                        domain=self.term_domain(effect.value,inputs);target=self.slots[effect.target]
                        if target.kind=='integer' and isinstance(domain,tuple) and (domain[0]>target.maximum or domain[1]<target.minimum):
                            fail('state_write_provably_out_of_bounds','rules.effects')
                        if target.kind=='choice' and isinstance(domain,set) and not domain.intersection(target.options):
                            fail('state_write_outside_choice_domain','rules.effects')
                        if target.kind=='text' and isinstance(domain,set) and all(len(value)>target.maxLength for value in domain):
                            fail('state_write_provably_out_of_bounds','rules.effects')
                    elif effect.kind in {'toggle_item','add_item','remove_item'}:
                        if self.slots[effect.target].kind!='id_set' or self.term_type(effect.item,inputs,'rules.effects')!='text':fail('collection_effect_type_mismatch','rules.effects')
                    else:
                        source=self.slots[effect.source];target=self.slots[effect.target]
                        if (source.kind!='integer' or target.kind!='integer' or source.unit!=target.unit
                            or effect.source==effect.target or self.term_type(effect.amount,inputs,'rules.effects')!='integer'
                            or not any({effect.source,effect.target}<=set(inv.stateRefs) for inv in self.p.world.invariants)):
                            fail('quantity_transfer_inconsistent','rules.effects')
            relevant=self._action_objects(action,relevant,rules)
            self._operation_semantics(action,relevant,rules,changed)

    def _action_objects(self,action,objects,rules):
        targets={effect.target for rule in rules for effect in rule.effects}
        touched=[obj for obj in objects if targets.intersection(obj.bindings.values())]
        if action.operation=='transfer_quantity':return touched
        if not touched or (len(touched)>1 and action.operation!='replace_text'):
            fail('operation_object_ambiguous','actions')
        return touched

    def _operation_semantics(self,action,objects,rules,changed):
        bindings=objects[0].bindings;effects=[effect for rule in rules for effect in rule.effects]
        required={
            'resize_rectangle':{'rows':'rows','columns':'columns'},
            'assemble_product':{'left':'left','right':'right','result':'result'},
            'replace_text':{'text':'text'},'revise_text':{'text':'text'},
            'select_evidence':{'selection':'sentence'},'reorder':{'order':'order'},
            'record_voice':{'artifact':'artifact'},'draw':{'artifact':'artifact'},
        }.get(action.operation,{})
        for rule in rules:
            for obj in objects:
                # replace_text can initialize two displayed draft views from
                # the same input. Every primary write, on every branch, must
                # retain the child's value rather than manufacture an answer.
                primary={obj.bindings[role]:input_id for role,input_id in required.items()}
                relevant=[effect for effect in rule.effects if effect.target in primary]
                if action.operation!='replace_text' and set(effect.target for effect in relevant)!=set(primary):
                    fail('operation_must_use_child_input','rules.effects')
                if any(effect.kind!='set' or effect.value.kind!='input' or effect.value.ref!=primary[effect.target] for effect in relevant):
                    fail('operation_must_use_child_input','rules.effects')
            if required and not any(effect.target in {obj.bindings[role] for obj in objects for role in required} for effect in rule.effects):
                fail('operation_must_use_child_input','rules.effects')
        if action.operation=='toggle_tile':
            if any(effect.kind!='toggle_item' or effect.target!=bindings['cells'] or effect.item.kind!='input' or effect.item.ref!='cell' for effect in effects):fail('operation_must_use_child_input','rules.effects')
            input_domain=set(action.inputs[0].options)
            if not input_domain<=set(self.slots[bindings['cells']].options):fail('tile_input_outside_board','actions.inputs')
        if action.operation=='transfer_quantity':
            if any(effect.kind!='transfer' or effect.amount.kind!='input' or effect.amount.ref!='amount' for effect in effects):fail('operation_must_use_child_input','rules.effects')
            if action.inputs[0].minimum<1:fail('positive_transfer_required','actions.inputs')
            if action.inputs[0].maximum>120:fail('quantity_operation_budget_exceeded','actions.inputs')
        if action.operation=='resize_rectangle':
            params={item.id:item for item in action.inputs}
            if params['rows'].minimum<1 or params['rows'].maximum>objects[0].height or params['columns'].minimum<1 or params['columns'].maximum>objects[0].width:
                fail('rectangle_input_outside_board','actions.inputs')
        if action.operation=='select_evidence':
            passages=[self.materials[ref] for ref in objects[0].materialIds if self.materials[ref].kind=='passage']
            offered={item.id for passage in passages for item in passage.items}
            if not set(action.inputs[0].options)<=offered or not offered<=set(self.slots[bindings['selection']].options):fail('evidence_input_not_in_passage','actions.inputs')
        if action.operation=='reorder':
            words=[self.materials[ref] for ref in objects[0].materialIds if self.materials[ref].kind=='words']
            offered={item.id for material in words for item in material.items}
            if set(action.inputs[0].options)!=offered or set(self.slots[bindings['order']].options)!=offered or action.inputs[0].maxItems!=len(offered):fail('ordering_input_not_complete','actions.inputs')
        if action.operation in {'record_voice','draw'}:
            if action.inputs[0].mediaKind!=('audio' if action.operation=='record_voice' else 'drawing'):fail('artifact_input_media_mismatch','actions.inputs')
        if not any(self.slots[ref].kind!='boolean' for ref in changed):fail('decorative_progress_only_action','rules.effects')

    def _goals_evidence(self):
        for goal in self.goals.values():
            self.condition(goal.when,{},'goals',allow_goal=False)
            if self.truth_domain(goal.when,{})=={False}:fail('goal_provably_unreachable','goals')
        self.condition(self.p.completion.when,{},'completion')
        if not set(self.p.completion.goalIds)<=set(self.goals):fail('unknown_completion_goal','completion.goalIds')
        _distinct(self.p.completion.goalIds,'completion.goalIds')
        mentioned={node.goalId for node,_ in _nodes(self.p.completion.when) if node.kind=='goal'}
        if mentioned!=set(self.p.completion.goalIds):fail('completion_goal_contract_mismatch','completion')
        if self.truth_domain(self.p.completion.when,{})=={False}:fail('completion_provably_unreachable','completion')
        targets={target.skillId for target in self.p.intent.targets}
        covered=set()
        # Numeric proxies derived from free text/artifacts cannot turn a manual
        # performance into automatic evidence. Propagate across state copies.
        tainted={ref for ref,slot in self.slots.items() if slot.kind in {'text','artifact','boolean'}}
        for _ in range(len(self.slots)):
            before=set(tainted)
            for action_id,rules in self.rules.items():
                manual=not CAPABILITIES[self.actions[action_id].operation]['automaticAssessment']
                for rule in rules:
                    for effect in rule.effects:
                        dependencies={node.ref for node,_ in _nodes(effect) if node.kind=='state'}
                        if manual or dependencies&tainted:
                            tainted.add(effect.target)
                            if effect.kind=='transfer':tainted.add(effect.source)
            if tainted==before:break
        for item in self.evidence.values():
            for field in ('skillIds','actionIds','stateRefs'):_distinct(getattr(item,field),'evidence.'+field)
            if not set(item.skillIds)<=targets or not set(item.actionIds)<=set(self.actions):fail('evidence_reference_invalid','evidence')
            for ref in item.stateRefs:self.slot(ref,'evidence.stateRefs')
            covered.update(item.skillIds)
            action_state={ref for action_id in item.actionIds for obj_id in self.components[self.actions[action_id].componentId].objectIds for ref in self.objects[obj_id].bindings.values()}
            if not set(item.stateRefs)<=action_state:fail('evidence_not_observable_from_actions','evidence')
            if item.assessment.kind=='automatic':
                if any(not CAPABILITIES[self.actions[ref].operation]['automaticAssessment'] for ref in item.actionIds):fail('unsupported_automatic_assessment','evidence.assessment')
                self.condition(item.assessment.when,{},'evidence.assessment',allow_goal=False)
                refs={node.ref for node,_ in _nodes(item.assessment.when) if node.kind=='state'}
                context={ref for ref,slot in self.slots.items() if not slot.mutable}
                if not refs or not refs<=set(item.stateRefs)|context or not refs.intersection(set(item.stateRefs)-context) or refs&tainted:fail('automatic_assessment_requires_checkable_state','evidence.assessment')
        if covered!=targets:fail('target_skill_evidence_missing','evidence')
        _index(self.p.help,'help')
        for help_item in self.p.help:
            _distinct(help_item.actionIds,'help.actionIds')
            if not set(help_item.actionIds)<=set(self.actions):fail('help_action_reference_invalid','help')
            self.condition(help_item.availableWhen,{},'help.availableWhen')

    def term_domain(self,node,inputs):
        """Sound relaxed domains reject certain impossibilities, prove no paths.

        Integer domains are inclusive intervals; text/boolean domains are finite
        sets when known and None when unconstrained. Correlations and action
        reachability are deliberately not inferred from independent intervals.
        """
        if node.kind=='literal':
            if type(node.value) is int:return (node.value,node.value)
            return {node.value}
        if node.kind in {'state','input'}:
            value=self.slots[node.ref] if node.kind=='state' else inputs[node.ref]
            if value.kind=='integer':
                if node.kind=='state' and not value.mutable:return (value.initial,value.initial)
                return (value.minimum,value.maximum)
            if value.kind=='boolean':return {value.initial} if not value.mutable else {True,False}
            if value.kind=='choice':return set(value.options) if node.kind=='input' or value.mutable else {value.initial}
            if value.kind=='text' and node.kind=='state' and not value.mutable:return {value.initial}
            return None
        if node.op in {'add','subtract','multiply'}:
            left=self.term_domain(node.args[0],inputs);right=self.term_domain(node.args[1],inputs)
            if node.op=='add':return (left[0]+right[0],left[1]+right[1])
            if node.op=='subtract':return (left[0]-right[1],left[1]-right[0])
            values=[a*b for a in left for b in right]
            return min(values),max(values)
        source=node.args[0]
        if node.op=='present':
            if source.kind=='state' and not self.slots[source.ref].mutable:return {False}
            return {False,True}
        if source.kind in {'state','input'}:
            value=self.slots[source.ref] if source.kind=='state' else inputs[source.ref]
            if source.kind=='state' and not value.mutable:
                count=len(value.initial.split()) if node.op=='word_count' else len(value.initial)
                return count,count
            if node.op=='word_count' and value.kind=='choice':
                counts=[len(option.split()) for option in value.options]
                return min(counts),max(counts)
            maximum=value.maxLength if node.op=='word_count' else value.maxItems
            if node.op=='count' and source.kind=='state':
                for obj in self.objects.values():
                    if obj.kind=='grid' and obj.bindings['cells']==source.ref:
                        material=next(self.materials[ref] for ref in obj.materialIds if self.materials[ref].kind=='unit_tiles')
                        maximum=min(maximum,material.quantity)
                        rows=self.slots[obj.bindings['rows']];columns=self.slots[obj.bindings['columns']]
                        if not rows.mutable and not columns.mutable:
                            maximum=min(maximum,sum(int(re.fullmatch(r'r(\d{1,2})c(\d{1,2})',cell)[1])<rows.initial and int(re.fullmatch(r'r(\d{1,2})c(\d{1,2})',cell)[2])<columns.initial for cell in value.options))
            return 0,maximum
        if source.kind=='literal' and node.op=='word_count':
            count=len(source.value.split());return count,count
        return 0,4000

    def truth_domain(self,node,inputs):
        if node.kind=='always':return {True}
        if node.kind=='goal':return self.truth_domain(self.goals[node.goalId].when,{})
        if node.kind=='not':return {not value for value in self.truth_domain(node.condition,inputs)}
        if node.kind in {'all','any'}:
            children=[self.truth_domain(child,inputs) for child in node.conditions]
            if node.kind=='all':
                if any(child=={False} for child in children):return {False}
                return {True} if all(child=={True} for child in children) else {True,False}
            if any(child=={True} for child in children):return {True}
            return {False} if all(child=={False} for child in children) else {True,False}
        if node.kind=='contains':return {True,False}
        left=self.term_domain(node.left,inputs);right=self.term_domain(node.right,inputs)
        if left is None or right is None:return {True,False}
        if isinstance(left,tuple) and isinstance(right,tuple):
            if node.op=='eq':
                if left[1]<right[0] or right[1]<left[0]:return {False}
                if left[0]==left[1]==right[0]==right[1]:return {True}
            elif node.op=='ne':
                opposite=self.truth_domain(type(node)(kind='compare',op='eq',left=node.left,right=node.right),inputs)
                return {not item for item in opposite}
            elif node.op=='lt':
                if left[0]>=right[1]:return {False}
                if left[1]<right[0]:return {True}
            elif node.op=='lte':
                if left[0]>right[1]:return {False}
                if left[1]<=right[0]:return {True}
            elif node.op=='gt':
                if left[1]<=right[0]:return {False}
                if left[0]>right[1]:return {True}
            elif node.op=='gte':
                if left[1]<right[0]:return {False}
                if left[0]>=right[1]:return {True}
            return {True,False}
        if isinstance(left,set) and isinstance(right,set):
            if node.op=='eq':return {a==b for a in left for b in right}
            if node.op=='ne':return {a!=b for a in left for b in right}
        return {True,False}

    def term(self,node,state,inputs):
        if node.kind=='literal':return node.value
        if node.kind=='state':return state[node.ref]
        if node.kind=='input':return inputs[node.ref]
        values=[self.term(arg,state,inputs) for arg in node.args]
        if node.op=='add':result=values[0]+values[1]
        elif node.op=='subtract':result=values[0]-values[1]
        elif node.op=='multiply':result=values[0]*values[1]
        elif node.op=='count':return len(values[0])
        elif node.op=='word_count':return len(values[0].split())
        else:return values[0] is not None
        if abs(result)>1000000000000:fail('arithmetic_budget_exceeded')
        return result

    def evaluate(self,node,state,inputs):
        if node.kind=='always':return True
        if node.kind=='goal':return self.evaluate(self.goals[node.goalId].when,state,{})
        if node.kind=='all':return all(self.evaluate(child,state,inputs) for child in node.conditions)
        if node.kind=='any':return any(self.evaluate(child,state,inputs) for child in node.conditions)
        if node.kind=='not':return not self.evaluate(node.condition,state,inputs)
        if node.kind=='contains':return self.term(node.item,state,inputs) in self.term(node.collection,state,inputs)
        left=self.term(node.left,state,inputs);right=self.term(node.right,state,inputs)
        if node.left.kind=='state' and self.slots[node.left.ref].kind=='id_set':
            left,right=set(left),set(right)
        return {'eq':lambda:left==right,'ne':lambda:left!=right,'lt':lambda:left<right,
                'lte':lambda:left<=right,'gt':lambda:left>right,'gte':lambda:left>=right}[node.op]()

    def check_state(self,state):
        for ref,value in state.items():
            slot=self.slots[ref]
            if slot.kind=='integer' and (type(value) is not int or not slot.minimum<=value<=slot.maximum):fail('state_integer_bounds_violated','world.state')
            if slot.kind=='boolean' and type(value) is not bool:fail('state_type_violated','world.state')
            if slot.kind=='text' and (not isinstance(value,str) or len(value)>slot.maxLength):fail('state_text_bounds_violated','world.state')
            if slot.kind=='choice' and value not in slot.options:fail('state_choice_domain_violated','world.state')
            if slot.kind in {'id_set','id_list'} and (not isinstance(value,list) or len(value)>slot.maxItems or len(set(value))!=len(value) or not set(value)<=set(slot.options)):
                fail('state_collection_bounds_violated','world.state')
        for invariant in self.p.world.invariants:
            if sum(state[ref] for ref in invariant.stateRefs)!=invariant.total:fail('quantity_conservation_violated','world.invariants')
        for obj in self.objects.values():
            if obj.kind=='grid':
                rows=state[obj.bindings['rows']];columns=state[obj.bindings['columns']];cells=state[obj.bindings['cells']]
                if rows*columns>120:fail('grid_area_budget_exceeded','world.objects')
                if any(int(re.fullmatch(r'r(\d{1,2})c(\d{1,2})',cell)[1])>=rows or int(re.fullmatch(r'r(\d{1,2})c(\d{1,2})',cell)[2])>=columns for cell in cells):fail('tile_outside_current_rectangle','world.objects')
                tiles=next(self.materials[ref] for ref in obj.materialIds if self.materials[ref].kind=='unit_tiles')
                if len(cells)>tiles.quantity:fail('tile_stock_exceeded','world.objects')

    def witness(self):
        if self.p.witness is None:return [],0
        if len(self.p.witness)>self.p.limits.maxActions:fail('witness_action_budget_exceeded','witness')
        state=copy.deepcopy(self.initial);used=set()
        for step in self.p.witness:
            if step.actionId not in self.actions:fail('unknown_witness_action','witness')
            action=self.actions[step.actionId];component=self.components[action.componentId]
            space=self.spaces[component.spaceId]
            if space.visibleWhen and not self.evaluate(space.visibleWhen,state,{}):fail('witness_space_unavailable','witness')
            params={item.id:item for item in action.inputs}
            if set(params)!=set(step.inputs):fail('witness_input_signature_invalid','witness')
            for ref,param in params.items():
                value=step.inputs[ref]
                if param.kind=='integer' and (type(value) is not int or not param.minimum<=value<=param.maximum):fail('witness_integer_input_invalid','witness')
                if param.kind=='text' and (not isinstance(value,str) or not (param.minLength or 1)<=len(value.strip())<=param.maxLength):fail('witness_text_input_invalid','witness')
                if param.kind=='choice' and value not in param.options:fail('witness_choice_input_invalid','witness')
                if param.kind=='id_list' and (not isinstance(value,list) or len(value)!=len(param.options) or set(value)!=set(param.options)):fail('witness_order_input_invalid','witness')
                if param.kind=='artifact' and (not isinstance(value,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_.-]{0,79}',value)):fail('witness_artifact_reference_invalid','witness')
            active=[rule for rule in self.rules[action.id] if self.evaluate(rule.when,state,step.inputs)]
            if not active:fail('witness_action_guard_unsatisfied','witness')
            if action.operation=='revise_text':
                objs=[self.objects[ref] for ref in component.objectIds if self.objects[ref].kind=='text_artifact']
                obj=self._action_objects(action,objs,self.rules[action.id])[0]
                if not state[obj.bindings['text']] or state[obj.bindings['text']]==step.inputs['text']:fail('revision_requires_changed_existing_draft','witness')
            next_state=copy.deepcopy(state)
            for rule in active:
                for effect in rule.effects:
                    if effect.kind=='set':next_state[effect.target]=self.term(effect.value,state,step.inputs)
                    elif effect.kind=='transfer':
                        amount=self.term(effect.amount,state,step.inputs)
                        if amount<=0:fail('positive_transfer_required','witness')
                        next_state[effect.source]-=amount;next_state[effect.target]+=amount
                    else:
                        item=self.term(effect.item,state,step.inputs);collection=next_state[effect.target]
                        if effect.kind=='toggle_item':
                            collection.remove(item) if item in collection else collection.append(item)
                        elif effect.kind=='add_item':
                            if item not in collection:collection.append(item)
                        elif item in collection:collection.remove(item)
            self.check_state(next_state)
            if next_state==state:fail('witness_action_has_no_visible_change','witness')
            state=next_state;used.add(action.id)
        if not self.evaluate(self.p.completion.when,state,{}):fail('witness_does_not_finish_mission','witness')
        for target in self.p.intent.targets:
            relevant=[self.evidence[ref] for ref in self.p.intent.successEvidence if target.skillId in self.evidence[ref].skillIds]
            if not any(used.intersection(item.actionIds) for item in relevant):fail('witness_missing_target_action','witness')
        return [goal.id for goal in self.p.goals if self.evaluate(goal.when,state,{})],len(self.p.witness)


def validate_program(payload,*,check_witness=True):
    """Authoritative offline validation; every status deliberately limits its claim."""
    program=None;phase='structural'
    try:
        program=ActivityProgram.model_validate(_decode(payload))
        compiler=Compiler(program).validate()
        canonical=json.dumps(program.model_dump(),sort_keys=True,separators=(',',':'),ensure_ascii=False)
        digest=hashlib.sha256(canonical.encode()).hexdigest()
        if check_witness and program.witness is not None:
            phase='computational';goals,steps=compiler.witness()
            return ValidationReport(valid=True,structural='passed',computational='witness_verified',definitionSha256=digest,witnessSteps=steps,achievedGoalIds=goals)
        return ValidationReport(valid=True,structural='passed',computational='not_checked',definitionSha256=digest)
    except ProgramInvalid as error:
        return ValidationReport(valid=False,structural='failed' if phase=='structural' else 'passed',computational='failed' if phase=='computational' else 'not_checked',issues=[ValidationIssue(code=error.code,path=error.path)])
    except ValidationError:
        # Pydantic's formatted errors include input values and extra-field names.
        # Keep the error public/content-free; callers can inspect their own file.
        return ValidationReport(valid=False,structural='failed',computational='not_checked',issues=[ValidationIssue(code='schema_invalid',path='')])
    except (ValueError,TypeError,KeyError,RecursionError,OverflowError):
        return ValidationReport(valid=False,structural='failed',computational='not_checked',issues=[ValidationIssue(code='invalid_program',path='')])


def require_valid_program(payload,*,check_witness=True):
    report=validate_program(payload,check_witness=check_witness)
    if not report.valid:
        issue=report.issues[0];raise ProgramInvalid(issue.code,issue.path)
    return ActivityProgram.model_validate(_decode(payload))
