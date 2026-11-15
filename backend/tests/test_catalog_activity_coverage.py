"""Full-catalog paths and measured execution stages must not be conflated."""
import copy
import json
from pathlib import Path

import pytest

from backend.activities import capabilities, coverage


def document():
    return json.loads(coverage.MAP_PATH.read_text())


def test_every_k5_catalog_id_has_one_specific_demonstration_and_assessment():
    rows = coverage.validate_document(document())
    assert len(rows) == 795
    assert sum(row['subject'] == 'math' for row in rows.values()) == 396
    assert sum(row['subject'] == 'ela' for row in rows.values()) == 399
    assert {row['grade'] for row in rows.values()} == set(range(6))
    assert all(row['actionEvidence'] and row['requirements'] and row['mechanics'] for row in rows.values())
    assert all(row['assessment'] in {'automatic', 'parent_review'} for row in rows.values())
    assert any(row['domain'] == 'Georgia Supplement' for row in rows.values())


@pytest.mark.parametrize('mutation', [
    lambda raw: raw['subskills'].pop(),
    lambda raw: raw['subskills'].__setitem__(1, copy.deepcopy(raw['subskills'][0])),
    lambda raw: raw['subskills'][0].update(demonstration='A generic counting game'),
    lambda raw: raw['subskills'][0].update(mechanics=['guided_choice']),
    lambda raw: raw.update(catalogSha256='0' * 64),
])
def test_catalog_drift_missing_targets_and_decorative_controls_fail_closed(mutation):
    raw = document()
    mutation(raw)
    with pytest.raises(ValueError):
        coverage.validate_document(raw)


def test_runtime_routing_uses_explicit_ids_instead_of_keywords():
    assert capabilities.mechanics_for({'subskill_id': '3.OA.A.1-1', 'subskill': 'Ignored changed description'})
    assert 'quantity_lab' in capabilities.mechanics_for({'subskill_id': '3.OA.A.1-1'})
    assert capabilities.mechanics_for({'subskill_id': 'not-a-catalog-id', 'subject': 'Math',
                                       'subskill': 'Multiply using equal groups or fractions'}) == ()
    assert capabilities.mechanics_for({'subskill_id': '6.RP.A.2-1'}) == ()


def test_measurement_phonics_writing_and_handwriting_use_genuine_modes():
    ruler = coverage.for_subskill('2.MD.A.1-2')
    assert ruler['constraints']['workspaceModes'] == ['ruler']
    phonics = coverage.for_subskill('RF.1.3-2')
    assert phonics['constraints']['requiredResponse'] == 'oral'
    assert 'target_word_not_read_to_child' in phonics['requirements']
    assert phonics['assessment'] == 'parent_review'
    handwriting = coverage.for_subskill('L.K.1-1')
    assert handwriting['constraints']['requiredResponse'] == 'drawing'
    writing = coverage.for_subskill('W.4.3-2')
    assert writing['constraints']['requiredResponse'] == 'writing'
    assert writing['assessment'] == 'parent_review'
    publication = coverage.for_subskill('W.5.6-1')
    assert publication['parentParticipation'] is True
    assert publication['constraints']['minWrittenWords'] == 400
    assert 'two_page_draft' in publication['requirements']


def test_early_retelling_uses_actual_speech_and_human_roles_require_observation():
    for sid in ['RI.K.2-2', 'RL.1.2-1', 'RL.2.2-1']:
        row = coverage.for_subskill(sid)
        assert row['constraints']['requiredResponse'] == 'oral'
        assert row['assessment'] == 'parent_review'
    for sid in ['W.K.6-1', 'W.2.6-1', 'W.K.7-1', 'RL.K.10-1']:
        assert coverage.for_subskill(sid)['parentParticipation'] is True
    # A mathematical shared endpoint is not a shared human activity.
    assert coverage.for_subskill('4.MD.C.5-1')['parentParticipation'] is False


