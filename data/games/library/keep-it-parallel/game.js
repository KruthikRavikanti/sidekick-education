// Keep It Parallel. Skill L.9-10.1-1.
// Using parallel structure. Mixing forms, as in to swim, running and bike rides, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Keep It Parallel",
  emoji: "🛤️",
  premise: "Items in a list should wear the same grammatical uniform: all -ing words, all to-verbs, or all nouns.",
  outro: "Use parallel structure: match the form of every item in a series.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Read the list items alone. Do they share one form?",
  tag: "mixed_forms",
  rounds: [
    { say: "Parallel or not?", bins: "Parallel|Not parallel", items: ["She likes swimming, running and biking.|He came to listen, to learn and to help.", "She likes to swim, running and bike rides.|He is smart, funny and has kindness."], trap: ["She likes to swim, running and bike rides.", 0], why: "To swim, running, bike rides: three different forms.", win: "One form for every item." },
    { say: "Finish each list in the same form.", kind: "fill", fs: 4.6, cast: "", rows: [["She enjoys hiking, swimming and ___.", "biking"], ["He wants to read, to write and ___.", "to draw"], ["The job needs speed, care and ___.", "patience"]], extra: "to bike|", trap: [0, "to bike"], why: "Hiking and swimming end in -ing. The third item should too.", win: "Match the pattern." },
    { say: "Sort these by yourself.", bins: "Parallel|Not parallel", items: ["The coach asked us to stretch, to hydrate and to rest.|The room was dark, cold and silent.", "We planned on eating, a movie and to shop.|The report is clear, short and has accuracy."], trap: ["We planned on eating, a movie and to shop.", 0] },
  ],
}));
