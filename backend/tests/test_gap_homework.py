"""Private upload checkpoints, conservative grading and scoped model payloads."""
import asyncio
import io
import json
from pathlib import Path

import pytest
from PIL import Image, ImageDraw

from backend.accounts.security import AccountError, SessionRecord
from backend.gap.catalog import seed_catalog
from backend.gap.grading import grade_homework, grade_spec, rational
from backend.gap.homework import authorized_file, delete_upload, persist_ingest, resume_upload, upload_view
from backend.gap.homework_models import GradeDecision, MappingDecision, SignatureDecision, TeacherMark, TeacherMarks
from backend.gap.storage import file_path, mask_header, prepare_pages, private_refs_for_child
from backend.gap.vision import VisionAdapter, redact
from backend.models import Extraction
from backend.provider import ExtractionError
from backend.tests.account_helpers import create_child, mutate, select_child, unlock

ROOT=Path(__file__).resolve().parents[2]


def field(text=None,uncertain=False):
    return {"text":text,"uncertain":uncertain}


def problem(question="Compute 3 + 4.",answer="8",identifier="1",status="answered"):
    return {"id":identifier,"label":field(identifier),"question":field(question),"answer_choices":[],"context_refs":[],"student_work":{"steps":[field("3 + 4 = 8")] if status == "answered" else [],"final_answer":field(answer,status == "unclear"),"selected_choice":field(),"status":status}}


def extraction(problems=None,subject="math",context=None):
    return Extraction.model_validate({"worksheet":{"title":field("Synthetic worksheet"),"subject":subject,"subject_uncertain":False,"printed_grade":field(),"directions":[],"shared_context":context or []},"problems":problems or [problem()]})


def image_bytes(label="worksheet"):
    image=Image.new("RGB",(600,800),"white")
    ImageDraw.Draw(image).text((30,120),label,fill="black")
    target=io.BytesIO(); image.save(target,format="PNG")
    return target.getvalue()


def session(security):
    with security.db.transaction() as conn:
        row=conn.execute("SELECT * FROM sessions WHERE revoked_at IS NULL ORDER BY created_at DESC LIMIT 1").fetchone()
    return SessionRecord(row['token_digest'],row['account_id'],row['mode'],row['active_kid_profile_id'],row['parent_expires_at'],row['version'])


class FakeAdapter:
    model="synthetic-stub"
    def __init__(self,*,fail_task=None,marks=None):
        self.calls={}; self.fail_task=fail_task; self.marks=marks or []; self.payloads=[]
    def call(self,task,payload):
        self.calls[task]=self.calls.get(task,0)+1
        self.payloads.append(payload)
        if self.fail_task == task:
            raise ExtractionError("provider_unavailable","Please retry.",503)
    async def observe_teacher_marks(self,image):
        self.call("marks",{"bytes":len(image)})
        return TeacherMarks(marks=self.marks)
    async def map_problem(self,problem,grade,candidates,context=None):
        self.call("map",{"problem":problem,"grade":grade,"candidates":candidates,"context":context})
        return MappingDecision(subskill_id=candidates[0]['subskill_id'],confidence=.95,explanation="Synthetic matching candidate.")
    async def grade_problem(self,problem,context,rubric=None):
        self.call("grade",{"problem":problem,"context":context})
        return GradeDecision(correctness="correct",source="model",confidence=.95,explanation="Supported by synthetic passage.")
    async def match_signature(self,problem,candidate,context=None):
        self.call("signature",{"problem":problem,"candidate":candidate,"context":context})
        return SignatureDecision(status="possible_slip",confidence=.9,explanation="Visible isolated arithmetic slip.")


@pytest.fixture
def homework_context(kid_client,security_context):
    seed_catalog(security_context.db,ROOT/'data/sidekick_skill_map_v2.json')
    active=session(security_context)
    return security_context,active.active_kid_profile_id,active


def ingest(context,adapter,*,data=None,extracted=None,key=None,extractor_override=None):
    security,kid_id,active=context
    async def extractor(_): return extracted or extraction()
    return asyncio.run(persist_ingest(security,kid_id,data or image_bytes(),"image/png",extractor=extractor_override or extractor,adapter=adapter,expected_session=active,idempotency_key=key))


