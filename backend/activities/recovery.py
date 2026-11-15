"""Bounded, content-free composition diagnostics and scene repair contracts.

Only machine reason codes/locations leave this module. Candidate activity data is
kept in memory for repair; provider errors and validation inputs are never logged.
"""
from pydantic import ValidationError, model_validator
import re
from functools import lru_cache
from typing import Literal
from pydantic import Field

from backend.provider import ExtractionError
from .models import Closed, Scene


class ActivitySceneRepair(Closed):
    scene: Scene

    @model_validator(mode='before')
    @classmethod
    def canonical_scene_state(cls, value):
        from .composition import derive_answers
        if isinstance(value, dict) and isinstance(value.get('scene'), dict):
            return {**value, 'scene': derive_answers({'scenes': [value['scene']]})['scenes'][0]}
        return value


class SceneReviewIssue(Closed):
    sceneId: str = Field(min_length=1, max_length=80)
    code: Literal['goal_state_conflict', 'area_multiplication_connection_missing', 'incorrect_units',
        'answer_state_mismatch', 'teaching_state_mismatch', 'decorative_action', 'missing_material',
        'not_fresh', 'independent_cue', 'wrong_response_modality', 'ambiguous_language',
        'unsafe_content', 'target_action_missing']


REVIEW_CONSTRAINTS = {
    'goal_state_conflict': 'Make the visible starting state, requested action and goal mutually consistent and reachable.',
    'area_multiplication_connection_missing': 'Connect actual rectangle covering or design to a guided rows-times-columns expression using the saved rectangle output.',
    'incorrect_units': 'Use a length unit on rectangle sides and its corresponding square unit for area; keep scale exact.',
    'answer_state_mismatch': 'Derive the checkable answer from the actual offered component state and goal, accepting all valid supported constructions.',
    'teaching_state_mismatch': 'Correct the teaching, prompt and feedback to describe the implemented state; dynamic links must not assert placeholder dimensions as actual child work.',
    'decorative_action': 'Require a meaningful action whose state change directly exercises the target demonstration; arbitrary clicks or copying are insufficient.',
    'missing_material': 'Supply the actual passage, diagram, board objects, source audio or other material needed to complete this scene.',
    'not_fresh': 'Replace the challenge material and quantities with a fresh task that is not rehearsed in guided or prior independent work.',
    'independent_cue': 'Remove all teaching, hints, worked answers and incoming guided-state connections from the independent scene.',
    'wrong_response_modality': 'Use the actual response mode required by the coverage demonstration, with parent review for subjective artifacts.',
    'ambiguous_language': 'Make the requested task and objectively assessed response unambiguous, with all valid alternatives represented.',
    'unsafe_content': 'Replace unsafe scene content with age-appropriate original learning material.',
    'target_action_missing': 'Use a compatible component action that demonstrates the exact mapped subskill rather than another skill.',
}


class CompositionFailure(ValueError):
    def __init__(self, category, code, *, scene_index=None, field=None, constraint=None):
        self.diagnostic = dict(category=category, code=code, sceneIndex=scene_index,
                               field=field, constraint=constraint)
        super().__init__(code)


