"""Only external analysis decisions are explicit fixtures; real uploads/auth persist."""
import asyncio
import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'scripts'))
from generate_catalog_fixtures import CASES
from backend.accounts import SecurityContext, Settings
from backend.gap.homework import resume_upload
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision

QUESTIONS = {question: target for name, subject, grade, target, title, question, answer in CASES}


class Decisions:
    model = 'explicit-synthetic-catalog-analysis'

    async def map_problem(self, problem, grade, candidates, context=None):
        target = QUESTIONS[problem['question']['text']]
        assert any(candidate['subskill_id'] == target for candidate in candidates)
        return MappingDecision(subskill_id=target, confidence=.99, explanation='Explicit synthetic mapping.')

    async def grade_problem(self, *args, **kwargs):
        return GradeDecision(correctness='ungraded', source='none', confidence=0., explanation='No invented grade.')

    async def match_signature(self, *args, **kwargs):
        return SignatureDecision(status='uncertain', confidence=0., explanation='No invented error observation.')


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
        row = conn.execute('SELECT extraction_json,source FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id,kid_id)).fetchone()
        assert row and row['source'] == 'fixture'
        question = json.loads(row['extraction_json'])['problems'][0]['question']['text']
        assert question in QUESTIONS

    def no_transcription(_image):
        raise AssertionError('The browser must upload and read the photo first.')
    result = await resume_upload(security,kid_id,upload_id,extractor=no_transcription,adapter=Decisions())
    assert result['state'] == 'completed'
    with security.db.transaction() as conn:
        mapped = conn.execute('SELECT mapping_json FROM homework_problems WHERE upload_id=? AND kid_id=?', (upload_id,kid_id)).fetchone()
        assert json.loads(mapped['mapping_json'])['subskill_id'] == QUESTIONS[question]
    print(json.dumps({'state':'completed'}))


if __name__ == '__main__':
    asyncio.run(main())
