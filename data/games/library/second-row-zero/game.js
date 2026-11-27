// Second Row Zero. Skill 5.NBT.B.5-1.
// Multiplying multi-digit whole numbers with the standard algorithm. Forgetting the placeholder zero in the second partial product is the known slip.
Sidekick.game(Sidekick.play({
  title: "Second Row Zero",
  emoji: "🏗️",
  premise: "When you multiply by the tens digit, you are multiplying by tens. That row needs a zero to hold the ones place.",
  outro: "The second row of a multiplication is tens, so it starts with a zero.",
  scene: "city",
  kind: "type",
  icon: "🏗️",
  hint: "The tens digit stands for tens: 26 is 20 and 6.",
  tag: "forgets_placeholder_zero",
  rounds: [
    { say: "Build 347 × 26 one row at a time.", kind: "fill", cast: "", rows: [["347 × 6 =", "2,082"], ["347 × 20 =", "6,940"], ["2,082 + 6,940 =", "9,022"]], extra: "694 2,776", trap: [1, "694"], why: "The 2 in 26 stands for 20, so the row is 347 × 20.", win: "347 × 26 = 9,022." },
    { say: "Key in the product.", q: "58 × 34", ans: 1972, trap: 406, why: "The 3 stands for 30. That row is 58 × 30 = 1,740, not 174.", win: "232 + 1,740 = 1,972." },
    { say: "Key in the product by yourself.", alt: [{ q: "126 × 43", ans: 5418, trap: 882 }, { q: "215 × 32", ans: 6880, trap: 1075 }, { q: "304 × 25", ans: 7600, trap: 2128 }] },
  ],
}));
