// What Zero Means. Skill 6.NS.C.5-2.
// Explaining the meaning of 0 in each real-world situation. Thinking 0 always means nothing is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Zero Means",
  emoji: "🌡️",
  premise: "Zero is not always nothing. On a scale with negatives, zero is a meaningful starting line.",
  outro: "Zero is the reference point that positive and negative values are measured from.",
  scene: "snow",
  kind: "fill",
  cast: "",
  hint: "What does the scale measure from?",
  tag: "zero_means_nothing",
  rounds: [
    { say: "What does 0 mean in each situation?", rows: [["0 degrees Celsius", "water freezes"], ["0 feet of elevation", "sea level"]], extra: "no temperature|", trap: [0, "no temperature"], why: "There is still a temperature at 0. It is where water freezes.", win: "Zero is a reference point." },
    { say: "What does 0 mean in each situation?", rows: [["a bank balance of $0", "no money and no debt"], ["a golf score of 0", "exactly par"], ["year 0 on a timeline", "the starting year"]], trap: [1, "no money and no debt"], why: "In golf, 0 means right on par, neither over nor under.", win: "Three meanings of zero." },
    { say: "Match these by yourself.", rows: [["0 on a number line", "the point between + and −"], ["0 change in weight", "neither gained nor lost"]], extra: "no weight at all|the line ends", trap: [1, "no weight at all"] },
  ],
}));
