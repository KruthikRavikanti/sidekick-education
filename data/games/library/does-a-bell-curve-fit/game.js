// Does a Bell Curve Fit?. Skill S-ID.A.4-1.
// Using the mean and standard deviation to fit a normal distribution, and recognizing when that is not appropriate. Using the normal model for skewed data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Does a Bell Curve Fit?",
  emoji: "🔔",
  premise: "The normal model is a symmetric bell around the mean. It only describes data that pile up in the middle and thin out evenly.",
  outro: "Use a normal model only for roughly symmetric, bell-shaped data. Skewed data need something else.",
  scene: "paper",
  kind: "sort",
  fs: 5,
  hint: "Is the data symmetric with one peak in the middle? Or does it have a long tail?",
  tag: "normal_for_skewed",
  rounds: [
    { say: "Would a normal model fit each data set?", bins: "Fits|Does not fit", items: ["heights of adult women|weights of apples from one tree", "incomes in a town with a few very rich people|rolls of one die"], trap: ["incomes in a town with a few very rich people", 0], why: "A few huge incomes stretch a long tail to the right. That is skewed, not a bell.", win: "Symmetric bell or not." },
    { say: "Test scores are normal with mean 70 and standard deviation 10. Place each value.", kind: "fill", fs: 5.4, cast: "", rows: [["one standard deviation above the mean", "80"], ["two standard deviations below the mean", "50"]], extra: "60 90", trap: [1, "60"], why: "Two steps of 10 below 70 is 50.", win: "Each step is one standard deviation, 10 points." },
    { say: "Sort these by yourself.", bins: "Fits|Does not fit", items: ["lengths of pencils from one factory|shoe sizes of adult men", "house prices with a few mansions|wait times, mostly short with a few very long"], trap: ["house prices with a few mansions", 0] },
  ],
}));
