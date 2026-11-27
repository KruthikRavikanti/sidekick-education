// Two Themes in Conversation. Skill RL.11-12.2-1.
// Determining two or more themes and analyzing how they interact and build on one another. Finding one theme is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Themes in Conversation",
  emoji: "🎭",
  premise: "Rich works carry more than one theme. The themes push against each other, and that friction is where the meaning lives.",
  outro: "Identify two or more themes and analyze how they interact and build on one another.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Name one idea, then a second. Do they support each other or pull apart?",
  tag: "finds_one_theme",
  rounds: [
    { say: "Find both themes, then how they interact.", read: "A soldier comes home a hero. He cannot tell his family what earned the medal, and their pride starts to feel like a wall.", rows: [["theme 1", "honor brings praise"], ["theme 2", "secrets isolate"], ["interaction", "the praise deepens his isolation"]], trap: [2, "secrets isolate"], why: "That is one theme by itself. The interaction says what the two do to each other.", win: "Two ideas, one tension." },
    { say: "Find both themes, then how they interact.", read: "Nadia wins a scholarship far away. Her mother, who cleaned offices to buy her books, helps her pack and says nothing.", rows: [["theme 1", "ambition opens doors"], ["theme 2", "love means sacrifice"], ["interaction", "her success costs her mother dearly"]], trap: [0, "love means sacrifice"], why: "The scholarship shows ambition. Sacrifice is the mother’s side of the story.", win: "One theme feeds the other." },
    { say: "Match these by yourself.", read: "A king builds a wall to keep his city safe. Inside it, trade withers and the young slip out at night.", rows: [["theme 1", "safety matters"], ["theme 2", "freedom matters"], ["interaction", "protecting the city ends up confining it"]], extra: "walls are tall|", trap: [2, "walls are tall"] },
  ],
}));
