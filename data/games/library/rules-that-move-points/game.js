// Rules That Move Points. Skill G-CO.A.2-1.
// Representing transformations as functions that take points in the plane as inputs and give other points as outputs. Thinking only the shape moves is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rules That Move Points",
  emoji: "🎯",
  premise: "A transformation is a function. It takes every point of the plane as input and gives a new point as output.",
  outro: "A rule like (x, y) → (x + 3, y − 2) moves every point: add 3 to x, subtract 2 from y.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "Apply the rule to x and to y separately.",
  tag: "only_shape_moves",
  rounds: [
    { say: "Apply the rule (x, y) → (x + 3, y − 2) to P. Tap the output point.", given: [[2, 5, "P"]], ans: [[5, 3]], trap: [[0, 8]], why: "x gains 3 and y loses 2: (2 + 3, 5 − 2).", win: "P (2, 5) goes to (5, 3)." },
    { say: "What does each rule do to every point in the plane?", kind: "fill", fs: 5, rows: [["(x, y) → (x + 3, y − 2)", "slides right 3 and down 2"], ["(x, y) → (−x, y)", "reflects over the y-axis"], ["(x, y) → (2x, 2y)", "stretches away from the origin"]], trap: [1, "slides right 3 and down 2"], why: "Changing the sign of x flips left and right. That is a reflection.", win: "Each rule is a function on points." },
    { say: "Apply the rule by yourself. Tap the output point.", alt: [{ say: "Apply (x, y) → (x − 1, y + 4) to P.", given: [[6, 2, "P"]], ans: [[5, 6]], trap: [[7, 6]] }, { say: "Apply (x, y) → (x + 2, y + 2) to P.", given: [[3, 1, "P"]], ans: [[5, 3]], trap: [[1, 3]] }] },
  ],
}));
