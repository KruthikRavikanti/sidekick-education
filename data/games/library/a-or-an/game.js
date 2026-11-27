// A or An. Skill L.1.1-8.
// Using determiners: a, an, this, that. Using a before a vowel sound is the known slip.
Sidekick.game(Sidekick.play({
  title: "A or An",
  emoji: "🍎",
  premise: "Use an before a word that starts with a vowel sound. Use a before all the others.",
  outro: "An goes before a vowel sound: an apple, an egg. A goes before other sounds: a dog.",
  scene: "kitchen",
  kind: "fill",
  fs: 6.4,
  cast: "",
  hint: "Does the next word start with a, e, i, o or u?",
  tag: "a_before_vowel",
  rounds: [
    { say: "Drop in a or an.", rows: [["___ apple", "an"], ["___ dog", "a"]], extra: "the", trap: [0, "a"], why: "Apple starts with a vowel sound. Say an apple.", win: "An apple, a dog." },
    { say: "Drop in a or an.", rows: [["___ egg", "an"], ["___ hat", "a"], ["___ owl", "an"], ["___ bike", "a"]], trap: [2, "a"], why: "Owl starts with a vowel sound. Say an owl.", win: "An egg, a hat, an owl, a bike." },
    { say: "Drop in the words by yourself. This is for things close by, that is for things far away.", rows: [["___ umbrella", "an"], ["___ cup", "a"], ["___ pen in my hand", "this"], ["___ bird far away", "that"]], trap: [0, "a"] },
  ],
}));
