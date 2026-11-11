"""Conservative exact math checking. Unsupported work never becomes a wrong answer."""
import re
from fractions import Fraction
from typing import Any

from .homework_models import GradeDecision



def ungraded(reason: str) -> GradeDecision:
    return GradeDecision(correctness="ungraded", source="none", confidence=0.0, explanation=reason)


def rational(value: Any) -> Fraction | None:
    """Parse exact scalars and the same safe fraction-aware grammar as practice."""
    if not isinstance(value,(str,int,float)) or isinstance(value,bool):
        return None
    from .items import _arithmetic, exact_fraction
    scalar=exact_fraction(value)
    if scalar is not None:
        return scalar
    text=str(value).strip().replace(",","")
    if len(text)>120:
        return None
    result=_arithmetic(text)
    if result is None or abs(result.numerator)>10**15 or result.denominator>10**12:
        return None
    return result


def extract_math_answer(question: str) -> Fraction | None:
    """Use the same explicit safe grammar as practice-item content verification."""
    from .items import solve_numeric_question
    text=question.strip()
    text=re.sub(r"^\s*(?:\d+[.)]|\([a-z]\))\s+","",text)
    text=re.sub(r"(?<=\d)\s*x\s*(?=\d)"," × ",text)
    text=re.sub(r"=\s*(?:_+|□|\[\s*\])?\s*$","= ?",text)
    solved=solve_numeric_question(text)
    return solved[0] if solved and len(solved) == 1 else None


def split_quantity(value: str) -> tuple[Fraction | None, str | None]:
    match = re.fullmatch(r"\s*([\d.\s+*/()\-−×÷]+?)\s*([A-Za-z°²³%]+)?\s*", value)
    if not match:
        return None, None
    return rational(match.group(1)), match.group(2).lower() if match.group(2) else None


def equivalent(a: str, b: str) -> bool:
    av, au = split_quantity(a)
    bv, bu = split_quantity(b)
    if av is not None and bv is not None:
        return av == bv and au == bu
    return a.strip().casefold() == b.strip().casefold()


def representation_valid(value: str, representation: str) -> bool:
    raw = value.strip()
    if representation == "fraction":
        return bool(re.fullmatch(r"-?\d+\s*/\s*\d+", raw))
    if representation == "simplest_fraction":
        fraction = rational(raw)
        if fraction is None:
            return False
        return raw.replace(" ", "") == f"{fraction.numerator}/{fraction.denominator}"
    if representation == "decimal":
        return bool(re.fullmatch(r"-?\d+(?:\.\d+)?", raw))
    if representation == "integer":
        return bool(re.fullmatch(r"-?\d+", raw))
    return True


def grade_spec(spec: dict, response: Any) -> GradeDecision:
    kind = spec.get("kind")
    if response is None or response == "" or response == [] or response == {}:
        return ungraded("No identifiable final response was provided.")
    correct = None
    if kind == "number":
        expected = spec.get("expectedValues") or []
        if expected:
            values = response if isinstance(response, list) else [response]
            if len(values) != len(expected):
                return ungraded("The response does not contain all required values.")
            results = []
            for actual, field in zip(values, expected):
                target = field.get("exactFraction", field.get("value"))
                result = grade_spec({"kind": "number", "exactFraction": str(target), "unit": field.get("unit"), "representation": field.get("representation", spec.get("representation", "equivalent"))}, actual)
                if result.correctness == "ungraded":
                    return result
                results.append(result.correctness == "correct")
            correct = all(results)
        else:
            text = str(response.get("value", "")) if isinstance(response, dict) else str(response)
            actual, actual_unit = split_quantity(text)
            target = rational(spec.get("exactFraction"))
            if actual is None or target is None:
                return ungraded("This numeric response could not be checked safely.")
            required_unit = spec.get("unit")
            supplied_unit = response.get("unit", actual_unit) if isinstance(response, dict) else actual_unit
            if required_unit and not supplied_unit:
                return ungraded("The required unit is missing.")
            if supplied_unit and not required_unit:
                return ungraded("This response includes an unsupported unit.")
            correct = actual == target and (not required_unit or str(supplied_unit).casefold() == str(required_unit).casefold()) and representation_valid(text, spec.get("representation", "equivalent"))
    elif kind == "choice" and spec.get("correctOptionId"):
        if not isinstance(response, str):
            return ungraded("Choose one identifiable option.")
        correct = response == spec["correctOptionId"]
    elif kind == "ordering" and isinstance(response, list) and spec.get("expectedOrder"):
        if len(response) != len(spec["expectedOrder"]) or set(response) != set(spec["expectedOrder"]):
            return ungraded("The ordering response is incomplete.")
        correct = response == spec["expectedOrder"]
    elif kind == "matching" and isinstance(response, dict) and spec.get("expectedMatches"):
        if set(response) != set(spec["expectedMatches"]):
            return ungraded("The matching response is incomplete.")
        correct = response == spec["expectedMatches"]
    elif kind in {"graph", "number_line"} and isinstance(response, dict) and spec.get("expectedGraph"):
        expected = spec["expectedGraph"]
        # Only explicit points/value, never arbitrary visual interpretation.
        if set(expected) - {"points", "value"} or set(response) != set(expected):
            return ungraded("The graph response is not supported by this validator.")
        correct = response == expected
    elif kind == "short_text" and spec.get("acceptedText"):
        if not isinstance(response, str):
            return ungraded("A readable text response is required.")
        norm = lambda x: re.sub(r"\s+", " ", x.strip()).casefold().rstrip(".!?")
        correct = norm(response) in {norm(x) for x in spec["acceptedText"]}
    if correct is None:
        return ungraded("This response needs a supported rubric or adult review.")
    return GradeDecision(correctness="correct" if correct else "incorrect", source="deterministic", confidence=1.0, explanation="Checked against the exact required response and representation.")


