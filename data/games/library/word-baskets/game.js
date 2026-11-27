// Word Baskets. Skill L.1.5-1.
// Sorting words into categories to gain a sense of the concepts the categories represent. Grouping by spelling instead of meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Word Baskets",
  emoji: "🧺",
  premise: "Words that name the same kind of thing go in one basket. Think about what each word means.",
  outro: "Sort words by what they mean, not by how they are spelled.",
  scene: "kitchen",
  kind: "sort",
  fs: 5.6,
  hint: "What kind of thing does the word name?",
  tag: "groups_by_spelling",
  rounds: [
    { say: "Sort the words into colors and clothes.", bins: "Colors|Clothes", items: ["red blue green", "shirt hat sock"], trap: ["hat", 0], why: "Hat is short like red, but a hat is something you wear.", win: "Colors and clothes." },
    { say: "Sort the words into animals and foods.", bins: "Animals|Foods", items: ["cow pig hen", "corn pie ham"], trap: ["ham", 0], why: "Ham looks a bit like hen, but ham is something you eat.", win: "Animals and foods." },
    { say: "Sort into three groups by yourself.", bins: "Toys|Tools|Fruits", items: ["doll ball kite", "saw drill rake", "plum pear lime"], trap: ["pear", 0] },
  ],
}));
