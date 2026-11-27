// Center and Spread Together. Skill S-ID.A.2-2.
// Comparing center and spread of two or more data sets. Comparing only the centers is the known slip.
Sidekick.game(Sidekick.play({
  title: "Center and Spread Together",
  emoji: "⚖️",
  premise: "Two groups can share an average and still be very different. Compare how spread out they are too.",
  outro: "Compare data sets by both center and spread.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Center tells the typical value. Spread tells how consistent the values are.",
  tag: "compares_only_centers",
  rounds: [
    { say: "Class A: median 80, IQR 5. Class B: median 80, IQR 20. Compare them.", rows: [["typical score", "the same in both"], ["more consistent", "Class A"], ["more spread out", "Class B"]], trap: [1, "the same in both"], why: "The medians match, but an IQR of 5 is far tighter than 20.", win: "Same center, different spread." },
    { say: "Team X: mean 12, SD 1. Team Y: mean 15, SD 6. Compare them.", rows: [["higher center", "Team Y"], ["more consistent", "Team X"]], extra: "the same in both|", trap: [1, "Team Y"], why: "A standard deviation of 6 means Y’s scores swing widely.", win: "Y scores more, X is steadier." },
    { say: "Route 1: median 30 min, IQR 4. Route 2: median 28 min, IQR 15. Compare by yourself.", rows: [["usually faster", "Route 2"], ["more predictable", "Route 1"]], extra: "the same in both|neither route", trap: [1, "Route 2"] },
  ],
}));
