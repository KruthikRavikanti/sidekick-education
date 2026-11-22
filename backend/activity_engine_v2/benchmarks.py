"""Explicit reviewed development examples, separate from live composition.

Only these server-owned curriculum exports can be admitted. This catalog is
never searched by skill, used as a generation fallback, or a private-session
sharing mechanism. Every start creates a normal owned attempt.
"""
from __future__ import annotations

import json
from pathlib import Path

from pydantic import ValidationError

from backend.accounts.security import AccountError
from . import service

EXPORT_DIRECTORY=Path(__file__).resolve().parents[2]/'docs/activity-engine-v2-game-design'
BENCHMARK_KEYS=('area-first','area-second','ela-reading','ela-writing')


def load_benchmark(key):
    """Read a fixed server export and require the normal exact approval gate."""
    if key not in BENCHMARK_KEYS:
        raise AccountError('not_found','That reviewed example was not found.',404)
    from .composer import ApprovedProgram, SemanticReview
    from .gameplay import GameplayReview
    from .models import ActivityProgram
    try:
        program_path=EXPORT_DIRECTORY/(key+'.program.json')
        review_path=EXPORT_DIRECTORY/(key+'.reviews.json')
        if program_path.stat().st_size>1_000_000 or review_path.stat().st_size>4_000_000:
            raise ValueError()
        program=ActivityProgram.model_validate_json(program_path.read_text(encoding='utf-8'),strict=True)
        receipt=json.loads(review_path.read_text(encoding='utf-8'))
        semantic=SemanticReview.model_validate(receipt['semanticReview'],strict=True)
        gameplay=GameplayReview.model_validate(receipt['gameplayReview'],strict=True)
        if (program.intent.observations or program.intent.misconceptions or program.provenance.sourceRefs
                or program.presentation.stage is None or not isinstance(receipt['renderManifest'],dict)):
            raise ValueError()
        approved=ApprovedProgram(program=program,definition_hash=receipt['definitionHash'],
            requested_model=program.provenance.model,returned_models=[],review=semantic,call_count=0,model_calls=[],
            gameplay_review=gameplay,render_manifest=receipt['renderManifest'],
            structural_fingerprint=receipt.get('structuralFingerprint'))
        service.validate_approved(approved)
        return approved
    except (OSError,ValueError,TypeError,KeyError,ValidationError,AccountError):
        # Paths, definitions, witness traces and provider bodies stay private.
        raise AccountError('benchmark_integrity_failed','This reviewed example is unavailable right now.',503) from None


def listing(security,kid_id,active):
    with security.db.transaction() as connection:
        service._authorize(connection,security,kid_id,active)
        result=[]
        for key in BENCHMARK_KEYS:
            try:
                approved=load_benchmark(key)
            except AccountError as error:
                result.append(dict(id=key,title='Reviewed example',description='',subject='math' if key.startswith('area-') else 'ela',
                    skillIds=[],definitionHash=None,available=False,reasonCode=error.code,sessionId=None,status=None))
                continue
            program=approved.program
            from .validator import catalog
            targets=[target.skillId for target in program.intent.targets]
            subject='math' if all(catalog()[target]['subject'].casefold()=='math' for target in targets) else 'ela'
            latest=connection.execute('''SELECT s.id,s.status FROM activity_program_sessions s
                JOIN activity_program_versions v ON v.id=s.program_version_id
                WHERE s.account_id=? AND s.kid_id=? AND v.definition_sha256=?
                ORDER BY s.started_at DESC,s.rowid DESC LIMIT 1''',
                (active.account_id,kid_id,approved.definition_hash)).fetchone()
            result.append(dict(id=key,title=program.title,description=program.goals[0].description,
                subject=subject,skillIds=targets,definitionHash=approved.definition_hash,available=True,reasonCode=None,
                sessionId=latest['id'] if latest else None,status=latest['status'] if latest else None))
        return dict(benchmarks=result)


def start(security,kid_id,key,request_id,active):
    if key not in BENCHMARK_KEYS:
        raise AccountError('not_found','That reviewed example was not found.',404)
    fingerprint=service._hash(dict(benchmarkKey=key))
    with security.db.transaction() as connection:
        service._authorize(connection,security,kid_id,active)
        previous=connection.execute('SELECT * FROM activity_program_start_requests WHERE kid_id=? AND request_id=?',
                                    (kid_id,request_id)).fetchone()
        if previous:
            if previous['request_sha256']!=fingerprint:
                raise AccountError('request_id_conflict','That request was already used for a different activity.',409)
            return json.loads(previous['response_json'])
        approved=load_benchmark(key)
        response=service.start_approved(connection,security,kid_id,approved,active)
        connection.execute('INSERT INTO activity_program_start_requests VALUES (?,?,?,?,?)',
            (kid_id,request_id,fingerprint,response['id'],service._json(response)))
        return response
