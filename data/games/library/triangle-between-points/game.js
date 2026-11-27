// Triangle Between Points. Skill 8.G.B.8-1.
// Drawing a right triangle between two points in a coordinate system to find distance. Counting points instead of units is the known slip.
Sidekick.game(Sidekick.play({
  title: "Triangle Between Points",
  emoji: "📍",
  premise: "Any two points on the grid are the ends of a slanted line. Draw a right triangle under it and its legs follow the grid.",
  outro: "The legs of the triangle are the differences in x and in y between the two points.",
  scene: "paper",
  kind: "type",
  icon: "📍",
  hint: "Subtract the coordinates. Count the jumps, not the dots.",
  tag: "counts_points_not_units",
  rounds: [
    { say: "A and B are marked. Tap the corner that makes a right triangle with legs along the grid.", kind: "plot", cast: "", axes: [0, 8, 0, 8], quiet: true, join: "shape", given: [[1, 2, "A"], [4, 6, "B"]], ans: [[4, 2]], also: [[[1, 6]]], trap: [[3, 2]], why: "The corner sits directly below B, where x is 4.", win: "One leg runs across, one runs up." },
    { say: "Key in the length of the leg that runs across.", q: "From A (1, 2) to B (4, 6)", ans: 3, trap: 4, why: "Count the jumps from 1 to 4, not the points: 4 − 1.", win: "4 − 1 = 3 units across." },
    { say: "Key in the length of the leg that runs up.", q: "From A (1, 2) to B (4, 6)", ans: 4, trap: 5, why: "From 2 up to 6 is 4 jumps: 6 − 2.", win: "6 − 2 = 4 units up." },
    { say: "Find the leg by yourself.", alt: [{ q: "From (2, 1) to (7, 4): how long is the leg that runs across?", ans: 5, trap: 6 }, { q: "From (0, 3) to (6, 8): how long is the leg that runs up?", ans: 5, trap: 6 }, { q: "From (1, 1) to (5, 8): how long is the leg that runs up?", ans: 7, trap: 8 }] },
  ],
}));
