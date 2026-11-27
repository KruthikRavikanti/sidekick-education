// Read the Growth Formula. Skill A-SSE.A.1-2.
// Interpreting complicated expressions by viewing one or more parts as a single entity. Distributing the exponent across the bracket is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read the Growth Formula",
  emoji: "📈",
  premise: "In P(1 + r)^n the bracket is one single thing: the multiplier applied every period. The exponent counts the periods.",
  outro: "In P(1 + r)^n: P is the start, (1 + r) is the growth factor each period, n is the number of periods.",
  scene: "city",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Treat the whole bracket as one number that multiplies again and again.",
  tag: "distributes_exponent",
  rounds: [
    { say: "In P(1 + r)^n, what does each part represent?", rows: [["P", "the starting amount"], ["(1 + r)", "the multiplier each period"], ["n", "the number of periods"]], extra: "the interest earned|", trap: [1, "the interest earned"], why: "The bracket is the factor the amount is multiplied by each period.", win: "Start, multiplier, periods." },
    { say: "In 500(1.04)^t, what does each part mean?", rows: [["500", "the starting amount"], ["1.04", "grows 4% each year"], ["t", "the number of years"]], extra: "grows 104% each year|", trap: [1, "grows 104% each year"], why: "1.04 means 100% kept plus 4% more.", win: "A 4 percent yearly gain." },
    { say: "In 2000(0.9)^t, match by yourself.", rows: [["2000", "the starting value"], ["0.9", "keeps 90% each year"], ["t", "the years passed"]], extra: "gains 90% each year|", trap: [1, "gains 90% each year"] },
  ],
}));
