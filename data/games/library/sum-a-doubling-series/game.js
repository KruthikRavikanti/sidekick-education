// Sum a Doubling Series. Skill A-SSE.B.4-1.
// Deriving and using the formula for the sum of a finite geometric series. Using the arithmetic series formula is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sum a Doubling Series",
  emoji: "📈",
  premise: "In 1 + 2 + 4 + 8 + … each total is one less than the next term. A geometric series has its own shortcut.",
  outro: "Geometric series: S = a(r^n − 1) ÷ (r − 1). For 1 + 2 + 4 + … with n terms, S = 2^n − 1.",
  scene: "paper",
  kind: "type",
  icon: "📈",
  hint: "Multiply the sum by the ratio and subtract the original. Most terms cancel.",
  tag: "uses_arithmetic_formula",
  rounds: [
    { say: "Key in the sum.", q: "1 + 2 + 4 + 8 + 16 = 2^5 − 1", ans: 31, trap: 32, why: "32 is the next term. The sum is one less.", win: "2^5 − 1 = 31." },
    { say: "Key in the sum of the 10 terms.", q: "1 + 2 + 4 + … + 512 = 2^10 − 1 · 2^10 = 1,024", ans: 1023, trap: 2565, why: "Averaging the ends works for adding series, not multiplying ones. Use 2^10 − 1.", win: "1,024 − 1 = 1,023." },
    { say: "Find the sum by yourself.", alt: [{ q: "3 + 6 + 12 + 24 = 3(2^4 − 1)", ans: 45, trap: 54 }, { q: "1 + 3 + 9 + 27 + 81 = (3^5 − 1) ÷ 2 · 3^5 = 243", ans: 121, trap: 205 }, { q: "2 + 4 + 8 + 16 + 32 + 64 = 2(2^6 − 1)", ans: 126, trap: 198 }] },
  ],
}));
