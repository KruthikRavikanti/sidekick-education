// Logs Ask for the Exponent. Skill F-BF.B.5-1.
// Understanding the inverse relationship between exponents and logarithms. Treating a log as division, or splitting it over addition, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Logs Ask for the Exponent",
  emoji: "🪵",
  premise: "A logarithm is a question: what exponent turns the base into this number? Log base 2 of 8 asks 2 to the what is 8.",
  outro: "log base b of x = y means b^y = x. Logs and exponentials undo each other.",
  scene: "forest",
  kind: "type",
  icon: "🪵",
  hint: "Count how many times the base multiplies itself to reach the number.",
  tag: "log_as_division",
  rounds: [
    { say: "Key in log base 2 of 8.", q: "2 to what power is 8?", ans: 3, trap: 4, why: "4 is 8 ÷ 2. The log asks for the exponent: 2 × 2 × 2 = 8.", win: "2^3 = 8, so the log is 3." },
    { say: "Key in log base 10 of 1,000.", q: "10 to what power is 1,000?", ans: 3, trap: 100, why: "100 is 1,000 ÷ 10. Count the tens multiplied: 10 × 10 × 10.", win: "10^3 = 1,000." },
    { say: "Find the logarithm by yourself.", alt: [{ q: "log base 3 of 81", ans: 4, trap: 27 }, { q: "log base 5 of 25", ans: 2, trap: 5 }, { q: "log base 2 of 32", ans: 5, trap: 16 }, { q: "log base 10 of 100", ans: 2, trap: 10 }] },
  ],
}));