def test_fraction_explanation_is_not_reduced_to_choosing_a_split_factor():
    row = coverage.for_subskill('4.NF.A.1-2')
    assert row['assessment'] == 'parent_review'
    assert row['constraints']['requiredGuidedMechanics'] == ['fraction_split_compare']
    assert row['constraints']['requiredResponse'] == 'writing'


def test_no_execution_evidence_does_not_mark_mapped_skills_generated_or_played():
    report = coverage.build_report(evidence_paths=[])
    assert report['totals']['total'] == 795
    assert report['totals']['generatedValidated'] == 0
    assert report['totals']['playedScored'] == 0
    assert sum(row['total'] for row in report['byGradeDomain']) == 795
    assert all(not row['evidence'] for row in report['subskills'])


def write_evidence(tmp_path, cases, *, current_map=True):
    path = tmp_path / 'synthetic-execution.json'
    path.write_text(json.dumps(dict(coverageMapSha256=coverage.file_sha(coverage.MAP_PATH) if current_map else '0' * 64,
                                   cases=cases)))
    return path


def case(**changes):
    result = dict(subskillId='RF.1.3-2', generatedValidated=True, playedScored=True,
                specSha256='a' * 64, providerMode='fixture', assessment='parent_review',
                parentReviewed=True, outcome='correct')
    result.update(changes)
    return result


def test_only_current_version_explicit_execution_can_advance_report_stages(tmp_path):
    path = write_evidence(tmp_path, [case()])
    report = coverage.build_report([path])
    assert report['totals']['generatedValidated'] == 1
    assert report['totals']['playedScored'] == 1
    assert report['totals']['fixtureGeneratedValidated'] == 1
    assert report['totals']['liveGeneratedValidated'] == 0
    assert next(row for row in report['subskills'] if row['subskillId'] == 'RF.1.3-2')['evidence'][0]['providerMode'] == 'fixture'
    path = write_evidence(tmp_path, [case()], current_map=False)
    report = coverage.build_report([path])
    assert report['totals']['generatedValidated'] == report['totals']['playedScored'] == 0
    assert report['rejectedEvidenceReports'][0]['reason'] == 'different_or_unrecorded_coverage_version'


def test_parent_review_pending_is_never_incorrect_or_scored_coverage(tmp_path):
    pending = case()
    pending.update(parentReviewed=False, outcome='pending_review')
    report = coverage.build_report([write_evidence(tmp_path, [pending])])
    assert report['totals']['generatedValidated'] == 1
    assert report['totals']['playedScored'] == 0


def test_fabricated_coverage_flags_without_a_definition_hash_are_not_execution_proof(tmp_path):
    invalid = case()
    invalid['specSha256'] = ''
    report = coverage.build_report([write_evidence(tmp_path, [invalid])])
    assert report['totals']['generatedValidated'] == report['totals']['playedScored'] == 0


def test_an_oral_skill_cannot_be_reported_as_automatically_scored(tmp_path):
    invalid = case(assessment='automatic', parentReviewed=False)
    report = coverage.build_report([write_evidence(tmp_path, [invalid])])
    assert report['totals']['generatedValidated'] == report['totals']['playedScored'] == 0


def test_actual_provider_and_controlled_fixture_proof_are_counted_separately(tmp_path):
    report = coverage.build_report([write_evidence(tmp_path, [case(), case(providerMode='live')])])
    assert report['totals']['generatedValidated'] == report['totals']['playedScored'] == 1
    assert report['totals']['fixtureGeneratedValidated'] == report['totals']['liveGeneratedValidated'] == 1
    assert report['totals']['fixturePlayedScored'] == report['totals']['livePlayedScored'] == 1


def test_component_names_alone_do_not_claim_missing_visual_or_measurement_support(monkeypatch):
    features = coverage.implementation_features()
    features['workspaceModes'] -= {'angle'}
    features['visualKinds'] -= {'chart'}
    monkeypatch.setattr(coverage, 'implementation_features', lambda: features)
    report = coverage.build_report([])
    assert '4.MD.C.6-1' in report['totals']['uncovered']
    assert 'RI.4.7-1' in report['totals']['uncovered']
