// Piggy Bank. Skill GA-K-NR.1.4-2.
// Knowing the value of each coin: the child matches coins to cents, then pays an amount with a single coin. Treating every coin as 1¢ is the known slip.
Sidekick.game(Sidekick.play({
  title: "Piggy Bank",
  emoji: "🐷",
  premise: "The piggy bank knows what every coin is worth. Match the coins to their values, then feed the pig.",
  outro: "A penny is 1¢, a nickel is 5¢ and a dime is 10¢.",
  scene: "candy",
  kind: "fill",
  cast: "",
  unit: "#¢",
  hint: "Penny 1¢, nickel 5¢, dime 10¢.",
  tag: "every_coin_is_one_cent",
  rounds: [
    { say: "Drag each value under its coin.", rows: [["penny", "1¢"], ["nickel", "5¢"], ["dime", "10¢"]], trap: [1, "1¢"], why: "A nickel is worth 5 pennies. It is 5¢.", win: "1¢, 5¢ and 10¢." },
    { say: "Feed the pig one coin that is worth 10¢.", kind: "build", pile: [["penny", 1, 3], ["nickel", 5, 2], ["dime", 10, 2]], goal: 10, count: 1, trap: { sum: 5, count: 1 }, why: "A nickel is 5¢. Find the coin that is worth 10¢.", win: "One dime is 10¢." },
    { say: "Feed the pig by yourself.", kind: "build", pile: [["penny", 1, 3], ["nickel", 5, 2], ["dime", 10, 2]], alt: [{ say: "Feed the pig one coin that is worth 5¢.", goal: 5, count: 1, trap: { sum: 1, count: 1 }, trap2: { sum: 10, count: 1 } }, { say: "Feed the pig one coin that is worth 10¢.", goal: 10, count: 1, trap: { sum: 1, count: 1 }, trap2: { sum: 5, count: 1 } }] },
  ],
}));
