// Make It Formal. Skill W.8.2-3.
// Establishing and maintaining a formal style. Slipping into a casual tone is the known slip.
Sidekick.game(Sidekick.play({
  title: "Make It Formal",
  emoji: "🎩",
  premise: "Informative writing uses a formal style: precise words, no slang, no chatty asides.",
  outro: "Establish and maintain a formal style: replace slang and vague words with precise ones.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Which version would fit in a textbook?",
  tag: "casual_tone",
  rounds: [
    { say: "Match each casual sentence to its formal version.", rows: [["Lots of kids think the rule is silly.", "Many students consider the rule unfair."], ["The experiment was a total mess.", "The experiment produced inconsistent results."]], extra: "The rule stinks.|", trap: [0, "The rule stinks."], why: "Stinks is slang. Formal writing says exactly what the objection is.", win: "Precise words, no slang." },
    { say: "Replace each casual phrase with a formal one.", rows: [["a bunch of", "many"], ["kind of weird", "somewhat unusual"], ["got way better", "improved greatly"]], extra: "tons of|", trap: [0, "tons of"], why: "Tons of is just as casual. Use many.", win: "Many, somewhat unusual, improved greatly." },
    { say: "Match these by yourself.", rows: [["The results were super cool.", "The results were remarkable."], ["Scientists freaked out about the data.", "Scientists were alarmed by the data."]], extra: "The results rocked.|Scientists lost it.", trap: [1, "Scientists lost it."] },
  ],
}));
