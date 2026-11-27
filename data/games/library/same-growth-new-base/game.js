// Same Growth, New Base. Skill A-SSE.B.3-3.
// Using the properties of exponents to transform exponential expressions. Multiplying the base by the exponent is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Growth, New Base",
  emoji: "🔁",
  premise: "An exponential can be rewritten with a different base to show a rate over a different period. The exponent rules do the work.",
  outro: "2^(3t) = (2^3)^t = 8^t. A power of a power multiplies the exponents.",
  scene: "night",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "A power to a power multiplies exponents. Work out the inner power first.",
  tag: "multiplies_base_by_exponent",
  rounds: [
    { say: "Rewrite each one with a single exponent t.", rows: [["2^(3t) =", "8^t"], ["3^(2t) =", "9^t"]], extra: "6^t|", trap: [0, "6^t"], why: "2 × 3 is not it. 2^(3t) is (2^3)^t, and 2^3 is 8.", win: "8^t and 9^t." },
    { say: "Match the yearly form to its shorter-period form.", rows: [["1.21^t (per year)", "1.1^(2t) (per half year)"], ["4^t", "2^(2t)"]], extra: "2.42^t|", trap: [0, "2.42^t"], why: "1.1 × 1.1 = 1.21, so 1.21^t is 1.1 used twice each year.", win: "Same growth, shorter periods." },
    { say: "Rewrite these by yourself.", rows: [["5^(2t) =", "25^t"], ["2^(4t) =", "16^t"], ["10^(3t) =", "1000^t"]], extra: "10^t|8^t", trap: [0, "10^t"] },
  ],
}));
