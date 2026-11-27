// Lines Through the Origin. Skill 8.EE.B.6-2.
// Deriving the equation y = mx for a line through the origin. Not connecting it to proportional relationships is the known slip.
Sidekick.game(Sidekick.play({
  title: "Lines Through the Origin",
  emoji: "🎯",
  premise: "A line through the origin is a proportional relationship. Its equation is y = mx, where m is the slope.",
  outro: "A line through (0, 0) with slope m has the equation y = mx.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Slope is rise over run from the origin. Put it in front of x.",
  tag: "cannot_connect_to_proportional",
  rounds: [
    { say: "Set the line so it passes through the origin and the star.", kind: "dial", cast: "", view: { type: "graph", fn: "line", pts: [[0, 0], [1, 3]], win: [-5, 5, -5, 5] }, dials: [["Slope", -4, 4, 1, 1], ["Intercept", -4, 4, 1, 2]], ans: [3, 0], trap: [3, 2], why: "A line through the origin has intercept 0.", win: "y = 3x: slope 3, through the origin." },
    { say: "Match each line to its equation.", rows: [["through the origin, slope 3", "y = 3x"], ["through the origin, slope {1/2}", "y = {1/2}x"]], extra: "y = x + 3|", trap: [0, "y = x + 3"], why: "y = x + 3 crosses the y-axis at 3, not at the origin.", win: "y = mx." },
    { say: "Match these by yourself.", rows: [["through (0, 0) and (1, 5)", "y = 5x"], ["through (0, 0) and (2, 8)", "y = 4x"], ["through (0, 0) and (3, 6)", "y = 2x"]], extra: "y = 8x|y = x + 5", trap: [1, "y = 8x"] },
  ],
}));
