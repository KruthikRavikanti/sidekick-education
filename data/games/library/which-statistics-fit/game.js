// Which Statistics Fit?. Skill S-ID.A.2-1.
// Using statistics appropriate to the shape of the data distribution. Using the mean for skewed data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Statistics Fit?",
  emoji: "🧰",
  premise: "For lopsided data with an outlier, the median and IQR describe it best. For balanced data, the mean and standard deviation work well.",
  outro: "Skewed or with outliers: median and IQR. Symmetric: mean and standard deviation.",
  scene: "desk",
  kind: "sort",
  fs: 4.8,
  hint: "Is there a value far from the rest that would drag the mean?",
  tag: "mean_for_skewed",
  rounds: [
    { say: "Which statistics describe each data set best?", bins: "Median and IQR|Mean and SD", items: ["20, 22, 23, 25, 90|home prices with one mansion", "heights: 160, 162, 165, 167, 170|scores bunched evenly around 75"], trap: ["20, 22, 23, 25, 90", 1], why: "The 90 drags the mean up to 36, far from the typical value.", win: "Outliers call for the median." },
    { say: "For 20, 22, 23, 25 and 90, match each value.", kind: "fill", fs: 5.6, cast: "", rows: [["mean", "36"], ["median", "23"], ["better center", "the median"]], extra: "the mean|90", trap: [2, "the mean"], why: "Four of the five values are near 23. Nobody is near 36.", win: "The median stays with the crowd." },
    { say: "Sort these by yourself.", bins: "Median and IQR|Mean and SD", items: ["waits: 2, 3, 3, 4, 45|incomes with a few millionaires", "shoe sizes: 6, 7, 7, 8, 9|temperatures: 68, 70, 71, 72, 74"], trap: ["waits: 2, 3, 3, 4, 45", 1] },
  ],
}));
