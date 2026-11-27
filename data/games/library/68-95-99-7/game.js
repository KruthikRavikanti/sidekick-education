// 68, 95, 99.7. Skill S-ID.A.4-2.
// Estimating population percentages with the empirical rule and z-scores. Mixing up the 68, 95 and 99.7 ranges is the known slip.
Sidekick.game(Sidekick.play({
  title: "68, 95, 99.7",
  emoji: "📊",
  premise: "In any normal distribution, about 68% of values fall within one standard deviation of the mean, and 95% within two.",
  outro: "Empirical rule: within 1 SD about 68%, within 2 SDs about 95%, within 3 SDs about 99.7%.",
  scene: "paper",
  kind: "type",
  icon: "📊",
  unit: "%",
  hint: "How many standard deviations from the mean does the range reach on each side?",
  tag: "mixes_empirical_ranges",
  rounds: [
    { say: "Scores are normal with mean 70 and standard deviation 10. Key in the percent between 60 and 80.", ans: 68, trap: 95, why: "60 to 80 is one standard deviation each way. 95% is for two.", win: "Within one standard deviation: about 68%." },
    { say: "Same scores. Key in the percent between 50 and 90.", ans: 95, trap: 68, why: "50 to 90 reaches two standard deviations each way.", win: "Within two standard deviations: about 95%." },
    { say: "Solve it by yourself.", alt: [{ q: "Mean 100, standard deviation 15. Percent between 85 and 115?", ans: 68, trap: 95 }, { q: "Mean 100, standard deviation 15. Percent between 70 and 130?", ans: 95, trap: 68 }, { q: "Mean 50, standard deviation 5. Percent between 40 and 60?", ans: 95, trap: 68 }] },
  ],
}));
