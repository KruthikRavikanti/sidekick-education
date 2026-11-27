// Shared Roots. Skill L.3.4-3.
// Using a known root word as a clue to the meaning of an unknown word with the same root (company, companion). Not seeing the root is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shared Roots",
  emoji: "🌳",
  premise: "Words that share a root are like cousins. Knowing one helps you work out the other.",
  outro: "Use a root word you know to work out a related word.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "What smaller word do the two words share?",
  tag: "does_not_see_root",
  rounds: [
    { say: "Use the related word to find each meaning.", rows: [["companion (like company)", "someone who keeps you company"], ["signal (like sign)", "a sign that tells you something"]], extra: "a kind of business|", trap: [0, "a kind of business"], why: "Company can mean a business, but here think of keeping someone company.", win: "Shared roots, linked meanings." },
    { say: "Use the related word to find each meaning.", rows: [["actor (like act)", "a person who acts"], ["dangerous (like danger)", "full of danger"], ["discovery (like discover)", "something found"]], extra: "very safe|", trap: [1, "very safe"], why: "The root is danger. Dangerous means full of danger.", win: "The root points the way." },
    { say: "Find the meanings by yourself.", rows: [["musician (like music)", "a person who makes music"], ["movement (like move)", "the act of moving"], ["national (like nation)", "belonging to a country"]], extra: "a kind of song|", trap: [0, "a kind of song"] },
  ],
}));
