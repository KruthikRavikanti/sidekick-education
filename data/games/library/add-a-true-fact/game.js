// Add a True Fact. Skill W.K.2-2.
// Supplying information about a topic in informative writing. Writing only a label is the known slip.
Sidekick.game(Sidekick.play({
  title: "Add a True Fact",
  emoji: "🐕",
  premise: "One word is only a label. Writers add true facts so the reader learns something.",
  outro: "Teach your reader: add facts that are true about your topic.",
  scene: "meadow",
  kind: "pick",
  hint: "Does it teach something true about the topic?",
  tag: "writes_only_a_label",
  rounds: [
    { say: "The topic is dogs. Tap the true facts to add.", yes: "Dogs bark.|Dogs have fur.", no: "Dog.|Dogs can fly.", trap: "Dog.", why: "That is only a label. A fact tells something about dogs.", win: "Two true facts about dogs." },
    { say: "The topic is fish. Tap the true facts to add.", yes: "Fish swim.|Fish live in water.", no: "Fish.|Fish ride bikes.|A fish.", trap: "Fish.", why: "That is only a label. Tell what fish do.", win: "Two true facts about fish." },
    { say: "The topic is the sun. Tap the true facts by yourself.", yes: "The sun is hot.|The sun gives light.", no: "Sun.|The sun is made of ice.|The sun.", trap: "Sun." },
  ],
}));
