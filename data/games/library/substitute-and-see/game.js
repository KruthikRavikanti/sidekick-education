// Substitute and See. Skill 6.EE.B.5-2.
// Using substitution to determine whether a given number makes an equation or inequality true. Substituting into only part of the expression is the known slip.
Sidekick.game(Sidekick.play({
  title: "Substitute and See",
  emoji: "🔍",
  premise: "To check a possible solution, put it in and compute the WHOLE left side. Then compare.",
  outro: "Substitute the value, compute fully, and check whether the statement is true.",
  scene: "desk",
  kind: "sort",
  fs: 5.4,
  hint: "Replace x everywhere, then finish the arithmetic before comparing.",
  tag: "substitutes_partly",
  rounds: [
    { say: "Is the value a solution? Substitute to check.", bins: "Solution|Not a solution", items: ["x = 6 in 2x + 1 > 12|x = 4 in 3x = 12", "x = 5 in 2x + 1 > 12|x = 4 in x + 9 = 12"], trap: ["x = 5 in 2x + 1 > 12", 0], why: "2 × 5 + 1 is 11, and 11 is not greater than 12.", win: "Each one checked by substituting." },
    { say: "Check these.", bins: "Solution|Not a solution", items: ["n = 7 in n − 3 = 4|n = 2 in 5n < 12", "n = 3 in 5n < 12|n = 7 in 2n = 12"], trap: ["n = 3 in 5n < 12", 0], why: "5 × 3 is 15, which is not less than 12.", win: "Substitution settles it." },
    { say: "Check these by yourself.", bins: "Solution|Not a solution", items: ["y = 8 in y ÷ 2 = 4|y = 10 in y + 5 ≥ 15", "y = 9 in y ÷ 2 = 4|y = 6 in 3y − 2 = 20"], trap: ["y = 6 in 3y − 2 = 20", 0] },
  ],
}));
