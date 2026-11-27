// Chickens Before They Hatch. Skill L.5.5-2.
// Recognizing and explaining the meaning of common idioms, adages and proverbs. A literal reading is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chickens Before They Hatch",
  emoji: "🐣",
  premise: "Proverbs and idioms carry advice passed down for generations. The words are a picture of the real meaning.",
  outro: "Explain idioms, adages and proverbs by the advice they give, not the literal picture.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "What is the saying really advising?",
  tag: "literal_reading",
  rounds: [
    { say: "What does each saying mean?", rows: [["Do not count your chickens before they hatch.", "do not rely on what has not happened yet"], ["A stitch in time saves nine.", "fix a small problem before it grows"]], extra: "count your eggs carefully|", trap: [0, "count your eggs carefully"], why: "It is not about eggs. It warns against counting on things too early.", win: "Two pieces of old advice." },
    { say: "What does each saying mean?", rows: [["The grass is always greener on the other side.", "what others have seems better"], ["Rome was not built in a day.", "big things take time"]], extra: "cut the lawn often|", trap: [1, "what others have seems better"], why: "A great city takes ages to build. The saying is about patience.", win: "Two sayings explained." },
    { say: "Work these out by yourself.", rows: [["Do not put all your eggs in one basket.", "do not risk it all on one plan"], ["The squeaky wheel gets the grease.", "those who speak up get help"]], extra: "oil your bike|", trap: [1, "oil your bike"] },
  ],
}));
