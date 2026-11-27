// Fancy Word Fit. Skill L.K.6-1.
// Using words and phrases acquired through reading and being read to: new words are placed in sentences where they fit. Using only everyday words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fancy Word Fit",
  emoji: "🐘",
  premise: "Books teach us big new words. Try them out by putting each one where it fits.",
  outro: "Use the new words you learn from books when you talk and write.",
  scene: "sand",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Enormous means very big. Tiny means very small.",
  tag: "avoids_new_words",
  rounds: [
    { say: "Enormous means very big. Tiny means very small. Drop each word where it fits.", rows: [["An elephant is ___.", "enormous"], ["A ladybug is ___.", "tiny"]], extra: "purple", trap: [0, "tiny"], why: "An elephant is very big. That is enormous.", win: "Enormous elephant, tiny ladybug." },
    { say: "Delighted means very happy. Exhausted means very tired. Drop each word where it fits.", rows: [["After the long race, Sam was ___.", "exhausted"], ["Mia got a puppy. She was ___.", "delighted"]], extra: "square", trap: [0, "delighted"], why: "A long race makes you very tired. That is exhausted.", win: "Exhausted runner, delighted Mia." },
    { say: "Drop each word where it fits, by yourself.", rows: [["A whale is ___.", "enormous"], ["An ant is ___.", "tiny"], ["After a long hike, Dad was ___.", "exhausted"]], extra: "chilly", trap: [1, "enormous"] },
  ],
}));
