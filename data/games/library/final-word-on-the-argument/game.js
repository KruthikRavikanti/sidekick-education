// Final Word on the Argument. Skill W.8.1-4.
// Providing a concluding statement or section that follows from and supports the argument. Leaving it out is the known slip.
Sidekick.game(Sidekick.play({
  title: "Final Word on the Argument",
  emoji: "🎤",
  premise: "The last paragraph is your final chance to convince. It should gather the argument, not wander off or fizzle.",
  outro: "Provide a concluding statement that follows from and supports the argument.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Does it follow from the reasons the essay gave?",
  tag: "no_conclusion",
  rounds: [
    { say: "The essay argued for free public transit for students. Sort the endings.", bins: "Supports the argument|Does not", items: ["Free rides would raise attendance and ease family budgets.|For the price of a few buses, the city gains thousands of students in class.", "Trains are also loud.|Well, that is about it."], trap: ["Trains are also loud.", 0], why: "Noise was never part of the argument, and it works against it.", win: "Gather the reasons into one final push." },
    { say: "The essay argued for a later curfew. Sort the endings.", bins: "Supports the argument|Does not", items: ["A later curfew fits teens who work and study late.|One more hour of trust teaches responsibility.", "Some teens break rules, so maybe not.|Curfews are a kind of rule."], trap: ["Some teens break rules, so maybe not.", 0], why: "That backs away from the claim at the last moment.", win: "End by holding firm to the claim." },
    { say: "The essay argued for a school newspaper. Sort by yourself.", bins: "Supports the argument|Does not", items: ["A paper would give students a voice and real writing practice.|Few clubs teach so many skills at once.", "Newspapers use ink.|Anyway, sports are fun too."], trap: ["Anyway, sports are fun too.", 0] },
  ],
}));
