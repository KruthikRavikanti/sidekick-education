// Stronger Word Swap. Skill L.2.6-1.
// Using words and phrases acquired through reading, including adjectives and adverbs to describe. Using vague words like good and nice is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stronger Word Swap",
  emoji: "🎬",
  premise: "Good and nice are tired words. Swap them for words that say exactly what you mean.",
  outro: "Choose precise adjectives and adverbs instead of vague ones like good and nice.",
  scene: "city",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Which word paints the clearest picture?",
  tag: "uses_vague_words",
  rounds: [
    { say: "Swap the plain word for a stronger one.", rows: [["It was a ___ movie. (good)", "thrilling"], ["The soup was ___. (good)", "delicious"]], extra: "nice", trap: [0, "nice"], why: "Nice is just as plain as good. Pick a word with more power.", win: "Thrilling and delicious." },
    { say: "Swap these plain words.", rows: [["She is a ___ friend. (nice)", "loyal"], ["The puppy ran ___. (fast)", "swiftly"], ["We had a ___ day. (bad)", "dreadful"]], extra: "okay", trap: [2, "okay"], why: "Okay is weak. Dreadful shows how the day really was.", win: "Loyal, swiftly and dreadful." },
    { say: "Swap these by yourself.", rows: [["The view was ___. (nice)", "stunning"], ["He spoke ___. (quietly)", "softly"], ["It was a ___ cake. (big)", "gigantic"]], extra: "good fine", trap: [0, "good"] },
  ],
}));
