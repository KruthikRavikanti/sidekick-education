// Scoop the Phrases. Skill RF.2.4-2.
// Reading with appropriate rate and expression: sentences are read in meaningful phrases. Reading word by word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scoop the Phrases",
  emoji: "🍨",
  premise: "Smooth readers do not read one word at a time. They scoop words into groups that belong together.",
  outro: "Read in phrases: groups of words that go together.",
  scene: "candy",
  kind: "pick",
  hint: "Which words belong together as one little idea?",
  tag: "reads_word_by_word",
  rounds: [
    { say: "Tap the way to scoop this sentence that sounds smooth.", yes: "The little dog / ran to the park.|", no: "The / little / dog / ran / to / the / park.|The little / dog ran to / the park.|The little dog ran / to the / park.", trap: "The / little / dog / ran / to / the / park.", why: "That stops after every word. Scoop words that go together.", win: "Who it is, then what it did." },
    { say: "Tap the smooth way to scoop this one.", yes: "After lunch, / we played a game / in the yard.|", no: "After / lunch we / played a / game in the yard.|After lunch we played / a / game in / the yard.|After lunch we / played a game in the / yard.", trap: "After / lunch we / played a / game in the yard.", why: "After lunch belongs together as one group.", win: "When, what, and where." },
    { say: "Tap the smooth way by yourself.", yes: "My big brother / rides his bike / to school.|", no: "My / big / brother / rides / his / bike / to / school.|My big / brother rides his / bike to school.|My big brother rides / his / bike to / school.|My big brother rides his / bike to / school.|My / big brother rides / his bike to school.", trap: "My / big / brother / rides / his / bike / to / school." },
  ],
}));
