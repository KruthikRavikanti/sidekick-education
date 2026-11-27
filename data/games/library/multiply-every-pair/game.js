// Multiply Every Pair. Skill A-APR.A.1-2.
// Multiplying polynomials. Multiplying only the first terms and the last terms is the known slip.
Sidekick.game(Sidekick.play({
  title: "Multiply Every Pair",
  emoji: "🔳",
  premise: "To multiply two brackets, every term in the first meets every term in the second. Four products, then combine.",
  outro: "(x + 3)(x − 5) = x² − 5x + 3x − 15 = x² − 2x − 15.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "First, outer, inner, last. Then add the two middle products.",
  tag: "first_and_last_only",
  rounds: [
    { say: "Multiply out each pair.", rows: [["(x + 3)(x − 5)", "x^2 − 2x − 15"], ["(x + 2)(x + 4)", "x^2 + 6x + 8"]], extra: "x^2 − 15|", trap: [0, "x^2 − 15"], why: "The outer and inner products are missing: −5x + 3x.", win: "Four products each." },
    { say: "Multiply out each pair.", rows: [["(2x + 1)(x + 3)", "2x^2 + 7x + 3"], ["(x − 4)(x − 1)", "x^2 − 5x + 4"], ["(x + 5)(x − 5)", "x^2 − 25"]], extra: "2x^2 + 3|", trap: [0, "2x^2 + 3"], why: "6x and x in the middle add to 7x.", win: "Here the middle terms cancelled only once." },
    { say: "Multiply these by yourself.", rows: [["(x + 6)(x − 2)", "x^2 + 4x − 12"], ["(3x + 2)(x + 1)", "3x^2 + 5x + 2"], ["(x − 3)(x − 3)", "x^2 − 6x + 9"]], extra: "x^2 − 12|x^2 + 9", trap: [0, "x^2 − 12"] },
  ],
}));
