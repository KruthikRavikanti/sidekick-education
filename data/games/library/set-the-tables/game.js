// Set the Tables. Skill 3.OA.A.3-1.
// Equal-groups word problems: the number of groups times the size of each group. Adding the two numbers in the story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Set the Tables",
  emoji: "🍽️",
  premise: "The party has equal groups everywhere: chairs at tables, apples in bags. Find each total.",
  outro: "Equal groups are multiplied, not added.",
  scene: "kitchen",
  kind: "type",
  icon: "🍽️",
  hint: "How many groups? How many in each? Multiply.",
  tag: "adds_the_two_numbers",
  rounds: [
    { say: "Key in the total.", fig: { type: "groups", v: [6, 4], icon: "🪑" }, q: "There are 6 tables with 4 chairs at each. How many chairs?", ans: 24, trap: 10, why: "Each table has 4 chairs. That is 6 groups of 4, not 6 + 4.", win: "6 × 4 = 24 chairs." },
    { say: "Key in the total.", q: "There are 5 bags with 7 apples in each. How many apples?", ans: 35, trap: 12, why: "That is 5 groups of 7. Multiply.", win: "5 × 7 = 35 apples." },
    { say: "Find the total by yourself.", alt: [{ q: "There are 8 boxes with 3 crayons in each. How many crayons?", ans: 24, trap: 11 }, { q: "There are 4 teams with 9 players on each. How many players?", ans: 36, trap: 13 }] },
  ],
}));
