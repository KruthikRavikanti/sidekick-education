// Peek, Look, Stare. Skill L.1.5-4.
// Distinguishing shades of meaning among verbs differing in manner and adjectives differing in intensity. Treating them as the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "Peek, Look, Stare",
  emoji: "🙈",
  premise: "Some words mean almost the same thing, but one is stronger. A peek is quick. A stare goes on and on.",
  outro: "Words with close meanings can be put in order from weak to strong.",
  scene: "forest",
  kind: "row",
  hint: "Act them out. Which is the smallest? Which is the biggest?",
  tag: "treats_words_as_same",
  rounds: [
    { say: "Put the words in order from the quickest look to the longest.", seq: "peek look stare", trap: "look peek stare", why: "A peek is the quickest, smallest look.", win: "Peek, look, stare." },
    { say: "Put these in order from a little wet to very wet.", seq: "damp wet soaked", trap: "wet damp soaked", why: "Damp is only a little bit wet.", win: "Damp, wet, soaked." },
    { say: "Order these from weakest to strongest by yourself.", alt: [{ seq: "warm hot boiling", trap: "hot warm boiling" }, { seq: "tap hit smash", trap: "hit tap smash" }, { seq: "big huge gigantic", trap: "huge big gigantic" }] },
  ],
}));
