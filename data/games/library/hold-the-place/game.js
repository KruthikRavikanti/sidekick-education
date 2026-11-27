// Hold the Place. Skill A-APR.D.6-2.
// Dividing polynomials using long division. Dropping the placeholder terms for missing degrees is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hold the Place",
  emoji: "🗄️",
  premise: "Long division needs a column for every power of x. If a power is missing, hold its place with a zero term.",
  outro: "Write missing powers with 0 coefficients before dividing: x^3 − 1 = x^3 + 0x^2 + 0x − 1.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Write every power from the highest down to the constant. Use 0 for the missing ones.",
  tag: "drops_placeholders",
  rounds: [
    { say: "Divide x^3 − 1 by x − 1.", rows: [["x^3 − 1 with every power shown", "x^3 + 0x^2 + 0x − 1"], ["the quotient", "x^2 + x + 1"]], extra: "x^2 − 1|", trap: [1, "x^2 − 1"], why: "Without the 0x^2 and 0x columns, the middle terms get lost.", win: "(x − 1)(x^2 + x + 1) = x^3 − 1." },
    { say: "Find each quotient.", rows: [["(x^2 + 5x + 6) ÷ (x + 2)", "x + 3"], ["(x^3 + 8) ÷ (x + 2)", "x^2 − 2x + 4"]], extra: "x^2 + 4|", trap: [1, "x^2 + 4"], why: "x^3 + 8 is x^3 + 0x^2 + 0x + 8. The middle columns matter.", win: "Check by multiplying back." },
    { say: "Find each quotient by yourself.", rows: [["(x^3 − 8) ÷ (x − 2)", "x^2 + 2x + 4"], ["(x^2 − 1) ÷ (x − 1)", "x + 1"], ["(x^3 + 1) ÷ (x + 1)", "x^2 − x + 1"]], extra: "x^2 + 4|x^2 + 1", trap: [0, "x^2 + 4"] },
  ],
}));
