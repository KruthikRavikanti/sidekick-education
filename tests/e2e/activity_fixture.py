"""Resume synthetic upload analysis inside Playwright's private test DB only.

The browser performs real upload/authentication/session requests. This replaces
only external model decisions, with no test endpoint or production auth bypass.
"""
import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.accounts import SecurityContext, Settings
from backend.gap.homework import resume_upload
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision


class SyntheticDecisions:
    model = 'explicit-synthetic-activity-test'

    async def map_problem(self, problem, grade, candidates, context=None):
        question = problem['question']['text']
        target = {'How many 1/4 pieces make 3/4?': '3.NF.A.1-2',
                  'One mouse, two ___.': 'L.3.1-2'}.get(question)
        assert target and any(row['subskill_id'] == target for row in candidates)
        return MappingDecision(subskill_id=target, confidence=.99, explanation='Explicit synthetic fixture target.')

    async def grade_problem(self, problem, context, rubric=None):
        assert problem['question']['text'] == 'One mouse, two ___.'
        correct = problem['student_work']['final_answer']['text'] == 'mice'
        return GradeDecision(correctness='correct' if correct else 'incorrect', source='model', confidence=.99,
                             explanation='Synthetic plural-noun rubric: the plural of mouse is mice.')

    async def match_signature(self, problem, candidate, context=None):
        return SignatureDecision(status='matched', confidence=.99, explanation='Synthetic visible response matches the catalog observation.')


async def main():
    if len(sys.argv) not in {4, 5}:
        raise RuntimeError('Provide a test database, child, upload, and optional expected correctness.')
    database_url, kid_id, upload_id = sys.argv[1:4]
    expected_correctness = sys.argv[4] if len(sys.argv) == 5 else 'incorrect'
    if expected_correctness not in {'correct', 'incorrect'}:
        raise RuntimeError('Expected correctness must be correct or incorrect.')
    database_path = Path(database_url.removeprefix('sqlite:///'))
    if not database_url.startswith('sqlite:///') or not database_path.is_absolute() or not database_path.name.startswith('sidekick-e2e-') or not database_path.is_file():
        raise RuntimeError('Only an existing isolated browser-test database is allowed.')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev',
                                       cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    with security.db.transaction() as conn:
        upload = conn.execute('SELECT extraction_json,source FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
        assert upload and upload['extraction_json'] and upload['source'] == 'fixture'
        question = json.loads(upload['extraction_json'])['problems'][0]['question']['text']
        assert question in {'How many 1/4 pieces make 3/4?', 'One mouse, two ___.'}

    def no_transcription(_image):
        raise AssertionError('The actual browser upload must already have transcribed the page.')

    result = await resume_upload(security, kid_id, upload_id, extractor=no_transcription, adapter=SyntheticDecisions())
    assert result['state'] == 'completed'
    # Prove the real grading stage agrees with the photo's actual transcription;
    # the helper never changes extracted answers or fabricates learning evidence.
    with security.db.transaction() as conn:
        problems = conn.execute('SELECT grading_json FROM homework_problems WHERE upload_id=? AND kid_id=?', (upload_id, kid_id)).fetchall()
        assert problems and all(json.loads(row['grading_json'])['correctness'] == expected_correctness for row in problems)
        evidence = conn.execute("SELECT correctness,eligible FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref IN (SELECT id FROM homework_problems WHERE upload_id=?)", (kid_id, upload_id)).fetchall()
        assert evidence and all(row['correctness'] == expected_correctness and row['eligible'] == 1 for row in evidence)
    print(json.dumps({'id': result['id'], 'state': result['state'], 'correctness': expected_correctness}))


if __name__ == '__main__':
    asyncio.run(main())
