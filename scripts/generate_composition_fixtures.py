"""Original synthetic rectangle upload for composition and recovery verification."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw
from generate_fixtures import field, font, problem, work

ROOT = Path(__file__).resolve().parents[1]


def main():
    image = Image.new('RGB', (1000, 1200), 'white')
    draw = ImageDraw.Draw(image)
    for position, text, size in [
        ((65, 65), 'ORIGINAL SYNTHETIC WORK', 20),
        ((65, 140), 'Rectangle area', 40), ((65, 210), 'Grade 3', 26),
        ((65, 290), '1. Tile a 4 by 6 rectangle. Find its area.', 30),
        ((65, 760), '4 + 6 = 10 square units', 30),
        ((65, 1080), 'Synthetic response. No real student information.', 20),
    ]:
        draw.text(position, text, font=font(size), fill='#242c36')
    draw.rectangle((180, 410, 660, 730), outline='#064d32', width=4)
    draw.text((365, 365), '6 units', font=font(24), fill='#242c36')
    draw.text((675, 540), '4 units', font=font(24), fill='#242c36')
    key = 'activity-composed-area'
    path = ROOT / f'public/samples/{key}-work.png'
    image.save(path, optimize=True)
    data = dict(worksheet=dict(title=field('Rectangle area'), subject='math', subject_uncertain=False,
        printed_grade=field('Grade 3'), directions=[], shared_context=[]),
        problems=[problem(key+'-1', '1', 'Tile a 4 by 6 rectangle. Find its area.',
                          work('answered', steps=['4 + 6 = 10'], final='10 square units'))])
    (ROOT / f'fixtures/{key}.json').write_text(json.dumps(data, indent=2)+'\n')
    manifest_path = ROOT / 'fixtures/manifest.json'
    manifest = {digest: value for digest, value in json.loads(manifest_path.read_text()).items() if value != key}
    manifest[hashlib.sha256(path.read_bytes()).hexdigest()] = key
    manifest_path.write_text(json.dumps(manifest, indent=2)+'\n')
    print('Generated one synthetic rectangle-area upload.')


if __name__ == '__main__':
    main()
