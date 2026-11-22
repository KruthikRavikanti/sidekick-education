"""Reviewed development examples create private attempts for the active child."""
from dataclasses import replace
import json
import shutil

import pytest

from backend.activity_engine_v2 import benchmarks, preview, service
from backend.tests.account_helpers import create_child, mutate, select_child, setup_pin, signup, unlock

BASE='/api/activity-programs'


@pytest.fixture(autouse=True)
def enabled(monkeypatch):
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW','true')


def post(client,key,request_id='reviewed-start',**extra):
    version=client.get('/api/auth/session').json()['version']
    return mutate(client,'POST',BASE+f'/benchmarks/{key}/sessions',
        json=dict(requestId=request_id,**extra),headers={'X-Sidekick-Profile-Version':str(version)})


def rows(client):return client.get(BASE+'/benchmarks').json()['benchmarks']


def test_lists_only_reviewed_examples_without_fixtures_or_private_definitions(kid_client,security_context,monkeypatch):
    monkeypatch.setattr(preview,'load_preview',lambda *_:pytest.fail('Showcase loaded a fixture'))
    monkeypatch.setattr(service,'load_preview',lambda *_:pytest.fail('Showcase loaded a fixture'))
    response=kid_client.get(BASE+'/benchmarks')
    assert response.status_code==200,response.text
    examples=response.json()['benchmarks']
    assert [item['id'] for item in examples]==list(benchmarks.BENCHMARK_KEYS)
    assert [item['title'] for item in examples]==['Choose a Crossing','The Garden Walks','The Traveling Seed Report','Write What Comes Before']
    assert all(item['available'] and item['sessionId'] is None and item['status'] is None for item in examples)
    assert [item['subject'] for item in examples]==['math','math','ela','ela']
    assert all(item['definitionHash'] and item['skillIds'] and item['description'] for item in examples)
    for forbidden in ('witness','semanticReview','gameplayReview','renderManifest','definition_json','sourceRefs'):
        assert forbidden not in response.text
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_versions').fetchone()[0]==0
        assert connection.execute('SELECT COUNT(*) FROM activity_program_generations').fetchone()[0]==0


@pytest.mark.parametrize('key',benchmarks.BENCHMARK_KEYS)
def test_starts_owned_initial_state_and_discovers_latest_exact_hash(kid_client,security_context,key):
    response=post(kid_client,key)
    assert response.status_code==200,response.text
    initial=response.json()
    assert initial['actionCount']==initial['revision']==0 and initial['status']=='in_progress'
    assert initial['origin']=='ai_composed' and not initial['assistance']['received']
    assert kid_client.get(BASE+'/sessions/'+initial['id']).json()==initial
    item=next(item for item in rows(kid_client) if item['id']==key)
    assert item['sessionId']==initial['id'] and item['definitionHash']==initial['definitionHash']
    second=post(kid_client,key,'play-again').json()
    assert second['id']!=initial['id'] and second['definitionHash']==initial['definitionHash']
    assert next(item for item in rows(kid_client) if item['id']==key)['sessionId']==second['id']
    with security_context.db.transaction() as connection:
        for table in ('activity_program_events','learning_evidence','homework_uploads'):
            assert connection.execute('SELECT COUNT(*) FROM '+table).fetchone()[0]==0


def test_request_id_replay_and_conflict(kid_client,security_context):
    first=post(kid_client,'area-first','same-id').json()
    assert post(kid_client,'area-first','same-id').json()==first
    conflict=post(kid_client,'area-second','same-id')
    assert conflict.status_code==409 and conflict.json()['error']['code']=='request_id_conflict'
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0]==1


def test_other_account_starts_own_example_but_cannot_discover_read_or_write_first_attempt(kid_client,client_factory):
    first=post(kid_client,'ela-writing').json()
    other=client_factory()
    assert signup(other,'another-review-reader@example.com').status_code==201
    assert setup_pin(other).status_code==200 and unlock(other).status_code==200
    child=create_child(other).json()
    assert select_child(other,child['id']).status_code==200
    assert all(item['sessionId'] is None for item in rows(other))
    second=post(other,'ela-writing').json()
    assert second['id']!=first['id'] and second['definitionHash']==first['definitionHash']
    assert other.get(BASE+'/sessions/'+first['id']).status_code==404
    version=other.get('/api/auth/session').json()['version']
    forbidden=mutate(other,'POST',BASE+'/sessions/'+first['id']+'/actions',
        json=dict(requestId='stolen',expectedRevision=0,actionId='unknown',inputs={}),
        headers={'X-Sidekick-Profile-Version':str(version)})
    assert forbidden.status_code==404
    assert next(item for item in rows(other) if item['id']=='ela-writing')['sessionId']==second['id']
    assert next(item for item in rows(kid_client) if item['id']=='ela-writing')['sessionId']==first['id']


