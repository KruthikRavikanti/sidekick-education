"""Catalog-aligned fraction work can support the activity entry point safely."""
from fractions import Fraction

import pytest

from backend.gap.grading import extract_math_answer, grade_homework
from backend.tests.test_gap_homework import problem


@pytest.mark.parametrize('question,expected', [
    ('How many 1/4 pieces make 3/4?', Fraction(3)),
    ('How many 1/4 pieces make 1/2?', Fraction(2)),
    ('5 copies of 1/8 is what fraction?', Fraction(5, 8)),
    ('What fraction is 2 copies of 1/8?', Fraction(1, 4)),
])
def test_unit_fraction_questions_have_independently_computed_answers(question, expected):
    assert extract_math_answer(question) == expected


def test_visible_wrong_work_is_preserved_and_equivalent_fraction_is_accepted():
    item = problem(question='How many 1/4 pieces make 3/4?', answer='4')
    assert grade_homework(item).correctness == 'incorrect'
    assert item['student_work']['final_answer']['text'] == '4'
    equivalent = problem(question='What fraction is 2 copies of 1/8?', answer='1/4')
    assert grade_homework(equivalent).correctness == 'correct'


@pytest.mark.parametrize('question', [
    'How many 1/0 pieces make 3/4?',
    'How many 1/3 pieces make 1/4?',
    'What fraction is 99 copies of 1/8?',
    'What fraction is an unreadable number of copies of 1/8?',
])
def test_ambiguous_or_unsupported_unit_fraction_work_abstains(question):
    assert extract_math_answer(question) is None
