"""Conservative item compilation, exact arithmetic, and private item persistence.

Draft answer text is not proof. Only a supported independent deterministic solver
can promote solo items to ready; other complete tasks retain their adult rubric.
"""
import ast
import hashlib
import json
import operator
import re
from math import gcd
from math import ceil, floor
from fractions import Fraction
from typing import Any

from .catalog_models import CompiledItem, GradingSpec, PracticeContext, ResponseSpec

COMPILER_VERSION = "items-v1"
NUMERIC = r"[-+]?(?:\d+\s+\d+/\d+|\d+/\d+|\d+(?:\.\d+)?|\.\d+)"
TYPE_KINDS = {"Number": "number", "Pick a choice": "choice", "Short text": "short_text", "Sort / order / match": "ordering", "Number line or graph": "graph"}


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode()).hexdigest()


def exact_fraction(value: Any) -> Fraction | None:
    if isinstance(value, bool):
        return None
    text = str(value).strip().replace("−", "-")
    if not re.fullmatch(NUMERIC, text):
        return None
    try:
        if re.fullmatch(r"[-+]?\d+\s+\d+/\d+", text):
            whole, part = text.split()
            return Fraction(whole) + (-1 if whole.startswith("-") else 1) * Fraction(part)
        result = Fraction(text)
        return result if abs(result) <= 10**15 else None
    except (ValueError, ZeroDivisionError):
        return None


def numeric_values(answer: str) -> list[dict[str, Any]]:
    values = []
    for part in re.split(r"\s*(?:;|,|\band\b)\s*", answer):
        match = re.fullmatch(rf"({NUMERIC})\s*([A-Za-z²³%][A-Za-z ²³%./-]*)?", part.strip())
        if not match:
            return []
        number = exact_fraction(match.group(1))
        if number is None:
            return []
        values.append({"exactFraction": str(number), "unit": (match.group(2) or "").strip() or None})
    return values


def _arithmetic(expression: str) -> Fraction | None:
    # Worksheet fraction bars bind as a whole operand: 4 ÷ 1/5 means 4 ÷ (1/5).
    # An unspaced chain using only slash notation is ambiguous, so abstain.
    if re.search(r"\d+/\d+/\d+", expression):
        return None
    expression = re.sub(r"(?<![\d./])(\d+/\d+)(?![\d./])", r"(\1)", expression)
    expression = expression.replace("×", "*").replace("÷", "/").replace("−", "-")
    if len(expression) > 120 or not re.fullmatch(r"[\d.\s()+*/-]+", expression):
        return None
    try:
        tree = ast.parse(expression.strip(), mode="eval")
        operations = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv}

        def solve(node, depth=0):
            if depth > 15:
                raise ValueError()
            if isinstance(node, ast.Constant) and type(node.value) in (int, float):
                return Fraction(ast.get_source_segment(expression.strip(), node))
            if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
                return (-1 if isinstance(node.op, ast.USub) else 1) * solve(node.operand, depth + 1)
            if isinstance(node, ast.BinOp) and type(node.op) in operations:
                return operations[type(node.op)](solve(node.left, depth + 1), solve(node.right, depth + 1))
            raise ValueError()

        result = solve(tree.body)
        return result if abs(result) <= 10**15 else None
    except (SyntaxError, ValueError, ZeroDivisionError, OverflowError):
        return None


