// Geometric Sequence Rules. Skill F-BF.A.2-2.
// Writing geometric sequences recursively and with an explicit formula. Adding the ratio is the known slip.
Sidekick.game(Sidekick.play({
  title: "Geometric Sequence Rules",
  emoji: "✖️",
  premise: "A geometric sequence multiplies by the same ratio each step. The ratio is a base with an exponent, never something you add.",
  outro: "a(n) = a(1) × r^(n − 1).",
  scene: "night",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Divide a term by the one before it to find the ratio. Then multiply, do not add.",
  tag: "adds_the_ratio",
  rounds: [
    { say: "The sequence is 3, 6, 12, ... Match each part.", rows: [["explicit rule", "a(n) = 3(2)^(n − 1)"], ["recursive rule", "a(n) = 2 × a(n − 1)"], ["6th term", "96"]], extra: "a(n) = 3 + 2(n − 1)|", trap: [0, "a(n) = 3 + 2(n − 1)"], why: "That adds 2 each step: 3, 5, 7. This sequence doubles.", win: "3 × 2^5 = 96." },
    { say: "The sequence is 2, 6, 18, ... Match each part.", rows: [["explicit rule", "a(n) = 2(3)^(n − 1)"], ["5th term", "162"]], extra: "a(n) = 2 + 3(n − 1)|14", trap: [1, "14"], why: "14 comes from adding 3 each time. Multiply by 3: 2, 6, 18, 54, 162.", win: "2 × 3^4 = 162." },
    { say: "The sequence is 5, 10, 20, ... Match by yourself.", rows: [["explicit rule", "a(n) = 5(2)^(n − 1)"], ["recursive rule", "a(n) = 2 × a(n − 1)"], ["5th term", "80"]], extra: "a(n) = 5 + 5(n − 1)|25", trap: [0, "a(n) = 5 + 5(n − 1)"] },
  ],
}));
