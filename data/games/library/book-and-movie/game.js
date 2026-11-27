// Book and Movie. Skill RL.4.7-1.
// Making connections between the text of a story and a visual or oral presentation of it. Treating the two as unrelated is the known slip.
Sidekick.game(Sidekick.play({
  title: "Book and Movie",
  emoji: "🎬",
  premise: "A movie or play of a story keeps some things from the book and changes others. Notice which is which.",
  outro: "Connect a text to its visual or oral version: what matches the descriptions, and what was changed?",
  scene: "city",
  kind: "sort",
  hint: "Does the movie detail match what the book says?",
  tag: "treats_versions_as_unrelated",
  rounds: [
    { say: "The book says: The cabin was tiny, dark and cold, with one cracked window. Sort the movie details.", bins: "Matches the book|Changed from the book", items: ["a small dim room|one cracked window", "a bright, roomy lodge|a roaring fire"], trap: ["a roaring fire", 0], why: "The book says the cabin was cold. A roaring fire changes that.", win: "Some details match, some were changed." },
    { say: "The book says: Mara was tall, quiet and always carried a worn notebook. Sort the movie details.", bins: "Matches the book|Changed from the book", items: ["she rarely speaks|she holds an old notebook", "she is short|she tells loud jokes"], trap: ["she tells loud jokes", 0], why: "The book calls her quiet.", win: "You connected the two versions." },
    { say: "The book says: The storm hit at midnight and lasted until dawn. Sort by yourself.", bins: "Matches the book|Changed from the book", items: ["the storm begins in darkness|it ends as the sun rises", "the storm hits at noon|it lasts five minutes"], trap: ["the storm hits at noon", 0] },
  ],
}));
