"""Generate original synthetic worksheets and their expected transcriptions.

Run with Python and Pillow: python scripts/generate_fixtures.py
No student data or downloaded source material is used.
"""

from __future__ import annotations

import hashlib
import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / "public" / "samples"
FIXTURES = ROOT / "fixtures"
INK = "#242C36"
PENCIL = "#325999"
RULE = "#D9DCE1"


def font(size: int, handwriting: bool = False, bold: bool = False):
    names = (
        ["/System/Library/Fonts/Supplemental/Bradley Hand Bold.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf"]
        if handwriting
        else [
            f"/System/Library/Fonts/Supplemental/Arial{' Bold' if bold else ''}.ttf",
            f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
        ]
    )
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default(size=size)


def field(text: str | None, uncertain: bool = False):
    return {"text": text, "uncertain": uncertain}


def work(status: str, steps=(), final=None, selected=None, uncertain=False):
    return {
        "steps": [field(step, uncertain) for step in steps],
        "final_answer": field(final, uncertain),
        "selected_choice": field(selected),
        "status": status,
    }


def problem(identifier, label, question, student_work, *, choices=(), refs=(), unclear=False):
    return {
        "id": identifier,
        "label": field(label),
        "question": field(question, unclear),
        "answer_choices": [{"label": field(key), "text": field(text)} for key, text in choices],
        "context_refs": list(refs),
        "student_work": student_work,
    }


def page(title, subtitle, directions):
    image = Image.new("RGB", (1200, 1600), "#FFFFFF")
    draw = ImageDraw.Draw(image)
    draw.text((85, 60), "SIDEKICK  /  SYNTHETIC WORKSHEET", font=font(18, bold=True), fill="#69717D")
    draw.text((85, 112), title, font=font(44, bold=True), fill=INK)
    draw.text((85, 176), subtitle, font=font(24), fill=INK)
    draw.line((85, 220, 1115, 220), fill=RULE, width=2)
    draw.text((85, 245), directions, font=font(25), fill=INK)
    return image, draw


def rule(draw, y):
    draw.line((85, y, 1115, y), fill=RULE, width=2)


def smudge(draw, box, seed):
    """Deliberately occlude a region so its underlying writing is indeterminate."""
    rng = random.Random(seed)
    x0, y0, x1, y1 = box
    for _ in range(95):
        x = rng.randint(x0, x1)
        y = rng.randint(y0, y1)
        draw.line((x, y, min(x + rng.randint(5, 60), x1), min(y + rng.randint(-15, 15), y1)), fill="#67748A", width=rng.randint(2, 6))


def make_math():
    directions = "Solve each problem. Show your work. Use the table for 4(a)."
    image, draw = page("Fraction practice", "Grade 4   |   Name: Alex   |   Date: November 9", directions)
    draw.text((85, 325), "1.  1/2 + 1/3 =", font=font(32), fill=INK)
    draw.text((150, 390), "1 + 1 = 2", font=font(34, handwriting=True), fill=PENCIL)
    draw.text((150, 438), "2 + 3 = 5", font=font(34, handwriting=True), fill=PENCIL)
    draw.text((150, 486), "1/2 + 1/3 = 2/5", font=font(34, handwriting=True), fill=PENCIL)
    draw.text((745, 486), "Answer: 2/5", font=font(34, handwriting=True), fill=PENCIL)
    rule(draw, 555)
    draw.text((85, 595), "2.  2/5 + 1/5 =", font=font(32), fill=INK)
    draw.line((760, 685, 1050, 685), fill=RULE, width=2)
    rule(draw, 735)
    draw.text((85, 775), "3.  3/4 - 1/4 =", font=font(32), fill=INK)
    draw.text((150, 850), "3/", font=font(35, handwriting=True), fill=PENCIL)
    smudge(draw, (197, 854, 440, 890), 29)
    smudge(draw, (790, 855, 1045, 897), 41)
    rule(draw, 950)
    draw.text((85, 985), "Recipe table", font=font(26, bold=True), fill=INK)
    table = [("Ingredient", "Amount"), ("Flour", "3/4 cup"), ("Sugar", "1/4 cup")]
    for index, (left, right) in enumerate(table):
        top = 1030 + index * 58
        draw.rectangle((85, top, 620, top + 58), outline=RULE, width=2)
        draw.line((365, top, 365, top + 58), fill=RULE, width=2)
        draw.text((105, top + 13), left, font=font(25, bold=index == 0), fill=INK)
        draw.text((390, top + 13), right, font=font(25, bold=index == 0), fill=INK)
    draw.text((85, 1240), "4(a).  How much more flour than sugar is in the recipe?", font=font(30), fill=INK)
    draw.text((135, 1300), "A.  1/4 cup       B.  1/2 cup       C.  1 cup", font=font(29), fill=INK)
    draw.ellipse((315, 1288, 371, 1343), outline=PENCIL, width=5)
    draw.text((150, 1380), "3/4 - 1/4 = 2/4 = 1/2", font=font(34, handwriting=True), fill=PENCIL)
    draw.text((85, 1535), "Original synthetic example. Blue writing represents a student's response.", font=font(18), fill="#69717D")
    result = {
        "worksheet": {
            "title": field("Fraction practice"), "subject": "math", "subject_uncertain": False,
            "printed_grade": field("Grade 4"), "directions": [field(directions)],
            "shared_context": [{"id": "recipe-table", "type": "table", "title": field("Recipe table"), "content": field("Ingredient | Amount\nFlour | 3/4 cup\nSugar | 1/4 cup")}],
        },
        "problems": [
            problem("math-1", "1", "1/2 + 1/3 =", work("answered", ["1 + 1 = 2", "2 + 3 = 5", "1/2 + 1/3 = 2/5"], "2/5")),
            problem("math-2", "2", "2/5 + 1/5 =", work("blank")),
            problem("math-3", "3", "3/4 - 1/4 =", work("unclear", ["3/"], uncertain=True)),
            problem("math-4a", "4(a)", "How much more flour than sugar is in the recipe?", work("answered", ["3/4 - 1/4 = 2/4 = 1/2"], selected="B"), choices=[("A", "1/4 cup"), ("B", "1/2 cup"), ("C", "1 cup")], refs=["recipe-table"]),
        ],
    }
    return image, result


