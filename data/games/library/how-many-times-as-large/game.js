// How Many Times as Large?. Skill 8.EE.A.3-2.
// Using powers of 10 to estimate how many times as large one quantity is than another. Comparing only the first factors is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Many Times as Large?",
  emoji: "🪐",
  premise: "To compare numbers in scientific notation, divide the first factors and compare the powers of 10. The powers matter most.",
  outro: "Divide the first factors and subtract the exponents.",
  scene: "space",
  kind: "type",
  icon: "🪐",
  hint: "Divide the front numbers. Then subtract the exponents for the power of 10.",
  tag: "compares_first_factor_only",
  rounds: [
    { say: "Key in about how many times as large the first number is.", q: "8 × 10^9 compared with 2 × 10^6", ans: 4000, trap: 4, why: "That compares only 8 and 2. The powers differ by 10^3, which is 1,000.", win: "4 × 1,000 = 4,000 times." },
    { say: "Key in how many times as large.", q: "6 × 10^5 compared with 3 × 10^3", ans: 200, trap: 2, why: "The powers differ by 10^2, which is 100.", win: "2 × 100 = 200 times." },
    { say: "Compare by yourself.", alt: [{ q: "9 × 10^8 compared with 3 × 10^5", ans: 3000, trap: 3 }, { q: "4 × 10^7 compared with 2 × 10^5", ans: 200, trap: 2 }, { q: "8 × 10^6 compared with 4 × 10^2", ans: 20000, trap: 2 }] },
  ],
}));
