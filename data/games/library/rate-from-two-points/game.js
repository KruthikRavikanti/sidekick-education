// Rate From Two Points. Skill 8.F.B.4-1.
// Determining the rate of change and initial value from two (x, y) values or a table. Dividing the change in x by the change in y is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rate From Two Points",
  emoji: "🧗",
  premise: "Two points are enough to find a rate of change. Divide the change in y by the change in x.",
  outro: "Rate of change = change in y ÷ change in x.",
  scene: "field",
  kind: "type",
  icon: "🧗",
  hint: "How much did y change? How much did x change? Divide the y change by the x change.",
  tag: "run_over_rise",
  rounds: [
    { say: "Key in the rate of change.", q: "A line passes through (2, 7) and (5, 16).", ans: "3", trap: "1/3", why: "That is the change in x over the change in y. Put the 9 over the 3.", win: "9 ÷ 3 = 3." },
    { say: "Key in the initial value.", fig: { type: "table", rows: [["x", 0, 1, 2], ["y", 4, 9, 14]] }, ans: "4", trap: "5", why: "5 is the rate, the jump between rows. The initial value is y when x is 0.", win: "When x is 0, y is 4." },
    { say: "Find the rate of change by yourself.", alt: [{ q: "A line passes through (1, 5) and (3, 13).", ans: "4", trap: "1/4" }, { q: "A line passes through (0, 2) and (4, 10).", ans: "2", trap: "1/2" }, { q: "A line passes through (2, 1) and (4, 11).", ans: "5", trap: "1/5" }] },
  ],
}));
