// Same and Opposite. Skill L.4.5-3.
// Demonstrating understanding of words by relating them to their antonyms and synonyms. Confusing the two is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same and Opposite",
  emoji: "🔁",
  premise: "A synonym means nearly the same. An antonym means the opposite. Both help you understand a word.",
  outro: "Synonyms have similar meanings. Antonyms have opposite meanings.",
  scene: "candy",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Does it mean almost the same, or the opposite?",
  tag: "confuses_synonym_antonym",
  rounds: [
    { say: "Find a synonym and an antonym for ancient.", rows: [["synonym for ancient", "old"], ["antonym for ancient", "modern"]], extra: "tall", trap: [0, "modern"], why: "Modern is the opposite of ancient. A synonym means the same.", win: "Old is a synonym. Modern is an antonym." },
    { say: "Find each one.", rows: [["synonym for brave", "fearless"], ["antonym for brave", "cowardly"], ["synonym for tiny", "small"], ["antonym for tiny", "huge"]], trap: [1, "fearless"], why: "Fearless means the same as brave. The antonym is the opposite.", win: "Two synonyms and two antonyms." },
    { say: "Find each one by yourself.", rows: [["synonym for quick", "rapid"], ["antonym for quick", "slow"], ["synonym for difficult", "hard"], ["antonym for difficult", "easy"]], trap: [0, "slow"] },
  ],
}));
