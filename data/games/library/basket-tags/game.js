// Basket Tags. Skill K.CC.A.3-3.
// A numeral names how many are in a set, and an empty set is named by 0. The child tags each basket, including an empty one.
Sidekick.game(Sidekick.play({
  title: "Basket Tags",
  emoji: "🧺",
  premise: "Each basket needs a number tag that tells how many are inside. One basket is empty!",
  outro: "Every basket has its tag, even the empty one. Zero is a number too.",
  scene: "kitchen",
  kind: "fill",
  cast: "",
  hint: "Count what is in the basket. If nothing is there, the tag is 0.",
  tag: "no_number_for_empty",
  rounds: [
    { say: "Count each basket and drag the matching tag to it.", rows: [["🍎🍎🍎", "3"], ["🍎🍎🍎🍎🍎", "5"]], extra: "4", win: "Three apples and five apples." },
    { say: "One basket has nothing in it. Which tag says nothing?", rows: [["🍐🍐", "2"], ["(empty basket)", "0"], ["🍐🍐🍐🍐", "4"]], extra: "1", trap: [1, "1"], why: "Nothing is in that basket. The number for nothing is 0.", win: "An empty basket gets a 0." },
    { say: "Tag every basket by yourself.", rows: [["🍋🍋🍋🍋🍋🍋", "6"], ["(empty basket)", "0"], ["🍋🍋🍋", "3"]], extra: "1 5", trap: [1, "1"] },
  ],
}));
