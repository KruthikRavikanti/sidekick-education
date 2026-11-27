// Where Both Shadings Overlap. Skill A-REI.D.12-3.
// Graphing the solution set of a system of linear inequalities as the intersection of half-planes. Shading the union instead of the intersection is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where Both Shadings Overlap",
  emoji: "🟪",
  premise: "A system of inequalities is solved only where every shaded region overlaps. A point must pass all the tests.",
  outro: "The solution of a system of inequalities is the intersection of the half-planes.",
  scene: "paper",
  kind: "sort",
  fs: 6,
  hint: "Test the point in BOTH inequalities. It must pass both.",
  tag: "union_not_intersection",
  rounds: [
    { say: "The system is y ≥ x and y ≤ 4. Which points solve both?", fig: { type: "graph", fn: "none", regions: [[1, 0, "above"], [0, 4, "below"]], win: [-6, 6, -6, 6], h: 42, v: [] }, bins: "Solves both|Does not", items: ["(1, 3)|(0, 2)|(−2, 4)", "(5, 3)|(1, 5)"], trap: ["(5, 3)", 0], why: "It is below y = 4, but 3 is not at least 5. It passes only one test.", win: "Only the overlap counts." },
    { say: "The system is y ≤ x + 2 and y ≥ −1. Sort the points.", fig: { type: "graph", fn: "none", regions: [[1, 2, "below"], [0, -1, "above"]], win: [-6, 6, -6, 6], h: 42, v: [] }, bins: "Solves both|Does not", items: ["(0, 0)|(3, 2)", "(0, 4)|(2, −3)|(−5, 0)"], trap: ["(0, 4)", 0], why: "4 is not at most 0 + 2. It fails the first inequality.", win: "Both conditions at once." },
    { say: "The system is y ≥ 2 and y ≤ −x + 5. Sort by yourself.", fig: { type: "graph", fn: "none", regions: [[0, 2, "above"], [-1, 5, "below"]], win: [-6, 6, -6, 6], h: 42, v: [] }, bins: "Solves both|Does not", items: ["(1, 3)|(0, 2)", "(4, 3)|(0, 0)|(2, 6)"], trap: ["(4, 3)", 0] },
  ],
}));
