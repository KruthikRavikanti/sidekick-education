// Episodes in Order. Skill RL.6.3-1.
// Describing how a plot unfolds in a series of episodes. Listing events without structure is the known slip.
Sidekick.game(Sidekick.play({
  title: "Episodes in Order",
  emoji: "🎬",
  premise: "A plot unfolds in episodes. Each one pushes the story toward its resolution.",
  outro: "A plot moves through a problem, rising trouble, a turning point and a resolution.",
  scene: "forest",
  kind: "row",
  fs: 4.6,
  hint: "What starts the trouble? What makes it harder? What ends it?",
  tag: "events_without_structure",
  rounds: [
    { say: "Put the episodes in the order the plot unfolds.", seq: "A storm traps the hikers.|They shelter in a cave.|Their radio dies.|A ranger spots their fire.", trap: "They shelter in a cave.|A storm traps the hikers.|Their radio dies.|A ranger spots their fire.", why: "The storm is the problem that sends them to the cave.", win: "Problem, shelter, more trouble, rescue." },
    { say: "What does each episode do in the plot?", kind: "fill", fs: 4.8, cast: "", rows: [["A storm traps the hikers.", "starts the problem"], ["Their radio dies.", "raises the trouble"], ["A ranger spots their fire.", "resolves it"]], extra: "describes the setting|", trap: [1, "starts the problem"], why: "The problem has already begun. This makes it harder.", win: "Start, rise, resolve." },
    { say: "Put these episodes in order by yourself.", seq: "Nia loses the class hamster.|She searches every desk.|The hamster chews a wire and the lights go out.|She finds it asleep in her backpack.", trap: "She searches every desk.|Nia loses the class hamster.|The hamster chews a wire and the lights go out.|She finds it asleep in her backpack." },
  ],
}));
