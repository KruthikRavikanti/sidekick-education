// Factor a Sum of Squares. Skill N-CN.C.8-1.
// Extending polynomial identities to the complex numbers. Thinking a sum of squares cannot be factored at all is the known slip.
Sidekick.game(Sidekick.play({
  title: "Factor a Sum of Squares",
  emoji: "🧩",
  premise: "x^2 + 4 will not factor with real numbers. With i, it splits just like a difference of squares.",
  outro: "x^2 + a^2 = (x + ai)(x − ai), because (ai)^2 = −a^2.",
  scene: "space",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Write the plus as minus a negative: x^2 − (−4). The root of −4 is 2i.",
  tag: "says_cannot_factor",
  rounds: [
    { say: "Factor each one.", rows: [["x^2 + 4", "(x + 2i)(x − 2i)"], ["x^2 − 4", "(x + 2)(x − 2)"]], extra: "cannot be factored|", trap: [0, "cannot be factored"], why: "Not with real numbers. But (x + 2i)(x − 2i) = x^2 − 4i^2 = x^2 + 4.", win: "A minus needs real roots. A plus needs i." },
    { say: "Which ones need complex numbers to factor?", kind: "sort", fs: 5.6, bins: "Real factors|Needs i", items: ["x^2 − 9|x^2 − 1", "x^2 + 9|x^2 + 1"], trap: ["x^2 + 9", 0], why: "No real number squares to −9. The factors are (x + 3i)(x − 3i).", win: "Sums of squares need i." },
    { say: "Factor these by yourself.", rows: [["x^2 + 25", "(x + 5i)(x − 5i)"], ["x^2 − 25", "(x + 5)(x − 5)"], ["x^2 + 1", "(x + i)(x − i)"]], extra: "cannot be factored|(x + 1)(x − 1)", trap: [0, "cannot be factored"] },
  ],
}));
