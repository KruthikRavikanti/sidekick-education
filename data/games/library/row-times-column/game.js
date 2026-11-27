// Row Times Column. Skill N-VM.C.8-2.
// Multiplying matrices of appropriate dimensions. Multiplying entry by entry is the known slip.
Sidekick.game(Sidekick.play({
  title: "Row Times Column",
  emoji: "✖️",
  premise: "Matrix multiplication is not entry by entry. Each answer comes from a whole row of the first times a whole column of the second.",
  outro: "The entry in row i, column j of AB is row i of A times column j of B, multiplied in pairs and added.",
  scene: "desk",
  kind: "type",
  icon: "✖️",
  hint: "Run along the row and down the column together. Multiply the pairs, then add.",
  tag: "entry_by_entry",
  rounds: [
    { say: "Key in the upper left entry of the product: row 1 times column 1.", fig: { type: "mats", items: ["[1,2;3,4]", "×", "[5,6;7,8]"], v: [] }, q: "1 × 5 + 2 × 7", ans: 19, trap: 5, why: "1 × 5 is only the first pair. Add 2 × 7 as well.", win: "5 + 14 = 19." },
    { say: "Key in the lower right entry: row 2 times column 2.", fig: { type: "mats", items: ["[1,2;3,4]", "×", "[5,6;7,8]"], v: [] }, q: "3 × 6 + 4 × 8", ans: 50, trap: 32, why: "32 is just 4 × 8. Add the first pair, 3 × 6.", win: "18 + 32 = 50." },
    { say: "Find the entry by yourself.", alt: [{ fig: { type: "mats", items: ["[2,1;0,3]", "×", "[4,0;1,5]"], v: [] }, q: "Upper left entry: row 1 times column 1", ans: 9, trap: 8 }, { fig: { type: "mats", items: ["[1,0;2,1]", "×", "[3,4;5,6]"], v: [] }, q: "Lower left entry: row 2 times column 1", ans: 11, trap: 10 }, { fig: { type: "mats", items: ["[2,3;1,1]", "×", "[1,2;4,0]"], v: [] }, q: "Upper left entry: row 1 times column 1", ans: 14, trap: 2 }] },
  ],
}));
