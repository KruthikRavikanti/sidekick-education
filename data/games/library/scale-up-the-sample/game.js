// Scale Up the Sample. Skill 7.SP.A.2-1.
// Using data from a random sample to draw inferences about a population. Using the sample count as the population count is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scale Up the Sample",
  emoji: "🎒",
  premise: "A random sample is a small copy of the population. The fraction in the sample is your best guess for the fraction in the whole group.",
  outro: "Find the fraction in the sample, then take that fraction of the population.",
  scene: "city",
  kind: "type",
  icon: "🎒",
  hint: "What fraction of the sample is it? Take that fraction of everyone.",
  tag: "sample_count_as_population",
  rounds: [
    { say: "Key in your estimate for the whole school.", q: "10 of 40 sampled students walk. The school has 600 students.", ans: 150, trap: 10, why: "10 is only the sample. One quarter of the sample walks, so take one quarter of 600.", win: "One quarter of 600 is 150." },
    { say: "Key in your estimate for the lake.", q: "5 of 50 sampled fish are tagged. The lake has 1,000 fish.", ans: 100, trap: 5, why: "5 is just the sample. One tenth are tagged, so take one tenth of 1,000.", win: "One tenth of 1,000 is 100." },
    { say: "Estimate by yourself.", alt: [{ q: "8 of 20 sampled students like art. There are 300 students.", ans: 120, trap: 8 }, { q: "1 of 25 tested bulbs is broken. 500 bulbs were made.", ans: 20, trap: 1 }, { q: "30 of 60 sampled voters say yes. There are 2,000 voters.", ans: 1000, trap: 30 }] },
  ],
}));
