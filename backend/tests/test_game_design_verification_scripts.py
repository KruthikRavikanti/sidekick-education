"""A retry must never reuse another generation's successful browser evidence."""
import copy

from scripts.compose_game_design_case import clear_browser_evidence, clear_play_binding, replace_generation_binding


def test_new_generation_clears_all_derived_play_bindings_and_preserves_failed_audit():
    prior=[dict(stage='schema',reasonCode='first-failure')]
    record=dict(case='area',targetSkills=['3.MD.C.7-1'],priorFailures=prior,
        stage='gameplay_review',reasonCode='decorative_world',providerCalls=5,
        semanticReview=dict(approved=True),designEvaluations=[dict(candidate=dict(id='old-plan'))],
        title='Old world',definitionHash='a'*64,browserCompleted=True,pristineUrl='old-url',
        screenshots=['old.png'],recording='old.webm',futureProofField=dict(passed=True))
    job=dict(requestId='new-request',generationId='old-generation',sessionId='old-pristine',
        definitionHash='a'*64,rehearsalSessionId='old-rehearsal',playSessionId='old-play',
        publicPlan=[dict(actionId='old-action')],publicPlanDefinitionHash='a'*64)
    assert replace_generation_binding(job,record,'new-generation') is True
    assert job==dict(requestId='new-request',generationId='new-generation')
    assert set(record)=={'case','targetSkills','priorFailures'}
    assert len(record['priorFailures'])==2
    assert record['priorFailures'][0]['reasonCode']=='first-failure'
    assert record['priorFailures'][1]['semanticReview']['approved'] is True
    assert record['priorFailures'][1]['designEvaluations'][0]['candidate']['id']=='old-plan'
    assert 'screenshots' not in record['priorFailures'][1]


def test_idempotent_same_generation_preserves_exact_plan_and_does_not_duplicate_failure_audit():
    job=dict(requestId='same-request',generationId='same-generation',definitionHash='a'*64,
        sessionId='pristine',playSessionId='play',publicPlan=[dict(actionId='real-action')])
    record=dict(case='area',reasonCode='schema-failure',priorFailures=[],browserCompleted=False)
    original=copy.deepcopy((job,record))
    assert replace_generation_binding(job,record,'same-generation') is False
    assert (job,record)==original


def test_new_engineering_attempt_resets_all_proof_fields_but_retains_exact_generation_reviews():
    record=dict(case='math-route',definitionHash='a'*64,generated=True,
        requestedModel='synthetic',gameplayReview=dict(approved=True),priorFailures=[],
        browserCompleted=True,browserAssessment='automatic',refreshVerified=True,
        recording='old.webm',decisionTrace=[dict(visibleChange='old consequence')],
        evaluationUrl='old-evaluator',newUnrecognizedEvidenceField=True)
    clear_browser_evidence(record)
    assert record==dict(case='math-route',definitionHash='a'*64,generated=True,
        requestedModel='synthetic',gameplayReview=dict(approved=True),priorFailures=[])


def test_unbound_legacy_play_metadata_is_removed_before_binding_to_the_pinned_hash():
    job=dict(requestId='request',generationId='generation',sessionId='pristine',definitionHash='a'*64,
        rehearsalSessionId='unbound',playSessionId='unbound-play',publicPlan=[dict(actionId='unbound-action')])
    clear_play_binding(job)
    assert job==dict(requestId='request',generationId='generation',sessionId='pristine',definitionHash='a'*64)
