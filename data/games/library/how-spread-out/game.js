// How Spread Out?. Skill 6.SP.A.3-2.
// Recognizing that a measure of variation describes how values vary with a single number. Confusing the range with a measure of center is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Spread Out?",
  emoji: "↔️",
  premise: "A measure of spread tells how stretched out the data is. The range is the greatest value minus the least.",
  outro: "Range = greatest − least. It measures spread, not the middle.",
  scene: "field",
  kind: "type",
  icon: "📐",
  hint: "Find the greatest value and the least value. Subtract.",
  tag: "confuses_range_with_center",
  rounds: [
    { say: "Key in the range.", q: "Data: 3, 7, 8, 12", fig: { type: "numline", line: [0, 14, 1, 2], pts: [[3, "3"], [7, "7"], [8, "8"], [12, "12"]], v: [] }, ans: "9", trap: "7.5", why: "That is the mean, a center. Range is greatest minus least.", win: "12 − 3 = 9." },
    { say: "Key in the range.", q: "Data: 10, 14, 15, 21", ans: "11", trap: "15", why: "15 is the mean. For range, subtract the least from the greatest.", win: "21 − 10 = 11." },
    { say: "Find the range by yourself.", alt: [{ q: "Data: 5, 9, 10, 16", ans: "11", trap: "10" }, { q: "Data: 2, 6, 7, 13", ans: "11", trap: "7" }, { q: "Data: 20, 22, 28, 30", ans: "10", trap: "25" }] },
  ],
}));
