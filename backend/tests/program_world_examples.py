"""Synthetic cross-layer world contracts, never a finished production library."""
import copy

from backend.activity_engine_v2.models import ActivityProgram
from backend.tests.program_composition_examples import make_program, eq, inp, lit, state, conjunction


def world_program(kind='tile', loop='route'):
    if kind=='fraction':
        from backend.tests.test_activity_program_fraction_authoring_v2 import fraction_program
        raw=fraction_program().model_dump()
    else:
        raw=make_program(kind).model_dump()
    tool=raw['components'][0]['id']
    space=raw['presentation']['entrySpace']
    slots={slot['id']:slot for slot in raw['world']['state']}
    representation=next(obj['id'] for obj in raw['world']['objects'] if obj['kind']!='progress'
                        and any(slots[ref].get('mutable',True) for ref in obj['bindings'].values()))
    conceptual=copy.deepcopy(raw['goals'][0]['when'])
    always=dict(kind='always')
    locations=[dict(id=identifier,label=label,x=x,y=50,capacity=4,accepts='any')
               for identifier,label,x in [('start','Holding area',10),('work','Workshop',50),('finish','Destination',90)]]
    raw['world']['state'].extend([
        dict(id='world-position',kind='choice',initial='start',options=['start','work','finish']),
        dict(id='world-inspected',kind='id_set',initial=[],options=['start','work','finish'],maxItems=3)])
    raw['world']['objects'].extend([
        dict(id='world-movable',kind='stage_piece',bindings=dict(location='world-position')),
        dict(id='world-discoveries',kind='stage_map',bindings=dict(inspected='world-inspected'))])
    raw['components'].append(dict(id='world-controls',kind='world_stage',objectIds=['world-movable','world-discoveries'],spaceId=space))
    operation='move_actor' if loop=='route' else 'place_piece'
    raw['actions'].extend([
        dict(id='world-move',componentId='world-controls',operation=operation,
             inputs=[dict(id='destination',kind='choice',options=['start','work','finish'])],label='Choose a destination'),
        dict(id='world-inspect',componentId='world-controls',operation='inspect_location',
             inputs=[dict(id='location',kind='choice',options=['start','work','finish'])],label='Investigate a place')])
    raw['rules'].extend([
        dict(id='world-position-rule',onAction='world-move',when=always,
             effects=[dict(kind='set',target='world-position',value=inp('destination'))]),
        dict(id='world-inspection-rule',onAction='world-inspect',when=eq(state('world-position'),inp('location')),
             effects=[dict(kind='add_item',target='world-inspected',item=inp('location'))])])
    active=conjunction(conceptual,eq(state('world-position'),lit('work'))) if loop=='attach' else conceptual
    raw['presentation']['stage']=dict(locations=locations,
        entities=[dict(id='traveler',label='Courier' if loop=='route' else 'Device',kind='actor' if loop=='route' else 'device',
                       objectId='world-movable',locationId=None,asset='cart' if loop=='route' else 'gear',
                       representationObjectId=representation if loop=='attach' else None),
                  dict(id='workbench',label='Workbench',kind='object',objectId=None,locationId='work',asset='bridge',
                       representationObjectId=representation if loop=='route' else None),
                  dict(id='receiver',label='Receiver',kind='destination',objectId=None,locationId='finish',asset='flag',representationObjectId=None)],
        connections=[dict(id='approach',fromLocation='start',toLocation='work',bidirectional=True,when=always,
                          label='Open path',blockedLabel='This path is closed.'),
                     dict(id='concept-route',fromLocation='work',toLocation='finish',bidirectional=True,when=conceptual,
                          label='Construction supports travel',blockedLabel='Change the actual construction to make this route usable.')]
                    if loop=='route' else [],
        tools=[dict(componentId=tool,entityId='workbench' if loop=='route' else 'traveler',
                    availableWhen=dict(kind='contains',collection=state('world-inspected'),item=lit('work')) if loop=='route' else always,
                    label='Work with the actual materials')],
        reactions=[dict(id='working',entityId='workbench' if loop=='route' else 'traveler',when=active,status='active',
                        text='The actual construction changes what the system can do.'),
                   dict(id='try-again',entityId='workbench' if loop=='route' else 'traveler',when=dict(kind='not',condition=active),status='blocked',
                        text='Try another construction or placement. You can change it again.')])
    finish_location='finish' if loop=='route' else 'work'
    raw['goals'].append(dict(id='world-finished',description='Use your construction to finish the world mission.',
                            when=conjunction(conceptual,eq(state('world-position'),lit(finish_location)))))
    raw['completion']=dict(when=dict(kind='goal',goalId='world-finished'),goalIds=['world-finished'],allowAssisted=True)
    before=[dict(actionId='world-move',inputs=dict(destination='work')),
            dict(actionId='world-inspect',inputs=dict(location='work'))] if loop=='route' else []
    after=[dict(actionId='world-move',inputs=dict(destination=finish_location))]
    raw['witness']=before+raw['witness']+after
    return ActivityProgram.model_validate(raw)
