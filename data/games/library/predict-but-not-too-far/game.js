// Predict, But Not Too Far. Skill S-ID.B.6-1.
// Fitting a function to data and using it to solve problems. Extrapolating far beyond the data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Predict, But Not Too Far",
  emoji: "🔭",
  premise: "A fitted line is trustworthy inside the range of the data it came from. Far outside that range, it is a guess.",
  outro: "Use a fitted function to predict within the data’s range. Extrapolating far beyond is unreliable.",
  scene: "paper",
  kind: "type",
  icon: "🔭",
  hint: "Is that x inside the range the data covered?",
  tag: "extrapolates_too_far",
  rounds: [
    { say: "A fitted line is y = 2x + 5, from data with x between 0 and 10. Key in the prediction for x = 6.", ans: 17, trap: 13, why: "Multiply first: 2 × 6 = 12. Then add 5.", win: "2 × 6 + 5 = 17." },
    { say: "The model came from data with x from 0 to 10. Which predictions can you trust?", kind: "sort", fs: 6, bins: "Safe to predict|Risky", items: ["x = 3|x = 8|x = 10", "x = 50|x = 200"], trap: ["x = 50", 0], why: "50 is far outside the data. The trend may not continue there.", win: "Stay inside the range." },
    { say: "A plant model was built from weeks 1 to 12. Sort by yourself.", kind: "sort", fs: 6, bins: "Safe to predict|Risky", items: ["week 4|week 9|week 12", "week 60|week 500"], trap: ["week 60", 0] },
  ],
}));
