// Count the Crossings. Skill A-REI.C.7-2.
// Solving a system of a linear and a quadratic equation graphically. Missing a second intersection is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Crossings",
  emoji: "✖️",
  premise: "Graph the line and the parabola together. Every point they share is a solution of the system.",
  outro: "A line and a parabola can meet at 0, 1 or 2 points. Read every crossing.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -1, 7],
  quiet: true,
  hint: "Follow the line from one side of the grid to the other. Where does it meet the curve?",
  tag: "misses_second_intersection",
  rounds: [
    { say: "The parabola is y = x^2. The line is y = x + 2. Tap every point they share.", curves: [["quad", 1, 0, 0], ["line", 1, 2]], ans: [[2, 4], [-1, 1]], trap: [[2, 4]], why: "Keep following the line to the left. It meets the curve again at (−1, 1).", win: "Two crossings: (−1, 1) and (2, 4)." },
    { say: "The parabola is y = x^2. The line is y = 2x − 1. Tap every point they share.", curves: [["quad", 1, 0, 0], ["line", 2, -1]], ans: [[1, 1]], trap: [[1, 1], [2, 3]], why: "(2, 3) is on the line but not on the curve, where y is 4.", win: "This line only touches the curve once." },
    { say: "Tap every shared point by yourself.", alt: [{ curves: [["quad", 1, 0, 0], ["line", -1, 2]], ans: [[1, 1], [-2, 4]], trap: [[1, 1]] }, { curves: [["quad", 1, 0, 0], ["line", 0, 4]], ans: [[2, 4], [-2, 4]], trap: [[2, 4]] }, { curves: [["quad", 1, 0, -1], ["line", 1, 1]], ans: [[2, 3], [-1, 0]], trap: [[2, 3]] }] },
  ],
}));
