// Read Every Letter. Skill RF.1.3-2.
// Decoding regularly spelled one-syllable words. Guessing from the first letter and the picture is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read Every Letter",
  emoji: "🚩",
  premise: "Two words can start the same way. Read all the way to the last letter to be sure.",
  outro: "Sound out the whole word, from the first letter to the last.",
  scene: "field",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Slide your finger under every letter as you say its sound.",
  tag: "guesses_from_first_letter",
  rounds: [
    { say: "Give each picture its word.", rows: [["🚩", "flag"], ["🦘", "jump"]], extra: "frog jam", trap: [0, "frog"], why: "That starts like flag, but read on: f-r-o-g is frog.", win: "Flag and jump." },
    { say: "Match these.", rows: [["🥁", "drum"], ["🛏️", "bed"], ["🕸️", "web"]], extra: "drip bad", trap: [1, "bad"], why: "That word has an a in the middle. Bed has an e.", win: "Drum, bed and web." },
    { say: "Match these by yourself.", rows: [["🪺", "nest"], ["✋", "hand"], ["🥛", "milk"]], extra: "net hat mill", trap: [0, "net"] },
  ],
}));