def solve_numeric_question(question: str) -> list[Fraction] | None:
    """Solve a small, explicit grammar; never execute arbitrary question text."""
    text = question.strip().replace("−", "-")
    expression = re.fullmatch(r"(?:(?:What is|Calculate|Compute|Evaluate|Solve)\s+)?([\d.\s()+*/×÷-]+)(?:\s*=\s*\?)?[?.]?", text, re.I)
    if expression:
        answer = _arithmetic(expression.group(1))
        return [answer] if answer is not None else None
    # A linear missing-number equation has one unknown and no other prose.
    missing = re.fullmatch(r"([\d.]+|\?)\s*([+*-])\s*([\d.]+|\?)\s*=\s*([\d.]+|\?)\s*[?.]?", text)
    if missing and list(missing.groups()).count("?") == 1:
        left, op, right, total = missing.groups()
        a, b, c = [None if x == "?" else Fraction(x) for x in (left, right, total)]
        try:
            if c is None:
                return [{"+": operator.add, "-": operator.sub, "*": operator.mul}[op](a, b)]
            if a is None:
                return [{"+": lambda: c - b, "-": lambda: c + b, "*": lambda: c / b}[op]()]
            return [{"+": lambda: c - a, "-": lambda: a - c, "*": lambda: c / a}[op]()]
        except ZeroDivisionError:
            return None
    # Explicit arithmetic sequences only, including every requested missing value.
    sequence = re.fullmatch(r"(?:Fill in:\s*)?((?:\d+|__)\s*(?:,\s*(?:\d+|__)\s*){2,})[.]?", text, re.I)
    if sequence:
        tokens = [token.strip() for token in sequence.group(1).split(",")]
        known = [(i, Fraction(token)) for i, token in enumerate(tokens) if token != "__"]
        if len(known) >= 2 and any(token == "__" for token in tokens):
            step = (known[1][1] - known[0][1]) / (known[1][0] - known[0][0])
            if all(value == known[0][1] + (i - known[0][0]) * step for i, value in known):
                return [known[0][1] + (i - known[0][0]) * step for i, token in enumerate(tokens) if token == "__"]
    return None


def _missing_context(question: str, context: PracticeContext) -> list[str]:
    missing = list(context.missing)
    if re.search(r"\b(?:passage|story|text|poem|article) (?:above|below|provided)|\b(?:from|in|about|of) (?:the|this) (?:passage|story|poem|article)\b|\b(?:Read|Reread) (?:the|this) (?:passage|story|poem|article)\b", question, re.I) and not context.passages:
        # Embedded quoted task text is preserved but cannot stand in for a full referenced passage.
        missing.append("referenced passage")
    if re.search(r"\b(?:look at|shown|above|below|this|the) (?:picture|diagram|plot|graph|number line|table)\b|\b(?:graph|plot|table) (?:above|below|from (?:item|question))", question, re.I) and not (context.graphics or context.tables):
        missing.append("referenced visual")
    if re.search(r"\b(?:question|problem|item)\s*#?\d+\b", question, re.I) and not context.dependencies:
        missing.append("referenced item")
    if re.search(r"\b(?:these|those)\s+(?:(?:three|four|five|six|eight)\s+)?(?:points|events|pictures|facts|reasons)\b", question, re.I) and ":" not in question and not (context.graphics or context.passages or context.tables):
        missing.append("referenced task data")
    return list(dict.fromkeys(missing))