def test_exact_math_preserves_wrong_blank_unreadable_and_equivalent_fraction():
    wrong=problem("1/2 + 1/3 = __","2/5")
    before=json.dumps(wrong,sort_keys=True)
    assert grade_homework(wrong).correctness == "incorrect"
    assert json.dumps(wrong,sort_keys=True) == before
    assert grade_homework(problem(answer=None,status="blank")).correctness == "ungraded"
    assert grade_homework(problem(answer=None,status="unclear")).correctness == "ungraded"
    assert grade_spec({"kind":"number","exactFraction":"1/2"},"4/8").correctness == "correct"
    assert grade_spec({"kind":"number","exactFraction":"1/2","representation":"decimal"},"4/8").correctness == "incorrect"
    assert grade_spec({"kind":"number","exactFraction":"3","unit":"cm"},"3").correctness == "ungraded"
    assert grade_spec({"kind":"number","exactFraction":"3","unit":"cm"},"3 cm").correctness == "correct"
    assert grade_homework(problem("Explain why the author is brave.","7")).correctness == "ungraded"
    assert rational("__import__('os').getcwd()") is None


def test_upload_is_opaque_verbatim_and_duplicate_reuses_all_calls(homework_context):
    adapter=FakeAdapter(); calls=[]
    async def extractor(_):
        calls.append(1); return extraction()
    first=ingest(homework_context,adapter,extractor_override=extractor,key="request-1")
    second=ingest(homework_context,adapter,extractor_override=extractor,key="request-1")
    assert first['id'] == second['id'] and first['state'] == 'completed'
    assert len(calls) == 1 and adapter.calls['map'] == 1
    assert first['extraction']['problems'][0]['student_work']['final_answer']['text'] == '8'
    assert first['problems'][0]['grading']['correctness'] == 'incorrect'
    security,kid_id,active=homework_context
    with security.db.transaction() as conn:
        row=conn.execute('SELECT * FROM homework_uploads WHERE id=?',(first['id'],)).fetchone()
        assert len(row['file_ref']) == 48 and 'worksheet' not in row['file_ref']
        assert conn.execute("SELECT COUNT(*) FROM learning_evidence WHERE kid_id=? AND eligible=1",(kid_id,)).fetchone()[0] == 1
    assert file_path(security,row['file_ref']).stat().st_mode & 0o777 == 0o600
    assert authorized_file(security,kid_id,first['id'],active)[0] == image_bytes()
    with pytest.raises(AccountError,match='idempotency_conflict'):
        ingest(homework_context,adapter,data=image_bytes('different'),key="request-1")


def test_failure_resume_reuses_extraction_grading_and_mapping(homework_context):
    adapter=FakeAdapter(fail_task='signature')
    calls=[]
    async def extractor(_): calls.append(1); return extraction()
    failed=ingest(homework_context,adapter,extractor_override=extractor)
    assert failed['state'] == 'failed'
    security,kid_id,active=homework_context
    with security.db.transaction() as conn:
        row=conn.execute('SELECT * FROM homework_uploads').fetchone()
        upload_id=row['id']; assert row['state'] == 'failed'
    adapter.fail_task=None
    result=asyncio.run(resume_upload(security,kid_id,upload_id,extractor=extractor,adapter=adapter,expected_session=active))
    assert result['state'] == 'completed' and result['retryCount'] == 1
    assert len(calls) == 1 and adapter.calls['map'] == 1 and adapter.calls['signature'] == 2
    with security.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 1


def test_same_question_in_another_upload_cannot_create_two_errors(homework_context):
    adapter=FakeAdapter()
    ingest(homework_context,adapter)
    ingest(homework_context,adapter,data=image_bytes('other photo'),extracted=extraction([problem(answer='9')]))
    security,kid_id,_=homework_context
    with security.db.transaction() as conn:
        rows=conn.execute('SELECT eligible FROM learning_evidence WHERE kid_id=? ORDER BY id',(kid_id,)).fetchall()
        assert [row[0] for row in rows] == [1,0]
        assert conn.execute('SELECT COUNT(*) FROM practice_assignments WHERE kid_id=?',(kid_id,)).fetchone()[0] == 0


