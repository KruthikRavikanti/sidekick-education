// Parallel Means Same Slope. Skill G-GPE.B.5-1.
// Proving and using the slope criterion for parallel lines. Using the negative of the slope is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parallel Means Same Slope",
  emoji: "🛤️",
  premise: "Parallel lines climb at exactly the same rate, so they never meet. Same slope, different starting point.",
  outro: "Parallel lines have equal slopes.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "Copy the slope exactly. Change only where the line starts.",
  tag: "uses_negative_slope",
  rounds: [
    { say: "The blue line is y = 2x + 1. Make the orange line parallel to it and pass through the star.", view: { type: "graph", fn: "line", also: [["line", 2, 1]], pts: [[0, -3]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [2, -3], trap: [-2, -3], why: "A slope of −2 tilts the other way and crosses the blue line. Keep the slope 2.", win: "Same slope 2, new intercept −3." },
    { say: "Parallel or not?", kind: "sort", fs: 5, bins: "Parallel|Not parallel", items: ["y = 3x + 1 and y = 3x − 4|y = −x + 2 and y = −x", "y = 3x + 1 and y = −3x + 1|y = 2x and y = {1/2}x"], trap: ["y = 3x + 1 and y = −3x + 1", 0], why: "3 and −3 are different slopes. Those lines cross.", win: "Equal slopes, different intercepts." },
    { say: "By yourself: make the orange line parallel to the blue one and pass through the star.", alt: [{ view: { type: "graph", fn: "line", also: [["line", -1, 2]], pts: [[0, -2]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [-1, -2], trap: [1, -2] }, { view: { type: "graph", fn: "line", also: [["line", 3, -2]], pts: [[0, 3]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [3, 3], trap: [-3, 3] }, { view: { type: "graph", fn: "line", also: [["line", -2, -1]], pts: [[0, 4]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [-2, 4], trap: [2, 4] }] },
  ],
}));
