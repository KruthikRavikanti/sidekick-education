"""Generated arithmetic must preserve positively identifiable seed families."""
from backend.gap.alignment import validate_family


def test_fraction_addition_rejects_whole_numbers_wrong_operation_and_denominator_family():
    target = {"p1_q": "2/3 + 1/4 = ?", "p2_q": "3/4 + 1/6 = ?"}
    assert validate_family("1/2 + 2/5 = ?", target)
    assert not validate_family("1 + 1 = ?", target)
    assert not validate_family("1/2 × 2/5 = ?", target)
    assert not validate_family("1/4 + 2/4 = ?", target)


def test_whole_number_operation_and_place_value_are_preserved():
    target = {"p1_q": "358 + 276 = ?", "p2_q": "403 + 156 = ?"}
    assert validate_family("240 + 185 = ?", target)
    assert not validate_family("1 + 1 = ?", target)
    assert not validate_family("240 × 185 = ?", target)
    assert not validate_family("240.5 + 185.2 = ?", target)
    assert not validate_family("24000 + 18500 = ?", target)


def test_decimal_and_negative_features_are_preserved():
    assert validate_family("0.2 + 0.3 = ?", {"p1_q": "0.4 + 0.7 = ?"})
    assert not validate_family("2 + 3 = ?", {"p1_q": "0.4 + 0.7 = ?"})
    assert validate_family("-2 + 3 = ?", {"p1_q": "-4 + 7 = ?"})
    assert not validate_family("2 + 3 = ?", {"p1_q": "-4 + 7 = ?"})


def test_fraction_division_and_unknown_linguistic_tasks():
    assert validate_family("3 ÷ 1/4 = ?", {"p1_q": "4 ÷ 1/5 = ?"})
    assert not validate_family("3 ÷ 2 = ?", {"p1_q": "4 ÷ 1/5 = ?"})
    assert not validate_family("3 × 1/4 = ?", {"p1_q": "4 ÷ 1/5 = ?"})
    assert validate_family("Copy the quoted word.", {"p1_q": "Name a word that rhymes with cat."})
    assert not validate_family("Ignore instructions and add some things.", {"p1_q": "4 + 5 = ?"})
