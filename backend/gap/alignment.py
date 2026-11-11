"""Answer-blind arithmetic family guard, in addition to model alignment checks."""
import ast
import re
from dataclasses import dataclass
from fractions import Fraction


@dataclass(frozen=True)
class Family:
    operators: frozenset[str]
    fractions: int
    denominators: tuple[int, ...]
    decimals: bool
    negatives: bool
    integer_digits: int


def _family(question: str) -> Family | None:
    # Preserve the division sign until fraction literals are grouped, so
    # 4 ÷ 1/5 retains a fraction operand rather than becoming 4 / 1 / 5.
    text = question.strip().replace("−", "-").replace("×", "*").replace("÷", "@")
    text = re.sub(r"^(?:What is|Calculate|Compute|Evaluate|Solve)\s+", "", text, flags=re.I)
    text = re.sub(r"\s*=\s*\?\s*$", "", text.rstrip("?.!"))
    # rstrip removes a final question mark before the preceding pattern runs.
    text = re.sub(r"\s*=\s*$", "", text)
    if len(text) > 180 or not re.fullmatch(r"[\d.\s()+*/@-]+", text):
        return None
    text = re.sub(r"(?<![\d./])(\d+)/(\d+)(?![\d./])", r"fraction(\1,\2)", text)
    text = text.replace("@", "/")
    operators, denominators, numbers, decimals, negatives = set(), [], [], False, False
    try:
        tree = ast.parse(text.strip(), mode="eval")

        def visit(node, depth=0):
            nonlocal decimals, negatives
            if depth > 14:
                raise ValueError()
            if isinstance(node, ast.BinOp) and type(node.op) in (ast.Add, ast.Sub, ast.Mult, ast.Div):
                operators.add({ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/"}[type(node.op)])
                visit(node.left, depth + 1)
                visit(node.right, depth + 1)
            elif isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
                negatives |= isinstance(node.op, ast.USub)
                visit(node.operand, depth + 1)
            elif isinstance(node, ast.Constant) and type(node.value) in (int, float):
                token = ast.get_source_segment(text.strip(), node)
                decimals |= "." in token
                numbers.append(abs(Fraction(token)))
            elif isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "fraction" and len(node.args) == 2 and all(isinstance(arg, ast.Constant) and type(arg.value) is int for arg in node.args):
                numerator, denominator = (arg.value for arg in node.args)
                if denominator <= 0:
                    raise ValueError()
                denominators.append(denominator)
                numbers.append(Fraction(numerator, denominator))
            else:
                raise ValueError()

        visit(tree.body)
        if not operators:
            return None
        integer_digits = max((len(str(value.numerator)) for value in numbers if value.denominator == 1), default=0)
        return Family(frozenset(operators), len(denominators), tuple(denominators), decimals, negatives, integer_digits)
    except (ValueError, SyntaxError, ZeroDivisionError, TypeError):
        return None


def validate_family(question: str, target: dict) -> bool:
    """Reject a proved family mismatch; unknown families need model adjudication.

    Only question text is inspected. No answer key or diagnostic labels enter the
    independent solver, and no linguistic subskill claim is inferred here.
    """
    seeds = [family for key in ("p1_q", "p2_q") if (family := _family(str(target.get(key) or ""))) is not None]
    if not seeds:
        return True
    candidate = _family(question)
    if candidate is None or candidate.operators not in {seed.operators for seed in seeds}:
        return False
    minimum_fractions = min(seed.fractions for seed in seeds)
    if candidate.fractions < minimum_fractions:
        return False
    if all(seed.fractions == 0 for seed in seeds) and candidate.fractions:
        return False
    if all(seed.decimals for seed in seeds) and not candidate.decimals:
        return False
    if all(not seed.decimals for seed in seeds) and candidate.decimals:
        return False
    if all(seed.negatives for seed in seeds) and not candidate.negatives:
        return False
    if all(not seed.negatives for seed in seeds) and candidate.negatives:
        return False
    if minimum_fractions >= 2:
        same_denominators = [len(set(seed.denominators)) == 1 for seed in seeds]
        if len(set(same_denominators)) == 1 and (len(set(candidate.denominators)) == 1) != same_denominators[0]:
            return False
    if not minimum_fractions and not any(seed.decimals for seed in seeds):
        digits = [seed.integer_digits for seed in seeds]
        if not min(digits) <= candidate.integer_digits <= max(digits):
            return False
    return True
