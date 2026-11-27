// What the Numbers Mean. Skill 8.F.B.4-3.
// Interpreting the rate of change and initial value of a linear function in context. Giving numbers without meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Numbers Mean",
  emoji: "💬",
  premise: "Every number in a linear model means something in the story. Say it with its units.",
  outro: "The slope is a rate with units per unit. The intercept is the starting amount.",
  scene: "city",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Which number repeats for every hour? Which happens just once?",
  tag: "numbers_without_meaning",
  rounds: [
    { say: "The plumber model is y = 25x + 40. What does each part mean?", rows: [["25", "dollars per hour"], ["40", "the fee for coming"], ["x", "hours worked"]], extra: "hours per dollar|", trap: [0, "the fee for coming"], why: "25 multiplies the hours. It is the charge for each hour.", win: "Rate, starting fee, hours." },
    { say: "A candle follows h = −2t + 20. What does each part mean?", rows: [["20", "starting height in cm"], ["−2", "cm burned each hour"], ["t", "hours burning"]], trap: [0, "cm burned each hour"], why: "20 stands alone. It is the height at time 0.", win: "It starts at 20 and loses 2 each hour." },
    { say: "A phone plan follows c = 5g + 30. Match these by yourself.", rows: [["30", "the monthly base cost"], ["5", "dollars per gigabyte"], ["g", "gigabytes used"]], extra: "gigabytes per dollar|", trap: [1, "the monthly base cost"] },
  ],
}));
