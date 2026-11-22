"""From-scratch synthetic provider stubs, never production activity templates."""
import copy

from backend.activity_engine_v2.validator import catalog, require_valid_program


def term(kind, **values): return dict(kind=kind, **values)
def state(ref): return term('state', ref=ref)
def inp(ref): return term('input', ref=ref)
def lit(value): return term('literal', value=value)
def op(name, *args): return term('operator', op=name, args=list(args))
def eq(left, right): return dict(kind='compare', op='eq', left=left, right=right)
def conjunction(*conditions): return dict(kind='all', conditions=list(conditions))
def integer(identifier, initial, minimum, maximum, **values):
    return dict(id=identifier, kind='integer', initial=initial, minimum=minimum, maximum=maximum, **values)
def param(identifier, minimum, maximum): return dict(id=identifier, kind='integer', minimum=minimum, maximum=maximum)
def effect(target, value): return dict(kind='set', target=target, value=value)


def make_program(kind='tile'):
    """Complete generated-content stubs without reading registered fixtures."""
    skill = {'tile':'3.MD.C.7-1', 'design':'3.MD.C.7-1', 'reading':'RL.3.1-1', 'writing':'W.3.3-1'}[kind]
    target = dict(skillId=skill, demonstration=catalog()[skill]['subskill'])
    raw = dict(schemaVersion='2.0-foundation', id='synthetic-'+kind, title='Synthetic '+kind+' mission',
        componentVersion='sidekick-program-contract-v1', intent=dict(targets=[target], observations=[],
            misconceptions=[], successEvidence=['construction-evidence']),
        world=dict(state=[], materials=[], objects=[], relationships=[], invariants=[]), components=[],
        actions=[], rules=[], goals=[], completion=dict(when=dict(kind='goal',goalId='mission-finished'),
            goalIds=['mission-finished'],allowAssisted=True), help=[], evidence=[],
        presentation=dict(entrySpace='workspace',spaces=[dict(id='workspace',title='Your creation')],assets=[]),
        provenance=dict(origin='human_authored',author='Synthetic test author',sourceRefs=[]), witness=[])
    allways = dict(kind='always')
    raw['world']['materials'].append(dict(id='mission-note',kind='prompt',text='Build a useful creation and explain your choices.'))
    if kind in {'tile','design'}:
        maximum=3 if kind=='tile' else 6
        rows,columns=(2,3) if kind=='tile' else (1,1)
        quantity=6 if kind=='tile' else 12
        cells=[f'r{r}c{c}' for r in range(maximum) for c in range(maximum)]
        raw['world']['state']=[integer('height',rows,1,maximum),integer('width',columns,1,maximum),
            integer('stock',quantity,quantity,quantity,mutable=False),dict(id='placed',kind='id_set',initial=[],options=cells,maxItems=len(cells)),
            integer('factor-a',0,0,6),integer('factor-b',0,0,6),integer('product',0,0,36)]
        raw['world']['materials'][0]['text']='Create a greenhouse floor from equal square panels. Use the full stock and build an equality describing its rows, columns and total.'
        raw['world']['materials'].append(dict(id='panels',kind='unit_tiles',quantity=quantity))
        raw['world']['objects']=[dict(id='board',kind='grid',bindings=dict(rows='height',columns='width',cells='placed'),materialIds=['panels','mission-note'],width=maximum,height=maximum),
            dict(id='equation',kind='equation',bindings=dict(left='factor-a',right='factor-b',result='product'),materialIds=['mission-note'])]
        raw['components']=[dict(id='tools',kind='math_workspace',objectIds=['board','equation'],spaceId='workspace')]
        if kind=='tile':
            choices=[f'r{r}c{c}' for r in range(rows) for c in range(columns)]
            raw['actions'].append(dict(id='place',componentId='tools',operation='toggle_tile',inputs=[dict(id='cell',kind='choice',options=choices)],label='Place or lift a panel'))
            raw['rules'].append(dict(id='change-panel',onAction='place',when=allways,effects=[dict(kind='toggle_item',target='placed',item=inp('cell'))]))
            raw['witness']=[dict(actionId='place',inputs=dict(cell=cell)) for cell in choices]
        else:
            raw['actions'].append(dict(id='reshape',componentId='tools',operation='resize_rectangle',inputs=[param('rows',1,maximum),param('columns',1,maximum)],label='Shape the floor'))
            raw['rules'].append(dict(id='change-shape',onAction='reshape',when=allways,effects=[effect('height',inp('rows')),effect('width',inp('columns'))]))
            raw['witness']=[dict(actionId='reshape',inputs=dict(rows=3,columns=4))]
            rows,columns=3,4
        raw['actions'].append(dict(id='multiply',componentId='tools',operation='assemble_product',inputs=[param('left',1,6),param('right',1,6),param('result',1,36)],label='Build an equality'))
        raw['rules'].append(dict(id='save-expression',onAction='multiply',when=allways,effects=[effect('factor-a',inp('left')),effect('factor-b',inp('right')),effect('product',inp('result'))]))
        goal=conjunction(eq(op('multiply',state('height'),state('width')),state('stock')),
            eq(state('factor-a'),state('height')),eq(state('factor-b'),state('width')),
            eq(state('product'),op('multiply',state('height'),state('width'))))
        if kind=='tile':goal=conjunction(eq(op('count',state('placed')),state('stock')),goal)
        raw['witness'].append(dict(actionId='multiply',inputs=dict(left=rows,right=columns,result=quantity)))
        refs=['height','width','placed','factor-a','factor-b','product']
        raw['evidence']=[dict(id='construction-evidence',skillIds=[skill],actionIds=[action['id'] for action in raw['actions']],stateRefs=refs,assessment=dict(kind='automatic',when=copy.deepcopy(goal)))]
    elif kind=='reading':
        sentences=[dict(id='rain',text='Rain tapped the roof.'),dict(id='shelter',text='Lena carried the seed tray into the dry shed.'),dict(id='paint',text='The shed door was blue.')]
        raw['world']['state']=[dict(id='clue',kind='choice',initial='empty',options=['empty']+[row['id'] for row in sentences])]
        raw['world']['materials']=[dict(id='mission-note',kind='prompt',text='Which sentence shows how Lena protected the seeds from rain? Place that sentence on your board.'),
            dict(id='garden-story',kind='passage',text=' '.join(item['text'] for item in sentences),items=sentences)]
        raw['world']['objects']=[dict(id='case-board',kind='evidence_board',bindings=dict(selection='clue'),materialIds=['mission-note','garden-story'])]
        raw['components']=[dict(id='case-tools',kind='evidence_board',objectIds=['case-board'],spaceId='workspace')]
        raw['actions']=[dict(id='place-clue',componentId='case-tools',operation='select_evidence',inputs=[dict(id='sentence',kind='choice',options=[row['id'] for row in sentences])],label='Place a clue')]
        raw['rules']=[dict(id='save-clue',onAction='place-clue',when=allways,effects=[effect('clue',inp('sentence'))])]
        goal=eq(state('clue'),lit('shelter'))
        raw['evidence']=[dict(id='construction-evidence',skillIds=[skill],actionIds=['place-clue'],stateRefs=['clue'],assessment=dict(kind='automatic',when=copy.deepcopy(goal)))]
        raw['witness']=[dict(actionId='place-clue',inputs=dict(sentence='shelter'))]
    else:
        raw['world']['state']=[dict(id='draft',kind='text',initial='',maxLength=1200),dict(id='changed',kind='boolean',initial=False)]
        raw['world']['materials'][0]['text']='Open a story about a surprising visitor. Write at least eight words, then improve your opening while keeping at least eight words.'
        raw['world']['objects']=[dict(id='journal',kind='text_artifact',bindings=dict(text='draft'),materialIds=['mission-note']),dict(id='revision-marker',kind='progress',bindings=dict(value='changed'),materialIds=[])]
        raw['components']=[dict(id='writing-tools',kind='text_editor',objectIds=['journal','revision-marker'],spaceId='workspace')]
        raw['actions']=[dict(id=name,componentId='writing-tools',operation=operation,inputs=[dict(id='text',kind='text',maxLength=1200)],label=label) for name,operation,label in [('write','replace_text','Save the opening'),('revise','revise_text','Save the revision')]]
        enough=dict(kind='compare',op='gte',left=op('word_count',inp('text')),right=lit(8))
        raw['rules']=[dict(id='save-first',onAction='write',when=conjunction(enough,eq(state('draft'),lit(''))),effects=[effect('draft',inp('text'))]),dict(id='save-revision',onAction='revise',when=conjunction(enough,dict(kind='compare',op='ne',left=state('draft'),right=inp('text'))),effects=[effect('draft',inp('text')),effect('changed',lit(True))])]
        goal=conjunction(eq(state('changed'),lit(True)),dict(kind='compare',op='gte',left=op('word_count',state('draft')),right=lit(8)))
        raw['evidence']=[dict(id='construction-evidence',skillIds=[skill],actionIds=['write','revise'],stateRefs=['draft','changed'],assessment=dict(kind='parent_review',rubric=['The opening establishes characters and a situation before events unfold.','The revision makes the opening clearer for the reader.']))]
        raw['witness']=[dict(actionId='write',inputs=dict(text='Lena heard a knock while packing seeds beside the window.')),dict(actionId='revise',inputs=dict(text='At sunrise, Lena heard a tiny knock while packing garden seeds beside the open window. A bird waited outside.'))]
    raw['goals']=[dict(id='mission-finished',description='Complete your construction and show how it meets the mission.',when=goal)]
    raw['help']=[dict(id='small-hint',kind='hint',text='Look again at your mission and the materials. Make your next change show the idea you are exploring.',availableWhen=allways,actionIds=[action['id'] for action in raw['actions']],maxUses=3)]
    return require_valid_program(raw)


def context_for(program):
    return dict(targets=[item.model_dump() for item in program.intent.targets], observations=[],
                misconceptions=[], uncertainties=['No prior activity history is available.'], history=[],
                learningGoal='Explore the reliably mapped skill with an original meaningful action.',
                problemType='synthetic', previousSignatures=[])
