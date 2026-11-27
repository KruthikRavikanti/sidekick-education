// Spell It Right. Skill L.4.2-4.
// Spelling grade-appropriate words correctly. Spelling by sound is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spell It Right",
  emoji: "🐝",
  premise: "Some common words are easy to misspell if you go by sound. Train your eye to pick the correct one.",
  outro: "Words like because, different, favorite and beautiful must be memorized.",
  scene: "meadow",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Which spelling have you seen in print?",
  tag: "spells_by_sound",
  rounds: [
    { say: "Drop in the correct spelling.", rows: [["I stayed home ___ I was sick.", "because"], ["These two are ___.", "different"]], extra: "becuz diffrent", trap: [1, "diffrent"], why: "Different has an e in the middle: dif-fer-ent.", win: "Because and different." },
    { say: "Drop in the correct spellings.", rows: [["Blue is my ___ color.", "favorite"], ["What a ___ sunset.", "beautiful"], ["I ___ went to the park.", "finally"]], extra: "favrit beutiful", trap: [1, "beutiful"], why: "Beautiful starts b-e-a-u.", win: "Favorite, beautiful and finally." },
    { say: "Drop these in by yourself.", rows: [["We will ___ go tomorrow.", "probably"], ["It is a ___ day.", "special"], ["She is my best ___.", "friend"]], extra: "probly speshal", trap: [0, "probly"] },
  ],
}));
