// Compare Across Forms. Skill F-IF.C.9-1.
// Comparing properties of two functions each represented in a different way. Comparing only one point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Compare Across Forms",
  emoji: "⚖️",
  premise: "One function is an equation and another is a table. To compare them, find the same feature in each.",
  outro: "Compare a property (maximum, slope, intercept) by finding it in each representation.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Find the same feature for each function before comparing.",
  tag: "compares_one_point",
  rounds: [
    { say: "f(x) = −x^2 + 4. The table shows g. Which has the larger maximum?", fig: { type: "table", rows: [["x", -1, 0, 1], ["g(x)", 2, 3, 2]] }, rows: [["maximum of f", "4"], ["maximum of g", "3"], ["larger maximum", "f"]], extra: "g|2", trap: [2, "g"], why: "f peaks at 4 when x is 0. g only reaches 3.", win: "4 beats 3." },
    { say: "f(x) = 2x + 1. g is a line through (0, 5) and (1, 6). Which is steeper?", rows: [["slope of f", "2"], ["slope of g", "1"], ["steeper line", "f"]], extra: "g|5", trap: [1, "5"], why: "5 is where g starts. Its slope is the rise from 5 to 6.", win: "Slope 2 beats slope 1." },
    { say: "f(x) = x^2 − 9. The table shows g. Compare by yourself.", fig: { type: "table", rows: [["x", 0, 1, 2], ["g(x)", -5, -6, -5]] }, rows: [["minimum of f", "−9"], ["minimum of g", "−6"], ["lower minimum", "f"]], extra: "g|−5", trap: [1, "−5"] },
  ],
}));
