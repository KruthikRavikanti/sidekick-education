// Slope and Intercept of a Fit. Skill S-ID.C.7-1.
// Interpreting the slope and intercept of a linear model in the context of the data. Giving the intercept meaning when x = 0 is impossible is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slope and Intercept of a Fit",
  emoji: "👶",
  premise: "The slope of a fitted line is a rate. Its intercept is the prediction at zero, which only means something if zero makes sense.",
  outro: "Interpret the slope as change per unit. Interpret the intercept only when x = 0 is within the data’s range.",
  scene: "city",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Was the model built from data that includes x = 0?",
  tag: "intercept_outside_range",
  rounds: [
    { say: "weight = 5(age) + 20 for children aged 2 to 10. What does each number mean?", rows: [["5", "about 5 more pounds per year"], ["20", "no real meaning: age 0 is outside the data"]], extra: "the weight of a newborn|", trap: [1, "the weight of a newborn"], why: "The model was built for ages 2 to 10. It says nothing reliable about age 0.", win: "A rate, and an intercept to be careful with." },
    { say: "score = 6(hours) + 50, for 0 to 8 hours of study. What does each number mean?", rows: [["6", "about 6 more points per hour"], ["50", "predicted score with no studying"]], extra: "hours per point|", trap: [0, "hours per point"], why: "The model predicts score, so the slope is points for each hour.", win: "Here zero hours is in range, so 50 has meaning." },
    { say: "cost = 0.4(miles) + 3 for rides of 0 to 30 miles. Match by yourself.", rows: [["0.4", "40 cents more per mile"], ["3", "the charge before any miles"]], extra: "miles per dollar|the cost of 3 miles", trap: [0, "miles per dollar"] },
  ],
}));
