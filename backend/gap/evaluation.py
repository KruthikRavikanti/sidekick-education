"""Explicit live evaluation against synthetic homework; no student records or model payload logs."""
import argparse
import asyncio
import json
import sys
import tempfile
from pathlib import Path
from types import SimpleNamespace

from backend.accounts.database import Database
from backend.provider import ExtractionError, VisionSettings
from .catalog import seed_catalog
from .homework import analyze_content, retrieve_candidates
from .vision import VisionAdapter

ROOT=Path(__file__).resolve().parents[2]
DEFAULT_SET=ROOT/'data/evaluation_homework.json'


def candidate_report(security,cases):
    """Measure retrieval independently; this never calls a model."""
    expected_count=0
    retrieved_count=0
    ranks={}
    for case in cases:
        candidates=retrieve_candidates(security,case['subject'],case['grade'],case['problem'])
        ids=[candidate.get('subskill_id',candidate.get('id')) for candidate in candidates]
        expected=case['expected']['subskill_id']
        rank=ids.index(expected)+1 if expected is not None and expected in ids else None
        ranks[case['id']]=rank
        if expected is not None:
            expected_count+=1
            retrieved_count+=rank is not None
    return {
        'candidateRecall':round(retrieved_count/expected_count,4) if expected_count else None,
        'candidateExpectedCount':expected_count,
        'candidateRetrievedCount':retrieved_count,
        'uniqueQuestionCount':len({' '.join((case['problem'].get('question',{}).get('text') or '').casefold().split()) for case in cases}),
    },ranks


class _TrackedAdapter:
    """Observe the existing call boundary without adding or repeating model calls."""
    def __init__(self,adapter):
        self.adapter=adapter
        self.stage='analysis'

    def __getattr__(self,name):
        value=getattr(self.adapter,name)
        stage={'grade_problem':'grading','map_problem':'mapping','match_signature':'signature'}.get(name)
        if stage is None:
            return value
        async def tracked(*args,**kwargs):
            self.stage=stage
            return await value(*args,**kwargs)
        return tracked


async def evaluate(security,cases,adapter,*,details=False):
    retrieval,ranks=candidate_report(security,cases)
    outcomes=[]
    case_details=[]
    for case in cases:
        tracked=_TrackedAdapter(adapter)
        failure=None
        try:
            result=await analyze_content(security,case['problem'],case['subject'],case['grade'],case.get('context',[]),tracked)
            outcomes.append((case,result))
        except ExtractionError as error:
            # Synthetic example IDs and counts are safe; never emit prompt/response/error bodies.
            result=None
            outcomes.append((case,None))
            code=error.code if error.code in {'provider_unavailable','provider_timeout','invalid_extraction','provider_not_configured'} else 'analysis_failed'
            failure={'stage':tracked.stage,'code':code}
        if details:
            case_details.append({
                'id':case['id'],
                'candidateRank':ranks[case['id']],
                'expected':{'subskillId':case['expected']['subskill_id'],'correctness':case['expected']['correctness'],'signature':case['expected']['signature']},
                'actual':{'subskillId':result['mapping']['subskill_id'],'correctness':result['grading']['correctness'],'signature':result['signature']['status']} if result else None,
                'failure':failure,
            })
    accepted=[(case,result) for case,result in outcomes if result and result['mapping']['subskill_id']]
    eligible_signature=[(case,result) for case,result in outcomes if case['expected']['correctness'] == 'incorrect' and case['expected']['subskill_id']]
    total=len(outcomes)
    ratio=lambda correct,count: round(correct/count,4) if count else None
    report={'examples':total,'providerFailures':sum(result is None for _,result in outcomes),'mappingCoverage':ratio(len(accepted),total),'acceptedMappingAccuracy':ratio(sum(result['mapping']['subskill_id'] == case['expected']['subskill_id'] for case,result in accepted),len(accepted)),'gradingAccuracy':ratio(sum(bool(result and result['grading']['correctness'] == case['expected']['correctness']) for case,result in outcomes),total),'signatureEligibleIncorrectCount':len(eligible_signature),'signatureAccuracy':ratio(sum(bool(result and result['signature']['status'] == case['expected']['signature']) for case,result in eligible_signature),len(eligible_signature)),**retrieval}
    if details:
        report['cases']=case_details
    return report


