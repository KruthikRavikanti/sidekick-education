"""Original, identifying-information-free work pages for activity-flow tests."""
import hashlib
import json
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
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print('Generated four original synthetic activity-entry work pages (correct and incorrect).')


if __name__ == '__main__':
    main()