def _structured_interaction(question: str, answer: str, kind: str) -> tuple[ResponseSpec, GradingSpec, str] | None:
    """Explicit data only: no invented options, passages, or plots."""
    if kind == "ordering":
        order = re.fullmatch(r"Order from (least to greatest|least to most|greatest to least|longest to shortest|shortest to longest):\s*(.+)[.]?", question, re.I)
        if order:
            labels = [label.strip().rstrip(".") for label in order.group(2).split(",")]
            values = []
            for label in labels:
                number = re.fullmatch(rf"(?:a\s+)?({NUMERIC})(?:-cube train)?", label, re.I)
                if not number:
                    return None
                values.append(Fraction(number.group(1)))
            answer_values = numeric_values(answer)
            descending = order.group(1).casefold() in ("greatest to least", "longest to shortest")
            expected = sorted(range(len(values)), key=lambda i: values[i], reverse=descending)
            if len(set(values)) != len(values) or not answer_values or [Fraction(value["exactFraction"]) for value in answer_values] != [values[i] for i in expected]:
                return None
            items = [{"id": f"item-{i + 1}", "label": label} for i, label in enumerate(labels)]
            return ResponseSpec(kind="ordering", items=items), GradingSpec(kind="ordering", expectedOrder=[items[i]["id"] for i in expected], expectedResponse=answer), "deterministic_numeric_ordering"
    if kind == "graph":
        mark = re.fullmatch(rf"(?:Mark|Place|Where is)\s+({NUMERIC})\s+on a number line(?: from ({NUMERIC}) to ({NUMERIC}))?[?.]?", question, re.I)
        if mark:
            value = exact_fraction(mark.group(1))
            low = exact_fraction(mark.group(2)) if mark.group(2) else Fraction(floor(value))
            high = exact_fraction(mark.group(3)) if mark.group(3) else Fraction(ceil(value))
            if high == low:
                high = low + 1
            source_ok = any(exact_fraction(token) == value for token in re.findall(NUMERIC, answer))
            halfway = re.search(rf"Halfway between ({NUMERIC}) and ({NUMERIC})", answer, re.I)
            if halfway:
                source_ok = (Fraction(halfway.group(1)) + Fraction(halfway.group(2))) / 2 == value
            ordinal = re.search(r"(First|Second|Third|Fourth) mark of (two|three|four|five) equal parts", answer, re.I)
            if ordinal:
                numerators = {"first": 1, "second": 2, "third": 3, "fourth": 4}
                denominators = {"two": 2, "three": 3, "four": 4, "five": 5}
                source_ok = Fraction(numerators[ordinal.group(1).casefold()], denominators[ordinal.group(2).casefold()]) == value
            if source_ok and low <= value <= high:
                step = Fraction(1, value.denominator)
                return ResponseSpec(kind="number_line", graph={"min": str(low), "max": str(high), "step": str(step)}), GradingSpec(kind="number_line", expectedGraph={"value": str(value)}, expectedResponse=answer), "deterministic_number_line"
        coordinates = re.findall(rf"\(\s*({NUMERIC})\s*,\s*({NUMERIC})\s*\)", question)
        remainder = re.sub(rf"\(\s*({NUMERIC})\s*,\s*({NUMERIC})\s*\)", "", question)
        if coordinates and re.fullmatch(r"Plot\s*[,\s]*(?:and\s*)?[.]*", remainder, re.I):
            source_coordinates = re.findall(rf"\(\s*({NUMERIC})\s*,\s*({NUMERIC})\s*\)", answer)
            points = [[str(Fraction(x)), str(Fraction(y))] for x, y in coordinates]
            if points == [[str(Fraction(x)), str(Fraction(y))] for x, y in source_coordinates]:
                xs, ys = [Fraction(point[0]) for point in points], [Fraction(point[1]) for point in points]
                graph = {"xMin": str(min(Fraction(0), *xs) - 1), "xMax": str(max(Fraction(0), *xs) + 1), "yMin": str(min(Fraction(0), *ys) - 1), "yMax": str(max(Fraction(0), *ys) + 1), "pointCount": len(points)}
                return ResponseSpec(kind="graph", graph=graph), GradingSpec(kind="graph", expectedGraph={"points": points}, expectedResponse=answer), "deterministic_coordinate_plot"
    return None


def compile_item(row: dict, slot: str = "p1", *, context: dict | None = None) -> CompiledItem:
    if slot not in ("p1", "p2"):
        raise ValueError("Unknown seed slot")
    return compile_practice_item(
        question=str(row.get(f"{slot}_q") or ""), answer=str(row.get(f"{slot}_a") or ""),
        answer_type=str(row.get(f"{slot}_type") or ""), check_mode=str(row.get("check_mode") or ""),
        grade=str(row.get("grade") or ""), home_tip=str(row.get("home_tip") or ""), context=context,
    )


