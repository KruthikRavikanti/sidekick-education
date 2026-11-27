// Words That Do Not Play Fair. Skill RF.3.3-4.
// Reading grade-appropriate irregularly spelled words. Sounding them out letter by letter is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words That Do Not Play Fair",
  emoji: "🏝️",
  premise: "Though, through, enough and island do not sound the way they are spelled. Know them on sight.",
  outro: "Irregular words must be recognized whole and matched to the sentence.",
  scene: "ocean",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Read the sentence with each word. Which one makes sense?",
  tag: "sounds_out_irregular_words",
  rounds: [
    { say: "Drop each word where it fits.", rows: [["We walked ___ the tunnel.", "through"], ["It was cold, ___ the sun was out.", "though"]], extra: "tough", trap: [0, "though"], why: "Though means but. You walk through a tunnel.", win: "Through and though." },
    { say: "Drop these words where they fit.", rows: [["We sailed to a small ___.", "island"], ["Do we have ___ food?", "enough"], ["Today is a ___ day.", "special"]], trap: [1, "special"], why: "Enough means as much as you need.", win: "Island, enough and special." },
    { say: "Drop these in by yourself.", rows: [["She ___ the ball over the fence.", "threw"], ["The answer was ___.", "obvious"], ["I ___ I could fly.", "thought"]], extra: "through though", trap: [0, "through"] },
  ],
}));
