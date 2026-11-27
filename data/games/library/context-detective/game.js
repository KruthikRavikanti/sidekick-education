// Context Detective. Skill L.7.4-1.
// Using context as a clue to the meaning of a word or phrase. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Context Detective",
  emoji: "🕵️",
  premise: "An unknown word is rarely alone. The sentence around it usually hints at its meaning.",
  outro: "Use the overall meaning of the sentence and nearby words as clues.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What happens because of the word? That is your clue.",
  tag: "ignores_context",
  rounds: [
    { say: "Use the clues. What does each capital word mean?", rows: [["Her BENEVOLENT smile put us at ease.", "kind"], ["The HOSTILE crowd booed and shook their fists.", "unfriendly"]], extra: "sleepy|", trap: [0, "unfriendly"], why: "It put them at ease. A kind smile does that.", win: "Kind, and unfriendly." },
    { say: "Use the clues.", rows: [["The trail was so ARDUOUS that half the group turned back.", "very hard"], ["He gave a CANDID answer and hid nothing.", "honest"]], extra: "very short|", trap: [0, "very short"], why: "People turned back. A short trail would not make them quit.", win: "Very hard, and honest." },
    { say: "Match these by yourself.", rows: [["The METICULOUS painter checked every tiny line.", "very careful"], ["Food was SCARCE, so each person got one bite.", "in short supply"]], extra: "very fast|plentiful", trap: [1, "plentiful"] },
  ],
}));
