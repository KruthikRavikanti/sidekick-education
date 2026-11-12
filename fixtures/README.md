# Synthetic extraction fixtures

These are original synthetic worksheets, not real student records. The expected JSON is hand-authored ground truth for fixture mode and tests; it is not evidence of live vision accuracy.

- `math.json` matches `public/samples/math-worksheet.png`. Problem 1 preserves the incorrect answer `2/5` and the steps `1 + 1 = 2`, `2 + 3 = 5`, and `1/2 + 1/3 = 2/5` exactly. Problem 2 is blank. Problem 3 has a partially readable `3/` step and an unreadable final answer, so it is unclear. Problem 4(a) references a recipe table and has choice B circled.
- `ela.json` matches `public/samples/ela-worksheet.png`. Problem 1 preserves the incorrect response `The story happens in winter.` even though the passage says spring. Problem 2 is blank. Problem 3 has partly obscured question text and response text; it preserves `because she`, marks both affected fields uncertain, and leaves the final answer null. Problem 4(a) references the passage and has choice B circled.
- `activity-math.json` and `activity-ela.json` match their `public/samples/activity-*-work.png` pages. Each has one answered question with an incorrect response (`4` unit-fraction pieces or `mouses`).
- `activity-math-correct.json` and `activity-ela-correct.json` match their `public/samples/activity-*-correct-work.png` pages. Each has the same question with the correct visible response (`3` pieces or `mice`). Activity tests derive grading from these actual responses and verify that an activity is available while the skill stays `on_track`.
- `activity-math-general.json` and `activity-ela-general.json` match the corresponding `*-general-work.png` pages. They cover multiplicative comparisons and reading with text evidence. Browser tests map these clear questions through the normal analysis pipeline, then verify new activity composition/review through the real APIs when the library has no match. An ungraded uploaded answer is not made into incorrect support evidence.

Each worksheet has four problems in page order, including a subpart. A blank response has null answer fields with `uncertain: false`; an unreadable response has `status: "unclear"` and uncertainty on the affected fields.

`manifest.json` maps the SHA-256 digest of each exact PNG file to its fixture name. Explicit fixture mode accepts these known files only. Regenerating an image also regenerates the manifest.

To regenerate, install Pillow in a Python environment and run `python scripts/generate_fixtures.py` from the repository root. Font rendering can vary across operating systems; the manifest always matches the generated images.

Regenerate the six single-question activity-entry pages with `backend/.venv/bin/python scripts/generate_activity_fixtures.py`.
