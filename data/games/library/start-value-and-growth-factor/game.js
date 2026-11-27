// Start Value and Growth Factor. Skill F-LE.B.5-2.
// Interpreting the parameters in an exponential function in terms of a context. Reading 1.03 as 103% growth is the known slip.
Sidekick.game(Sidekick.play({
  title: "Start Value and Growth Factor",
  emoji: "🚙",
  premise: "In an exponential model a·b^t, a is where it starts and b is what it is multiplied by each period.",
  outro: "a is the initial value. b is the growth factor: 1.03 means 3% growth, 0.85 means 15% loss.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Subtract 1 from the factor to get the percent change.",
  tag: "factor_as_percent_growth",
  rounds: [
    { say: "A car’s value is V = 20,000(0.85)^t. What does each number mean?", rows: [["20,000", "the starting value"], ["0.85", "keeps 85% each year"]], extra: "gains 85% each year|", trap: [1, "gains 85% each year"], why: "0.85 is less than 1. The car keeps 85% and loses 15%.", win: "Start value, and the share kept." },
    { say: "A town’s population is P = 300(1.03)^t. What does each number mean?", rows: [["300", "the starting population"], ["1.03", "grows 3% each year"]], extra: "grows 103% each year|", trap: [1, "grows 103% each year"], why: "1.03 is 100% kept plus 3% more.", win: "A 3 percent yearly rise." },
    { say: "A culture follows A = 50(2)^t. Match by yourself.", rows: [["50", "the amount at time 0"], ["2", "doubles each period"]], extra: "adds 2 each period|grows 2% each period", trap: [1, "adds 2 each period"] },
  ],
}));
