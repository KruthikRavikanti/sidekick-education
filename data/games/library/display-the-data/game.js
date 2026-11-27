// Display the Data. Skill S-ID.A.1-1.
// Representing data with dot plots, histograms and box plots. Using unequal bins is the known slip.
Sidekick.game(Sidekick.play({
  title: "Display the Data",
  emoji: "📊",
  premise: "A histogram groups data into equal bins. A box plot shows the middle half. Both start from the same list of numbers.",
  outro: "Histograms need equal-width bins. A box plot is built from the quartiles.",
  scene: "paper",
  kind: "dial",
  cast: "",
  hint: "Count how many values fall in each bin. Every bin is the same width.",
  tag: "unequal_bins",
  rounds: [
    { say: "The 60s bar is drawn. Count the scores into the other bins.", q: "Scores: 62, 65, 71, 74, 78, 83, 85, 90", view: { type: "bars", given: [["60s", 2]], names: ["70s", "80s", "90s"], cap: 4 }, dials: [["70s", 0, 4], ["80s", 0, 4], ["90s", 0, 4]], ans: [3, 2, 1], trap: [2, 3, 1], why: "71, 74 and 78 are in the 70s. That is three scores.", win: "2, 3, 2 and 1." },
    { say: "Now set Q1, the median and Q3 for the same scores.", q: "Scores: 62, 65, 71, 74, 78, 83, 85, 90", view: { type: "boxplot", data: [62, 65, 71, 74, 78, 83, 85, 90], line: [60, 90, 2], every: 5 }, dials: [["Q1", 60, 90, 1, 66], ["Median", 60, 90, 1, 74], ["Q3", 60, 90, 1, 86]], ans: [68, 76, 84], trap: [62, 76, 90], why: "The box covers the middle half only. Q1 is halfway between 65 and 71.", win: "Q1 68, median 76, Q3 84." },
    { say: "Build the histogram by yourself.", q: "Ages: 12, 15, 18, 21, 23, 27, 29, 34, 38", view: { type: "bars", names: ["10s", "20s", "30s"], cap: 5 }, dials: [["10s", 0, 5], ["20s", 0, 5], ["30s", 0, 5]], ans: [3, 4, 2], trap: [3, 3, 3] },
  ],
}));
