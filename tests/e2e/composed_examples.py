"""Controlled model outputs for linked activity browser regressions, never runtime lessons."""
from backend.activities.composition import derive_answers


def area_example(data):
    design = bool(data.get('previousInteractionSignatures'))
    first_area = dict(rows=1, columns=1, targetArea=12) if design else dict(rows=2, columns=3, targetArea=6)
    expression_area = dict(rows=3, columns=4, targetArea=12) if design else first_area
    final_area = dict(rows=1, columns=1, targetArea=15) if design else dict(rows=2, columns=4, targetArea=8)
    missions = [
        ('area_design' if design else 'area_tile', first_area,
         'Shape a rectangular animal pen using all 12 floor tiles.' if design else 'Cover the rectangular stage with unit floor tiles.',
         'A rectangle can have different side lengths while keeping its area.' if design else 'Each unit square covers one square unit. Rows organize the tiles.'),
        ('area_expression', expression_area,
         'Write a rows times columns equality for the pen you just designed.' if design else 'Write a rows times columns equality for the stage you tiled.',
         'Your previous rectangle is carried into this step. Connect its rows and columns to the total covered area.'),
        ('area_design' if design else 'area_expression', final_area,
         'Design a new rectangular feeding area using exactly 15 tiles.' if design else 'Write a multiplication equality for this new rectangular rehearsal mat.', None),
    ]
    scenes = []
    for index, (mode, area, prompt, teaching) in enumerate(missions):
        scenes.append(dict(id=f'area-{index}', component='math_workspace', phase='independent' if index == 2 else 'guided',
            prompt=prompt, params=dict(context=None, teachingText=teaching,
                goal='Use every tile to build the requested rectangle.' if mode == 'area_design' else 'Connect unit-square area with rows and columns.',
                visual=None, mode=mode, area=area, width=12, height=12, origin='0', step='1', unitLabel='meter', objects=[], tokens=[]),
            answer={}, feedback=dict(correct='Your rectangle and its multiplication agree.', incorrect='Compare the rows, columns, and covered squares.', hint='Each row has the same number of unit squares.'),
            connection=dict(sourceSceneId='area-0', sourceOutput='area_rectangle', targetInput='area_rectangle') if index == 1 else None,
            nextSceneId=None if index == 2 else f'area-{index + 1}'))
    return derive_answers(dict(schemaVersion='1.3', title='Design the Animal Pen' if design else 'Tile the Tiny Theater',
        subject=data['subject'], subskillId=data['subskillId'], grade=data['grade'],
        misconceptionTags=data['misconceptionTags'], sourceRefs=data['sourceRefs'], scenes=scenes))
