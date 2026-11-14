"""Analyze the known synthetic equivalent-fraction photo in an isolated test DB."""
import asyncio
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from backend.accounts import SecurityContext, Settings
from backend.gap.homework import resume_upload
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision


class Decisions:
    model = 'explicit-synthetic-equivalent-analysis'

    async def map_problem(self, problem, grade, candidates, context=None):
        assert problem['question']['text'] == '1/3 = ?/6'
        assert any(row['subskill_id'] == '3.NF.A.3-2' for row in candidates)
        return MappingDecision(subskill_id='3.NF.A.3-2', confidence=.99,
                               explanation='Synthetic equivalent-fraction skill mapping.')

    async def grade_problem(self, *args, **kwargs):
        return GradeDecision(correctness='ungraded', source='none', confidence=0.,
                             explanation='No uploaded-answer grade is fabricated for this test.')

    async def match_signature(self, *args, **kwargs):
        return SignatureDecision(status='uncertain', confidence=0., explanation='No error pattern is inferred.')


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
        row = connection.execute('SELECT source,extraction_json FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
        assert row and row['source'] == 'fixture'
        problem = json.loads(row['extraction_json'])['problems'][0]
        assert problem['question']['text'] == '1/3 = ?/6'
        assert problem['student_work']['final_answer']['text'] == '3'

    def no_transcription(_image):
        raise AssertionError('The browser must upload and read the real synthetic image first.')

    result = await resume_upload(security, kid_id, upload_id, extractor=no_transcription, adapter=Decisions())
    assert result['state'] == 'completed'
    print(json.dumps({'state': 'completed'}))


if __name__ == '__main__':
    asyncio.run(main())
