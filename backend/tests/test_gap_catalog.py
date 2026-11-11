"""Catalog versions preserve exact past questions, independently of current selection."""
import hashlib
import json
from fractions import Fraction

import pytest

from backend.gap.catalog import DEFAULT_CATALOG, GRADE_ORDER, get_roots, get_subskill, search_candidates, seed_catalog, trace_roots, validate_catalog
from backend.gap.catalog_models import CompiledItem
from backend.gap.items import compile_item, compile_practice_item, exact_fraction, grade_response, item_record, numeric_values, public_item, ready_items, save_generated_item, solve_numeric_question


def draft_row(sid="1.TEST.1-1", *, grade="1", **overrides):
    row = {"subskill_id": sid, "skill_id": sid.rsplit("-", 1)[0], "subject": "Math", "grade": grade, "skill": "Add numbers", "subskill": "Add two numbers", "root_subskills": [], "root_confidence": "", "prerequisite_skills": [], "prerequisite_source": "draft", "builds_on_subskill": "", "check_mode": "Auto-checkable (one right answer)", "home_tip": "Use counters together.", "p1_q": "8 + 3 = ?", "p1_a": "11", "p1_type": "Number", "p2_q": "12 - 3 = ?", "p2_a": "9", "p2_type": "Number", "unknown_source_field": {"preserved": True}}
    return row | overrides


def write_catalog(tmp_path, rows):
    path = tmp_path / "catalog.json"
    path.write_text(json.dumps(rows))
    return path


def test_original_catalog_complete_and_hash_is_unchanged(security_context):
    report = seed_catalog(security_context.db)
    assert hashlib.sha256(DEFAULT_CATALOG.read_bytes()).hexdigest() == "7c7b3a98cdf51bb48b53bcef4c4d5e2c0015fc0845e40f6345a4962eeab1be23"
    assert (report["skills"], report["subskills"], report["seedPairs"]) == (779, 1533, 3066)
    assert report["subjects"] == {"Math": 867, "Reading/ELA": 666}
    assert sum(report["grades"][grade] for grade in ("K", "1", "2", "3", "4", "5")) == 795
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM practice_items").fetchone()[0] == 3066
        assert get_subskill(conn, "K.CC.A.1-1")["eedi_construct"] == "Skip counting in 100s"
        assert get_subskill(conn, "K.CC.A.1-3")["subskill_order"] == 3
        cycle = get_roots(conn, "A-SSE.B.3-1")[0]
        assert cycle["confidence"] == "high" and cycle["reason"] == "unsafe_cycle" and not cycle["usable"]
        assert any(warning["code"] == "prerequisite_above_target" for warning in report["warnings"])
        low = get_roots(conn, "K.CC.C.6-3")[0]
        assert low["confidence"] == "low" and not low["usable"]


def test_unchanged_edit_and_retire_keep_referenced_item_versions(security_context, tmp_path):
    db = security_context.db
    row, other = draft_row(), draft_row("2.TEST.1-1", grade="2")
    path = write_catalog(tmp_path, [row, other])
    first = seed_catalog(db, path, now=10)
    with db.transaction() as conn:
        old = ready_items(conn, row["subskill_id"])[0]
        conn.execute("CREATE TABLE saved_attempt (item_id TEXT REFERENCES practice_items(id), recorded_answer TEXT)")
        conn.execute("INSERT INTO saved_attempt VALUES (?,?)", (old["id"], "11"))
        original_count = conn.execute("SELECT COUNT(*) FROM practice_items").fetchone()[0]
    same = seed_catalog(db, path, now=11)
    assert same["unchanged"] and same["revision"] == first["revision"]
    with db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM practice_items").fetchone()[0] == original_count
    row["p1_q"], row["p1_a"] = "9 + 3 = ?", "12"
    write_catalog(tmp_path, [row])
    changed = seed_catalog(db, path, now=12)
    assert changed["revision"] != first["revision"]
    with db.transaction() as conn:
        historical = conn.execute("SELECT p.* FROM saved_attempt a JOIN practice_items p ON p.id=a.item_id").fetchone()
        assert historical["question"] == old["question"] and historical["answer"] == old["answer"]
        assert conn.execute("SELECT COUNT(*) FROM catalog_row_versions WHERE entity_type='subskill' AND entity_id=?", (row["subskill_id"],)).fetchone()[0] == 2
        assert not get_subskill(conn, other["subskill_id"])["active"]
        assert not ready_items(conn, other["subskill_id"])
        assert get_subskill(conn, row["subskill_id"])["unknown_source_field"] == {"preserved": True}


