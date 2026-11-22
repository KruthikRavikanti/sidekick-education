"""Authoring stays offline; the preview never replaces the live V1 contract."""
import json
from pathlib import Path
import subprocess
import sys

import pytest
from pydantic import ValidationError

ROOT = Path(__file__).resolve().parents[2]
EXAMPLES = ROOT / 'data/activity_engine_v2/examples'


def test_standalone_validation_never_imports_live_app_provider_or_learner_services():
    code = '''
from pathlib import Path
import socket
import sqlite3
import sys
def forbidden(*args, **kwargs):
    raise AssertionError("Offline validation attempted external I/O")
socket.create_connection = forbidden
sqlite3.connect = forbidden
from backend.activity_engine_v2 import validate_program
for path in Path("data/activity_engine_v2/examples").glob("*.json"):
    assert validate_program(path.read_bytes()).valid
assert not any(name in sys.modules for name in (
    "backend.main", "backend.provider", "backend.gap.service",
    "backend.activities.service", "backend.accounts.security"))
'''
    result = subprocess.run([sys.executable, '-c', code], cwd=ROOT,
                            capture_output=True, text=True, timeout=15)
    assert result.returncode == 0, result.stderr


def test_live_app_keeps_v1_routes_separate_from_gated_preview():
    code = '''
from backend import main
routes = {route.path: route for route in main.app.routes if hasattr(route, "path")}
for included in main.app.routes:
    if hasattr(included, "original_router"):
        routes.update({route.path: route for route in included.original_router.routes})
assert routes["/api/activities/kid/sessions/{session_id}"].endpoint.__module__ == "backend.activities.api"
assert routes["/api/activity-programs/sessions/{session_id}"].endpoint.__module__ == "backend.activity_engine_v2.routes"
'''
    result = subprocess.run([sys.executable, '-c', code], cwd=ROOT,
                            capture_output=True, text=True, timeout=15)
    assert result.returncode == 0, result.stderr


def test_existing_session_schema_rejects_program_definitions():
    from backend.activities.models import ActivitySpec
    raw = json.loads((EXAMPLES / 'habitat_designer.json').read_text())
    with pytest.raises(ValidationError):
        ActivitySpec.model_validate(raw)


def test_cli_rejects_bad_input_without_echoing_content_or_private_filename(tmp_path):
    sentinel = 'PRIVATE_WORK_SENTINEL'
    path = tmp_path / (sentinel + '.json')
    path.write_text(json.dumps(dict(schemaVersion='2.0-foundation', script=sentinel)))
    result = subprocess.run([sys.executable, '-m', 'backend.activity_engine_v2', 'validate', str(path)],
                            cwd=ROOT, capture_output=True, text=True, timeout=15)
    assert result.returncode == 1
    assert sentinel not in result.stdout + result.stderr
    report = json.loads(result.stdout)
    assert report['valid'] is False
    assert report['reports'][0]['issues'] == [dict(code='schema_invalid', path='')]
    assert not result.stderr
