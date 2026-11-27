// Remainder Shortcut. Skill A-APR.B.2-1.
// Knowing and applying the remainder theorem. Using p(−a) for a divisor of x − a is the known slip.
Sidekick.game(Sidekick.play({
  title: "Remainder Shortcut",
  emoji: "🎁",
  premise: "To find the remainder when p(x) is divided by x − a, skip the division. Just work out p(a).",
  outro: "Remainder theorem: dividing p(x) by (x − a) leaves remainder p(a).",
  scene: "paper",
  kind: "type",
  icon: "🎁",
  hint: "x − 2 means plug in 2. x + 1 means plug in −1.",
  tag: "uses_opposite_sign",
  rounds: [
    { say: "Key in the remainder when x^3 − 2x + 5 is divided by (x − 2).", q: "p(2) = 2^3 − 2(2) + 5", ans: 9, trap: 1, why: "1 is p(−2). The divisor x − 2 is zero at x = 2, so plug in 2.", win: "8 − 4 + 5 = 9." },
    { say: "Key in the remainder when x^2 + 3x + 1 is divided by (x + 1). Use ± if you need it.", q: "p(−1) = (−1)^2 + 3(−1) + 1", ans: -1, trap: 5, why: "5 is p(1). The divisor x + 1 is zero at x = −1.", win: "1 − 3 + 1 = −1." },
    { say: "Find the remainder by yourself.", alt: [{ q: "x^2 − 4x + 7 divided by (x − 3)", ans: 4, trap: 28 }, { q: "x^3 + x divided by (x − 2)", ans: 10, trap: -10 }, { q: "2x^2 + x − 5 divided by (x + 2)", ans: 1, trap: 5 }] },
  ],
}));
