// Narrow Path Clues. Skill L.2.4-1.
// Using sentence-level context as a clue to the meaning of a word or phrase. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Narrow Path Clues",
  emoji: "🥾",
  premise: "The words around a new word explain it. Read the whole sentence and look for the clue.",
  outro: "Use the rest of the sentence to work out what a word means.",
  scene: "forest",
  kind: "pick",
  hint: "What part of the sentence explains the word?",
  tag: "ignores_context",
  rounds: [
    { say: "Read the sentence. What does narrow mean?", read: "The path was so narrow that only one person could fit.", yes: "not wide|", no: "very long|bumpy|dark", trap: "very long", why: "The clue is that only one person could fit.", win: "Narrow means not wide." },
    { say: "Read the sentence. What does ancient mean?", read: "The ancient tree had been growing for a thousand years.", yes: "very old|", no: "very tall|green|broken", trap: "very tall", why: "The clue is a thousand years.", win: "Ancient means very old." },
    { say: "Read the sentence by yourself.", alt: [{ say: "What does drowsy mean?", read: "After the long car ride, the drowsy baby could not keep her eyes open.", yes: "sleepy|", no: "hungry|noisy|small|happy|cold", trap: "hungry" }, { say: "What does timid mean?", read: "The timid kitten hid under the bed whenever someone came in.", yes: "shy and easily scared|", no: "playful|fluffy|very hungry|fast|loud", trap: "playful" }] },
  ],
}));
