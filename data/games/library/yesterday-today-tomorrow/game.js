// Yesterday, Today, Tomorrow. Skill L.1.1-5.
// Using verbs to convey a sense of past, present and future. Mixing tenses in one sentence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Yesterday, Today, Tomorrow",
  emoji: "📅",
  premise: "Verbs change to show when something happens: before now, right now, or later on.",
  outro: "Past verbs often end in -ed. Future verbs use will.",
  scene: "sky",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Look at the time word. Is it over, happening now, or still to come?",
  tag: "mixes_tenses",
  rounds: [
    { say: "Drop in the verb that matches the time.", rows: [["Yesterday I ___ to school.", "walked"], ["Today I ___ to school.", "walk"], ["Tomorrow I ___ to school.", "will walk"]], trap: [0, "walk"], why: "Yesterday is over. The verb needs -ed.", win: "Walked, walk, will walk." },
    { say: "Drop in these verbs.", rows: [["Last night we ___ a game.", "played"], ["Right now we ___ a game.", "play"], ["Next week we ___ a game.", "will play"]], trap: [2, "played"], why: "Next week has not happened yet. Use will.", win: "Played, play, will play." },
    { say: "Drop in the verbs by yourself.", rows: [["Yesterday Dad ___ soup.", "cooked"], ["Tomorrow Dad ___ rice.", "will cook"], ["Right now Dad ___ eggs.", "cooks"]], trap: [0, "will cook"] },
  ],
}));
