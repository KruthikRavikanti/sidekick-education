// Ratio Line Up. Skill 6.RP.A.3-2.
// Plotting pairs of values from a ratio table on the coordinate plane. Not seeing that the points form a line through the origin is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ratio Line Up",
  emoji: "📈",
  premise: "Plot pairs from a ratio table. Equivalent ratios always fall on one straight line through the origin.",
  outro: "Equivalent ratios plot as points on a line through (0, 0).",
  scene: "paper",
  kind: "plot",
  cast: "",
  quiet: true,
  hint: "Each step right, the points climb by the same amount.",
  tag: "misses_the_line",
  rounds: [
    { say: "The ratio is 1 to 2. Two points are drawn. Plot the next two.", q: "x: 1, 2, 3, 4 · y: 2, 4, 6, 8", axes: [0, 8, 0, 8], given: [[1, 2], [2, 4]], ans: [[3, 6], [4, 8]], trap: [[6, 3], [8, 4]], why: "x goes across and y goes up. The pair is (3, 6).", win: "All four points sit on one line through the origin.", join: "line" },
    { say: "The ratio is 2 to 1. Plot the next two points.", q: "x: 2, 4, 6, 8 · y: 1, 2, 3, 4", axes: [0, 8, 0, 8], given: [[2, 1], [4, 2]], ans: [[6, 3], [8, 4]], trap: [[3, 6], [4, 8]], why: "x is the bigger number here. The pair is (6, 3).", win: "A straight line again.", join: "line" },
    { say: "Plot the next two points by yourself.", alt: [{ q: "x: 1, 2, 3 · y: 3, 6, ?", axes: [0, 8, 0, 8], given: [[1, 3]], ans: [[2, 6]], trap: [[6, 2]] }, { q: "x: 3, 6 · y: 2, ?", axes: [0, 8, 0, 8], given: [[3, 2]], ans: [[6, 4]], trap: [[4, 6]] }] },
  ],
}));
