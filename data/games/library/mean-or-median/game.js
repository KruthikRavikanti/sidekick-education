// Mean or Median?. Skill 6.SP.B.5-4.
// Relating the choice of measures of center and variability to the shape of the data. Using the mean for skewed data with outliers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mean or Median?",
  emoji: "🏠",
  premise: "One extreme value drags the mean far from what is typical. The median stays put, so it fits lopsided data better.",
  outro: "Use the median for data with outliers or a long tail. The mean works for even, balanced data.",
  scene: "city",
  kind: "sort",
  fs: 5,
  hint: "Is there one value far from the rest? Then the mean gets pulled toward it.",
  tag: "mean_for_skewed_data",
  rounds: [
    { say: "Which measure shows the typical value better?", bins: "Use the median|Mean works well", items: ["Incomes: 30, 32, 35, 36, 400|Home prices with one mansion", "Heights: 60, 61, 62, 63, 64|Test scores: 78, 80, 82, 84"], trap: ["Incomes: 30, 32, 35, 36, 400", 1], why: "The 400 pulls the mean up to about 107. The median stays at 35.", win: "Outliers call for the median." },
    { say: "For 30, 32, 35, 36 and 400, match each one.", kind: "fill", fs: 5.6, cast: "", rows: [["mean", "106.6"], ["median", "35"], ["closer to a typical value", "the median"]], extra: "the mean|400", trap: [2, "the mean"], why: "No one in the list is near 106.6. Four of the five are near 35.", win: "The median describes this data better." },
    { say: "Sort these by yourself.", bins: "Use the median|Mean works well", items: ["Pets: 0, 1, 1, 2, 15|Salaries: 40, 42, 45, 300", "Ages: 11, 11, 12, 12, 13|Quiz: 7, 8, 8, 9, 10"], trap: ["Salaries: 40, 42, 45, 300", 1] },
  ],
}));
