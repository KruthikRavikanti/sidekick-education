"""Closed semantic operations grounded in current Sidekick controls.

Only PREVIEW_OPERATIONS have development-preview shared-state adapters. Other
operations remain contract-only. No skill gate, callback, or import string exists.
"""
COMPONENT_VERSION = 'sidekick-program-contract-v1'

PREVIEW_OPERATIONS = frozenset({
    'toggle_tile', 'resize_rectangle', 'assemble_product',
    'select_evidence', 'replace_text', 'revise_text',
    'set_fraction_partition', 'toggle_fraction_piece', 'move_fraction_piece',
    'move_actor', 'place_piece', 'inspect_location',
})

OBJECT_PORTS = {
    'quantity_pool': {'count': 'integer'},
    'grid': {'rows': 'integer', 'columns': 'integer', 'cells': 'id_set'},
    'equation': {'left': 'integer', 'right': 'integer', 'result': 'integer'},
    'text_artifact': {'text': 'text'},
    'evidence_board': {'selection': 'choice'},
    'sequence': {'order': 'id_list'},
    'audio_artifact': {'artifact': 'artifact'},
    'drawing_artifact': {'artifact': 'artifact'},
    'progress': {'value': 'boolean'},
    'fraction_strip': {'denominator': 'integer', 'pieces': 'id_set'},
    'stage_piece': {'location': 'choice'},
    'stage_map': {'inspected': 'id_set'},
}

COMPONENT_OBJECTS = {
    'quantity_lab': {'quantity_pool', 'progress'},
    'math_workspace': {'grid', 'equation', 'progress'},
    'text_editor': {'text_artifact', 'progress'},
    'evidence_board': {'evidence_board', 'progress'},
    'tile_order': {'sequence', 'progress'},
    'oral_studio': {'audio_artifact', 'progress'},
    'drawing_studio': {'drawing_artifact', 'progress'},
    'fraction_workspace': {'fraction_strip', 'progress'},
    'world_stage': {'stage_piece', 'stage_map'},
}


def _cap(component, object_kind, inputs, effects, auto, source, action, change, evidence):
    return dict(component=component, objectKind=object_kind, inputKinds=inputs,
        effectKinds=effects, automaticAssessment=auto, legacySource=source,
        childAction=action, visibleChange=change, evidence=evidence,
        implementationStatus='legacy_semantic_operation_v2_adapter_required',
        liveV2AdapterImplemented=False)


