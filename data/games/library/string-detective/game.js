// String Detective. Skill 1.MD.A.1-2.
// Comparing two lengths indirectly with a third object: the string matches one thing and is shorter or longer than the other, and the child draws the conclusion.
Sidekick.game(Sidekick.play({
  title: "String Detective",
  emoji: "🪢",
  premise: "Two things are too far apart to hold side by side. A piece of string helps you compare them anyway.",
  outro: "You can compare two things by comparing each one to a third thing.",
  scene: "paper",
  kind: "fill",
  hint: "The string stands in for the first thing. Compare the string with the second thing.",
  tag: "cannot_use_third_object",
  rounds: [
    { say: "Use the string clue to finish each sentence.", q: "The string is as long as the desk. The string is shorter than the rug.", rows: [["So the desk is ___ than the rug.", "shorter"], ["So the rug is ___ than the desk.", "longer"]], extra: "the same as|", trap: [0, "longer"], why: "The string matches the desk, and the string is shorter than the rug.", win: "The desk is shorter. The rug is longer." },
    { say: "A new string clue. Finish the sentences.", q: "The string is longer than the book. The string is shorter than the shelf.", rows: [["So the book is ___ than the shelf.", "shorter"], ["So the shelf is ___ than the book.", "longer"]], extra: "the same as|", trap: [0, "longer"], why: "The book is shorter than the string, and the string is shorter than the shelf.", win: "Book, string, shelf: short to long." },
    { say: "Finish these by yourself.", q: "A ribbon is as long as the bed. The same ribbon is longer than the door is wide.", rows: [["So the bed is ___ than the door.", "longer"], ["So the door is ___ than the bed.", "shorter"]], extra: "the same as|", trap: [0, "shorter"] },
  ],
}));
