"""Finish reading a sample page and load its game, inside Playwright's private test database only.

The browser performs the real upload, authentication and session requests. This replaces only
the model decisions (which skill the question is about) and the slow robot run, with no test
endpoint and no production bypass.

Usage: game_play_fixture.py <database-url> <kid-id> <upload-id> [waiting|approved]
"""
import asyncio
import json
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from backend.accounts import SecurityContext, Settings
from backend.games import library, prompts
from backend.gap.homework import resume_upload
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision

# The one question on each sample page, and the skill it is about.
TARGETS = {'How many 1/4 pieces make 3/4?': '3.NF.A.1-2', 'One mouse, two ___.': 'L.3.1-2'}
REPORT = {'passed': True, 'kit': 'kit-1', 'stats': {}, 'checks': [{'name': 'stand_in_for_browser_test', 'ok': True, 'detail': ''}],
          'manifest': {'rounds': [{'id': 'your-turn', 'phase': 'solo', 'say': 'Try it by yourself.', 'mistakes': [{'tag': 'mix_up'}]}]}}


class SyntheticDecisions:
    model = 'explicit-synthetic-game-test'

    async def map_problem(self, problem, grade, candidates, context=None):
        target = TARGETS.get(problem['question']['text'])
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
        raise RuntimeError('Provide a test database, child, upload, and optionally waiting or approved.')
    database_url, kid_id, upload_id = sys.argv[1:4]
    status = sys.argv[4] if len(sys.argv) == 5 else 'approved'
    if status not in {'waiting', 'approved'}:
        raise RuntimeError('The game must be waiting or approved.')
    database_path = Path(database_url.removeprefix('sqlite:///'))
    if (not database_url.startswith('sqlite:///') or not database_path.is_absolute()
            or not database_path.name.startswith('sidekick-e2e-') or not database_path.is_file()
            or database_path.is_symlink() or database_path.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise RuntimeError('Only an existing isolated browser-test database is allowed.')
    security = SecurityContext(Settings(database_url=database_url, app_env='test', password_policy='dev',
                                       cookie_secure=False, trusted_origins=('http://localhost:3000',)))
    with security.db.transaction() as conn:
        upload = conn.execute('SELECT extraction_json,source FROM homework_uploads WHERE id=? AND kid_id=?', (upload_id, kid_id)).fetchone()
        assert upload and upload['extraction_json'] and upload['source'] == 'fixture'
        question = json.loads(upload['extraction_json'])['problems'][0]['question']['text']
        assert question in TARGETS

    def no_transcription(_image):
        raise AssertionError('The actual browser upload must already have transcribed the page.')

    result = await resume_upload(security, kid_id, upload_id, extractor=no_transcription, adapter=SyntheticDecisions())
    assert result['state'] == 'completed'
    # The real grading stage read the page's own answer. Nothing here invents learning evidence.
    with security.db.transaction() as conn:
        evidence = conn.execute("SELECT correctness,eligible FROM learning_evidence WHERE kid_id=? AND source='homework' AND source_ref IN (SELECT id FROM homework_problems WHERE upload_id=?)", (kid_id, upload_id)).fetchall()
        assert evidence and all(row['correctness'] == 'incorrect' and row['eligible'] == 1 for row in evidence)

    # Load the shipped game for that skill. The real robot is exercised by the backend tests and
    # `games verify`; a stand-in report keeps this browser test quick.
    skill = TARGETS[question]
    game = next(item for item in prompts.load_library() if item['subskillId'] == skill)
    seeded = library.seed_examples(security.db, time.time(), robot=lambda code, css: REPORT, only=[game['slug']], approve=status == 'approved')
    assert [item['result'] for item in seeded] in (['added'], ['unchanged'])
    with security.db.transaction() as conn:
        stored = conn.execute('SELECT status FROM game_versions WHERE subskill_id=?', (skill,)).fetchall()
    print(json.dumps({'id': result['id'], 'state': result['state'], 'skill': skill, 'title': game['title'], 'slug': game['slug'],
                      'statuses': [row['status'] for row in stored]}))


if __name__ == '__main__':
    asyncio.run(main())
