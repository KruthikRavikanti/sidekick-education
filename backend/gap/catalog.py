"""Transactional draft-catalog import. Catalog text is data, never instructions."""
import argparse
import hashlib
import json
import math
import re
import time
import unicodedata
from collections import Counter, defaultdict
from difflib import SequenceMatcher
from pathlib import Path

from backend.accounts.database import Database, ROOT
from .items import canonical_json, compile_item, digest, ready_items, save_item

DEFAULT_CATALOG = ROOT / "data" / "sidekick_skill_map_v2.json"
GRADE_ORDER = {"K": 0, **{str(i): i for i in range(1, 9)}}
# These labels remain separate courses/bands, never inserted into K–8 windows.
MATH_COURSE_ORDER = {"Algebra 1": 9, "Geometry": 10, "Algebra 2": 11, "Precalculus / advanced (+)": 12}
ELA_BAND_ORDER = {"9-10": 9, "11-12": 11}
VALID_GRADES = set(GRADE_ORDER) | set(MATH_COURSE_ORDER) | set(ELA_BAND_ORDER)


def normalize_subject(subject: str) -> str | None:
    return {"math": "Math", "ela": "Reading/ELA", "reading/ela": "Reading/ELA", "reading": "Reading/ELA"}.get(subject.casefold())


def normalize_confidence(value: str) -> str:
    match = re.match(r"^(high|medium|low)(?:\b|$)", str(value).strip(), re.I)
    return match.group(1).casefold() if match else "unknown"


def _direction(source: dict, target: dict) -> str | None:
    if source["subject"] != target["subject"]:
        return "incompatible_subject"
    source_grade, target_grade = source["grade"], target["grade"]
    order = GRADE_ORDER | (MATH_COURSE_ORDER if source["subject"] == "Math" else ELA_BAND_ORDER)
    if source_grade not in order or target_grade not in order:
        return "incompatible_grade_band"
    if order[target_grade] > order[source_grade]:
        return "prerequisite_above_target"
    return None


def _cycle_edges(edges: list[dict]) -> set[tuple[str, str]]:
    """Tarjan SCC marks every edge inside a cycle, including self edges."""
    graph = defaultdict(list)
    for edge in edges:
        if edge["reason"] not in ("missing_reference", "incompatible_subject"):
            graph[edge["source_id"]].append(edge["target_id"])
    index, low, stack, on_stack, components = {}, {}, [], set(), []

    def visit(node):
        index[node] = low[node] = len(index)
        stack.append(node)
        on_stack.add(node)
        for neighbor in graph[node]:
            if neighbor not in index:
                visit(neighbor)
                low[node] = min(low[node], low[neighbor])
            elif neighbor in on_stack:
                low[node] = min(low[node], index[neighbor])
        if low[node] == index[node]:
            component = set()
            while True:
                member = stack.pop()
                on_stack.remove(member)
                component.add(member)
                if member == node:
                    break
            components.append(component)

    for node in list(graph):
        if node not in index:
            visit(node)
    cyclic = set()
    for component in components:
        if len(component) > 1:
            cyclic.update((source, target) for source in component for target in graph[source] if target in component)
        else:
            node = next(iter(component))
            if node in graph[node]:
                cyclic.add((node, node))
    return cyclic


