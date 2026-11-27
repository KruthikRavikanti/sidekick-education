// Root First, Then Power. Skill N-RN.A.1-2.
// Extending the properties of exponents to rational exponents. Multiplying the base by the exponent is the known slip.
Sidekick.game(Sidekick.play({
  title: "Root First, Then Power",
  emoji: "🪜",
  premise: "In 8^(2/3) the bottom number is a root and the upper number is a power. Take the root first to keep the numbers small.",
  outro: "a^(m/n) = (the nth root of a) raised to the m.",
  scene: "paper",
  kind: "type",
  icon: "🪜",
  hint: "Bottom of the fraction: which root. Upper number: which power.",
  tag: "multiplies_base_by_exponent",
  rounds: [
    { say: "Key in the value.", q: "8^(2/3) = (cube root of 8)^2", ans: 4, trap: 16, why: "That multiplies 8 by 2. The cube root of 8 is 2, and 2 squared is 4.", win: "Cube root 2, squared: 4." },
    { say: "Key in the value.", q: "16^(3/2) = (square root of 16)^3", ans: 64, trap: 24, why: "The square root of 16 is 4. Then 4 × 4 × 4.", win: "Square root 4, cubed: 64." },
    { say: "Find the value by yourself.", alt: [{ q: "27^(2/3)", ans: 9, trap: 18 }, { q: "4^(3/2)", ans: 8, trap: 6 }, { q: "32^(2/5)", ans: 4, trap: 64 }, { q: "9^(3/2)", ans: 27, trap: 13.5 }] },
  ],
}));
