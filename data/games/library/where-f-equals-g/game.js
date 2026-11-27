// Where f Equals g. Skill A-REI.D.11-1.
// Explaining why the x-coordinates of intersection points are solutions of f(x) = g(x). Giving the y-value as the solution is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where f Equals g",
  emoji: "🤝",
  premise: "Where two graphs cross, both functions give the same output. The x-value of that point solves f(x) = g(x).",
  outro: "The solutions of f(x) = g(x) are the x-coordinates of the intersection points.",
  scene: "paper",
  kind: "type",
  hint: "The equation asks for x. Read across the bottom axis.",
  tag: "gives_y_value",
  rounds: [
    { say: "The graphs of f and g cross at the dot. Key in the solution of f(x) = g(x).", fig: { type: "graph", fn: "line", v: [1, 2], also: [["line", -1, 8]], dots: [[3, 5, "(3, 5)"]], win: [0, 8, 0, 8], h: 46 }, ans: 3, trap: 5, why: "5 is the shared output. The solution is the input, x = 3.", win: "x = 3, where both equal 5." },
    { say: "These graphs cross twice. Give both solutions of f(x) = g(x).", kind: "fill", fs: 6, cast: "", fig: { type: "graph", fn: "quad", v: [1, 0, 0], also: [["line", 1, 2]], dots: [[-1, 1, "(−1, 1)"], [2, 4, "(2, 4)"]], win: [-4, 4, -1, 7], h: 46 }, rows: [["the smaller solution", "−1"], ["the larger solution", "2"]], extra: "1 4", trap: [1, "4"], why: "4 is the height of the crossing. The solution is its x-value, 2.", win: "x = −1 and x = 2." },
    { say: "Key in the solution of f(x) = g(x) by yourself.", alt: [{ q: "The graphs of f and g cross at (4, 7).", ans: 4, trap: 7 }, { q: "The graphs of f and g cross at (2, 9).", ans: 2, trap: 9 }, { q: "The graphs of f and g cross at (6, 1).", ans: 6, trap: 1 }] },
  ],
}));
