// Phrases and Clauses Toolkit. Skill L.9-10.1-2.
// Using various types of phrases and clauses to convey meaning and add variety. Repetitive syntax is the known slip.
Sidekick.game(Sidekick.play({
  title: "Phrases and Clauses Toolkit",
  emoji: "🧰",
  premise: "Short, same-shaped sentences get dull. Phrases and clauses let you add detail and vary the rhythm.",
  outro: "Use participial and appositive phrases and adverbial and relative clauses to add meaning and variety.",
  scene: "desk",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Look at the added part. Does it rename, describe with an -ing word, or begin with who, that or because?",
  tag: "repetitive_syntax",
  rounds: [
    { say: "Each sentence adds something to The dog ran home. Match the kind of addition.", rows: [["participial phrase", "Wagging its tail, the dog ran home."], ["appositive phrase", "The dog, a brown terrier, ran home."], ["adverbial clause", "The dog ran home because it was hungry."]], trap: [0, "The dog, a brown terrier, ran home."], why: "A brown terrier renames the dog. The participial phrase starts with the -ing word wagging.", win: "Describe, rename, explain." },
    { say: "Match each kind of addition.", rows: [["relative clause", "The dog that lives next door ran home."], ["participial phrase", "Barking loudly, the dog ran home."], ["adverbial clause", "When the rain began, the dog ran home."]], trap: [0, "When the rain began, the dog ran home."], why: "When the rain began tells when. A relative clause starts with that or who and describes the noun.", win: "That, -ing, when." },
    { say: "Match these by yourself.", rows: [["appositive phrase", "Ms. Ortiz, our coach, blew the whistle."], ["relative clause", "The whistle that she blew was silver."], ["participial phrase", "Grinning, she blew the whistle."]], extra: "She blew the whistle.|", trap: [0, "She blew the whistle."] },
  ],
}));
