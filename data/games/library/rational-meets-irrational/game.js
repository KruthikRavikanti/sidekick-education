// Rational Meets Irrational. Skill N-RN.B.3-2.
// Explaining why the sum of a rational and an irrational number is irrational. Thinking √2 + √2 = √4 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rational Meets Irrational",
  emoji: "🧪",
  premise: "Add a rational number to an irrational one and the result is always irrational. The messy decimal cannot be cancelled.",
  outro: "Rational + irrational is irrational. And √2 + √2 is 2√2, not √4.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Does an irrational part survive in the answer?",
  tag: "adds_under_the_root",
  rounds: [
    { say: "Is each result rational or irrational?", bins: "Rational|Irrational", items: ["√4 + 1|√2 − √2|0.5 + 3", "3 + √2|π − 1"], trap: ["3 + √2", 0], why: "Adding 3 just shifts √2. Its endless decimal is still there.", win: "An irrational part that survives keeps it irrational." },
    { say: "Work out each one.", kind: "fill", fs: 6, cast: "", rows: [["√2 + √2 =", "2√2"], ["√4 + √4 =", "4"], ["√2 × √2 =", "2"]], extra: "√4", trap: [0, "√4"], why: "Roots do not add under the sign. Two of the same root is 2√2.", win: "2√2, 4 and 2." },
    { say: "Sort these by yourself.", bins: "Rational|Irrational", items: ["√9 + 2|√5 − √5|{1/2} + {1/4}", "1 + √5|π + {1/2}"], trap: ["1 + √5", 0] },
  ],
}));
