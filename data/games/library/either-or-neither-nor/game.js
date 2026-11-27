// Either Or, Neither Nor. Skill L.5.1-5.
// Using correlative conjunctions. Writing neither... or is the known slip.
Sidekick.game(Sidekick.play({
  title: "Either Or, Neither Nor",
  emoji: "⚖️",
  premise: "Some joining words come in pairs. Either goes with or. Neither goes with nor.",
  outro: "Correlative conjunctions work in pairs: either/or, neither/nor, both/and, not only/but also.",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Find the first word of the pair. Which partner always goes with it?",
  tag: "neither_or",
  rounds: [
    { say: "Drop in the partner word.", rows: [["Either we walk ___ we take the bus.", "or"], ["Neither Sam ___ Jo came.", "nor"]], extra: "and", trap: [1, "or"], why: "Neither always pairs with nor.", win: "Either or. Neither nor." },
    { say: "Drop in the partner words.", rows: [["Both the cat ___ the dog slept.", "and"], ["She is not only smart ___ kind.", "but also"], ["Neither rain ___ snow stopped us.", "nor"]], trap: [2, "and"], why: "Neither pairs with nor.", win: "Three pairs." },
    { say: "Drop these in by yourself.", rows: [["Either call me ___ send a note.", "or"], ["Neither the map ___ the sign helped.", "nor"], ["Both my mom ___ my dad cook.", "and"]], extra: "but", trap: [1, "or"] },
  ],
}));
