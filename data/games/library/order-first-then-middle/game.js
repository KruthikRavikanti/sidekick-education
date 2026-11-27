// Order First, Then Middle. Skill 6.SP.B.5-3.
// Finding the median, mean, interquartile range and mean absolute deviation. Finding the median without ordering the data is the known slip.
Sidekick.game(Sidekick.play({
  title: "Order First, Then Middle",
  emoji: "🪜",
  premise: "The median is the middle value, but only after the data is put in order. Other measures have their own steps.",
  outro: "Median: order the data, then take the middle. IQR = Q3 − Q1. MAD = the mean distance from the mean.",
  scene: "desk",
  kind: "type",
  icon: "🪜",
  hint: "Line the values up from least to greatest before anything else.",
  tag: "median_without_ordering",
  rounds: [
    { say: "Put the data in order from least to greatest.", kind: "row", fs: 7, seq: "3 5 7 9 12", trap: "9 3 12 5 7", why: "That is the order it was given in. Start with the least.", win: "3, 5, 7, 9, 12." },
    { say: "Now key in the median.", q: "Data: 9, 3, 12, 5, 7", ans: 7, trap: 12, why: "12 is in the middle of the unordered list. In order, the middle is 7.", win: "The middle of 3, 5, 7, 9, 12 is 7." },
    { say: "Key in the interquartile range.", q: "Q1 is 4 and Q3 is 10. The least is 2 and the greatest is 12.", ans: 6, trap: 10, why: "That is the range, 12 − 2. The IQR is Q3 minus Q1.", win: "10 − 4 = 6." },
    { say: "Key in the mean absolute deviation.", q: "Data: 1, 4, 7 · mean 4 · distances from the mean: 3, 0, 3", ans: 2, trap: 6, why: "That is the total distance. Share it among the 3 values.", win: "6 ÷ 3 = 2." },
    { say: "Find the median by yourself.", alt: [{ q: "Data: 8, 2, 10, 4, 6", ans: 6, trap: 10 }, { q: "Data: 15, 3, 9, 21, 12", ans: 12, trap: 9 }, { q: "Data: 7, 1, 9, 3, 5", ans: 5, trap: 9 }] },
  ],
}));
