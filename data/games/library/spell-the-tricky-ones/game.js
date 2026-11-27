// Spell the Tricky Ones. Skill L.1.2-4.
// Spelling words with common patterns and frequently occurring irregular words. Spelling by sound only (sed for said) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spell the Tricky Ones",
  emoji: "🐝",
  premise: "Some words are not spelled the way they sound. Learn how they look so you can spell them right.",
  outro: "Tricky words like said and they must be remembered, not sounded out.",
  scene: "meadow",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Picture the word in a book. Which spelling have you seen?",
  tag: "spells_by_sound_only",
  rounds: [
    { say: "Drop in the word that is spelled right.", rows: [["He ___ hello.", "said"], ["___ are my friends.", "They"]], extra: "sed Thay", trap: [0, "sed"], why: "It sounds like sed, but it is spelled s-a-i-d.", win: "Said and they." },
    { say: "Drop in these words.", rows: [["The cat ___ on the mat.", "was"], ["___ you like a snack?", "Would"], ["I ___ a fish.", "have"]], extra: "wuz hav", trap: [0, "wuz"], why: "It sounds like wuz, but it is spelled w-a-s.", win: "Was, would and have." },
    { say: "Drop in the words by yourself.", rows: [["I can ___ a cake.", "make"], ["A ___ sails on the sea.", "ship"], ["Please ___ here.", "come"], ["___ is your name?", "What"]], extra: "mak cum", trap: [2, "cum"] },
  ],
}));
