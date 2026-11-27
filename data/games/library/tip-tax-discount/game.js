// Tip, Tax, Discount. Skill 7.RP.A.3-2.
// Solving multistep percent problems: tax, tip, discount, interest. Subtracting the percent as if it were dollars is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tip, Tax, Discount",
  emoji: "🧥",
  premise: "A percent off is a percent OF the price, not that many dollars. Find the percent amount first, then add or subtract it.",
  outro: "Find the percent of the price in dollars. Subtract it for a discount, add it for tax or a tip.",
  scene: "city",
  kind: "type",
  icon: "🧥",
  pre: "$",
  hint: "What is that percent OF the price, in dollars?",
  tag: "percent_as_dollars",
  rounds: [
    { say: "Key in the sale price.", q: "A $60 jacket is 25% off.", ans: 45, trap: 35, why: "That takes off 25 dollars. 25% of 60 is 15 dollars.", win: "60 − 15 = 45 dollars." },
    { say: "Key in the total with the tip.", q: "A $40 meal with a 20% tip.", ans: 48, trap: 60, why: "That adds 20 dollars. 20% of 40 is 8 dollars.", win: "40 + 8 = 48 dollars." },
    { say: "Find the final price by yourself.", alt: [{ q: "$80 shoes are 10% off.", ans: 72, trap: 70 }, { q: "A $50 game with 6% sales tax.", ans: 53, trap: 56 }, { q: "A $20 book is 15% off.", ans: 17, trap: 5 }] },
  ],
}));
