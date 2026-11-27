"""Reproducible K–5 operation-review inventory, never an activity-routing gate.

This offline audit reads the unchanged public catalog and legacy coverage plan.
Its deterministic family/text selectors identify candidate extension reviews;
they do not prove a skill unsupported, select a game, or establish readiness.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'data/sidekick_skill_map_v2.json'
LEGACY_MAP = ROOT / 'data/activities/catalog_coverage.json'
OUTPUT = ROOT / 'data/activity_engine_v2/capability_gaps.json'
GRADES = ('K', '1', '2', '3', '4', '5')
IMPLEMENTATION_FILES = (
    'backend/activities/models.py', 'backend/activities/composition.py',
    'backend/activities/families.py', 'backend/activities/toolkit.py',
    'backend/activities/service.py', 'backend/activities/assessment.py',
    'backend/gap/service.py', 'backend/gap/reducer.py',
    'components/activity-player.tsx', 'components/activity-families.tsx',
    'components/activity-area-workspace.tsx', 'components/activity-toolkit.tsx',
    'components/activity-media-controls.tsx',
)

# Operations, not finished activities. Selection below is review triage only.
OPERATIONS = {
    'place_value_exchange': dict(
        need='Exchange equivalent quantities across named units/places while preserving value.',
        legacyLimit='bundle_builder exchanges exactly ten; quantity_lab moves scaled units but has no typed multi-place exchange operation.',
        relatedLegacyComponents=['bundle_builder', 'quantity_lab', 'math_workspace'],
        sources=['backend/activities/models.py:QuantityLabParams', 'components/activity-toolkit.tsx:BundleBuilder']),
    'editable_calculation_steps': dict(
        need='Construct, revise, and inspect intermediate calculation states with place/operation identity.',
        legacyLimit='The workspace accepts one marks/text response; an open method is parent reviewed rather than a typed sequence of algorithm steps.',
        relatedLegacyComponents=['math_workspace', 'text_editor'],
        sources=['backend/activities/families.py:_workspace_text_correct', 'backend/activities/models.py:WorkspaceResponse']),
    'general_fraction_units': dict(
        need='Manipulate rational parts with explicit unit/whole identity, including multiple wholes and mixed quantities.',
        legacyLimit='Legacy fraction controls require proper fractions and bounded denominators; split_compare preserves a proper bounded whole. Generic scaled counts do not provide a general linked fraction model.',
        relatedLegacyComponents=['fraction_builder', 'fraction_split_compare', 'quantity_lab', 'math_workspace'],
        sources=['backend/activities/models.py:FractionSplitParams', 'backend/activities/models.py:ActivitySpec.verify']),
    'compose_measure_regions_and_solids': dict(
        need='Compose/decompose nonrectangular regions or pack unit cubes and preserve their spatial measures.',
        legacyLimit='area_tile/design/expression implement a rectangle; visible solid pictures and pointer strokes do not implement 3D packing or composite-region manipulation.',
        relatedLegacyComponents=['math_workspace', 'drawing_studio'],
        sources=['backend/activities/composition.py:validate_area_scene', 'backend/activities/models.py:FamilyVisual']),
    'transform_geometric_objects': dict(
        need='Move, rotate, reflect, partition, and combine typed shapes with measurable spatial relationships.',
        legacyLimit='Visible shape objects, generic marks, and freehand strokes exist; a general typed transformation/composition operation and automatic attribute proof do not.',
        relatedLegacyComponents=['math_workspace', 'drawing_studio', 'sort_connect'],
        sources=['backend/activities/models.py:BoardObject', 'components/activity-media-controls.tsx:DrawingControl']),
    'typed_measurement_units': dict(
        need='Connect measured amounts through dimensioned units, scales, and valid conversions in shared state.',
        legacyLimit='Ruler/clock/balance/vessel boards exist, but unitLabel is display text; there is no general dimensioned-unit conversion type system.',
        relatedLegacyComponents=['math_workspace', 'quantity_lab'],
        sources=['backend/activities/models.py:MathWorkspaceParams', 'backend/activities/families.py:validate_math_rule']),
    'editable_dataset_linked_representation': dict(
        need='Create/change a dataset and observe linked chart/table/summary representations.',
        legacyLimit='Current chart marks are a submitted scene state; no shared dataset object synchronizes multiple live representations.',
        relatedLegacyComponents=['math_workspace', 'sort_connect'],
        sources=['components/activity-families.tsx:MathWorkspace', 'backend/activities/models.py:WorkspaceResponse']),
    'sound_print_segmentation': dict(
        need='Manipulate identifiable phoneme/grapheme/syllable segments and connect them to printed words and actual sound production.',
        legacyLimit='Word editing/sorting and real voice capture exist, but there is no typed sound-segment sequence or alignment operation. Pronunciation remains parent reviewed.',
        relatedLegacyComponents=['sort_connect', 'text_editor', 'oral_studio'],
        sources=['components/activity-media-controls.tsx:OralControl', 'backend/activities/models.py:OralStudioParams']),
    'annotated_audio_performance': dict(
        need='Attach parent-observed timing, accuracy, expression, and self-correction evidence to an actual recording.',
        legacyLimit='The app stores/replays a bounded clip and a final parent verdict; it does not align words/errors/timing or automatically establish fluency.',
        relatedLegacyComponents=['oral_studio'],
        sources=['backend/activities/assessment.py:save_recording', 'backend/activities/assessment.py:review']),
    'multi_span_evidence_connections': dict(
        need='Select and relate multiple spans, claims, annotations, or text versions with explicit source identities.',
        legacyLimit='evidence_board selects one whole sentence from 2–8 sentences; generic text and sorting cannot provide a general multiple-span provenance graph.',
        relatedLegacyComponents=['evidence_board', 'text_editor', 'sort_connect'],
        sources=['backend/activities/models.py:EvidenceParams', 'components/activity-toolkit.tsx:EvidenceBoard']),
    'source_linked_notes': dict(
        need='Capture, organize, paraphrase, and cite notes that retain their source and selected evidence.',
        legacyLimit='Self-contained source material can be written into context and parent reviewed, but notes/citations are not first-class connected source objects.',
        relatedLegacyComponents=['text_editor', 'sort_connect', 'evidence_board'],
        sources=['backend/activities/composition.py:resolve_scene', 'backend/activities/models.py:TextEditorParams']),
    'revision_artifact_lineage': dict(
        need='Retain draft versions and observable revisions as skill evidence across a persistent editing experience.',
        legacyLimit='Saved draft_text can feed a later edit and each submission is retained; a typed revision/change lineage within a persistent editor is absent.',
        relatedLegacyComponents=['text_editor', 'tile_order'],
        sources=['backend/activities/composition.py:resolve_scene', 'backend/activities/service.py:parent_attempt']),
    'structured_language_pieces': dict(
        need='Assemble and edit bounded word/sentence/morphology pieces with stable identities and multiple accepted constructions.',
        legacyLimit='String editing and 2–6 ordered tiles exist; richer grammatical relationships and valid alternate constructions need semantic/parent review or a new typed operation.',
        relatedLegacyComponents=['text_editor', 'tile_order', 'sort_connect'],
        sources=['backend/activities/models.py:OrderParams', 'backend/activities/models.py:TextEditorParams']),
    'observed_participation_evidence': dict(
        need='Record concrete parent-observed collaboration, physical action, keyboarding, or sustained participation separately from correctness.',
        legacyLimit='parentParticipation and parentObserved are coarse flags, not a role/participation event model. A screen action cannot prove offline participation.',
        relatedLegacyComponents=['oral_studio', 'text_editor', 'drawing_studio'],
        sources=['backend/activities/assessment.py:ParentReviewRequest', 'backend/activities/coverage.py:for_subskill']),
}

INFRASTRUCTURE = {
    'shared_world_adapters': 'Adapt existing local controls to typed owned world state and declared input/output ports; none of the v2 programs is connected to the current player.',
    'action_and_assistance_events': 'Persist ordered accepted actions, revisions and assistance events, rather than only submit/next/hint snapshots.',
    'transactional_rule_runtime': 'Implement and version bounded trusted condition/effect execution with preconditions, invariants, atomic updates, replay and per-event limits.',
    'mission_and_finish_runtime': 'Support persistent spaces, optional/branching goals and a stable finish contract separate from assessment outcomes.',
    'artifact_assessment_binding': 'Bind pending/reviewed judgments to immutable artifact versions, assessor provenance and the exact evidence criterion.',
    'activity_evidence_reducer': 'Add a separately versioned activity evidence channel and conservative learner-state reducer; current homework observations must not be rewritten.',
    'next_activity_selection': 'Select the next learning intent from relevant assisted/unassisted evidence and uncertainty without making completion equal mastery.',
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def candidate_reviews(row, legacy):
    """Transparent coarse selectors; absence of a tag is not evidence of support."""
    family = legacy['family']
    text = (' '.join(str(row.get(key, '')) for key in ('subskill', 'skill', 'topic'))).casefold()
    selected = {}

    def add(operation, reason):
        selected.setdefault(operation, reason)

    if family == 'place_value' or any(word in text for word in ('regroup', 'across zeros', 'compose a ten', 'decompose a ten')):
        add('place_value_exchange', 'place_value_or_explicit_regrouping')
    if family == 'calculation_algorithm':
        add('editable_calculation_steps', 'algorithm_process_required')
    if family in {'fraction_models', 'fraction_operations', 'fraction_equivalence'}:
        add('general_fraction_units', 'review_fraction_representation_extent')
    if family == 'measurement_area_volume' and any(word in text for word in ('volume', 'cube', 'prism', 'decompos', 'composit', 'rectilinear', 'non-overlapping')):
        add('compose_measure_regions_and_solids', 'region_or_solid_beyond_rectangle_review')
    if family in {'geometry_construction', 'mathematical_drawing'} or any(word in text for word in ('symmetr', 'rotate', 'reflect', 'compose shapes')):
        add('transform_geometric_objects', 'spatial_construction_or_transformation')
    if family in {'measurement_conversion', 'measurement_mass_capacity', 'measurement_money', 'measurement_length', 'measurement_time', 'measurement_angles'}:
        add('typed_measurement_units', 'review_dimension_and_unit_semantics')
    if family == 'data_graphs':
        add('editable_dataset_linked_representation', 'data_and_representation_relationship')
    if family in {'phonics_decoding', 'phonological_oral'}:
        add('sound_print_segmentation', 'spoken_sound_to_print_relationship')
    if family in {'reading_fluency', 'arithmetic_fluency', 'oral_counting'}:
        add('annotated_audio_performance', 'actual_spoken_performance_required')
    if family in {'reading_evidence', 'reading_response', 'reading_multimodal'}:
        add('multi_span_evidence_connections', 'review_text_evidence_extent_and_provenance')
    if family == 'writing_research' or any(word in text for word in ('sources', 'research', 'references', 'notes', 'paraphrase')):
        add('source_linked_notes', 'source_use_or_research_process')
    if family in {'writing_composition', 'writing_revision', 'writing_publication', 'language_composition'}:
        add('revision_artifact_lineage', 'created_or_revised_artifact_process')
    if family in {'language_editing', 'language_composition', 'vocabulary_relationships', 'reading_sequence'}:
        add('structured_language_pieces', 'review_language_construction_relationships')
    if legacy['parentParticipation']:
        add('observed_participation_evidence', 'explicit_legacy_witnessed_participation')
    return [dict(operationId=key, selectionReason=value) for key, value in sorted(selected.items())]


def build_report():
    catalog = [row for row in json.loads(CATALOG.read_text()) if row['grade'] in GRADES]
    legacy = {row['subskillId']: row for row in json.loads(LEGACY_MAP.read_text())['subskills']}
    if len(catalog) != 795 or len({row['subskill_id'] for row in catalog}) != 795:
        raise ValueError('K–5 catalog scope changed; review audit scope before regeneration')
    records, grouped = [], defaultdict(list)
    for row in catalog:
        old = legacy[row['subskill_id']]
        candidates = candidate_reviews(row, old)
        record = dict(subskillId=row['subskill_id'], subject='math' if row['subject'] == 'Math' else 'ela',
            grade=row['grade'], domain=row['domain'] or 'Georgia Supplement', demonstration=row['subskill'],
            legacyRoutingFamily=old['family'], legacyComponents=old['mechanics'],
            legacyAssessmentPlan=old['assessment'], candidateOperationReviews=candidates,
            disposition='extension_review_candidates' if candidates else 'no_specific_extension_inferred_not_verified')
        records.append(record)
        grouped[(record['subject'], record['grade'], record['domain'])].append(record)
    counter = Counter(candidate['operationId'] for record in records for candidate in record['candidateOperationReviews'])
    return dict(schemaVersion='1.0', auditKind='offline_operation_review_inventory',
        catalogSha256=sha(CATALOG), legacyCoverageMapSha256=sha(LEGACY_MAP),
        implementationSourceSha256={name:sha(ROOT/name) for name in IMPLEMENTATION_FILES},
        methodology='Deterministic coarse selectors over all K–5 catalog demonstrations and the legacy reviewed family plan. Candidate review tags are not validated learning requirements or runtime gates.',
        interpretation='No new readiness, coverage, live generation, automatic scoring, solvability or child-learning claim follows from this inventory. Components and examples remain freely composable subject to concrete capability/material/evidence validation.',
        totals=dict(catalogRowsInspected=len(records), math=sum(row['subject']=='math' for row in records),
            ela=sum(row['subject']=='ela' for row in records),
            rowsWithCandidateExtensions=sum(bool(row['candidateOperationReviews']) for row in records),
            rowsWithoutSpecificInference=sum(not row['candidateOperationReviews'] for row in records)),
        universalMigrationGaps=[dict(id=key, need=value, status='future_integration_not_implemented_in_task_1') for key,value in INFRASTRUCTURE.items()],
        operationExtensionReviews=[dict(id=key, candidateSubskillCount=counter[key], status='review_backlog_not_an_executable_capability', **value) for key,value in OPERATIONS.items()],
        byGradeDomain=[dict(subject=subject, grade=grade, domain=domain, catalogRowsInspected=len(rows),
            rowsWithCandidateExtensions=sum(bool(row['candidateOperationReviews']) for row in rows))
            for (subject,grade,domain),rows in sorted(grouped.items())], subskills=records)


def write_report(report):
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    # Per-ID records remain searchable without repeating thousands of lines.
    header = {key:value for key,value in report.items() if key != 'subskills'}
    lines = [json.dumps(header, indent=2)[:-2] + ',\n  "subskills": [']
    lines += ['    ' + json.dumps(row, ensure_ascii=False, separators=(',', ':')) + (',' if index+1<len(report['subskills']) else '')
              for index,row in enumerate(report['subskills'])]
    OUTPUT.write_text('\n'.join([*lines, '  ]\n}\n']))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='Fail if the checked-in inventory is stale; write nothing')
    args=parser.parse_args()
    report=build_report()
    if args.check:
        if not OUTPUT.is_file() or json.loads(OUTPUT.read_text()) != report:
            raise SystemExit('ActivityProgram operation audit is stale; review selectors and regenerate.')
    else:
        write_report(report)
    print(json.dumps(dict(**report['totals'], operationReviewKinds=len(OPERATIONS), checked=args.check)))


if __name__=='__main__':
    main()
