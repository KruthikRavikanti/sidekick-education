// Products With Roots. Skill N-RN.B.3-3.
// Knowing that the product of a nonzero rational and an irrational number is irrational. Thinking irrational × irrational is always irrational is the known slip.
Sidekick.game(Sidekick.play({
  title: "Products With Roots",
  emoji: "✖️",
  premise: "A nonzero rational times an irrational is irrational. Two irrationals multiplied can go either way.",
  outro: "Nonzero rational × irrational is irrational. Irrational × irrational may be rational: √2 × √8 = 4.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Multiply it out. Does the root disappear?",
  tag: "irrational_product_always_irrational",
  rounds: [
    { say: "Is each product rational or irrational?", bins: "Rational|Irrational", items: ["√3 × √3|√2 × √8|0 × π", "5 × √3|{1/2} × π"], trap: ["√2 × √8", 1], why: "√2 × √8 is √16, which is exactly 4.", win: "Check what the product becomes." },
    { say: "Work out each product.", kind: "fill", fs: 6, cast: "", rows: [["√3 × √3 =", "3"], ["√2 × √8 =", "4"], ["5 × √3 =", "5√3"]], extra: "√15", trap: [2, "√15"], why: "5 is outside the root. It stays in front: 5√3.", win: "3, 4 and 5√3." },
    { say: "Sort these by yourself.", bins: "Rational|Irrational", items: ["√5 × √5|√3 × √12|√2 × 0", "2 × √7|{3/4} × √2"], trap: ["√3 × √12", 1] },
  ],
}));
