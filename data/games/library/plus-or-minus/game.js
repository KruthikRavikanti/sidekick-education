// Plus or Minus. Skill S-IC.B.4-2.
// Developing a margin of error for a sample estimate. Thinking the margin of error also covers bias is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plus or Minus",
  emoji: "↔️",
  premise: "A poll result comes with a margin of error. Together they give a range that probably holds the true value.",
  outro: "Estimate ± margin of error gives a plausible range. It covers sampling chance, not a badly run poll.",
  scene: "city",
  kind: "line",
  cast: "",
  line: [40, 80, 1, 5],
  hint: "Subtract the margin for the low end. Add it for the high end.",
  tag: "margin_covers_bias",
  tag2: "one_sided_margin",
  rounds: [
    { say: "A poll reports 60% plus or minus 5%. Slide the two markers to the ends of the plausible range.", from: [40, 80], ans: [55, 65], trap: [60, 65], why: "The margin goes both ways. The true value could also be as low as 55%.", win: "55% to 65%." },
    { say: "Does a margin of error cover each problem?", kind: "sort", fs: 4.8, bins: "Covers|Does not cover", items: ["chance differences between random samples|", "a question worded to push one answer|asking only people at one mall|people who refuse to answer"], trap: ["a question worded to push one answer", 0], why: "That is bias. A margin of error only measures random sampling chance.", win: "Chance, yes. Bias, no." },
    { say: "Mark the plausible range by yourself.", alt: [{ say: "By yourself: a poll reports 48% plus or minus 3%. Mark the range.", from: [40, 80], ans: [45, 51], trap: [48, 51] }, { say: "By yourself: a poll reports 70% plus or minus 4%. Mark the range.", from: [40, 80], ans: [66, 74], trap: [70, 74] }, { say: "By yourself: a poll reports 55% plus or minus 6%. Mark the range.", from: [40, 80], ans: [49, 61], trap: [55, 61] }] },
  ],
}));
