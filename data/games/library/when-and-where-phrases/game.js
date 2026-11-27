// When and Where Phrases. Skill L.3.6-1.
// Using grade-appropriate words and phrases that signal spatial and temporal relationships. Using vague time words is the known slip.
Sidekick.game(Sidekick.play({
  title: "When and Where Phrases",
  emoji: "🌠",
  premise: "Phrases like after dinner that night and across the field tell exactly when or where. They beat vague words like then.",
  outro: "Use precise phrases that signal time and place.",
  scene: "night",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Does the sentence need a when phrase or a where phrase?",
  tag: "vague_time_words",
  rounds: [
    { say: "Drop in the phrase that fits.", rows: [["We looked for the comet ___.", "after dinner that night"], ["The dog ran ___.", "across the open field"]], extra: "then", trap: [0, "then"], why: "Then is vague. A real time phrase says exactly when.", win: "A when phrase and a where phrase." },
    { say: "Drop in these phrases.", rows: [["___, the rooster crowed.", "Just before sunrise"], ["The cat hid ___.", "beneath the old porch"], ["___, the snow had melted.", "By the next afternoon"]], trap: [1, "Just before sunrise"], why: "The cat hid somewhere. That needs a where phrase.", win: "When, where, and when." },
    { say: "Drop these in by yourself.", rows: [["We met ___.", "beside the tall oak tree"], ["___, the fog lifted.", "A few minutes later"], ["The path led ___.", "through the narrow canyon"]], extra: "sometime", trap: [1, "sometime"] },
  ],
}));
