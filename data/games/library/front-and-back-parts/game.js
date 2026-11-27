// Front and Back Parts. Skill RF.2.3-4.
// Decoding words with common prefixes and suffixes. Reading only the base word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Front and Back Parts",
  emoji: "🧱",
  premise: "Many long words are a base word with a part added to the front or the back. Read every part.",
  outro: "Read the prefix, the base word and the suffix. Each part adds meaning.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Find the base word. What was added to it?",
  tag: "reads_base_only",
  rounds: [
    { say: "Match each word to its meaning.", rows: [["unhappy", "not happy"], ["happy", "feeling glad"]], extra: "very happy|", trap: [0, "feeling glad"], why: "That is the base word alone. Un at the front changes it to not.", win: "Un makes it the opposite." },
    { say: "Match these words.", rows: [["replay", "play again"], ["careful", "full of care"], ["slowly", "in a slow way"]], extra: "play well|", trap: [0, "play well"], why: "Re at the front means again.", win: "Again, full of, and in a way." },
    { say: "Match these by yourself.", rows: [["unlock", "open the lock"], ["helpful", "full of help"], ["quickly", "in a quick way"]], extra: "lock tight|", trap: [0, "lock tight"] },
  ],
}));
