"""Isolated browser app: replace only model composition/review, never auth or APIs."""
import os
import asyncio
import copy
import json
import tempfile
from pathlib import Path

database_url = os.getenv('DATABASE_URL', '')
database = Path(database_url.removeprefix('sqlite:///'))
if (os.getenv('APP_ENV') != 'test' or not database_url.startswith('sqlite:///')
        or not database.is_absolute() or not database.name.startswith('sidekick-e2e-')
        or database.is_symlink() or not database.is_file()
        or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
    raise RuntimeError('Browser adapters require an existing isolated test database.')
if Path(os.getenv('SIDEKICK_PRIVATE_UPLOAD_DIR','')).resolve() != Path(str(database)+'.uploads').resolve():
    raise RuntimeError('Browser artifacts require storage beside the isolated test database.')

from backend.main import app
from backend.activities.models import ActivityReview, ActivitySpec
from toolkit_examples import example as toolkit_example
from catalog_examples import EXAMPLE_KINDS, example as catalog_example
from backend.activities.general import FamilyActivityReview


@app.middleware('http')
async def synthetic_slow_reader(request, call_next):
    # This module cannot start outside the guarded disposable test database.
    # Delay only an explicitly marked request while preserving the real upload,
    # authentication, CSRF checks, and response through Next's external rewrite.
    if (request.method == 'POST' and request.url.path == '/api/extract'
            and request.headers.get('x-sidekick-test-slow-reader') == '31-seconds'):
        await asyncio.sleep(31)
    return await call_next(request)


class BrowserComposer:
    model = 'explicit-synthetic-browser-composer'

    async def _call(self, response_model, task, instruction, data):
        if response_model is FamilyActivityReview:
            return FamilyActivityReview(approved=True, reason='approved', demonstratesTarget=True,
                interactionNecessary=True, goalAchievable=True, scoringAligned=True,
                materialsPresent=True, independentFresh=True)
        if response_model is ActivityReview:
            return ActivityReview(approved=True, reason='approved')
        assert response_model is ActivitySpec and data['schemaVersion'] in {'1.1', '1.2'}
        if data['subskillId'] in EXAMPLE_KINDS:
            return ActivitySpec.model_validate(catalog_example(data))
        if data['subskillId'] == '3.NF.A.3-2':
            assert data['learningGoal']['intent'] in {'explore_skill', 'reinforce_correct_work', 'support_current_skill'}
            manifest = json.loads((Path(__file__).resolve().parents[2] / 'data/activities/original_examples.json').read_text())
            spec = copy.deepcopy(next(row['spec'] for row in manifest['activities'] if row['spec']['subskillId'] == data['subskillId']))
            spec.update(title='Quilt Patches: Same Area, More Pieces', misconceptionTags=data['misconceptionTags'], sourceRefs=data['sourceRefs'])
            for scene in spec['scenes'][:-1]:
                scene['params'].update(context='A rectangular quilt has a colored patch. Try smaller equal stitches while keeping the colored patch fixed.', wholeLabel='One quilt', shadedLabel='colored')
                scene['params']['teachingText'] = scene['params']['teachingText'].replace('planted area', 'colored area')
                scene['prompt'] = scene['prompt'].replace('garden bed', 'quilt').replace('garden', 'quilt').replace('planted', 'colored')
                scene['feedback'] = {key: value.replace('planted', 'colored') for key, value in scene['feedback'].items()}
            return ActivitySpec.model_validate(spec)
        assert data['subskillId'] in {'1.NBT.B.2-1', 'RI.3.3-1', 'RI.3.1-1'}
        return ActivitySpec.model_validate(toolkit_example(data))


app.state.activity_adapter = BrowserComposer()
