// Group Names. Skill L.2.1-1.
// Using collective nouns. Using a bunch of for every group is the known slip.
Sidekick.game(Sidekick.play({
  title: "Group Names",
  emoji: "🐺",
  premise: "Some words name a whole group at once. A team is many players. A flock is many birds.",
  outro: "A collective noun names a group: team, flock, herd, class.",
  scene: "forest",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Which special word names that kind of group?",
  tag: "bunch_of_for_everything",
  rounds: [
    { say: "Drop in the word that names each group.", rows: [["a ___ of players", "team"], ["a ___ of birds", "flock"]], extra: "bunch", trap: [0, "bunch"], why: "A group of players has its own name: a team.", win: "A team and a flock." },
    { say: "Drop in these group names.", rows: [["a ___ of cows", "herd"], ["a ___ of students", "class"], ["a ___ of wolves", "pack"]], extra: "pile", trap: [2, "pile"], why: "Wolves travel in a pack.", win: "A herd, a class and a pack." },
    { say: "Drop in the words by yourself.", rows: [["a ___ of fish", "school"], ["a ___ of bees", "swarm"], ["a ___ of ships", "fleet"]], extra: "bunch lot", trap: [0, "bunch"] },
  ],
}));