@pytest.fixture
def copied_catalog(tmp_path,monkeypatch):
    directory=tmp_path/'exports';directory.mkdir()
    for key in benchmarks.BENCHMARK_KEYS:
        for suffix in ('program','reviews'):
            shutil.copy2(benchmarks.EXPORT_DIRECTORY/f'{key}.{suffix}.json',directory/f'{key}.{suffix}.json')
    monkeypatch.setattr(benchmarks,'EXPORT_DIRECTORY',directory)
    return directory


@pytest.mark.parametrize('change',[
    'semantic-rejected','semantic-false-check','gameplay-rejected','wrong-hash','wrong-gameplay-hash',
    'corrupt-manifest','changed-program','source-reference','malformed-file',
])
def test_corrupt_definition_or_receipt_is_rejected_without_creating_attempt(kid_client,security_context,copied_catalog,change):
    key='ela-writing'
    program_path=copied_catalog/f'{key}.program.json';receipt_path=copied_catalog/f'{key}.reviews.json'
    program=json.loads(program_path.read_text());receipt=json.loads(receipt_path.read_text())
    if change=='semantic-rejected':receipt['semanticReview']['approved']=False
    elif change=='semantic-false-check':receipt['semanticReview']['targetNecessary']=False
    elif change=='gameplay-rejected':receipt['gameplayReview']['approved']=False
    elif change=='wrong-hash':receipt['definitionHash']='f'*64
    elif change=='wrong-gameplay-hash':receipt['gameplayReview']['definitionHash']='f'*64
    elif change=='corrupt-manifest':receipt['renderManifest']['renderer']['scope']='forged-render-description'
    elif change=='changed-program':program['title']='Unreviewed edited title'
    elif change=='source-reference':program['provenance']['sourceRefs']=['PRIVATE_UPLOAD_ID']
    program_path.write_text(json.dumps(program));receipt_path.write_text(json.dumps(receipt))
    if change=='malformed-file':receipt_path.write_text('{bad json')
    item=next(item for item in rows(kid_client) if item['id']==key)
    assert not item['available'] and item['reasonCode']=='benchmark_integrity_failed'
    assert item['definitionHash'] is None and item['sessionId'] is None
    rejected=post(kid_client,key)
    assert rejected.status_code==503 and rejected.json()['error']['code']=='benchmark_integrity_failed'
    assert 'PRIVATE_' not in rejected.text and str(copied_catalog) not in rejected.text
    with security_context.db.transaction() as connection:
        for table in ('activity_program_sessions','activity_program_start_requests'):
            assert connection.execute('SELECT COUNT(*) FROM '+table).fetchone()[0]==0


def test_whitelist_closed_body_auth_csrf_profile_and_preview_gate(kid_client,client_factory,security_context,monkeypatch):
    fresh=client_factory()
    assert fresh.get(BASE+'/benchmarks').status_code==401
    assert post(kid_client,'extra-opening-detective').status_code==404
    assert post(kid_client,'ela-writing',definition={'title':'forged'}).status_code==400
    version=kid_client.get('/api/auth/session').json()['version']
    assert kid_client.post(BASE+'/benchmarks/area-first/sessions',json=dict(requestId='no-version')).status_code==409
    stale=mutate(kid_client,'POST',BASE+'/benchmarks/area-first/sessions',json=dict(requestId='stale'),
        headers={'X-Sidekick-Profile-Version':str(version+1)})
    assert stale.status_code==409
    csrf_missing=kid_client.post(BASE+'/benchmarks/area-first/sessions',json=dict(requestId='no-csrf'),
        headers={'X-Sidekick-Profile-Version':str(version),'X-CSRF-Token':''})
    assert csrf_missing.status_code==403
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW','false')
    assert kid_client.get(BASE+'/benchmarks').status_code==404
    monkeypatch.setenv('SIDEKICK_ACTIVITY_V2_PREVIEW','true')
    monkeypatch.setattr(security_context,'settings',replace(security_context.settings,
        app_env='production',password_policy='strict',cookie_secure=True,trusted_origins=('https://localhost',)))
    # Production security can reject the old insecure test cookie before the
    # development route guard. Neither boundary may expose the catalog.
    assert kid_client.get(BASE+'/benchmarks').status_code in {401,404}
