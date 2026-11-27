// Bank Teller. Skill 2.MD.C.8-2.
// Counting a mix of coins: each coin adds its own value. Counting every coin as 1 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bank Teller",
  emoji: "🏦",
  premise: "Coins slide across the counter in a mix. Count them up by their values and key in the total.",
  outro: "Count the biggest coins first, then count on with the smaller ones.",
  scene: "city",
  kind: "type",
  icon: "🪙",
  unit: "¢",
  hint: "Start with the quarters: 25, 50. Then count on by tens, fives and ones.",
  tag: "counts_each_coin_as_one",
  rounds: [
    { say: "Key in the total in cents.", q: "2 quarters, 1 dime and 3 pennies", ans: 63, trap: 6, why: "That is how many coins there are. Count their values: 25, 50, 60, 61, 62, 63.", win: "63¢." },
    { say: "Count this mix.", q: "1 quarter, 2 dimes and 1 nickel", ans: 50, trap: 4, why: "Count the values: 25, 35, 45, 50.", win: "50¢." },
    { say: "Count the coins by yourself.", alt: [{ q: "3 quarters, 1 nickel and 2 pennies", ans: 82, trap: 6 }, { q: "2 quarters, 3 dimes and 4 pennies", ans: 84, trap: 9 }] },
  ],
}));
