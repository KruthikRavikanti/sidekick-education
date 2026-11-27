// Front and Back Clues. Skill L.3.4-2.
// Determining the meaning of a word formed when a known affix is added to a known word. Ignoring the affix is the known slip.
Sidekick.game(Sidekick.play({
  title: "Front and Back Clues",
  emoji: "🧷",
  premise: "Parts added to the front or back of a word change its meaning. Dis- means not. -less means without. -ful means full of.",
  outro: "Use affixes like dis-, -less, -ful and -able to work out a word’s meaning.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Find the base word. What does the added part do to it?",
  tag: "ignores_affix",
  rounds: [
    { say: "Match each word to its meaning.", rows: [["disagree", "not agree"], ["careless", "without care"]], extra: "full of care|", trap: [1, "full of care"], why: "That would be careful. The ending -less means without.", win: "Not agree, and without care." },
    { say: "Match these words.", rows: [["hopeful", "full of hope"], ["hopeless", "without hope"], ["dislike", "not like"]], trap: [0, "without hope"], why: "-ful means full of. Hopeful is full of hope.", win: "Full of, without, and not." },
    { say: "Match these by yourself.", rows: [["agreeable", "able to agree"], ["disagreeable", "not pleasant"], ["fearless", "without fear"]], extra: "full of fear|", trap: [2, "full of fear"] },
  ],
}));
