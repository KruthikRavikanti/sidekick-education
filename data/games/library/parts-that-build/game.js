// Parts That Build. Skill RL.3.5-2.
// Describing how each successive part of a story builds on earlier sections. Treating each part as separate is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parts That Build",
  emoji: "🧗",
  premise: "Each chapter stands on the one before it. What happened earlier explains what happens later.",
  outro: "Each part of a story builds on earlier parts.",
  scene: "snow",
  kind: "fill",
  cast: "",
  hint: "What from chapter 1 made that happen in chapter 2?",
  tag: "treats_parts_as_separate",
  rounds: [
    { say: "Match what happens in chapter 2 to what set it up in chapter 1.", rows: [["Ch 2: Max is lost in the woods.", "Ch 1: Max ignores the trail signs."], ["Ch 2: The team wins the cup.", "Ch 1: The team trains every day."]], extra: "Ch 1: Max has brown hair.|", trap: [0, "Ch 1: Max has brown hair."], why: "His hair does not lead to getting lost. What did?", win: "Earlier parts set up later ones." },
    { say: "Match each later event to what set it up.", rows: [["Later: The bridge gives way.", "Earlier: A crack is seen in the bridge."], ["Later: Zoe forgives her brother.", "Earlier: He says he is sorry."]], extra: "Earlier: The sky is blue.|", trap: [1, "Earlier: The sky is blue."], why: "The weather does not explain forgiving.", win: "Each part builds on the last." },
    { say: "Match these by yourself.", rows: [["Later: The plant blooms.", "Earlier: Ana waters the seed."], ["Later: The dog finds its way home.", "Earlier: The dog learns the streets."]], extra: "Earlier: Ana has a cat.|Earlier: The dog is brown.", trap: [0, "Earlier: Ana has a cat."] },
  ],
}));
