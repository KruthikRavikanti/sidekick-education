// Every Name That Fits. Skill 5.G.B.4-1.
// Classifying two-dimensional figures in a hierarchy: a square is a quadrilateral, a parallelogram, a rectangle and a rhombus. Putting each shape in only one category is the known slip.
Sidekick.game(Sidekick.play({
  title: "Every Name That Fits",
  emoji: "🎟️",
  premise: "One shape can wear many name tags at once. Tap every name that is true for it.",
  outro: "A shape can belong to several categories at the same time.",
  scene: "candy",
  kind: "pick",
  hint: "Check each name on its own. Does the shape have what that name needs?",
  tag: "one_category_only",
  rounds: [
    { say: "Tap every name that fits a square.", q: "A square: 4 equal sides and 4 right angles.", yes: "quadrilateral|parallelogram|rectangle|rhombus", no: "triangle|pentagon|circle", trap: "-rectangle", why: "A square has 4 right angles, so it is a rectangle too.", win: "A square has four names." },
    { say: "Tap every name that fits this rectangle.", q: "A rectangle 5 long and 2 wide: 4 right angles, sides not all equal.", yes: "quadrilateral|parallelogram|rectangle", no: "square|rhombus|triangle", trap: "square", why: "Its sides are not all equal, so it is not a square.", win: "Three names fit." },
    { say: "Tap every name that fits this rhombus.", q: "A rhombus: 4 equal sides, no right angles.", yes: "quadrilateral|parallelogram|rhombus", no: "rectangle|square|pentagon", trap: "-parallelogram" },
  ],
}));
