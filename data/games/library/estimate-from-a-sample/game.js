// Estimate From a Sample. Skill S-IC.B.4-1.
// Using data from a sample survey to estimate a population mean or proportion. Ignoring sampling variability is the known slip.
Sidekick.game(Sidekick.play({
  title: "Estimate From a Sample",
  emoji: "📋",
  premise: "A sample proportion is your best single guess for the whole population. Find it, and remember it is an estimate.",
  outro: "Estimate = count in the sample ÷ sample size. The true value is near it, not exactly it.",
  scene: "city",
  kind: "type",
  icon: "📋",
  unit: "%",
  hint: "Divide the count by the sample size, then turn it into a percent.",
  tag: "ignores_variability",
  rounds: [
    { say: "In a random sample of 400 people, 240 support a plan. Key in the estimated percent.", q: "240 ÷ 400", ans: 60, trap: 240, why: "240 is the count. As a share of 400 it is 60 out of every 100.", win: "About 60% of the population." },
    { say: "Which statements about that 60% are sound?", kind: "sort", fs: 4.8, unit: "", bins: "Sound|Not sound", items: ["About 60% of the population supports it.|A new sample might give 57% or 62%.", "Exactly 60% of the population supports it.|Every sample will give 60%."], trap: ["Every sample will give 60%.", 0], why: "Samples vary. Each one lands near the true value, not on it.", win: "An estimate comes with variability." },
    { say: "Estimate the percent by yourself.", alt: [{ q: "In a random sample of 200 students, 50 walk to school.", ans: 25, trap: 50 }, { q: "In a random sample of 500 voters, 350 plan to vote.", ans: 70, trap: 350 }, { q: "In a random sample of 50 bulbs, 4 are faulty.", ans: 8, trap: 4 }] },
  ],
}));
