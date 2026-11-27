"""Isolated browser app: the real backend, guarded so it can only start on a disposable test database."""
import os
import asyncio
import tempfile
from pathlib import Path

database_url = os.getenv('DATABASE_URL', '')
database = Path(database_url.removeprefix('sqlite:///'))
if (os.getenv('APP_ENV') != 'test' or not database_url.startswith('sqlite:///')
        or not database.is_absolute() or not database.name.startswith('sidekick-e2e-')
        or database.is_symlink() or not database.is_file()
        or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
    raise RuntimeError('Browser tests require an existing isolated test database.')
if Path(os.getenv('SIDEKICK_PRIVATE_UPLOAD_DIR','')).resolve() != Path(str(database)+'.uploads').resolve():
    raise RuntimeError('Browser artifacts require storage beside the isolated test database.')

from backend.main import app


@app.middleware('http')
async def synthetic_slow_reader(request, call_next):
    # This module cannot start outside the guarded disposable test database.
    # Delay only an explicitly marked request while preserving the real upload,
    # authentication, CSRF checks, and response through Next's external rewrite.
    if (request.method == 'POST' and request.url.path == '/api/extract'
            and request.headers.get('x-sidekick-test-slow-reader') == '31-seconds'):
        await asyncio.sleep(31)
    return await call_next(request)
