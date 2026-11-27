// No Need to Solve. Skill 5.OA.A.2-2.
// Interpreting numerical expressions without evaluating them: 3 × (1,846 + 250) is three times as large as 1,846 + 250. Needing to compute before comparing is the known slip.
Sidekick.game(Sidekick.play({
  title: "No Need to Solve",
  emoji: "🔭",
  premise: "You can tell a lot about an expression without working it out. Look at what is done to the part in parentheses.",
  outro: "Read the structure: 3 × (a sum) is three times as large as the sum, whatever the sum is.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "The part in parentheses is the same both times. What is done to it?",
  tag: "must_compute_to_compare",
  rounds: [
    { say: "Do not work it out. How does each one compare with 1,846 + 250?", rows: [["3 × (1,846 + 250)", "3 times as large"], ["(1,846 + 250) ÷ 2", "half as large"]], extra: "3 more|250 more", trap: [0, "3 more"], why: "The whole sum is multiplied by 3. That makes it 3 times as large.", win: "You compared without calculating." },
    { say: "How does each one compare with 520 + 80?", rows: [["(520 + 80) × 10", "10 times as large"], ["(520 + 80) + 10", "10 more"]], extra: "half as large|", trap: [0, "10 more"], why: "Times 10 is not the same as plus 10.", win: "Ten times as large, and ten more." },
    { say: "How does each one compare with 9,217 − 648?", rows: [["5 × (9,217 − 648)", "5 times as large"], ["(9,217 − 648) − 5", "5 less"], ["(9,217 − 648) ÷ 5", "one fifth as large"]], extra: "5 more|", trap: [0, "5 more"] },
  ],
}));