def validate_cases(cases):
    from backend.models import Extraction
    if not isinstance(cases,list) or len(cases)<20 or len({case["id"] for case in cases}) != len(cases):
        raise ValueError("Evaluation requires at least20 uniquely identified synthetic examples")
    catalog={row["subskill_id"]:row for row in json.loads((ROOT/"data/sidekick_skill_map_v2.json").read_text())}
    for case in cases:
        if case["expected"]["subskill_id"] is not None and case["expected"]["subskill_id"] not in catalog:
            raise ValueError("Evaluation references an unknown catalog subskill")
        if case["expected"]["correctness"] not in {"correct","incorrect","ungraded"} or case["expected"]["signature"] not in {"matched","possible_slip","other","uncertain"}:
            raise ValueError("Evaluation has an invalid expected decision")
        Extraction.model_validate({"worksheet":{"title":{"text":None,"uncertain":False},"subject":case["subject"],"subject_uncertain":case["subject"] == "unknown","printed_grade":{"text":None,"uncertain":False},"directions":[],"shared_context":case.get("context",[])},"problems":[case["problem"]]})


def main():
    parser=argparse.ArgumentParser(description='Evaluate configured Sidekick provider on synthetic homework, with the production retrieval and decision pipeline.')
    parser.add_argument('--live',action='store_true',help='Explicitly allow configured provider calls (may incur provider charges).')
    parser.add_argument('--dataset',type=Path,default=DEFAULT_SET)
    parser.add_argument('--details',action='store_true',help='Include synthetic case IDs and expected/actual decision labels, never question or answer text.')
    args=parser.parse_args()
    cases=json.loads(args.dataset.read_text())
    validate_cases(cases)
    if not args.live:
        with tempfile.TemporaryDirectory(prefix='sidekick-evaluation-') as temporary:
            database=Database('sqlite:///'+str(Path(temporary)/'evaluation.sqlite3'))
            database.migrate(); seed_catalog(database,ROOT/'data/sidekick_skill_map_v2.json')
            retrieval,ranks=candidate_report(SimpleNamespace(db=database),cases)
        report={'examples':len(cases),'status':'dataset_validated','liveExtraction':'unverified','run':'python -m backend.gap.evaluation --live',**retrieval}
        if args.details:
            report['cases']=[{'id':case['id'],'candidateRank':ranks[case['id']],'expected':{'subskillId':case['expected']['subskill_id'],'correctness':case['expected']['correctness'],'signature':case['expected']['signature']},'actual':None,'failure':None} for case in cases]
        print(json.dumps(report,indent=2))
        return
    from dotenv import load_dotenv
    load_dotenv(ROOT/'backend/.env')
    try:
        settings=VisionSettings.from_env()
    except ExtractionError:
        print('Set VISION_API_KEY and VISION_MODEL in backend/.env (optional VISION_BASE_URL), then run python -m backend.gap.evaluation --live. No credentials were printed.',file=sys.stderr)
        raise SystemExit(2) from None
    with tempfile.TemporaryDirectory(prefix='sidekick-evaluation-') as temporary:
        database=Database('sqlite:///'+str(Path(temporary)/'evaluation.sqlite3'))
        database.migrate(); seed_catalog(database,ROOT/'data/sidekick_skill_map_v2.json')
        report=asyncio.run(evaluate(SimpleNamespace(db=database),cases,VisionAdapter(settings=settings),details=args.details))
    print(json.dumps(report,indent=2))


if __name__ == '__main__':
    main()
