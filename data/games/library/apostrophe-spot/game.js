// Apostrophe Spot. Skill L.2.2-3.
// Using an apostrophe to form contractions and frequently occurring possessives. Writing its for it’s is the known slip.
Sidekick.game(Sidekick.play({
  title: "Apostrophe Spot",
  emoji: "✒️",
  premise: "An apostrophe does two jobs. It takes the place of missing letters, and it shows who owns something.",
  outro: "It’s means it is. Its, with no apostrophe, means belonging to it.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Can you say it is in that spot? Then use it’s.",
  tag: "its_for_it_is",
  rounds: [
    { say: "Write each pair of words as one short word.", rows: [["do not", "don’t"], ["it is", "it’s"]], extra: "its dont", trap: [1, "its"], why: "The apostrophe takes the place of the missing i in is.", win: "Don’t and it’s." },
    { say: "Drop in the word that fits.", rows: [["___ raining outside.", "It’s"], ["The dog wagged ___ tail.", "its"], ["That is ___ bike.", "Sam’s"]], extra: "Sams", trap: [1, "It’s"], why: "The dog wagged it is tail does not work. Use its.", win: "It’s, its and Sam’s." },
    { say: "Drop in the words by yourself.", rows: [["I ___ find my shoe.", "can’t"], ["___ time for lunch.", "It’s"], ["The bird hurt ___ wing.", "its"]], extra: "cant", trap: [2, "It’s"] },
  ],
}));
