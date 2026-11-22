"""Original synthetic correct area work for opt-in V2 provider verification."""
from pathlib import Path
from PIL import Image, ImageDraw
from generate_fixtures import font

ROOT = Path(__file__).resolve().parents[1]


def main():
    image = Image.new('RGB', (1000, 1200), 'white')
    draw = ImageDraw.Draw(image)
    for xy, text, size in [
        ((65, 65), 'ORIGINAL SYNTHETIC WORK', 20),
        ((65, 140), 'Rectangle area', 40), ((65, 210), 'Grade 3', 26),
        ((65, 290), '1. Tile a 4 by 6 rectangle. Find its area.', 30),
        ((65, 760), '4 x 6 = 24 square units', 30),
        ((65, 1080), 'Synthetic response. No real student information.', 20),
    ]:
        draw.text(xy, text, font=font(size), fill='#242c36')
    draw.rectangle((180, 410, 660, 730), outline='#064d32', width=4)
    draw.text((365, 365), '6 units', font=font(24), fill='#242c36')
    draw.text((675, 540), '4 units', font=font(24), fill='#242c36')
    image.save(ROOT / 'public/samples/activity-v2-area-correct-work.png', optimize=True)


if __name__ == '__main__':
    main()
