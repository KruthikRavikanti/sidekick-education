"""Original synthetic upload pages for three reusable activity mechanics."""
import hashlib
import json
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw
from generate_fixtures import field, font, problem, work

ROOT = Path(__file__).resolve().parents[1]
CASES = [
    ('bundles', 'math', '1', 'Tens and ones',
     'You have 10 ones cubes. How many tens can you make?', '1 ten', None),
    ('sequence', 'ela', '3', 'Steps in a process',
     'Put the steps for making a paper boat in order.',
     'Fold the paper, decorate the boat, float it.',
     'First fold the paper into a boat. Next decorate the boat. Finally float it in a tub.'),
    ('evidence', 'ela', '3', 'Reading with evidence',
     'Why did the class move the seedlings? Point to the sentence that tells you.',
     'The seedlings needed more sunlight.',
     'The class grew seedlings by the door. The seedlings needed more sunlight, so the class moved them to a sunny window. They watered them each morning.'),
]


def main():
    manifest_path = ROOT / 'fixtures/manifest.json'
    manifest = json.loads(manifest_path.read_text())
    for mechanic, subject, grade, title, question, answer, passage in CASES:
        name = f'activity-toolkit-{mechanic}'
        image = Image.new('RGB', (1000, 1200), 'white')
        draw = ImageDraw.Draw(image)
        draw.text((65, 65), 'SIDEKICK / ORIGINAL SYNTHETIC WORK', fill='#69717D', font=font(20))
        draw.text((65, 150), title, fill='#064D32', font=font(40, bold=True))
        draw.text((65, 220), f'Grade {grade}', fill='#242C36', font=font(24))
        if passage:
            draw.multiline_text((65, 290), '\n'.join(textwrap.wrap(passage, 49)), fill='#242C36', font=font(27), spacing=12)
        draw.multiline_text((65, 545), '\n'.join(textwrap.wrap('1. ' + question, 47)), fill='#242C36', font=font(30), spacing=12)
        draw.multiline_text((100, 735), '\n'.join(textwrap.wrap(answer, 43)), fill='#325999', font=font(30, handwriting=True), spacing=12)
        draw.text((65, 1080), 'Synthetic response. No real student information.', fill='#69717D', font=font(20))
        path = ROOT / f'public/samples/{name}-work.png'
        image.save(path, format='PNG', optimize=True)
        context = [{'id': 'passage', 'type': 'passage', 'title': field(title), 'content': field(passage)}] if passage else []
        data = {'worksheet': {'title': field(title), 'subject': subject, 'subject_uncertain': False,
                             'printed_grade': field(f'Grade {grade}'), 'directions': [], 'shared_context': context},
                'problems': [problem(f'{name}-1', '1', question, work('answered', final=answer), refs=['passage'] if passage else [])]}
        (ROOT / f'fixtures/{name}.json').write_text(json.dumps(data, indent=2) + '\n')
        manifest = {key: value for key, value in manifest.items() if value != name}
        manifest[hashlib.sha256(path.read_bytes()).hexdigest()] = name
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print('Generated three original synthetic toolkit-entry pages.')


if __name__ == '__main__':
    main()
