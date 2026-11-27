// Which Changes Faster?. Skill 8.F.A.2-1.
// Comparing properties of two functions represented in different ways. Comparing y-values instead of rates is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Changes Faster?",
  emoji: "🏁",
  premise: "A rate of change tells how much y grows for each step of x. It can be read from an equation, a table or a sentence.",
  outro: "Rate of change is the slope: the number with x in an equation, or the jump in y per step in a table.",
  scene: "field",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "In the table, how much does y go up when x goes up by 1?",
  tag: "compares_y_values",
  rounds: [
    { say: "A is y = 3x + 1. B is the table. Find each rate.", fig: { type: "table", rows: [["x", 0, 1, 2], ["y", 2, 6, 10]] }, rows: [["rate of A", "3"], ["rate of B", "4"], ["changes faster", "B"]], extra: "A|10", trap: [1, "10"], why: "10 is a y-value. The rate is the jump between rows: 4.", win: "B grows by 4 each step. A grows by 3." },
    { say: "A gains 5 each step. B is y = 2x + 20. Find each rate.", rows: [["rate of A", "5"], ["rate of B", "2"], ["changes faster", "A"]], extra: "B|20", trap: [1, "20"], why: "20 is where B starts. Its rate is the number with x: 2.", win: "A grows faster." },
    { say: "A is y = 4x. B is the table. Compare by yourself.", fig: { type: "table", rows: [["x", 0, 1, 2], ["y", 9, 12, 15]] }, rows: [["rate of A", "4"], ["rate of B", "3"], ["changes faster", "A"]], extra: "B|15", trap: [1, "15"] },
  ],
}));
