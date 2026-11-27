// Spread-Out Sheep. Skill K.CC.B.4-3.
// Conservation of number: the same count is shown bunched up and spread out, and the child sorts by how many, not by how much room they take.
Sidekick.game(Sidekick.play({
  title: "Spread-Out Sheep",
  emoji: "🐑",
  premise: "Some flocks huddle close and some spread out wide. Sort each flock by how many sheep it really has.",
  outro: "Spreading out does not make more. The count stays the same.",
  scene: "field",
  kind: "sort",
  cast: "🐑 🌳 🐕 🌳",
  hint: "Count the animals. How far apart they stand does not change how many.",
  tag: "spread_out_means_more",
  rounds: [
    { say: "Sort each flock by how many sheep it has.", bins: "4 sheep|5 sheep", items: ["🐑🐑🐑🐑|🐑 🐑 🐑 🐑", "🐑🐑🐑🐑🐑|🐑 🐑 🐑 🐑 🐑"], trap: ["🐑 🐑 🐑 🐑", 1], why: "They are spread out, but count them: still 4 sheep.", win: "Close together or spread out, 4 is 4." },
    { say: "Now the ducks. Count each group.", bins: "3 ducks|5 ducks", items: ["🦆🦆🦆|🦆 🦆 🦆", "🦆🦆🦆🦆🦆|🦆🦆 🦆🦆🦆"], trap: ["🦆 🦆 🦆", 1], why: "Those ducks stand far apart, but there are only 3.", win: "Spreading out did not add any ducks." },
    { say: "Sort the fish groups by yourself.", bins: "4 fish|5 fish", items: ["🐟🐟🐟🐟|🐟 🐟 🐟 🐟", "🐟🐟🐟🐟🐟|🐟 🐟 🐟 🐟 🐟"], trap: ["🐟 🐟 🐟 🐟", 1] },
  ],
}));
