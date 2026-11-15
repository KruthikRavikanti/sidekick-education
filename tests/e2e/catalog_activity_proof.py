"""Export only objective/version/outcome proof from the isolated browser DB."""
import hashlib
import json
from pathlib import Path
import sys
import tempfile

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from backend.accounts import SecurityContext, Settings
from backend.activities.models import ActivitySpec
from backend.activities.capabilities import validate_activity
from backend.activities.coverage import MAP_PATH, file_sha
from backend.gap.catalog import get_subskill


def main():
    database_url,session_id=sys.argv[1:]
    path=Path(database_url.removeprefix('sqlite:///'))
    if (not database_url.startswith('sqlite:///') or not path.is_absolute() or not path.is_file()
        or path.is_symlink() or not path.name.startswith('sidekick-e2e-')
        or path.resolve().parent != Path(tempfile.gettempdir()).resolve()):
        raise RuntimeError('Only an existing isolated browser-test database is allowed.')
    s=SecurityContext(Settings(database_url=database_url,app_env='test',password_policy='dev',cookie_secure=False,trusted_origins=('http://localhost:3000',)))
    with s.db.transaction() as c:
        row=c.execute('SELECT s.*,v.spec_json,v.spec_sha256,v.origin,v.verified FROM activity_sessions s JOIN activity_versions v ON v.id=s.activity_version_id WHERE s.id=?',(session_id,)).fetchone()
        assert row and row['status']=='completed' and row['origin']=='model_generated' and row['verified']==1
        spec=ActivitySpec.model_validate_json(row['spec_json'])
        validate_activity(spec,get_subskill(c,row['subskill_id']))
        assert hashlib.sha256(row['spec_json'].encode()).hexdigest()==row['spec_sha256']
        attempt=c.execute("SELECT * FROM activity_attempts WHERE session_id=? AND phase='independent'",(session_id,)).fetchone()
        assert attempt and attempt['assessment_status']!='pending_parent_review'
        parent=attempt['assessment_status']=='parent_reviewed'
        if parent:assert c.execute('SELECT 1 FROM activity_parent_reviews WHERE attempt_id=?',(attempt['id'],)).fetchone()
    print(json.dumps(dict(coverageMapSha256=file_sha(MAP_PATH),case=dict(subskillId=row['subskill_id'],
        generatedValidated=True,playedScored=True,specSha256=row['spec_sha256'],providerMode='fixture',
        assessment='parent_review' if parent else 'automatic',parentReviewed=parent,
        outcome='correct' if attempt['correct'] else 'incorrect',source='tests/e2e/catalog-activities.spec.ts'))))


if __name__=='__main__':main()
