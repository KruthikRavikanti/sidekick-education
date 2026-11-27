// Where Is the Bee?. Skill K.G.A.1-2.
// Using position words: a flower sits in the middle of a small grid and the child taps the spot that is above, below or beside it.
Sidekick.game(Sidekick.play({
  title: "Where Is the Bee?",
  emoji: "🐝",
  premise: "The bee wants to rest near the flower. Listen to where, then tap that spot.",
  outro: "Above, below and beside tell where something is.",
  scene: "meadow",
  kind: "plot",
  quiet: true,
  cast: "",
  axes: [0, 4, 0, 4],
  hint: "Above is higher up. Below is lower down. Beside is next to it.",
  tag: "mixes_position_words",
  rounds: [
    { say: "Tap the spot just above the flower.", given: [[2, 2, "🌼"]], ans: [[2, 3]], trap: [[2, 1]], why: "That spot is below the flower. Above means higher up.", win: "Above is higher up." },
    { say: "Tap the spot just below the flower.", given: [[2, 2, "🌼"]], ans: [[2, 1]], trap: [[2, 3]], why: "That spot is above the flower. Below means lower down.", win: "Below is lower down." },
    { say: "Find the spot by yourself.", alt: [{ say: "Tap the spot just above the tree.", given: [[2, 2, "🌳"]], ans: [[2, 3]], trap: [[2, 1]] }, { say: "Tap a spot right beside the tree.", given: [[2, 2, "🌳"]], ans: [[3, 2]], also: [[[1, 2]]], trap: [[2, 3]] }, { say: "Tap the spot just below the tree.", given: [[2, 2, "🌳"]], ans: [[2, 1]], trap: [[2, 3]] }] },
  ],
}));
