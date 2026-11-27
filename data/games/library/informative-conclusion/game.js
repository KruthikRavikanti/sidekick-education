// Informative Conclusion. Skill W.4.2-5.
// Providing a concluding statement related to the information or explanation presented. Having no conclusion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Informative Conclusion",
  emoji: "🔚",
  premise: "End an informative piece with a statement that follows from what you explained.",
  outro: "A concluding statement relates to the information presented.",
  scene: "paper",
  kind: "pick",
  hint: "Which one sums up the explanation you gave?",
  tag: "no_conclusion",
  rounds: [
    { say: "The report explains how sharks hunt, breathe and survive. Tap the best conclusion.", yes: "With these features, sharks are among the ocean’s most successful hunters.|", no: "Sharks also have fins.|Whales are bigger.|That is my report.", trap: "That is my report.", why: "That announces the end without saying anything about sharks.", win: "It sums up the explanation." },
    { say: "The report explains how volcanoes form and erupt. Tap the best conclusion.", yes: "Volcanoes show how powerful the forces inside Earth can be.|", no: "Lava is hot.|Earthquakes are different.|The end.", trap: "Lava is hot.", why: "That is one more fact. A conclusion pulls the facts together.", win: "A fitting conclusion." },
    { say: "The report explains how bees make honey and why they matter. Tap the best conclusion by yourself.", yes: "From hive to table, bees do work that people depend on.|", no: "Honey is sweet.|Wasps also sting.|That is all I know.|Bees have wings.|Thank you for reading.", trap: "That is all I know." },
  ],
}));
