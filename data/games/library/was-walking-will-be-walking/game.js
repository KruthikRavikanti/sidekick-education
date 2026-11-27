// Was Walking, Will Be Walking. Skill L.4.1-2.
// Forming and using the progressive verb tenses. Mixing tenses is the known slip.
Sidekick.game(Sidekick.play({
  title: "Was Walking, Will Be Walking",
  emoji: "🌧️",
  premise: "Progressive verbs show an action that keeps going for a while: I was walking, I am walking, I will be walking.",
  outro: "Progressive tenses use a form of be plus an -ing verb.",
  scene: "sky",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Was it going on in the past, now, or will it be going on later?",
  tag: "mixes_tenses",
  rounds: [
    { say: "Drop in the verb that fits.", rows: [["I ___ when it started to rain.", "was walking"], ["Right now I ___ to school.", "am walking"]], extra: "will be walking|", trap: [0, "am walking"], why: "It started to rain in the past. The action was going on then.", win: "Was walking, am walking." },
    { say: "Drop in these verbs.", rows: [["At noon tomorrow, we ___ lunch.", "will be eating"], ["Last night she ___ a book.", "was reading"], ["Listen! The birds ___.", "are singing"]], trap: [0, "was reading"], why: "Tomorrow is the future. Use will be with -ing.", win: "Future, past and present progressive." },
    { say: "Drop these in by yourself.", rows: [["They ___ soccer when the bell rang.", "were playing"], ["Next week I ___ my grandma.", "will be visiting"], ["Shh, the baby ___.", "is sleeping"]], extra: "are playing|", trap: [0, "are playing"] },
  ],
}));
