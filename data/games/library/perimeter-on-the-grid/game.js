// Perimeter on the Grid. Skill G-GPE.B.7-1.
// Using coordinates and the distance formula to compute perimeters of polygons. Adding coordinates, or leaving out the slanted side, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Perimeter on the Grid",
  emoji: "🧮",
  premise: "Flat sides are easy to count. A slanted side needs the distance formula, which is the Pythagorean theorem in disguise.",
  outro: "Find each side length (count, or use the distance formula), then add them all.",
  scene: "paper",
  kind: "type",
  hint: "The slanted side is the hypotenuse of a right triangle: run² + rise².",
  tag: "skips_slanted_side",
  rounds: [
    { say: "Key in the perimeter of the triangle.", fig: { type: "graph", fn: "none", shapes: [{ pts: [[0, 0], [3, 0], [3, 4]], name: "" }], win: [0, 8, 0, 8], h: 48, v: [] }, ans: 12, trap: 7, why: "3 + 4 leaves out the slanted side. It is √(9 + 16) = 5.", win: "3 + 4 + 5 = 12." },
    { say: "Key in the perimeter of the triangle.", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [7, 1], [7, 9]], name: "" }], win: [0, 10, 0, 10], h: 48, v: [] }, ans: 24, trap: 14, why: "The slanted side is √(36 + 64) = 10. Add it in.", win: "6 + 8 + 10 = 24." },
    { say: "Find the perimeter by yourself.", alt: [{ q: "A triangle with corners (0, 0), (4, 0), (4, 3)", ans: 12, trap: 7 }, { q: "A triangle with corners (0, 0), (5, 0), (5, 12)", ans: 30, trap: 17 }, { q: "A rectangle with corners (1, 1), (6, 1), (6, 4), (1, 4)", ans: 16, trap: 15 }] },
  ],
}));
