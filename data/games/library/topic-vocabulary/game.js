// Topic Vocabulary. Skill W.5.2-4.
// Using precise language and domain-specific vocabulary to inform about or explain a topic. Vague wording is the known slip.
Sidekick.game(Sidekick.play({
  title: "Topic Vocabulary",
  emoji: "🌿",
  premise: "Experts use exact words. Swap the roundabout phrase for the term a scientist or historian would use.",
  outro: "Use precise language and the vocabulary of the subject.",
  scene: "meadow",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "What is the proper term for that?",
  tag: "vague_wording",
  rounds: [
    { say: "Swap the roundabout phrase for the exact term.", rows: [["The plant makes food from light by ___.", "photosynthesis"], ["Water turning to vapor is called ___.", "evaporation"]], extra: "a food thing|", trap: [0, "a food thing"], why: "That is vague. The exact term is photosynthesis.", win: "Photosynthesis and evaporation." },
    { say: "Swap in these exact terms.", rows: [["Animals that eat only plants are ___.", "herbivores"], ["The path a planet takes is its ___.", "orbit"], ["A scientist’s testable guess is a ___.", "hypothesis"]], extra: "idea thing|", trap: [2, "idea thing"], why: "A testable guess has a name: hypothesis.", win: "Herbivores, orbit, hypothesis." },
    { say: "Swap these in by yourself.", rows: [["People who move to a new country are ___.", "immigrants"], ["A government ruled by the people is a ___.", "democracy"], ["Goods sent to other countries are ___.", "exports"]], extra: "movers stuff", trap: [0, "movers"] },
  ],
}));
