// Count the Units Between. Skill 6.G.A.3-2.
// Using coordinates to find the length of a side joining points with the same first or second coordinate. Counting points instead of units is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Units Between",
  emoji: "📏",
  premise: "When two corners share a coordinate, the side between them runs straight along the grid. Its length is the difference of the other coordinates.",
  outro: "Side length = the difference between the coordinates that change. Count the spaces, not the points.",
  scene: "paper",
  kind: "type",
  icon: "📏",
  hint: "Count the jumps from one point to the other, not the grid points.",
  tag: "counts_points_not_units",
  rounds: [
    { say: "Plot both ends of the side: (1, 1) and (5, 1).", kind: "plot", cast: "", axes: [0, 8, 0, 8], join: "line", quiet: true, ans: [[1, 1], [5, 1]], trap: [[1, 1], [1, 5]], why: "(5, 1) is 5 across and 1 up.", win: "The side lies along the row where y is 1." },
    { say: "How long is that side?", q: "From (1, 1) to (5, 1)", ans: 4, trap: 5, why: "There are 5 grid points but only 4 jumps between them: 5 − 1.", win: "5 − 1 = 4 units." },
    { say: "Find the length by yourself.", alt: [{ q: "From (2, 6) to (9, 6)", ans: 7, trap: 8 }, { q: "From (4, 1) to (4, 6)", ans: 5, trap: 6 }, { q: "From (0, 3) to (8, 3)", ans: 8, trap: 9 }] },
  ],
}));
