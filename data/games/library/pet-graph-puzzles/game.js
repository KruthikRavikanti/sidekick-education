// Pet Graph Puzzles. Skill 2.MD.D.10-2.
// Solving put-together and compare problems from a bar graph: values are read from the scale and combined. Adding when asked how many more is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pet Graph Puzzles",
  emoji: "🐹",
  premise: "The class graphed its pets. Read the bars carefully to answer each puzzle.",
  outro: "Read each bar against the numbers on the side, then add or compare.",
  scene: "paper",
  kind: "type",
  icon: "🐹",
  fig: { type: "bars", given: [["🐶", 4], ["🐱", 6], ["🐦", 2], ["🐟", 5]], cap: 6, tick: 1 },
  hint: "Read each bar by looking across to the numbers. Then decide: together, or the difference?",
  tag: "picks_opposite_operation",
  rounds: [
    { say: "Use the graph. Key in the answer.", q: "How many more cats than birds?", ans: 4, trap: 8, why: "How many more is the difference: 6 take away 2.", win: "6 − 2 = 4 more cats." },
    { say: "Use the graph again.", q: "How many dogs and fish in all?", ans: 9, trap: 1, why: "In all means put them together: 4 and 5.", win: "4 + 5 = 9." },
    { say: "Answer by yourself.", alt: [{ q: "How many fewer birds than fish?", ans: 3, trap: 7 }, { q: "How many cats and birds in all?", ans: 8, trap: 4 }] },
  ],
}));
