"""Render-only re-review spends one remaining call and never plays child work."""
import asyncio
import copy
import json

import pytest
from starlette.requests import Request

from backend.activity_engine_v2 import gameplay, service
from backend.activity_engine_v2.gameplay import GameplayReview, canonical_hash
from backend.tests.gameplay_examples import gameplay_approval
from backend.tests.test_activity_program_generation_v2 import family, prepare, upload
from scripts import refresh_game_render_review as refresh
from scripts.prepare_activity_benchmark_verification import source_approval


class ReviewAdapter:
    model='explicit-render-review-stub'
    def __init__(self,*,reject=False,malformed=False,callback=None):
        self.metadata=[];self.calls=[];self.reject=reject;self.malformed=malformed;self.callback=callback
    async def call(self,model,task,system,data):
        assert model is GameplayReview and task=='review_activity_gameplay'
        self.calls.append(copy.deepcopy(data))
        self.metadata.append(dict(task=task,requestedModel=self.model,returnedModel='explicit-render-review-model',
            elapsedMs=0,rawBody='PRIVATE_PROVIDER_BODY_NEVER_LOGGED'))
        if self.callback:self.callback()
        if self.malformed:return {'raw':'PRIVATE_PROVIDER_BODY_NEVER_LOGGED'}
        if self.reject:return gameplay_approval(data,approved=False,renderedAffordancesSuitable=False,
            reasonCode='rendered_affordances_unsuitable',summary='Explicit synthetic rejection of overlapping rendered controls.')
        return gameplay_approval(data)


@pytest.fixture
def ready_case(family,security_context,monkeypatch):
    child,client,_=family
    view=prepare(client,upload(security_context,child))
    assert view['status']=='ready'
    cookie=client.cookies.get(security_context.settings.session_cookie)
    active=security_context.session(Request({'type':'http','headers':[(b'cookie',
        (security_context.settings.session_cookie+'='+cookie).encode())]}))
    with security_context.db.transaction() as connection:
        connection.execute('UPDATE activity_program_generations SET duration_ms=1000 WHERE id=?',(view['id'],))
        before=dict(connection.execute('SELECT * FROM activity_program_generations WHERE id=?',(view['id'],)).fetchone())
    original=gameplay.render_manifest
    def updated(program):
        value=original(program)
        value['renderer']['scope']+=' Explicit synthetic generic renderer revision.'
        return value
    monkeypatch.setattr(gameplay,'render_manifest',updated)
    monkeypatch.setattr(refresh,'render_manifest',updated)
    return view,active,before,original


def saved(security,identifier):
    with security.db.transaction() as connection:
        return dict(connection.execute('SELECT * FROM activity_program_generations WHERE id=?',(identifier,)).fetchone())


def test_one_approved_render_refresh_preserves_program_semantic_and_pristine_attempt(ready_case,security_context):
    view,active,before,_=ready_case;adapter=ReviewAdapter()
    result=asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],adapter=adapter))
    after=saved(security_context,view['id'])
    assert result['approved'] and result['providerCallMade'] and len(adapter.calls)==1
    assert after['status']=='ready' and after['call_count']==before['call_count']+1==6
    assert after['duration_ms']>=1000
    for key in ('session_id','review_json','approved_definition_sha256','context_json','game_design_json'):
        assert after[key]==before[key]
    history=json.loads(after['private_sources_json'])['renderReviewRevisions']
    assert len(history)==1 and history[0]['previousGameplayReview']==json.loads(before['gameplay_review_json'])
    assert history[0]['previousRenderManifest']==json.loads(before['render_manifest_json'])
    assert history[0]['newRenderManifestHash']==canonical_hash(json.loads(after['render_manifest_json']))
    assert 'PRIVATE_PROVIDER_BODY' not in after['model_calls_json']+after['private_sources_json']
    approved,snapshot,_=source_approval(security_context.db.path,dict(localUrl='http://localhost:3000/kid/activity-preview/'+view['sessionId'],
        definitionHash=before['approved_definition_sha256']))
    assert snapshot==dict(actionCount=0,revision=0)
    with security_context.db.transaction() as connection:
        clone=service.start_approved(connection,security_context,active.active_kid_profile_id,approved,active)
        assert clone['actionCount']==clone['revision']==0 and not clone['assistance']['received']
        assert connection.execute('SELECT COUNT(*) FROM activity_program_events').fetchone()[0]==0


