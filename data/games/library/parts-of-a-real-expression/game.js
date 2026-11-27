// Parts of a Real Expression. Skill A-SSE.A.1-1.
// Interpreting parts of an expression such as terms, factors and coefficients. Calling a factor a term is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parts of a Real Expression",
  emoji: "🎉",
  premise: "Every piece of an expression means something in the situation. A term is added. A factor multiplies. A coefficient is the number in front.",
  outro: "Interpret terms, factors and coefficients in terms of the context.",
  scene: "candy",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Is it added on its own, or does it multiply something?",
  tag: "factor_called_term",
  rounds: [
    { say: "A party costs 50 + 12n dollars for n guests. What does each part mean?", rows: [["50", "the fixed fee"], ["12", "the cost per guest"], ["12n", "the cost for all the guests"]], extra: "the number of guests|", trap: [1, "the fixed fee"], why: "12 multiplies n. It is charged once for each guest.", win: "A fixed term and a per-guest coefficient." },
    { say: "A taxi costs 4.50x + 3 dollars for x miles. What does each part mean?", rows: [["3", "the starting charge"], ["4.50", "the cost per mile"], ["x", "the miles driven"]], trap: [0, "the cost per mile"], why: "3 stands alone. It is charged once, before any miles.", win: "Starting charge, rate, miles." },
    { say: "Savings left are 200 − 15w after w weeks. Match by yourself.", rows: [["200", "the starting amount"], ["15", "the amount spent each week"], ["w", "the number of weeks"]], extra: "the total left|", trap: [1, "the total left"] },
  ],
}));
