// Desert or Dessert?. Skill RF.3.4-3.
// Using context to confirm or self-correct word recognition, rereading as necessary. Not noticing errors that change meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Desert or Dessert?",
  emoji: "🏜️",
  premise: "Some words look almost alike but mean very different things. If the sentence stops making sense, look again.",
  outro: "When meaning breaks down, reread and check the word against the sentence.",
  scene: "sand",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Read the sentence with each word. Which meaning fits?",
  tag: "does_not_notice_meaning_errors",
  rounds: [
    { say: "Drop each word into the sentence where it makes sense.", rows: [["Camels walk across the hot ___.", "desert"], ["We had cake for ___.", "dessert"]], extra: "dress", trap: [0, "dessert"], why: "Camels do not walk across cake. One s is the dry, sandy place.", win: "Desert and dessert." },
    { say: "Drop these in where they make sense.", rows: [["The king sat on his ___.", "throne"], ["She had ___ the ball.", "thrown"], ["We ___ the park every day.", "pass"]], extra: "past", trap: [0, "thrown"], why: "A king sits on a throne, a special chair.", win: "Throne, thrown and pass." },
    { say: "Drop these in by yourself.", rows: [["Please be ___ in the library.", "quiet"], ["I am ___ sure I locked it.", "quite"], ["The dog ___ its bone.", "lost"]], extra: "quit loose", trap: [0, "quite"] },
  ],
}));