def test_invalid_catalog_does_not_partially_update(security_context, tmp_path):
    path = write_catalog(tmp_path, [draft_row()])
    seed_catalog(security_context.db, path)
    path.write_text(json.dumps([draft_row(), draft_row()]))
    with pytest.raises(ValueError, match="duplicate_subskill_id"):
        seed_catalog(security_context.db, path)
    with security_context.db.transaction() as conn:
        assert conn.execute("SELECT COUNT(*) FROM catalog_subskills WHERE active=1").fetchone()[0] == 1


def test_relationships_replace_and_runtime_is_bounded(security_context, tmp_path):
    rows = [draft_row("1.TEST.1-1", root_subskills=["K.TEST.1-1"], root_confidence="Medium"), draft_row("K.TEST.1-1", grade="K")]
    path = write_catalog(tmp_path, rows)
    seed_catalog(security_context.db, path)
    with security_context.db.transaction() as conn:
        assert trace_roots(conn, rows[0]["subskill_id"], depth_limit=1)["stopReason"] == "depth_limit"
        assert trace_roots(conn, rows[0]["subskill_id"], visited={rows[0]["subskill_id"]})["stopReason"] == "visited_node"
        assert get_roots(conn, rows[0]["subskill_id"])[0]["rank"] == 1
    rows[0]["root_subskills"] = []
    write_catalog(tmp_path, rows)
    seed_catalog(security_context.db, path)
    with security_context.db.transaction() as conn:
        assert get_roots(conn, rows[0]["subskill_id"]) == []
        assert conn.execute("SELECT COUNT(*) FROM catalog_roots WHERE active=0").fetchone()[0] == 1


def test_validation_missing_cycles_direction_and_confidence():
    rows = [draft_row("1.TEST.1-1", root_subskills=["1.TEST.1-2", "missing", "2.TEST.1-1"], root_confidence="High"), draft_row("1.TEST.1-2", root_subskills=["1.TEST.1-1"], root_confidence="Medium"), draft_row("2.TEST.1-1", grade="2", root_subskills=["1.TEST.1-1"], root_confidence="Maybe")]
    report, roots, _ = validate_catalog(rows)
    assert {edge["reason"] for edge in roots} >= {"unsafe_cycle", "missing_reference"}
    assert any(edge["confidence"] == "unknown" and not edge["usable"] for edge in roots)
    assert report["errors"] == []
    assert GRADE_ORDER["K"] < GRADE_ORDER["1"] < GRADE_ORDER["8"]
    assert "Algebra 1" not in GRADE_ORDER


def test_retrieval_is_subject_grade_bounded(security_context, tmp_path):
    rows = [draft_row(), draft_row("2.TEST.1-1", grade="2"), draft_row("3.TEST.1-1", grade="3"), draft_row("A.TEST.1-1", grade="Algebra 1"), draft_row("RL.1.TEST-1", subject="Reading/ELA")]
    seed_catalog(security_context.db, write_catalog(tmp_path, rows))
    candidates = search_candidates(security_context, "math", "1", "Add two numbers 8 + 3", limit=10)
    assert {row["id"] for row in candidates} == {"1.TEST.1-1", "2.TEST.1-1"}
    assert all(len(row["revision"]) == 64 and len(row["content_hash"]) == 64 for row in candidates)
    assert not search_candidates(security_context, "math", "Algebra 1", "Add")


def test_compilation_checks_answer_independently_and_preserves_adult_rubric():
    ready = compile_item(draft_row())
    assert ready.readiness == "ready" and ready.verified
    assert ready.gradingSpec.exactFraction == "11"
    assert ready.responseSpec.readAloud
    wrong = compile_item(draft_row(p1_a="12"))
    assert wrong.readiness == "pending" and not wrong.verified
    adult = compile_item(draft_row(check_mode="Needs an adult or AI rubric (spoken, written, or drawn)", p1_type="Say or do it aloud"))
    assert adult.readiness == "adult_required" and not adult.verified
    assert adult.gradingSpec.expectedResponse == "11" and adult.gradingSpec.homeTip == "Use counters together."
    with pytest.raises(ValueError):
        CompiledItem.model_validate({**adult.model_dump(), "readiness": "ready"})


