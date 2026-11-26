// Coin Values. Skill 2.MD.C.8-1.
// Knowing the value of pennies, nickels, dimes, quarters and dollar bills. Giving the bigger nickel the bigger value than the dime is the known slip.
Sidekick.game(Sidekick.play({
  title: "Coin Values",
  emoji: "💰",
  premise: "Every coin and bill has its own value, and size does not tell you what it is worth. Match each one.",
  outro: "Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢, dollar 100¢.",
  scene: "candy",
  kind: "fill",
  cast: "",
  unit: "#¢",
  hint: "The dime is small but worth 10¢. The nickel is bigger but worth only 5¢.",
  tag: "bigger_coin_worth_more",
  rounds: [
    { say: "Drag each value next to its coin.", rows: [["nickel", "5¢"], ["dime", "10¢"], ["quarter", "25¢"]], extra: "1¢", trap: [1, "5¢"], why: "The dime is smaller than the nickel, but it is worth more: 10¢.", win: "5¢, 10¢ and 25¢." },
    { say: "Now all five.", rows: [["penny", "1¢"], ["nickel", "5¢"], ["dime", "10¢"], ["quarter", "25¢"], ["dollar bill", "100¢"]], trap: [2, "5¢"], why: "A dime is worth 10¢, twice as much as a nickel.", win: "You know every value." },
    { say: "Pay with exactly two coins.", kind: "build", pile: [["penny", 1, 3], ["nickel", 5, 2], ["dime", 10, 2], ["quarter", 25, 2]], alt: [{ say: "Pay 30¢ with exactly two coins.", goal: 30, count: 2, trap: { sum: 15, count: 2 } }, { say: "Pay 35¢ with exactly two coins.", goal: 35, count: 2, trap: { sum: 15, count: 2 } }] },
  ],
}));
