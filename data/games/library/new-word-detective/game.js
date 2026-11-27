// New Word Detective. Skill RL.K.4-1.
// Asking and answering questions about unknown words in a text: the meaning of a new word is found from context. Skipping unknown words without noticing is the known slip.
Sidekick.game(Sidekick.play({
  title: "New Word Detective",
  emoji: "🕵️",
  premise: "When you meet a word you do not know, stop and be a detective. The words around it give clues.",
  outro: "Notice new words, then use the words around them as clues.",
  scene: "city",
  kind: "pick",
  hint: "Read the next sentence. It gives a clue.",
  tag: "skips_unknown_words",
  rounds: [
    { say: "Read the story. What does drenched mean?", read: "The pup was drenched. Rain dripped off his fur.", yes: "very wet|", no: "very fast|sleepy|hungry", trap: "sleepy", why: "The clue is the rain dripping off his fur.", win: "Drenched means very wet." },
    { say: "Read the story. What does enormous mean?", read: "The cake was enormous. It was as big as the table.", yes: "very big|", no: "very sweet|pink|cold", trap: "very sweet", why: "The clue says it was as big as the table.", win: "Enormous means very big." },
    { say: "Read the story by yourself.", alt: [{ say: "What does weary mean?", read: "Jo was weary. She had run all day and just wanted to sleep.", yes: "very tired|", no: "very glad|very tall|very loud|very hungry|very clean", trap: "very glad" }, { say: "What does chilly mean?", read: "The night was chilly. Dan put on a coat and a hat.", yes: "cold|", no: "dark|long|funny|loud|sunny", trap: "dark" }] },
  ],
}));
