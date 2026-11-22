"""Task token ceilings and safe metering preserve the legacy transport contract."""
import asyncio
import json

import httpx
import pytest
from pydantic import BaseModel, ConfigDict

from backend.gap.vision import structured_call
from backend.provider import ExtractionError, VisionSettings


class Output(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    accepted: bool


def call(**kwargs):
    return asyncio.run(structured_call(Output, task='design_activity_game', system='Synthetic request.',
        settings=VisionSettings('private-test-key', 'test-model', 'https://model.example.test/v1', 5),
        **kwargs))


def test_bounded_game_call_sends_real_output_ceiling_and_only_numeric_usage(monkeypatch):
    captured = []
    original = httpx.AsyncClient
    def handler(request):
        captured.append(json.loads(request.content))
        return httpx.Response(200, json=dict(model='returned-model',
            usage=dict(prompt_tokens=120, completion_tokens=45, total_tokens=165,
                       private_text='private-provider-content'),
            choices=[dict(finish_reason='stop', message=dict(content='{"accepted":true}'))]))
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **kwargs: original(transport=httpx.MockTransport(handler), **kwargs))
    metadata = {}
    result = call(user={}, max_output_tokens=6500, metadata=metadata)
    assert result.accepted and captured[0]['max_completion_tokens'] == 6500
    assert metadata == dict(requestedModel='test-model', returnedModel='returned-model', maxOutputTokens=6500,
                            usage=dict(prompt_tokens=120, completion_tokens=45, total_tokens=165),
                            providerHttpStatus=200, finishReason='stop')
    assert 'private-test-key' not in json.dumps(captured)
    assert 'private-provider-content' not in json.dumps(metadata)


@pytest.mark.parametrize('limit', [0, -1, 24001, True, 1.5])
def test_invalid_cost_bound_never_calls_provider(monkeypatch, limit):
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **_: pytest.fail('Invalid limits reached provider'))
    with pytest.raises(ExtractionError) as error:
        call(user={}, max_output_tokens=limit)
    assert error.value.code == 'configuration_error'


def test_game_input_ceiling_rejects_before_network_without_echoing_content(monkeypatch, caplog):
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **_: pytest.fail('Oversized request reached provider'))
    with pytest.raises(ExtractionError) as error:
        call(user={'data': 'private-content-' * 40000}, max_output_tokens=6500)
    assert error.value.code == 'activity_input_budget_exceeded'
    assert 'private-content' not in str(error.value) + caplog.text


def test_legacy_call_omits_new_limit_and_metering_fields(monkeypatch):
    original = httpx.AsyncClient
    def handler(request):
        assert 'max_completion_tokens' not in json.loads(request.content)
        return httpx.Response(200, json=dict(model='returned-model', usage=dict(total_tokens=165),
            choices=[dict(finish_reason='stop', message=dict(content='{"accepted":true}'))]))
    monkeypatch.setattr(httpx, 'AsyncClient', lambda **kwargs: original(transport=httpx.MockTransport(handler), **kwargs))
    metadata = {}
    assert call(user={}, metadata=metadata).accepted
    assert metadata == dict(requestedModel='test-model', returnedModel='returned-model')