def compile_practice_item(*, question: str, answer: str, answer_type: str, check_mode: str = "", grade: str = "", home_tip: str = "", context: dict | None = None) -> CompiledItem:
    ctx = PracticeContext.model_validate(context or {})
    ctx.missing = _missing_context(question, ctx)
    kind = TYPE_KINDS.get(answer_type, "adult")
    response = ResponseSpec(kind=kind, readAloud=grade in ("K", "1"))
    grading = GradingSpec(kind=kind, expectedResponse=answer or None, rubric=answer or None, homeTip=home_tip or None)
    readiness, verified, method = "adult_required", False, "adult_review_required"
    result: dict[str, Any] = {"compilerVersion": COMPILER_VERSION, "reason": "This interaction needs adult review."}
    if not question.strip() or not answer.strip():
        readiness, method = "pending", "incomplete_source"
    elif kind == "number":
        values = numeric_values(answer)
        if values:
            grading.expectedValues = values
            grading.exactFraction = values[0]["exactFraction"] if len(values) == 1 else None
            grading.unit = values[0]["unit"] if len(values) == 1 else None
            grading.representation = "fraction" if re.search(r"\b(?:as a fraction|fraction form)\b", question, re.I) else "decimal" if re.search(r"\b(?:as a decimal|decimal form)\b", question, re.I) else "equivalent"
            response.fields = [{"id": f"value-{i + 1}", "label": f"Answer {i + 1}" if len(values) > 1 else "Your answer", "unit": value["unit"]} for i, value in enumerate(values)]
            solved = solve_numeric_question(question)
            if solved is not None and solved == [Fraction(value["exactFraction"]) for value in values] and not any(value["unit"] for value in values) and check_mode.startswith("Auto-checkable"):
                readiness, verified, method = "ready", True, "deterministic_exact_arithmetic"
                result = {"compilerVersion": COMPILER_VERSION, "solverValues": [str(value) for value in solved], "matchesAnswer": True}
            elif solved is not None and solved != [Fraction(value["exactFraction"]) for value in values]:
                readiness, method = "pending", "answer_mismatch"
                result = {"compilerVersion": COMPILER_VERSION, "matchesAnswer": False, "reason": "Draft answer disagrees with deterministic solver."}
    elif kind == "choice":
        match = re.search(r"\bChoices:\s*(.+)$", question, re.I)
        if match:
            options = [value.strip().rstrip(".") for value in match.group(1).split(",")]
            if len(options) > 1 and all(options) and len(set(options)) == len(options):
                response.options = [{"id": f"option-{i + 1}", "label": value} for i, value in enumerate(options)]
                if answer.strip() in options:
                    grading.correctOptionId = response.options[options.index(answer.strip())]["id"]
                    # Only literal numeral recognition has an independent answer check.
                    target = re.search(r"^(?:Point to|Which is)\s+(\d+)[?.]", question, re.I)
                    if target and target.group(1) == answer.strip() and check_mode.startswith("Auto-checkable"):
                        readiness, verified, method = "ready", True, "deterministic_numeral_recognition"
                        result = {"compilerVersion": COMPILER_VERSION, "matchesAnswer": True}
        if not response.options:
            ctx.missing.append("structured answer choices")
    elif kind in ("ordering", "graph") and check_mode.startswith("Auto-checkable"):
        structured = _structured_interaction(question, answer, kind)
        if structured:
            response, grading, method = structured
            response.readAloud = grade in ("K", "1")
            grading.homeTip = home_tip or None
            readiness, verified = "ready", True
            result = {"compilerVersion": COMPILER_VERSION, "matchesAnswer": True}
    if ctx.missing:
        readiness, verified, method = "missing_context", False, "missing_context"
        result = {"compilerVersion": COMPILER_VERSION, "missing": ctx.missing}
    if readiness == "adult_required":
        response.kind = "adult"
        grading.kind = "adult"
    return CompiledItem(question=question, answer=answer, answerType=answer_type, context=ctx, responseSpec=response, gradingSpec=grading, readiness=readiness, verified=verified, verificationMethod=method, verificationResult=result)


def item_record(row) -> dict:
    record = dict(row)
    for key, target in (("context_json", "context"), ("response_spec_json", "responseSpec"), ("grading_spec_json", "gradingSpec"), ("verification_result_json", "verificationResult"), ("original_json", "original")):
        record[target] = json.loads(record.pop(key))
    record["verified"] = bool(record["verified"])
    return record


def ready_items(conn, subskill_id: str, limit: int = 8, *, include_adult: bool = False) -> list[dict]:
    condition = "((readiness='ready' AND verified=1)" + (" OR readiness='adult_required'" if include_adult else "") + ")"
    return [item_record(row) for row in conn.execute(f"SELECT * FROM practice_items WHERE subskill_id=? AND active=1 AND {condition} ORDER BY source DESC, logical_id LIMIT ?", (subskill_id, max(0, min(limit, 100))))]


