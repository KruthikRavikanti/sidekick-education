// Untie and Retie. Skill L.1.4-2.
// Using frequently occurring affixes as a clue to the meaning of a word. Ignoring the prefix is the known slip.
Sidekick.game(Sidekick.play({
  title: "Untie and Retie",
  emoji: "👟",
  premise: "A small part stuck on the front of a word changes its meaning. Un means not or undo. Re means again.",
  outro: "Un- means not or undo. Re- means again.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Cover the first two letters. What is the word? Now add the part back.",
  tag: "ignores_prefix",
  rounds: [
    { say: "What does each word mean?", rows: [["untie", "undo the tie"], ["retie", "tie again"]], extra: "tie tightly|", trap: [0, "tie tightly"], why: "Un means undo. Untie is the opposite of tie.", win: "Undo the tie, and tie again." },
    { say: "What does each word mean?", rows: [["unpack", "take things out"], ["reread", "read again"], ["unhappy", "not happy"]], extra: "read fast|", trap: [1, "read fast"], why: "Re means again. Reread is read again.", win: "Un undoes. Re repeats." },
    { say: "Match these by yourself.", rows: [["unzip", "open the zip"], ["rebuild", "build again"], ["unfair", "not fair"]], extra: "very fair|build high", trap: [2, "very fair"] },
  ],
}));