# These are server-authored constraints, never generated/provider exception text.
# Giving the composer a concrete correction is useful without echoing private
# values or letting arbitrary exception messages become instructions.
_CONSTRAINTS = {
    'Area action requires Math and its actual rectangle state': ('schema', 'area_state_missing', 'Use Math with params.area containing bounded rows, columns and targetArea.'),
    'Area board uses equal unit squares, zero origin and its actual rectangle state': ('schema', 'area_unit_contract', "Use step='1', origin='0', objects=[], tokens=[] and the actual area state."),
    'Area rectangle must fit the reachable board and tile bound': ('schema', 'area_out_of_bounds', 'Keep rows and columns within board height/width, at most 12 each, and their product at most 120.'),
    'Area mission requires more than one unit square': ('schema', 'area_too_small', 'Choose an area target of at least two unit squares.'),
    'Area design must require changing the starting rectangle': ('scoring', 'area_design_already_complete', 'Choose starting rows times columns different from targetArea so the child must reshape the rectangle.'),
    'Area target needs a reachable rectangle factor pair': ('scoring', 'unreachable_area', 'Choose a targetArea with at least one positive whole-number factor pair that fits this board.'),
    'Area target must equal the rectangle unit-square count': ('scoring', 'area_product_mismatch', 'For area_tile and area_expression, targetArea must equal rows times columns.'),
    'Area scoring must be derived from the actual component state': ('scoring', 'area_key_mismatch', 'Keep area keys derived from public params.area; fix the public state rather than inventing a key.'),
    'Editing requires an original draft': ('schema', 'missing_edit_draft', "Supply a nonempty original initialText unless this guided edit has a valid incoming draft_text connection; that runtime-filled placeholder may be blank."),
    'Board marks must be distinct': ('scoring', 'duplicate_marks', 'Use distinct reachable board marks.'),
    'Marks must use reachable integer board positions': ('scoring', 'unreachable_marks', 'Use integer marks within the displayed board bounds.'),
    'A ruler or number line has marks on its horizontal axis': ('scoring', 'off_axis_marks', 'Ruler and number-line marks require y=0.'),
    'Workspace answer must agree with its exact math rule': ('scoring', 'inconsistent_math_rule', 'The key must agree with the exact rule and visible board state.'),
    'Math rule result must equal its exact arithmetic': ('scoring', 'incorrect_arithmetic', 'Compute the result exactly from the stated operands.'),
    'Math rule requires the correct nonzero operands': ('scoring', 'invalid_operands', 'Use the correct number of operands and a nonzero divisor.'),
    'Selected measure must agree with the arithmetic result': ('scoring', 'inconsistent_measure', 'The selected measure must match the board scale and rule result.'),
    'Allocated quantity must represent the arithmetic result': ('scoring', 'inconsistent_quantity', 'Derive the result from the allocated quantities and unit value.'),
    'Quantity goal must be reachable from the stock': ('scoring', 'unreachable_quantity', 'Keep allocations nonnegative and within the offered stock.'),
    'Quantity goal requires a meaningful scene change': ('scoring', 'unchanged_quantity', 'Require the child to move pieces from the starting allocation.'),
    'Multiplication must build the stated number of equal groups': ('scoring', 'unequal_groups', 'Use the stated number of containers with equal quantities in each.'),
    'Automatic sorting must distinguish at least two target relationships': ('scoring', 'decorative_sort', 'Require at least two meaningful target relationships.'),
    'Objects must fit the visible board': ('schema', 'off_board_object', 'All object extents must fit the visible board.'),
    'Shapes must have positive dimensions': ('schema', 'invalid_shape', 'Shapes require positive dimensions.'),
    'Independent family scenes must remove teaching cues': ('schema', 'independent_cues', 'Set independent teachingText to null and remove all hints/worked examples.'),
    'Independent controls must remove teaching cues': ('schema', 'independent_cues', 'Set independent teachingText to null and remove all hints/worked examples.'),
    'Guided family scenes require teaching text': ('schema', 'missing_teaching', 'Supply brief teaching text for this guided action.'),
    'Guided controls require teaching text': ('schema', 'missing_teaching', 'Supply brief teaching text for this guided action.'),
    'Independent control must use fresh content': ('schema', 'not_fresh', 'Use new independent materials and quantities, distinct from guided content.'),
    'Independent family challenge requires fresh content': ('schema', 'not_fresh', 'Use new independent materials and quantities, distinct from guided content.'),
    'Activity tasks must be distinct': ('schema', 'duplicate_task', 'Use distinct material and a fresh independent task.'),
    'Scenes require a linear guided-to-independent transition': ('schema', 'invalid_transition', 'Keep scene IDs, phase and nextSceneId in the required linear order.'),
    'Catalog demonstration requires its actual response modality': ('schema', 'wrong_response_modality', 'Use the response modality required by coveragePath.constraints.'),
    'This catalog demonstration requires an honest parent review': ('scoring', 'parent_review_required', 'Use parent_review and explicit objective-specific criteria.'),
    'Workspace mode does not demonstrate this catalog objective': ('schema', 'incompatible_workspace', 'Choose a workspace mode allowed by coveragePath.constraints.'),
    'Original writing needs parent review rather than one exact phrase': ('scoring', 'writing_requires_review', 'Use parent_review for open original writing rather than one exact key.'),
    'Tiles must be scrambled rather than display the solution': ('schema', 'ordered_initial_tiles', 'Scramble the initial offered tiles rather than show the solved order.'),
    'Ordering key must match the requested numeric order': ('scoring', 'incorrect_order', 'Derive the numeric order from the offered tile values.'),
    'Activity must use a compatible guided action for this catalog demonstration': ('review', 'missing_target_action', 'Require a meaningful compatible guided action that exercises this demonstration.'),
}


