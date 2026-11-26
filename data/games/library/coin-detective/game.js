// Coin Detective. Skill GA-K-NR.1.4-1.
// Telling pennies, nickels and dimes apart by look: coins are drawn to size and color, and the small silver dime is the one most often called a nickel.
Sidekick.game(Sidekick.play({
  title: "Coin Detective",
  emoji: "🪙",
  premise: "Three coins, three looks. Study the color and the size of each coin, then name it.",
  outro: "A penny is brown. A dime is the smallest silver coin. A nickel is bigger and silver.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Brown is the penny. The smallest silver coin is the dime.",
  tag: "dime_nickel_mix_up",
  rounds: [
    { say: "Look at each coin. Drag its name under its letter.", fig: { type: "coins", list: "p d", names: "A B" }, rows: [["A", "penny"], ["B", "dime"]], extra: "nickel", trap: [1, "nickel"], why: "The small, thin silver coin is the dime.", win: "Brown penny, small silver dime." },
    { say: "Three coins now. Name each one.", fig: { type: "coins", list: "n p d", names: "A B C" }, rows: [["A", "nickel"], ["B", "penny"], ["C", "dime"]], trap: [2, "nickel"], why: "The smallest silver coin is the dime.", win: "Nickel, penny, dime." },
    { say: "Name these coins by yourself.", alt: [{ fig: { type: "coins", list: "d n p", names: "A B C" }, rows: [["A", "dime"], ["B", "nickel"], ["C", "penny"]], trap: [0, "nickel"] }, { fig: { type: "coins", list: "p d n", names: "A B C" }, rows: [["A", "penny"], ["B", "dime"], ["C", "nickel"]], trap: [1, "nickel"] }] },
  ],
}));