def test_blank_unclear_and_teacher_conflict_never_wrong_evidence(homework_context):
    items=[problem(answer=None,status='blank'),problem(answer=None,status='unclear',identifier='2'),problem(identifier='3')]
    adapter=FakeAdapter(marks=[TeacherMark(problem_id='3',text='✓',uncertain=False,indicated_correctness='correct')])
    result=ingest(homework_context,adapter,extracted=extraction(items))
    assert [p['grading']['correctness'] for p in result['problems']] == ['ungraded','ungraded','incorrect']
    assert result['problems'][2]['teacherConflict'] is True
    security,kid_id,_=homework_context
    with security.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence WHERE eligible=1 AND kid_id=?',(kid_id,)).fetchone()[0] == 0


def test_profile_switch_and_deleted_child_during_processing_fail_closed(homework_context,kid_client):
    security,kid_id,active=homework_context
    async def switched(_):
        mutate(kid_client,'POST','/api/session/picker')
        return extraction()
    with pytest.raises(AccountError): ingest(homework_context,FakeAdapter(),extractor_override=switched)
    assert select_child(kid_client,kid_id).status_code == 200
    new_context=(security,kid_id,session(security))
    async def deleted(_):
        from backend.gap.storage import cleanup_references
        with security.db.transaction() as conn:
            refs=private_refs_for_child(conn,kid_id)
            conn.execute("UPDATE sessions SET mode='picker',active_kid_profile_id=NULL,version=version+1 WHERE active_kid_profile_id=?",(kid_id,))
            conn.execute('DELETE FROM kid_profiles WHERE id=?',(kid_id,))
        cleanup_references(security,refs)
        return extraction()
    with pytest.raises(AccountError): ingest(new_context,FakeAdapter(),data=image_bytes('deleted'),extractor_override=deleted)
    assert not list(file_path(security,'0'*48).parent.iterdir())
    with security.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM homework_uploads WHERE kid_id=?',(kid_id,)).fetchone()[0] == 0


def test_sibling_file_and_problem_access_is_denied(homework_context,kid_client):
    result=ingest(homework_context,FakeAdapter())
    security,kid_id,active=homework_context
    assert unlock(kid_client).status_code == 200
    sibling=create_child(kid_client,name='Sibling').json()
    assert select_child(kid_client,sibling['id']).status_code == 200
    other=session(security)
    with pytest.raises(AccountError): upload_view(security,kid_id,result['id'],expected_session=other)
    with pytest.raises(AccountError): authorized_file(security,kid_id,result['id'],other)
    with pytest.raises(AccountError): upload_view(security,sibling['id'],result['id'],expected_session=other)


def test_parent_delete_removes_files_problems_evidence(homework_context,kid_client):
    result=ingest(homework_context,FakeAdapter())
    security,kid_id,_=homework_context
    with security.db.transaction() as conn:
        refs=private_refs_for_child(conn,kid_id)
    assert unlock(kid_client).status_code == 200
    assert delete_upload(security,kid_id,result['id'],session(security)) == {'ok':True}
    assert all(not file_path(security,reference).exists() for reference in refs)
    with security.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM homework_problems').fetchone()[0] == 0
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 0


def test_private_text_redacted_and_header_masked(homework_context):
    adapter=FakeAdapter()
    extracted=extraction([problem('Alex: Compute 3 + 4. Email parent@example.com','8')])
    ingest(homework_context,adapter,extracted=extracted)
    assert 'Alex' not in json.dumps(adapter.payloads) and 'parent@example.com' not in json.dumps(adapter.payloads)
    assert redact({'email':'secret@example.com','question':'Alex knows Ada'},['Alex']) == {'question':'[redacted] knows Ada'}
    image=Image.new('RGB',(100,100),'black'); target=io.BytesIO(); image.save(target,format='PNG')
    with Image.open(io.BytesIO(mask_header(target.getvalue()))) as masked:
        assert masked.getpixel((20,1)) == (255,255,255)
        assert masked.getpixel((20,30)) == (0,0,0)


