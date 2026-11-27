// What the Point Says. Skill 5.G.A.2-2.
// Interpreting coordinate values in the context of a situation: (2, 6) means after 2 weeks the plant was 6 cm tall. Not being able to say what a point means is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Point Says",
  emoji: "🌻",
  premise: "A sunflower is measured every week. Each point on its graph tells two things: which week, and how tall.",
  outro: "Read a point by its axes: the across number is one quantity and the up number is the other.",
  scene: "meadow",
  kind: "plot",
  cast: "",
  quiet: true,
  hint: "Across is the week. Up is the height.",
  tag: "cannot_interpret_point",
  rounds: [
    { say: "Across is weeks. Up is height in centimeters. What does the orange point at (2, 6) say?", kind: "fill", fig: { type: "graph", fn: "points", pre: [2, 6], win: [0, 6, 0, 8], h: 46, v: [] }, rows: [["It was week ___", "2"], ["The plant was ___ cm tall", "6"]], extra: "8 4", trap: [0, "6"], why: "Weeks are counted across. The point is above 2.", win: "After 2 weeks, the plant was 6 centimeters tall." },
    { say: "After 3 weeks the plant was 5 centimeters tall. Tap that point.", q: "Across: weeks. Up: height in cm.", axes: [0, 7, 0, 7], ans: [[3, 5]], trap: [[5, 3]], why: "That says week 5 and 3 centimeters. Weeks go across.", win: "Week 3, height 5." },
    { say: "Tap the point by yourself.", q: "Across: weeks. Up: height in cm.", axes: [0, 7, 0, 7], alt: [{ say: "After 4 weeks the plant was 7 centimeters tall. Tap that point.", ans: [[4, 7]], trap: [[7, 4]] }, { say: "After 1 week the plant was 2 centimeters tall. Tap that point.", ans: [[1, 2]], trap: [[2, 1]] }] },
  ],
}));
