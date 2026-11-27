// Parts of an Expression. Skill 6.EE.A.2-2.
// Identifying parts of an expression using mathematical terms. Calling a coefficient a term is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parts of an Expression",
  emoji: "🧩",
  premise: "Expressions have named parts. A coefficient multiplies a variable. A term is a piece joined by plus or minus.",
  outro: "In 3x + 7: 3 is the coefficient, x is the variable, 7 is a constant, and 3x and 7 are terms.",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Is it multiplying a letter, or standing alone?",
  tag: "coefficient_called_term",
  rounds: [
    { say: "In 3x + 7, name each part.", rows: [["3", "coefficient"], ["x", "variable"], ["7", "constant"]], extra: "exponent", trap: [0, "constant"], why: "The 3 multiplies x. A number multiplying a variable is a coefficient.", win: "Coefficient, variable, constant." },
    { say: "In 5y + 2, name each part.", rows: [["5y", "term"], ["5", "coefficient"], ["5 and y", "factors"], ["2", "constant"]], trap: [1, "term"], why: "The term is the whole piece 5y. The 5 alone is the coefficient.", win: "Term, coefficient, factors, constant." },
    { say: "In 4a + 9, name each part by yourself.", rows: [["4", "coefficient"], ["a", "variable"], ["9", "constant"], ["4a", "term"]], extra: "sum", trap: [0, "term"] },
  ],
}));
