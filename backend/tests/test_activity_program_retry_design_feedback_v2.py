"""Rejected generated design critique stays separate from student evidence."""
import copy
import json

import pytest

from backend import main
from backend.activity_engine_v2.context import TrustedContext, with_retry_design_feedback
from backend.activity_engine_v2.gameplay import GameplayReview
from backend.tests.test_activity_program_generation_v2 import BASE, Composer, family, post, prepare, upload


class RejectGameplay(Composer):
    async def call(self, response_model, task, system, data):
        result = await super().call(response_model, task, system, data)
        if response_model is GameplayReview:
            return result.model_copy(update=dict(approved=False, understandableConsequences=False,
                targetNecessary=False, reasonCode='target_detached',
                summary='The product acts as a password instead of changing the visible construction.'))
        return result


def failed_design(family, security, monkeypatch):
    child, client, adapter = family
    identifier = upload(security, child)
    monkeypatch.setitem(main.app.state._state, 'program_composition_adapter', RejectGameplay())
    failed = prepare(client, identifier, 'reject-gameplay')
    assert failed['status'] == 'failed' and failed['reasonCode'] == 'target_detached'
    monkeypatch.setitem(main.app.state._state, 'program_composition_adapter', adapter)
    with security.db.transaction() as connection:
        original = dict(connection.execute('SELECT * FROM activity_program_generations WHERE id=?',
                                          (failed['id'],)).fetchone())
    return identifier, failed, original


def test_explicit_owned_retry_pins_one_rejected_design_and_hash_bound_critique(family,security_context,monkeypatch):
    child, client, adapter = family
    identifier, failed, original = failed_design(family,security_context,monkeypatch)
    before = json.loads(original['context_json'])
    assert 'generatedDesignFeedback' not in before
    response = post(client,f"/generations/{failed['id']}/retry",dict(requestId='retry-causal-flaw'))
    assert response.status_code == 202
    retried = client.get(BASE+'/generations/'+response.json()['id']).json()
    assert retried['status'] == 'ready'
    planned = adapter.calls[0][1]['context']
    feedback, = planned['generatedDesignFeedback']
    assert feedback['source'] == 'rejected_generated_design' and feedback['notLearnerEvidence'] is True
    assert feedback['selectedDesign'] == json.loads(original['game_design_json'])
    assert feedback['stage'] == 'gameplay_review' and feedback['reasonCode'] == 'target_detached'
    failure = feedback['gameplayFailure']
    assert failure['failedChecks'] == ['understandableConsequences','targetNecessary']
    assert failure['summary'].startswith('The product acts as a password')
    assert failure['definitionHash'] == json.loads(original['review_json'])['definitionHash']
    assert failure['renderManifestHash'] == json.loads(original['gameplay_review_json'])['renderManifestHash']
    for field in ('targets','observations','misconceptions','history','previousSignatures'):
        assert planned[field] == before[field]
    assert planned['history'] == [] and planned['previousSignatures'] == []
    for forbidden in (identifier,child['id'],failed['id'],'PRIVATE_','secret@example.com'):
        assert forbidden not in json.dumps(feedback)
    assert 'generatedDesignFeedback' not in json.dumps(retried)
    calls = len(adapter.calls)
    # Recovery returns the existing pinned reservation; it cannot accumulate
    # feedback from arbitrary same-upload rows or rewrite an immutable context.
    assert post(client,f"/generations/{failed['id']}/retry",dict(requestId='refresh-retry')).json() == retried
    assert len(adapter.calls) == calls
    with security_context.db.transaction() as connection:
        pinned = connection.execute('SELECT context_json,private_sources_json FROM activity_program_generations WHERE id=?',
                                    (retried['id'],)).fetchone()
        assert json.loads(pinned['context_json']) == planned
        assert json.loads(pinned['private_sources_json'])['retryOfGenerationId'] == failed['id']
        assert connection.execute('SELECT context_json FROM activity_program_generations WHERE id=?',
                                  (failed['id'],)).fetchone()[0] == original['context_json']
        assert connection.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 0


def test_new_upload_request_does_not_collect_rejected_designs_without_explicit_retry(family,security_context,monkeypatch):
    _, client, adapter = family
    identifier, _, _ = failed_design(family,security_context,monkeypatch)
    ready = prepare(client,identifier,'fresh-create')
    assert ready['status'] == 'ready'
    assert all('generatedDesignFeedback' not in data['context'] for _,data in adapter.calls)


@pytest.mark.parametrize('mutation,includes_design,includes_review',[
    ('valid',True,True),('wrong-account',False,False),('wrong-child',False,False),
    ('wrong-upload',False,False),('wrong-targets',False,False),('ready',False,False),
    ('invalid-design',False,False),('manifest-mismatch',True,False),
    ('definition-mismatch',True,False),('malformed-review',True,False),
])
def test_retry_feedback_fail_closed_boundaries(family,security_context,monkeypatch,mutation,includes_design,includes_review):
    child, _, _ = family
    identifier, _, source = failed_design(family,security_context,monkeypatch)
    context = TrustedContext(json.loads(source['context_json']),{},json.loads(source['target_json']))
    previous = copy.deepcopy(context.sanitized)
    if mutation=='wrong-account':source['account_id']='foreign'
    elif mutation=='wrong-child':source['kid_id']='foreign'
    elif mutation=='wrong-upload':source['upload_id']='foreign'
    elif mutation=='wrong-targets':source['context_json']=json.dumps(dict(previous,targets=[]))
    elif mutation=='ready':source['status']='ready'
    elif mutation=='invalid-design':source['game_design_json']='{"not":"a design"}'
    elif mutation=='manifest-mismatch':source['render_manifest_json']='{}'
    elif mutation=='definition-mismatch':
        semantic=json.loads(source['review_json']);semantic['definitionHash']='f'*64
        source['review_json']=json.dumps(semantic)
    elif mutation=='malformed-review':source['gameplay_review_json']='{"approved":false}'
    actual = with_retry_design_feedback(context,source,account_id=source['account_id'] if mutation!='wrong-account' else 'real',
        kid_id=child['id'],upload_id=identifier)
    assert ('generatedDesignFeedback' in actual.sanitized) is includes_design
    if includes_design:
        feedback, = actual.sanitized['generatedDesignFeedback']
        assert ('gameplayFailure' in feedback) is includes_review
    assert context.sanitized == previous
