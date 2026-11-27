// Clue in the Sentence. Skill L.1.4-1.
// Using sentence-level context as a clue to the meaning of a word. Ignoring the sentence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Clue in the Sentence",
  emoji: "🐕",
  premise: "When a word is new, the rest of the sentence helps. Look for the clue hiding nearby.",
  outro: "Use the other words in the sentence as clues to a new word.",
  scene: "meadow",
  kind: "pick",
  hint: "Read the whole sentence. What part explains the new word?",
  tag: "ignores_the_sentence",
  rounds: [
    { say: "Read the sentence. What does tiny mean?", read: "The puppy was so tiny it fit in my hand.", yes: "very small|", no: "very loud|very old|very fast", trap: "very loud", why: "The clue is that it fit in my hand.", win: "Tiny means very small." },
    { say: "Read the sentence. What does soaked mean?", read: "I forgot my umbrella and got soaked in the rain.", yes: "very wet|", no: "very sleepy|lost|very late", trap: "lost", why: "The clues are no umbrella and rain.", win: "Soaked means very wet." },
    { say: "Read the sentence by yourself.", alt: [{ say: "What does gigantic mean?", read: "The gigantic tree was taller than our house.", yes: "very big|", no: "very green|very old|very thin|very wet|very new", trap: "very green" }, { say: "What does famished mean?", read: "I was famished, so I ate three bowls of rice.", yes: "very hungry|", no: "very tired|very happy|very cold|very quiet|very tall", trap: "very tired" }] },
  ],
}));
