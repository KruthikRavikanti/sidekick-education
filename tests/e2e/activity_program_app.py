"""Real preview APIs plus one remixed server fixture in the guarded test app."""
import atexit
import json
from pathlib import Path
import tempfile

# activity_app checks APP_ENV, disposable database and private storage before
# loading the real API. No registration endpoint or browser definition exists.
from activity_app import app
from backend.activity_engine_v2.preview import FIXTURE_PATHS
from backend.activity_engine_v2.validator import require_valid_program

raw = json.loads(FIXTURE_PATHS['habitat_designer'].read_bytes())
reserved = {'rows', 'columns', 'left', 'right', 'result', 'text', 'cell', 'sentence', 'order', 'artifact', 'amount'}
names = set()


def collect(value):
    if isinstance(value, dict):
        if isinstance(value.get('id'), str) and value['id'] not in reserved:
            names.add(value['id'])
        for child in value.values():
            collect(child)
    elif isinstance(value, list):
        for child in value:
            collect(child)


collect(raw)
names = {value: 'remix-' + value for value in names}


def rename(value):
    if isinstance(value, str):
        return names.get(value, value)
    if isinstance(value, list):
        return [rename(child) for child in value]
    if isinstance(value, dict):
        return {key: rename(child) for key, child in value.items()}
    return value


raw = rename(raw)
raw['title'] = 'Lay the moon greenhouse'
raw['presentation']['spaces'][0]['title'] = raw['title']
for slot in raw['world']['state']:
    if slot['id'] in {'rows', 'columns', names['expression-left'], names['expression-right']}:
        slot['maximum'] = 4
    elif slot['id'] == names['tile-budget']:
        slot.update(initial=8, minimum=8, maximum=8)
    elif slot['kind'] == 'id_set':
        slot.update(options=[f'r{r}c{c}' for r in range(4) for c in range(4)], maxItems=16)
for obj in raw['world']['objects']:
    if obj['kind'] == 'grid':
        obj.update(width=4, height=4)
for material in raw['world']['materials']:
    if material['kind'] == 'unit_tiles':
        material['quantity'] = 8
    elif material['kind'] == 'prompt':
        material['text'] = 'Build a moon greenhouse using all 8 square panels. Reshape the floor and build an equality that describes your design.'
for action in raw['actions']:
    for param in action['inputs']:
        if param['id'] in {'rows', 'columns', 'left', 'right'}:
            param['maximum'] = 4
raw['witness'][0]['inputs'] = {'rows': 2, 'columns': 4}
raw['witness'][1]['inputs'] = {'left': 2, 'right': 4, 'result': 8}
require_valid_program(raw)

folder = tempfile.TemporaryDirectory(prefix='sidekick-e2e-v2-fixture-')
atexit.register(folder.cleanup)
fixture = Path(folder.name) / 'remixed.json'
fixture.write_text(json.dumps(raw))
FIXTURE_PATHS['remixed-workspace'] = fixture