CAPABILITIES = {
    'move_actor': _cap('world_stage','stage_piece',{'destination':'choice'}, {'set'},False,
        'components/activity-program-stage.tsx', 'Move the selected actor through an adjacent usable connection.',
        'The actor travels between actual locations; conceptual state can make a connection usable or blocked.',
        'Navigation and choice history only; an arrival is never evidence of conceptual understanding.'),
    'place_piece': _cap('world_stage','stage_piece',{'destination':'choice'}, {'set'},False,
        'components/activity-program-stage.tsx', 'Place or reattach one device or object at a chosen location.',
        'The physical configuration changes; a single object remains in exactly one capacity-limited location.',
        'Configuration history only; learning evidence must reference the actual linked construction or artifact.'),
    'inspect_location': _cap('world_stage','stage_map',{'location':'choice'}, {'add_item'},False,
        'components/activity-program-stage.tsx', 'Investigate a selected location and retain the discovery.',
        'Authoritative discovery state can reveal actual passages, tools or contextual materials.',
        'Investigation history only; reading assessment still needs the actual evidence selection or artifact.'),
    'set_fraction_partition': _cap('fraction_workspace','fraction_strip',{'denominator':'integer'}, {'repartition'},True,
        'components/activity-program-fractions.tsx', 'Divide the same whole into a chosen number of equal parts.',
        'Each column splits into equal rows; the exact shaded region and amount are preserved.', 'A changed denominator with a server-derived equivalent numerator.'),
    'toggle_fraction_piece': _cap('fraction_workspace','fraction_strip',{'piece':'choice'}, {'toggle_item'},True,
        'components/activity-program-fractions.tsx', 'Place or remove one equal fraction piece.',
        'An actual part of the construction fills or clears.', 'The selected pieces determine the fraction; no submitted numerator is trusted.'),
    'move_fraction_piece': _cap('fraction_workspace','fraction_strip',{'from':'choice','to':'choice'}, {'move_item','set'},True,
        'components/activity-program-fractions.tsx', 'Move one shaded piece to an empty place in the same whole.',
        'The layout changes while the shaded amount remains exactly the same.', 'Conserved rearrangement and same-whole comparison.'),
    'transfer_quantity': _cap('quantity_lab','quantity_pool',{'amount':'integer'}, {'transfer'},True,
        'components/activity-families.tsx:QuantityLab', 'Move units between displayed pools.',
        'Source loses exactly the amount the destination gains.', 'Conserved allocation and exact counts.'),
    'toggle_tile': _cap('math_workspace','grid',{'cell':'choice'}, {'toggle_item'},True,
        'components/activity-area-workspace.tsx:AreaWorkspace', 'Place or lift a unit tile in a real cell.',
        'The corresponding cell fills or clears; lifting frees that grid\'s stock. The core enforces its own unit_tiles.quantity limit.',
        'Actual unit-square coverage, not a submitted count. Stock is bounded PER GRID; sharing a material reference does not create a conserved stock across different grids.'),
    'resize_rectangle': _cap('math_workspace','grid',{'rows':'integer','columns':'integer'}, {'set'},True,
        'components/activity-area-workspace.tsx:AreaWorkspace', 'Change rows and columns.',
        'The rectangle reshapes using the declared equal units.', 'Dimensions, area, and factor-pair state.'),
    'assemble_product': _cap('math_workspace','equation',{'left':'integer','right':'integer','result':'integer'}, {'set'},True,
        'components/activity-area-workspace.tsx:AreaWorkspace', 'Construct a product equality.',
        'The child-authored integer factors and result change; wrong values are preserved.',
        'Implemented typed V2 input adapter: exact integer left/right/result facts. Automatic inline predicates can check multiplication and compare factors/product with the actual bound construction and target; no parser or parent judgment is needed for those exact numeric checks. This does not assess an unobserved explanation or mastery.'),
    'replace_text': _cap('text_editor','text_artifact',{'text':'text'}, {'set'},False,
        'components/activity-families.tsx:TextEditor', 'Create an original draft.',
        'The actual written artifact changes.', 'Text artifact and process, assessed against a parent rubric.'),
    'revise_text': _cap('text_editor','text_artifact',{'text':'text'}, {'set'},False,
        'components/activity-families.tsx:TextEditor', 'Change the existing draft.',
        'Previous and new drafts differ; future events retain both.', 'Actual revision and parent-assessed writing quality.'),
    'select_evidence': _cap('evidence_board','evidence_board',{'sentence':'choice'}, {'set'},True,
        'components/activity-toolkit.tsx:EvidenceBoard', 'Place a passage sentence on the board.',
        'The selected literal sentence becomes the displayed clue.', 'Selection key; factual support still needs semantic review.'),
    'reorder': _cap('tile_order','sequence',{'order':'id_list'}, {'set'},True,
        'components/activity-toolkit.tsx:TileOrder', 'Place and rearrange every offered piece.',
        'The sequence is rebuilt in the chosen order.', 'Full permutation; semantic order is independently reviewed.'),
    'record_voice': _cap('oral_studio','audio_artifact',{'artifact':'artifact'}, {'set'},False,
        'components/activity-media-controls.tsx:OralControl', 'Make an actual voice recording.',
        'A private recording becomes available for playback.', 'Owned recorded artifact; no automatic fluency or pronunciation grading.'),
    'draw': _cap('drawing_studio','drawing_artifact',{'artifact':'artifact'}, {'set'},False,
        'components/activity-media-controls.tsx:DrawingControl', 'Draw and revise actual strokes.',
        'The drawing artifact changes.', 'Owned drawing artifact; parent judges construction or handwriting.'),
}

# Asset references are opaque IDs resolved by trusted host code. No URLs, paths,
# generated HTML/SVG or remote fetching are accepted in a program.
STAGE_ASSETS = {'dot', 'person', 'cart', 'boat', 'parcel', 'lens', 'bridge', 'gate', 'home', 'tree', 'lamp', 'book', 'clue', 'flag', 'flower', 'gear'}
ASSETS = {'coin_penny', 'coin_nickel', 'coin_dime', 'coin_quarter'} | STAGE_ASSETS


def component_contracts():
    """Inspectable JSON-compatible operation contracts; no executable bindings."""
    return {name: {**value, 'effectKinds': sorted(value['effectKinds']),
        'implementationStatus': ('development_preview_adapter' if name in PREVIEW_OPERATIONS
            else value['implementationStatus']),
        'liveV2AdapterImplemented': name in PREVIEW_OPERATIONS,
        'previewOnly': name in PREVIEW_OPERATIONS,
    } for name,value in CAPABILITIES.items()}
