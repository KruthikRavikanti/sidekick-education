// Gumball Quarter. Skill GA-1-MDR.6.3-1.
// Identifying the quarter and its value: a quarter is 25 cents, not 4. The child matches coins to values and then pays an amount with a set number of coins.
Sidekick.game(Sidekick.play({
  title: "Gumball Quarter",
  emoji: "🍬",
  premise: "The gumball machine only takes the right coins. Learn what the quarter is worth, then pay.",
  outro: "A quarter is worth 25¢.",
  scene: "candy",
  kind: "fill",
  cast: "",
  unit: "#¢",
  hint: "Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢.",
  tag: "quarter_is_four_cents",
  rounds: [
    { say: "Drag each value next to its coin.", rows: [["penny", "1¢"], ["nickel", "5¢"], ["dime", "10¢"], ["quarter", "25¢"]], extra: "4¢", trap: [3, "4¢"], why: "A quarter is worth 25¢, the same as 25 pennies.", win: "1¢, 5¢, 10¢ and 25¢." },
    { say: "A gumball costs 25¢. Pay with one coin.", kind: "build", pile: [["penny", 1, 3], ["nickel", 5, 2], ["dime", 10, 2], ["quarter", 25, 2]], goal: 25, count: 1, trap: { sum: 10, count: 1 }, why: "A dime is only 10¢. Find the coin worth 25¢.", win: "One quarter is 25¢." },
    { say: "Pay for the gumballs by yourself.", kind: "build", pile: [["penny", 1, 3], ["nickel", 5, 2], ["dime", 10, 2], ["quarter", 25, 2]], alt: [{ say: "A gumball costs 25¢. Pay with one coin.", goal: 25, count: 1, trap: { sum: 10, count: 1 }, trap2: { sum: 5, count: 1 } }, { say: "Two gumballs cost 50¢. Pay with two coins.", goal: 50, count: 2, trap: { sum: 20, count: 2 }, trap2: { sum: 35, count: 2 } }] },
  ],
}));
