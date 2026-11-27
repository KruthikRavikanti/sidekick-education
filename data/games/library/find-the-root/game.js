// Find the Root. Skill L.2.4-3.
// Using a known root word as a clue to the meaning of an unknown word with the same root (addition, additional). Not seeing the root is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Root",
  emoji: "🌱",
  premise: "A big word often has a smaller word you know hiding inside it. That root word is a clue.",
  outro: "Use a root word you know to work out a new word with the same root.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "What smaller word do you see inside?",
  tag: "does_not_see_root",
  rounds: [
    { say: "Use the root word to find each meaning.", rows: [["additional (root: add)", "extra, added on"], ["helpful (root: help)", "giving help"]], extra: "taken away|", trap: [0, "taken away"], why: "The root is add. Additional means something added.", win: "Roots point to the meaning." },
    { say: "Use the root word to find each meaning.", rows: [["teacher (root: teach)", "a person who teaches"], ["painful (root: pain)", "full of pain"], ["singer (root: sing)", "a person who sings"]], extra: "a kind of song|", trap: [2, "a kind of song"], why: "The er ending means a person who does it.", win: "The root tells you." },
    { say: "Find the meanings by yourself.", rows: [["builder (root: build)", "a person who builds"], ["hopeful (root: hope)", "full of hope"], ["mixture (root: mix)", "things mixed together"]], extra: "a tall house|", trap: [0, "a tall house"] },
  ],
}));
