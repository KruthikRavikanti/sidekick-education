// One Letter Apart. Skill RF.K.3-4.
// Distinguishing similarly spelled words by the letters that differ: cat and cut. Guessing from the first letter only is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Letter Apart",
  emoji: "🧐",
  premise: "Some words look almost the same. Only one letter is different, so look at every letter.",
  outro: "Read all the letters. One different letter makes a different word.",
  scene: "desk",
  kind: "fill",
  fs: 7,
  cast: "",
  hint: "Look at the middle letter, not just the first one.",
  tag: "guesses_from_first_letter",
  rounds: [
    { say: "Give each picture its word.", rows: [["🐱", "cat"], ["✂️", "cut"]], extra: "cot", trap: [0, "cut"], why: "That word has a u in the middle. Cat has an a.", win: "Cat and cut." },
    { say: "Match these.", rows: [["📌", "pin"], ["🖊️", "pen"]], extra: "pan", trap: [0, "pen"], why: "That word has an e in the middle. Pin has an i.", win: "Pin and pen." },
    { say: "Match these by yourself.", rows: [["🎩", "hat"], ["🌭", "hot"], ["🛖", "hut"]], extra: "hit", trap: [0, "hot"] },
  ],
}));
