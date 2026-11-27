// How Sure Are You?. Skill L.3.5-3.
// Distinguishing shades of meaning among related words that describe states of mind or degrees of certainty. Thinking they mean the same is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Sure Are You?",
  emoji: "🔮",
  premise: "Suspected, believed and knew all describe a state of mind, but each one is more certain than the last.",
  outro: "Related words can differ in degree: from a little sure to completely sure.",
  scene: "night",
  kind: "row",
  hint: "Which word shows the least certainty? Which shows the most?",
  tag: "treats_words_as_same",
  rounds: [
    { say: "Put the words in order from least sure to most sure.", seq: "suspected believed knew", trap: "believed suspected knew", why: "To suspect is only to have a hunch. It is the least sure.", win: "Suspected, believed, knew." },
    { say: "Put these in order from least sure to most sure.", seq: "wondered|thought|was certain", trap: "thought|wondered|was certain", why: "Wondering is just asking yourself. It is the least sure.", win: "Wondered, thought, was certain." },
    { say: "Order these by yourself, from least to most.", alt: [{ seq: "guessed|believed|was positive", trap: "believed|guessed|was positive" }, { seq: "doubted|hoped|knew", trap: "hoped|doubted|knew" }] },
  ],
}));
