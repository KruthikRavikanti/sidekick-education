// The Sentence Explains It. Skill L.9-10.4-1.
// Using context as a clue to the meaning of a word or phrase. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Sentence Explains It",
  emoji: "🔍",
  premise: "An unfamiliar word rarely travels alone. The sentence around it usually hands you its meaning.",
  outro: "Use context, such as a restatement, contrast or example nearby, as a clue to meaning.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Which nearby words restate or contrast with the hard word?",
  tag: "ignores_context",
  rounds: [
    { say: "Use the clues in each sentence.", read: "Her terse reply, just one word, ended the talk. Unlike his frugal sister, he spent every dollar.", rows: [["terse", "brief and abrupt"], ["frugal", "careful with money"]], extra: "long and friendly|", trap: [0, "long and friendly"], why: "Just one word is the clue. Terse means short.", win: "Restatement and contrast." },
    { say: "Use the clues.", read: "The lake was placid, as smooth and still as glass. The arid plain had not seen rain in a year.", rows: [["placid", "calm"], ["arid", "very dry"]], extra: "stormy|", trap: [0, "stormy"], why: "Smooth and still as glass tells you the lake is calm.", win: "The sentence defines the word." },
    { say: "Use the clues by yourself.", read: "The candid witness hid nothing. Her meticulous notes listed every time, name and street.", rows: [["candid", "honest and open"], ["meticulous", "extremely careful"]], extra: "secretive|messy", trap: [0, "secretive"] },
  ],
}));
