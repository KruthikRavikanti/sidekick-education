// Dilated Lines Stay Parallel. Skill G-SRT.A.1-1.
// Verifying that a dilation takes a line not passing through the center to a parallel line and leaves a line through the center unchanged. Thinking lines through the center move is the known slip.
Sidekick.game(Sidekick.play({
  title: "Dilated Lines Stay Parallel",
  emoji: "🔍",
  premise: "A dilation pushes points away from its center. A line through the center stays put. Any other line moves to a parallel line.",
  outro: "A dilation takes a line not through the center to a parallel line, and leaves a line through the center unchanged.",
  scene: "paper",
  kind: "sort",
  fs: 4.8,
  hint: "Points on a line through the center slide along that same line.",
  tag: "center_lines_move",
  rounds: [
    { say: "True or not true about a dilation?", bins: "True|Not true", items: ["A line not through the center maps to a parallel line.|A line through the center maps onto itself.", "A dilation tilts lines to new slopes.|A line through the center moves off to the side."], trap: ["A line through the center moves off to the side.", 0], why: "Each of its points slides along the same line, so the line stays where it is.", win: "Slopes never change in a dilation." },
    { say: "The blue line is y = x + 1. Dilate it by 2 from the origin. Set the orange image line.", kind: "dial", cast: "", view: { type: "graph", fn: "line", also: [["line", 1, 1]], win: [-6, 6, -6, 6] }, dials: [["Slope", -3, 3, 1, 0], ["Intercept", -5, 5, 1, 0]], ans: [1, 2], trap: [2, 2], why: "The slope does not double. The image is parallel: slope 1.", win: "(0, 1) goes to (0, 2). The slope stays 1." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["The image of a line is parallel to it or the same line.|Distances from the center are multiplied.", "A dilation turns a line into a curve.|Parallel lines cross after a dilation."], trap: ["A dilation turns a line into a curve.", 0] },
  ],
}));
