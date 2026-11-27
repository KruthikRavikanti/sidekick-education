// Meaning of m and b. Skill F-LE.B.5-1.
// Interpreting the parameters in a linear function in terms of a context. Giving the meaning to the other parameter is the known slip.
Sidekick.game(Sidekick.play({
  title: "Meaning of m and b",
  emoji: "📞",
  premise: "In a linear model, the number multiplied by the variable is a rate. The number standing alone is the starting amount.",
  outro: "Interpret the slope as a rate per unit and the intercept as the initial value.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Which number is charged once? Which is charged for every minute?",
  tag: "swaps_parameter_meaning",
  rounds: [
    { say: "A phone bill is C = 25 + 0.10m for m minutes. What does each number mean?", rows: [["25", "the base fee in dollars"], ["0.10", "dollars per minute"]], extra: "minutes per dollar|", trap: [0, "dollars per minute"], why: "25 stands alone. It is charged once, whatever the minutes.", win: "A fixed fee and a rate." },
    { say: "A trip is modeled by d = 60t + 20. What does each number mean?", rows: [["60", "miles per hour"], ["20", "miles already traveled at the start"]], extra: "hours per mile|", trap: [1, "miles per hour"], why: "20 is not multiplied by time. It is the head start.", win: "Speed, and a head start." },
    { say: "Water left is w = 8 − 0.5d after d days. Match by yourself.", rows: [["8", "liters at the start"], ["0.5", "liters used each day"]], extra: "days per liter|liters at the end", trap: [1, "liters at the start"] },
  ],
}));
