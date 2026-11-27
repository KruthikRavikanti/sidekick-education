// Combine and Trim. Skill L.5.3-1.
// Expanding, combining and reducing sentences for meaning, reader interest and style. Writing only short simple sentences is the known slip.
Sidekick.game(Sidekick.play({
  title: "Combine and Trim",
  emoji: "🐕",
  premise: "Three short choppy sentences can become one smooth one. Combine ideas, then cut the words you do not need.",
  outro: "Expand, combine and reduce sentences for meaning, interest and style.",
  scene: "meadow",
  kind: "pick",
  hint: "Which version keeps every idea in one smooth sentence?",
  tag: "only_short_sentences",
  rounds: [
    { say: "Combine: The dog barked. The dog was hungry. It was loud. Tap the best version.", yes: "The hungry dog barked loudly.|", no: "The dog barked. It was hungry and loud.|The dog was a dog that was hungry and it barked and it was loud.|The dog barked.", trap: "The dog barked.", why: "That drops two of the ideas. Keep hungry and loud.", win: "Three ideas in five words." },
    { say: "Combine: The boat was small. The boat was red. It crossed the lake. Tap the best version.", yes: "The small red boat crossed the lake.|", no: "The boat was small and it was red and it crossed the lake.|The boat crossed.|The boat was small. The red boat crossed the lake.", trap: "The boat was small and it was red and it crossed the lake.", why: "All the ideas are there, but it rambles. Trim it.", win: "Combined and trimmed." },
    { say: "Combine: Mia ran. She ran to the bus. She was late. Tap the two best versions.", yes: "Late, Mia ran to the bus.|Mia, who was late, ran to the bus.", no: "Mia ran. She was late for the bus and she ran.|Mia ran to the bus.|Mia ran and ran and she was late and it was a bus.", trap: "Mia ran to the bus." },
  ],
}));
