// What the Discriminant Says. Skill N-CN.C.7-2.
// Using the discriminant to predict the type of solutions. Misreading the sign of the discriminant is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Discriminant Says",
  emoji: "🔮",
  premise: "The number under the root in the quadratic formula, b^2 − 4ac, predicts the kind of solutions before you solve.",
  outro: "Discriminant positive: two real. Zero: one real. Negative: two complex.",
  scene: "night",
  kind: "sort",
  fs: 5,
  hint: "Positive, zero or negative? That is all you need.",
  tag: "misreads_discriminant_sign",
  rounds: [
    { say: "Sort each discriminant by the kind of solutions it gives.", bins: "Two real|One real|Two complex", items: ["16|5", "0|", "−16|−3"], trap: ["−16", 0], why: "A negative under the square root gives imaginary parts.", win: "The sign decides." },
    { say: "Key in the discriminant of x^2 + 2x + 5 = 0. Use the ± key.", kind: "type", icon: "🔮", q: "b^2 − 4ac with a = 1, b = 2, c = 5", ans: -16, trap: 16, why: "4 − 20 is below zero: −16.", win: "2^2 − 4(1)(5) = −16, so two complex solutions." },
    { say: "Each card is b^2 − 4ac for some equation. Work it out and sort it by yourself.", bins: "Two real|One real|Two complex", items: ["25 − 24|0 + 28", "36 − 36|", "4 − 20|1 − 4"], trap: ["4 − 20", 0] },
  ],
}));
