// Tall, Taller, Tallest. Skill L.3.1-5.
// Forming and using comparative and superlative adjectives and adverbs. Writing more taller is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tall, Taller, Tallest",
  emoji: "🦒",
  premise: "To compare two things add -er. To compare three or more add -est. Long words use more and most instead.",
  outro: "Use -er or more for two, and -est or most for three or more. Never use both at once.",
  scene: "sand",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "How many things are being compared? Does the word already have -er?",
  tag: "double_comparative",
  rounds: [
    { say: "Finish the comparing forms.", rows: [["tall, ___, tallest", "taller"], ["fast, faster, ___", "fastest"]], extra: "more taller|", trap: [0, "more taller"], why: "Taller already compares. It does not need more as well.", win: "Taller and fastest." },
    { say: "Drop in the word that fits.", rows: [["A giraffe is ___ than a horse.", "taller"], ["It is the ___ animal on land.", "tallest"], ["This book is ___ than that one.", "more exciting"]], extra: "excitinger", trap: [2, "excitinger"], why: "Long words like exciting use more, not -er.", win: "Taller, tallest, more exciting." },
    { say: "Drop in the words by yourself.", rows: [["She runs ___ than I do.", "faster"], ["He is the ___ kid in class.", "kindest"], ["That was the ___ movie ever.", "most boring"]], extra: "more faster|boringest", trap: [0, "more faster"] },
  ],
}));
