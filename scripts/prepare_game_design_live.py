"""Read real synthetic uploads into disposable storage for live game verification.

No finished activity, mapping, answer grade, or student observation is injected.
The normal extraction/analysis APIs use the configured provider. Browser cookies,
upload identifiers and the disposable database path remain in external 0600 files.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
from fastapi.testclient import TestClient

from backend.accounts.database import Database
from backend.accounts.security import SecurityContext
from backend.accounts.settings import Settings
from backend.activity_engine_v2.context import build_context
from backend.gap.catalog import seed_catalog
from scripts.prepare_activity_benchmark_verification import external_new_path, synthetic_family, write_private
from scripts.compose_game_design_case import update_json


def prepare(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_live_verification_required')
    config_path, state_path = external_new_path(args.private_config), external_new_path(args.browser_state)
    load_dotenv(ROOT / 'backend/.env')
    descriptor, database_name = tempfile.mkstemp(prefix='sidekick-e2e-games-', suffix='.sqlite3')
    os.close(descriptor)
    database = Path(database_name).resolve()
    os.environ.update(DATABASE_URL='sqlite:///'+str(database), APP_ENV='test', PASSWORD_POLICY='dev',
        COOKIE_SECURE='false', TRUSTED_ORIGINS='http://localhost:3000', SIDEKICK_FIXTURE_MODE='false',
        SIDEKICK_ACTIVITY_V2_PREVIEW='true', SIDEKICK_PRIVATE_UPLOAD_DIR=str(database)+'.uploads')
    security = SecurityContext(Settings.from_env())
    security.db.migrate()
    seed_catalog(security.db)
    active, state = synthetic_family(security, '3')
    from backend.main import app
    from backend.activity_engine_v2 import preview
    preview.FIXTURE_PATHS.clear()
    app.state.security = security
    report = dict(syntheticEngineeringRun=True, success=False, cases=[],
                  emptyFinishedLibrary=True, fixtureFallbackDisabled=True)
    uploads = {}
    # Persist isolated auth/storage immediately so a source-validation failure
    # cannot strand real extraction results or require recreating an account.
    write_private(state_path, state)
    write_private(config_path, dict(databaseUrl='sqlite:///'+str(database),
        privateUploadDirectory=str(database)+'.uploads', browserState=str(state_path), uploads=uploads,
        report=str(args.report.resolve())))
    with TestClient(app, base_url='http://localhost:3000', cookies={
            security.settings.session_cookie: state['cookies'][0]['value']}) as client:
        def headers():
            csrf = client.get('/api/auth/csrf')
            if csrf.status_code != 200:
                raise ValueError('synthetic_authentication_failed')
            return {'Origin': 'http://localhost:3000', 'X-CSRF-Token': csrf.json()['csrfToken'],
                    'X-Sidekick-Profile-Version': str(active.version)}

        for name, file, expected in [
            ('area-first', 'game-design-area-work.png', '3.MD.C.7-1'),
            ('ela-reading', 'game-design-main-idea-work.png', 'RI.3.2-1'),
            ('ela-writing', 'game-design-writing-work.png', ('W.3.3-1', 'W.4.3-1')),
        ]:
            print(json.dumps({'case': name, 'stage': 'reading_synthetic_upload'}), flush=True)
            expected_ids = [expected] if isinstance(expected, str) else list(expected)
            record = dict(case=name, syntheticSource=file, liveExtraction=False, expectedSkill=' or '.join(expected_ids))
            report['cases'].append(record)
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(report, indent=2)+'\n')
            image = (ROOT / 'public/samples' / file).read_bytes()
            response = None
            for _ in range(2):
                response = client.post('/api/extract', files={'file': (file, image, 'image/png')}, headers=headers())
                if response.status_code == 200:
                    break
                record.setdefault('uploadFailures', []).append(response.json().get('error', {}).get('code', 'upload_failed'))
            if response is None or response.status_code != 200:
                raise ValueError('synthetic_upload_failed')
            upload_id = response.headers['x-sidekick-upload-id']
            uploads[name] = upload_id
            update_json(config_path, lambda value: value.update(uploads=uploads))
            record['liveExtraction'] = response.json().get('source') == 'live'
            view = client.get('/api/learning/kid/uploads/'+upload_id).json()
            if view.get('state') != 'completed':
                client.post('/api/learning/kid/uploads/'+upload_id+'/retry', headers=headers())
            with security.db.transaction() as connection:
                context = build_context(connection, security, active.active_kid_profile_id, upload_id, active)
                if connection.execute('SELECT COUNT(*) FROM activity_program_versions').fetchone()[0] != 0:
                    raise ValueError('finished_library_not_empty')
                if connection.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0] != 0:
                    raise ValueError('finished_v1_library_not_empty')
            record.update(targetSkills=[item['skillId'] for item in context.sanitized['targets']],
                mappingConfidence=context.sanitized['mappingConfidence'], learningGoal=context.sanitized['learningGoal'],
                observationKinds=[item['kind'] for item in context.sanitized.get('observations', [])])
            args.report.write_text(json.dumps(report, indent=2)+'\n')
            if len(record['targetSkills']) != 1 or record['targetSkills'][0] not in expected_ids:
                raise ValueError('benchmark_target_mismatch')
            uploads[name] = upload_id
            if name == 'area-first':
                uploads['area-second'] = upload_id
                report['cases'].append(dict(record, case='area-second', sameMathSource=True))
            args.report.write_text(json.dumps(report, indent=2)+'\n')
    update_json(config_path, lambda value: value.update(uploads=uploads))
    print(json.dumps({'success': True, 'privateConfig': str(config_path)}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-config', type=Path, required=True)
    parser.add_argument('--browser-state', type=Path, required=True)
    parser.add_argument('--report', type=Path, required=True)
    try:
        prepare(parser.parse_args())
    except Exception as error:
        code = getattr(error, 'code', None)
        print(json.dumps({'success': False, 'reasonCode': code if isinstance(code, str) else 'live_work_preparation_failed'}))
        sys.exit(1)
