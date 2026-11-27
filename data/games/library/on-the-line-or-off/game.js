// On the Line or Off?. Skill A-REI.D.10-1.
// Understanding that the graph of an equation in two variables is the set of all its solutions. Thinking only the intercepts are solutions is the known slip.
Sidekick.game(Sidekick.play({
  title: "On the Line or Off?",
  emoji: "🧵",
  premise: "A graph is the set of ALL points that make its equation true. Not just the intercepts: every point on it is a solution.",
  outro: "A point is on the graph exactly when its coordinates satisfy the equation.",
  scene: "paper",
  kind: "sort",
  fs: 6,
  hint: "Put x into the equation. Do you get that y?",
  tag: "only_intercepts",
  rounds: [
    { say: "Which points are on the graph of y = 3x + 1?", bins: "On the graph|Not on it", items: ["(2, 7)|(0, 1)|(−1, −2)", "(1, 5)|(3, 9)"], trap: ["(2, 7)", 1], why: "3 × 2 + 1 is 7. It fits, so it is on the line.", win: "Any point that fits the equation is on the graph." },
    { say: "The line is y = x + 2. Tap the point on it where x is 3.", kind: "plot", cast: "", axes: [0, 8, 0, 8], quiet: true, segs: [[0, 2, 6, 8]], ans: [[3, 5]], trap: [[5, 3]], why: "When x is 3, y is 3 + 2 = 5. That is 3 across and 5 up.", win: "(3, 5) satisfies y = x + 2." },
    { say: "Which points are on the graph of y = 2x − 3? Sort by yourself.", bins: "On the graph|Not on it", items: ["(2, 1)|(0, −3)|(5, 7)", "(1, 1)|(3, 4)"], trap: ["(5, 7)", 1] },
  ],
}));
