// Fix-Up Reader. Skill RF.2.4-3.
// Using context to confirm or self-correct word recognition and understanding, rereading as necessary. Not noticing errors is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fix-Up Reader",
  emoji: "🐎",
  premise: "Good readers listen to themselves. When a sentence does not make sense, they go back and fix the word.",
  outro: "Notice when it does not make sense. Reread and correct the word.",
  scene: "field",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Read the sentence with each word. Which one makes sense?",
  tag: "does_not_notice_errors",
  rounds: [
    { say: "Pick the word that makes sense.", rows: [["The cowboy rode his ___ across the field.", "horse"], ["We live in a big ___.", "house"]], extra: "hose", trap: [0, "house"], why: "You cannot ride a house. Look at the letters again: h-o-r-s-e.", win: "Horse and house." },
    { say: "Pick the words that make sense.", rows: [["She wore a warm ___ in the snow.", "coat"], ["The ___ swam in the pond.", "duck"], ["I ___ my friend at the park.", "met"]], extra: "cat dock", trap: [0, "cat"], why: "You cannot wear a cat. Look at the middle of the word.", win: "Coat, duck and met." },
    { say: "Pick the words by yourself.", rows: [["The ___ shone in the night sky.", "moon"], ["I ate a ___ of soup.", "bowl"], ["He ___ the ball to me.", "threw"]], extra: "moan bell through", trap: [0, "moan"] },
  ],
}));
