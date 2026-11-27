// Flip the Sign. Skill 7.EE.B.4-3.
// Solving inequalities of the form px + q > r. Forgetting to flip the sign when multiplying or dividing by a negative is the known slip.
Sidekick.game(Sidekick.play({
  title: "Flip the Sign",
  emoji: "🔀",
  premise: "Solving an inequality works like solving an equation, with one twist. Multiply or divide by a negative and the sign flips.",
  outro: "When you multiply or divide both sides by a negative number, reverse the inequality sign.",
  scene: "night",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Did you divide by a negative number? Then turn the sign around. Test a value to check.",
  tag: "forgets_to_flip",
  rounds: [
    { say: "Solve each inequality.", rows: [["−2x + 3 > 11", "x < −4"], ["2x + 3 > 11", "x > 4"]], extra: "x > −4|", trap: [0, "x > −4"], why: "Dividing by −2 flips the sign. Test x = 0: is 3 greater than 11?", win: "A negative divisor flipped the first one." },
    { say: "Solve these.", rows: [["−3x > 12", "x < −4"], ["3x > 12", "x > 4"], ["−x < 5", "x > −5"]], extra: "x < −5|", trap: [2, "x < −5"], why: "Dividing by −1 flips the sign. Test x = 0: is 0 less than 5? Yes.", win: "Two flips, one that stayed." },
    { say: "Solve these by yourself.", rows: [["−4x + 1 > 9", "x < −2"], ["4x + 1 > 9", "x > 2"], ["−5x ≤ 20", "x ≥ −4"]], extra: "x > −2|x ≤ −4", trap: [0, "x > −2"] },
  ],
}));
