// Order Matters for Matrices. Skill N-VM.C.9-1.
// Understanding that matrix multiplication for square matrices is not commutative. Assuming the order does not matter is the known slip.
Sidekick.game(Sidekick.play({
  title: "Order Matters for Matrices",
  emoji: "🔀",
  premise: "With numbers, 3 × 5 and 5 × 3 agree. With matrices, AB and BA can be completely different.",
  outro: "Matrix multiplication is not commutative: AB may not equal BA. It is still associative and distributive.",
  scene: "desk",
  kind: "type",
  icon: "🔀",
  hint: "Work out the same entry in AB and in BA. Compare.",
  tag: "assumes_commutative",
  rounds: [
    { say: "Key in the upper left entry of AB: row 1 of A times column 1 of B.", fig: { type: "mats", items: ["A =", "[1,1;0,1]", "B =", "[1,0;1,1]"], v: [] }, q: "1 × 1 + 1 × 1", ans: 2, trap: 1, why: "Add both pairs: 1 × 1 and 1 × 1.", win: "AB starts with 2." },
    { say: "Now key in the upper left entry of BA: row 1 of B times column 1 of A.", fig: { type: "mats", items: ["A =", "[1,1;0,1]", "B =", "[1,0;1,1]"], v: [] }, q: "1 × 1 + 0 × 0", ans: 1, trap: 2, why: "2 was the entry of AB. In BA the row comes from B: 1 and 0.", win: "BA starts with 1. So AB and BA differ." },
    { say: "Which rules always hold for matrices? Sort them by yourself.", kind: "sort", fs: 5.2, bins: "Always true|Not always true", items: ["A + B = B + A|(AB)C = A(BC)|A(B + C) = AB + AC", "AB = BA|"], trap: ["AB = BA", 0] },
  ],
}));
