// Old Stories in New Clothes. Skill RL.8.9-1.
// Analyzing how a modern work of fiction draws on themes, patterns of events or character types from myths and traditional stories. Missing the connection is the known slip.
Sidekick.game(Sidekick.play({
  title: "Old Stories in New Clothes",
  emoji: "🏺",
  premise: "Modern stories often rebuild very old ones: the hero’s quest, the trickster, the rise from rags, the one who flew too high.",
  outro: "Recognize how a modern work draws on patterns and character types from myths and traditional tales.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Strip away the modern details. Which old tale has the same shape?",
  tag: "misses_connection",
  rounds: [
    { say: "Which old pattern does each modern story follow?", rows: [["A cleaner at a tech firm is discovered as a brilliant coder.", "rags to riches"], ["A teen leaves home, faces trials and returns wiser.", "the hero’s journey"]], extra: "the trickster|", trap: [1, "rags to riches"], why: "Leaving, facing trials and returning changed is the quest pattern.", win: "Two ancient shapes in modern dress." },
    { say: "Which old pattern does each follow?", rows: [["A clever kid outwits three bullies with a prank.", "the trickster"], ["An inventor ignores every warning and pushes his machine too far.", "flying too close to the sun"]], extra: "rags to riches|", trap: [1, "rags to riches"], why: "Ignoring warnings and overreaching echoes the myth of Icarus.", win: "A trickster, and an Icarus." },
    { say: "Match these by yourself.", rows: [["A small-town team beats the giant champions.", "David and Goliath"], ["A girl must choose among three sealed boxes.", "the test of three"]], extra: "the trickster|rags to riches", trap: [0, "rags to riches"] },
  ],
}));
