// Line or Curve Model?. Skill S-ID.B.6-3.
// Fitting a linear function for a scatter plot that suggests a linear association. Forcing a line through curved data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Line or Curve Model?",
  emoji: "〰️",
  premise: "A line only fits data that looks like a straight band. If the points bend, use a curve.",
  outro: "Fit a linear function only when the scatter plot suggests a linear association.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Do the points follow a straight band, or do they bend?",
  tag: "forces_line_through_curve",
  rounds: [
    { say: "Should you fit a line, or use a curve?", bins: "Fit a line|Use a curve", items: ["points rise steadily in a straight band|points fall at a steady rate", "points curve upward like a bowl|points rise fast, then level off"], trap: ["points curve upward like a bowl", 0], why: "A bowl shape bends. A straight line would miss both ends.", win: "Straight band: line. Bend: curve." },
    { say: "These points fall in a straight band. Turn the dials to fit a line through the middle.", kind: "dial", cast: "", view: { type: "graph", fn: "line", dots: [[1, 6], [2, 7], [3, 4], [4, 5], [5, 2], [6, 3]], win: [0, 8, 0, 9] }, dials: [["Slope", -3, 3, 0.5, 0], ["Height", 0, 10, 1, 5]], ans: [-1, 8], trap: [1, 8], why: "The dots go downhill. The slope must be negative.", win: "Three dots above, three below." },
    { say: "Sort these by yourself.", bins: "Fit a line|Use a curve", items: ["a straight band of dots sloping down|dots tight around a rising line", "dots that form an arch|dots that double each step"], trap: ["dots that form an arch", 0] },
  ],
}));