def public_item(item: dict) -> dict:
    """Allowlist, so nested verification results/original answers cannot leak."""
    response = item.get("responseSpec") or json.loads(item.get("response_spec_json", "{}"))
    context = item.get("context") or json.loads(item.get("context_json", "{}"))
    return {"id": item.get("id"), "subskillId": item.get("subskill_id"), "question": item["question"], "context": context, "responseSpec": response, "readiness": item["readiness"]}


def save_item(conn, subskill_id: str, logical_id: str, compiled: CompiledItem, *, source: str, catalog_revision: str, now: float, original: dict | None = None) -> dict:
    original = original or {"question": compiled.question, "answer": compiled.answer, "answerType": compiled.answerType}
    content_hash = digest({"compiled": compiled.model_dump(), "original": original})
    item_id = "pi_" + digest({"logicalId": logical_id, "contentHash": content_hash})[:40]
    conn.execute("UPDATE practice_items SET active=0 WHERE logical_id=? AND id<>?", (logical_id, item_id))
    conn.execute("""INSERT INTO practice_items(id,logical_id,subskill_id,source,question,answer,answer_type,original_json,context_json,response_spec_json,grading_spec_json,readiness,verified,verification_method,verification_result_json,content_hash,catalog_revision,active,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?) ON CONFLICT(id) DO UPDATE SET active=1""", (
        item_id, logical_id, subskill_id, source, compiled.question, compiled.answer, compiled.answerType, canonical_json(original), canonical_json(compiled.context.model_dump()), canonical_json(compiled.responseSpec.model_dump()), canonical_json(compiled.gradingSpec.model_dump()), compiled.readiness, int(compiled.verified), compiled.verificationMethod, canonical_json(compiled.verificationResult), content_hash, catalog_revision, now,
    ))
    return item_record(conn.execute("SELECT * FROM practice_items WHERE id=?", (item_id,)).fetchone())


def save_generated_item(conn, subskill_id: str, logical_id: str, compiled: CompiledItem, *, catalog_revision: str | None = None, now: float, original: dict | None = None) -> dict:
    if not isinstance(compiled, CompiledItem):
        compiled = CompiledItem.model_validate(compiled)
    revision = catalog_revision or conn.execute("SELECT revision FROM catalog_subskills WHERE id=? AND active=1", (subskill_id,)).fetchone()[0]
    return save_item(conn, subskill_id, logical_id, compiled, source="generated", catalog_revision=revision, now=now, original=original)


def _unit(value: str | None) -> str | None:
    if not value or not isinstance(value, str):
        return None
    value = re.sub(r"\s+", " ", value.strip().casefold()).replace("²", "^2").replace("³", "^3")
    aliases = {"in": "inch", "in.": "inch", "inches": "inch", "ft": "foot", "ft.": "foot", "feet": "foot", "cm": "centimeter", "centimeters": "centimeter", "centimetre": "centimeter", "centimetres": "centimeter", "m": "meter", "meters": "meter", "metre": "meter", "metres": "meter", "mm": "millimeter", "millimeters": "millimeter", "kg": "kilogram", "kilograms": "kilogram", "g": "gram", "grams": "gram", "%": "percent", "cents": "cent", "dollars": "dollar", "seconds": "second", "minutes": "minute", "hours": "hour"}
    return aliases.get(value, value)


def _representation_ok(raw: Any, parsed: Fraction, representation: str) -> bool:
    text = str(raw).strip()
    if representation in ("fraction", "simplest_fraction"):
        fraction = re.fullmatch(r"([-+]?\d+)\s*/\s*(\d+)", text)
        if not fraction:
            return False
        if representation == "simplest_fraction" and gcd(abs(int(fraction.group(1))), int(fraction.group(2))) != 1:
            return False
    if representation == "decimal" and "/" in text:
        return False
    if representation == "integer" and (parsed.denominator != 1 or not re.fullmatch(r"[-+]?\d+", text)):
        return False
    return True


