"""Server-owned development fixtures, never definitions supplied by a browser."""
from pathlib import Path

from backend.accounts.security import AccountError
from .core import ExecutionCore
from .registry import PREVIEW_OPERATIONS
from .validator import ProgramInvalid, require_valid_program

EXAMPLES = Path(__file__).resolve().parents[2] / 'data/activity_engine_v2/examples'
# Tests may register renamed synthetic fixtures server-side. There is no HTTP
# registration endpoint, dynamic import, skill dispatch or browser file path.
FIXTURE_PATHS = {key: EXAMPLES / f'{key}.json' for key in (
    'observatory_floor', 'habitat_designer', 'trail_evidence', 'story_studio')}
def load_preview(key):
    path = FIXTURE_PATHS.get(key)
    if path is None:
        raise AccountError('not_found', 'That preview was not found.', 404)
    try:
        program = require_valid_program(path.read_bytes())
    except (OSError, ProgramInvalid):
        raise AccountError('preview_definition_unavailable', 'This preview is unavailable.', 503) from None
    validate_runtime_compatibility(program)
    return program


def validate_runtime_compatibility(program):
    """Shared admission gate; generated programs never touch the fixture loader."""
    if any(action.operation not in PREVIEW_OPERATIONS for action in program.actions):
        raise AccountError('runtime_adapter_unavailable', 'This activity needs a control that is not available in the preview.', 422)
    core = ExecutionCore(program)
    rendered = {'math_workspace': {'grid', 'equation'}, 'evidence_board': {'evidence_board'},
                'text_editor': {'text_artifact'}, 'fraction_workspace': {'fraction_strip'},
                'world_stage': {'stage_piece', 'stage_map'}}
    for component in program.components:
        if component.kind not in rendered:
            raise AccountError('runtime_adapter_unavailable', 'This activity needs a control that is not available in the preview.', 422)
        for kind in rendered[component.kind]:
            maximum=8 if component.kind=='world_stage' else 2 if component.kind=='fraction_workspace' else 1
            if sum(core.objects[ref].kind == kind for ref in component.objectIds) > maximum:
                raise AccountError('runtime_adapter_unavailable', 'This activity needs an unsupported shared-object control.', 422)
        if component.kind=='fraction_workspace':
            strips=[core.objects[ref] for ref in component.objectIds if core.objects[ref].kind=='fraction_strip']
            fixed=[obj for obj in strips if not core.slots[obj.bindings['denominator']].mutable]
            working=[obj for obj in strips if core.slots[obj.bindings['denominator']].mutable]
            if (len(strips)!=2 or len(fixed)!=1 or len(working)!=1 or fixed[0].wholeId!=working[0].wholeId
                    or fixed[0].width!=working[0].width
                    or not any(relation.kind=='same_whole' and {relation.source,relation.target}=={fixed[0].id,working[0].id}
                               for relation in program.world.relationships)):
                raise AccountError('runtime_adapter_unavailable', 'This workspace needs a fixed reference and construction of the same whole.', 422)
        operations = [action.operation for action in program.actions if action.componentId == component.id]
        if len(operations) != len(set(operations)):
            actions=[action for action in program.actions if action.componentId==component.id]
            bindings=[(action.operation,tuple(obj.id for obj in core.action_objects(action.id))) for action in actions]
            if component.kind!='world_stage' or len(bindings)!=len(set(bindings)):
                raise AccountError('runtime_adapter_unavailable', 'This activity needs an unsupported action control.', 422)
    if any(len(core.action_objects(action.id)) != 1 for action in program.actions):
        raise AccountError('runtime_adapter_unavailable', 'This activity needs an unsupported shared-object control.', 422)
    return program
