// Cancel Factors, Not Terms. Skill A-APR.D.6-1.
// Rewriting simple rational expressions in different forms. Cancelling terms instead of factors is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cancel Factors, Not Terms",
  emoji: "✂️",
  premise: "You may cancel something that multiplies the whole numerator and denominator. You may not cancel pieces of a sum.",
  outro: "Factor first. Then cancel common factors, never single terms.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Factor the numerator. Is the denominator one of the factors?",
  tag: "cancels_terms",
  rounds: [
    { say: "Simplify each fraction.", rows: [["{2x + 6/2}", "x + 3"], ["{x^2 + 5x/x}", "x + 5"]], extra: "x + 6|x^2 + 5", trap: [0, "x + 6"], why: "The 2 divides both terms: 2x ÷ 2 and 6 ÷ 2.", win: "Factor: 2(x + 3) ÷ 2 and x(x + 5) ÷ x." },
    { say: "Factor, then cancel.", rows: [["{x^2 − 9/x + 3}", "x − 3"], ["{x^2 + 5x + 6/x + 2}", "x + 3"]], extra: "x^2 + 5x + 3|", trap: [1, "x^2 + 5x + 3"], why: "You cannot cancel the 2 into the 6 alone. Factor first: (x + 2)(x + 3).", win: "(x + 3)(x − 3) and (x + 2)(x + 3)." },
    { say: "Simplify these by yourself.", rows: [["{3x + 12/3}", "x + 4"], ["{x^2 − 25/x − 5}", "x + 5"], ["{x^2 + 2x/x}", "x + 2"]], extra: "x + 12|x^2 + 2", trap: [0, "x + 12"] },
  ],
}));
