// Toss, Throw, Hurl. Skill L.2.5-2.
// Distinguishing shades of meaning among closely related verbs and adjectives. Thinking they mean exactly the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "Toss, Throw, Hurl",
  emoji: "⚾",
  premise: "Toss, throw and hurl all mean to send something through the air, but each one is stronger than the last.",
  outro: "Words with close meanings differ in strength. Pick the one that fits best.",
  scene: "field",
  kind: "row",
  hint: "Act each one out. Which is the gentlest? Which is the strongest?",
  tag: "treats_words_as_same",
  rounds: [
    { say: "Put the words in order from gentlest to strongest.", seq: "toss throw hurl", trap: "throw toss hurl", why: "A toss is a light, easy throw.", win: "Toss, throw, hurl." },
    { say: "Put these in order from a little to a lot.", seq: "cool cold freezing", trap: "cold cool freezing", why: "Cool is only a little bit cold.", win: "Cool, cold, freezing." },
    { say: "Order these from weakest to strongest by yourself.", alt: [{ seq: "glad happy thrilled", trap: "happy glad thrilled" }, { seq: "nibble eat gobble", trap: "eat nibble gobble" }, { seq: "upset angry furious", trap: "angry upset furious" }] },
  ],
}));
