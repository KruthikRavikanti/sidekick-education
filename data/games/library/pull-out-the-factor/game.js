// Pull Out the Factor. Skill 7.EE.A.1-3.
// Factoring linear expressions with rational coefficients. Factoring from only one term is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pull Out the Factor",
  emoji: "🧲",
  premise: "Factoring is distributing in reverse. Find the number that divides every term and pull it out front.",
  outro: "Factor the greatest common factor from every term: 6x + 9 = 3(2x + 3).",
  scene: "desk",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Divide BOTH terms by the common factor. Multiply back to check.",
  tag: "factors_one_term_only",
  rounds: [
    { say: "Factor each expression.", rows: [["6x + 9 =", "3(2x + 3)"], ["4x + 10 =", "2(2x + 5)"]], extra: "3(2x + 9)|", trap: [0, "3(2x + 9)"], why: "Multiply it back: 3 × 9 is 27, not 9. Divide the 9 by 3 too.", win: "Both terms were divided." },
    { say: "Factor these.", rows: [["8x + 12 =", "4(2x + 3)"], ["5x − 15 =", "5(x − 3)"], ["9x + 6 =", "3(3x + 2)"]], extra: "5(x − 15)|", trap: [1, "5(x − 15)"], why: "15 ÷ 5 is 3. Both terms get divided.", win: "Three factored forms." },
    { say: "Factor these by yourself.", rows: [["10x + 15 =", "5(2x + 3)"], ["12x − 8 =", "4(3x − 2)"], ["7x + 14 =", "7(x + 2)"]], extra: "7(x + 14)|4(3x − 8)", trap: [2, "7(x + 14)"] },
  ],
}));
