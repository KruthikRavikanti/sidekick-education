"""Run actual upload analysis with explicit model decisions in the test DB only."""
import asyncio
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from backend.accounts import SecurityContext, Settings
from backend.gap.homework import resume_upload
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision

QUESTIONS = {
    'A scarf costs 6 dollars. A jacket costs 4 times as much. How much does the jacket cost?': '4.OA.A.2-1',
    'After an article: What causes the seasons? Quote or point to the sentence.': 'RI.3.1-1',
}


class Decisions:
    model = 'explicit-synthetic-general-activity-analysis'

    async def map_problem(self, problem, grade, candidates, context=None):
        target = QUESTIONS[problem['question']['text']]
        assert any(candidate['subskill_id'] == target for candidate in candidates)
        return MappingDecision(subskill_id=target, confidence=.99, explanation='Explicit synthetic skill mapping.')

    async def grade_problem(self, problem, context, rubric=None):
        return GradeDecision(correctness='ungraded', source='none', confidence=0.,
                             explanation='This test does not assume a confident uploaded-answer grade.')

    async def match_signature(self, *args, **kwargs):
        return SignatureDecision(status='uncertain', confidence=0., explanation='No error is inferred.')


async def main():
    database_url, kid_id, upload_id = sys.argv[1:]
    database = Path(database_url.removeprefix('sqlite:///'))
    if (not database_url.startswith('sqlite:///') or not database.is_absolute()
            or not database.name.startswith('sidekick-e2e-') or not database.is_file()
            or database.is_symlink() or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise RuntimeError('Only an existing isolated browser-test database is allowed.')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev',
                                       cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    with security.db.transaction() as connection:
        row = connection.execute('SELECT extraction_json,source FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
        assert row and row['source'] == 'fixture'
        assert json.loads(row['extraction_json'])['problems'][0]['question']['text'] in QUESTIONS

    def no_transcription(_image):
        raise AssertionError('The browser must perform actual photo upload and extraction first.')

    result = await resume_upload(security, kid_id, upload_id, extractor=no_transcription, adapter=Decisions())
    assert result['state'] == 'completed'
    with security.db.transaction() as connection:
        row = connection.execute('SELECT mapping_json FROM homework_problems WHERE upload_id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
        assert json.loads(row['mapping_json'])['subskill_id'] in QUESTIONS.values()
    print(json.dumps({'state': 'completed'}))


if __name__ == '__main__':
    asyncio.run(main())