@lru_cache(maxsize=1)
def _schema_fields():
    from .models import ActivitySpec
    allowed = set()
    def collect(value):
        if isinstance(value, dict):
            allowed.update(value.get('properties', {}))
            for item in value.values():
                collect(item)
        elif isinstance(value, list):
            for item in value:
                collect(item)
    collect(ActivitySpec.model_json_schema())
    return allowed


def diagnostic(error, *, scene_index=None, field=None):
    """Return a bounded allowlist without inputs, messages, or provider bodies."""
    from .composition import SceneValidationError
    located = error
    if isinstance(error, ValidationError):
        located = next((item.get('ctx', {}).get('error') for item in error.errors(include_input=False, include_url=False)
                        if hasattr(item.get('ctx', {}).get('error'), 'scene_index')), error)
    if isinstance(located, SceneValidationError):
        detail = _CONSTRAINTS.get(getattr(located, 'detail', ''))
        category, code, constraint = detail or (
            'scoring' if getattr(located, 'reason_code', '').startswith('scoring') else 'schema',
            getattr(located, 'reason_code', 'scene_constraint'),
            getattr(located, 'repair_constraint', None) or getattr(located, 'constraint', 'component_contract'))
        result = dict(category=category, code=code, sceneIndex=located.scene_index,
                      field=None, constraint=constraint)
    elif isinstance(error, CompositionFailure):
        result = dict(error.diagnostic)
    elif isinstance(error, ExtractionError):
        supplied = getattr(error, 'diagnostic', None)
        if isinstance(supplied, dict):
            result = {key: supplied.get(key) for key in ('category', 'code', 'sceneIndex', 'field', 'constraint')}
            result['category'] = supplied.get('category', supplied.get('stage'))
            if result['category'] not in {'provider', 'schema', 'scoring', 'review'}:
                result['category'] = 'schema'
        else:
            code = error.code if error.code in {'provider_timeout', 'provider_unavailable', 'provider_not_configured', 'configuration_error'} else 'provider_response_schema'
            result = dict(category='schema' if code == 'provider_response_schema' else 'provider', code=code,
                          sceneIndex=None, field=None, constraint=None)
    elif isinstance(error, ValidationError):
        errors = error.errors(include_input=False, include_url=False, include_context=False)
        # Union branches produce many irrelevant errors. Prefer a matching
        # discriminant branch's actual field over literal component mismatches.
        selected = next((item for item in errors if item['type'] != 'literal_error'), errors[0])
        location = selected.get('loc', ())
        inferred = next((location[index + 1] for index, value in enumerate(location[:-1])
                         if value == 'scenes' and isinstance(location[index + 1], int)), None)
        names = [str(value) for value in location if isinstance(value, str) and value in _schema_fields()]
        code = selected['type'] if selected['type'] in {'missing', 'extra_forbidden', 'string_too_short', 'string_too_long', 'greater_than_equal', 'less_than_equal', 'literal_error', 'int_type', 'float_type', 'value_error', 'list_type', 'string_type'} else 'invalid_field'
        result = dict(category='schema', code=code, sceneIndex=inferred,
                      field='.'.join(names[-3:])[:100] or None, constraint=None)
    else:
        # Only exceptions produced by our own component validators can select a
        # specific message. Arbitrary provider exceptions remain opaque.
        known = _CONSTRAINTS.get(str(error)) if isinstance(error, ValueError) else None
        category, code, constraint = known or ('schema', 'component_constraint', 'Conform to the supplied component contract and coverage constraints.')
        result = dict(category=category, code=code, sceneIndex=None, field=None, constraint=constraint)
    if scene_index is not None:
        result['sceneIndex'] = scene_index
    if field is not None:
        result['field'] = field
    # Defense in depth for custom adapters: metadata is bounded machine data.
    if not isinstance(result.get('code'), str) or not re.fullmatch(r'[a-z_]{1,80}', result['code']):
        result['code'] = 'composition_failed'
    if result.get('sceneIndex') is not None and (type(result['sceneIndex']) is not int or not 0 <= result['sceneIndex'] < 6):
        result['sceneIndex'] = None
    if result.get('field') is not None and (not isinstance(result['field'], str) or not re.fullmatch(r'[A-Za-z0-9_.]{1,120}', result['field'])):
        result['field'] = None
    if result.get('field') and any(part not in _schema_fields() and not (part.isdigit() and 0 <= int(part) < 6)
                                   for part in result['field'].split('.')):
        result['field'] = None
    if isinstance(error, ExtractionError):
        result['constraint'] = None
    return result
