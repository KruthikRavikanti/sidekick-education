// Same Letters, Two Sounds. Skill RF.2.3-5.
// Identifying words with inconsistent but common spelling-sound correspondences. Applying one rule to every word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Letters, Two Sounds",
  emoji: "🍞",
  premise: "The letters ea do not always sound the same. In bread they say eh. In bead they say ee.",
  outro: "Some letter teams have more than one sound. Try both and see which makes a real word.",
  scene: "kitchen",
  kind: "sort",
  fs: 5.6,
  hint: "Say the word both ways. Which one is a word you know?",
  tag: "one_rule_for_every_word",
  rounds: [
    { say: "Read each word. Which sound does ea make?", bins: "ea like bread|ea like bead", items: ["head deaf", "meat team"], trap: ["head", 1], why: "Heed is not the word. Head rhymes with bed.", win: "Two sounds for ea." },
    { say: "Now the letters ow. Like cow, or like snow?", bins: "ow like cow|ow like snow", items: ["now down", "grow slow"], trap: ["grow", 0], why: "Grow rhymes with snow, not with cow.", win: "Two sounds for ow." },
    { say: "Sort the oo words by yourself.", bins: "oo like moon|oo like book", items: ["food soon pool", "foot good wood"], trap: ["foot", 0] },
  ],
}));
