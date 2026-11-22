"""Save pristine approved compositions beside an existing local evaluation.

Only exact reviewed curriculum programs are copied, never synthetic uploads,
observations, account credentials, actions or learner-state records.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
from backend.accounts.security import SecurityContext, SessionRecord
from backend.activity_engine_v2.service import session_view, start_approved
from backend.activity_engine_v2.composer import validate_gameplay_review
from backend.activity_engine_v2.preview import validate_runtime_compatibility
from backend.activity_engine_v2.validator import validate_program
from scripts.compose_game_design_case import read_json, update_json
from scripts.prepare_activity_benchmark_verification import source_approval


def save(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_game_verification_required')
    config = read_json(args.private_config)
    report_path = Path(config['report'])
    report = read_json(report_path)
    load_dotenv(ROOT / 'backend/.env')
    security = SecurityContext.from_env()
    if security.settings.app_env != 'development' or security.settings.cookie_secure:
        raise ValueError('local_development_required')
    source_database = Path(config['databaseUrl'].removeprefix('sqlite:///'))
    if source_database.resolve() == security.db.path.resolve():
        raise ValueError('separate_synthetic_database_required')
    with security.db.transaction() as connection:
        owner = connection.execute('SELECT account_id,kid_id FROM activity_program_sessions WHERE id=?',
                                   (args.ownership_anchor,)).fetchone()
        if not owner:
            raise ValueError('existing_evaluation_owner_required')
        row = connection.execute("""SELECT * FROM sessions WHERE account_id=? AND active_kid_profile_id=?
            AND mode='kid' AND revoked_at IS NULL AND expires_at>? ORDER BY rowid DESC LIMIT 1""",
            (owner['account_id'], owner['kid_id'], security.clock.now())).fetchone()
        if not row:
            raise ValueError('active_evaluation_profile_required')
        active = SessionRecord(row['token_digest'], row['account_id'], row['mode'], row['active_kid_profile_id'],
                               row['parent_expires_at'], row['version'])
    links = []
    for record in report['cases']:
        if not record.get('browserCompleted') or not record.get('replayVerified'):
            raise ValueError('actual_browser_verification_required')
        name = record['case']
        if (record.get('browserDefinitionHash') != record.get('definitionHash')
                or config['jobs'][name].get('definitionHash') != record.get('definitionHash')):
            raise ValueError('browser_definition_binding_required')
        approved, snapshot, _ = source_approval(source_database,
            dict(localUrl='http://localhost:3000/kid/activity-preview/'+config['jobs'][name]['sessionId'],
                 definitionHash=record['definitionHash']))
        if snapshot != dict(actionCount=0, revision=0):
            raise ValueError('synthetic_starting_attempt_changed')
        validation = validate_program(approved.program, check_witness=True)
        if not approved.program.witness or not validation.valid or validation.computational != 'witness_verified':
            raise ValueError('verified_runtime_required')
        validate_runtime_compatibility(approved.program)
        validate_gameplay_review(approved.program, approved.definition_hash, approved.gameplay_review, approved.render_manifest)
        # Never attribute synthetic work evidence or a diagnosis to a real child.
        intent = approved.program.intent.model_dump(warnings=False)
        if intent.get('observations') or intent.get('misconceptions') or approved.program.provenance.sourceRefs:
            raise ValueError('curriculum_only_evaluation_required')
        saved_id = config['jobs'][name].get('evaluationSessionId')
        if saved_id:
            created = session_view(security, active.active_kid_profile_id, saved_id, active)
        else:
            with security.db.transaction() as connection:
                created = start_approved(connection, security, active.active_kid_profile_id, approved, active)
            update_json(args.private_config, lambda value: value['jobs'][name].__setitem__('evaluationSessionId', created['id']))
        if created['actionCount'] != 0 or created['revision'] != 0 or created['definitionHash'] != approved.definition_hash:
            raise ValueError('pristine_evaluation_required')
        url = 'http://localhost:3000/kid/activity-preview/'+created['id']
        values = dict(localUrl=url, evaluationActionCount=0, evaluationRevision=0, evaluationDefinitionHash=approved.definition_hash)
        update_json(report_path, lambda value: next(item for item in value['cases'] if item['case'] == name).update(values))
        links.append(dict(case=name, title=created['title'], localUrl=url))
    update_json(report_path, lambda value: value.update(success=len(links) == 4, evaluationIsolation='curriculum_definitions_only_no_synthetic_uploads'))
    print(json.dumps(dict(success=len(links) == 4, activities=links)))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config', required=True, type=Path)
    parser.add_argument('--ownership-anchor', required=True)
    try:
        save(parser.parse_args())
    except Exception as error:
        print(json.dumps(dict(success=False, reasonCode=getattr(error, 'code', 'evaluation_save_failed'))))
        sys.exit(1)
