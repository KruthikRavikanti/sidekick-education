"""Opt-in real-provider browser app with disposable storage and no finished library."""
import os
from pathlib import Path
import tempfile

database_url = os.getenv('DATABASE_URL', '')
database = Path(database_url.removeprefix('sqlite:///'))
if (os.getenv('SIDEKICK_RUN_V2_LIVE') != 'true' or os.getenv('APP_ENV') != 'test'
        or not database_url.startswith('sqlite:///') or not database.is_absolute()
        or not database.name.startswith('sidekick-e2e-') or not database.is_file()
        or database.is_symlink() or database.resolve().parent != Path(tempfile.gettempdir()).resolve()
        or Path(os.getenv('SIDEKICK_PRIVATE_UPLOAD_DIR', '')).resolve() != Path(str(database) + '.uploads').resolve()):
    raise RuntimeError('Live browser verification requires explicit isolated test storage.')

from backend.main import app
from backend.activity_engine_v2 import preview


def forbidden_fixture(*args, **kwargs):
    raise AssertionError('Generated admission must not load a finished fixture.')


preview.FIXTURE_PATHS.clear()
preview.load_preview = forbidden_fixture
