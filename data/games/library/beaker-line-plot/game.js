// Beaker Line Plot. Skill 5.MD.B.2-1.
// Making a line plot of measurements in fractions of a unit. Ordering the fractions incorrectly, or missing equivalent fractions, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Beaker Line Plot",
  emoji: "⚗️",
  premise: "The science class measured liquid in beakers. Put each measurement on the line plot, one X each.",
  outro: "Order the fractions first. Equal fractions like 2/8 and 1/4 share one spot.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Rename every amount in eighths. Then order and match them.",
  tag: "orders_fractions_incorrectly",
  rounds: [
    { say: "First put the amounts in order from least to most.", kind: "row", fs: 6, seq: "{1/8} {1/4} {3/8} {1/2}", trap: "{1/2} {1/4} {1/8} {3/8}", why: "A bigger bottom number means smaller pieces. One eighth is the least.", win: "1 eighth, 2 eighths, 3 eighths, 4 eighths." },
    { say: "Build the line plot. Each beaker gets one X.", q: "Cups: 1/8, 1/4, 1/4, 1/2, 2/8, 4/8", dials: [["1/8 cup", 0, 5], ["1/4 cup", 0, 5], ["1/2 cup", 0, 5]], view: { type: "bars", stack: true, cap: 5, tick: 1 }, ans: [1, 3, 2], trap: [1, 2, 1], why: "2 eighths is the same as 1 fourth, and 4 eighths is the same as 1 half.", win: "One, three and two beakers." },
    { say: "Build this line plot by yourself.", dials: [["1/4 cup", 0, 5], ["1/2 cup", 0, 5], ["3/4 cup", 0, 5]], view: { type: "bars", stack: true, cap: 5, tick: 1 }, alt: [{ q: "Cups: 3/4, 2/4, 1/4, 6/8, 1/2, 3/4", ans: [1, 2, 3], trap: [1, 1, 2] }, { q: "Cups: 1/4, 2/8, 3/4, 1/2, 2/8, 4/8", ans: [3, 2, 1], trap: [1, 1, 1] }] },
  ],
}));