def test_invalid_images_and_bounded_ordered_pdfs(monkeypatch):
    with pytest.raises(ExtractionError): prepare_pages(b'bad','image/png')
    with pytest.raises(ExtractionError): prepare_pages(b'%PDF-bad','application/pdf')
    import pymupdf
    document=pymupdf.open()
    for text in ['first','second']:
        page=document.new_page(width=200,height=300); page.insert_text((30,90),text)
    data=document.tobytes(); document.close()
    pages=prepare_pages(data,'application/pdf')
    assert len(pages) == 2 and pages[0] != pages[1]
    monkeypatch.setenv('SIDEKICK_MAX_PDF_PAGES','1')
    with pytest.raises(ExtractionError,match='pdf_page_limit'): prepare_pages(data,'application/pdf')
    monkeypatch.setenv('SIDEKICK_MAX_PDF_PAGES','6')
    document=pymupdf.open(); document.new_page()
    encrypted=document.tobytes(encryption=pymupdf.PDF_ENCRYPT_AES_256,owner_pw='owner',user_pw='secret')
    document.close()
    with pytest.raises(ExtractionError,match='encrypted_pdf'): prepare_pages(encrypted,'application/pdf')


def test_no_adapter_stores_transcription_without_fabricated_evidence(homework_context):
    result=ingest(homework_context,False)
    assert result['state'] == 'pending' and result['stage'] == 'analysis_pending'
    assert result['extraction']['problems'][0]['student_work']['final_answer']['text'] == '8'
    security,_,_=homework_context
    with security.db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence').fetchone()[0] == 0


def test_pdf_worker_timeout_is_terminated_without_native_execution(monkeypatch):
    import backend.gap.storage as storage
    class Pipe:
        def poll(self,timeout): return False
        def close(self): pass
    class Worker:
        terminated=False
        def start(self): pass
        def is_alive(self): return not self.terminated
        def terminate(self): self.terminated=True
        def join(self,timeout=None): pass
        def kill(self): self.terminated=True
    worker=Worker()
    class Context:
        def Pipe(self,duplex=False): return Pipe(),Pipe()
        def Process(self,**kwargs): return worker
    monkeypatch.setattr(storage.multiprocessing,'get_context',lambda _:Context())
    with pytest.raises(ExtractionError,match='pdf_timeout'):
        storage._render_pdf_isolated(b'%PDF-synthetic',(6,24_000_000,72_000_000,1024,2),2)
    assert worker.terminated


def test_safe_fraction_division_mixed_numbers_and_field_uncertainty():
    assert grade_homework(problem('4 ÷ 1/5 = ?','20')).correctness == 'correct'
    assert rational('-1 1/2') == rational('-3/2')
    assert grade_homework(problem('4/1/5 = ?','0.8')).correctness == 'ungraded'
    work=problem('1/2 + 1/3 = __','5/6')
    work['student_work']['steps']=[field('1/[unreadable]',True)]
    assert grade_homework(work).correctness == 'correct'


def test_multipart_api_parent_child_sibling_csrf_and_provider_retry(homework_context,kid_client,client_factory,monkeypatch):
    from backend import main
    import backend.gap.uploads as uploads
    security,kid_id,_=homework_context
    adapter=FakeAdapter(fail_task='signature')
    monkeypatch.setitem(main.app.state._state,'gap_adapter',adapter)
    monkeypatch.setenv('SIDEKICK_FIXTURE_MODE','false')
    async def reader(_): return extraction()
    monkeypatch.setattr(uploads,'extract_with_vision',reader)
    files={'file':('worksheet.png',image_bytes(),'image/png')}
    posted=mutate(kid_client,'POST','/api/learning/kid/uploads',files=files)
    assert posted.status_code == 200,posted.text
    data=posted.json(); assert data['state'] == 'pending' and data['extraction'] is None and 'problems' not in data
    upload_id=data['id']
    after=kid_client.get(f'/api/learning/kid/uploads/{upload_id}').json()
    assert after['state'] == 'failed' and after['extraction']
    assert kid_client.get(f'/api/learning/kid/uploads/{upload_id}/file').content == image_bytes()
    adapter.fail_task=None
    retried=mutate(kid_client,'POST',f'/api/learning/kid/uploads/{upload_id}/retry')
    assert retried.status_code == 200
    assert kid_client.get(f'/api/learning/kid/uploads/{upload_id}').json()['state'] == 'completed'
    assert adapter.calls['map'] == 1
    # Mutations cannot bypass CSRF even with an existing signed-in session.
    rejected=kid_client.post('/api/learning/kid/uploads',files=files,headers={'X-CSRF-Token':'invalid','Origin':'http://testserver'})
    assert rejected.status_code == 403
    assert mutate(kid_client,'POST','/api/learning/kid/uploads',files={'file':('bad.txt',b'invalid','text/plain')}).status_code == 415
    assert mutate(kid_client,'POST','/api/learning/kid/uploads',files={'file':('bad.png',b'invalid','image/png')}).status_code == 400
    assert unlock(kid_client).status_code == 200
    assert kid_client.get(f'/api/learning/parent/{kid_id}/uploads/{upload_id}').json()['problems'][0]['grading']['correctness'] == 'incorrect'
    sibling=create_child(kid_client,name='Robin').json()['id']
    assert kid_client.get(f'/api/learning/parent/{sibling}/uploads/{upload_id}').status_code == 404
    assert mutate(kid_client,'POST',f'/api/learning/parent/{sibling}/uploads',files={'file':('other.png',image_bytes('sibling'),'image/png')}).status_code == 200
    assert select_child(kid_client,sibling).status_code == 200
    assert kid_client.get(f'/api/learning/kid/uploads/{upload_id}').status_code == 404
    assert kid_client.get(f'/api/learning/parent/{kid_id}/uploads/{upload_id}').status_code == 403
    other=client_factory()
    from backend.tests.account_helpers import signup,setup_pin
    signup(other,email='separate@example.com');setup_pin(other);unlock(other)
    assert other.get(f'/api/learning/parent/{kid_id}/uploads/{upload_id}').status_code == 404


