"""Compile the reviewed K–5 family assignments into an inspectable ID map.

This is an offline catalog compiler, not an upload keyword gate. Runtime routing
reads the committed per-subskill records. Family rules describe evidence and
controls; they do not manufacture activities or successful verification results.
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
CATALOG = ROOT / 'data/sidekick_skill_map_v2.json'
MAP = ROOT / 'data/activities/catalog_coverage.json'
GRADES = ('K', '1', '2', '3', '4', '5')

# Definition: primary mechanic, compatible controls, assessment, child evidence.
FAMILIES = {
    'counting_cardinality': ('quantity_lab', ['quantity_lab', 'sort_connect'], 'automatic', 'Move or mark objects and connect the resulting quantity to its count.'),
    'oral_counting': ('oral_studio', ['quantity_lab', 'oral_studio'], 'parent_review', 'Record the actual counting sequence; a parent checks omissions, order and the stated starting point.'),
    'numeral_formation': ('drawing_studio', ['quantity_lab', 'drawing_studio'], 'parent_review', 'Form the requested numeral with actual pointer strokes; a parent checks the numeral and its value.'),
    'number_comparison': ('tile_order', ['tile_order', 'sort_connect', 'math_workspace'], 'automatic', 'Arrange or connect numeric amounts according to their values, not their labels or presentation order.'),
    'place_value': ('quantity_lab', ['quantity_lab', 'math_workspace'], 'automatic', 'Build and regroup amounts, showing the value represented by each place rather than only naming a digit.'),
    'arithmetic_actions': ('quantity_lab', ['quantity_lab', 'math_workspace'], 'automatic', 'Change quantities by joining, separating, distributing or building groups, conserving the stated stock.'),
    'arithmetic_fluency': ('oral_studio', ['math_workspace', 'quantity_lab', 'oral_studio'], 'parent_review', 'Give fresh arithmetic facts aloud without a worked model; a parent checks accuracy and fluent recall.'),
    'equal_groups': ('quantity_lab', ['quantity_lab', 'math_workspace'], 'automatic', 'Pack, share or build equal groups from a shared stock; the final distribution demonstrates the operation.'),
    'calculation_algorithm': ('math_workspace', ['math_workspace', 'text_editor'], 'parent_review', 'Build a calculation and record the intermediate algorithm or partial-product steps; a parent checks the method and answer.'),
    'mathematical_reasoning': ('math_workspace', ['math_workspace', 'quantity_lab', 'text_editor', 'oral_studio', 'drawing_studio'], 'parent_review', 'Change a mathematical representation, then explain the relationship or strategy using actual written, drawn or spoken reasoning.'),
    'rounding_estimation': ('math_workspace', ['math_workspace', 'quantity_lab'], 'automatic', 'Place or compare an amount against benchmarks and select the approximation justified by its position.'),
    'patterns_expressions': ('math_workspace', ['math_workspace', 'tile_order', 'sort_connect'], 'automatic', 'Build an expression, continue a rule or connect related terms so the changed state follows the mathematical relationship.'),
    'fraction_models': ('math_workspace', ['math_workspace', 'quantity_lab'], 'automatic', 'Build, partition or locate fractional amounts using an explicitly identified whole and equal units.'),
    'fraction_equivalence': ('fraction_split_compare', ['fraction_split_compare'], 'automatic', 'Split equal parts while preserving the same shaded whole and demonstrate the resulting equivalent fraction.'),
    'fraction_operations': ('quantity_lab', ['quantity_lab', 'math_workspace'], 'automatic', 'Join, separate, share or scale rational units while retaining the same whole and exact fraction values.'),
    'measurement_length': ('math_workspace', ['math_workspace'], 'automatic', 'Move a measurement marker or lay equal units against a visible object, using a visible scale and stated unit.'),
    'measurement_mass_capacity': ('math_workspace', ['math_workspace', 'quantity_lab'], 'automatic', 'Change a visible balance or graduated vessel and use its stated mass or capacity units to measure or compare the amount.'),
    'measurement_angles': ('math_workspace', ['math_workspace'], 'automatic', 'Use a visible angle and degree scale, or compose measured angle parts; the final marker represents the measured angle.'),
    'measurement_time': ('math_workspace', ['math_workspace', 'sort_connect'], 'automatic', 'Set or interpret a visible clock or time number line, including the specified unit and elapsed-time relationship.'),
    'measurement_money': ('quantity_lab', ['quantity_lab', 'math_workspace', 'sort_connect'], 'automatic', 'Manipulate coin or money amounts and preserve their values while counting, comparing or solving a transaction.'),
    'measurement_conversion': ('math_workspace', ['math_workspace', 'quantity_lab'], 'automatic', 'Connect measures of the same amount in named units and use the stated conversion relationship.'),
    'measurement_area_volume': ('math_workspace', ['math_workspace', 'quantity_lab'], 'automatic', 'Build or measure a region or solid with equal units, linking the changed covering or packing state to area, perimeter or volume.'),
    'data_graphs': ('math_workspace', ['math_workspace', 'sort_connect'], 'automatic', 'Build or change a graph or line plot from actual data and use its labels, scale and counts to answer.'),
    'geometry_classification': ('sort_connect', ['sort_connect', 'math_workspace'], 'automatic', 'Sort or connect visible figures by defining spatial attributes, with size, color and orientation varied.'),
    'geometry_construction': ('drawing_studio', ['drawing_studio', 'math_workspace'], 'parent_review', 'Construct or draw the requested figure with actual strokes or placed geometric pieces; a parent checks the defining attributes.'),
    'mathematical_drawing': ('drawing_studio', ['drawing_studio', 'math_workspace', 'text_editor'], 'parent_review', 'Draw an actual quantitative model, diagram or graph and record the mathematical labels or steps; a parent checks the representation against the stated relationship.'),
    'geometry_coordinates': ('math_workspace', ['math_workspace'], 'automatic', 'Place or move points on visible labeled axes according to ordered pairs, then interpret the resulting location.'),
    'classification_matching': ('sort_connect', ['sort_connect', 'tile_order'], 'automatic', 'Move or connect pieces using the target category, relationship or repeating structure rather than a decorative action.'),
    'phonological_oral': ('oral_studio', ['oral_studio', 'sort_connect', 'text_editor'], 'parent_review', 'Hear or see fresh words and record the actual spoken sounds, syllables, rhyme or blending; a parent checks pronunciation and segmentation.'),
    'phonics_decoding': ('oral_studio', ['oral_studio', 'text_editor', 'sort_connect'], 'parent_review', 'Manipulate graphemes or word parts and read a fresh word aloud; a parent checks the actual sound-to-print decoding.'),
    'reading_fluency': ('oral_studio', ['oral_studio'], 'parent_review', 'Record an actual reading of a fresh appropriate text; a parent checks accuracy, rate, expression and any requested self-correction.'),
    'print_book_features': ('sort_connect', ['sort_connect', 'text_editor', 'oral_studio'], 'parent_review', 'Act on actual print, page or book-feature material and demonstrate its function; a parent checks the observed reading behavior.'),
    'reading_evidence': ('evidence_board', ['evidence_board', 'sort_connect', 'text_editor'], 'automatic', 'Select and place literal evidence from a complete original passage to support a specific answer or claim.'),
    'reading_sequence': ('tile_order', ['tile_order', 'sort_connect', 'text_editor'], 'automatic', 'Rebuild events or procedural steps using meaningful temporal or causal relationships in the material.'),
    'reading_response': ('text_editor', ['text_editor', 'oral_studio', 'sort_connect', 'evidence_board'], 'parent_review', 'Create an actual summary, question, explanation, inference or comparison grounded in the supplied complete text; a parent judges the requested reasoning.'),
    'reading_multimodal': ('text_editor', ['text_editor', 'oral_studio', 'sort_connect', 'math_workspace'], 'parent_review', 'Use an actually rendered illustration, diagram, chart or spoken version together with its text to create a grounded response.'),
    'vocabulary_relationships': ('sort_connect', ['sort_connect', 'text_editor', 'evidence_board'], 'automatic', 'Sort, connect or edit words in a complete context to show the requested meaning, morphology or relationship.'),
    'language_editing': ('text_editor', ['text_editor', 'sort_connect', 'tile_order'], 'automatic', 'Assemble or change actual words and sentences so the requested grammatical, punctuation or spelling feature is used.'),
    'language_composition': ('text_editor', ['text_editor', 'oral_studio'], 'parent_review', 'Compose or revise actual language for the requested meaning, sentence structure, register or effect; a parent checks the open-ended result.'),
    'handwriting': ('drawing_studio', ['drawing_studio'], 'parent_review', 'Write the requested letters with actual pointer strokes; a parent checks letter formation rather than accepting typed substitutes.'),
    'writing_composition': ('text_editor', ['text_editor', 'drawing_studio', 'oral_studio'], 'parent_review', 'Create and revise an actual draft that demonstrates the target writing feature; a parent uses a criterion-specific rubric.'),
    'writing_revision': ('text_editor', ['text_editor'], 'parent_review', 'Change an existing draft in response to a clear goal or feedback, preserving both the initial text and the child-created revision.'),
    'writing_research': ('text_editor', ['text_editor', 'sort_connect'], 'parent_review', 'Read supplied original source cards, take or organize actual notes and write a sourced answer; a parent checks evidence use and the required research process.'),
    'writing_publication': ('text_editor', ['text_editor'], 'parent_review', 'Produce and save a real written draft using the editor, with parent-observed keyboarding, audience, publication or collaboration requirements as specified.'),
    'observed_performance': ('oral_studio', ['oral_studio', 'sort_connect'], 'parent_review', 'Perform the requested action while recording its narration; a parent explicitly confirms the physical or shared performance was observed.'),
}

EQUIVALENT = {'3.NF.A.3-1', '3.NF.A.3-2', '4.NF.A.1-1', '4.NF.A.1-2'}
LEGACY_FRACTION = '3.NF.A.1-2'
LEGACY_PLURAL = 'L.3.1-2'
ORAL_MATH = {'K.CC.A.1-1', 'K.CC.A.1-2', 'K.CC.A.1-3', 'K.CC.A.2-1', 'K.CC.A.2-2',
             'K.CC.B.4-1', '1.NBT.A.1-1', '2.NBT.A.2-1', '2.NBT.A.2-2'}
NUMERAL_DRAWING = {'K.CC.A.3-2', '1.NBT.A.1-2'}
HANDWRITING = {'L.K.1-1', 'L.1.1-1', 'L.K.2-3'}
OBSERVED = {'L.K.5-4', 'K.OA.A.1-1'}
BOOK_FEATURES = {'RF.K.1-1', 'RF.K.1-2', 'RF.K.1-3', 'RF.K.1-4', 'RI.K.5-1', 'RI.1.5-1', 'RI.2.5-1', 'RI.3.5-1'}
READING_VISUAL = {'RL.K.7-1', 'RI.K.7-1', 'RL.1.7-1', 'RI.1.6-1', 'RI.1.7-1', 'RL.2.7-1', 'RI.2.7-1',
                  'RL.3.7-1', 'RL.4.7-1', 'RL.5.7-1', 'RI.4.7-1', 'RI.5.7-1'}
# Explicit exceptions are reviewed catalog intent decisions, not model examples.
OVERRIDES = {
    'K.OA.A.1-2': 'mathematical_drawing', 'K.OA.A.3-3': 'mathematical_drawing',
    'K.OA.A.2-3': 'mathematical_reasoning',
    'K.MD.A.1-1': 'classification_matching', 'K.MD.A.1-2': 'mathematical_reasoning',
    'K.MD.A.2-2': 'measurement_mass_capacity',
    '1.MD.C.4-2': 'data_graphs', '1.NBT.C.5-2': 'arithmetic_actions',
    '1.NBT.C.6-2': 'arithmetic_actions', '2.NBT.B.5-3': 'arithmetic_actions',
    '2.NBT.B.6-2': 'arithmetic_actions', '2.NBT.B.7-3': 'mathematical_drawing',
    '2.NBT.A.4-2': 'number_comparison',
    '3.NBT.A.1-1': 'rounding_estimation', '3.NBT.A.1-2': 'rounding_estimation',
    '3.NBT.A.2-3': 'arithmetic_actions', '3.NBT.A.3-1': 'equal_groups',
    '4.NBT.B.5-3': 'calculation_algorithm', '4.NBT.B.6-2': 'calculation_algorithm',
    'GA-1-MDR.6.3-1': 'measurement_money', 'GA-2-GSR.7.2-1': 'geometry_classification',
    'GA-3-NR.1.1-1': 'place_value', 'GA-3-PAR.3.4-1': 'patterns_expressions',
    'GA-3-GSR.6.1-1': 'geometry_classification', '4.OA.A.1-1': 'equal_groups',
    '4.OA.A.1-2': 'patterns_expressions', '4.OA.A.2-3': 'equal_groups',
    '5.OA.A.1-1': 'patterns_expressions', '5.OA.B.3-1': 'patterns_expressions',
    '5.OA.B.3-2': 'geometry_coordinates', '5.OA.B.3-3': 'mathematical_reasoning',
    '5.NF.B.5-1': 'mathematical_reasoning',
    'RL.K.2-2': 'reading_sequence', 'RI.K.9-1': 'reading_response',
    'RI.3.1-1': 'reading_evidence', 'RL.3.1-1': 'reading_evidence',
    'RI.1.9-1': 'reading_response', 'RL.2.6-1': 'reading_fluency',
    'RL.4.5-2': 'reading_response',
    'L.K.2-4': 'language_composition', 'L.1.2-5': 'language_composition',
    'L.2.3-1': 'language_composition', 'L.4.3-3': 'language_composition',
    'L.5.3-2': 'language_composition',
}


def family_for(row):
    """Offline assignments are expanded to explicit records before runtime use."""
    sid, objective = row['subskill_id'], row['subskill'].casefold()
    domain, skill = row['domain'], row['skill'].casefold()
    if sid in OVERRIDES:
        return OVERRIDES[sid]
    if sid in OBSERVED:
        return 'observed_performance'
    if sid in EQUIVALENT:
        return 'fraction_equivalence'
    if row['subject'] == 'Math':
        if sid in ORAL_MATH:
            return 'oral_counting'
        if sid in NUMERAL_DRAWING:
            return 'numeral_formation'
        if re.search(r'\b(?:explain|retell|justify|reasonableness|strategy)\b', objective) and 'solve' not in objective:
            return 'mathematical_reasoning'
        if re.search(r'\b(?:draw|sketch)\b', objective) and not 'drawings' in objective:
            return 'geometry_construction' if domain == 'Geometry' or 'GSR' in sid else 'mathematical_drawing'
        if ('standard algorithm' in objective or 'standard algorithm' in skill
                or re.search(r'\b(?:multi-digit|4-digit|two 2-digit|two-digit divisors)\b', objective)
                and re.search(r'\b(?:multiply|divide|add|subtract)\b', objective)):
            return 'calculation_algorithm'
        if ('fluently' in objective or 'recall' in objective or 'without counting' in objective or 'facts' in objective
                and re.search(r'\b(?:know|thinking)\b', objective)):
            return 'arithmetic_fluency'
        if ('round' in objective or 'rounding' in skill or 'estimate to check' in objective):
            return 'rounding_estimation'
        if domain == 'Geometry':
            if any(word in objective for word in ['coordinate', 'axes', 'ordered pairs', 'graph points', 'locate points']):
                return 'geometry_coordinates'
            if any(word in objective for word in ['combine', 'build', 'fill an outline', 'partition', 'split', 'equal shares', 'equal area']):
                return 'geometry_construction'
            return 'geometry_classification'
        if re.search(r'\b(?:angles?|degrees?|protractor)\b', objective) or sid.startswith('4.MD.C.'):
            return 'measurement_angles'
        if re.search(r'\b(?:coin|coins|pennies|nickels|dimes|quarters|money|dollar|cents)\b', objective):
            return 'measurement_money'
        if re.search(r'\b(?:clock|minute|minutes|a\.m|p\.m|elapsed time|half past)\b', objective) or 'tell time' in skill or sid.startswith('3.MD.A.1'):
            return 'measurement_time'
        if re.search(r'\b(?:graph|plot|data|categor(?:y|ies))\b', objective) and (domain == 'Measurement & Data' or 'MDR' in sid):
            return 'data_graphs'
        if ('convert' in objective or 'conversion' in objective or 'relationships within' in objective
                or 'relative sizes of measurement units' in skill):
            return 'measurement_conversion'
        if domain == 'Measurement & Data':
            if sid.startswith('3.MD.A.2') or re.search(r'\b(?:grams?|kilograms?|liters?|mass|weights?|capacity)\b', objective):
                return 'measurement_mass_capacity'
            if (re.search(r'\b(?:area|perimeter|volume|unit squares?|unit cubes?|prisms?)\b', objective)
                    or re.search(r'\b(?:area|perimeter|volume)\b', skill)):
                return 'measurement_area_volume'
            return 'measurement_length'
        if re.search(r'\b(?:compare|greater|fewer|more|symbols|<|>)\b', objective) and not re.search(r'\b(?:add|subtract|times|product|10 more|10 less)\b', objective):
            return 'number_comparison'
        if 'Fraction' in domain or 'fraction' in objective:
            if re.search(r'\b(?:add|subtract|multiply|divide|sharing|product|scal|mixed numbers|common denominator)\b', objective):
                return 'fraction_operations'
            return 'fraction_models'
        if re.search(r'\b(?:pattern|rule|expression|equation|unknown|prime|composite|factor pairs|multiple)\b', objective):
            return 'patterns_expressions'
        if domain == 'Counting & Cardinality' or sid.startswith('1.NBT.A.1'):
            return 'counting_cardinality'
        if domain == 'Number & Operations in Base Ten':
            if re.search(r'\b(?:add|subtract|multiply|divide|product|quotient|regroup|composing|decomposing)\b', objective):
                return 'arithmetic_actions'
            return 'place_value'
        if re.search(r'\b(?:groups|array|arrays|products|multiplication|division|sharing|packing)\b', objective):
            return 'equal_groups'
        if 'pattern' in skill or 'repeats' in objective or 'daily events' in objective:
            return 'classification_matching'
        return 'arithmetic_actions'
    if sid in HANDWRITING:
        return 'handwriting'
    if sid.startswith('W.'):
        standard = sid.split('.')[2].split('-')[0]
        if standard in {'7', '8', '9'}:
            return 'writing_research'
        if standard == '6':
            return 'writing_publication'
        if standard == '5':
            return 'writing_revision'
        return 'writing_composition'
    if sid in BOOK_FEATURES:
        return 'print_book_features'
    if sid.startswith('RF.'):
        if '.4-' in sid:
            return 'reading_fluency'
        if ('.2-' in sid or 'phonological' in skill or 'phonemic' in skill):
            return 'phonological_oral'
        if '.1-' in sid:
            return 'language_editing'
        return 'phonics_decoding'
    if sid in READING_VISUAL:
        return 'reading_multimodal'
    if sid.startswith(('RL.', 'RI.')):
        if '.10-' in sid:
            return 'reading_fluency'
        if re.search(r'\b(?:retell|recount|summarize|summary|ask|explain\w*|describe|compare|contrast|analy[sz]e|integrate|infer\w*)\b', objective):
            if re.search(r'\b(?:beginning|ending|sequence|chronology|steps|procedure)\b', objective) and 'compare' not in objective:
                return 'reading_sequence'
            return 'reading_response'
        if re.search(r'\b(?:word|words|meaning|meanings|phrase|phrases|vocabulary|allusions)\b', objective):
            return 'vocabulary_relationships'
        return 'reading_evidence'
    if sid.startswith('L.'):
        if re.search(r'\b(?:explain|write|speak|spoken|sentence[s]? for|effect|precisely|convey|use words|use grade|use new|learned)\b', objective):
            return 'language_composition'
        if re.search(r'\b(?:meaning|meanings|context|affix|affixes|prefix|prefixes|root|roots|dictionar\w*|glossar\w*|synonyms?|antonyms?|homographs?|category|categories|opposites|shades|real-life|inflections|compound words)\b', objective):
            return 'vocabulary_relationships'
        return 'language_editing'
    raise ValueError(f'No family assignment for {sid}')


def record_for(row):
    family = family_for(row)
    primary, mechanics, assessment, evidence = FAMILIES[family]
    sid, objective = row['subskill_id'], row['subskill']
    text = objective.casefold()
    requirements = ['fresh_independent_challenge', 'target_skill_required_for_success']
    modes = []
    # Reviewing a saved artifact differs from witnessing a performance or
    # collaboration. Only the latter needs an explicit observation attestation.
    parent = family in {'observed_performance', 'arithmetic_fluency'}
    required_response = None
    required_visual = None
    min_words = 0
    if primary == 'oral_studio':
        requirements += ['actual_recorded_audio']
        modes = ['perform' if family == 'observed_performance' else 'say_sounds' if family == 'phonological_oral' else 'read_aloud']
        required_response = 'oral'
    if primary == 'drawing_studio':
        requirements += ['actual_pointer_strokes']
        required_response = 'drawing'
    if family in {'writing_composition', 'writing_revision', 'writing_research', 'writing_publication', 'language_composition', 'reading_response', 'reading_multimodal', 'calculation_algorithm', 'mathematical_reasoning'}:
        requirements += ['actual_created_response', 'criterion_specific_parent_rubric']
        required_response = 'writing'
    if family == 'mathematical_reasoning' and row['grade'] in {'K', '1'}:
        required_response = 'oral'
    if family == 'reading_response' and row['grade'] in {'K', '1', '2'} and not re.search(r'\b(?:write|writing|written)\b', text):
        # Retelling, asking and explaining in early reading must have an
        # actual spoken path; requiring keyboard composition changes the skill.
        required_response = 'oral'
    if sid == '4.NF.A.1-2':
        # Splitting is required in the teaching; explaining why it conserves
        # area needs actual reasoning rather than only selecting a split factor.
        assessment, required_response = 'parent_review', 'writing'
        mechanics = ['fraction_split_compare', 'text_editor', 'oral_studio']
        requirements += ['actual_created_response', 'criterion_specific_parent_rubric']
    if family == 'writing_revision':
        modes = ['edit']; requirements += ['initial_draft_and_changed_revision']
    elif family.startswith('writing_'):
        modes = ['compose']; requirements += ['actual_written_draft']
    elif family == 'language_editing':
        modes = ['edit', 'assemble']; requirements += ['language_change_required']
    if family == 'phonological_oral':
        requirements += ['audible_word_or_sound_material', 'pronunciation_review_not_typed_substitute']
    if family == 'phonics_decoding':
        requirements += ['printed_graphemes_or_word_parts', 'target_word_not_read_to_child', 'pronunciation_review_not_typed_substitute']
    if family == 'reading_fluency':
        requirements += ['complete_grade_appropriate_text', 'actual_recorded_audio', 'reading_accuracy_review']
        if re.search(r'\b(?:rate|fluency|fluent|expression|self-correct|reread)\b', text):
            requirements += ['rate_expression_or_self_correction_review']
    if family.startswith('reading_') or family == 'print_book_features':
        requirements += ['complete_original_reading_material']
    if family == 'reading_evidence':
        requirements += ['exactly_one_grounded_supporting_piece']
    if family == 'reading_sequence':
        requirements += ['unique_temporal_or_causal_order']
    if family == 'reading_multimodal':
        requirements += ['actual_visual_or_spoken_material', 'text_and_other_medium_connected']
    if family == 'print_book_features':
        requirements += ['actual_print_or_book_layout']
        required_response = 'oral'
        required_visual = 'book_pages' if sid.startswith('RF.K.1') else 'book_cover'
        if sid in {'RF.K.1-1', 'RF.K.1-2'}:
            parent = True
    if sid == 'K.CC.B.4-1':
        parent = True
    if sid == 'L.K.2-3':
        parent = True
        mechanics = ['drawing_studio', 'oral_studio']
        requirements += ['parent_supplied_spoken_sound', 'spoken_sound_not_written_answer']
    if family == 'writing_research' or re.search(r'\b(?:sources|research|references|glossar|dictionar)\b', text):
        requirements += ['self_contained_named_source_cards']
    if family == 'writing_publication':
        requirements += ['saved_publishable_draft']
    if re.search(r'\b(?:shared (?:research|language|writing|reading|projects?)|group reading|with (?:adults?|peers?|partners?)|collaborat\w*)\b', text):
        requirements += ['parent_observed_shared_participation']; parent = True
    if sid == 'W.4.6-1':
        requirements += ['one_page_draft', 'parent_observed_single_sitting']
        min_words, parent = 200, True
    if sid == 'W.5.6-1':
        requirements += ['two_page_draft', 'parent_observed_single_sitting', 'parent_observed_shared_participation']
        min_words, parent = 400, True
    if family == 'measurement_angles':
        requirements += ['visible_angle_and_degree_scale']; modes = ['angle']
    elif family == 'measurement_time':
        requirements += ['visible_clock_or_time_number_line']; modes = ['clock', 'number_line']
    elif family == 'measurement_length':
        requirements += ['visible_measurement_tool_and_unit']; modes = ['ruler']
        if 'number line' in text:
            modes = ['number_line']
    elif family == 'measurement_mass_capacity':
        requirements += ['visible_balance_or_graduated_vessel']; modes = ['balance', 'vessel']
    elif family == 'measurement_conversion':
        requirements += ['named_units_and_valid_conversion']; modes = ['equation', 'ruler']
    elif family == 'measurement_area_volume':
        requirements += ['visible_equal_unit_region_or_solid']; modes = ['grid', 'shape']
        if sid == '3.MD.C.7-1':
            # Preserve older saved boards while advertising the implemented
            # composable actions to both the designer and independent reviewer.
            modes += ['area_tile', 'area_design', 'area_expression']
            requirements += ['connected_unit_covering_or_factor_design_to_area_expression']
    elif family == 'data_graphs':
        requirements += ['actual_labeled_scaled_graph']; modes = ['chart']
        required_visual = 'chart'
    elif family == 'geometry_coordinates':
        requirements += ['visible_axes_origin_and_scale']; modes = ['grid']
    elif family == 'rounding_estimation':
        requirements += ['visible_benchmarks_or_scale']; modes = ['number_line']
    if family.startswith('geometry_'):
        requirements += ['actual_visible_geometric_objects']
        required_visual = 'geometry'
    if 'solid' in text or '3d' in text or '3-dimensional' in text or '3D' in row['skill']:
        requirements += ['actual_solid_shape_visuals']
        required_visual = 'solid_shapes'
    if 'coin' in text or any(coin in text for coin in ['pennies', 'nickels', 'dimes', 'quarter']):
        requirements += ['coin_visuals_and_values']
        required_visual = 'coins'
    if family == 'reading_multimodal':
        required_visual = 'chart' if sid == 'RI.4.7-1' else 'scene'
    if 'standard algorithm' in text or 'standard algorithm' in row['skill'].casefold():
        requirements += ['visible_intermediate_algorithm_work']
    if family in {'fraction_models', 'fraction_operations', 'fraction_equivalence'}:
        requirements += ['explicit_same_whole_and_equal_units']
    if family == 'equal_groups':
        requirements += ['equal_group_manipulation_and_conserved_stock']
    if sid.startswith(('RL.', 'RI.')) and any(word in text for word in ['two texts', 'two or more', 'several texts', 'versions', 'accounts', 'compare']):
        requirements += ['multiple_complete_texts']
    if sid == LEGACY_FRACTION:
        primary, mechanics = 'fraction_builder', ['fraction_builder', 'number_line', 'quantity_lab', 'math_workspace']
    if sid == LEGACY_PLURAL:
        primary, mechanics = 'word_tiles', ['word_tiles', 'word_choice', 'text_editor', 'sort_connect']
    if sid.startswith('1.NBT.B.2-'):
        mechanics = ['bundle_builder', *[item for item in mechanics if item != 'bundle_builder']]
    guided_mechanics = list(mechanics)
    if family == 'mathematical_reasoning':
        guided_mechanics = ['math_workspace', 'quantity_lab', 'drawing_studio']
    if family == 'fraction_equivalence':
        guided_mechanics = ['fraction_split_compare']
    return dict(subskillId=sid, subject='math' if row['subject'] == 'Math' else 'ela',
                grade=0 if row['grade'] == 'K' else int(row['grade']), domain=row['domain'] or 'Georgia Supplement',
                family=family, demonstration=objective, actionEvidence=evidence,
                primaryMechanic=primary, mechanics=mechanics, modes=modes,
                assessment=assessment, parentParticipation=parent,
                constraints=dict(requiredResponse=required_response, requiredVisual=required_visual,
                    workspaceModes=modes if primary == 'math_workspace' else [], minWrittenWords=min_words,
                    requiredGuidedMechanics=guided_mechanics),
                requirements=list(dict.fromkeys(requirements)))


def compile_map():
    rows = json.loads(CATALOG.read_text())
    entries = [record_for(row) for row in rows if row['grade'] in GRADES]
    if len(entries) != 795 or len({row['subskillId'] for row in entries}) != len(entries):
        raise ValueError('Catalog scope changed; review new K–5 family assignments before compiling.')
    return dict(schemaVersion='1.0', scope=dict(grades=list(GRADES), subjects=['math', 'ela']),
                catalogFile='data/sidekick_skill_map_v2.json', catalogSha256=hashlib.sha256(CATALOG.read_bytes()).hexdigest(),
                provenance='Original Sidekick family coverage assignments; Sources CSV is design inspiration, not executable activity definitions.',
                families={name: dict(primaryMechanic=value[0], mechanics=value[1], assessment=value[2], evidence=value[3]) for name, value in FAMILIES.items()},
                subskills=entries)


def write_map(document):
    # One complete per-ID record per line is searchable and reviewable without
    # producing tens of thousands of lines of repeated JSON indentation.
    header = {key: value for key, value in document.items() if key != 'subskills'}
    text = json.dumps(header, indent=2)
    lines = [text[:-2] + ',\n  "subskills": [']
    lines += ['    ' + json.dumps(row, ensure_ascii=False, separators=(',', ':')) + (',' if index + 1 < len(document['subskills']) else '')
              for index, row in enumerate(document['subskills'])]
    lines += ['  ]\n}\n']
    MAP.write_text('\n'.join(lines))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check that the committed map matches the reviewed compiler')
    parser.add_argument('--report-only', action='store_true', help='Report implementation/evidence stages without changing the reviewed map')
    parser.add_argument('--evidence', action='append', type=Path, help='Additional explicit current-map verification report')
    args = parser.parse_args()
    document = compile_map()
    if args.check:
        if not MAP.is_file() or json.loads(MAP.read_text()) != document:
            raise SystemExit('Coverage map is stale. Review assignments, then run scripts/build_activity_coverage.py.')
    elif not args.report_only:
        write_map(document)
    from backend.activities.coverage import EVIDENCE_PATHS, build_report, markdown_report
    report = build_report([*EVIDENCE_PATHS, *(args.evidence or [])])
    if not args.check:
        (ROOT / 'data/activities/coverage_report.json').write_text(json.dumps(report, indent=2) + '\n')
        (ROOT / 'data/activities/coverage_report.md').write_text(markdown_report(report))
    totals = {key:value for key,value in report['totals'].items() if key != 'unverifiedLiveComposition'}
    print(json.dumps(dict(**totals, unverifiedLiveCompositionCount=len(report['totals']['unverifiedLiveComposition']),
                          mapFile=str(MAP.relative_to(ROOT)), checked=args.check)))


if __name__ == '__main__':
    main()
