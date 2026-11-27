// Add or Multiply Pattern. Skill F-LE.A.1-1.
// Proving that linear functions grow by equal differences and exponential functions by equal factors. Thinking all increasing patterns are linear is the known slip.
Sidekick.game(Sidekick.play({
  title: "Add or Multiply Pattern",
  emoji: "📊",
  premise: "Linear patterns change by the same difference each step. Exponential patterns change by the same factor.",
  outro: "Equal differences: linear. Equal ratios: exponential.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Subtract neighbors. If that fails, divide neighbors.",
  tag: "all_patterns_linear",
  rounds: [
    { say: "Linear or exponential?", bins: "Linear|Exponential", items: ["5, 8, 11, 14|20, 17, 14, 11", "5, 10, 20, 40|81, 27, 9, 3"], trap: ["5, 10, 20, 40", 0], why: "The jumps are 5, 10, 20. They are not equal, but each term is double the last.", win: "Check differences, then ratios." },
    { say: "How does each pattern change?", kind: "fill", fs: 5.6, cast: "", rows: [["5, 8, 11, 14", "adds 3 each step"], ["5, 10, 20, 40", "multiplies by 2 each step"]], extra: "adds 5 each step|", trap: [1, "adds 5 each step"], why: "It adds 5, then 10, then 20. The constant thing is the factor 2.", win: "A difference, and a factor." },
    { say: "Sort these by yourself.", bins: "Linear|Exponential", items: ["2, 9, 16, 23|100, 90, 80, 70", "2, 6, 18, 54|64, 32, 16, 8"], trap: ["2, 6, 18, 54", 0] },
  ],
}));