def test_ela_context_blank_unreadable_and_uncertain_never_model_graded(homework_context):
    context=[{'id':'passage','type':'passage','title':field('Synthetic passage'),'content':field('The character carried an umbrella because it was raining.')}]
    items=[problem('Why did the character carry an umbrella?','It was raining.'),problem('Why did the character carry an umbrella?',None,'2','blank'),problem('Why did the character carry an umbrella?',None,'3','unclear')]
    for item in items: item['context_refs']=['passage']
    adapter=FakeAdapter()
    result=ingest(homework_context,adapter,extracted=extraction(items,'ela',context))
    assert [item['grading']['correctness'] for item in result['problems']] == ['correct','ungraded','ungraded']
    assert adapter.calls['grade'] == 1
    assert result['extraction']['worksheet']['shared_context'] == context


def test_upload_limits_authenticated_and_configurable(kid_client,monkeypatch,raw_client):
    monkeypatch.setenv('SIDEKICK_MAX_UPLOAD_MB','7')
    monkeypatch.setenv('SIDEKICK_MAX_PDF_PAGES','3')
    assert kid_client.get('/api/learning/upload-limits').json() == {'maxBytes':7*1024*1024,'maxPages':3}


def test_mapping_outside_candidates_or_below_threshold_abstains(homework_context):
    class InvalidMapper(FakeAdapter):
        async def map_problem(self,problem,grade,candidates,context=None):
            return MappingDecision(subskill_id='foreign-subskill',confidence=1,explanation='Invalid invented identifier.')
    invalid=ingest(homework_context,InvalidMapper())
    assert invalid['problems'][0]['mapping']['subskill_id'] is None
    class LowMapper(FakeAdapter):
        async def map_problem(self,problem,grade,candidates,context=None):
            return MappingDecision(subskill_id=candidates[0]['subskill_id'],confidence=.59,explanation='Weak initial routing score.')
    low=ingest(homework_context,LowMapper(),data=image_bytes('low score'))
    assert low['problems'][0]['mapping']['subskill_id'] is None
    with homework_context[0].db.transaction() as conn:
        assert conn.execute('SELECT COUNT(*) FROM learning_evidence WHERE eligible=1').fetchone()[0] == 0


