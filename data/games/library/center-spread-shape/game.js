// Center, Spread, Shape. Skill 6.SP.A.2-1.
// Describing a distribution by its center, spread and overall shape. Describing only the highest value is the known slip.
Sidekick.game(Sidekick.play({
  title: "Center, Spread, Shape",
  emoji: "📊",
  premise: "A set of data has a center, a spread and a shape. Describing all three tells the whole story.",
  outro: "Describe data by its center (a typical value), its spread (how far it stretches) and its overall shape.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Center is where most of the data piles up. Spread is from least to greatest.",
  tag: "describes_only_highest",
  rounds: [
    { say: "Describe the quiz scores in the dot plot.", fig: { type: "bars", stack: true, given: [["5", 1], ["6", 2], ["7", 3], ["8", 2], ["9", 1]], cap: 4, v: [] }, rows: [["center", "about 7"], ["spread", "from 5 to 9"], ["shape", "one even hill"]], extra: "about 9|", trap: [0, "about 9"], why: "9 is just the highest score. Most scores pile up near 7.", win: "Centered at 7, spread 5 to 9, one even hill." },
    { say: "Describe this data.", fig: { type: "bars", stack: true, given: [["1", 1], ["2", 3], ["3", 2], ["4", 1], ["5", 0], ["6", 0], ["7", 1]], cap: 4, v: [] }, rows: [["center", "about 2 or 3"], ["spread", "from 1 to 7"], ["shape", "a hill and a stray"]], extra: "about 7|", trap: [0, "about 7"], why: "7 is one far-off value. The pile sits near 2 and 3.", win: "Centered near 2 or 3, with one far value." },
    { say: "Describe this data by yourself.", fig: { type: "bars", stack: true, given: [["10", 2], ["11", 4], ["12", 2], ["13", 1], ["14", 1]], cap: 4, v: [] }, rows: [["center", "about 11"], ["spread", "from 10 to 14"], ["shape", "tail to the right"]], extra: "about 14|", trap: [0, "about 14"] },
  ],
}));
