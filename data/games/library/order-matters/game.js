// Order Matters. Skill S-CP.B.9-1.
// Using permutations to count outcomes when order matters. Using combinations when order matters is the known slip.
Sidekick.game(Sidekick.play({
  title: "Order Matters",
  emoji: "🏅",
  premise: "Gold, silver, bronze: the same three runners in a different order is a different result. Count choices spot by spot.",
  outro: "When order matters, multiply the choices for each spot: 5 × 4 × 3.",
  scene: "field",
  kind: "type",
  icon: "🏅",
  hint: "How many choices for first? Then how many are left for second?",
  tag: "combination_for_permutation",
  rounds: [
    { say: "Five runners race. Key in how many ways first, second and third can be filled.", q: "5 choices × 4 choices × 3 choices", ans: 60, trap: 10, why: "10 counts groups of 3 with no order. Here each order is a different podium.", win: "5 × 4 × 3 = 60." },
    { say: "Four friends line up for a photo. Key in how many orders there are.", q: "4 × 3 × 2 × 1", ans: 24, trap: 4, why: "There are 4 choices for the first spot alone, then 3, then 2, then 1.", win: "4 × 3 × 2 × 1 = 24." },
    { say: "Count the ordered outcomes by yourself.", alt: [{ q: "A president and a vice president are chosen from 6 people.", ans: 30, trap: 15 }, { q: "Gold, silver and bronze are awarded among 4 teams.", ans: 24, trap: 4 }, { q: "A 2-letter code uses different letters from A, B, C, D, E.", ans: 20, trap: 10 }] },
  ],
}));
