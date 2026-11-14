"""Original, identifying-information-free work pages for activity-flow tests."""
import hashlib
import json
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw

from generate_fixtures import field, font, problem, work

ROOT = Path(__file__).resolve().parents[1]


def main():
    manifest_path = ROOT / 'fixtures/manifest.json'
    manifest = json.loads(manifest_path.read_text())
    for subject, title, question, answer, correct in [
        ('math', 'Unit fraction work', 'How many 1/4 pieces make 3/4?', '4', False),
        ('ela', 'Word pattern work', 'One mouse, two ___.', 'mouses', False),
        ('math', 'Unit fraction work', 'How many 1/4 pieces make 3/4?', '3', True),
        ('ela', 'Word pattern work', 'One mouse, two ___.', 'mice', True),
    ]:
        name = f'activity-{subject}' + ('-correct' if correct else '')
        image = Image.new('RGB', (1000, 1200), 'white')
        draw = ImageDraw.Draw(image)
        draw.text((65, 65), 'SIDEKICK / ORIGINAL SYNTHETIC WORK', fill='#69717D', font=font(20))
        draw.text((65, 150), title, fill='#064D32', font=font(42, bold=True))
        draw.text((65, 220), 'Grade 3', fill='#242C36', font=font(24))
        draw.text((65, 300), 'Answer the question.', fill='#242C36', font=font(27))
        draw.text((65, 420), '1. ' + question, fill='#242C36', font=font(30))
        draw.text((100, 535), answer, fill='#325999', font=font(38, handwriting=True))
        draw.text((65, 1080), 'Synthetic response. No real student information.', fill='#69717D', font=font(20))
        path = ROOT / f'public/samples/{name}-work.png'
        image.save(path, format='PNG', optimize=True)
        data = {
            'worksheet': {'title': field(title), 'subject': subject, 'subject_uncertain': False,
                          'printed_grade': field('Grade 3'), 'directions': [field('Answer the question.')], 'shared_context': []},
            'problems': [problem(f'{name}-1', '1', question, work('answered', final=answer))],
        }
        (ROOT / f'fixtures/{name}.json').write_text(json.dumps(data, indent=2) + '\n')
        manifest = {key: value for key, value in manifest.items() if value != name}
        manifest[hashlib.sha256(path.read_bytes()).hexdigest()] = name
    for subject, grade, title, question, answer, passage in [
        ('math', '4', 'Multiplicative comparison', 'A scarf costs 6 dollars. A jacket costs 4 times as much. How much does the jacket cost?', '24', None),
        ('ela', '3', 'Reading with evidence', 'After an article: What causes the seasons? Quote or point to the sentence.', "Earth's axis is tilted.", "The seasons happen because Earth's axis is tilted as Earth moves around the sun."),
    ]:
        name = f'activity-{subject}-general'
        image = Image.new('RGB', (1000, 1200), 'white')
        draw = ImageDraw.Draw(image)
        draw.text((65, 65), 'SIDEKICK / ORIGINAL SYNTHETIC WORK', fill='#69717D', font=font(20))
        draw.text((65, 150), title, fill='#064D32', font=font(40, bold=True))
        draw.text((65, 220), f'Grade {grade}', fill='#242C36', font=font(24))
        if passage:
            draw.multiline_text((65, 300), '\n'.join(textwrap.wrap(passage, width=48)), fill='#242C36', font=font(28), spacing=12)
        draw.multiline_text((65, 490), '\n'.join(textwrap.wrap('1. ' + question, width=48)), fill='#242C36', font=font(30), spacing=12)
        draw.text((100, 745), answer, fill='#325999', font=font(32, handwriting=True))
        draw.text((65, 1080), 'Synthetic response. No real student information.', fill='#69717D', font=font(20))
        path = ROOT / f'public/samples/{name}-work.png'
        image.save(path, format='PNG', optimize=True)
        context = [{'id': 'article', 'type': 'passage', 'title': field('Seasons'), 'content': field(passage)}] if passage else []
        data = {'worksheet': {'title': field(title), 'subject': subject, 'subject_uncertain': False,
                             'printed_grade': field(f'Grade {grade}'), 'directions': [], 'shared_context': context},
                'problems': [problem(f'{name}-1', '1', question, work('answered', final=answer), refs=['article'] if passage else [])]}
        (ROOT / f'fixtures/{name}.json').write_text(json.dumps(data, indent=2) + '\n')
        manifest = {key: value for key, value in manifest.items() if value != name}
        manifest[hashlib.sha256(path.read_bytes()).hexdigest()] = name
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print('Generated six original synthetic activity-entry work pages.')


if __name__ == '__main__':
    main()
