// Catch and Correct. Skill RF.5.4-3.
// Using context to confirm or self-correct word recognition and understanding, rereading as necessary. Not rereading is the known slip.
Sidekick.game(Sidekick.play({
  title: "Catch and Correct",
  emoji: "🎣",
  premise: "If a sentence comes out strange, do not shrug and move on. Go back, look again, and make it make sense.",
  outro: "Reread when meaning breaks down, and use the sentence to correct the word.",
  scene: "ocean",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Which word makes the whole sentence make sense?",
  tag: "does_not_reread",
  rounds: [
    { say: "A reader said each sentence oddly. Pick the word that makes sense.", rows: [["The scientist made an important ___.", "discovery"], ["She ___ the letter into the mailbox.", "slipped"]], extra: "delivery slapped", trap: [0, "delivery"], why: "A scientist finds things out. That is a discovery.", win: "The sentence shows which word fits." },
    { say: "Pick the words that make sense.", rows: [["The soldiers marched across the ___.", "desert"], ["Please ___ the door behind you.", "close"], ["He read the story ___.", "aloud"]], extra: "dessert allowed", trap: [2, "allowed"], why: "Allowed means permitted. He read it out loud: aloud.", win: "Three careful fixes." },
    { say: "Pick the words by yourself.", rows: [["The judge made a fair ___.", "decision"], ["We ___ the invitation gladly.", "accepted"], ["The medicine had a strange ___.", "effect"]], extra: "division excepted", trap: [1, "excepted"] },
  ],
}));
