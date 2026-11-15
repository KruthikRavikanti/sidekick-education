"""Opt-in actual-provider compositions from an initially empty activity library.

Uploads original synthetic work through the normal authenticated HTTP handlers.
Two area experiences must differ in child action, not just prose. Temporary
accounts/media/databases are removed; reports contain only hashes and safe codes.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import logging
from pathlib import Path
import secrets
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.verify_live_activity import VerificationFailure, request_json, safe_code
from scripts.verify_general_activity import keys
from scripts.verify_catalog_activities import scene_response
from scripts.verify_toolkit_activity import verify as run_isolated

CASES = {
    'area': ('3', 'activity-composed-area', '3.MD.C.7-1'),
    'multiplication': ('3', 'activity-catalog-multiplication', '3.OA.A.1-1'),
    'measurement': ('2', 'activity-catalog-measurement', '2.MD.A.1-2'),
    'phonics': ('1', 'activity-catalog-phonics', 'RF.1.3-2'),
    'writing': ('3', 'activity-catalog-writing', 'W.3.3-1'),
    'evidence': ('3', 'activity-toolkit-evidence', None),
}


def response(client, session_id, scene, visible):
    if scene.component == 'math_workspace' and visible['params']['mode'].startswith('area_'):
        params = visible['params']
        area, mode = params['area'], params['mode']
        rows, columns = area['rows'], area['columns']
        if mode == 'area_tile':
            return dict(marks=[dict(x=x, y=y) for y in range(rows) for x in range(columns)], text='')
        if mode == 'area_design':
            choices = [(r, area['targetArea']//r) for r in range(1, params['height']+1)
                if area['targetArea'] % r == 0 and 1 <= area['targetArea']//r <= params['width']]
            if not choices:
                raise VerificationFailure('play_activity', 'area_design_unreachable')
            rows, columns = next(((r,c) for r,c in choices if r > 1 and c > 1), choices[0])
            return dict(marks=[dict(x=columns, y=rows)], text='')
        return dict(marks=[], text=f'{rows} × {columns} = {rows*columns}')
    effective = scene.model_copy(update={'params': scene.params.__class__.model_validate(visible['params'])})
    return scene_response(client, session_id, effective)


def play(client, security, session):
    from backend.activities.models import ActivitySpec
    from backend.activities import capabilities
    from backend.gap.catalog import get_subskill
    with security.db.transaction() as conn:
        version = conn.execute('SELECT v.* FROM activity_versions v JOIN activity_sessions s ON s.activity_version_id=v.id WHERE s.id=?', (session['id'],)).fetchone()
        spec = ActivitySpec.model_validate_json(version['spec_json'])
        capabilities.validate_activity(spec, get_subskill(conn, spec.subskillId))
    canonical = json.dumps(spec.model_dump(), ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    if hashlib.sha256(canonical.encode()).hexdigest() != version['spec_sha256'] or version['origin'] != 'model_generated':
        raise VerificationFailure('play_activity', 'original_definition_not_persisted')
    # Only original synthetic composed content, outside the repository/private
    # family database, is retained for optional renderer inspection.
    import tempfile
    Path(tempfile.gettempdir(), f'sidekick-composed-live-{version["spec_sha256"][:16]}.json').write_text(canonical+'\n')
    actions, connections = [], 0
    source_rectangles = {}
    for index, scene in enumerate(spec.scenes):
        current = session['currentScene']
        if not current or current['id'] != scene.id or session['sceneIndex'] != index:
            raise VerificationFailure('play_activity', 'unexpected_scene')
        if keys(current) & {'answer', 'expectedMarks', 'expectedCounts', 'acceptedTexts', 'mathRule', 'rubric'}:
            raise VerificationFailure('play_activity', 'private_key_exposed')
        mode = current['params'].get('mode')
        if scene.phase == 'guided':
            actions.append(scene.component + (':' + mode if mode else ''))
        connection = getattr(scene, 'connection', None)
        if connection:
            connections += 1
            expected = source_rectangles.get(connection.sourceSceneId)
            if expected and (current['params']['area']['rows'],current['params']['area']['columns']) != expected:
                raise VerificationFailure('linked_state', 'prior_action_not_applied')
        path = f"/api/activities/kid/sessions/{session['id']}"
        if scene.phase == 'independent':
            if session['hint'] or session['feedback'] or current['params'].get('teachingText'):
                raise VerificationFailure('independent_challenge', 'teaching_cues_present')
            if mode == 'area_expression' and current['params']['area'].get('targetArea') is not None:
                raise VerificationFailure('independent_challenge', 'computed_area_exposed')
            csrf = request_json(client, 'GET', '/api/auth/csrf', stage='csrf').json()['csrfToken']
            denied = client.post(path+'/hint', json={'sceneId': scene.id},
                headers={'Origin':'http://testserver','X-CSRF-Token':csrf})
            if denied.status_code != 409:
                raise VerificationFailure('independent_challenge', 'hint_allowed')
        artifact = response(client, session['id'], scene, current)
        if mode == 'area_design':
            source_rectangles[scene.id] = (artifact['marks'][0]['y'],artifact['marks'][0]['x'])
        elif mode == 'area_tile':
            source_rectangles[scene.id] = (current['params']['area']['rows'],current['params']['area']['columns'])
        body = dict(sceneId=scene.id, idempotencyKey=secrets.token_hex(16), response=artifact)
        session = request_json(client, 'POST', path+'/submit', stage='submit_activity', json=body).json()
        replay = request_json(client, 'POST', path+'/submit', stage='retry_submit', json=body).json()
        resumed = request_json(client, 'GET', path, stage='resume_activity').json()
        if session != replay or session != resumed:
            raise VerificationFailure('resume_activity', 'saved_state_changed')
        if scene.phase == 'guided':
            expected = None if getattr(scene.answer,'assessment',None) == 'parent_review' else True
            if session['feedback']['correct'] is not expected:
                raise VerificationFailure('play_activity', 'server_grade_disagrees')
            session = request_json(client, 'POST', path+'/next', stage='advance_activity',
                json=dict(sceneId=scene.id,idempotencyKey=secrets.token_hex(16))).json()
    if session['status'] != 'completed' or not session['finalResult']:
        raise VerificationFailure('complete_activity', 'independent_result_missing')
    manual = getattr(spec.scenes[-1].answer,'assessment',None) == 'parent_review'
    if session['finalResult']['correct'] is not (None if manual else True):
        raise VerificationFailure('complete_activity', 'unexpected_assessment')
    return session, spec, version, actions, connections, manual


def verify_case(client, security, recorder, name):
    from backend.activities.coverage import for_subskill
    grade, fixture, expected_skill = CASES[name]
    password, pin = secrets.token_urlsafe(24), '0042'
    request_json(client,'POST','/api/auth/signup',stage='signup',json=dict(email=f'composition-{name}@example.test',password=password))
    request_json(client,'POST','/api/parent/pin/setup',stage='pin',json=dict(password=password,pin=pin,confirmPin=pin))
    request_json(client,'POST','/api/parent/pin/verify',stage='unlock',json=dict(pin=pin))
    child=request_json(client,'POST','/api/parent/profiles',stage='profile',json=dict(firstName='Synthetic',grade=grade,avatarKey='fox')).json()
    request_json(client,'POST','/api/session/kid',stage='child',json=dict(profileId=child['id']))
    photo=(ROOT/f'public/samples/{fixture}-work.png').read_bytes()
    upload=request_json(client,'POST','/api/extract',stage='upload_work',files={'file':('synthetic.png',photo,'image/png')})
    upload_id=upload.headers.get('X-Sidekick-Upload-Id')
    if not upload_id or upload.json().get('source')!='live':
        raise VerificationFailure('upload_work','live_upload_not_saved')
    deadline=time.monotonic()+180
    while True:
        suggestion=request_json(client,'GET','/api/activities/kid/suggestion',stage='suggest_activity',params=dict(uploadId=upload_id)).json()
        if suggestion['available']: break
        if suggestion.get('reason')!='analysis_pending' or time.monotonic()>deadline:
            raise VerificationFailure('suggest_activity',safe_code(suggestion.get('reason')))
        time.sleep(.5)
    skill=suggestion['targetSkill']['id']
    recorder.case_metadata=dict(subskillId=skill,activities=[])
    if expected_skill and skill!=expected_skill:
        raise VerificationFailure('suggest_activity','unexpected_catalog_target')
    results=[]
    for attempt in range(2 if name=='area' else 1):
        counts_before=dict(recorder.counts)
        try:
            started=request_json(client,'POST','/api/activities/kid/start',stage='compose_activity',
                json=dict(uploadId=upload_id,idempotencyKey=secrets.token_hex(16))).json()
        finally:
            with security.db.transaction() as conn:
                events=conn.execute("SELECT outcome,explanation FROM model_audits WHERE kid_id=? AND task='compose_activity_stage' ORDER BY created_at,rowid",(child['id'],)).fetchall()
            recorder.case_metadata['recoveryDiagnostics']=[dict(code=item['outcome'],details=json.loads(item['explanation'])) for item in events]
            if recorder.proposals or recorder.failed_proposals or recorder.repairs:
                import tempfile
                # Original synthetic generated content only; never a provider
                # body, uploaded worksheet, private account, or public log.
                Path(tempfile.gettempdir(),f'sidekick-composed-proposals-{name}.json').write_text(
                    json.dumps(dict(validProposals=recorder.proposals, failedProposals=recorder.failed_proposals,
                                    repairedScenes=recorder.repairs),indent=2)+'\n')
        if recorder.counts.get('compose_activity',0)<=counts_before.get('compose_activity',0):
            raise VerificationFailure('compose_activity','finished_activity_reused')
        session,spec,version,actions,connections,manual=play(client,security,started)
        detail_path=f"/api/activities/parent/{child['id']}/sessions/{session['id']}"
        if client.get(detail_path).status_code!=403:
            raise VerificationFailure('parent_attempt','child_can_inspect_parent_attempt')
        request_json(client,'POST','/api/session/picker',stage='picker',json={})
        request_json(client,'POST','/api/parent/pin/verify',stage='history_unlock',json=dict(pin=pin))
        if manual:
            request_json(client,'POST',detail_path+'/review',stage='parent_review',json=dict(correct=False,
                note='Synthetic artifact deliberately reviewed as not meeting the generated goal.',
                parentObserved=True,idempotencyKey=secrets.token_hex(16)))
        history=request_json(client,'GET',f"/api/activities/parent/{child['id']}/history",stage='parent_history').json()['activities']
        result=next((entry for entry in history if entry['id']==session['id']),None)
        if not result or result['finalResult']['correct'] is not (False if manual else True):
            raise VerificationFailure('parent_history','independent_outcome_missing')
        details=request_json(client,'GET',detail_path,stage='parent_attempt').json()
        if len(details['scenes'])!=len(spec.scenes) or not all(scene['responses'] for scene in details['scenes']):
            raise VerificationFailure('parent_attempt','exact_attempt_missing')
        results.append(dict(case=name+('_'+str(attempt+1) if name=='area' else ''),subskillId=skill,
            generatedValidated=True,playedScored=True,providerMode='live',assessment='parent_review' if manual else 'automatic',
            parentReviewed=manual,outcome='incorrect' if manual else 'correct',specSha256=version['spec_sha256'],
            guidedActions=actions,connectedScenes=connections,liveUpload=True,noFinishedActivityReuse=True,
            refreshResumed=True,parentPinProtectedHistory=True,exactAttemptReview=True,success=True))
        recorder.case_metadata['activities']=list(results)
        if attempt==0 and name=='area':
            request_json(client,'POST','/api/session/kid',stage='second_activity',json=dict(profileId=child['id']))
    if name=='area':
        first,second=results
        def construction(item):
            return next((action for action in item['guidedActions'] if action in {'math_workspace:area_tile','math_workspace:area_design'}),None)
        if not construction(first) or not construction(second) or construction(first)==construction(second):
            raise VerificationFailure('activity_variety','same_child_action_repeated')
        if not all(item['connectedScenes'] for item in results):
            raise VerificationFailure('linked_state','area_expression_not_connected')
    return dict(case=name,success=True,activities=results,subskillId=skill,family=for_subskill(skill)['family'],
        recoveryDiagnostics=recorder.case_metadata.get('recoveryDiagnostics',[]))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--live',action='store_true',required=True)
    parser.add_argument('--case',choices=['all',*CASES],default='all')
    parser.add_argument('--report',type=Path,default=ROOT/'data/activities/composition_live_verification.json')
    args=parser.parse_args()
    from backend.activities.coverage import MAP_PATH,file_sha
    from backend.activities.models import COMPONENT_VERSION,PROMPT_VERSION
    logging.disable(logging.CRITICAL)
    started=time.monotonic()
    report=dict(command='npm run activities:verify:composition:live',checkedAt=datetime.now(timezone.utc).isoformat(),
        coverageMapSha256=file_sha(MAP_PATH),componentVersion=COMPONENT_VERSION,promptVersion=PROMPT_VERSION,success=False)
    try:
        run_isolated(report,list(CASES) if args.case=='all' else [args.case],case_runner=verify_case,empty_library=True)
    except VerificationFailure as error:
        report.update(failedStage=error.stage,errorCode=error.code)
    except Exception:
        report.update(failedStage='configuration_or_unexpected_failure',errorCode='verification_failed')
    # Coverage consumes individual completed definitions, including two for area.
    report['caseGroups']=report.get('cases',[])
    report['cases']=[item for group in report['caseGroups'] for item in group.get('activities',[])]
    report['elapsedSeconds']=round(time.monotonic()-started,2)
    args.report.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2),flush=True)
    return 0 if report['success'] else 1


if __name__=='__main__':
    raise SystemExit(main())
