// Time Words and The End. Skill W.2.3-3.
// Using temporal words to signal event order and providing a sense of closure. Having no ending is the known slip.
Sidekick.game(Sidekick.play({
  title: "Time Words and The End",
  emoji: "⏰",
  premise: "Time words guide the reader through a story. The last one leads to the ending.",
  outro: "Use time words like first, later and finally, and finish with an ending.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "Which time word fits the start? Which fits the very end?",
  tag: "no_ending",
  rounds: [
    { say: "Drop each time word where it fits.", rows: [["___ I heard a scratch at the door.", "First"], ["___ I opened it a little.", "Next"], ["___ a wet puppy ran in.", "Finally"]], trap: [0, "Finally"], why: "Finally belongs with the last event.", win: "First, next, finally." },
    { say: "Drop these time words where they fit.", rows: [["___ we packed our bags.", "In the morning"], ["___ we hiked up the hill.", "Later"], ["___ we reached the top and cheered.", "At last"]], trap: [2, "Later"], why: "Reaching the top is the end. At last fits there.", win: "Morning, later, at last." },
    { say: "Drop these in by yourself.", rows: [["___ the sky turned dark.", "First"], ["___ rain began to fall.", "Then"], ["___ a rainbow came out.", "In the end"]], extra: "Because", trap: [0, "In the end"] },
  ],
}));
