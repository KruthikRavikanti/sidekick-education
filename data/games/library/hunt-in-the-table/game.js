// Hunt in the Table. Skill A-REI.D.11-2.
// Finding approximate solutions of f(x) = g(x) using tables. Stopping at the first close value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hunt in the Table",
  emoji: "🔎",
  premise: "Some equations cannot be solved by algebra alone. A table of values shows where the two sides meet.",
  outro: "Compare both sides in a table. The solution is where the outputs are equal, not merely close.",
  scene: "desk",
  kind: "type",
  hint: "Keep going down the table until the two rows are exactly equal.",
  tag: "stops_when_close",
  rounds: [
    { say: "Solve 2^x = x + 2 for x greater than 0. Key in the x where the rows match.", fig: { type: "table", rows: [["x", 0, 1, 2, 3], ["2^x", 1, 2, 4, 8], ["x + 2", 2, 3, 4, 5]], v: [] }, ans: 2, trap: 1, why: "At x = 1 the rows are close, 2 and 3, but not equal. Keep looking.", win: "At x = 2 both rows are 4." },
    { say: "Solve x^2 = 2x + 3. Key in the positive x where the rows match.", fig: { type: "table", rows: [["x", 0, 1, 2, 3, 4], ["x^2", 0, 1, 4, 9, 16], ["2x + 3", 3, 5, 7, 9, 11]], v: [] }, ans: 3, trap: 2, why: "At x = 2 the rows are 4 and 7. They meet at 9.", win: "At x = 3 both rows are 9." },
    { say: "Key in the x where the rows match by yourself.", alt: [{ fig: { type: "table", rows: [["x", 0, 1, 2, 3], ["3^x", 1, 3, 9, 27], ["2x + 5", 5, 7, 9, 11]], v: [] }, ans: 2, trap: 1 }, { fig: { type: "table", rows: [["x", 1, 2, 3, 4], ["x^2", 1, 4, 9, 16], ["3x + 4", 7, 10, 13, 16]], v: [] }, ans: 4, trap: 3 }, { fig: { type: "table", rows: [["x", 1, 2, 3, 4], ["2^x", 2, 4, 8, 16], ["x + 5", 6, 7, 8, 9]], v: [] }, ans: 3, trap: 2 }] },
  ],
}));
