"""Export reviewed synthetic curriculum only after the public browser proof.

Audit artifacts are never registered with an activity loader or fallback. The
synthetic source database is opened read-only; no provider or app is started.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sqlite3
import sys
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.activity_engine_v2.composer import validate_gameplay_review
from backend.activity_engine_v2.core import ExecutionCore
from backend.activity_engine_v2.game_design import structural_signature
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.service import _hash
from backend.activity_engine_v2.validator import validate_program
from scripts.compose_game_design_case import read_json, update_json
from scripts.prepare_activity_benchmark_verification import source_approval

CASES = ('area-first', 'area-second', 'ela-reading', 'ela-writing')
EXPORT_DIRECTORY = ROOT / 'docs/activity-engine-v2-game-design'


def private_config(path):
    resolved = path.resolve()
    if ROOT == resolved or ROOT in resolved.parents or not resolved.is_file():
        raise ValueError('external_private_config_required')
    return read_json(resolved)


def pristine_source(database, session_id, program):
    connection = sqlite3.connect('file:' + quote(str(database), safe='/') + '?mode=ro', uri=True)
    connection.row_factory = sqlite3.Row
    try:
        row = connection.execute('''SELECT s.*,g.id AS generation_id,g.upload_id,g.private_sources_json,
                (SELECT COUNT(*) FROM activity_program_events e WHERE e.session_id=s.id) AS event_count
            FROM activity_program_sessions s JOIN activity_program_generations g ON g.session_id=s.id
            WHERE s.id=? AND g.status='ready' AND g.account_id=s.account_id AND g.kid_id=s.kid_id
            ORDER BY g.rowid DESC LIMIT 1''', (session_id,)).fetchone()
        if (not row or row['status'] != 'in_progress' or row['action_count'] != 0 or row['revision'] != 0
                or row['event_count'] != 0 or json.loads(row['assistance_json'])
                or json.loads(row['state_json']) != ExecutionCore(program).initial):
            raise ValueError('pristine_synthetic_source_required')
        return {row[key] for key in ('id','account_id','kid_id','generation_id','upload_id')} | {
            value for key,value in json.loads(row['private_sources_json']).items()
            if key.lower().endswith('id') and isinstance(value,str)}
    finally:
        connection.close()


def export(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_game_verification_required')
    config = private_config(args.private_config)
    url = config['databaseUrl']
    if not isinstance(url,str) or not url.startswith('sqlite:///'):
        raise ValueError('isolated_synthetic_database_required')
    database = Path(url.removeprefix('sqlite:///')).resolve()
    if (not database.is_file() or not database.name.startswith('sidekick-e2e-games-')
            or ROOT == database or ROOT in database.parents):
        raise ValueError('isolated_synthetic_database_required')
    report_path = Path(config['report']).resolve()
    if report_path != EXPORT_DIRECTORY / 'report.json':
        raise ValueError('game_verification_report_required')
    report = read_json(report_path)
    cases = report['cases']
    if (report.get('syntheticEngineeringRun') is not True or len(cases) != len(CASES)
            or {item['case'] for item in cases} != set(CASES)):
        raise ValueError('four_synthetic_cases_required')
    artifacts, hashes = {}, {}
    for name in CASES:
        record = next(item for item in cases if item['case'] == name)
        expected = record.get('definitionHash')
        if (record.get('generated') is not True or record.get('browserCompleted') is not True
                or record.get('replayVerified') is not True or record.get('browserDefinitionHash') != expected):
            raise ValueError('hash_bound_public_browser_proof_required')
        job = config['jobs'][name]
        if job.get('definitionHash') != expected:
            raise ValueError('generation_binding_changed')
        approved, snapshot, _ = source_approval(database,dict(
            localUrl='http://localhost:3000/kid/activity-preview/'+job['sessionId'],definitionHash=expected))
        program = approved.program
        if snapshot != dict(actionCount=0,revision=0):
            raise ValueError('pristine_synthetic_source_required')
        if (program.intent.observations or program.intent.misconceptions or program.provenance.sourceRefs
                or program.provenance.origin != 'ai_composed'):
            raise ValueError('curriculum_only_program_required')
        validation = validate_program(program,check_witness=True)
        if not validation.valid or validation.computational != 'witness_verified' or not program.witness:
            raise ValueError('verified_program_required')
        validate_runtime_compatibility(program)
        validate_gameplay_review(program,expected,approved.gameplay_review,approved.render_manifest)
        if approved.render_manifest is None or approved.structural_fingerprint != structural_signature(program):
            raise ValueError('exact_render_and_signature_required')
        private_ids = pristine_source(database,job['sessionId'],program)
        definition = program.model_dump(warnings=False)
        if _hash(definition) != expected:
            raise ValueError('export_definition_hash_mismatch')
        reviews = dict(auditOnly=True,definitionHash=expected,
            semanticReview=approved.review.model_dump(warnings=False),
            gameplayReview=approved.gameplay_review.model_dump(warnings=False),
            renderManifest=approved.render_manifest,structuralFingerprint=approved.structural_fingerprint)
        for suffix,value in (('program',definition),('reviews',reviews)):
            content = json.dumps(value,indent=2,ensure_ascii=False)+'\n'
            # Export the exact approved definition or refuse it; never redact a
            # candidate and silently claim the changed artifact has its hash.
            forbidden = private_ids | {url,str(database),str(args.private_config.resolve()),
                                       str(config.get('browserState',''))}
            if any(identifier and identifier in content for identifier in forbidden):
                raise ValueError('private_identifier_in_audit_artifact')
            artifacts[EXPORT_DIRECTORY / f'{name}.{suffix}.json'] = content
        hashes[name] = expected
    # Validate every case before writing any witness-bearing public audit data.
    for path,content in artifacts.items():
        temporary = path.with_suffix(path.suffix+'.tmp')
        temporary.write_text(content,encoding='utf-8')
        temporary.replace(path)
    def save_paths(current):
        for record in current['cases']:
            name = record['case']
            if (record.get('definitionHash') != hashes[name]
                    or record.get('browserDefinitionHash') != hashes[name]
                    or record.get('browserCompleted') is not True or record.get('replayVerified') is not True):
                raise ValueError('browser_proof_changed_during_export')
            record['programExport'] = f'docs/activity-engine-v2-game-design/{name}.program.json'
            record['reviewsExport'] = f'docs/activity-engine-v2-game-design/{name}.reviews.json'
        current['exportsAuditOnly'] = True
    update_json(report_path,save_paths)
    print(json.dumps(dict(success=True,auditOnly=True,exports=[str(path.relative_to(ROOT)) for path in artifacts])))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config',required=True,type=Path)
    try:
        export(parser.parse_args())
    except Exception as error:
        print(json.dumps(dict(success=False,reasonCode=getattr(error,'code','game_audit_export_failed'))))
        sys.exit(1)
