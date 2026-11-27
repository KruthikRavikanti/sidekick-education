// Two Ideas, One Argument. Skill RI.11-12.2-1.
// Determining two or more central ideas and analyzing how they interact. Finding one idea is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Ideas, One Argument",
  emoji: "🧬",
  premise: "Complex texts develop more than one central idea. The second idea often complicates or limits the first.",
  outro: "Determine two or more central ideas and explain how they interact and build on one another.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What is the first big point? What second point supports it, limits it or complicates it?",
  tag: "finds_one_idea",
  rounds: [
    { say: "Find both ideas and how they interact.", read: "Automation made factories far more productive. It also emptied the towns around them. An honest account must hold both.", rows: [["idea 1", "automation raises output"], ["idea 2", "automation empties towns"], ["interaction", "gain and loss share one cause"]], trap: [2, "automation empties towns"], why: "That is the second idea alone. The interaction links the two.", win: "Benefit and cost, tied together." },
    { say: "Find both ideas and how they interact.", read: "Antibiotics save millions of lives. Yet every dose gives bacteria another chance to adapt. Their success breeds their decline.", rows: [["idea 1", "antibiotics save lives"], ["idea 2", "overuse breeds resistance"], ["interaction", "more use means less effect"]], trap: [0, "overuse breeds resistance"], why: "The first sentence gives the benefit. Resistance is the complication.", win: "The second idea limits the first." },
    { say: "Match these by yourself.", read: "Cities need density to cut emissions. But dense cities trap heat. Planners must cool what they crowd.", rows: [["idea 1", "density lowers emissions"], ["idea 2", "density raises heat"], ["interaction", "one solution creates a new problem"]], extra: "cities are large|", trap: [2, "cities are large"] },
  ],
}));
