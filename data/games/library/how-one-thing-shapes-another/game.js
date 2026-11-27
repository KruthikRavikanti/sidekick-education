// How One Thing Shapes Another. Skill RI.7.3-1.
// Analyzing the interactions between individuals, events and ideas in a text. Describing each one alone is the known slip.
Sidekick.game(Sidekick.play({
  title: "How One Thing Shapes Another",
  emoji: "🔗",
  premise: "In nonfiction, people, events and ideas push on each other. An invention changes lives. An event changes minds.",
  outro: "Analyze interactions: how an idea influences people, or how people influence events.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What did this cause? Who or what did it change?",
  tag: "describes_each_alone",
  rounds: [
    { say: "Match each cause to what it changed.", rows: [["The printing press made books cheap.", "More people learned to read."], ["More people could read.", "New ideas spread faster."]], extra: "Books became rare.|", trap: [0, "Books became rare."], why: "Cheap books became common, not rare.", win: "One change set off the next." },
    { say: "Match each cause to what it changed.", rows: [["A doctor mapped cholera cases near one pump.", "The city shut the pump."], ["Cases dropped after the pump closed.", "People accepted that water spread the disease."]], extra: "The map was lost.|", trap: [1, "The city shut the pump."], why: "The drop in cases is what changed people’s minds.", win: "A person’s idea changed an event, then a belief." },
    { say: "Match these by yourself.", rows: [["Refrigerated rail cars were invented.", "Fresh food could travel far."], ["Fresh food reached distant cities.", "City diets became more varied."]], extra: "Trains stopped running.|Farms closed down.", trap: [0, "Trains stopped running."] },
  ],
}));
