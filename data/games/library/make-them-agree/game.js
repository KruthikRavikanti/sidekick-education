// Make Them Agree. Skill L.3.1-4.
// Ensuring subject-verb and pronoun-antecedent agreement. Writing the dogs runs is the known slip.
Sidekick.game(Sidekick.play({
  title: "Make Them Agree",
  emoji: "🤝",
  premise: "A subject and its verb have to match. One dog runs. Two dogs run.",
  outro: "One thing takes a verb with s. More than one takes a verb without it.",
  scene: "field",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Is the subject one, or more than one?",
  tag: "subject_verb_mismatch",
  rounds: [
    { say: "Drop in the verb that matches.", rows: [["The dogs ___ fast.", "run"], ["The dog ___ fast.", "runs"]], extra: "running", trap: [0, "runs"], why: "Dogs is more than one. More than one takes run.", win: "Dogs run. The dog runs." },
    { say: "Drop in these verbs.", rows: [["My friends ___ soccer.", "play"], ["My sister ___ chess.", "plays"], ["The birds ___ at dawn.", "sing"]], extra: "sings", trap: [2, "sings"], why: "Birds is more than one. They sing.", win: "Play, plays and sing." },
    { say: "Now match each pronoun to who it stands for.", rows: [["Maria lost ___ hat.", "her"], ["The boys rode ___ bikes.", "their"], ["The tree lost ___ leaves.", "its"]], extra: "his", trap: [1, "his"] },
  ],
}));
