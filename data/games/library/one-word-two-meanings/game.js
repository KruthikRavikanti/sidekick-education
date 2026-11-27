// One Word, Two Meanings. Skill L.K.4-1.
// Identifying new meanings for familiar words: duck as a bird and duck as an action. Thinking each word has one meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "One Word, Two Meanings",
  emoji: "🦆",
  premise: "Some words mean two different things. The rest of the sentence tells you which one.",
  outro: "A word can have more than one meaning. The sentence tells you which.",
  scene: "ocean",
  kind: "fill",
  cast: "",
  hint: "Read the whole sentence. What is going on in it?",
  tag: "one_meaning_per_word",
  rounds: [
    { say: "What does duck mean in each sentence?", rows: [["The duck swims in the pond.", "a bird"], ["Duck! A ball is coming.", "bend down fast"]], extra: "a ball|", trap: [1, "a bird"], why: "No bird is in this one. Someone has to get low fast.", win: "Duck can be a bird or a move." },
    { say: "What does bat mean in each sentence?", rows: [["A bat flew out at night.", "an animal"], ["Hit the ball with the bat.", "a stick"]], extra: "a hat|", trap: [1, "an animal"], why: "You hit a ball with a stick called a bat.", win: "Bat can be an animal or a stick." },
    { say: "What does each word mean? Work it out by yourself.", rows: [["The bell will ring.", "make a sound"], ["She has a gold ring.", "a band for a finger"], ["A fly sat on my arm.", "a bug"]], extra: "a bird|", trap: [0, "a band for a finger"] },
  ],
}));
