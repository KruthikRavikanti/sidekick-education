// Notes and Sources. Skill W.4.8-1.
// Taking notes, categorizing information and providing a list of sources. Not recording sources is the known slip.
Sidekick.game(Sidekick.play({
  title: "Notes and Sources",
  emoji: "📝",
  premise: "Researchers take notes, sort them into categories, and write down where each fact came from.",
  outro: "Record your sources so readers can see where your information came from.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Where did that note come from?",
  tag: "does_not_record_sources",
  rounds: [
    { say: "Match each note to its source.", read: "Book, \"Ocean Giants\": Blue whales eat four tons of krill a day. / Website, SeaFacts: A blue whale’s heart is the size of a small car.", rows: [["eats four tons of krill daily", "Ocean Giants (book)"], ["heart the size of a small car", "SeaFacts (website)"]], extra: "no source|", trap: [0, "no source"], why: "Every note needs its source. Which one said that?", win: "Each note has a source." },
    { say: "Which entry belongs in a source list?", kind: "pick", yes: "Ocean Giants, by R. Diaz, 2019|SeaFacts website, article on blue whales", no: "a book I read|something online", trap: "a book I read", why: "That does not let a reader find it. Give the title and author.", win: "A source list names each source clearly." },
    { say: "Match each note to its source by yourself.", read: "Article, \"Volcano Watch\": Ash can rise ten miles. / Video, Earth Lab: Lava flows at up to 40 miles an hour.", rows: [["ash rises ten miles", "Volcano Watch (article)"], ["lava flows up to 40 mph", "Earth Lab (video)"]], extra: "no source|my own idea", trap: [1, "my own idea"] },
  ],
}));
