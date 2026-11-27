// Complete the Square. Skill A-SSE.B.3-2.
// Completing the square in a quadratic expression to reveal the maximum or minimum value. Forgetting to balance the added constant is the known slip.
Sidekick.game(Sidekick.play({
  title: "Complete the Square",
  emoji: "⬛",
  premise: "Rewriting a quadratic as a square plus a number shows its lowest point at a glance.",
  outro: "x² + 6x + 5 = (x + 3)² − 4: the minimum is −4, at x = −3. Balance whatever you add.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Half of the middle number goes in the bracket. Its square was added, so take it away again.",
  tag: "forgets_to_balance",
  rounds: [
    { say: "Slide the parabola so its lowest point sits on the star.", kind: "dial", cast: "", view: { type: "graph", fn: "quad", pre: [1], pts: [[-3, -4]], win: [-7, 3, -6, 4] }, dials: [["Across", -5, 4, 1, 0], ["Up", -5, 3, 1, 0]], ans: [-3, -4], trap: [3, -4], why: "That is 3 to the right. The lowest point of (x + 3)² − 4 is at x = −3.", win: "y = (x + 3)² − 4, lowest at (−3, −4)." },
    { say: "Complete the square for x^2 + 6x + 5.", rows: [["x^2 + 6x + 5 =", "(x + 3)^2 − 4"], ["minimum value", "−4"], ["it happens at x =", "−3"]], extra: "(x + 3)^2 + 5|", trap: [0, "(x + 3)^2 + 5"], why: "The bracket secretly added 9. Take it off: 5 − 9 = −4.", win: "The square form shows the minimum." },
    { say: "Complete the square for x^2 − 8x + 10 by yourself.", rows: [["x^2 − 8x + 10 =", "(x − 4)^2 − 6"], ["minimum value", "−6"], ["it happens at x =", "4"]], extra: "(x − 4)^2 + 10|−4", trap: [0, "(x − 4)^2 + 10"] },
  ],
}));
