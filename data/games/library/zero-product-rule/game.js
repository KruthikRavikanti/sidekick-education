// Zero Product Rule. Skill A-REI.B.4-3.
// Solving quadratic equations by factoring. Setting factors equal to a nonzero number is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zero Product Rule",
  emoji: "🅾️",
  premise: "If two things multiply to zero, one of them must be zero. That only works for zero, so get zero on one side first.",
  outro: "Factor with 0 on one side. Then set each factor equal to 0.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Is one side exactly 0? Then each factor can be 0.",
  tag: "factors_equal_nonzero",
  rounds: [
    { say: "Solve each equation by factoring.", rows: [["x^2 − 5x + 6 = 0", "x = 2 or x = 3"], ["x^2 − 5x = 0", "x = 0 or x = 5"]], extra: "x = 5 only|", trap: [1, "x = 5 only"], why: "x(x − 5) = 0 also works when x itself is 0.", win: "Two factors, two solutions." },
    { say: "Is each equation ready for the zero product rule?", kind: "sort", fs: 5.2, bins: "Ready|Not yet", items: ["(x − 2)(x − 3) = 0|x(x + 4) = 0", "(x − 2)(x − 3) = 6|(x + 1)(x + 2) = 2"], trap: ["(x − 2)(x − 3) = 6", 0], why: "A product of 6 could be 2 × 3 or 1 × 6. Only a product of 0 forces a factor to be 0.", win: "Zero on one side first." },
    { say: "Solve these by yourself.", rows: [["x^2 + x − 12 = 0", "x = 3 or x = −4"], ["x^2 − 9 = 0", "x = 3 or x = −3"], ["x^2 + 2x = 0", "x = 0 or x = −2"]], extra: "x = −2 only|x = 4 or x = −3", trap: [2, "x = −2 only"] },
  ],
}));
