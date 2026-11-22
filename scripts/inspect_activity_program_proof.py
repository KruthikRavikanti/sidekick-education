"""Safe metrics from the disposable live proof database; never application data."""
import argparse
import json
import os
from pathlib import Path
import sqlite3
import tempfile


def inspect(database_url, generation_id=None, resume=False):
    database = Path(database_url.removeprefix('sqlite:///'))
    if (os.getenv('SIDEKICK_RUN_V2_LIVE') != 'true' or not database_url.startswith('sqlite:///')
            or not database.is_absolute() or not database.is_file() or database.is_symlink()
            or not database.name.startswith('sidekick-e2e-')
            or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise ValueError('isolated_database_required')
    connection = sqlite3.connect(f'file:{database}?mode=ro', uri=True)
    connection.row_factory = sqlite3.Row
    try:
        if resume:
            # Consumed privately by the browser harness, never copied into its
            # public report or sent to composition/planning models.
            row = connection.execute('''SELECT a.email,k.id FROM accounts a
                JOIN kid_profiles k ON k.account_id=a.id ORDER BY k.rowid LIMIT 1''').fetchone()
            if not row:
                raise ValueError('synthetic_family_missing')
            return dict(email=row['email'], profileId=row['id'])
        if generation_id is None:
            return dict(programVersions=connection.execute('SELECT COUNT(*) FROM activity_program_versions').fetchone()[0],
                v1Versions=connection.execute('SELECT COUNT(*) FROM activity_versions').fetchone()[0])
        row = connection.execute('SELECT * FROM activity_program_generations WHERE id=?', (generation_id,)).fetchone()
        if not row:
            raise ValueError('generation_missing')
        review = json.loads(row['review_json'] or '{}')
        context = json.loads(row['context_json'])
        sources = json.loads(row['private_sources_json'])
        return dict(requestedModel=row['requested_model'], returnedModels=json.loads(row['returned_models_json'] or '[]'),
            modelCalls=json.loads(row['model_calls_json'] or '[]'), repairReasons=sources.get('generationDiagnostics', []),
            providerCalls=row['call_count'], approvalHashBound=review.get('definitionHash') == row['approved_definition_sha256'],
            separateReviewApproved=review.get('approved') is True,
            targetSkills=[item['skillId'] for item in context['targets']],
            learningGoal=context['learningGoal'], observationKinds=[item['kind'] for item in context.get('observations', [])],
            savedHistoryCount=len(context.get('history', [])),
            priorAssistanceObserved=any(item.get('assistanceReceived') for item in context.get('history', [])))
    finally:
        connection.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('database_url')
    parser.add_argument('--generation')
    parser.add_argument('--resume', action='store_true')
    args = parser.parse_args()
    try:
        print(json.dumps(inspect(args.database_url, args.generation, args.resume)))
    except Exception:
        print(json.dumps({'error': 'verification_inspection_failed'}))
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
