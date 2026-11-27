// Sure Thing or Long Shot. Skill S-MD.B.5-2.
// Evaluating and comparing strategies on the basis of expected values. Picking the option with the largest single prize is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sure Thing or Long Shot",
  emoji: "🤔",
  premise: "A giant prize can be a poor choice if it rarely comes. Compare options by their expected values, not their biggest numbers.",
  outro: "Compare strategies by expected value: prize × probability for each option.",
  scene: "candy",
  kind: "sort",
  fs: 4.8,
  hint: "Multiply each prize by its chance. Then compare.",
  tag: "largest_prize",
  rounds: [
    { say: "Option B is a 10% chance of 400 dollars. Key in its expected value.", kind: "type", icon: "🤔", q: "400 × 0.10", ans: 40, trap: 400, why: "400 only arrives 1 time in 10. On average that is 40.", win: "A sure 50 beats an average of 40." },
    { say: "Which option has the higher expected value?", bins: "Option A|Option B", items: ["A: sure 50. B: 10% chance of 400.|A: sure 10. B: 1% chance of 500.", "A: sure 20. B: 50% chance of 100.|A: sure 30. B: 25% chance of 200."], trap: ["A: sure 50. B: 10% chance of 400.", 1], why: "10% of 400 is 40, which is less than the sure 50.", win: "Compare 50 with 40, 10 with 5, 20 with 50, 30 with 50." },
    { say: "Sort these by yourself.", bins: "Option A|Option B", items: ["A: sure 25. B: 20% chance of 100.|A: sure 8. B: 5% chance of 100.", "A: sure 15. B: 50% chance of 40.|A: sure 12. B: 10% chance of 300."], trap: ["A: sure 25. B: 20% chance of 100.", 1] },
  ],
}));
