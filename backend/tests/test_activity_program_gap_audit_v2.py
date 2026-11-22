"""The offline audit covers scope without converting triage into readiness."""
import json

from scripts.report_activity_program_gaps import CATALOG, GRADES, OUTPUT, build_report


def test_every_current_k5_demonstration_is_inspected_once_and_report_is_reproducible():
    expected = {row['subskill_id']:row['subskill'] for row in json.loads(CATALOG.read_text()) if row['grade'] in GRADES}
    report = build_report()
    actual = {row['subskillId']:row['demonstration'] for row in report['subskills']}
    assert len(report['subskills']) == len(actual) == 795
    assert actual == expected
    assert report['totals']['math'] == 396 and report['totals']['ela'] == 399
    assert sum(row['catalogRowsInspected'] for row in report['byGradeDomain']) == 795
    assert json.loads(OUTPUT.read_text()) == report


def test_review_candidates_do_not_claim_supported_or_live_verified_coverage():
    report = build_report()
    assert report['auditKind'] == 'offline_operation_review_inventory'
    assert 'not validated learning requirements or runtime gates' in report['methodology']
    assert report['totals']['rowsWithoutSpecificInference'] > 0
    assert any(row['disposition'] == 'no_specific_extension_inferred_not_verified' for row in report['subskills'])
    assert all(operation['status'] == 'review_backlog_not_an_executable_capability' for operation in report['operationExtensionReviews'])
    assert all(not ({'supported', 'playable', 'generated', 'mastered'} & row.keys()) for row in report['subskills'])


def test_distinct_modalities_and_spatial_requirements_remain_visible_for_review():
    rows = {row['subskillId']:row for row in build_report()['subskills']}
    candidates = lambda skill: {item['operationId'] for item in rows[skill]['candidateOperationReviews']}
    assert 'compose_measure_regions_and_solids' in candidates('5.MD.C.5-3')
    assert 'place_value_exchange' in candidates('3.NBT.A.2-2')
    assert 'sound_print_segmentation' in candidates('RF.1.3-2')
    assert rows['RF.1.3-2']['legacyAssessmentPlan'] == 'parent_review'
    assert 'source_linked_notes' in candidates('W.4.8-1')
    # Writing/grammar actions can overlap; this is not a one-game skill gate.
    assert len(candidates('L.3.3-1')) >= 2
