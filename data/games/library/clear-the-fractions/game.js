// Clear the Fractions. Skill 8.EE.C.7-4.
// Solving linear equations with rational number coefficients. Clearing denominators on only some terms is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clear the Fractions",
  emoji: "🧹",
  premise: "Fractions in an equation can be cleared by multiplying EVERY term by the denominator. Miss a term and the scale tips.",
  outro: "Multiply every term on both sides by the denominator to clear a fraction.",
  scene: "desk",
  kind: "type",
  icon: "🧹",
  hint: "Multiply every single term by the bottom number, including the plain numbers.",
  tag: "clears_some_terms",
  rounds: [
    { say: "Key in the value of x.", q: "{2/3}x + 1 = 5", ans: "6", trap: "7", why: "Multiplying by 3 must hit the 1 as well: 2x + 3 = 15.", win: "2x = 12, so x = 6." },
    { say: "Key in the value of x.", q: "{1/2}x − 3 = 4", ans: "14", trap: "11", why: "Multiplying by 2 must hit the 3 as well: x − 6 = 8.", win: "x = 14." },
    { say: "Solve by yourself.", alt: [{ q: "{3/4}x + 2 = 8", ans: "8", trap: "10" }, { q: "{1/3}x − 1 = 3", ans: "12", trap: "10" }, { q: "0.2x + 1 = 5", ans: "20", trap: "0.8" }] },
  ],
}));
