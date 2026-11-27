// Show the Relationship. Skill W.8.6-1.
// Using technology to produce and publish writing and present the relationships between information and ideas. Leaving the tools unused is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show the Relationship",
  emoji: "📊",
  premise: "Digital tools can show how ideas connect. Pick the visual that matches the relationship you want readers to see.",
  outro: "Use technology to present the relationships between information and ideas clearly.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is it a sequence, a comparison, a cause, or parts of a whole?",
  tag: "tools_unused",
  rounds: [
    { say: "Which visual best shows each relationship?", rows: [["events in order over 50 years", "timeline"], ["how two novels are alike and different", "Venn diagram"], ["what leads to what", "flowchart"]], trap: [1, "timeline"], why: "Alike and different is a comparison. Overlapping circles show that.", win: "Sequence, comparison, cause." },
    { say: "Which visual fits?", rows: [["shares of a budget", "pie chart"], ["temperature change across a year", "line graph"], ["steps of an experiment", "numbered list"]], trap: [0, "line graph"], why: "Shares of a whole are slices. A pie chart shows them.", win: "Parts, change over time, steps." },
    { say: "Match these by yourself.", rows: [["causes of the war and their results", "flowchart"], ["two characters compared", "Venn diagram"], ["population over a century", "line graph"]], extra: "pie chart|", trap: [2, "pie chart"] },
  ],
}));