def validate_catalog(rows: list[dict]) -> tuple[dict, list[dict], list[dict]]:
    if not isinstance(rows, list) or not rows:
        raise ValueError("The catalog must be a nonempty list")
    errors, warnings = [], []
    by_id, skills = {}, {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("Every catalog row must be an object")
        sid, skill_id = row.get("subskill_id"), row.get("skill_id")
        if not isinstance(sid, str) or not isinstance(skill_id, str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9.+-]*", skill_id) or not re.fullmatch(re.escape(skill_id) + r"-([1-9]\d*)", sid):
            errors.append({"code": "invalid_id", "id": sid})
            continue
        if sid in by_id:
            errors.append({"code": "duplicate_subskill_id", "id": sid})
        by_id[sid] = row
        if row.get("grade") not in VALID_GRADES or row.get("subject") not in ("Math", "Reading/ELA"):
            errors.append({"code": "invalid_scope", "id": sid})
        if skill_id in skills and any(skills[skill_id].get(key) != row.get(key) for key in ("subject", "grade", "skill")):
            errors.append({"code": "inconsistent_skill", "id": skill_id})
        skills.setdefault(skill_id, row)
        if not isinstance(row.get("root_subskills", []), list) or not isinstance(row.get("prerequisite_skills", []), list):
            errors.append({"code": "invalid_relationship_list", "id": sid})
    if errors:
        raise ValueError(canonical_json({"errors": errors}))
    roots, prerequisites, seen_prerequisites = [], [], set()
    for row in rows:
        source_id = row["subskill_id"]
        seen_targets = set()
        for rank, target_id in enumerate(row.get("root_subskills", []), 1):
            confidence = normalize_confidence(row.get("root_confidence", ""))
            reason = "missing_reference" if target_id not in by_id else _direction(row, by_id[target_id])
            if target_id in seen_targets:
                reason = "duplicate_root"
            seen_targets.add(target_id)
            if confidence in ("low", "unknown") and reason is None:
                reason = "low_confidence" if confidence == "low" else "unknown_confidence"
            roots.append({"source_id": source_id, "target_id": target_id, "rank": rank, "confidence": confidence, "raw_confidence": str(row.get("root_confidence", "")), "reason": reason})
        previous = row.get("builds_on_subskill")
        if previous and previous not in by_id:
            warnings.append({"code": "missing_builds_on_reference", "source": source_id, "target": previous})
        elif previous:
            reason = _direction(row, by_id[previous])
            if by_id[previous]["skill_id"] == row["skill_id"] and int(previous.rsplit("-", 1)[1]) >= int(source_id.rsplit("-", 1)[1]):
                reason = "invalid_within_skill_order"
            if reason:
                warnings.append({"code": reason, "source": source_id, "target": previous})
        for rank, target_id in enumerate(row.get("prerequisite_skills", []), 1):
            pair = (row["skill_id"], target_id)
            if pair in seen_prerequisites:
                continue
            seen_prerequisites.add(pair)
            reason = "missing_reference" if target_id not in skills else _direction(row, skills[target_id])
            prerequisites.append({"source_id": row["skill_id"], "target_id": target_id, "rank": rank, "source_text": str(row.get("prerequisite_source", "")), "reason": reason})
    for relationships in (roots, prerequisites):
        cyclic = _cycle_edges(relationships)
        for edge in relationships:
            if (edge["source_id"], edge["target_id"]) in cyclic:
                edge["reason"] = "unsafe_cycle"
            edge["usable"] = edge["reason"] is None
            if edge["reason"]:
                warnings.append({"code": edge["reason"], "source": edge["source_id"], "target": edge["target_id"], "rank": edge["rank"]})
    report = {"skills": len(skills), "subskills": len(rows), "seedPairs": sum(bool(row.get(f"{slot}_q")) and bool(row.get(f"{slot}_a")) for row in rows for slot in ("p1", "p2")), "subjects": dict(Counter(row["subject"] for row in rows)), "grades": dict(Counter(row["grade"] for row in rows)), "rootEdges": len(roots), "usableRootEdges": sum(edge["usable"] for edge in roots), "prerequisiteEdges": len(prerequisites), "warnings": warnings, "errors": []}
    return report, roots, prerequisites


def seed_catalog(database: Database, path: str | Path = DEFAULT_CATALOG, *, now: float | None = None) -> dict:
    path = Path(path)
    raw = path.read_bytes()
    revision = hashlib.sha256(raw).hexdigest()
    rows = json.loads(raw)
    report, roots, prerequisites = validate_catalog(rows)
    report["revision"] = revision
    compiled = [(row, slot, compile_item(row, slot)) for row in rows for slot in ("p1", "p2")]
    report["readiness"] = dict(Counter(item.readiness for _, _, item in compiled))
    report["verifiedItems"] = sum(item.verified for _, _, item in compiled)
    now = time.time() if now is None else now
    with database.transaction() as conn:
        previous = conn.execute("SELECT id FROM catalog_revisions ORDER BY imported_at DESC LIMIT 1").fetchone()
        # A former revision may be deliberately restored, therefore do not skip it.
        report["unchanged"] = bool(previous and previous["id"] == revision)
        conn.execute("INSERT OR IGNORE INTO catalog_revisions VALUES (?,?,?,?)", (revision, path.name, now, canonical_json(report)))
        conn.execute("UPDATE catalog_skills SET active=0")
        conn.execute("UPDATE catalog_subskills SET active=0")
        conn.execute("UPDATE catalog_roots SET active=0")
        conn.execute("UPDATE catalog_prerequisites SET active=0")
        conn.execute("UPDATE practice_items SET active=0 WHERE source='seed'")
        seen_skills = set()
        for row in rows:
            sid, skill_id = row["subskill_id"], row["skill_id"]
            serialized = canonical_json(row)
            row_hash = digest(row)
            if skill_id not in seen_skills:
                seen_skills.add(skill_id)
                # Raw first-row fields are retained here and every row remains in Subskill.
                skill = {key: row[key] for key in row if not key.startswith(("p1_", "p2_")) and key not in ("subskill", "subskill_id", "builds_on_subskill", "root_subskills", "root_confidence", "trace_back", "error_signature", "common_misconception", "pattern_tag")}
                skill_raw, skill_hash = canonical_json(skill), digest(skill)
                conn.execute("""INSERT INTO catalog_skills VALUES (?,?,?,?,?,?,?,1,?,?) ON CONFLICT(id) DO UPDATE SET subject=excluded.subject,grade=excluded.grade,name=excluded.name,raw_json=excluded.raw_json,content_hash=excluded.content_hash,revision=excluded.revision,active=1,updated_at=excluded.updated_at""", (skill_id, row["subject"], row["grade"], row["skill"], skill_raw, skill_hash, revision, now, now))
                conn.execute("INSERT OR IGNORE INTO catalog_row_versions VALUES ('skill',?,?,?,?,?)", (skill_id, skill_hash, skill_raw, revision, now))
            conn.execute("""INSERT INTO catalog_subskills VALUES (?,?,?,?,?,?,?,?,?,1,?,?) ON CONFLICT(id) DO UPDATE SET skill_id=excluded.skill_id,subject=excluded.subject,grade=excluded.grade,name=excluded.name,subskill_order=excluded.subskill_order,raw_json=excluded.raw_json,content_hash=excluded.content_hash,revision=excluded.revision,active=1,updated_at=excluded.updated_at""", (sid, skill_id, row["subject"], row["grade"], row["subskill"], int(sid.rsplit("-", 1)[1]), serialized, row_hash, revision, now, now))
            conn.execute("INSERT OR IGNORE INTO catalog_row_versions VALUES ('subskill',?,?,?,?,?)", (sid, row_hash, serialized, revision, now))
        for edge in roots:
            edge_id = digest({"revision": revision, "source": edge["source_id"], "rank": edge["rank"]})
            conn.execute("INSERT INTO catalog_roots VALUES (?,?,?,?,?,?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET active=1", (edge_id, edge["source_id"], edge["target_id"], edge["rank"], edge["confidence"], edge["raw_confidence"], int(edge["usable"]), edge["reason"], revision))
        for edge in prerequisites:
            edge_id = digest({"revision": revision, "source": edge["source_id"], "target": edge["target_id"]})
            conn.execute("INSERT INTO catalog_prerequisites VALUES (?,?,?,?,?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET active=1", (edge_id, edge["source_id"], edge["target_id"], edge["rank"], edge["source_text"], int(edge["usable"]), edge["reason"], revision))
        for row, slot, item in compiled:
            original = {"question": row.get(f"{slot}_q"), "answer": row.get(f"{slot}_a"), "answerType": row.get(f"{slot}_type"), "checkMode": row.get("check_mode")}
            save_item(conn, row["subskill_id"], f"{row['subskill_id']}:{slot}", item, source="seed", catalog_revision=revision, now=now, original=original)
        # Retire generated versions only when their owning subskill is retired.
        conn.execute("UPDATE practice_items SET active=0 WHERE subskill_id IN (SELECT id FROM catalog_subskills WHERE active=0)")
    return report


def get_subskill(conn, subskill_id: str) -> dict | None:
    row = conn.execute("SELECT * FROM catalog_subskills WHERE id=?", (subskill_id,)).fetchone()
    if not row:
        return None
    return {**json.loads(row["raw_json"]), "id": row["id"], "active": bool(row["active"]), "revision": row["revision"], "subskill_order": row["subskill_order"]}


def get_roots(conn, subskill_id: str, *, usable_only: bool = False) -> list[dict]:
    rows = conn.execute("SELECT r.*,s.active AS target_active FROM catalog_roots r LEFT JOIN catalog_subskills s ON s.id=r.target_id WHERE r.source_id=? AND r.active=1 ORDER BY rank", (subskill_id,))
    result = []
    for row in rows:
        edge = dict(row)
        edge["usable"] = bool(edge["usable"] and edge["target_active"])
        if not edge["target_active"] and not edge["reason"]:
            edge["reason"] = "retired_reference"
        if not usable_only or edge["usable"]:
            result.append(edge)
    return result


def trace_roots(conn, subskill_id: str, *, depth_limit: int = 8, visited: set[str] | None = None) -> dict:
    visited = set(visited or ())
    path, current = [], subskill_id
    for _ in range(max(0, depth_limit)):
        if current in visited:
            return {"path": path, "stopReason": "visited_node"}
        visited.add(current)
        roots = [edge for edge in get_roots(conn, current, usable_only=True) if edge["target_id"] not in visited]
        if not roots:
            return {"path": path, "stopReason": "no_valid_root"}
        edge = roots[0]
        path.append(edge)
        current = edge["target_id"]
    return {"path": path, "stopReason": "depth_limit"}


def _search_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text).casefold().replace("−", "-").replace("×", "*").replace("÷", "/")
    text = re.sub(r"\s*([+*/=()-])\s*", r"\1", text)
    return re.sub(r"\s+", " ", text).strip().rstrip("?.!")


