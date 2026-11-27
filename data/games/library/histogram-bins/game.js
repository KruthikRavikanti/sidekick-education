// Histogram Bins. Skill 6.SP.B.4-2.
// Displaying numerical data in a histogram with equal intervals. Using unequal bins or leaving spaces between bars is the known slip.
Sidekick.game(Sidekick.play({
  title: "Histogram Bins",
  emoji: "📶",
  premise: "A histogram groups data into bins. Every bin must be the same width, and the bars touch.",
  outro: "Histogram bins are equal in width with no spaces between the bars.",
  scene: "city",
  kind: "sort",
  fs: 5.4,
  hint: "How many numbers does each bin cover? They should all match.",
  tag: "unequal_bins",
  rounds: [
    { say: "Which sets of bins are equal in width?", bins: "Equal bins|Needs fixing", items: ["0-9, 10-19, 20-29|1-5, 6-10, 11-15", "0-9, 10-19, 20-39|1-5, 6-10, 11-20"], trap: ["0-9, 10-19, 20-39", 0], why: "The last bin covers 20 numbers. The others cover 10.", win: "Equal bins cover the same count of numbers." },
    { say: "Count the ages into the bins to build the histogram.", kind: "dial", cast: "", q: "Ages: 3, 5, 8, 12, 14, 15, 17, 22, 26", view: { type: "bars", names: ["0-9", "10-19", "20-29"], cap: 6 }, dials: [["0-9", 0, 6], ["10-19", 0, 6], ["20-29", 0, 6]], ans: [3, 4, 2], trap: [3, 3, 3], why: "Count again: 12, 14, 15 and 17 are all in 10 to 19.", win: "3, then 4, then 2." },
    { say: "Sort these by yourself.", bins: "Equal bins|Needs fixing", items: ["10-19, 20-29, 30-39|0-4, 5-9, 10-14", "10-19, 20-29, 30-49|0-4, 5-9, 10-19"], trap: ["10-19, 20-29, 30-49", 0] },
  ],
}));
