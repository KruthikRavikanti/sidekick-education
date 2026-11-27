// Line Through the Star. Skill G-GPE.B.5-3.
// Writing equations of parallel and perpendicular lines through a given point. Using another point, or the old intercept, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Line Through the Star",
  emoji: "⭐",
  premise: "A slope tells the tilt. A point pins the line down. Together they give exactly one line.",
  outro: "Use the slope you need, then plug in the given point to find the intercept.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "Set the slope first. Then slide the intercept until the line hits the star.",
  tag: "uses_another_point",
  rounds: [
    { say: "The blue line is y = 2x − 1. Build the parallel line through the star at (1, 4).", view: { type: "graph", fn: "line", also: [["line", 2, -1]], pts: [[1, 4]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [2, 2], trap: [2, 4], why: "4 is the y of the star, not the intercept. Plug in: 4 = 2(1) + b, so b = 2.", win: "y = 2x + 2 passes through (1, 4)." },
    { say: "The blue line is y = x + 1. Build the perpendicular line through the star at (2, 1).", view: { type: "graph", fn: "line", also: [["line", 1, 1]], pts: [[2, 1]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [-1, 3], trap: [-1, 1], why: "Keeping the old intercept misses the star. Plug in: 1 = −1(2) + b, so b = 3.", win: "y = −x + 3 crosses at a square corner." },
    { say: "By yourself: build the line parallel to the blue one through the star.", alt: [{ view: { type: "graph", fn: "line", also: [["line", 1, -2]], pts: [[2, 4]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [1, 2], trap: [1, 4] }, { view: { type: "graph", fn: "line", also: [["line", -1, 0]], pts: [[1, 3]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [-1, 4], trap: [-1, 3] }, { view: { type: "graph", fn: "line", also: [["line", 2, 3]], pts: [[2, 1]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [2, -3], trap: [2, 1] }] },
  ],
}));
