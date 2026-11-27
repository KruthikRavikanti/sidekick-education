// Whose Is It?. Skill L.1.1-2.
// Using common, proper and possessive nouns. Leaving off the apostrophe-s for possessives is the known slip.
Sidekick.game(Sidekick.play({
  title: "Whose Is It?",
  emoji: "🦴",
  premise: "To show that something belongs to someone, add an apostrophe and s. The bone of the dog is the dog’s bone.",
  outro: "Add ’s to a noun to show something belongs to it.",
  scene: "meadow",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Does something belong to someone? Then the word needs ’s.",
  tag: "drops_possessive_ending",
  rounds: [
    { say: "Drop in the word that shows who it belongs to.", rows: [["This bone belongs to the dog. It is the ___ bone.", "dog’s"], ["This hat belongs to Sam. It is ___ hat.", "Sam’s"]], extra: "dog Sam", trap: [0, "dog"], why: "The dog bone does not show who owns it. Add ’s.", win: "The dog’s bone and Sam’s hat." },
    { say: "Is it a common noun or a proper noun? Proper nouns name one special person, place or day.", kind: "sort", bins: "Common noun|Proper noun", items: ["city dog girl", "Texas Max Monday"], trap: ["Monday", 0], why: "Monday is the name of one special day. It gets a capital letter.", win: "Common nouns and proper nouns." },
    { say: "Drop in the words by yourself.", rows: [["The cat has a toy. It is the ___ toy.", "cat’s"], ["Mia has a bike. It is ___ bike.", "Mia’s"], ["The bird has a nest. It is the ___ nest.", "bird’s"]], extra: "cats Mia", trap: [0, "cats"] },
  ],
}));