def make_ela():
    directions = "Read the passage. Answer the questions using details from the text."
    passage = (
        "It was the first warm morning of spring. Maya carried a small pot\n"
        "to the school garden. The soil was dry, so she filled a watering can.\n"
        "After she watered the seed, Maya set the pot in a sunny spot.\n"
        "\"I will check on you tomorrow,\" she whispered. As she walked\n"
        "back to class, she was already imagining a bright yellow flower."
    )
    image, draw = page("A seed for tomorrow", "Grade 3   |   Name: Alex   |   Date: November 9", directions)
    draw.rounded_rectangle((85, 320, 1115, 613), radius=8, fill="#F5F6F8", outline=RULE, width=2)
    draw.text((112, 341), "A seed for tomorrow", font=font(27, bold=True), fill=INK)
    draw.multiline_text((112, 391), passage, font=font(27), spacing=15, fill=INK)
    draw.text((85, 660), "1.  What season is it in the story?", font=font(30), fill=INK)
    draw.text((145, 722), "The story happens in winter.", font=font(34, handwriting=True), fill=PENCIL)
    rule(draw, 795)
    draw.text((85, 835), "2.  Why does Maya fill a watering can?", font=font(30), fill=INK)
    draw.line((145, 935, 1070, 935), fill=RULE, width=2)
    rule(draw, 970)
    draw.text((85, 1010), "3.  Why does", font=font(30), fill=INK)
    smudge(draw, (275, 1007, 800, 1046), 99)
    draw.text((820, 1010), "at the end?", font=font(30), fill=INK)
    draw.text((145, 1080), "because she", font=font(34, handwriting=True), fill=PENCIL)
    smudge(draw, (328, 1080, 990, 1124), 12)
    rule(draw, 1175)
    draw.text((85, 1215), "4(a).  What does Maya imagine?", font=font(30), fill=INK)
    draw.text((140, 1274), "A. A red apple", font=font(28), fill=INK)
    draw.text((140, 1324), "B. A bright yellow flower", font=font(28), fill=INK)
    draw.text((140, 1374), "C. A rainy afternoon", font=font(28), fill=INK)
    draw.ellipse((122, 1314, 177, 1366), outline=PENCIL, width=4)
    draw.text((85, 1535), "Original synthetic example. Blue writing represents a student's response.", font=font(18), fill="#69717D")
    result = {
        "worksheet": {
            "title": field("A seed for tomorrow"), "subject": "ela", "subject_uncertain": False,
            "printed_grade": field("Grade 3"), "directions": [field(directions)],
            "shared_context": [{"id": "seed-passage", "type": "passage", "title": field("A seed for tomorrow"), "content": field(passage)}],
        },
        "problems": [
            problem("ela-1", "1", "What season is it in the story?", work("answered", final="The story happens in winter."), refs=["seed-passage"]),
            problem("ela-2", "2", "Why does Maya fill a watering can?", work("blank"), refs=["seed-passage"]),
            problem("ela-3", "3", "Why does … at the end?", work("unclear", ["because she"], uncertain=True), refs=["seed-passage"], unclear=True),
            problem("ela-4a", "4(a)", "What does Maya imagine?", work("answered", selected="B"), choices=[("A", "A red apple"), ("B", "A bright yellow flower"), ("C", "A rainy afternoon")], refs=["seed-passage"]),
        ],
    }
    return image, result


def main():
    SAMPLES.mkdir(parents=True, exist_ok=True)
    FIXTURES.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, build in (("math", make_math), ("ela", make_ela)):
        image, result = build()
        image_path = SAMPLES / f"{name}-worksheet.png"
        image.save(image_path, format="PNG", optimize=True)
        (FIXTURES / f"{name}.json").write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
        manifest[hashlib.sha256(image_path.read_bytes()).hexdigest()] = name
    (FIXTURES / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("Generated Math and ELA PNGs, expected JSON, and SHA-256 manifest.")


if __name__ == "__main__":
    main()
