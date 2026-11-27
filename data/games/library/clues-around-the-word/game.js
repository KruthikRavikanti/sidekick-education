// Clues Around the Word. Skill L.6.4-1.
// Using context as a clue to the meaning of a word or phrase. Ignoring the context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clues Around the Word",
  emoji: "🧭",
  premise: "When a word is new, the sentence around it often explains it. Look at the words nearby.",
  outro: "Use context, the surrounding words, as a clue to the meaning of an unknown word.",
  scene: "sand",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Which other words in the sentence describe the same thing?",
  tag: "ignores_context",
  rounds: [
    { say: "Use the clues. What does each capital word mean?", rows: [["The ARID land was parched and cracked.", "very dry"], ["The FRIGID wind froze our fingers.", "very cold"]], extra: "very green|", trap: [0, "very green"], why: "Parched and cracked are the clues. Green land is not cracked.", win: "Dry and cold." },
    { say: "Use the clues.", rows: [["She was FAMISHED and ate three bowls.", "very hungry"], ["The path was so NARROW we walked in single file.", "not wide"]], extra: "very tired|", trap: [0, "very tired"], why: "She ate three bowls. That points to hunger.", win: "Hungry and not wide." },
    { say: "Match these by yourself.", rows: [["The ANCIENT wall had stood for a thousand years.", "very old"], ["His reply was so FAINT I could barely hear it.", "very quiet"]], extra: "very tall|very rude", trap: [1, "very rude"] },
  ],
}));
