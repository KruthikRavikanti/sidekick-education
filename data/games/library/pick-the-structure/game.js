// Pick the Structure. Skill W.6.2-1.
// Introducing a topic and organizing ideas using strategies such as definition, comparison and cause/effect. Disorganized writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pick the Structure",
  emoji: "🗂️",
  premise: "Informative writing needs a plan. The topic tells you which structure fits: definition, comparison or cause and effect.",
  outro: "Choose a structure that matches the topic: define it, compare it, or explain causes and effects.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Is the topic asking what it is, how two things differ, or why something happens?",
  tag: "disorganized",
  rounds: [
    { say: "Which structure fits each topic?", rows: [["how frogs and toads differ", "comparison"], ["why volcanoes erupt", "cause and effect"], ["what a habitat is", "definition"]], trap: [1, "comparison"], why: "Why something happens is about causes and their effects.", win: "Compare, explain why, define." },
    { say: "Which structure fits each topic?", rows: [["what makes a planet a planet", "definition"], ["what happens when forests are cut", "cause and effect"], ["soccer and rugby side by side", "comparison"]], trap: [0, "comparison"], why: "Only one thing is being explained: what a planet is.", win: "Define, explain effects, compare." },
    { say: "Match these by yourself.", rows: [["why the tides rise and fall", "cause and effect"], ["how a novel differs from a play", "comparison"], ["what an ecosystem is", "definition"]], extra: "story order|", trap: [0, "comparison"] },
  ],
}));
