// Quick or Quickly?. Skill L.2.1-5.
// Using adjectives and adverbs and choosing between them. Using adjectives as adverbs (runs quick) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quick or Quickly?",
  emoji: "🐆",
  premise: "Adjectives describe things. Adverbs describe how something is done, and many end in -ly.",
  outro: "Use an adjective for a noun and an adverb for a verb: a quick fox, runs quickly.",
  scene: "sand",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Is the word describing a thing, or how an action is done?",
  tag: "adjective_for_adverb",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["She runs ___.", "quickly"], ["She is a ___ runner.", "quick"]], extra: "quicks", trap: [0, "quick"], why: "It tells HOW she runs, so it needs -ly.", win: "Runs quickly. A quick runner." },
    { say: "Drop in these words.", rows: [["The baby sleeps ___.", "quietly"], ["It is a ___ room.", "quiet"], ["He sang ___.", "loudly"]], extra: "loud", trap: [2, "loud"], why: "It tells how he sang. That needs -ly.", win: "Quietly, quiet and loudly." },
    { say: "Drop in the words by yourself.", rows: [["The turtle walks ___.", "slowly"], ["It is a ___ turtle.", "slow"], ["Please write ___.", "neatly"]], extra: "neat", trap: [0, "slow"] },
  ],
}));
