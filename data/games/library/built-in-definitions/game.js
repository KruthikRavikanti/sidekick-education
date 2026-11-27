// Built-In Definitions. Skill L.8.4-1.
// Using context as a clue to the meaning of a word or phrase. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Built-In Definitions",
  emoji: "🧷",
  premise: "Writers often define a hard word right in the sentence, after or, that is, or a comma.",
  outro: "Look for a restatement or definition near the unknown word.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Look right after the word for or, that is, or a comma.",
  tag: "ignores_context",
  rounds: [
    { say: "Use the built-in clue. What does each capital word mean?", rows: [["The treaty was RATIFIED, or formally approved.", "formally approved"], ["The soil was ARABLE, that is, good for farming.", "good for farming"]], extra: "thrown away|", trap: [0, "thrown away"], why: "The sentence defines it for you right after or.", win: "The definitions were built in." },
    { say: "Use the clue.", rows: [["She was a NOVICE, a complete beginner.", "a beginner"], ["The river MEANDERED, winding slowly across the plain.", "wound slowly"]], extra: "an expert|", trap: [0, "an expert"], why: "The words after the comma say what a novice is.", win: "A beginner, and wound slowly." },
    { say: "Match these by yourself.", rows: [["The law was REPEALED, or cancelled.", "cancelled"], ["He felt LETHARGIC, that is, slow and sleepy.", "slow and sleepy"]], extra: "passed|full of energy", trap: [1, "full of energy"] },
  ],
}));