@pytest.mark.parametrize('malformed',[False,True])
def test_rejected_or_invalid_review_fails_job_and_preserves_prior_receipt_privately(ready_case,security_context,malformed,caplog):
    view,active,before,_=ready_case;adapter=ReviewAdapter(reject=not malformed,malformed=malformed)
    result=asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],adapter=adapter))
    after=saved(security_context,view['id'])
    assert not result['approved'] and after['status']=='failed' and after['call_count']==6
    assert after['reason_code']==('gameplay_review_response_invalid' if malformed else 'rendered_affordances_unsuitable')
    assert after['review_json']==before['review_json']
    assert json.loads(after['private_sources_json'])['renderReviewRevisions'][0]['previousGameplayReview']['approved']
    assert 'PRIVATE_PROVIDER_BODY' not in caplog.text+after['model_calls_json']+after['private_sources_json']
    with pytest.raises(ValueError,match='owned_ready_approved_benchmark_required'):
        source_approval(security_context.db.path,dict(localUrl='http://localhost:3000/kid/activity-preview/'+view['sessionId'],
            definitionHash=before['approved_definition_sha256']))


@pytest.mark.parametrize('field,value,code',[
    ('call_count',8,'model_call_budget_exceeded'),('duration_ms',480000,'generation_deadline_exceeded')])
def test_refresh_respects_existing_hard_job_budget_before_call(ready_case,security_context,field,value,code):
    view,active,before,_=ready_case;adapter=ReviewAdapter()
    with security_context.db.transaction() as connection:
        connection.execute(f'UPDATE activity_program_generations SET {field}=? WHERE id=?',(value,view['id']))
    with pytest.raises(refresh.RenderReviewError,match=code):
        asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],adapter=adapter))
    assert adapter.calls==[]


def test_profile_change_during_provider_review_cannot_reapprove(ready_case,security_context):
    view,active,before,_=ready_case
    def changed():
        with security_context.db.transaction() as connection:
            connection.execute('UPDATE sessions SET version=version+1 WHERE token_digest=?',(active.token_digest,))
    result=asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],
        adapter=ReviewAdapter(callback=changed)))
    assert not result['approved'] and saved(security_context,view['id'])['status']=='failed'


def test_already_current_manifest_makes_no_provider_call(ready_case,security_context,monkeypatch):
    view,active,before,original=ready_case;adapter=ReviewAdapter()
    monkeypatch.setattr(refresh,'render_manifest',original)
    monkeypatch.setattr(gameplay,'render_manifest',original)
    result=asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],adapter=adapter))
    assert result['approved'] and result['reasonCode']=='already_current' and not adapter.calls
    assert saved(security_context,view['id'])==before


def test_tampered_previous_receipt_stops_before_provider(ready_case,security_context):
    view,active,before,_=ready_case;adapter=ReviewAdapter()
    with security_context.db.transaction() as connection:
        receipt=json.loads(before['gameplay_review_json']);receipt['renderManifestHash']='0'*64
        connection.execute('UPDATE activity_program_generations SET gameplay_review_json=? WHERE id=?',(json.dumps(receipt),view['id']))
    with pytest.raises(refresh.RenderReviewError,match='previous_render_approval_integrity_failed'):
        asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],adapter=adapter))
    assert not adapter.calls


def test_nonpristine_source_stops_before_provider(ready_case,security_context):
    view,active,before,_=ready_case;adapter=ReviewAdapter()
    with security_context.db.transaction() as connection:
        connection.execute('UPDATE activity_program_sessions SET revision=1 WHERE id=?',(view['sessionId'],))
    with pytest.raises(refresh.RenderReviewError,match='pristine_generation_required'):
        asyncio.run(refresh.refresh_review(security_context,active,view['id'],before['approved_definition_sha256'],adapter=adapter))
    assert not adapter.calls
