// Where to Begin, How to End. Skill RL.11-12.5-1.
// Analyzing how an author’s choices about structuring specific parts of a text contribute to its meaning and aesthetic impact. Describing the structure only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where to Begin, How to End",
  emoji: "🎬",
  premise: "The first scene and the last scene frame everything between. A wedding ending and a funeral ending make different meanings.",
  outro: "Analyze how choices about where to begin and end, and a comic or tragic resolution, shape meaning and impact.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What does this beginning or ending make the whole story mean?",
  tag: "describes_structure_only",
  rounds: [
    { say: "Match each structural choice to its effect.", rows: [["wedding ending", "order is restored (comic)"], ["death of the hero", "loss shows the cost (tragic)"], ["opens at a funeral", "the story becomes a looking back"]], extra: "the story has an ending|", trap: [2, "the story has an ending"], why: "Every story has one. What does starting at the funeral do to the rest?", win: "Frames change meaning." },
    { say: "A novel about a feud could end two ways. Match each ending to its meaning.", rows: [["the families share a meal", "reconciliation is possible"], ["the last heir leaves town", "the feud has consumed everything"]], extra: "the book is over|", trap: [0, "the book is over"], why: "Say what that ending claims about the feud.", win: "The ending is the argument." },
    { say: "Match these by yourself.", rows: [["circular ending", "has anything really changed?"], ["ends mid-sentence", "the reader is left unsettled"], ["opens with the end", "we read to see how it comes true"]], extra: "it has chapters|", trap: [1, "it has chapters"] },
  ],
}));
