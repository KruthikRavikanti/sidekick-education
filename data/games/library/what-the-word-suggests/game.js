// What the Word Suggests. Skill RL.6.4-1.
// Determining the figurative and connotative meanings of words and phrases. Using only dictionary meanings is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Word Suggests",
  emoji: "🏚️",
  premise: "Authors choose words for the feelings they carry. A house that crouches is more than a small house.",
  outro: "Figurative and connotative meanings go beyond the dictionary: they suggest a feeling or picture.",
  scene: "night",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Not what the word means in a dictionary. What feeling does it give?",
  tag: "dictionary_meaning_only",
  rounds: [
    { say: "What does each phrase suggest?", rows: [["The house crouched at the end of the lane.", "low and threatening"], ["Her smile was sunshine.", "warm and cheering"]], extra: "bending its knees|", trap: [0, "bending its knees"], why: "A house has no knees. The word makes it feel like a creature waiting to spring.", win: "One threatens, one warms." },
    { say: "What does each phrase suggest?", rows: [["His words were ice.", "cold and unfriendly"], ["The news hit like a wave.", "sudden and overwhelming"]], extra: "frozen water|", trap: [0, "frozen water"], why: "He did not speak in ice cubes. His tone felt cold.", win: "Cold words, crashing news." },
    { say: "Match these by yourself.", rows: [["The city never sleeps.", "always busy"], ["Fear gripped her.", "held her tightly"]], extra: "has no beds|shook her hand", trap: [0, "has no beds"] },
  ],
}));
