"""Transport recovery retains only bounded activity drafts and safe diagnostics."""
import asyncio
import json

import httpx
import pytest
from pydantic import BaseModel, ConfigDict

from backend.gap.vision import structured_call
from backend.provider import ExtractionError, VisionSettings
from backend.tests.test_general_activity_service import family, mapped_upload, uid


class Scene(BaseModel):
    model_config = ConfigDict(extra='forbid')
    width: int


class Draft(BaseModel):
    scenes: list[Scene]


def transport(monkeypatch, content, *, finish='stop'):
    original = httpx.AsyncClient
    def handler(request):
        return httpx.Response(200, json={'choices': [{'finish_reason': finish,
            'message': {'content': json.dumps(content)}}]})
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **kwargs: original(
        transport=httpx.MockTransport(handler), **kwargs))


def invoke(task):
    return asyncio.run(structured_call(Draft, task=task, system='Synthetic task.', user={},
        settings=VisionSettings('synthetic-secret', 'synthetic-model', 'https://vision.example.test/v1', 5)))


def test_invalid_scene_retains_original_draft_for_internal_repair_only(monkeypatch, caplog):
    original = {'scenes': [{'width': 3}, {'width': 'private generated content'}]}
    transport(monkeypatch, original)
    with pytest.raises(ExtractionError) as captured:
        invoke('compose_activity')
    error = captured.value
    assert error._activity_candidate == original
    assert error.diagnostic == dict(stage='schema', code='schema_validation_failed',
                                    sceneIndex=1, field='scenes.1.width')
    assert 'private generated content' not in str(error)
    assert 'private generated content' not in caplog.text


def test_untrusted_extra_keys_cannot_enter_failure_diagnostics(monkeypatch):
    transport(monkeypatch, {'scenes': [{'width': 3, 'a-private-secret': 'private body'}]})
    with pytest.raises(ExtractionError) as captured:
        invoke('repair_activity_scene')
    assert captured.value.diagnostic['field'] == 'scenes.0'
    assert 'private' not in json.dumps(captured.value.diagnostic)


def test_extraction_and_grading_do_not_retain_document_or_student_content(monkeypatch):
    transport(monkeypatch, {'scenes': [{'width': 'private student content'}]})
    with pytest.raises(ExtractionError) as captured:
        invoke('worksheet_extraction')
    assert captured.value.code == 'invalid_extraction'
    assert captured.value._activity_candidate is None
    assert captured.value.diagnostic is None


def test_incomplete_provider_result_has_distinct_safe_reason_and_no_draft(monkeypatch):
    transport(monkeypatch, {'scenes': []}, finish='length')
    with pytest.raises(ExtractionError) as captured:
        invoke('compose_activity')
    assert captured.value.code == 'activity_provider_invalid'
    assert captured.value.diagnostic['stage'] == 'provider'
    assert captured.value._activity_candidate is None


def test_overall_composition_timeout_releases_retry_lease_and_records_safe_reason(family, security_context, monkeypatch):
    from backend import main
    from backend.activities import service
    from backend.tests.account_helpers import mutate
    child, client = family
    upload = mapped_upload(security_context, child, '3.OA.A.1-1')
    monkeypatch.setitem(main.app.state._state, 'activity_adapter', object())
    monkeypatch.setattr(service, 'COMPOSITION_TIMEOUT_SECONDS', .005)
    async def stalled(*args, **kwargs):
        await asyncio.sleep(10)
    monkeypatch.setattr(service, '_generate', stalled)
    body = dict(uploadId=upload, idempotencyKey=uid())
    for _ in range(2):
        response = mutate(client, 'POST', '/api/activities/kid/start', json=body)
        assert response.status_code == 503 and response.json()['error']['code'] == 'activity_unavailable'
    with security_context.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM activity_sessions').fetchone()[0] == 0
        request = conn.execute('SELECT lease_token,lease_until FROM activity_start_requests WHERE request_key=?',(body['idempotencyKey'],)).fetchone()
        assert request['lease_token'] is None and request['lease_until'] is None
        events = conn.execute("SELECT outcome,explanation FROM model_audits WHERE task='compose_activity_stage'").fetchall()
    assert len(events) == 2
    assert all(event['outcome'] == 'composition_timeout' and json.loads(event['explanation'])['category'] == 'provider' for event in events)
