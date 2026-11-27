// Read the Table Backward. Skill F-BF.B.4-3.
// Reading values of an inverse function from a graph or a table. Reading the function forward instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Table Backward",
  emoji: "🔙",
  premise: "The inverse reads a table backward: find the number in the output row, then report the input above it.",
  outro: "f^(−1)(b) = a means f(a) = b. Look up the output, read off the input.",
  scene: "desk",
  kind: "type",
  hint: "Find the number in the f(x) row. Then look up to the x row.",
  tag: "reads_forward",
  rounds: [
    { say: "Key in f^(−1)(3). Find 3 in the f(x) row and read the x above it.", fig: { type: "table", rows: [["x", 1, 2, 3, 4], ["f(x)", 3, 1, 4, 2]], v: [] }, ans: 1, trap: 4, why: "4 is f(3), reading forward. The inverse asks which input gives 3.", win: "f(1) = 3, so f^(−1)(3) = 1." },
    { say: "Key in f^(−1)(2).", fig: { type: "table", rows: [["x", 1, 2, 3, 4], ["f(x)", 3, 1, 4, 2]], v: [] }, ans: 4, trap: 1, why: "1 is f(2). Look for 2 in the bottom row instead.", win: "f(4) = 2, so f^(−1)(2) = 4." },
    { say: "Use the table by yourself.", fig: { type: "table", rows: [["x", 1, 2, 3, 4, 5], ["f(x)", 4, 5, 1, 3, 2]], v: [] }, alt: [{ q: "f^(−1)(1) = ?", ans: 3, trap: 4 }, { q: "f^(−1)(2) = ?", ans: 5, trap: 5.5 }, { q: "f^(−1)(4) = ?", ans: 1, trap: 3 }, { q: "f^(−1)(3) = ?", ans: 4, trap: 1 }] },
  ],
}));
