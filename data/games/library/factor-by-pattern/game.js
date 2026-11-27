// Factor by Pattern. Skill A-SSE.A.2-2.
// Factoring expressions using common factors, grouping and special patterns. Treating (a + b)² as a² + b² is the known slip.
Sidekick.game(Sidekick.play({
  title: "Factor by Pattern",
  emoji: "🧩",
  premise: "Factoring undoes multiplying. Look for a common factor first, then for a pattern such as a perfect square.",
  outro: "x² + 6x + 9 = (x + 3)². A square of a sum always has a middle term.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Multiply your answer back out. Do you get every term?",
  tag: "square_of_sum_slip",
  rounds: [
    { say: "Expand each square.", rows: [["(x + 3)^2 =", "x^2 + 6x + 9"], ["(x − 3)^2 =", "x^2 − 6x + 9"]], extra: "x^2 + 9|", trap: [0, "x^2 + 9"], why: "(x + 3)(x + 3) also makes 3x + 3x. The middle term is 6x.", win: "Three terms every time." },
    { say: "Factor each expression.", rows: [["x^2 + 6x + 9", "(x + 3)^2"], ["3x^2 + 6x", "3x(x + 2)"], ["x^2 + 5x + 6", "(x + 2)(x + 3)"]], extra: "(x + 9)^2|", trap: [0, "(x + 9)^2"], why: "The last term is 3 × 3 and the middle is 3 + 3.", win: "A square, a common factor, a pair." },
    { say: "Factor these by yourself.", rows: [["x^2 + 10x + 25", "(x + 5)^2"], ["2x^2 + 8x", "2x(x + 4)"], ["x^2 + 7x + 12", "(x + 3)(x + 4)"]], extra: "(x + 25)^2|2x(x + 8)", trap: [0, "(x + 25)^2"] },
  ],
}));