def field_text(field: Any) -> str | None:
    return field.get("text") if isinstance(field, dict) else None


def grade_homework(problem: dict, context: list[dict] | None = None) -> GradeDecision:
    work = problem.get("student_work", {})
    if work.get("status") != "answered":
        return ungraded("The response is blank." if work.get("status") == "blank" else "The response is unreadable or uncertain.")
    question = problem.get("question", {})
    if question.get("uncertain") or not field_text(question):
        return ungraded("The printed question is incomplete or uncertain.")
    answer = work.get("final_answer", {})
    selected = work.get("selected_choice", {})
    if any(field.get("uncertain") for field in [answer, selected]):
        return ungraded("The final response is uncertain.")
    # A readable sequence of steps without a final answer is incomplete.
    if not field_text(answer) and not field_text(selected):
        return ungraded("The work does not identify a completed final response.")
    expected = extract_math_answer(field_text(question))
    if expected is None:
        return ungraded("This question needs a supported rubric or adult review.")
    if field_text(selected):
        choices = problem.get("answer_choices", [])
        matching = [choice for choice in choices if field_text(choice.get("label")) == field_text(selected)]
        if len(matching) != 1 or matching[0].get("text", {}).get("uncertain"):
            return ungraded("The selected option cannot be resolved safely.")
        value = field_text(matching[0].get("text"))
    else:
        value = field_text(answer)
    instructions=" ".join(field_text(item.get("content",{})) or "" for item in context or [] if item.get("id","").startswith("sidekick:worksheet-directions"))
    if any(item.get("content",{}).get("uncertain") for item in context or [] if item.get("id","").startswith("sidekick:worksheet-directions")):
        return ungraded("The worksheet directions are uncertain.")
    source=field_text(question)+" "+instructions
    requirements=set()
    if re.search(r"\b(?:as (?:a )?decimals?|decimal (?:form|notation)|answers? (?:in|as) decimals?)\b",source,re.I):
        requirements.add("decimal")
    if re.search(r"\b(?:as (?:a )?fractions?|fraction (?:form|notation)|answers? (?:in|as) fractions?)\b",source,re.I):
        requirements.add("fraction")
    if re.search(r"\b(?:simplest(?: fraction)?(?: form)?|lowest terms|reduced fractions?)\b",source,re.I):
        requirements.discard("fraction")
        requirements.add("simplest_fraction")
    if re.search(r"\b(?:as (?:an? )?integers?|integer (?:form|answers?))\b",source,re.I):
        requirements.add("integer")
    if len(requirements)>1 or re.search(r"\b(?:round|rounding|nearest|estimate|truncate|remainder)\b",instructions,re.I):
        return ungraded("These combined or rounding directions need a supported rubric.")
    return grade_spec({"kind":"number","exactFraction":str(expected),"representation":next(iter(requirements),"equivalent")},value)


def language_task_supported(problem,context):
    question=field_text(problem.get("question",{})) or ""
    if re.search(r"\b(?:write|compose|create)\s+(?:(?:your|a|an|the)\s+)?(?:own\s+)?(?:story|essay|paragraph|poem)\b|\b(?:draw|sing|read aloud|your best day)\b",question,re.I):
        return False
    has_context=bool(context.get("passages") or context.get("tables") or context.get("graphics")) if isinstance(context,dict) else any(item.get("content",{}).get("text") for item in context if not item.get("id","").startswith("sidekick:worksheet-directions"))
    refers=re.search(r"\b(?:character|author|central message|main idea|text evidence|find the sentence)\b|\b(?:the|this|that|a|an)\s+(?:passage|poem|article|story|text|paragraph)\b|\b(?:in|from|after|about)\s+(?:(?:the|this|that|a|an)\s+)?(?:passage|poem|article|story|text|paragraph)\b",question,re.I)
    embedded=bool(re.search(r'["“].+?["”]',question))
    return bool(not refers or has_context or embedded)