def _graph_equivalence(actual: Any, expected: Any) -> bool | None:
    """Compare only a complete supported numeric graph payload of the same shape."""
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or set(actual) != set(expected):
            return None
        results = [_graph_equivalence(actual[key], value) for key, value in expected.items()]
    elif isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            return None
        results = [_graph_equivalence(a, e) for a, e in zip(actual, expected)]
    elif exact_fraction(expected) is not None:
        number = exact_fraction(actual)
        return None if number is None else number == exact_fraction(expected)
    elif isinstance(expected, str) and isinstance(actual, str):
        return actual == expected
    else:
        return None
    return None if any(result is None for result in results) else all(results)


def grade_response(item: dict, response: Any) -> dict:
    """Exact supported validators. Unsupported/uncertain responses stay ungraded."""
    spec = item.get("gradingSpec") or json.loads(item.get("grading_spec_json", "{}"))
    kind = spec.get("kind")
    correct = None
    if kind == "number":
        submitted = response if isinstance(response, list) else [response]
        expected = spec.get("expectedValues") or ([{"exactFraction": spec["exactFraction"], "unit": spec.get("unit")}] if spec.get("exactFraction") else [])
        if expected and len(submitted) == len(expected):
            checks = []
            for value, target in zip(submitted, expected):
                unit = value.get("unit") if isinstance(value, dict) else None
                if unit is not None and not isinstance(unit, str):
                    return {"correctness": "ungraded", "source": "deterministic", "confidence": 0.0, "explanation": "Enter a clear unit."}
                raw = value.get("value") if isinstance(value, dict) else value
                parsed = exact_fraction(raw)
                if parsed is None and isinstance(raw, str):
                    with_unit = numeric_values(raw)
                    if len(with_unit) == 1:
                        parsed = Fraction(with_unit[0]["exactFraction"])
                        unit = unit or with_unit[0]["unit"]
                        raw = re.match(NUMERIC, raw.strip()).group(0)
                if parsed is None:
                    return {"correctness": "ungraded", "source": "deterministic", "confidence": 0.0, "explanation": "Enter a clear numeric response."}
                if target.get("unit") and not unit:
                    return {"correctness":"ungraded","source":"deterministic","confidence":0.0,"explanation":"The required unit is missing."}
                equivalent = parsed == Fraction(target["exactFraction"])
                representation = spec.get("representation", "equivalent")
                form_ok = _representation_ok(raw, parsed, representation)
                checks.append(equivalent and form_ok and (not target.get("unit") or _unit(unit) == _unit(target["unit"])))
            correct = all(checks)
    elif kind == "choice" and spec.get("correctOptionId"):
        options = item.get("responseSpec") or json.loads(item.get("response_spec_json", "{}"))
        if response in [option["id"] for option in options.get("options", [])]:
            correct = response == spec["correctOptionId"]
    elif kind == "ordering" and spec.get("expectedOrder") and isinstance(response, list):
        if all(isinstance(value, str) for value in response) and len(response) == len(spec["expectedOrder"]) and set(response) == set(spec["expectedOrder"]):
            correct = response == spec["expectedOrder"]
    elif kind == "matching" and spec.get("expectedMatches") and isinstance(response, dict):
        if all(isinstance(value, str) for value in response.values()) and set(response) == set(spec["expectedMatches"]) and set(response.values()) <= set(spec["expectedMatches"].values()):
            correct = response == spec["expectedMatches"]
    elif kind in ("number_line", "graph") and spec.get("expectedGraph") and isinstance(response, dict):
        correct = _graph_equivalence(response, spec["expectedGraph"])
    elif kind == "short_text" and spec.get("acceptedText") and isinstance(response, str):
        correct = response.strip().casefold() in [value.strip().casefold() for value in spec["acceptedText"]]
    return {"correctness": "ungraded" if correct is None else "correct" if correct else "incorrect", "source": "deterministic", "confidence": 0.0 if correct is None else 1.0, "explanation": "This response needs adult review." if correct is None else "Checked against the item's validated response specification."}
