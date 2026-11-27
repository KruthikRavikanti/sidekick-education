// Zero and Negative Powers. Skill 8.EE.A.1-2.
// Using zero and negative integer exponents. Thinking 3 to the power −2 is negative is the known slip.
Sidekick.game(Sidekick.play({
  title: "Zero and Negative Powers",
  emoji: "🔻",
  premise: "Each step down in the exponent divides by the base. Keep stepping past 1 and you get fractions, never negative numbers.",
  outro: "Anything to the power 0 is 1. A negative exponent means a reciprocal: 3^{-2} is one ninth.",
  scene: "night",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Go down the pattern: 9, 3, 1, then one third, one ninth.",
  tag: "negative_exponent_negative",
  rounds: [
    { say: "Match each power to its value.", rows: [["5^0", "1"], ["3^{-2}", "{1/9}"], ["2^{-3}", "{1/8}"]], extra: "−9", trap: [1, "−9"], why: "A negative exponent means a reciprocal, not a negative number.", win: "One, one ninth, one eighth." },
    { say: "Match these.", rows: [["10^0", "1"], ["10^{-1}", "{1/10}"], ["4^{-2}", "{1/16}"]], extra: "0 −16", trap: [0, "0"], why: "Dividing 10 by 10 gives 1, not 0.", win: "Zero power is always 1." },
    { say: "Match these by yourself.", rows: [["7^0", "1"], ["2^{-2}", "{1/4}"], ["5^{-2}", "{1/25}"]], extra: "−4 0", trap: [1, "−4"] },
  ],
}));
