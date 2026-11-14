"""Isolated browser app: replace only model composition/review, never auth or APIs."""
import os
import tempfile
from pathlib import Path

database_url = os.getenv('DATABASE_URL', '')
database = Path(database_url.removeprefix('sqlite:///'))
if (os.getenv('APP_ENV') != 'test' or not database_url.startswith('sqlite:///')
        or not database.is_absolute() or not database.name.startswith('sidekick-e2e-')
        or database.is_symlink() or not database.is_file()
        or database.resolve().parent != Path(tempfile.gettempdir()).resolve()):
    raise RuntimeError('Browser adapters require an existing isolated test database.')

from backend.main import app
from backend.activities.models import ActivityReview, ActivitySpec


def example(subject, data):
    if subject == 'math':
        title = 'Explore Times as Many'
        lessons = [
            'To find several times as many, multiply the original amount by the number of equal groups.',
            'Five times as many means five equal groups of the original amount.',
        ]
        prompts = [
            'A shelf holds 5 books. A cart holds 3 times as many. Which expression finds the books on the cart?',
            'A bin holds 4 balls. A basket holds 5 times as many. How many balls are in the basket?',
            'A class has 7 red counters and 6 times as many blue counters. How many blue counters are there?',
        ]
        contexts = [None, None, None]
        options = [{'id': 'add', 'text': '5 + 3'}, {'id': 'multiply', 'text': '5 × 3'}]
        answers = [dict(value='multiply', acceptedAnswers=[], comparison='text'),
                   dict(value='20', acceptedAnswers=[], comparison='number'),
                   dict(value='42', acceptedAnswers=[], comparison='number')]
    else:
        title = 'Explore Evidence in a Text'
        lessons = [
            'Text evidence is a detail that directly supports an answer. Look for the sentence that answers the question.',
            'Find the detail named in the question and answer using information from the text.',
        ]
        prompts = [
            'Which detail explains why feathers help birds in cold weather?',
            'According to the text, what do bees carry?',
            "According to the text, what does an otter's fur trap?",
        ]
        contexts = ['Birds use feathers to stay warm. Some feathers also help birds fly.',
                    'Bees carry pollen from flower to flower. This helps plants grow seeds.',
                    'Otters have thick fur that traps air. The air helps keep otters warm in cold water.']
        options = [{'id': 'warm', 'text': 'They keep birds warm'}, {'id': 'holes', 'text': 'They dig holes'}]
        answers = [dict(value='warm', acceptedAnswers=[], comparison='text'),
                   dict(value='pollen', acceptedAnswers=['pollen.'], comparison='text'),
                   dict(value='air', acceptedAnswers=['air.', 'The fur traps air.'], comparison='text')]
    scenes = []
    for index, component in enumerate(['guided_choice', 'guided_response', 'independent_response']):
        params = {'context': contexts[index]}
        if index < 2:
            params['teachingText'] = lessons[index]
        if index == 0:
            params['options'] = options
        scenes.append(dict(id=f'step-{index}', phase='independent' if index == 2 else 'guided',
                           prompt=prompts[index], component=component, params=params, answer=answers[index],
                           feedback=dict(correct='You used the information to answer this step.',
                                         incorrect='Look at the information and try the step again.',
                                         hint='Use the teaching tip and the information for this step.'),
                           nextSceneId=f'step-{index + 1}' if index < 2 else None))
    return dict(schemaVersion='1.1', title=title, subject=subject, subskillId=data['subskillId'],
                grade=data['grade'], misconceptionTags=data['misconceptionTags'],
                sourceRefs=data['sourceRefs'], scenes=scenes)


class BrowserComposer:
    model = 'explicit-synthetic-browser-composer'

    async def _call(self, response_model, task, instruction, data):
        if response_model is ActivityReview:
            return ActivityReview(approved=True, reason='approved')
        assert response_model is ActivitySpec and data['schemaVersion'] == '1.1'
        assert data['subskillId'] in {'4.OA.A.2-1', 'RI.3.1-1'}
        return ActivitySpec.model_validate(example(data['subject'], data))


app.state.activity_adapter = BrowserComposer()
