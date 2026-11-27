// Rule Breaker Words. Skill RF.2.3-6.
// Recognizing and reading grade-appropriate irregularly spelled words. Sounding out irregular words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rule Breaker Words",
  emoji: "🦹",
  premise: "Some words break the spelling rules. You have to know them by heart.",
  outro: "Words like people, friend and because are learned by sight.",
  scene: "city",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Which spelling have you seen in books?",
  tag: "sounds_out_irregular_words",
  rounds: [
    { say: "Drop in the word that is spelled the real way.", rows: [["My best ___ is Sam.", "friend"], ["Lots of ___ came.", "people"]], extra: "frend peepul", trap: [0, "frend"], why: "It sounds like frend, but there is an i before the e.", win: "Friend and people." },
    { say: "Drop in these words.", rows: [["I ___ not find my shoe.", "could"], ["I stayed in ___ it rained.", "because"], ["That is ___ soup for me.", "enough"]], extra: "cood enuf", trap: [2, "enuf"], why: "It sounds like enuf, but it ends with ough.", win: "Could, because and enough." },
    { say: "Drop in the words by yourself.", rows: [["We ___ go to the park.", "should"], ["She is my ___.", "friend"], ["Do you ___ the answer?", "know"]], extra: "shood no", trap: [2, "no"] },
  ],
}));
