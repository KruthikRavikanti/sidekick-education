"""Original synthetic model outputs for family-flow tests, never production templates."""

EXAMPLE_KINDS = {
    '3.OA.A.1-1': 'multiplication', '3.OA.A.2-1': 'division',
    '2.MD.A.1-2': 'measurement', '5.G.A.1-1': 'coordinates',
    'RF.1.3-2': 'phonics', 'RF.3.4-2': 'fluency', 'W.3.3-1': 'writing',
    'L.3.2-1': 'editing', 'L.K.1-1': 'handwriting',
    'L.1.5-1': 'sorting',
}


def example(data):
    kind = EXAMPLE_KINDS[data['subskillId']]
    scenes = []
    manual = lambda *criteria: dict(assessment='parent_review', rubric=list(criteria))
    for index in range(3):
        final = index == 2
        material = dict(context=None, teachingText=None if final else 'Use the objects and make the scene match its goal.',
                        goal='Complete the mission by changing the scene.', visual=None)
        if kind in {'multiplication', 'division'}:
            groups, each = [(3, 4), (3, 5), (4, 5)][index]
            total = groups * each
            divide = kind == 'division'
            component = 'quantity_lab'
            prompt = f'Share all {total} seed packets fairly among {groups} garden teams.' if divide else f'Pack {groups} art orders with {each} paint jars in each order.'
            material.update(goal='Give every team an equal share of the stock.' if divide else 'Build every complete art order.',
                teachingText=None if final else 'Sharing equally gives every group the same count.' if divide else 'Each order is one equal group. The total combines all the groups.',
                stock=total, containers=[dict(id=f'group-{i}', label=f'Team {i + 1}' if divide else f'Order {i + 1}') for i in range(groups)],
                unitValue='1', taskOperation='distribute' if divide else 'build', initialCounts=[0] * groups)
            answer = dict(assessment='automatic', expectedCounts=[each] * groups,
                mathRule=dict(operation='divide' if divide else 'multiply',
                    operands=[str(total), str(groups)] if divide else [str(groups), str(each)], result=str(each if divide else total)))
        elif kind in {'measurement', 'coordinates'}:
            component = 'math_workspace'
            x = [3, 4, 6][index]
            y = [2, 4, 3][index] if kind == 'coordinates' else 0
            prompt = f'Plot the new supply station at ({x}, {y}).' if kind == 'coordinates' else 'Place the ruler marker at the end of the new ribbon.'
            material.update(goal='Place the station on the coordinate map.' if kind == 'coordinates' else 'Measure the ribbon from zero.',
                teachingText=None if final else 'The first coordinate is horizontal; the second is vertical.' if kind == 'coordinates' else 'Line the zero mark up with the start of the object.',
                mode='grid' if kind == 'coordinates' else 'ruler', width=10, height=6 if kind == 'coordinates' else 2,
                step='1', origin='0', unitLabel='map units' if kind == 'coordinates' else 'centimeters', tokens=[],
                objects=[] if kind == 'coordinates' else [dict(id='ribbon', label='Ribbon', x=0, y=0, width=x, height=1, shape='rect', value=None)])
            answer = dict(assessment='automatic', expectedMarks=[dict(x=x, y=y)], expectedText=None,
                mathRule=None if kind == 'coordinates' else dict(operation='represent', operands=[str(x)], result=str(x)))
        elif kind in {'phonics', 'fluency'}:
            component = 'oral_studio'
            passages = ['flag best jump trip', 'slip grin clap drop', 'stop twig plum hand'] if kind == 'phonics' else [
                'On Saturday, Maya followed a narrow path beside the river. She expected to find smooth stones for her collection, but a bright feather caught her attention. It lay beneath a tall oak tree. Maya looked up and waited quietly. A blue bird landed on a branch, shook its wings, and disappeared among the leaves. She left the feather where it was and drew the bird in her notebook instead.',
                'Before the rain arrived, the garden was quiet and dusty. Then a breeze moved the leaves, and dark clouds covered the afternoon sun. Ben carried the small pots under the porch while his sister gathered the tools. When the first drops fell, everything was ready. The children watched the soil turn dark and listened to water tapping on the roof. Their seedlings would have plenty to drink.',
                'Our class built a little bridge from folded paper. At first, the middle sagged whenever we placed a toy car on it. We studied the shape and added two folded supports beneath the road. This time the car rolled across safely. Everyone wanted to test a heavier toy, but we wrote down our results first. Careful notes would help us explain which change made the bridge stronger.',
            ]
            prompt = 'Read the new words aloud.' if kind == 'phonics' else 'Read the new passage aloud with a steady pace and expression.'
            material.update(context=['A forest radio needs a message.', 'The meadow radio needs a message.', 'The pond radio needs a message.'][index],
                goal='Record clear reading for the radio.', teachingText=None if final else 'Look through the word and blend its sounds.' if kind == 'phonics' else 'Read accurately, pause at punctuation, and make the meaning clear.',
                mode='read_aloud', passage=passages[index], listenText=None)
            answer = manual('The child reads the supplied words aloud rather than naming letters.', 'Sounds are blended accurately.' if kind == 'phonics' else 'Reading is accurate, at a suitable pace, and expressive.')
        elif kind == 'sorting' and not final:
            component='sort_connect'
            lists=[(['apple','pear','carrot','pea'],['Fruit','Vegetable']),(['ant','bee','cart','bike'],['Insect','Vehicle'])]
            words,labels=lists[index]
            prompt='Place each word with its meaning group.'
            material.update(goal='Sort words by what they mean.',teachingText='A category groups things with a shared meaning. Think about what each word names.',
                mode='sort',pieces=[dict(id=f'piece-{i}',text=word) for i,word in enumerate(words)],
                targets=[dict(id=f'category-{i}',label=label) for i,label in enumerate(labels)])
            answer=dict(assessment='automatic',placements=[dict(pieceId=f'piece-{i}',targetId=f'category-{0 if i<2 else 1}') for i in range(4)])
        elif kind == 'sorting':
            component='text_editor';prompt='Define robin and oak by naming a category and a feature for each.'
            material.update(goal='Explain what each new word means through its category.',mode='compose',initialText='',minLength=20,minWords=0,maxLength=1500,wordBank=['robin','oak'])
            answer=manual('Names bird as a category for robin and tree as a category for oak.','Adds a relevant defining feature for each word.')
        elif kind == 'writing':
            component = 'text_editor'
            prompt = ['Write the opening of an adventure about a missing kite.', 'Write the opening of an adventure about a garden visitor.', 'Write the opening of a new adventure about a lost map.'][index]
            material.update(goal='Give a reader an opening with characters, a place, and a situation.',
                teachingText=None if final else 'Introduce who is there and where they are. Let one event lead to the next.',
                mode='compose', initialText='', minLength=20, minWords=0, maxLength=3000, wordBank=[])
            answer = manual('Establishes a clear situation and narrator or characters.', 'Introduces an appropriate setting.', 'Events follow a natural order.')
        elif kind == 'editing':
            component = 'text_editor'
            drafts = ['the fox and the moon', 'a boat on the river', 'the owl in the tower']
            corrected = ['The Fox and the Moon', 'A Boat on the River', 'The Owl in the Tower']
            prompt = f'Edit this new book title: {drafts[index]}.'
            material.update(goal='Repair the title capitalization for a book cover.',
                teachingText=None if final else 'Capitalize the first word and important words in a title. Small connecting words usually stay lowercase.',
                mode='edit', initialText=drafts[index], minLength=5, minWords=0, maxLength=300, wordBank=[])
            answer = dict(assessment='automatic', acceptedTexts=[corrected[index]])
        else:
            component = 'drawing_studio'
            letter = ['A', 'M', 'T'][index]
            prompt = f'Write an uppercase {letter} on the sign with your finger or pointer.'
            material.update(goal='Make a legible letter on the sign.', teachingText=None if final else 'Start each line deliberately and leave space around the letter.',
                backgroundPrompt='A blank sign for a new shop.', labels=[f'Letter {letter}'])
            answer = manual(f'The drawing is recognizable as an uppercase {letter}.', 'The child forms the letter with actual strokes.')
        scenes.append(dict(id=f'mission-{index}', component=component, phase='independent' if final else 'guided',
            prompt=prompt, params=material, answer=answer,
            feedback=dict(correct='Your action makes the idea visible.', incorrect='Compare your scene with the mission and try again.', hint='Use the goal and check the meaning of each change.'),
            nextSceneId=None if final else f'mission-{index + 1}'))
    return dict(schemaVersion='1.2', title=f'Original {kind.title()} Adventure', subject=data['subject'],
        subskillId=data['subskillId'], grade=data['grade'], misconceptionTags=data['misconceptionTags'],
        sourceRefs=data['sourceRefs'], scenes=scenes)
