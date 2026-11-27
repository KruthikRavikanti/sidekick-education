// Garden Rows. Skill 3.OA.A.3-2.
// Array and area word problems: rows times columns gives the total inside. Adding the sides, or going around the outside, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Garden Rows",
  emoji: "🥬",
  premise: "The farmer plants in rows. Count the plants inside the garden, not the path around it.",
  outro: "Rows times the number in each row gives everything inside.",
  scene: "field",
  kind: "type",
  icon: "👩‍🌾",
  hint: "Multiply the number of rows by the number in each row.",
  tag: "adds_the_two_numbers",
  tag2: "counts_around_the_outside",
  rounds: [
    { say: "Key in how many plants.", fig: { type: "array", v: [4, 6], icon: "🥬" }, q: "A garden has 4 rows with 6 plants in each row.", ans: 24, trap: 10, why: "That is 4 rows of 6. Multiply.", win: "4 × 6 = 24 plants." },
    { say: "Key in how many plants.", q: "A garden has 7 rows with 8 plants in each row. How many plants?", ans: 56, trap: 15, trap2: 30, why: "Rows of equal size are multiplied.", why2: "That goes around the outside. Count the plants inside.", win: "7 × 8 = 56 plants." },
    { say: "Find the total by yourself.", alt: [{ q: "A garden has 6 rows with 9 plants in each row. How many plants?", ans: 54, trap: 15, trap2: 30 }, { q: "A garden has 5 rows with 8 plants in each row. How many plants?", ans: 40, trap: 13, trap2: 26 }] },
  ],
}));
