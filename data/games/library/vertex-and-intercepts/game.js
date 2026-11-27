// Vertex and Intercepts. Skill F-IF.C.7-1.
// Graphing linear and quadratic functions and showing intercepts, maxima and minima. Plotting the vertex at (b, c) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Vertex and Intercepts",
  emoji: "🎯",
  premise: "A parabola is pinned down by its vertex and its intercepts. The vertex is not simply (b, c) from the equation.",
  outro: "For f(x) = x² − 4x + 3: zeros at 1 and 3, vertex halfway between them at x = 2.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "The vertex is halfway between the x-intercepts.",
  tag: "vertex_at_b_c",
  rounds: [
    { say: "Graph f(x) = x^2 − 4x + 3. Slide the parabola until it passes through all three stars.", kind: "dial", cast: "", view: { type: "graph", fn: "quad", pre: [1], pts: [[1, 0], [3, 0], [2, -1]], win: [-6, 6, -6, 6] }, dials: [["Across", -5, 5, 1, 0], ["Up", -5, 5, 1, 0]], ans: [2, -1], trap: [-4, 3], why: "(−4, 3) just copies the numbers from the equation. The vertex is halfway between the zeros 1 and 3.", win: "Vertex (2, −1), zeros 1 and 3." },
    { say: "For f(x) = x^2 − 4x + 3, match each feature.", rows: [["vertex", "(2, −1)"], ["x-intercepts", "1 and 3"], ["y-intercept", "3"]], extra: "(−4, 3)|", trap: [0, "(−4, 3)"], why: "The vertex comes from x = 2, halfway between 1 and 3.", win: "f(2) = 4 − 8 + 3 = −1." },
    { say: "Graph f(x) = x^2 + 2x − 3 by yourself. Pass through all three stars.", kind: "dial", cast: "", view: { type: "graph", fn: "quad", pre: [1], pts: [[-3, 0], [1, 0], [-1, -4]], win: [-6, 6, -6, 6] }, dials: [["Across", -5, 5, 1, 0], ["Up", -5, 5, 1, 0]], ans: [-1, -4], trap: [2, -3] },
  ],
}));
