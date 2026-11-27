// Area on the Grid. Skill G-GPE.B.7-2.
// Using coordinates to compute areas of triangles and rectangles. Using a slanted side as the height is the known slip.
Sidekick.game(Sidekick.play({
  title: "Area on the Grid",
  emoji: "🟩",
  premise: "For a triangle on a grid, the height is the straight-up distance from the base to the far corner, not a slanted side.",
  outro: "Triangle area = half × base × height, where the height is perpendicular to the base.",
  scene: "paper",
  kind: "type",
  hint: "Count the base along the bottom. Count the height straight up.",
  tag: "slanted_side_as_height",
  rounds: [
    { say: "Key in the area of the triangle.", fig: { type: "graph", fn: "none", shapes: [{ pts: [[0, 0], [6, 0], [2, 5]], name: "" }], win: [0, 8, 0, 8], h: 48, v: [] }, ans: 15, trap: 30, why: "30 is base × height. A triangle is half of that.", win: "Half of 6 × 5 is 15." },
    { say: "Key in the area of the rectangle.", fig: { type: "graph", fn: "none", shapes: [{ pts: [[1, 1], [7, 1], [7, 4], [1, 4]], name: "" }], win: [0, 8, 0, 8], h: 48, v: [] }, ans: 18, trap: 9, why: "9 adds the sides. Area multiplies: 6 across times 3 up.", win: "6 × 3 = 18." },
    { say: "Find the area by yourself.", alt: [{ q: "A triangle with corners (0, 0), (8, 0), (3, 4)", ans: 16, trap: 32 }, { q: "A triangle with corners (1, 0), (7, 0), (5, 6)", ans: 18, trap: 36 }, { q: "A triangle with corners (0, 0), (4, 0), (4, 7)", ans: 14, trap: 28 }] },
  ],
}));
