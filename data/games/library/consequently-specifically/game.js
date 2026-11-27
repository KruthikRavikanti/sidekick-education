// Consequently, Specifically. Skill W.5.1-3.
// Linking opinion and reasons using words, phrases and clauses. Using few transitions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Consequently, Specifically",
  emoji: "🔗",
  premise: "Linking words show how ideas relate. Consequently shows a result. Specifically zooms in on an example.",
  outro: "Link opinion and reasons with words, phrases and clauses like consequently and specifically.",
  scene: "desk",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Is the next idea a result, an example, or an addition?",
  tag: "few_transitions",
  rounds: [
    { say: "Drop in the linking word that fits.", rows: [["Students need sleep. ___, schools should start later.", "Consequently"], ["Sleep helps learning. ___, it improves memory.", "Specifically"]], extra: "Nevertheless", trap: [0, "Nevertheless"], why: "Nevertheless signals a contrast. Here the second idea is a result.", win: "A result, and a specific example." },
    { say: "Drop in these linking words.", rows: [["Gardens cost little. ___, they pay for themselves.", "In fact"], ["Kids grow food. ___, they eat better.", "As a result"], ["Gardens teach science. ___, they teach patience.", "Moreover"]], trap: [1, "Moreover"], why: "Eating better is a result of growing food.", win: "In fact, as a result, moreover." },
    { say: "Drop these in by yourself.", rows: [["Reading builds skills. ___, it grows vocabulary.", "Specifically"], ["Readers know more words. ___, they write better.", "Consequently"], ["Reading is useful. ___, it is fun.", "In addition"]], extra: "However", trap: [1, "However"] },
  ],
}));
