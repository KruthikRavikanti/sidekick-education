"""Contract witnesses are computations, not live games or child-learning proof."""
import copy
import json
from pathlib import Path
import subprocess
import sys

import pytest

from backend.activity_engine_v2.models import ActivityProgram
from backend.activity_engine_v2.validator import validate_program

ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / 'data/activity_engine_v2/examples'
NAMES = ('observatory_floor', 'habitat_designer', 'trail_evidence', 'story_studio')


def example(name):
    return json.loads((EXAMPLES / f'{name}.json').read_text())


@pytest.mark.parametrize('name', NAMES)
def test_complete_original_examples_have_only_the_named_validation_evidence(name):
    raw = example(name)
    program = ActivityProgram.model_validate(raw)
    report = validate_program(raw)
    assert report.valid, report.model_dump()
    assert report.structural == 'passed'
    assert report.computational == 'witness_verified'
    assert report.witnessSteps == len(program.witness)
    assert report.achievedGoalIds
    assert report.semanticReview == 'required'
    assert report.childTesting == 'not_performed'
    assert report.runtimeIntegration == 'not_connected'
    assert report.artifactVerification == 'not_performed'
    assert program.provenance.origin == 'original_contract_fixture'
    assert program.provenance.model is None
    assert program.provenance.promptVersion is None
    assert 'scenes' not in raw
    assert 'phases' not in raw


def test_one_catalog_skill_can_use_distinct_actions_and_supported_needs():
    tile = example('observatory_floor')
    design = example('habitat_designer')
    assert tile['intent']['targets'] == design['intent']['targets']
    assert tile['intent']['targets'][0]['skillId'] == '3.MD.C.7-1'
    assert tile['intent']['observations'][0]['kind'] != design['intent']['observations'][0]['kind']
    tile_actions = {action['operation'] for action in tile['actions']}
    design_actions = {action['operation'] for action in design['actions']}
    assert tile_actions == {'toggle_tile', 'assemble_product'}
    assert design_actions == {'resize_rectangle', 'assemble_product'}
    assert tile['presentation']['entrySpace'] == design['presentation']['entrySpace'] == 'workshop'


@pytest.mark.parametrize('rows,columns,left,right', [(2, 6, 2, 6), (3, 4, 3, 4), (4, 3, 3, 4), (6, 2, 6, 2)])
def test_design_mission_accepts_distinct_factor_pairs_and_commuted_expressions(rows, columns, left, right):
    raw = example('habitat_designer')
    raw['witness'] = [dict(actionId='reshape',inputs=dict(rows=rows,columns=columns)),
        dict(actionId='build-product',inputs=dict(left=left,right=right,result=12))]
    report = validate_program(raw)
    assert report.valid, report.model_dump()
    assert 'region-explained' in report.achievedGoalIds


@pytest.mark.parametrize('witness', [
    [dict(actionId='reshape',inputs=dict(rows=2,columns=6)), dict(actionId='build-product',inputs=dict(left=2,right=6,result=8))],
    [dict(actionId='reshape',inputs=dict(rows=1,columns=6)), dict(actionId='build-product',inputs=dict(left=1,right=6,result=6))],
    [dict(actionId='reshape',inputs=dict(rows=5,columns=5)), dict(actionId='build-product',inputs=dict(left=5,right=5,result=25))],
])
def test_area_mission_cannot_finish_by_adding_sides_using_half_the_stock_or_overdrawing_stock(witness):
    raw = example('habitat_designer')
    raw['witness'] = witness
    report = validate_program(raw)
    assert not report.valid
    assert report.computational == 'failed'


def test_an_expression_alone_cannot_finish_the_unit_covering_mission():
    raw = example('observatory_floor')
    raw['witness'] = raw['witness'][-1:]
    report = validate_program(raw)
    assert not report.valid
    assert report.computational == 'failed'


def test_lifting_and_replacing_a_tile_changes_the_actual_goal_state():
    raw = example('observatory_floor')
    authored = raw['witness']
    lift = copy.deepcopy(authored[-2])
    raw['witness'] = [*authored[:-1], lift, authored[-1]]
    assert not validate_program(raw).valid
    raw['witness'] = [*authored[:-1], lift, lift, authored[-1]]
    assert validate_program(raw).valid


@pytest.mark.parametrize('case', ['bridge', 'gate'])
def test_investigation_can_finish_either_declared_branch_without_a_prescribed_sequence(case):
    raw = example('trail_evidence')
    raw['witness'] = [dict(actionId=case+'-place-clue',inputs=dict(sentence=case+'-2'))]
    report = validate_program(raw)
    assert report.valid, report.model_dump()
    assert report.achievedGoalIds == [case+'-resolved']


def test_writing_completion_and_parent_assessment_remain_separate():
    raw = example('story_studio')
    assert validate_program(raw).valid
    assert all(item['assessment']['kind'] == 'parent_review' for item in raw['evidence'])
    assert raw['completion']['allowAssisted'] is True
    # The artifact is recorded, but this foundation cannot decide whether a
    # story introduces a character or whether its revision improves the opening.
    raw['evidence'][0]['assessment'] = dict(kind='automatic',when=raw['goals'][0]['when'])
    report = validate_program(raw)
    assert not report.valid
    assert any(issue.code == 'unsupported_automatic_assessment' for issue in report.issues)


def test_saving_an_unchanged_or_empty_revision_cannot_finish_writing():
    raw = example('story_studio')
    raw['witness'][1]['inputs']['text'] = raw['witness'][0]['inputs']['text']
    assert not validate_program(raw).valid
    raw['witness'][1]['inputs']['text'] = ''
    assert not validate_program(raw).valid


def test_a_reachable_literal_key_does_not_prove_its_passage_supports_the_claim():
    raw = example('trail_evidence')
    passage = next(item for item in raw['world']['materials'] if item['id'] == 'gate-passage')
    passage['items'][1]['text'] = 'Bram watched a yellow bird fly past.'
    passage['text'] = ' '.join(item['text'] for item in passage['items'])
    report = validate_program(raw)
    assert report.valid, report.model_dump()
    assert report.computational == 'witness_verified'
    assert report.semanticReview == 'required'
    assert report.childTesting == 'not_performed'


def test_validation_preserves_the_authored_definition_and_has_deterministic_hashes():
    raw = example('habitat_designer')
    original = copy.deepcopy(raw)
    first = validate_program(raw)
    second = validate_program(json.loads(json.dumps(raw, sort_keys=True)))
    assert first.valid and second.valid
    assert first.definitionSha256 == second.definitionSha256
    assert raw == original


def test_offline_validation_does_not_import_live_application_or_provider(tmp_path):
    script = """
import json, sys
from pathlib import Path
from backend.activity_engine_v2.validator import validate_program
raw=json.loads(Path(sys.argv[1]).read_text())
assert validate_program(raw).valid
assert 'backend.main' not in sys.modules
assert 'backend.activities.service' not in sys.modules
assert 'backend.gap.service' not in sys.modules
assert 'backend.provider' not in sys.modules
"""
    result = subprocess.run([sys.executable,'-c',script,str(EXAMPLES/'observatory_floor.json')],
        cwd=ROOT,capture_output=True,text=True,timeout=15)
    assert result.returncode == 0, result.stderr
