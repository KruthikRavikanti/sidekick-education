// Tense Time Machine. Skill L.3.1-3.
// Forming and using the simple verb tenses. Shifting tense in the middle of a paragraph is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tense Time Machine",
  emoji: "🕰️",
  premise: "A verb can travel in time. Past tells what already happened, present what happens now, and future what will happen.",
  outro: "Keep verbs in the same tense unless the time really changes.",
  scene: "night",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "When does it happen? Match the verb to that time.",
  tag: "shifts_tense",
  rounds: [
    { say: "Write walk in each tense.", rows: [["Past", "walked"], ["Present", "walk"], ["Future", "will walk"]], trap: [0, "walk"], why: "The past needs -ed: walked.", win: "Walked, walk, will walk." },
    { say: "This story is in the past. Keep every verb in the past.", rows: [["Yesterday we ___ to the lake.", "hiked"], ["We ___ a fire.", "built"], ["Then we ___ songs.", "sang"]], extra: "build sing", trap: [1, "build"], why: "The story happened yesterday. Build must change to built.", win: "Hiked, built, sang." },
    { say: "Drop in the verbs by yourself.", rows: [["Tomorrow she ___ her bike.", "will ride"], ["Last week she ___ it too.", "rode"], ["Every day she ___ it to school.", "rides"]], extra: "ride", trap: [1, "rides"] },
  ],
}));
