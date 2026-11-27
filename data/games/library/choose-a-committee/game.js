// Choose a Committee. Skill S-CP.B.9-2.
// Using combinations to compute probabilities of compound events. Forgetting to divide, by the repeats or by the total outcomes, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Choose a Committee",
  emoji: "🤝",
  premise: "On a committee nobody is first or second. The same people in another order is the same committee, so divide the repeats out.",
  outro: "When order does not matter, divide by the number of orders. Probability = favorable groups ÷ all groups.",
  scene: "desk",
  kind: "type",
  icon: "🤝",
  hint: "Count ordered picks, then divide by the ways to shuffle the group.",
  tag: "forgets_to_divide",
  rounds: [
    { say: "Key in how many 3-person committees can be chosen from 5 people.", q: "5 × 4 × 3 = 60 ordered picks · each group of 3 can be ordered 6 ways", ans: 10, trap: 60, why: "60 counts each committee 6 times, once per order.", win: "60 ÷ 6 = 10." },
    { say: "Key in how many pairs can be chosen from 4 people.", q: "4 × 3 = 12 ordered picks · each pair can be ordered 2 ways", ans: 6, trap: 12, why: "Ann then Ben is the same pair as Ben then Ann.", win: "12 ÷ 2 = 6." },
    { say: "Solve it by yourself.", alt: [{ q: "How many pairs can be chosen from 5 people?", ans: 10, trap: 20 }, { q: "How many groups of 3 can be chosen from 4 people?", ans: 4, trap: 24 }, { q: "How many pairs can be chosen from 6 people?", ans: 15, trap: 30 }] },
  ],
}));
