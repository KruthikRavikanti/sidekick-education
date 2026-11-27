// Equation, Table, Graph. Skill 6.EE.C.9-3.
// Analyzing the relationship between variables using graphs and tables and relating these to the equation. Treating the three as unrelated is the known slip.
Sidekick.game(Sidekick.play({
  title: "Equation, Table, Graph",
  emoji: "🔗",
  premise: "An equation, a table and a graph are three views of one relationship. Each one can be made from the others.",
  outro: "The equation gives the rule, the table lists pairs, and the graph plots them.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Put each h into the equation to get p.",
  tag: "treats_views_as_unrelated",
  rounds: [
    { say: "For p = 9h, finish the table.", fig: { type: "table", rows: [["h", 1, 2, 3], ["p", "?", "?", "?"]] }, rows: [["h = 1", "9"], ["h = 2", "18"], ["h = 3", "27"]], extra: "10 11", trap: [1, "10"], why: "The rule is 9 times h, not 9 plus 1 more each time.", win: "9, 18, 27." },
    { say: "Now graph y = 2x. Plot the points for x = 1, 2 and 3.", kind: "plot", cast: "", axes: [0, 8, 0, 8], join: "line", quiet: true, ans: [[1, 2], [2, 4], [3, 6]], trap: [[2, 1], [4, 2], [6, 3]], why: "x goes across. When x is 1, y is 2.", win: "The points make a straight line." },
    { say: "For y = 3x, finish the table by yourself.", fig: { type: "table", rows: [["x", 1, 2, 4], ["y", "?", "?", "?"]] }, rows: [["x = 1", "3"], ["x = 2", "6"], ["x = 4", "12"]], extra: "9 7", trap: [2, "9"] },
  ],
}));