def _search_terms(text: str) -> Counter:
    text = _search_text(text)
    stop = {"the", "a", "an", "is", "of", "to", "what", "and", "in", "how", "or", "it", "on", "with"}
    synonyms = {"addition": "add", "adding": "add", "subtraction": "subtract", "subtracting": "subtract", "multiplication": "multiply", "multiplying": "multiply", "division": "divide", "dividing": "divide", "fractions": "fraction", "decimals": "decimal"}
    terms = Counter()
    for token in re.findall(r"\d+/\d+|\d+(?:\.\d+)?|[a-z]+|[+*/=<>-]", text):
        if token not in stop:
            terms[synonyms.get(token, token)] += 1
    if re.search(r"\d+/\d+", text):
        terms["fraction"] += 1
    for symbol, concept in (("+", "add"), ("-", "subtract"), ("*", "multiply")):
        if symbol in text:
            terms[concept] += 1
    return terms


def search_candidates(security, subject: str, grade: str, text: str, limit: int = 10) -> list[dict]:
    subject = normalize_subject(subject)
    if not subject or grade not in GRADE_ORDER:
        return []
    grades = [label for label, rank in GRADE_ORDER.items() if rank <= GRADE_ORDER[grade] + 1]
    query = _search_text(text)
    tokens = _search_terms(text)
    if not tokens:
        return []
    conn = security.db.connect()
    try:
        rows = conn.execute(f"SELECT id,raw_json,subskill_order,revision,content_hash FROM catalog_subskills WHERE active=1 AND subject=? AND grade IN ({','.join('?' for _ in grades)})", (subject, *grades)).fetchall()
    finally:
        conn.close()
    documents, document_frequency = [], Counter()
    for row in rows:
        data = json.loads(row["raw_json"])
        words = _search_terms(" ".join(str(data.get(key, "")) for key in ("skill", "subskill", "p1_q", "p2_q")))
        document_frequency.update(words.keys())
        documents.append((row, data, words))
    ranked = []
    for row, data, words in documents:
        common = tokens.keys() & words.keys()
        if not common:
            continue
        seeds = [_search_text(str(data.get(key) or "")) for key in ("p1_q", "p2_q")]
        exact = query in seeds
        similarity = max((SequenceMatcher(None, query, seed, autojunk=False).ratio() for seed in seeds), default=0)
        score = 1000.0 if exact else 0.0
        score += 8 * similarity**3
        for token in common:
            # Digits are weak evidence. Keep a fraction together and preserve its
            # operation so unrelated numeral-heavy questions cannot crowd it out.
            weight = .2 if token.replace(".", "").isdigit() else 2.0 if token in "+*/=<>-" else 1.5 if "/" in token else 1.0
            inverse_frequency = math.log(1 + len(documents) / (1 + document_frequency[token]))
            score += weight * inverse_frequency * (1 + math.log(min(words[token], 3)))
        score += .1 / (1 + abs(GRADE_ORDER[data["grade"]] - GRADE_ORDER[grade]))
        ranked.append((score, row["id"], {**data, "id": row["id"], "subskill_order": row["subskill_order"], "revision": row["revision"], "content_hash": row["content_hash"]}))
    ranked.sort(key=lambda value: (-value[0], value[1]))
    return [value[2] for value in ranked[:max(0, min(limit, 10))]]


def main():
    from dotenv import load_dotenv
    import os
    load_dotenv(ROOT / "backend" / ".env")
    parser = argparse.ArgumentParser(description="Import Sidekick's versioned draft curriculum without deleting learning history")
    parser.add_argument("--path", type=Path, default=DEFAULT_CATALOG)
    parser.add_argument("--database-url", default=os.getenv("DATABASE_URL", "sqlite:///backend/data/sidekick.db"))
    args = parser.parse_args()
    database = Database(args.database_url)
    database.migrate()
    print(json.dumps(seed_catalog(database, args.path), indent=2))


if __name__ == "__main__":
    main()