def test_multiple_values_units_and_context_are_not_silently_discarded():
    row = draft_row(p1_q="Fill in: 14, 15, __, __", p1_a="16 and 17")
    item = compile_item(row)
    assert item.readiness == "ready" and len(item.responseSpec.fields) == 2
    assert item.gradingSpec.expectedValues == [{"exactFraction": "16", "unit": None}, {"exactFraction": "17", "unit": None}]
    assert numeric_values("3 hundreds, 0 tens, 0 ones") == [{"exactFraction": "3", "unit": "hundreds"}, {"exactFraction": "0", "unit": "tens"}, {"exactFraction": "0", "unit": "ones"}]
    unit = compile_item(draft_row(p1_a="11 inches"))
    assert unit.gradingSpec.unit == "inches" and unit.readiness == "adult_required"
    passage = compile_item(draft_row(p1_q="What is the theme of the story?", p1_type="Short text"))
    assert passage.readiness == "missing_context"
    choice = compile_item(draft_row(p1_q="Which is larger?", p1_type="Pick a choice"))
    assert choice.readiness == "missing_context"
    plot = compile_item(draft_row(p1_q="Use the plot from question 2. How many?"))
    assert plot.readiness == "missing_context"


def test_choice_option_ids_and_safe_public_shape():
    item = compile_item(draft_row(p1_q="Point to 12. Choices: 21, 12, 2", p1_a="12", p1_type="Pick a choice"))
    assert item.verified and item.gradingSpec.correctOptionId == "option-2"
    record = {**item.model_dump(), "id": "private-version", "subskill_id": "1.TEST.1-1", "verificationResult": {"secretAnswer": "12"}, "original": {"answer": "12"}}
    public = public_item(record)
    assert set(public) == {"id", "subskillId", "question", "context", "responseSpec", "readiness"}
    assert "gradingSpec" not in public and "answer" not in public
    assert grade_response(record, "option-2")["correctness"] == "correct"


def test_exact_numeric_grading_equivalence_representation_and_units():
    item = {"gradingSpec": {"kind": "number", "expectedValues": [{"exactFraction": "1/2", "unit": None}], "representation": "equivalent"}}
    assert grade_response(item, "4/8")["correctness"] == "correct"
    assert grade_response(item, "0.5")["correctness"] == "correct"
    item["gradingSpec"]["representation"] = "fraction"
    assert grade_response(item, "0.5")["correctness"] == "incorrect"
    assert grade_response(item, "4/8")["correctness"] == "correct"
    item["gradingSpec"]["expectedValues"][0]["unit"] = "inches"
    assert grade_response(item, {"value": "1/2", "unit": "inches"})["correctness"] == "correct"
    assert grade_response(item, {"value": "1/2", "unit": "feet"})["correctness"] == "incorrect"
    assert grade_response(item, "unclear")["correctness"] == "ungraded"
    assert exact_fraction("-1 1/2") == Fraction(-3, 2)
    assert solve_numeric_question("__import__('os').system('echo nope')") is None
    assert solve_numeric_question("0.10000000000000001 + 0.2 = ?") == [Fraction("0.30000000000000001")]
    assert solve_numeric_question("4 ÷ 1/5 = ?") == [Fraction(20)]
    assert solve_numeric_question("3/4 ÷ 1/2 = ?") == [Fraction(3, 2)]
    assert solve_numeric_question("4/1/5 = ?") is None


def test_form_rules_graph_coordinates_and_malformed_responses():
    item = {"gradingSpec": {"kind": "number", "expectedValues": [{"exactFraction": "1/2", "unit": "inches"}], "representation": "simplest_fraction"}}
    assert grade_response(item, "1/2 inch")["correctness"] == "correct"
    assert grade_response(item, "4/8 inches")["correctness"] == "incorrect"
    assert grade_response(item, {"value": "1/2", "unit": []})["correctness"] == "ungraded"
    item["gradingSpec"] = {"kind": "number", "expectedValues": [{"exactFraction": "2", "unit": None}], "representation": "integer"}
    assert grade_response(item, "2")["correctness"] == "correct"
    assert grade_response(item, "2.0")["correctness"] == "incorrect"
    graph = {"gradingSpec": {"kind": "graph", "expectedGraph": {"points": [["1/2", "2"]]}}}
    assert grade_response(graph, {"points": [["0.5", 2]]})["correctness"] == "correct"
    assert grade_response(graph, {"points": [["1/3", 2]]})["correctness"] == "incorrect"
    assert grade_response(graph, {"points": [["unclear", 2]]})["correctness"] == "ungraded"
    assert grade_response(graph, {"points": []})["correctness"] == "ungraded"
    order = {"gradingSpec": {"kind": "ordering", "expectedOrder": ["a", "b"]}}
    assert grade_response(order, [{"a": "b"}])["correctness"] == "ungraded"


