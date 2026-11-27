// Distribution From Data. Skill S-MD.A.4-1.
// Developing a probability distribution from empirically assigned probabilities. Using counts instead of relative frequencies is the known slip.
Sidekick.game(Sidekick.play({
  title: "Distribution From Data",
  emoji: "🐾",
  premise: "When theory is not available, use data. Each probability is a relative frequency: the count divided by the total.",
  outro: "Empirical probability = count ÷ total. Then expected value = the sum of value × probability.",
  scene: "city",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Divide each count by the total number surveyed.",
  tag: "counts_not_frequencies",
  rounds: [
    { say: "Of 100 households, 20 have 0 pets, 50 have 1 and 30 have 2. Give each probability.", rows: [["P(0 pets)", "0.2"], ["P(1 pet)", "0.5"], ["P(2 pets)", "0.3"]], extra: "20 50", trap: [0, "20"], why: "20 is a count. A probability is a share: 20 out of 100.", win: "Count ÷ 100." },
    { say: "Key in the expected number of pets per household.", kind: "type", icon: "🐾", q: "0 × 0.2 + 1 × 0.5 + 2 × 0.3", ans: 1.1, trap: 1, why: "1 is the middle value. Weight each value by its probability.", win: "0 + 0.5 + 0.6 = 1.1 pets." },
    { say: "Key in the probability as a decimal by yourself.", kind: "type", icon: "🐾", alt: [{ q: "Of 50 games, a team scored 1 goal in 30 of them. P(1 goal)?", ans: 0.6, trap: 30 }, { q: "Of 200 cars, 100 carried 2 people. P(2 people)?", ans: 0.5, trap: 100 }, { q: "Of 40 students, 10 have no siblings. P(0 siblings)?", ans: 0.25, trap: 10 }] },
  ],
}));
