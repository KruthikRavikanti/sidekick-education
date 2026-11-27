// Circle Equation. Skill G-GPE.A.1-1.
// Deriving the equation of a circle from the Pythagorean theorem. Forgetting to square the radius is the known slip.
Sidekick.game(Sidekick.play({
  title: "Circle Equation",
  emoji: "⭕",
  premise: "Every point on a circle is the same distance from the center. The Pythagorean theorem turns that into an equation.",
  outro: "A circle with center (h, k) and radius r: (x − h)^2 + (y − k)^2 = r^2.",
  scene: "paper",
  kind: "type",
  icon: "⭕",
  hint: "The right side is the radius times itself.",
  tag: "forgets_to_square_radius",
  rounds: [
    { say: "A circle has center (2, −3) and radius 5. Key in the number on the right side.", q: "(x − 2)^2 + (y + 3)^2 = ?", ans: 25, trap: 5, why: "The right side is r squared: 5 × 5.", win: "(x − 2)^2 + (y + 3)^2 = 25." },
    { say: "Match each circle to its equation.", kind: "fill", fs: 4.8, cast: "", rows: [["center (0, 0), radius 3", "x^2 + y^2 = 9"], ["center (1, 2), radius 3", "(x − 1)^2 + (y − 2)^2 = 9"], ["center (−1, −2), radius 3", "(x + 1)^2 + (y + 2)^2 = 9"]], extra: "x^2 + y^2 = 3|", trap: [0, "x^2 + y^2 = 3"], why: "Square the radius: 3 × 3 = 9.", win: "Subtract the center inside. Square the radius outside." },
    { say: "Key in the right side by yourself.", alt: [{ q: "Center (4, 1), radius 6: (x − 4)^2 + (y − 1)^2 = ?", ans: 36, trap: 6 }, { q: "Center (−2, 5), radius 4: (x + 2)^2 + (y − 5)^2 = ?", ans: 16, trap: 4 }, { q: "Center (0, −3), radius 7: x^2 + (y + 3)^2 = ?", ans: 49, trap: 7 }] },
  ],
}));
