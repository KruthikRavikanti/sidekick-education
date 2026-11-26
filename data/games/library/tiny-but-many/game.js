// Tiny but Many. Skill K.CC.C.6-2.
// Comparing groups by counting: groups of big objects have few and groups of small objects have many, so only counting gives the right answer.
Sidekick.game(Sidekick.play({
  title: "Tiny but Many",
  emoji: "🐜",
  premise: "Big animals and tiny ones are having a picnic. Find the groups with the most by counting, not by size.",
  outro: "To know which group has more, count. Big things are not more things.",
  scene: "meadow",
  kind: "pick",
  fs: 3.6,
  cast: "🐜 🌱 🐘 🌱",
  hint: "Count each group. Size does not tell you how many.",
  tag: "bigger_objects_means_more",
  rounds: [
    { say: "Tap every group that has more than 4.", yes: "🐜🐜🐜🐜🐜🐜|🍓🍓🍓🍓🍓", no: "🐘🐘🐘|🍉🍉", trap: "🐘🐘🐘", why: "Elephants are big, but count them: only 3.", win: "Six ants and five berries are more than 4." },
    { say: "Tap every group that has more than 5.", yes: "🐝🐝🐝🐝🐝🐝🐝|🫐🫐🫐🫐🫐🫐", no: "🐳🐳|🚌🚌🚌🚌", trap: "🚌🚌🚌🚌", why: "Buses are big, but there are only 4 of them.", win: "Seven bees and six berries." },
    { say: "Tap every group that has more than 6.", yes: "🐞🐞🐞🐞🐞🐞🐞🐞|🍒🍒🍒🍒🍒🍒🍒", no: "🦒🦒🦒|🏠🏠🏠🏠🏠", trap: "🏠🏠🏠🏠🏠" },
  ],
}));
