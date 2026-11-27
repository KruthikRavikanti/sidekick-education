// Tools for Writers. Skill W.6.6-1.
// Using technology to produce and publish writing and to collaborate, with sufficient keyboarding skill. Slow typing habits are the known slip.
Sidekick.game(Sidekick.play({
  title: "Tools for Writers",
  emoji: "⌨️",
  premise: "Technology helps you draft, share and publish. Good typing habits let your fingers keep up with your ideas.",
  outro: "Use the right tool for each stage, and type with all fingers from the home row.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Which tool is made for that job?",
  tag: "slow_typing_habits",
  rounds: [
    { say: "Match each job to the best tool.", rows: [["drafting a long report", "word processor"], ["getting comments from a partner", "shared document"], ["showing it to the world", "class blog"]], trap: [1, "word processor"], why: "A partner needs to see and comment. A shared document allows that.", win: "Draft, share, publish." },
    { say: "Which habits help you type three pages in a sitting?", kind: "sort", fs: 4.6, bins: "Helps|Slows you down", items: ["fingers resting on the home row|eyes on the screen|sitting up with wrists level", "hunting for each key with one finger|stopping to fix every typo right away"], trap: ["stopping to fix every typo right away", 0], why: "Fixing every slip as you go breaks your flow. Finish the thought first.", win: "Home row, eyes up, keep going." },
    { say: "Match these by yourself.", rows: [["checking a word’s spelling", "spell checker"], ["working on one file with a group", "shared document"], ["saving so nothing is lost", "cloud storage"]], extra: "calculator|", trap: [1, "spell checker"] },
  ],
}));