def test_generated_choice_is_complete_and_solver_does_not_receive_answer():
    from backend.gap.homework_models import GeneratedContext,GeneratedItem,GeneratedItems,SolverDecision
    adapter=VisionAdapter()
    payloads=[]
    async def call(model,task,instruction,data):
        payloads.append((task,data))
        if task == 'generate_items':
            return GeneratedItems(items=[GeneratedItem(question='3 + 4 = ?',answer='right',answer_type='choice',options=[{'id':'wrong','text':'6'},{'id':'right','text':'7'}],context=GeneratedContext(passage=None,table=None,graphic_description=None),rubric=None,unit=None,representation='equivalent',adult_required=False)])
        return SolverDecision(answer='7',supported=True,context_grounded=False,aligned_subskill=True,difficulty_match=True,confidence=.99,explanation='Independent arithmetic.')
    adapter._call=call
    async def run():
        generated=await adapter.generate_items({'grade':'3','subject':'Math','check_mode':'Auto-checkable (one right answer)'},1)
        assert generated[0]['responseSpec']['options'] == [{'id':'wrong','label':'6'},{'id':'right','label':'7'}]
        assert generated[0]['gradingSpec']['correctOptionId'] == 'right'
        assert generated[0]['verified'] is False
        return await adapter.verify_item(generated[0] | {'targetSubskill':{'subskill':'Add whole numbers within 10','subject':'Math','grade':'1','p1_q':'2 + 3 = ?','p2_q':'3 + 5 = ?'}})
    verified=asyncio.run(run())
    assert verified.verified is True
    solver_payload=next(payload for task,payload in payloads if task == 'verify_item')
    assert set(solver_payload) == {'question','context','responseSpec','targetSubskill'}
    assert 'answer' not in solver_payload and 'gradingSpec' not in solver_payload


def test_two_model_agreement_cannot_verify_unsupported_or_wrong_math():
    from backend.gap.homework_models import SolverDecision
    adapter=VisionAdapter()
    async def call(*args):
        return SolverDecision(answer='8',supported=True,context_grounded=True,confidence=.99,explanation='Stub agreement is not proof.')
    adapter._call=call
    bad={'question':'3 + 4 = ?','answer':'8','context':{},'responseSpec':{'kind':'number'},'gradingSpec':{'kind':'number','exactFraction':'8'}}
    assert asyncio.run(adapter.verify_item(bad)).verified is False
    unsupported={'question':'Write a story about friendship.','answer':'8','context':{},'responseSpec':{'kind':'adult'},'gradingSpec':{'kind':'adult'}}
    assert asyncio.run(adapter.verify_item(unsupported)).verified is False


def test_evaluation_set_and_missing_credentials_are_actionable(monkeypatch,capsys):
    import backend.gap.evaluation as evaluation
    from backend.models import Worksheet
    cases=json.loads(evaluation.DEFAULT_SET.read_text())
    assert len(cases) >= 20 and {case['subject'] for case in cases} >= {'math','ela'}
    for case in cases:
        Extraction.model_validate({'worksheet':{'title':field(),'subject':case['subject'],'subject_uncertain':case['subject']=='unknown','printed_grade':field(),'directions':[],'shared_context':case['context']},'problems':[case['problem']]})
    monkeypatch.setattr('sys.argv',['evaluation','--live'])
    def missing(): raise ExtractionError('provider_not_configured','Missing credentials.',503)
    monkeypatch.setattr(evaluation.VisionSettings,'from_env',missing)
    with pytest.raises(SystemExit) as caught: evaluation.main()
    assert caught.value.code == 2
    assert 'VISION_API_KEY' in capsys.readouterr().err


def test_required_practice_unit_missing_is_incomplete_not_incorrect():
    from backend.gap.items import grade_response
    item={'gradingSpec':{'kind':'number','exactFraction':'3','unit':'cm','representation':'equivalent'}}
    assert grade_response(item,'3')['correctness'] == 'ungraded'
    assert grade_response(item,'3 cm')['correctness'] == 'correct'
    assert grade_response(item,'3 m')['correctness'] == 'incorrect'


def test_generated_language_substring_and_second_model_agreement_are_insufficient():
    from backend.gap.homework_models import SolverDecision
    adapter=VisionAdapter()
    async def call(*args):
        return SolverDecision(answer='cat',supported=True,context_grounded=True,confidence=.99,explanation='Model agreement alone.')
    adapter._call=call
    candidate={'question':'Who owns the cat?','answer':'cat','context':{'passages':[{'id':'p','text':'The child owns a cat.'}]},'responseSpec':{'kind':'short_text'},'gradingSpec':{'kind':'short_text','acceptedText':['cat']}}
    assert asyncio.run(adapter.verify_item(candidate)).verified is False


