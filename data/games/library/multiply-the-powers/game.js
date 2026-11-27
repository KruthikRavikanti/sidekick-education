// Multiply the Powers. Skill 8.EE.A.4-1.
// Multiplying and dividing numbers in scientific notation. Adding the first factors is the known slip.
Sidekick.game(Sidekick.play({
  title: "Multiply the Powers",
  emoji: "🚀",
  premise: "To multiply in scientific notation, multiply the first factors and add the exponents. To divide, divide and subtract.",
  outro: "Multiply: multiply the fronts, add the exponents. Divide: divide the fronts, subtract the exponents.",
  scene: "space",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "The front numbers multiply. The exponents add.",
  tag: "adds_first_factors",
  rounds: [
    { say: "Work out each one.", rows: [["(3 × 10^4)(2 × 10^5)", "6 × 10^9"], ["(8 × 10^6) ÷ (2 × 10^2)", "4 × 10^4"]], extra: "5 × 10^9|", trap: [0, "5 × 10^9"], why: "The fronts multiply: 3 × 2 = 6. Only the exponents add.", win: "6 × 10^9 and 4 × 10^4." },
    { say: "Work out these.", rows: [["(2 × 10^3)(4 × 10^2)", "8 × 10^5"], ["(9 × 10^8) ÷ (3 × 10^5)", "3 × 10^3"], ["(1.5 × 10^2)(2 × 10^4)", "3 × 10^6"]], extra: "6 × 10^5|", trap: [0, "6 × 10^5"], why: "2 × 4 is 8. Do not add the fronts.", win: "Three answers." },
    { say: "Work out these by yourself.", rows: [["(4 × 10^3)(2 × 10^6)", "8 × 10^9"], ["(6 × 10^7) ÷ (2 × 10^3)", "3 × 10^4"], ["(3 × 10^2)(3 × 10^2)", "9 × 10^4"]], extra: "6 × 10^9|8 × 10^{18}", trap: [0, "6 × 10^9"] },
  ],
}));
