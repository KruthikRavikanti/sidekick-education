// Bends in the Path. Skill 8.F.A.3-2.
// Giving examples of functions that are not linear. Thinking any equation or set of points is linear is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bends in the Path",
  emoji: "🎢",
  premise: "Not every function is a line. If equal steps across give unequal steps up, the graph bends.",
  outro: "A function is nonlinear when equal changes in x do not give equal changes in y.",
  scene: "paper",
  kind: "sort",
  fs: 5.2,
  hint: "Find the jump between each pair of y-values. Are the jumps equal?",
  tag: "everything_is_linear",
  rounds: [
    { say: "Plot the points of y = x^2 for x = 0, 1 and 2.", kind: "plot", cast: "", axes: [0, 8, 0, 8], join: "line", quiet: true, ans: [[0, 0], [1, 1], [2, 4]], trap: [[0, 0], [1, 2], [2, 4]], why: "That is y = 2x. Squaring 1 gives 1.", win: "Up 1, then up 3. The path bends." },
    { say: "Do the three points lie on one straight line?", bins: "On one line|Not on one line", items: ["(1, 2), (2, 4), (3, 6)|(0, 1), (1, 3), (2, 5)", "(1, 1), (2, 4), (3, 9)|(1, 2), (2, 4), (3, 8)"], trap: ["(1, 1), (2, 4), (3, 9)", 0], why: "The jumps are 3 then 5. Unequal jumps mean a curve.", win: "Equal jumps, one line." },
    { say: "Sort these by yourself.", bins: "On one line|Not on one line", items: ["(0, 4), (1, 6), (2, 8)|(1, 5), (2, 10), (3, 15)", "(0, 0), (1, 1), (2, 8)|(1, 10), (2, 5), (3, 3)"], trap: ["(0, 0), (1, 1), (2, 8)", 0] },
  ],
}));
