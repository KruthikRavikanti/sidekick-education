// Squares on the Sides. Skill 8.G.B.6-1.
// Explaining a proof of the Pythagorean theorem. Memorizing the formula without meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Squares on the Sides",
  emoji: "🟧",
  premise: "Build a square on each side of a right triangle. The two smaller squares together cover exactly as much as the big one.",
  outro: "In a right triangle, the squares on the legs add up to the square on the hypotenuse: a² + b² = c².",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "The area of a square is its side times itself.",
  tag: "formula_without_meaning",
  rounds: [
    { say: "A square is built on each side. Match each square to its area.", fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["4", "5", "3"], right: 0, v: [] }, rows: [["square on the side of 3", "9"], ["square on the side of 4", "16"], ["square on the side of 5", "25"]], extra: "10 12", trap: [2, "10"], why: "10 is 5 doubled. A square on a side of 5 has area 5 × 5.", win: "9 + 16 = 25. The small squares fill the big one." },
    { say: "Key in the area of the square on the longest side.", kind: "type", icon: "🟧", q: "The squares on the two legs have areas 36 and 64.", ans: 100, trap: 10, why: "10 is the side length. The area is 36 + 64.", win: "36 + 64 = 100." },
    { say: "Find the area of the big square by yourself.", kind: "type", icon: "🟧", alt: [{ q: "The squares on the two legs have areas 25 and 144.", ans: 169, trap: 13 }, { q: "The squares on the two legs have areas 9 and 16.", ans: 25, trap: 5 }, { q: "The squares on the two legs have areas 64 and 225.", ans: 289, trap: 17 }] },
  ],
}));
