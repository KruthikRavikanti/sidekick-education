// Does That Make Sense?. Skill RF.1.4-3.
// Using context to confirm or self-correct word recognition, rereading as necessary. Reading on after an error that does not make sense is the known slip.
Sidekick.game(Sidekick.play({
  title: "Does That Make Sense?",
  emoji: "🐴",
  premise: "Sometimes a word comes out not quite right. Stop when it does not make sense, look again, and fix it.",
  outro: "If a sentence does not make sense, reread and fix the word.",
  scene: "field",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Read the whole sentence with each word. Which one makes sense?",
  tag: "reads_past_errors",
  rounds: [
    { say: "Pick the word that makes sense.", rows: [["The horse ran to the ___.", "barn"], ["I like to ride my ___.", "bike"]], extra: "born bake", trap: [0, "born"], why: "Ran to the born does not make sense. A horse lives in a barn.", win: "Barn and bike make sense." },
    { say: "Pick the words that make sense.", rows: [["The sun is ___ today.", "hot"], ["We swim in the ___.", "pool"], ["The cat drank the ___.", "milk"]], extra: "hat pole", trap: [0, "hat"], why: "The sun is hat does not make sense. Look at the middle letter.", win: "Hot, pool and milk." },
    { say: "Pick the words by yourself.", rows: [["We ate soup with a ___.", "spoon"], ["The dog wags its ___.", "tail"], ["I read a ___ at bedtime.", "book"]], extra: "spin tall back", trap: [0, "spin"] },
  ],
}));
