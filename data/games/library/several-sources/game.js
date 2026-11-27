// Several Sources. Skill W.5.7-1.
// Conducting short research projects that use several sources. Using one source is the known slip.
Sidekick.game(Sidekick.play({
  title: "Several Sources",
  emoji: "📚",
  premise: "Good research checks several sources. Each one adds something the others leave out.",
  outro: "Use several sources to build knowledge about different aspects of a topic.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Which source added that piece?",
  tag: "uses_one_source",
  rounds: [
    { say: "Your question: Why are monarch butterflies declining? Match each fact to its source.", read: "Book: Monarchs lay eggs only on milkweed. / Article: Farms have cleared most milkweed. / Video: Winters in Mexico are getting stormier.", rows: [["Milkweed is being cleared.", "the article"], ["Storms hit their winter home.", "the video"]], extra: "the book|", trap: [0, "the book"], why: "The book explains why milkweed matters. Which source says it is being cleared?", win: "Each source adds a piece." },
    { say: "Which conclusion needs more than one of those sources?", kind: "pick", yes: "Monarchs suffer from lost milkweed and from harsh winters.|", no: "Monarchs lay eggs on milkweed.|Winters in Mexico are stormier.|Farms clear land.", trap: "Monarchs lay eggs on milkweed.", why: "That comes from the book alone.", win: "Several sources give the fuller answer." },
    { say: "Your question: How do volcanoes affect weather? Match by yourself.", read: "Book: Eruptions blast ash high into the air. / Website: Ash blocks sunlight for months. / Report: Global temperatures dropped after one eruption.", rows: [["Ash blocks sunlight.", "the website"], ["Temperatures dropped.", "the report"]], extra: "the book|none of them", trap: [1, "the book"] },
  ],
}));
