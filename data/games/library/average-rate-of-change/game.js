// Average Rate of Change. Skill F-IF.B.6-1.
// Calculating the average rate of change of a function over a specified interval. Dividing the change in x by the change in y is the known slip.
Sidekick.game(Sidekick.play({
  title: "Average Rate of Change",
  emoji: "📐",
  premise: "The average rate of change between two inputs is the slope of the straight line joining those two points on the graph.",
  outro: "Average rate of change = change in f ÷ change in x.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "Find f at both ends. Subtract, then divide by how far x moved.",
  tag: "x_change_over_y_change",
  rounds: [
    { say: "Key in the average rate of change.", q: "f(x) = x^2, from x = 1 to x = 3", ans: "4", trap: "1/4", why: "f goes from 1 to 9, a change of 8. Divide 8 by 2, not 2 by 8.", win: "8 ÷ 2 = 4." },
    { say: "Key in the average rate of change from x = 0 to x = 2.", fig: { type: "table", rows: [["x", 0, 2, 5], ["f(x)", 1, 7, 22]] }, ans: "3", trap: "1/3", why: "f rises 6 while x rises 2. Divide 6 by 2.", win: "6 ÷ 2 = 3." },
    { say: "Find it by yourself.", alt: [{ q: "f(x) = x^2, from x = 2 to x = 4", ans: "6", trap: "1/6" }, { q: "f(x) = 3x + 1, from x = 0 to x = 5", ans: "3", trap: "1/3" }, { q: "f(x) = x^2, from x = 0 to x = 5", ans: "5", trap: "1/5" }] },
  ],
}));
