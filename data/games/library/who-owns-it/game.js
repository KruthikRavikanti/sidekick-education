// Who Owns It?. Skill L.3.2-4.
// Forming and using possessives. Using apostrophes for plain plurals is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who Owns It?",
  emoji: "🦴",
  premise: "An apostrophe shows ownership. One owner gets ’s. More than one owner ending in s gets the apostrophe after the s.",
  outro: "One dog’s toy. Two dogs’ toys. A plain plural gets no apostrophe.",
  scene: "meadow",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Does something belong to them? One owner, or many?",
  tag: "apostrophe_for_plurals",
  rounds: [
    { say: "Drop in the word that fits.", rows: [["The toys of the two dogs are the ___ toys.", "dogs’"], ["I have two ___.", "dogs"]], extra: "dog’s", trap: [1, "dog’s"], why: "Nothing is owned here. Two dogs is a plain plural with no apostrophe.", win: "Dogs’ toys, and two dogs." },
    { say: "Drop in these words.", rows: [["That is my ___ bike.", "sister’s"], ["The ___ room is loud.", "teachers’"], ["Three ___ sat down.", "girls"]], extra: "girl’s", trap: [2, "girl’s"], why: "Three girls is just a plural. Nothing belongs to them here.", win: "One sister, many teachers, three girls." },
    { say: "Drop in the words by yourself.", rows: [["The ___ nest fell.", "bird’s"], ["Both ___ coats are red.", "boys’"], ["We saw five ___.", "cats"]], extra: "cat’s boy’s", trap: [2, "cat’s"] },
  ],
}));
