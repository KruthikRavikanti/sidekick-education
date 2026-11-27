// The Long-Run Average. Skill S-MD.A.2-1.
// Calculating the expected value of a random variable as the mean of its distribution. Averaging the values without weighting is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Long-Run Average",
  emoji: "🎰",
  premise: "Expected value is the average you would get over a huge number of tries. Likely values count more than rare ones.",
  outro: "Expected value = the sum of each value times its probability.",
  scene: "desk",
  kind: "type",
  icon: "🎰",
  hint: "Multiply each value by its probability. Then add.",
  tag: "unweighted_average",
  rounds: [
    { say: "A spinner pays 0 dollars with probability 0.9 and 10 dollars with probability 0.1. Key in the expected value.", q: "0 × 0.9 + 10 × 0.1", ans: 1, trap: 5, why: "5 treats both results as equally likely. The 10 only comes up 1 time in 10.", win: "0 + 1 = 1 dollar per spin." },
    { say: "Key in the expected value of X.", fig: { type: "table", rows: [["x", 1, 2, 3], ["P(x)", 0.5, 0.3, 0.2]], v: [] }, q: "1 × 0.5 + 2 × 0.3 + 3 × 0.2", ans: 1.7, trap: 2, why: "2 is the plain middle. The value 1 is more likely, so the average is lower.", win: "0.5 + 0.6 + 0.6 = 1.7." },
    { say: "Find the expected value by yourself.", alt: [{ q: "Win 0 with probability 0.8, or 20 with probability 0.2.", ans: 4, trap: 10 }, { q: "Win 5 with probability 0.9, or 15 with probability 0.1.", ans: 6, trap: 10 }, { q: "Win 0 with probability 0.75, or 8 with probability 0.25.", ans: 2, trap: 4 }] },
  ],
}));
