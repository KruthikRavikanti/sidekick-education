"""Independent admission-boundary probes using real owned transactions."""
import asyncio
from dataclasses import replace
import json

import pytest
from starlette.requests import Request

from backend.accounts.security import AccountError
from backend.activity_engine_v2 import composer, generation, service
from backend.tests.program_composition_examples import context_for, make_program
from backend.tests.test_activity_program_composer_v2 import Stub
from backend.tests.test_activity_program_generation_v2 import family, prepare, upload


def active_context(client, security):
    request=Request({'type':'http','headers':[(b'cookie',('sidekick_session='+client.cookies.get('sidekick_session')).encode())]})
    return security.session(request)


@pytest.mark.parametrize('change',[
    dict(targetNecessary=False), dict(scoringCorrectAcrossRoutes=False),
    dict(shortcutsPrevented=False), dict(requiresParentReview=True),
    dict(reasonCode='unsupported_concept'), dict(targetNecessary='false'),
])
def test_internal_start_cannot_accept_forged_true_approval_with_failed_or_untyped_review_gates(family,security_context,change):
    child,client,_=family
    original=make_program('design')
    approved=asyncio.run(composer.compose(context_for(original),adapter=Stub([original])))
    forged=replace(approved,review=approved.review.model_copy(update=change))
    active=active_context(client,security_context)
    with pytest.raises(AccountError) as captured:
        with security_context.db.transaction() as connection:
            service.start_approved(connection,security_context,child['id'],forged,active)
    assert captured.value.code=='approval_integrity_failed'
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0]==0


def test_provider_completion_after_source_deletion_does_not_publish_a_session(family,security_context):
    child,client,adapter=family
    source=upload(security_context,child)
    def remove_source():
        with security_context.db.transaction() as connection:
            connection.execute('DELETE FROM homework_uploads WHERE id=?',(source,))
        adapter.callback=None
    adapter.callback=remove_source
    # The owned source deletion cascades the reservation. Background completion
    # may fail privately, but cannot resurrect or expose the source/session.
    from backend.tests.test_activity_program_generation_v2 import post
    response=post(client,f'/uploads/{source}/generations',dict(requestId='deleted-source'))
    assert response.status_code==202
    result=client.get('/api/activity-programs/generations/'+response.json()['id'])
    assert result.status_code==404
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0]==0


def test_server_grounded_context_remains_private_during_alias_and_failed_retry(family,security_context):
    child,client,adapter=family
    source=upload(security_context,child,correctness='ungraded')
    adapter.failure=True
    failed=prepare(client,source,'one-request')
    same=prepare(client,source,'one-request')
    assert same==failed and failed['status']=='failed'
    text=json.dumps(same)
    for forbidden in ('context_json','private_sources','PRIVATE_','witness','definition_json'):
        assert forbidden not in text
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_generations').fetchone()[0]==1
        assert connection.execute('SELECT COUNT(*) FROM activity_program_generation_requests').fetchone()[0]==1


def test_an_internally_forged_observation_cannot_replace_the_owned_context_after_provider_work(family,security_context,monkeypatch):
    from backend.activity_engine_v2.models import Observation
    child,client,_=family
    source=upload(security_context,child,correctness='ungraded')
    original=make_program('design')
    approved=asyncio.run(composer.compose(context_for(original),adapter=Stub([original])))
    program=approved.program.model_copy(deep=True)
    program.intent.observations.append(Observation(id='invented',skillId=program.intent.targets[0].skillId,
        kind='incorrect_response',source='uploaded_work',confidence=1.0,summary='An unsupported incorrect response claim.'))
    digest=service._hash(program.model_dump())
    forged=replace(approved,program=program,definition_hash=digest,review=approved.review.model_copy(update=dict(definitionHash=digest)))
    async def replaced(*args,**kwargs):return forged
    monkeypatch.setattr(composer,'compose',replaced)
    view=prepare(client,source,'forged-internal-context')
    assert view['status']=='failed' and view['reasonCode']=='forged_learning_context'
    with security_context.db.transaction() as connection:
        assert connection.execute('SELECT COUNT(*) FROM activity_program_sessions').fetchone()[0]==0
