// Inequality Solver. Skill A-REI.B.3-2.
// Solving linear inequalities in one variable. Forgetting to flip the sign for negative multipliers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Inequality Solver",
  emoji: "🎚️",
  premise: "Solve an inequality like an equation, but flip the sign whenever you multiply or divide by a negative.",
  outro: "Dividing both sides by a negative number reverses the inequality.",
  scene: "night",
  kind: "fill",
  fs: 6,
  figW: 20,
  cast: "",
  hint: "Did you divide by a negative number? Then turn the sign around.",
  tag: "forgets_to_flip",
  rounds: [
    { say: "Solve each inequality.", rows: [["−3x + 4 ≥ 13", "x ≤ −3"], ["3x + 4 ≥ 13", "x ≥ 3"]], extra: "x ≥ −3|", trap: [0, "x ≥ −3"], why: "Dividing by −3 flips ≥ to ≤. Test x = 0: is 4 at least 13?", win: "The negative divisor flipped the first one." },
    { say: "Match each inequality to the graph of its solution.", rows: [["−2x > 6", "~ineq:o:l:-3"], ["2x ≥ −6", "~ineq:c:r:-3"]], extra: "~ineq:o:r:-3", trap: [0, "~ineq:o:r:-3"], why: "Dividing by −2 flips the sign: x is less than −3.", win: "x < −3, and x ≥ −3." },
    { say: "Solve these by yourself.", rows: [["−5x + 2 < 12", "x > −2"], ["5x + 2 < 12", "x < 2"], ["−x ≥ 4", "x ≤ −4"]], extra: "x < −2|x ≥ −4", trap: [0, "x < −2"] },
  ],
}));
