"""Stub only model decisions, with real upload, authoring, admission and runtime."""
import asyncio
import copy

# Existing wrapper refuses application storage and retains real account/CSRF.
from activity_app import app
from backend.activity_engine_v2 import preview
from backend.activity_engine_v2.authoring import ActivityAuthoring, to_authoring
from backend.activity_engine_v2.composer import SemanticReview
from backend.tests.program_composition_examples import make_program


def unavailable_fixture(*args, **kwargs):
    raise AssertionError('Generated browser path read a finished fixture.')


preview.FIXTURE_PATHS.clear()
preview.load_preview = unavailable_fixture


class SyntheticComposer:
    model = 'explicit-synthetic-v2-composer'

    async def call(self, response_model, task, system, data):
        await asyncio.sleep(.3)  # Real progress/refresh is observable in the browser.
        if response_model is SemanticReview:
            parent = any(item['assessment']['kind'] == 'parent_review' for item in data['definition']['evidence'])
            return SemanticReview(definitionHash=data['definitionHash'], approved=True, targetNecessary=True,
                meaningfulConsequences=True, materialsSuitable=True, goalAchievable=True, helpRelevant=True,
                scoringCorrectAcrossRoutes=True, shortcutsPrevented=True, parentAssessmentAppropriate=True,
                requiresParentReview=parent, reasonCode='approved', summary='Explicit synthetic review of this exact candidate.')
        assert response_model is ActivityAuthoring
        context = data['context']
        skill = context['targets'][0]['skillId']
        kind = ('writing' if skill.startswith('W.') else 'reading' if context['subject'] == 'ela'
                else 'design' if context.get('previousSignatures') else 'tile')
        raw = make_program(kind).model_dump()
        raw['intent']['targets'] = copy.deepcopy(context['targets'])
        for evidence in raw['evidence']:
            evidence['skillIds'] = [target['skillId'] for target in context['targets']]
        return to_authoring(raw)


app.state.program_composition_adapter = SyntheticComposer()
