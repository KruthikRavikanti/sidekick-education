// Dense Article Check. Skill RI.7.10-1.
// Reading and comprehending literary nonfiction in the grades 6 to 8 complexity band proficiently. Needing support with dense text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dense Article Check",
  emoji: "🗞️",
  premise: "A challenging article takes a slow, careful read. Look for the points the author keeps returning to.",
  outro: "After a careful read, state the central ideas in your own words.",
  scene: "desk",
  kind: "pick",
  fs: 4.4,
  hint: "Which ideas do several sentences support?",
  tag: "needs_support",
  rounds: [
    { say: "Read the article. Tap its two central ideas.", read: "Coral looks like rock but is built by tiny animals that host algae inside them. The algae make food from sunlight and share it. When seas grow too warm, corals expel the algae, turn white and may starve. Cooler years let some reefs recover.", yes: "Corals depend on algae living inside them.|Warm water can break that partnership.", no: "Coral looks like rock.|Algae are green.", trap: "-Warm water can break that partnership.", why: "Half the article is about what warm seas do. That is a central idea too.", win: "A partnership, and a threat to it." },
    { say: "Tap the detail that explains why bleached coral may starve.", read: "The algae make food from sunlight and share it. When seas grow too warm, corals expel the algae, turn white and may starve.", yes: "The algae were sharing food with the coral.|", no: "White is a pale color.|Sunlight is bright.|The sea is salty.", trap: "White is a pale color.", why: "Color does not feed coral. What did the algae provide?", win: "No algae, no shared food." },
    { say: "Read this article. Tap its two central ideas by yourself.", read: "Roman roads were built in layers: sand, gravel, then fitted stone, with a curve to shed rain. This design let them last for centuries. The roads also bound the empire together, letting soldiers, traders and news travel quickly.", yes: "Careful layered design made Roman roads last.|The roads connected the empire.", no: "Rain is wet.|Gravel is small stones.|Soldiers walked.|Stone is hard.", trap: "-The roads connected the empire." },
  ],
}));
