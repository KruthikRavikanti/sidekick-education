"""Explicit model-boundary examples for isolated browser tests; never a library."""


def example(data):
    skill = data['subskillId']
    if skill == '1.NBT.B.2-1':
        title = 'Pack the Seed Shop'
        scenes = []
        for index, total in enumerate([23, 36, 42]):
            scenes.append(dict(component='bundle_builder',
                prompt=f'Pack all the complete groups in this delivery of {total} seeds.',
                params=dict(context='A garden shop sends seeds in packs of ten.',
                    teachingText='Trade ten loose seeds for one pack. The total stays the same.' if index < 2 else None,
                    goal='Pack every full group of ten, leaving fewer than ten loose seeds.',
                    itemLabel='seeds', groupLabel='seed packs', total=total, groupSize=10),
                answer=dict(bundles=total // 10)))
    elif skill == 'RI.3.3-1':
        title = 'Repair the Adventure Manual'
        stories = [
            ('Help a maker finish a kite.', [
                'Cut a diamond from paper.', 'Tie sticks to the cut paper.', 'Attach string to the finished kite.']),
            ('Restore instructions for a lantern.', [
                'Fold a sheet of paper.', 'Cut slits in the folded sheet.', 'Open the sheet and join its ends.']),
            ('Restore instructions for a fruit snack.', [
                'Wash the whole apple.', 'Slice the washed apple.', 'Put the slices on a plate.']),
        ]
        scenes = []
        for index, (context, steps) in enumerate(stories):
            tiles = [dict(id=f'piece-{j}', text=text) for j, text in enumerate(steps)]
            scenes.append(dict(component='tile_order', prompt='Rebuild the instructions so each step can happen.',
                params=dict(context=context,
                    teachingText='An earlier step makes the next step possible. Look for what must happen first.' if index < 2 else None,
                    goal='Put the steps in the order a maker can follow.', ordering='story',
                    tiles=[tiles[2], tiles[0], tiles[1]]), answer=dict(order=[tile['id'] for tile in tiles])))
    elif skill == 'RI.3.1-1':
        title = 'Detective: The Missing Detail'
        passages = [
            ('Why did Jo take an umbrella?', ['Jo looked out of the window.', 'Rain was falling, so Jo took an umbrella.', 'Jo wore blue shoes.']),
            ('Why did the baker open the window?', ['The baker made bread.', 'The kitchen was too warm, so the baker opened the window.', 'A cat waited outside.']),
            ('Why did the team stop the game?', ['The team played in the park.', 'Thunder sounded, so the team stopped the game and went indoors.', 'The ball was green.']),
        ]
        scenes = []
        for index, (question, sentences) in enumerate(passages):
            scenes.append(dict(component='evidence_board', prompt=question,
                params=dict(context='The detective needs a clue from the case notes.',
                    teachingText='Choose a sentence that directly explains the reason, then place it on the board.' if index < 2 else None,
                    goal='Place the sentence that supports your answer on the clue board.',
                    sentences=[dict(id=f'line-{j}', text=text) for j, text in enumerate(sentences)],
                    boardLabel='Case clue'),
                answer=dict(sentenceId='line-1', explanation=sentences[1])))
    else:
        raise AssertionError('Unexpected synthetic toolkit target')
    for index, scene in enumerate(scenes):
        scene.update(id=f'step-{index}', phase='independent' if index == 2 else 'guided',
                     nextSceneId=f'step-{index + 1}' if index < 2 else None,
                     feedback=dict(correct='Your action makes the idea visible.',
                         incorrect='Look at the goal and try a different arrangement.',
                         hint='Think about what changes and what must stay the same.'))
    return dict(schemaVersion='1.1', title=title, subject=data['subject'], subskillId=skill,
                grade=data['grade'], misconceptionTags=data['misconceptionTags'],
                sourceRefs=data['sourceRefs'], scenes=scenes)
