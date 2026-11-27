// Does the Solution Make Sense?. Skill A-CED.A.3-2.
// Interpreting solutions as viable or nonviable options in a modeling context. Accepting negative people or fractional tickets is the known slip.
Sidekick.game(Sidekick.play({
  title: "Does the Solution Make Sense?",
  emoji: "🤔",
  premise: "A pair of numbers can satisfy the inequality and still be nonsense. You cannot buy −1 pizzas or half a ticket.",
  outro: "A viable solution satisfies the constraints AND makes sense in the situation.",
  scene: "kitchen",
  kind: "sort",
  fs: 6,
  hint: "Does it fit the budget? Are both numbers whole and not negative?",
  tag: "accepts_nonviable",
  rounds: [
    { say: "Budget: 10p + 2d ≤ 50 for whole pizzas p and drinks d. Is each (p, d) possible?", bins: "Possible|Not possible", items: ["(3, 10)|(5, 0)", "(−1, 20)|(4, 10)|(2.5, 3)"], trap: ["(−1, 20)", 0], why: "The numbers fit the inequality, but you cannot buy −1 pizzas.", win: "Fit the budget and make sense." },
    { say: "Tickets: 8a + 5c ≤ 100 for adults a and children c. Sort each (a, c).", bins: "Possible|Not possible", items: ["(5, 10)|(10, 4)", "(−2, 20)|(10, 10)|(3.5, 2)"], trap: ["(3.5, 2)", 0], why: "You cannot sell three and a half tickets.", win: "Whole, non-negative and within budget." },
    { say: "A van has 12 seats and adults take 2: 2a + c ≤ 12. Sort each (a, c) by yourself.", bins: "Possible|Not possible", items: ["(4, 4)|(0, 12)", "(−1, 14)|(6, 2)|(1.5, 3)"], trap: ["(−1, 14)", 0] },
  ],
}));
