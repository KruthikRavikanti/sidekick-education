"""Evaluation reports separate retrieval and outcomes without exposing content."""
import json

import pytest

from backend.gap import evaluation
from backend.provider import ExtractionError


def cases():
    return [
        {'id':'mapped-case','subject':'math','grade':'3','problem':{'question':{'text':'private question content'},'student_work':{'final_answer':{'text':'private answer content'}}},'expected':{'subskill_id':'skill-1','correctness':'correct','signature':'uncertain'}},
        {'id':'abstained-case','subject':'unknown','grade':'3','problem':{'question':{'text':'another private question'}},'expected':{'subskill_id':None,'correctness':'ungraded','signature':'uncertain'}},
    ]


@pytest.mark.asyncio
async def test_details_are_labels_only_and_do_not_change_aggregate_metrics(monkeypatch):
    examples=cases()
    monkeypatch.setattr(evaluation,'retrieve_candidates',lambda security,subject,grade,problem:[{'subskill_id':'skill-1'}] if subject == 'math' else [])
    calls=[]
    async def analyze(security,problem,subject,grade,context,adapter):
        calls.append(subject)
        return {'mapping':{'subskill_id':'skill-1' if subject == 'math' else None},'grading':{'correctness':'correct' if subject == 'math' else 'ungraded'},'signature':{'status':'uncertain'}}
    monkeypatch.setattr(evaluation,'analyze_content',analyze)
    report=await evaluation.evaluate(None,examples,object(),details=True)
    assert calls == ['math','unknown']
    assert report['mappingCoverage'] == .5 and report['acceptedMappingAccuracy'] == 1
    assert report['gradingAccuracy'] == 1 and report['providerFailures'] == 0
    assert report['candidateRecall'] == 1 and report['candidateExpectedCount'] == 1
    assert report['uniqueQuestionCount'] == 2
    assert report['cases'][0]['candidateRank'] == 1
    assert report['cases'][0]['actual'] == {'subskillId':'skill-1','correctness':'correct','signature':'uncertain'}
    assert 'private question' not in json.dumps(report) and 'private answer' not in json.dumps(report)


@pytest.mark.asyncio
async def test_provider_failure_reports_existing_stage_without_repeating_calls(monkeypatch):
    monkeypatch.setattr(evaluation,'retrieve_candidates',lambda *args:[{'subskill_id':'skill-1'}])
    calls=[]
    class Failed:
        async def map_problem(self,*args):
            calls.append('mapping')
            raise ExtractionError('provider_timeout','Private provider response must never appear.',504)
    async def analyze(security,problem,subject,grade,context,adapter):
        await adapter.map_problem(problem,grade,[])
    monkeypatch.setattr(evaluation,'analyze_content',analyze)
    report=await evaluation.evaluate(None,cases()[:1],Failed(),details=True)
    assert calls == ['mapping']
    assert report['providerFailures'] == 1 and report['gradingAccuracy'] == 0
    assert report['cases'][0]['actual'] is None
    assert report['cases'][0]['failure'] == {'stage':'mapping','code':'provider_timeout'}
    assert 'Private provider' not in json.dumps(report)


@pytest.mark.asyncio
async def test_details_remain_optional_and_legacy_summary_keys_remain(monkeypatch):
    monkeypatch.setattr(evaluation,'retrieve_candidates',lambda *args:[])
    async def analyze(*args):
        return {'mapping':{'subskill_id':None},'grading':{'correctness':'ungraded'},'signature':{'status':'uncertain'}}
    monkeypatch.setattr(evaluation,'analyze_content',analyze)
    report=await evaluation.evaluate(None,cases()[1:],object())
    assert 'cases' not in report
    assert report['candidateRecall'] is None
    assert {'examples','providerFailures','mappingCoverage','acceptedMappingAccuracy','gradingAccuracy','signatureEligibleIncorrectCount','signatureAccuracy'} <= report.keys()
