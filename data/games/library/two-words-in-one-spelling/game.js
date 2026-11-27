// Two Words in One Spelling. Skill L.8.4-3.
// Consulting reference materials to find pronunciation, precise meaning or part of speech. Choosing an entry that does not fit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Words in One Spelling",
  emoji: "📚",
  premise: "Some spellings hide two different words. REFuse is trash. reFUSE is to say no. A dictionary lists both.",
  outro: "Use the sentence to pick the right entry, part of speech and pronunciation.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is the word a thing or an action here?",
  tag: "unfitting_entry",
  rounds: [
    { say: "Which entry fits each sentence?", rows: [["The truck collects REFUSE on Mondays.", "noun: trash"], ["I REFUSE to give up.", "verb: to say no"]], extra: "verb: to melt again|", trap: [0, "verb: to say no"], why: "A truck collects a thing. Here refuse is a noun.", win: "Trash, and to say no." },
    { say: "Which entry fits each sentence?", rows: [["The nomads crossed the DESERT.", "noun: dry land"], ["He would never DESERT his friends.", "verb: to abandon"]], extra: "noun: a sweet dish|", trap: [1, "noun: a sweet dish"], why: "That is dessert, with two s’s. Desert as a verb means to abandon.", win: "Dry land, and to abandon." },
    { say: "Match these by yourself.", rows: [["She will PERMIT one question.", "verb: to allow"], ["You need a PERMIT to camp.", "noun: a written license"]], extra: "verb: to camp|noun: a question", trap: [0, "noun: a written license"] },
  ],
}));
