// Steady Percent Each Step. Skill F-LE.A.1-3.
// Recognizing situations in which a quantity grows or decays by a constant percent rate. Using a constant difference instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Steady Percent Each Step",
  emoji: "🧫",
  premise: "When a quantity grows or shrinks by the same percent in each time step, an exponential model fits it.",
  outro: "A constant percent rate per unit interval means exponential growth or decay.",
  scene: "night",
  kind: "pick",
  fs: 4.8,
  hint: "Does the change depend on how much there is right now?",
  tag: "constant_difference_for_percent",
  rounds: [
    { say: "Tap every situation with a constant percent change.", yes: "A population grows 5% a year.|A car loses 15% of its value yearly.|Bacteria double every hour.", no: "A tree grows 30 cm a year.|A plan adds $10 a month.", trap: "-Bacteria double every hour.", why: "Doubling is a 100% increase each hour. It counts.", win: "Percent change means exponential." },
    { say: "Which model fits each situation?", kind: "fill", fs: 5, cast: "", rows: [["$1,000 earning 4% a year", "1000(1.04)^t"], ["$1,000 gaining $40 a year", "1000 + 40t"]], extra: "1000 + 0.04t|", trap: [0, "1000 + 40t"], why: "4% of a growing balance is more than $40 after the first year.", win: "Percent: exponential. Amount: linear." },
    { say: "Tap every constant-percent situation by yourself.", yes: "A medicine level halves every 6 hours.|Rent rises 3% each year.", no: "A candle burns 1 cm an hour.|You walk 4 km a day.|A tank gains 9 liters a minute.|Pay rises $500 a year.", trap: "-A medicine level halves every 6 hours." },
  ],
}));
