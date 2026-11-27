// Raise and Discount. Skill 7.EE.B.3-1.
// Solving multi-step problems with rational numbers in any form, converting between forms. Converting incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Raise and Discount",
  emoji: "💼",
  premise: "Problems mix percents, fractions and decimals. Change them into one form you can compute with.",
  outro: "Convert percents and fractions to a usable form, then solve step by step.",
  scene: "city",
  kind: "type",
  icon: "💼",
  hint: "10% is one tenth. A percent is a part OF the amount, not that many dollars.",
  tag: "converts_incorrectly",
  rounds: [
    { say: "Key in the pay for 5 hours.", q: "You earn $12 an hour and get a 10% raise.", pre: "$", ans: "66", trap: "110", why: "A 10% raise is 10% of 12, which is $1.20, not $10.", win: "13.20 × 5 = 66 dollars." },
    { say: "Key in the sale price.", q: "A $30 shirt is {1/4} off.", pre: "$", ans: "22.5", trap: "29.75", why: "One quarter of 30 is 7.50, not 25 cents.", win: "30 − 7.50 = 22.50 dollars." },
    { say: "Solve it by yourself.", alt: [{ q: "You earn $20 an hour and get a 5% raise. What is your pay for 4 hours?", pre: "$", ans: "84", trap: "100" }, { q: "A $50 coat is {1/5} off. What is the sale price?", pre: "$", ans: "40", trap: "49.8" }, { q: "A 0.5-liter bottle is 40% full. How many liters are in it?", ans: "0.2", trap: "20" }] },
  ],
}));
