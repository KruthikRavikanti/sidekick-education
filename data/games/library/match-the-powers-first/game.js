// Match the Powers First. Skill 8.EE.A.4-2.
// Adding and subtracting numbers in scientific notation. Adding without matching the powers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Match the Powers First",
  emoji: "🛰️",
  premise: "You can only add numbers in scientific notation when their powers of 10 match. Rewrite one of them first.",
  outro: "To add or subtract, rewrite so the powers of 10 are the same, then add the first factors.",
  scene: "space",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Are the powers of 10 the same? If not, rewrite the smaller one.",
  tag: "adds_without_matching_powers",
  rounds: [
    { say: "Work out each one.", rows: [["3 × 10^4 + 2 × 10^3", "3.2 × 10^4"], ["5 × 10^3 + 4 × 10^3", "9 × 10^3"]], extra: "5 × 10^7|", trap: [0, "5 × 10^7"], why: "The powers do not match. 2 × 10^3 is 0.2 × 10^4.", win: "30,000 + 2,000 = 32,000." },
    { say: "Work out these.", rows: [["6 × 10^5 + 3 × 10^4", "6.3 × 10^5"], ["7 × 10^2 − 2 × 10^2", "5 × 10^2"]], extra: "9 × 10^9|", trap: [0, "9 × 10^9"], why: "Rewrite 3 × 10^4 as 0.3 × 10^5, then add the fronts.", win: "6.3 × 10^5 and 5 × 10^2." },
    { say: "Work out these by yourself.", rows: [["4 × 10^6 + 5 × 10^5", "4.5 × 10^6"], ["8 × 10^4 − 3 × 10^4", "5 × 10^4"], ["2 × 10^3 + 1 × 10^2", "2.1 × 10^3"]], extra: "9 × 10^{11}|3 × 10^5", trap: [0, "9 × 10^{11}"] },
  ],
}));
