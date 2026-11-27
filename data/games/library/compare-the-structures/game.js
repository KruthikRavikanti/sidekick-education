// Compare the Structures. Skill RI.5.5-1.
// Comparing and contrasting the overall structure of events, ideas or information in two or more texts. Not being able to name the structures is the known slip.
Sidekick.game(Sidekick.play({
  title: "Compare the Structures",
  emoji: "🏗️",
  premise: "Two texts on the same topic can be organized in different ways. Name how each one is built.",
  outro: "Compare text structures: chronology, comparison, cause/effect, problem/solution.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Does it go in time order, compare, show causes, or solve a problem?",
  tag: "cannot_name_structures",
  rounds: [
    { say: "Two texts about hurricanes. Name the structure of each.", rows: [["Text A: tells what happened hour by hour as the storm hit.", "chronology"], ["Text B: explains how warm ocean water leads to storms.", "cause and effect"]], extra: "a list of facts|", trap: [1, "a list of facts"], why: "It explains how one thing leads to another. That is cause and effect.", win: "Time order, and cause and effect." },
    { say: "Two texts about plastic. Name the structure of each.", rows: [["Text A: plastic fills the sea, so here are ways to cut waste.", "problem and solution"], ["Text B: how paper bags and plastic bags are alike and different.", "comparison"]], extra: "chronology|", trap: [0, "chronology"], why: "It names a problem, then offers fixes.", win: "Problem and solution, and comparison." },
    { say: "Two texts about the moon landing. Match by yourself.", rows: [["Text A: from launch to splashdown, day by day.", "chronology"], ["Text B: why the space race pushed the mission forward.", "cause and effect"]], extra: "comparison|problem and solution", trap: [0, "comparison"] },
  ],
}));
