"""Synthetic upload entry points spanning the new K–5 activity families."""
import hashlib
import json
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw
from generate_fixtures import field, font, problem, work

ROOT = Path(__file__).resolve().parents[1]
CASES = [
    ('multiplication', 'math', '3', '3.OA.A.1-1', 'Equal groups', 'What does 5 x 7 mean: 5 groups of 7, or 5 and 7 more?', '5 groups of 7'),
    ('division', 'math', '3', '3.OA.A.2-1', 'Sharing equally', '24 cookies are shared equally among 6 kids. How many does each kid get?', '4'),
    ('measurement', 'math', '2', '2.MD.A.1-2', 'Measuring from zero', 'A ribbon starts at 0 cm and ends at 6 cm on a ruler. How long is it?', '6 cm'),
    ('coordinates', 'math', '5', '5.G.A.1-1', 'Coordinates', 'In the point (3, 5), which number tells how far to go across?', '3'),
    ('phonics', 'ela', '1', 'RF.1.3-2', 'Reading words', 'Read these regularly spelled one-syllable words: flag, best, jump, trip.', 'flag, best, jump, trip'),
    ('fluency', 'ela', '3', 'RF.3.4-2', 'Reading aloud', 'Read this passage aloud with accuracy, rate, and expression.', 'Read aloud'),
    ('writing', 'ela', '3', 'W.3.3-1', 'Story openings', 'Write the beginning of a story: who is in it, where, and what is happening.', 'Mina waited at the river. Her little boat had drifted away.'),
    ('editing', 'ela', '3', 'L.3.2-1', 'Titles', 'Write this title correctly: the cat in the hat', 'The Cat in the Hat'),
    ('handwriting', 'ela', 'K', 'L.K.1-1', 'Writing letters', 'Print uppercase A and lowercase a.', 'A a'),
    ('sorting', 'ela', '1', 'L.1.5-1', 'Word categories', 'Sort into colors and clothes: red, shirt, blue, hat.', 'Colors: red, blue. Clothes: shirt, hat.'),
]


def main():
    manifest_path = ROOT / 'fixtures/manifest.json'
    manifest = json.loads(manifest_path.read_text())
    for name, subject, grade, target, title, question, answer in CASES:
        key = f'activity-catalog-{name}'
        image = Image.new('RGB', (1000, 1200), 'white')
        draw = ImageDraw.Draw(image)
        draw.text((65, 65), 'SIDEKICK / ORIGINAL SYNTHETIC WORK', fill='#69717D', font=font(20))
        draw.text((65, 150), title, fill='#064D32', font=font(40, bold=True))
        draw.text((65, 220), f'Grade {grade}', fill='#242C36', font=font(24))
        passage = 'A small boat waited by the river. The wind moved the leaves. Mina watched a bird fly across the water.' if name == 'fluency' else None
        if passage:
            draw.multiline_text((65, 300), '\n'.join(textwrap.wrap(passage, 48)), fill='#242C36', font=font(28), spacing=12)
        draw.multiline_text((65, 535), '\n'.join(textwrap.wrap('1. ' + question, 47)), fill='#242C36', font=font(30), spacing=12)
        draw.multiline_text((90, 735), '\n'.join(textwrap.wrap(answer, 44)), fill='#325999', font=font(30, handwriting=True), spacing=12)
        draw.text((65, 1080), 'Synthetic response. No real student information.', fill='#69717D', font=font(20))
        path = ROOT / f'public/samples/{key}-work.png'
        image.save(path, format='PNG', optimize=True)
        context = [dict(id='passage', type='passage', title=field('At the river'), content=field(passage))] if passage else []
        data = dict(worksheet=dict(title=field(title), subject=subject, subject_uncertain=False,
            printed_grade=field(f'Grade {grade}'), directions=[], shared_context=context),
            problems=[problem(key+'-1', '1', question, work('answered', final=answer), refs=['passage'] if passage else [])])
        (ROOT / f'fixtures/{key}.json').write_text(json.dumps(data, indent=2)+'\n')
        manifest = {digest: value for digest, value in manifest.items() if value != key}
        manifest[hashlib.sha256(path.read_bytes()).hexdigest()] = key
    manifest_path.write_text(json.dumps(manifest, indent=2)+'\n')
    print('Generated ten synthetic family upload pages.')


if __name__ == '__main__':
    main()
