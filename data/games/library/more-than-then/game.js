// More Than Then. Skill W.3.3-3.
// Using temporal words and phrases to signal event order. Using then repeatedly is the known slip.
Sidekick.game(Sidekick.play({
  title: "More Than Then",
  emoji: "⏳",
  premise: "Then, then, then gets dull fast. Other time words show the order in a fresh way.",
  outro: "Vary your time words: first, later, after a while, at last, meanwhile.",
  scene: "sand",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Which time word fits this point in the story?",
  tag: "repeats_then",
  rounds: [
    { say: "Drop a different time word into each sentence.", rows: [["___ we set up the tent.", "First"], ["___ we lit the fire.", "After that"], ["___ we fell asleep.", "At last"]], extra: "Then", trap: [1, "Then"], why: "Then works, but try a fresher word. After that says more.", win: "First, after that, at last." },
    { say: "Drop in these time words.", rows: [["___ the sun rose.", "Early in the morning"], ["___ clouds rolled in.", "By noon"], ["___ it began to pour.", "A moment later"]], trap: [0, "By noon"], why: "The sun rises early, not at noon.", win: "Morning, noon and a moment later." },
    { say: "Drop these in by yourself.", rows: [["___ the team was losing.", "At first"], ["___ they scored twice.", "Soon"], ["___ they won the game.", "In the end"]], extra: "Then", trap: [2, "At first"] },
  ],
}));
