// Fragile Vase Clues. Skill L.3.4-1.
// Using sentence-level context as a clue to the meaning of a word or phrase. Ignoring context is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fragile Vase Clues",
  emoji: "🏺",
  premise: "When you meet a new word, the sentence around it often explains it. Hunt for the clue.",
  outro: "Use context clues in the sentence to work out an unknown word.",
  scene: "desk",
  kind: "pick",
  hint: "What happens in the sentence that explains the word?",
  tag: "ignores_context",
  rounds: [
    { say: "Read the sentence. What does fragile mean?", read: "The fragile vase broke when it fell off the shelf.", yes: "easily broken|", no: "very heavy|brightly colored|expensive", trap: "very heavy", why: "The clue is that it broke when it fell.", win: "Fragile means easily broken." },
    { say: "Read the sentence. What does exhausted mean?", read: "After the ten-mile hike, the exhausted campers fell asleep at once.", yes: "very tired|", no: "very hungry|lost|excited", trap: "excited", why: "They fell asleep at once. That is the clue.", win: "Exhausted means very tired." },
    { say: "Read the sentence by yourself.", alt: [{ say: "What does scarce mean?", read: "Water was scarce in the desert, so they drank only a few sips a day.", yes: "hard to find|", no: "very cold|dirty|sweet|plentiful|heavy", trap: "plentiful" }, { say: "What does reluctant mean?", read: "Reluctant to jump, Maya stood at the edge of the pool for ten minutes.", yes: "not wanting to|", no: "eager|ready|too short|very fast|proud", trap: "eager" }] },
  ],
}));
