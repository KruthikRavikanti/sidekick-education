"""The parent portal groups a child's skills into a handful of plainly named areas."""
import json

import pytest

from backend.gap.areas import AREAS, GEORGIA_STRANDS, area_for
from backend.gap.catalog import seed_catalog
from backend.tests.account_helpers import create_child

NAMED = set(AREAS.values()) | set(GEORGIA_STRANDS.values())
FALLBACKS = {'More math', 'More reading and writing'}


@pytest.mark.parametrize('domain,area', [
    ('Number & Operations: Fractions', 'Fractions'),
    ('Number & Operations in Base Ten', 'Place value'),
    ('Operations & Algebraic Thinking', 'Operations and algebra'),
    ('Reading: Literature', 'Reading stories'),
    ('Reading: Informational Text', 'Reading for information'),
    ('Ratios & Proportional Relationships', 'Ratios'),
])
def test_a_common_core_domain_gets_a_parent_name(domain, area):
    assert area_for({'domain': domain}, '3.X.A.1-1', 'Math') == area


def test_an_unknown_domain_is_kept_but_reads_like_the_others():
    assert area_for({'domain': 'Data & Modeling: Plots'}, 'X', 'Math') == 'Data and Modeling Plots'


def test_georgia_only_skills_are_filed_by_their_strand():
    assert area_for({}, 'GA-3-PAR.3.1-1', 'Math') == 'Operations and algebra'
    assert area_for({}, 'GA-2-MDR.5.1-1', 'Math') == 'Measurement and data'
    assert area_for({'domain': ''}, 'GA-4-GSR.7.1-1', 'Math') == 'Geometry'
    # In kindergarten the number strand is counting. Later it is place value.
    assert area_for({}, 'GA-K-NR.1.1-1', 'Math') == 'Counting'
    assert area_for({}, 'GA-2-NR.1.1-1', 'Math') == 'Place value'


def test_a_skill_with_nothing_to_go_on_still_lands_somewhere():
    assert area_for({}, 'mystery', 'Math') == 'More math'
    assert area_for(None, '', 'Reading/ELA') == 'More reading and writing'
    assert area_for({}, 'GA-3-ZZZ.1.1-1', 'math') == 'More math'


def test_every_skill_in_the_catalog_has_a_named_area(security_context):
    seed_catalog(security_context.db)
    with security_context.db.transaction() as conn:
        rows = conn.execute('SELECT id, subject, grade, raw_json FROM catalog_subskills WHERE active=1').fetchall()
    assert len(rows) > 1000
    by_grade = {}
    for row in rows:
        area = area_for(json.loads(row['raw_json'] or '{}'), row['id'], row['subject'])
        assert area and '&' not in area and ':' not in area, (row['id'], area)
        by_grade.setdefault((row['grade'], row['subject']), set()).add(area)
    # The grades Sidekick starts with never fall back to a catch-all area, and stay a short list a parent can scan.
    for grade in ['K', '1', '2', '3', '4', '5']:
        for subject in ['Math', 'Reading/ELA']:
            areas = by_grade[(grade, subject)]
            assert areas <= NAMED, (grade, subject, areas - NAMED)
            assert 3 <= len(areas) <= 7, (grade, subject, areas)


def test_the_dashboard_sends_an_area_with_every_skill(parent_client, security_context):
    seed_catalog(security_context.db, now=security_context.clock.now())
    profile = create_child(parent_client).json()
    data = parent_client.get(f"/api/parent/dashboard/{profile['id']}").json()
    assert data['skills'] and all(skill['area'] for skill in data['skills'])
    by_subject = {}
    for skill in data['skills']:
        by_subject.setdefault(skill['subject'], set()).add(skill['area'])
    assert by_subject['math'] >= {'Fractions', 'Place value', 'Geometry', 'Measurement and data', 'Operations and algebra'}
    assert by_subject['ela'] >= {'Language', 'Writing', 'Reading stories', 'Reading for information', 'Reading foundations'}
    assert not (by_subject['math'] | by_subject['ela']) & FALLBACKS
    fractions = [skill for skill in data['skills'] if skill['id'] == '3.NF.A.1-2']
    assert fractions and fractions[0]['area'] == 'Fractions'
