"""Record/check the generic capability boundary before the live ELA transfer.

Engineering evidence only: hashes repository source and updates the public
verification report. It does not load app settings, credentials, or databases.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CAPABILITY_FILES = (
    'backend/activity_engine_v2/models.py',
    'backend/activity_engine_v2/core.py',
    'backend/activity_engine_v2/validator.py',
    'backend/activity_engine_v2/registry.py',
    'backend/activity_engine_v2/preview.py',
    'backend/activity_engine_v2/service.py',
    'backend/activity_engine_v2/routes.py',
    'backend/activity_engine_v2/composer.py',
    'backend/activity_engine_v2/generation.py',
    'backend/activity_engine_v2/context.py',
    'backend/activity_engine_v2/authoring.py',
    'backend/activity_engine_v2/composer_prompt.py',
    'backend/activity_engine_v2/gameplay_prompt.py',
    'backend/activity_engine_v2/game_design.py',
    'backend/activity_engine_v2/gameplay.py',
    'backend/gap/vision.py',
    'backend/provider.py',
    'components/activity-program-player.tsx',
    'components/activity-program-controls.tsx',
    'components/activity-program-stage.tsx',
    'components/activity-program-surfaces.tsx',
    'components/activity-program-fractions.tsx',
    'components/activity-media-controls.tsx',
    'lib/activity-program-types.ts',
    'app/kid/activity-preview/preview.css',
)


def now():
    return datetime.now(timezone.utc).isoformat()


def manifest_hash(files):
    encoded = json.dumps(files, sort_keys=True, separators=(',', ':')).encode()
    return hashlib.sha256(encoded).hexdigest()


def run(args):
    if os.getenv('SIDEKICK_RUN_GAME_LIVE') != 'true':
        raise ValueError('explicit_live_verification_required')
    # Keep the source list inspectable and independent of the report's inputs.
    current, missing = {}, []
    for name in CAPABILITY_FILES:
        path = ROOT / name
        if path.is_file():
            current[name] = hashlib.sha256(path.read_bytes()).hexdigest()
        else:
            missing.append(name)
    with args.report.open('r+', encoding='utf-8') as output:
        fcntl.flock(output.fileno(), fcntl.LOCK_EX)
        try:
            report = json.load(output)
            if args.record:
                if missing:
                    raise ValueError('capability_source_missing')
                if report.get('capabilityFreeze'):
                    raise ValueError('capability_snapshot_already_recorded')
                report['capabilityFreeze'] = {
                    'purpose': 'ela_transfer', 'recordedAt': now(),
                    'algorithm': 'sha256', 'files': current,
                    'manifestSha256': manifest_hash(current), 'lastCheck': None,
                }
                summary = {'recorded': True, 'fileCount': len(current),
                           'manifestSha256': report['capabilityFreeze']['manifestSha256']}
                passed = True
            else:
                frozen = report.get('capabilityFreeze')
                if not isinstance(frozen, dict) or not isinstance(frozen.get('files'), dict):
                    raise ValueError('capability_snapshot_required')
                expected = frozen['files']
                changed = sorted(name for name in set(expected) | set(CAPABILITY_FILES)
                                 if name not in missing and expected.get(name) != current.get(name))
                integrity = (frozen.get('algorithm') == 'sha256'
                             and frozen.get('manifestSha256') == manifest_hash(expected)
                             and set(expected) == set(CAPABILITY_FILES))
                passed = integrity and not changed and not missing
                summary = {'checkedAt': now(), 'unchanged': passed,
                           'manifestValid': integrity,
                           'changedFiles': changed, 'missingFiles': missing}
                frozen['lastCheck'] = summary
            output.seek(0)
            json.dump(report, output, indent=2)
            output.write('\n')
            output.truncate()
            output.flush()
        finally:
            fcntl.flock(output.fileno(), fcntl.LOCK_UN)
    print(json.dumps(summary))
    return 0 if passed else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument('--record', action='store_true', help='Record the generic source snapshot once, before ELA generation.')
    action.add_argument('--check', action='store_true', help='Verify source is unchanged and update lastCheck in the report.')
    parser.add_argument('--report', type=Path,
                        default=ROOT / 'docs/activity-engine-v2-game-design/report.json')
    raise SystemExit(run(parser.parse_args()))
