// Where the Lines Meet. Skill 8.EE.C.8-1.
// Understanding that the solution of a system corresponds to the point of intersection of the graphs. Giving only an x-value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where the Lines Meet",
  emoji: "✖️",
  premise: "A system is two equations at once. Its solution is the one point that sits on both lines.",
  outro: "The solution of a system is the point (x, y) where the lines intersect. It needs both coordinates.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "Find where the two lines cross. Tap that exact point.",
  tag: "gives_only_x",
  rounds: [
    { say: "Tap the point that solves both equations.", segs: [[0, 3, 5, 8], [0, 7, 7, 0]], ans: [[2, 5]], trap: [[2, 0]], why: "That shows only x = 2. The solution is the crossing point, with x and y.", win: "The lines meet at (2, 5)." },
    { say: "Two lines cross at (3, 4). Describe the solution.", kind: "fill", fs: 6, rows: [["x =", "3"], ["y =", "4"], ["the solution", "(3, 4)"]], extra: "x = 3 only|", trap: [2, "x = 3 only"], why: "A solution of a system is a pair. It needs the y-value too.", win: "x = 3 and y = 4." },
    { say: "Tap the solution by yourself.", alt: [{ segs: [[0, 1, 7, 8], [0, 7, 7, 0]], ans: [[3, 4]], trap: [[3, 0]] }, { segs: [[0, 2, 6, 8], [0, 8, 8, 0]], ans: [[3, 5]], trap: [[3, 0]] }] },
  ],
}));
