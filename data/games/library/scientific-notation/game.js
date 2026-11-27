// Scientific Notation. Skill 8.EE.A.3-1.
// Writing very large and very small numbers in scientific notation. Using a first factor of 10 or more is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scientific Notation",
  emoji: "🔬",
  premise: "Scientific notation writes huge and tiny numbers as a number from 1 up to 10, times a power of 10.",
  outro: "The first factor is at least 1 and less than 10. The exponent counts the places the point moved.",
  scene: "space",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Put the point after the first nonzero digit. Count how far it moved.",
  tag: "first_factor_too_big",
  rounds: [
    { say: "Match each number to its scientific notation.", rows: [["45,000,000", "4.5 × 10^7"], ["0.00045", "4.5 × 10^{-4}"]], extra: "45 × 10^6|", trap: [0, "45 × 10^6"], why: "It has the right value, but the first factor must be less than 10.", win: "Big numbers get positive powers, tiny ones negative." },
    { say: "Match these.", rows: [["3,200", "3.2 × 10^3"], ["0.0032", "3.2 × 10^{-3}"], ["320,000", "3.2 × 10^5"]], extra: "32 × 10^2|", trap: [0, "32 × 10^2"], why: "32 is not between 1 and 10. Move the point one more place.", win: "Same digits, different powers." },
    { say: "Match these by yourself.", rows: [["7,100,000", "7.1 × 10^6"], ["0.071", "7.1 × 10^{-2}"], ["71,000", "7.1 × 10^4"]], extra: "71 × 10^5|0.71 × 10^7", trap: [0, "71 × 10^5"] },
  ],
}));
