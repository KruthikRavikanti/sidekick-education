// Every Circle Is Similar. Skill G-C.A.1-1.
// Proving that all circles are similar. Thinking circles of different sizes are not similar is the known slip.
Sidekick.game(Sidekick.play({
  title: "Every Circle Is Similar",
  emoji: "⭕",
  premise: "Slide one circle so the centers match, then dilate. It lands exactly on the other. That works for any two circles.",
  outro: "All circles are similar. The scale factor is the ratio of their radii.",
  scene: "paper",
  kind: "type",
  icon: "⭕",
  hint: "Divide the new radius by the old radius.",
  tag: "different_sizes_not_similar",
  rounds: [
    { say: "True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["Any two circles are similar.|A slide and a dilation map one circle onto another.", "Circles of different sizes are not similar.|Only equal circles are similar."], trap: ["Circles of different sizes are not similar.", 0], why: "Different sizes with the same shape is exactly what similar means.", win: "Every circle has the same shape." },
    { say: "Circle A has radius 2. Circle B has radius 6. Key in the scale factor from A to B.", ans: "3", trap: "4", why: "4 is the difference. The scale factor is 6 ÷ 2.", win: "6 ÷ 2 = 3." },
    { say: "Find the scale factor by yourself.", alt: [{ q: "From a circle of radius 3 to one of radius 12", ans: "4", trap: "9" }, { q: "From a circle of radius 5 to one of radius 15", ans: "3", trap: "10" }, { q: "From a circle of radius 4 to one of radius 2", ans: "0.5", trap: "2" }] },
  ],
}));
