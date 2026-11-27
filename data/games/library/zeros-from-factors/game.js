// Zeros From Factors. Skill A-SSE.B.3-1.
// Factoring a quadratic expression to reveal the zeros. Setting factors equal to values with the sign reversed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zeros From Factors",
  emoji: "0️⃣",
  premise: "Once a quadratic is factored, its zeros are easy: each factor is zero for one value of x. Watch the sign.",
  outro: "If (x − 2)(x − 3) = 0, then x = 2 or x = 3. The zero is the value that makes the factor 0.",
  scene: "night",
  kind: "pick",
  fs: 6.4,
  hint: "What value of x makes this bracket equal 0?",
  tag: "reversed_sign_zero",
  rounds: [
    { say: "x^2 − 5x + 6 = (x − 2)(x − 3). Tap the two zeros.", yes: "2 3", no: "−2 −3 6 5", trap: "−2", why: "x − 2 is zero when x is 2, not −2.", win: "The zeros are 2 and 3." },
    { say: "x^2 + 3x − 4 = (x + 4)(x − 1). Tap the two zeros.", yes: "−4 1", no: "4 −1 3 0", trap: "4", why: "x + 4 is zero when x is −4.", win: "The zeros are −4 and 1." },
    { say: "x^2 + 8x + 15 = (x + 3)(x + 5). Tap the two zeros by yourself.", yes: "−3 −5", no: "3 5 15 8", trap: "3" },
  ],
}));
