// How the Patterns Fit. Skill 5.OA.B.3-3.
// Identifying the relationship between corresponding terms of two patterns: each B term is twice the A term. Noticing only how each pattern grows on its own is the known slip.
Sidekick.game(Sidekick.play({
  title: "How the Patterns Fit",
  emoji: "🧶",
  premise: "Two patterns grow side by side. Look across, from one to the other, to see how they are tied together.",
  outro: "Compare matching terms: one pattern can be a multiple of the other.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Pick a term from A and the matching term from B. What turns one into the other?",
  tag: "sees_only_one_pattern",
  rounds: [
    { say: "Compare matching terms.", q: "A: 0, 3, 6, 9 · B: 0, 6, 12, 18", rows: [["Each B term is ___ the A term", "2 times"], ["Each A term is ___ the B term", "half of"]], extra: "3 more than|6 more than", trap: [0, "3 more than"], why: "Check with 6 and 12, then 9 and 18. Adding 3 does not work for both.", win: "B is always double A." },
    { say: "Compare these patterns.", q: "A: 0, 5, 10, 15 · B: 0, 15, 30, 45", rows: [["Each B term is ___ the A term", "3 times"], ["Each A term is ___ the B term", "one third of"]], extra: "10 more than|5 more than", trap: [0, "10 more than"], why: "Check with 10 and 30. Adding 10 gives 20, not 30.", win: "B is always 3 times A." },
    { say: "Compare these by yourself.", q: "A: 0, 2, 4, 6 · B: 0, 8, 16, 24", rows: [["Each B term is ___ the A term", "4 times"], ["Each A term is ___ the B term", "one fourth of"]], extra: "6 more than|8 more than", trap: [0, "6 more than"] },
  ],
}));
