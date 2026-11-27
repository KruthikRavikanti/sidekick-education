// Order With Letters. Skill 6.EE.A.2-4.
// Performing arithmetic operations in the conventional order when evaluating expressions, including those with exponents. Working left to right only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Order With Letters",
  emoji: "🪜",
  premise: "Once the letters become numbers, the order of operations still rules. Powers first, then multiply, then add.",
  outro: "After substituting, do exponents, then multiplication, then addition.",
  scene: "desk",
  kind: "type",
  icon: "🪜",
  hint: "Do the power first, then the multiplying, then the adding.",
  tag: "left_to_right_only",
  rounds: [
    { say: "Key in the value.", q: "Find 2 + 3x² when x = 2.", ans: 14, trap: 20, why: "Do the power first: x² = 4. Then 3 × 4 = 12, then add 2.", win: "2 + 12 = 14." },
    { say: "Key in the value.", q: "Find 10 − 2a when a = 3.", ans: 4, trap: 24, why: "Multiply first: 2 × 3 = 6. Then 10 − 6.", win: "10 − 6 = 4." },
    { say: "Key in the value by yourself.", alt: [{ q: "Find 5 + 2y² when y = 3.", ans: 23, trap: 63 }, { q: "Find 20 − 3n when n = 4.", ans: 8, trap: 68 }, { q: "Find x² + 4x when x = 5.", ans: 45, trap: 145 }] },
  ],
}));