def test_generated_items_have_immutable_versions(security_context, tmp_path):
    seed_catalog(security_context.db, write_catalog(tmp_path, [draft_row()]))
    with security_context.db.transaction() as conn:
        first = save_generated_item(conn, "1.TEST.1-1", "generated:test:1", compile_item(draft_row()), now=1)
        same = save_generated_item(conn, "1.TEST.1-1", "generated:test:1", compile_item(draft_row()), now=2)
        newer = save_generated_item(conn, "1.TEST.1-1", "generated:test:1", compile_item(draft_row(p1_q="9 + 3 = ?", p1_a="12")), now=3)
        assert first["id"] == same["id"] and first["id"] != newer["id"]
        assert not conn.execute("SELECT active FROM practice_items WHERE id=?", (first["id"],)).fetchone()[0]


def test_self_contained_ordering_number_line_and_graph_compile_safely():
    order = compile_item(draft_row(p1_q="Order from longest to shortest: a 3-cube train, a 7-cube train, a 5-cube train.", p1_a="7, 5, 3", p1_type="Sort / order / match"))
    assert order.readiness == "ready" and order.responseSpec.kind == "ordering"
    assert grade_response(order.model_dump(), ["item-2", "item-3", "item-1"])["correctness"] == "correct"
    line = compile_item(draft_row(p1_q="Mark 3/4 on a number line from 0 to 1.", p1_a="Third mark of four equal parts", p1_type="Number line or graph"))
    assert line.readiness == "ready" and line.responseSpec.kind == "number_line"
    assert line.responseSpec.graph == {"min": "0", "max": "1", "step": "1/4"}
    assert grade_response(line.model_dump(), {"value": "0.75"})["correctness"] == "correct"
    graph = compile_item(draft_row(p1_q="Plot (-3, 2) and (2, -3).", p1_a="(-3, 2) is left 3, up 2; (2, -3) is right 2, down 3", p1_type="Number line or graph"))
    assert graph.readiness == "ready" and graph.responseSpec.kind == "graph"
    assert grade_response(graph.model_dump(), {"points": [[-3, 2], [2, -3]]})["correctness"] == "correct"
    missing = compile_item(draft_row(p1_q="Graph those three points.", p1_a="Points on a straight line through the origin", p1_type="Number line or graph"))
    assert missing.readiness == "missing_context" and not missing.verified


def test_retrieval_preserves_exact_fraction_and_addition_questions(security_context):
    seed_catalog(security_context.db)
    for question, grade, expected in [("2/3 + 1/4 = ?", "5", "5.NF.A.1-2"), (" 2 / 3 ＋ 1 / 4 = ? ", "5", "5.NF.A.1-2"), ("6 + 3 = ?", "1", "1.OA.C.6-1")]:
        candidates = search_candidates(security_context, "math", grade, question)
        assert candidates[0]["id"] == expected
        assert len(candidates) <= 10
        assert all(row["subject"] == "Math" and GRADE_ORDER[row["grade"]] <= GRADE_ORDER[grade] + 1 for row in candidates)


def test_evaluation_expected_candidate_recall(security_context):
    seed_catalog(security_context.db)
    cases = json.loads(DEFAULT_CATALOG.with_name("evaluation_homework.json").read_text())
    labeled = [case for case in cases if case["expected"]["subskill_id"]]
    assert len(labeled) == 22
    for case in labeled:
        candidates = search_candidates(security_context, case["subject"], case["grade"], case["problem"]["question"]["text"])
        assert case["expected"]["subskill_id"] in {candidate["id"] for candidate in candidates}, case["id"]
    # Retrieval supplies options; it never forces a decision for the five cases
    # whose expected mapping is abstention (including unreadable/multi-skill work).
    assert sum(case["expected"]["subskill_id"] is None for case in cases) == 5
