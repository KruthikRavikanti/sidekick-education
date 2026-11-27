// Slope and Start in Context. Skill 8.SP.A.3-2.
// Interpreting the slope and intercept of a linear model in context. Giving units for the other quantity is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slope and Start in Context",
  emoji: "💡",
  premise: "In a model, the slope tells how much the output changes for each extra unit of input. The intercept is the output at zero.",
  outro: "Slope: change in the output per one unit of input. Intercept: the output when the input is 0.",
  scene: "desk",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "The slope is output per input. Which quantity is being predicted?",
  tag: "units_for_other_quantity",
  rounds: [
    { say: "In score = 8 × hours + 55, what does each number mean?", rows: [["8", "points gained per hour"], ["55", "score with no studying"]], extra: "hours per point|score after 8 hours", trap: [0, "hours per point"], why: "The model predicts score. The slope is points for each hour.", win: "Each extra hour adds about 8 points." },
    { say: "In height = 2 × weeks + 5, what does each number mean?", rows: [["2", "cm grown each week"], ["5", "height at week 0"]], extra: "weeks per cm|", trap: [0, "weeks per cm"], why: "The slope is height for each week: centimeters per week.", win: "It starts at 5 cm and gains 2 a week." },
    { say: "In cost = 4 × miles + 3, match these by yourself.", rows: [["4", "dollars per mile"], ["3", "cost before any miles"]], extra: "miles per dollar|cost after 3 miles", trap: [0, "miles per dollar"] },
  ],
}));
