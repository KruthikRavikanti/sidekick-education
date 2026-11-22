"""Explicit provider stubs for world-pipeline tests; not a production library."""
import copy

from backend.activity_engine_v2.authoring import ActivityAuthoring, to_authoring
from backend.activity_engine_v2.composer import SemanticReview
from backend.activity_engine_v2.game_design import GameDesignBatch, GameDesignReview
from backend.activity_engine_v2.gameplay import GameplayReview
from backend.tests.test_activity_program_composer_v2 import approval


def design_batch(program, context=None):
    context=context or dict(observations=[],history=[])
    operations=[action.operation for action in program.actions]
    required=list(dict.fromkeys(operations))
    conceptual=next(op for op in required if op not in {'move_actor','place_piece','inspect_location'})
    world=next(op for op in required if op in {'move_actor','place_piece','inspect_location'})
    base=dict(id='concept-a',title='Synthetic world concept',learningObjective='Use the exact target concept to change a usable world affordance.',
        supportedObservationIds=[],supportedHistoryIndices=[],uncertaintyAcknowledged='Only supplied context supports the learning intent; no diagnosis is inferred.',
        childGoal='Use your construction to make the system work and reach its destination.',format='construction',
        entities=[dict(role='learner-piece',kind='actor',purpose='The child chooses its usable destination.'),
                  dict(role='working-device',kind='device',purpose='The actual target construction changes the system.'),
                  dict(role='destination',kind='destination',purpose='Shows the world outcome.')],
        actionLoop=[dict(operation=op,entityRole='working-device' if op not in {'move_actor','place_piece','inspect_location'} else 'learner-piece',
                        childDecision='Choose a meaningful construction or usable location.',visibleConsequence='The actual world state changes visibly.') for op in required],
        relationships=[dict(fromRole='working-device',toRole='destination',kind='route')],
        decisions=['Choose how to construct the target and where the actual system can operate.'],
        constraints=[dict(kind='construction',description='The concept state determines whether the connection is usable.')],
        consequences=[dict(operation=conceptual,skillIds=[target.skillId for target in program.intent.targets],kind='route_usability',conceptConnection='Actual concept state changes what is usable.',visibleChange='The bound device and route change.'),
                      dict(operation=world,skillIds=[target.skillId for target in program.intent.targets],kind='travel',conceptConnection='Use only a connection supported by the actual construction.',visibleChange='The chosen piece changes its location.')],
        help='Inspect the actual materials and compare the construction to the mission.',
        recovery='Return to the construction and revise it before trying the system again.',
        completionKind='destination',completion='A valid construction supports the world reaching its intended outcome.',
        evidence=[dict(skillId=target.skillId,actions=[op for op in required if op not in {'move_actor','place_piece','inspect_location'}],
                       actualDemonstration=target.demonstration,assessment='parent_review' if any(item.assessment.kind=='parent_review' for item in program.evidence) else 'automatic',
                       limitation='Engineering fixture only; quality of original language remains pending parent assessment.') for target in program.intent.targets],
        requiredCapabilities=required,missingCapabilities=[])
    concepts=[]
    for index,(constraint,finish) in enumerate([('construction','destination'),('capacity','network'),('spatial','construction'),('source','investigation'),('sequence','scenario')]):
        concept=copy.deepcopy(base)
        concept.update(id=f'concept-{index}',completionKind=finish)
        concept['constraints'][0]['kind']=constraint
        concepts.append(concept)
    return GameDesignBatch(formatVersion='sidekick-game-design-v1',targets=program.intent.targets,concepts=concepts)


def gameplay_approval(data, **changes):
    values=dict(definitionHash=data['definitionHash'],renderManifestHash=data['renderManifestHash'],approved=True,
        meaningfulChoices=True,understandableConsequences=True,recoveryPossible=True,targetNecessary=True,
        briefGoalClear=True,finishAchievable=True,finishSatisfying=True,mainStagePlayable=True,
        structuralVariety=True,renderedAffordancesSuitable=True,reasonCode='approved',
        summary='Explicit synthetic engineering review of the exact rendered contract; no child-testing claim.')
    values.update(changes)
    return GameplayReview(**values)


def design_review_approval(data, **changes):
    candidates=[dict(designId=item['id'],approved=True,targetIntegrated=True,understandablePlay=True,
                     meaningfulChoice=True,recoverable=True,supportedNeed=True,rank=1,reasonCode='approved',
                     evidence='Explicit synthetic plan-quality judgment for engineering tests.')
                for item in data['designBatch']['concepts']]
    values=dict(designBatchHash=data['designBatchHash'],candidates=candidates)
    values.update(changes)
    return GameDesignReview(**values)


class GameplayStub:
    model='explicit-synthetic-world-composer'
    def __init__(self,program):
        self.program=program;self.calls=[];self.metadata=[]
    async def call(self,response_model,task,system,data):
        self.calls.append(dict(task=task,data=copy.deepcopy(data),system=system))
        self.metadata.append(dict(task=task,requestedModel=self.model,returnedModel='explicit-synthetic-world-model',elapsedMs=0))
        if response_model is GameDesignBatch:return design_batch(self.program,data.get('context'))
        if response_model is GameDesignReview:return design_review_approval(data)
        if response_model is ActivityAuthoring:
            result=to_authoring(self.program)
            result.selectedDesignId=data['gameDesign']['id']
            return result
        if response_model is SemanticReview:return approval(data)
        if response_model is GameplayReview:return gameplay_approval(data)
        raise AssertionError('Unsupported explicit synthetic response type')
