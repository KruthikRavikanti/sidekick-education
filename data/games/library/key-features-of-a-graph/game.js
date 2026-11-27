// Key Features of a Graph. Skill F-IF.B.4-1.
// Interpreting key features of graphs: intercepts, intervals of increase and decrease, maximums and minimums. Confusing x- and y-intercepts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Key Features of a Graph",
  emoji: "🔑",
  premise: "A graph has landmarks: where it crosses each axis, and where it turns. The x-intercepts sit on the x-axis.",
  outro: "x-intercepts have y = 0. The y-intercept has x = 0. The vertex is the turning point.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "An x-intercept is ON the x-axis, so its y-coordinate is 0.",
  tag: "confuses_intercepts",
  rounds: [
    { say: "This is f(x) = x^2 − 4. Find its features.", fig: { type: "graph", fn: "quad", pre: [1, 0, -4], win: [-5, 5, -6, 6], h: 46, v: [] }, rows: [["x-intercepts", "(−2, 0) and (2, 0)"], ["y-intercept", "(0, −4)"]], extra: "(−4, 0)|", trap: [1, "(−4, 0)"], why: "The y-intercept is on the y-axis, where x is 0.", win: "Two x-intercepts, one y-intercept." },
    { say: "For the same graph, where does it fall and rise?", fig: { type: "graph", fn: "quad", pre: [1, 0, -4], win: [-5, 5, -6, 6], h: 46, v: [] }, rows: [["decreasing", "when x < 0"], ["increasing", "when x > 0"], ["minimum value", "−4"]], trap: [0, "when x > 0"], why: "Read left to right. The graph goes downhill until x reaches 0.", win: "Down, then up, with a minimum of −4." },
    { say: "This is f(x) = −x^2 + 1. Match by yourself.", fig: { type: "graph", fn: "quad", pre: [-1, 0, 1], win: [-5, 5, -6, 6], h: 46, v: [] }, rows: [["x-intercepts", "(−1, 0) and (1, 0)"], ["y-intercept", "(0, 1)"]], extra: "(1, 1)|(0, −1)", trap: [1, "(1, 1)"] },
  ],
}));
