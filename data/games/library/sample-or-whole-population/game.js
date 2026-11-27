// Sample or Whole Population?. Skill S-IC.A.1-1.
// Understanding statistics as a process for making inferences about population parameters from a random sample. Treating a sample statistic as the exact population value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sample or Whole Population?",
  emoji: "🗳️",
  premise: "A statistic describes a sample you measured. A parameter describes the whole population, which you usually cannot measure.",
  outro: "A sample statistic estimates a population parameter. It is close, but rarely exact.",
  scene: "city",
  kind: "sort",
  fs: 4.8,
  hint: "Was everyone measured, or only some?",
  tag: "statistic_as_exact",
  rounds: [
    { say: "Statistic (from a sample) or parameter (the whole population)?", bins: "Sample statistic|Population parameter", items: ["52% of 200 voters surveyed|the average height of 50 students measured", "the true percent of all voters|the average height of every student"], trap: ["52% of 200 voters surveyed", 1], why: "Only 200 voters were asked. That number describes the sample.", win: "Some people: statistic. Everyone: parameter." },
    { say: "A random sample of 200 voters shows 52% support. Which conclusions are reasonable?", bins: "Reasonable|Not reasonable", items: ["True support is probably near 52%.|Another sample might give 49% or 55%.", "True support is exactly 52%.|The measure will certainly pass."], trap: ["True support is exactly 52%.", 0], why: "A different 200 voters would give a slightly different number.", win: "An estimate, with some wiggle room." },
    { say: "Sort these by yourself.", bins: "Sample statistic|Population parameter", items: ["the mean weight of 30 fish netted from a lake|40% of 500 shoppers polled", "the mean weight of all fish in the lake|the percent of all shoppers who would agree"], trap: ["40% of 500 shoppers polled", 1] },
  ],
}));
