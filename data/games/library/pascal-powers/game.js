// Pascal Powers. Skill A-APR.C.5-1.
// Knowing and applying the Binomial Theorem for the expansion of (x + y)^n. Writing x^n + y^n is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pascal Powers",
  emoji: "🔺",
  premise: "Expanding (x + y)^n gives more than the two end terms. The middle terms get their coefficients from Pascal’s triangle.",
  outro: "Binomial theorem: the coefficients of (x + y)^n are row n of Pascal’s triangle. Powers of x fall as powers of y rise.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Use the row of Pascal’s triangle for the coefficients. Do not skip the middle terms.",
  tag: "drops_middle_terms",
  rounds: [
    { say: "Match each power to its expansion.", rows: [["(x + y)^2", "x^2 + 2xy + y^2"], ["(x + y)^3", "x^3 + 3x^2y + 3xy^2 + y^3"]], extra: "x^3 + y^3|", trap: [1, "x^3 + y^3"], why: "Multiply it out: the cross terms 3x^2y and 3xy^2 appear in the middle.", win: "Coefficients 1 2 1 and 1 3 3 1." },
    { say: "Key in the coefficient of x^2y^2 in (x + y)^4. Use row n = 4.", kind: "type", icon: "🔺", fig: { type: "table", rows: [["n = 2", 1, 2, 1], ["n = 3", 1, 3, 3, 1], ["n = 4", 1, 4, 6, 4, 1]], v: [] }, ans: 6, trap: 4, why: "4 is the second number in the row. x^2y^2 is the middle term.", win: "Row 4 is 1 4 6 4 1. The middle is 6." },
    { say: "Find the coefficient by yourself.", kind: "type", icon: "🔺", fig: { type: "table", rows: [["n = 2", 1, 2, 1], ["n = 3", 1, 3, 3, 1], ["n = 4", 1, 4, 6, 4, 1]], v: [] }, alt: [{ q: "the coefficient of x^2y in (x + y)^3", ans: 3, trap: 1 }, { q: "the coefficient of xy^3 in (x + y)^4", ans: 4, trap: 1 }, { q: "the coefficient of xy in (x + y)^2", ans: 2, trap: 1 }] },
  ],
}));
