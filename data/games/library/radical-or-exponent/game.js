// Radical or Exponent. Skill N-RN.A.2-1.
// Rewriting expressions involving radicals and rational exponents. Putting the index in the numerator is the known slip.
Sidekick.game(Sidekick.play({
  title: "Radical or Exponent",
  emoji: "🔁",
  premise: "A radical and a fraction exponent are two outfits for the same number. The root goes in the bottom of the fraction.",
  outro: "The nth root of x^m is x^(m/n): power over root.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Power over root: the root is the bottom number.",
  tag: "index_in_numerator",
  rounds: [
    { say: "Write each radical with a fraction exponent.", rows: [["the cube root of x^2", "x^(2/3)"], ["the square root of x^5", "x^(5/2)"]], extra: "x^(3/2)|", trap: [0, "x^(3/2)"], why: "The cube root puts 3 in the bottom. The power 2 goes above it.", win: "Power over root." },
    { say: "Match each one.", rows: [["the fourth root of x", "x^(1/4)"], ["the square root of x^3", "x^(3/2)"], ["the cube root of x^4", "x^(4/3)"]], extra: "x^(3/4)|x^4", trap: [0, "x^4"], why: "A fourth root is the exponent one fourth, not the power 4.", win: "Root in the bottom every time." },
    { say: "Match these by yourself.", rows: [["the fifth root of x^2", "x^(2/5)"], ["the square root of x^7", "x^(7/2)"], ["the cube root of x", "x^(1/3)"]], extra: "x^(5/2)|x^(2/7)", trap: [0, "x^(5/2)"] },
  ],
}));
