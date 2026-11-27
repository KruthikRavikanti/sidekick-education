// Root Families. Skill L.8.4-2.
// Using Greek or Latin affixes and roots as clues to meaning. Ignoring roots is the known slip.
Sidekick.game(Sidekick.play({
  title: "Root Families",
  emoji: "🌲",
  premise: "Precede, recede and secede all share cede, which means go. One root ties the family together.",
  outro: "A shared root gives related words a shared core meaning: cede means go.",
  scene: "forest",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "What idea do all three words in the family share?",
  tag: "ignores_roots",
  rounds: [
    { say: "What does each root mean?", rows: [["cede (precede, recede, secede)", "go"], ["ject (eject, inject, reject)", "throw"], ["tract (attract, subtract, tractor)", "pull"]], extra: "speak", trap: [1, "pull"], why: "To eject is to throw out. To reject is to throw back.", win: "Go, throw, pull." },
    { say: "Use the root. What does each word mean?", rows: [["precede", "go before"], ["recede", "go back"], ["secede", "go apart from"]], trap: [0, "go back"], why: "Pre means before. Precede is to go before.", win: "Prefix plus root." },
    { say: "Match these by yourself.", rows: [["struct (construct, structure)", "build"], ["rupt (erupt, interrupt)", "break"], ["vert (reverse, convert)", "turn"]], extra: "carry", trap: [2, "carry"] },
  ],
}));
