// Slope and Intercept. Skill 8.EE.B.6-3.
// Deriving the equation y = mx + b for a line intercepting the vertical axis at b. Thinking b is the slope is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slope and Intercept",
  emoji: "📈",
  premise: "In y = mx + b, the m is the slope and the b is where the line crosses the y-axis.",
  outro: "y = mx + b: m is the slope, b is the y-intercept.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "The number with x is the slope. The number alone is where it crosses the y-axis.",
  tag: "b_is_the_slope",
  rounds: [
    { say: "Set the line: slope 2, crossing the y-axis at 3.", kind: "dial", cast: "", view: { type: "graph", fn: "line", pts: [[0, 3], [1, 5]], win: [-6, 6, -6, 6] }, dials: [["Slope m", -4, 4, 1, 0], ["Intercept b", -5, 5, 1, 0]], ans: [2, 3], trap: [3, 2], why: "Those are swapped. The intercept is where it crosses the y-axis: 3.", win: "y = 2x + 3." },
    { say: "Match each line to its equation.", rows: [["slope 2, y-intercept 5", "y = 2x + 5"], ["slope 5, y-intercept 2", "y = 5x + 2"]], extra: "y = 7x|", trap: [0, "y = 5x + 2"], why: "The slope goes with x. Slope 2 means 2x.", win: "m with x, b alone." },
    { say: "Match these by yourself.", rows: [["slope 3, crosses the y-axis at −1", "y = 3x − 1"], ["slope −1, crosses the y-axis at 3", "y = −x + 3"], ["slope 4, crosses the y-axis at 0", "y = 4x"]], extra: "y = −x − 3|y = 3x + 4", trap: [0, "y = −x + 3"] },
  ],
}));