def test_stale_processing_retry_schedules_existing_checkpoint(homework_context,kid_client,monkeypatch):
    from backend import main
    import backend.gap.uploads as uploads
    security,kid_id,_=homework_context
    created=ingest(homework_context,False)
    with security.db.transaction() as conn:
        conn.execute("UPDATE homework_uploads SET state='processing',lease_token='interrupted',lease_until=? WHERE id=?",(security.clock.now()-1,created['id']))
    adapter=FakeAdapter()
    monkeypatch.setitem(main.app.state._state,'gap_adapter',adapter)
    async def must_not_read_again(_): raise AssertionError('Successful extraction must be reused.')
    monkeypatch.setattr(uploads,'extract_with_vision',must_not_read_again)
    result=mutate(kid_client,'POST',f"/api/learning/kid/uploads/{created['id']}/retry")
    assert result.status_code == 200
    completed=kid_client.get(f"/api/learning/kid/uploads/{created['id']}").json()
    assert completed['state'] == 'completed' and adapter.calls['map'] == 1


def test_duplicate_upload_reserves_each_idempotency_key(homework_context):
    first=ingest(homework_context,False,key='original')
    aliased=ingest(homework_context,False,key='alias')
    assert aliased['id'] == first['id']
    other=image_bytes('other existing upload')
    ingest(homework_context,False,data=other,key='other')
    with pytest.raises(AccountError,match='idempotency_conflict'):
        ingest(homework_context,False,data=other,key='alias')


@pytest.mark.parametrize('subject',['math','ela'])
def test_original_synthetic_fraction_and_ela_worksheets_pipeline(homework_context,subject):
    worksheet=Extraction.model_validate_json((ROOT/f'fixtures/{subject}.json').read_text())
    class WorksheetAdapter(FakeAdapter):
        async def grade_problem(self,problem,context,rubric=None):
            self.call('grade',{'problem':problem,'context':context})
            wrong='winter' in (problem['student_work']['final_answer'].get('text') or '')
            return GradeDecision(correctness='incorrect' if wrong else 'correct',source='model',confidence=.98,explanation='Synthetic known passage supports the expected season and flower.')
    result=ingest(homework_context,WorksheetAdapter(),extracted=worksheet,data=image_bytes(f'{subject} synthetic worksheet'))
    assert result['state'] == 'completed'
    assert result['extraction']['worksheet'] == worksheet.worksheet.model_dump()
    assert result['extraction']['problems'] == [problem.model_dump() for problem in worksheet.problems]
    assert [problem['grading']['correctness'] for problem in result['problems'][:3]] == ['incorrect','ungraded','ungraded']
    assert result['problems'][0]['extracted']['student_work']['final_answer']['text'] == ('2/5' if subject == 'math' else 'The story happens in winter.')
    assert result['problems'][1]['extracted']['student_work']['status'] == 'blank'
    assert result['problems'][2]['extracted']['student_work']['status'] == 'unclear'


def test_generated_decimal_verification_preserves_proposed_representation():
    from backend.gap.items import compile_practice_item
    from backend.gap.homework_models import SolverDecision
    adapter=VisionAdapter()
    async def call(*args):
        return SolverDecision(answer='0.5',supported=True,context_grounded=False,aligned_subskill=True,difficulty_match=True,confidence=.99,explanation='Independent arithmetic.')
    adapter._call=call
    item=compile_practice_item(question='1/4 + 1/4 = ?',answer='0.5',answer_type='Number',check_mode='Auto-checkable (one right answer)').model_dump()
    item['gradingSpec']['representation']='decimal'
    item['targetSubskill']={'subskill':'Add fractions with like denominators','subject':'Math','grade':'4','p1_q':'1/4 + 2/4 = ?','p2_q':'2/5 + 1/5 = ?'}
    assert asyncio.run(adapter.verify_item(item)).verified is True


@pytest.mark.parametrize('answer,correctness',[('mice; leaves; stories','correct'),('mouses; leafs; stories','incorrect')])
def test_self_contained_plural_noun_task_does_not_require_story_passage(answer,correctness):
    from backend.gap.grading import language_task_supported
    from backend.gap.homework import grade_content
    item=problem('One mouse, two ___. One leaf, two ___. One story, two ___.',answer)
    assert language_task_supported(item,[]) is True
    adapter=VisionAdapter()
    async def call(*args):
        return GradeDecision(correctness=correctness,source='model',confidence=.99,explanation='Self-contained plural noun task.')
    adapter._call=call
    assert asyncio.run(grade_content(item,[],'ela',adapter)).correctness == correctness


