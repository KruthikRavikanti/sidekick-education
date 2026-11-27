// Two Points, Two Models. Skill F-LE.A.2-1.
// Constructing linear and exponential functions from a graph, a table or two input-output pairs. Using the linear form for growth by a factor is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Points, Two Models",
  emoji: "📌",
  premise: "Two points can be joined by a line or by an exponential curve. The line adds. The curve multiplies.",
  outro: "Through (0, 3) and (1, 6): linear is y = 3x + 3, exponential is y = 3(2)^x.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "From x = 0 to x = 1: how much was added? What was it multiplied by?",
  tag: "linear_form_for_factor",
  rounds: [
    { say: "A function passes through (0, 3) and (1, 6). Match each model.", rows: [["linear", "y = 3x + 3"], ["exponential", "y = 3(2)^x"]], extra: "y = 3x|", trap: [1, "y = 3x"], why: "An exponential model multiplies. From 3 to 6 is × 2.", win: "Add 3, or multiply by 2." },
    { say: "Match each table to its rule.", rows: [["x: 0, 1, 2 · y: 4, 7, 10", "y = 3x + 4"], ["x: 0, 1, 2 · y: 4, 12, 36", "y = 4(3)^x"]], extra: "y = 4x + 3|", trap: [1, "y = 4x + 3"], why: "The values are multiplied by 3 each step, starting at 4.", win: "Equal differences, or equal ratios." },
    { say: "A function passes through (0, 5) and (1, 10). Match by yourself.", rows: [["linear", "y = 5x + 5"], ["exponential", "y = 5(2)^x"]], extra: "y = 10x|y = 2(5)^x", trap: [1, "y = 2(5)^x"] },
  ],
}));
