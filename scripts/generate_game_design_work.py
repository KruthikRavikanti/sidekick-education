"""Original, unanswered synthetic schoolwork for live world-composition checks."""
from pathlib import Path
import textwrap

from PIL import Image, ImageDraw
from generate_fixtures import font

ROOT = Path(__file__).resolve().parents[1]


def page(title, grade, lines):
    image = Image.new('RGB', (1100, 1450), 'white')
    draw = ImageDraw.Draw(image)
    draw.text((65, 45), 'SYNTHETIC ENGINEERING SAMPLE', font=font(18), fill='#506451')
    draw.text((65, 110), title, font=font(40), fill='#064d32')
    draw.text((65, 175), f'Grade {grade}', font=font(27), fill='#202820')
    y = 255
    for text in lines:
        for line in textwrap.wrap(text, width=66) or ['']:
            draw.text((65, y), line, font=font(27), fill='#202820')
            y += 43
        y += 20
    draw.text((65, 1390), 'Unanswered sample. No real student data.', font=font(20), fill='#506451')
    return image, draw, y


def main():
    output = ROOT / 'public/samples'
    image, draw, y = page('Equivalent fractions', '4', [
        'Directions: Multiply the numerator and denominator by the same whole number to make an equivalent fraction.',
        '1. Write an equivalent fraction for 2/5 by multiplying both counts by the same whole number. Model the new fraction with equal parts of the same whole.',
        '2/5 = ______ / ______',
    ])
    for index in range(5):
        draw.rectangle((100 + index * 145, y + 45, 245 + index * 145, y + 270),
                       fill='#d5e4ae' if index < 2 else 'white', outline='#064d32', width=3)
    image.save(output / 'game-design-fractions-work.png', optimize=True)

    image, _, _ = page('Reading: main idea', '3', [
        'Read the passage. Determine its main idea.',
        'A rain garden helps a neighborhood handle heavy rain. The garden sits in a shallow dip in the ground. Rainwater collects there instead of rushing straight into the street.',
        'The plants in a rain garden have deep roots. Water soaks into the soil around those roots. This gives puddles a place to drain and helps keep nearby roads from flooding.',
        '1. Which sentence states the main idea?',
        'A. Rain gardens help manage rainwater in a neighborhood.',
        'B. Every plant has exactly the same kind of root.',
        'C. Roads should always be covered with puddles.',
        'Answer: ______________________________',
    ])
    image.save(output / 'game-design-main-idea-work.png', optimize=True)

    image, draw, y = page('Area using unit squares', '3', [
        '1. Tile this rectangle with unit squares. Show that its area equals the side lengths multiplied together.',
        'Write the multiplication equation and the area in square units.',
    ])
    draw.rectangle((185, y + 90, 785, y + 540), outline='#064d32', width=4)
    draw.text((430, y + 35), '4 units', font=font(28), fill='#202820')
    draw.text((800, y + 275), '3 units', font=font(28), fill='#202820')
    draw.text((65, y + 620), 'Equation: ______________________', font=font(27), fill='#202820')
    draw.text((65, y + 690), 'Area: __________________________', font=font(27), fill='#202820')
    image.save(output / 'game-design-area-work.png', optimize=True)

    image, draw, y = page('Write a story opening', '3', [
        '1. Write the opening of a new story. Introduce a character and a setting, and show the situation that starts the story.',
        'You choose the character, place, and starting situation.',
    ])
    for index in range(8):
        draw.line((65, y + 70 + index * 85, 1020, y + 70 + index * 85), fill='#aebcaf', width=2)
    image.save(output / 'game-design-writing-work.png', optimize=True)


if __name__ == '__main__':
    main()
