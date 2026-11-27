// Reread and Repair. Skill RF.4.4-3.
// Using context to confirm or self-correct word recognition and understanding, rereading as necessary. Reading on after an error is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reread and Repair",
  emoji: "🔧",
  premise: "Every reader slips on a word now and then. What matters is noticing, going back, and fixing it.",
  outro: "When a sentence stops making sense: stop, reread, try the word again, and check that it fits.",
  scene: "desk",
  kind: "row",
  hint: "What is the very first thing to do when it stops making sense?",
  tag: "keeps_going_after_errors",
  rounds: [
    { say: "A sentence stops making sense. Put the fix-up steps in order.", seq: "Stop reading.|Reread the sentence.|Try the tricky word again.|Check that it makes sense now.", trap: "Reread the sentence.|Stop reading.|Try the tricky word again.|Check that it makes sense now.", why: "First you have to stop and notice.", win: "Stop, reread, retry, check." },
    { say: "Pick the word that makes each sentence make sense.", kind: "fill", fs: 5.4, cast: "", rows: [["The knight wore heavy ___.", "armor"], ["She gave an ___ in the play.", "amazing performance"]], extra: "arbor|", trap: [0, "arbor"], why: "An arbor is a garden arch. A knight wears armor.", win: "The meaning tells you which word." },
    { say: "Pick the words by yourself.", kind: "fill", fs: 5.4, cast: "", rows: [["The ship sailed through the ___.", "canal"], ["We heard the ___ of thunder.", "rumble"], ["He ___ the letter and mailed it.", "sealed"]], extra: "camel ramble", trap: [0, "camel"] },
  ],
}));
