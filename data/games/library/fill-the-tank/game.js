// Fill the Tank. Skill 5.MD.C.5-2.
// Applying V = l × w × h and V = B × h. Treating the base area as if it were a length, or adding the dimensions, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fill the Tank",
  emoji: "🐟",
  premise: "Volume is length × width × height. If you already know the area of the base, just multiply it by the height.",
  outro: "V = length × width × height, or V = base area × height.",
  scene: "ocean",
  kind: "type",
  hint: "The base area already has length × width in it. Multiply by the height.",
  tag: "confuses_base_area_with_length",
  rounds: [
    { say: "Key in the volume in cubic centimeters.", fig: { type: "cubes", d: [5, 3, 2], solid: true, l: ["5 cm", "3 cm", "2 cm"], v: [] }, ans: 30, trap: 10, why: "Adding gives a length. Volume multiplies all three sides.", win: "5 × 3 × 2 = 30 cubic centimeters." },
    { say: "The base of this tank covers 20 square feet. Key in the volume in cubic feet.", fig: { type: "cubes", d: [5, 4, 6], solid: true, l: ["", "", "6 ft"], v: [] }, q: "Base area: 20 square feet. Height: 6 feet.", ans: 120, trap: 26, why: "Each foot of height adds another layer of 20 cubic feet.", win: "20 × 6 = 120 cubic feet." },
    { say: "Key in the volume by yourself.", alt: [{ q: "A box is 6 cm long, 4 cm wide and 3 cm high. What is its volume in cubic cm?", ans: 72, trap: 13 }, { q: "A pool has a base area of 15 square meters and is 4 meters deep. What is its volume in cubic meters?", ans: 60, trap: 19 }, { q: "A cube has edges 3 inches long. What is its volume in cubic inches?", ans: 27, trap: 9 }] },
  ],
}));