@pytest.mark.parametrize('directions,answer,correctness',[
    ('Give answers as decimals.','1/2','incorrect'),
    ('Give answers as decimals.','0.5','correct'),
    ('Give answers as fractions in simplest form.','2/4','incorrect'),
    ('Give answers as fractions in simplest form.','1/2','correct'),
    ('Give answers as integers.','2.0','incorrect'),
    ('Round to the nearest whole number.','1','ungraded'),
])
def test_worksheet_directions_preserve_required_representation(directions,answer,correctness):
    context=[{'id':'sidekick:worksheet-directions','type':'other','title':field('Worksheet directions'),'content':field(directions)}]
    item=problem('1/4 + 1/4 = ?',answer)
    assert grade_homework(item,context).correctness == correctness


def test_pipeline_directions_are_analysis_only_and_uncertain_directions_abstain(homework_context):
    worksheet=extraction([problem('1/4 + 1/4 = ?','1/2')])
    from backend.models import TranscribedField
    worksheet.worksheet.directions=[TranscribedField(text='Give answers as decimals.',uncertain=False)]
    result=ingest(homework_context,FakeAdapter(),extracted=worksheet)
    assert result['problems'][0]['grading']['correctness'] == 'incorrect'
    assert result['extraction'] == worksheet.model_dump() | {'source':'live'}
    assert result['problems'][0]['extracted']['context_refs'] == []
    worksheet.worksheet.directions=[TranscribedField(text='Give answers as [unreadable].',uncertain=True)]
    uncertain=ingest(homework_context,FakeAdapter(),extracted=worksheet,data=image_bytes('uncertain directions'))
    assert uncertain['problems'][0]['grading']['correctness'] == 'ungraded'


def test_multivalue_grader_inherits_required_representation():
    spec={'kind':'number','expectedValues':[{'exactFraction':'1/2','unit':None}],'representation':'decimal'}
    assert grade_spec(spec,'1/2').correctness == 'incorrect'
    assert grade_spec(spec,'0.5').correctness == 'correct'


def test_written_fraction_division_expression_uses_fraction_bar_semantics():
    assert rational('4 ÷ 1/5') == 20
    assert grade_homework(problem('4 ÷ 1/5 = ?','4 ÷ 1/5')).correctness == 'correct'


def test_written_ambiguous_slash_chain_is_ungraded():
    assert rational('4/1/5') is None
    assert grade_homework(problem('4 ÷ 1/5 = ?','4/1/5')).correctness == 'ungraded'


@pytest.mark.parametrize('kind',['number','adult'])
def test_generated_items_cannot_switch_fraction_target_to_whole_number_addition(kind):
    from backend.gap.homework_models import SolverDecision
    adapter=VisionAdapter()
    async def call(*args):
        return SolverDecision(answer='7',supported=kind=='number',context_grounded=False,aligned_subskill=True,difficulty_match=True,confidence=.99,explanation='Stub alignment claim must be checked independently.')
    adapter._call=call
    item={'question':'3 + 4 = ?','answer':'7','responseSpec':{'kind':kind},'gradingSpec':{'kind':kind,'exactFraction':'7'},'context':{},'targetSubskill':{'subskill':'Add fractions with unlike denominators','subject':'Math','grade':'5','p1_q':'2/3 + 1/4 = ?','p2_q':'3/4 + 1/6 = ?'}}
    result=asyncio.run(adapter.verify_item(item))
    assert result.verified is False and result.aligned_subskill is False and result.difficulty_match is False


def test_private_storage_cannot_be_configured_inside_tracked_source(security_context,monkeypatch):
    from backend.gap.storage import private_root
    monkeypatch.setenv('SIDEKICK_PRIVATE_UPLOAD_DIR',str(ROOT/'data'/'private-worksheets'))
    with pytest.raises(ExtractionError,match='configuration_error'):
        private_root(security_context)
    assert not (ROOT/'data'/'private-worksheets').exists()
