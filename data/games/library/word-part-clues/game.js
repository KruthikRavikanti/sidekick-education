// Word Part Clues. Skill L.K.4-2.
// Using common inflections and affixes as clues to meaning: unhappy means not happy. Ignoring the added word part is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word Part Clues",
  emoji: "🔧",
  premise: "Little parts added to a word change what it means. Un means not. Re means again.",
  outro: "Un at the start means not. Re at the start means again.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Look at the start of the word. What little part was added?",
  tag: "ignores_word_parts",
  rounds: [
    { say: "What does each word mean?", rows: [["unhappy", "not happy"], ["retell", "tell again"]], extra: "very happy|tell loudly", trap: [0, "very happy"], why: "Un means not. Unhappy is not happy.", win: "Not happy, and tell again." },
    { say: "What does each word mean?", rows: [["unlock", "not locked now"], ["redo", "do again"], ["unsafe", "not safe"]], extra: "very safe|", trap: [2, "very safe"], why: "Un means not. Unsafe is not safe.", win: "Un means not. Re means again." },
    { say: "Match these by yourself.", rows: [["untie", "make not tied"], ["refill", "fill again"], ["unkind", "not kind"]], extra: "very kind|fill a little", trap: [2, "very kind"] },
  ],
}));
