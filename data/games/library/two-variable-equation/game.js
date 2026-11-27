// Two Variable Equation. Skill 6.EE.C.9-2.
// Writing an equation to express one quantity in terms of the other. Writing a one-variable expression instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Variable Equation",
  emoji: "🧾",
  premise: "An equation with two variables shows how one quantity is found from the other.",
  outro: "Write the dependent variable equal to a rule using the independent variable: p = 9h.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "It needs both letters and an equals sign.",
  tag: "one_variable_expression",
  rounds: [
    { say: "Write an equation for each situation.", rows: [["You earn $9 per hour. Pay p after h hours.", "p = 9h"], ["A plant grows 2 cm a week. Height h after w weeks.", "h = 2w"]], extra: "9h|", trap: [0, "9h"], why: "That is an expression. An equation says what p EQUALS.", win: "Two equations with two variables." },
    { say: "Write these equations.", rows: [["Each ticket costs $6. Cost c of t tickets.", "c = 6t"], ["A candle is 20 cm and burns 1 cm an hour. Height h after t hours.", "h = 20 − t"]], extra: "c = t + 6|", trap: [0, "c = t + 6"], why: "Each ticket costs 6, so multiply: 6 times t.", win: "c = 6t and h = 20 − t." },
    { say: "Write these by yourself.", rows: [["A car goes 50 miles an hour. Distance d after t hours.", "d = 50t"], ["You have $30 and save $5 a week. Total s after w weeks.", "s = 30 + 5w"]], extra: "50t|s = 35w", trap: [1, "s = 35w"] },
  ],
}));
