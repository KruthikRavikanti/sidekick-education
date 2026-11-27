// Factor Test. Skill A-APR.B.2-2.
// Using the remainder theorem to test for factors. Thinking a remainder of 0 means it is not a factor is the known slip.
Sidekick.game(Sidekick.play({
  title: "Factor Test",
  emoji: "🔑",
  premise: "If plugging in a gives zero, then x − a divides the polynomial with nothing left over. It is a factor.",
  outro: "(x − a) is a factor of p(x) exactly when p(a) = 0.",
  scene: "paper",
  kind: "sort",
  fs: 5.6,
  hint: "Plug in the number that makes the binomial zero. Did you get 0?",
  tag: "zero_means_not_factor",
  rounds: [
    { say: "Test each one on p(x) = x^2 − 5x + 6.", bins: "Factor|Not a factor", items: ["(x − 3)|(x − 2)", "(x + 3)|(x − 1)"], trap: ["(x − 3)", 1], why: "p(3) = 9 − 15 + 6 = 0. A zero remainder means it divides evenly.", win: "p(3) = 0 and p(2) = 0." },
    { say: "Key in p(3) for p(x) = x^2 − 5x + 6.", kind: "type", icon: "🔑", q: "3^2 − 5(3) + 6", ans: 0, trap: 30, why: "−5 times 3 is −15, not +15.", win: "9 − 15 + 6 = 0, so (x − 3) is a factor." },
    { say: "Test each one on p(x) = x^3 − x by yourself.", bins: "Factor|Not a factor", items: ["(x − 1)|(x + 1)|x", "(x − 2)|(x + 2)"], trap: ["(x + 1)", 1] },
  ],
}));
