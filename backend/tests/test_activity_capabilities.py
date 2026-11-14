"""Objective families advertise supported actions; provenance never grants a flow."""
import json
from pathlib import Path

import pytest

from backend.activities import capabilities, service, toolkit
from backend.activities.models import ActivitySpec
from backend.tests.test_general_activity_service import generic_spec


CATALOG = {row['subskill_id']: row for row in json.loads(
    (Path(__file__).resolve().parents[2] / 'data/sidekick_skill_map_v2.json').read_text())}


@pytest.mark.parametrize('subskill,component', [
    ('1.NBT.B.2-1', 'bundle_builder'), ('1.NBT.B.2-4', 'bundle_builder'),
    ('RI.3.3-1', 'tile_order'), ('RI.3.1-1', 'evidence_board'), ('RL.3.1-1', 'evidence_board'),
])
def test_multiple_catalog_skills_share_controls_by_objective(subskill, component):
    assert component in capabilities.mechanics_for(CATALOG[subskill])


@pytest.mark.parametrize('subskill', [
    '2.NBT.A.1-1',  # ten tens -> hundred exceeds the current ones/tens control
    '4.OA.A.2-1', '6.RP.A.2-1', 'W.4.3-1',
    'RL.1.2-1', 'RI.K.2-2', 'RI.4.2-2', 'RL.4.5-2',
])
def test_related_parent_skill_words_do_not_overstate_control_support(subskill):
    assert capabilities.mechanics_for(CATALOG[subskill]) == ()


def test_a_control_from_another_family_cannot_be_used_as_decoration():
    raw = generic_spec('RI.3.3-1')
    # A valid story-control spec cannot be reused for explicitly referring to text.
    raw.update(subskillId='RI.3.1-1', misconceptionTags=['Answers from memory'])
    spec = ActivitySpec.model_validate(raw)
    with pytest.raises(ValueError, match='compatible'):
        capabilities.validate_activity(spec, CATALOG['RI.3.1-1'])


@pytest.mark.parametrize('component,params', [
    ('evidence_board', {'sentences': [{'id': 'a', 'text': 'Mina discovered a wooden boat by the river.'},
                                       {'id': 'b', 'text': 'A bird landed on the fence.'}], 'context': None}),
    ('tile_order', {'tiles': [{'id': 'a', 'text': 'Mina discovered a wooden boat by the river.'},
                            {'id': 'b', 'text': 'She carried the boat home.'}], 'context': None}),
])
def test_final_control_cannot_copy_an_original_passage_or_panel_sentence(component, params):
    # Only normalized fingerprints are retained; original work stays local.
    from types import SimpleNamespace
    params = {**params, **{key: [SimpleNamespace(**item) for item in values]
                         for key, values in params.items() if isinstance(values, list)}}
    scene = SimpleNamespace(component=component, params=SimpleNamespace(**params), prompt='Resolve a fresh mystery.')
    original = 'Mina discovered a wooden boat by the river. She carried the boat home.'
    blocked = service._source_keys(original)
    assert service._task_blocked(scene, blocked)
    assert original not in repr(blocked)
    assert not service._task_blocked(scene, service._source_keys('An entirely different story with another setting.'))


def test_paraphrasing_a_bundle_question_cannot_make_the_same_amount_fresh():
    scene = dict(component='bundle_builder', params=dict(total=43, groupSize=10))
    other = dict(component='bundle_builder', params=dict(total=43, groupSize=10), prompt='A completely new setting.')
    assert toolkit.task_key(scene) == toolkit.task_key(other)
