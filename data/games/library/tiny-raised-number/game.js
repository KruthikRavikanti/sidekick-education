// Tiny Raised Number. Skill 5.NBT.A.2-3.
// Using whole-number exponents to denote powers of 10. Reading 10³ as 10 × 3 = 30 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tiny Raised Number",
  emoji: "🎈",
  premise: "The small raised number tells how many tens are multiplied together. 10³ is three tens multiplied, not 10 times 3.",
  outro: "The exponent counts how many 10s are multiplied: 10³ = 10 × 10 × 10 = 1,000.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "Write out the tens: 10³ is 10 × 10 × 10.",
  tag: "multiplies_base_by_exponent",
  rounds: [
    { say: "Match each power of ten to its value.", rows: [["10³ =", "1,000"], ["10² =", "100"]], extra: "30 20", trap: [0, "30"], why: "10³ means 10 × 10 × 10, not 10 × 3.", win: "One thousand and one hundred." },
    { say: "Now with a number in front.", rows: [["4 × 10² =", "400"], ["7 × 10³ =", "7,000"], ["10⁴ =", "10,000"]], extra: "80 40", trap: [0, "80"], why: "10² is 100. Then 4 × 100 is 400.", win: "400, 7,000 and 10,000." },
    { say: "Match these by yourself.", rows: [["10⁵ =", "100,000"], ["6 × 10² =", "600"], ["10⁴ =", "10,000"]], extra: "50 120", trap: [0, "50"] },
  ],
}));
