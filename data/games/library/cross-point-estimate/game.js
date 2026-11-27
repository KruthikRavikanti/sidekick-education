// Cross Point Estimate. Skill A-REI.C.6-2.
// Solving systems of linear equations approximately by graphing. Misreading the intersection is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cross Point Estimate",
  emoji: "📍",
  premise: "Graph both equations and the solution is where they cross. Read the point carefully from the grid.",
  outro: "The intersection of two graphs is the solution of the system. Read x, then y.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "Go straight down from the crossing for x and straight across for y.",
  tag: "misreads_intersection",
  rounds: [
    { say: "The lines are y = 2x − 1 and y = −x + 5. Tap where they cross.", segs: [[1, 1, 4, 7], [0, 5, 5, 0]], ans: [[2, 3]], trap: [[3, 2]], why: "Read x first. The crossing is above 2, at height 3.", win: "The solution is (2, 3)." },
    { say: "The lines y = x and y = −x + 5 cross between grid points. Key in the x-value.", kind: "type", icon: "📍", ans: "2.5", trap: "5", why: "5 is where the second line starts. Set x = −x + 5, so 2x = 5.", win: "They cross at (2.5, 2.5)." },
    { say: "Tap the crossing point by yourself.", alt: [{ segs: [[0, 0, 4, 8], [0, 6, 6, 0]], ans: [[2, 4]], trap: [[4, 2]] }, { segs: [[2, 1, 5, 7], [0, 6, 6, 0]], ans: [[3, 3]], trap: [[3, 0]] }] },
  ],
}));
