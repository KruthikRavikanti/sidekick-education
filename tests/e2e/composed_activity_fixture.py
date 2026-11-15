"""Explicit analysis decisions for the browser's synthetic rectangle upload."""
import asyncio
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from backend.accounts import SecurityContext, Settings
from backend.gap.homework import resume_upload
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision

QUESTION = 'Tile a 4 by 6 rectangle. Find its area.'


class Decisions:
    model = 'explicit-synthetic-rectangle-analysis'

    async def map_problem(self, problem, grade, candidates, context=None):
        assert problem['question']['text'] == QUESTION
        assert any(candidate['subskill_id'] == '3.MD.C.7-1' for candidate in candidates)
        return MappingDecision(subskill_id='3.MD.C.7-1', confidence=.99, explanation='Explicit rectangle area mapping.')

    async def grade_problem(self, *args, **kwargs):
        return GradeDecision(correctness='incorrect', source='model', confidence=.99, explanation='The synthetic response gives ten instead of twenty-four square units.')

    async def match_signature(self, *args, **kwargs):
        return SignatureDecision(status='uncertain', confidence=0., explanation='No diagnostic misconception is asserted.')


async def main():
    database_url, kid_id, upload_id = sys.argv[1:]
    path = Path(database_url.removeprefix('sqlite:///'))
    if (not database_url.startswith('sqlite:///') or not path.is_absolute() or not path.is_file()
            or path.is_symlink() or not path.name.startswith('sidekick-e2e-')
            or path.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise RuntimeError('Only an existing isolated browser-test database is allowed.')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev',
        cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    with security.db.transaction() as conn:
        row = conn.execute('SELECT extraction_json,source FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
        assert row and row['source'] == 'fixture'
        assert json.loads(row['extraction_json'])['problems'][0]['question']['text'] == QUESTION

    def no_transcription(_image):
        raise AssertionError('The browser must upload the synthetic photograph first.')

    result = await resume_upload(security, kid_id, upload_id, extractor=no_transcription, adapter=Decisions())
    assert result['state'] == 'completed'
    print(json.dumps({'state': 'completed'}))


if __name__ == '__main__':
    asyncio.run(main())
