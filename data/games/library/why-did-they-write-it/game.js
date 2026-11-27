// Why Did They Write It?. Skill RI.6.6-1.
// Determining an author’s point of view or purpose and how it is conveyed. Confusing the topic with the purpose is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why Did They Write It?",
  emoji: "✍️",
  premise: "The topic is what an article is about. The purpose is why the author wrote it: to inform, to persuade or to entertain.",
  outro: "Purpose is the author’s reason for writing. Word choices show it.",
  scene: "city",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is the author explaining, trying to change your mind, or amusing you?",
  tag: "topic_as_purpose",
  rounds: [
    { say: "What is the purpose of each passage?", rows: [["Our town must build a skate park now. Kids deserve a safe place.", "to persuade"], ["A skate park has ramps, rails and bowls of different depths.", "to inform"]], extra: "skate parks|", trap: [0, "skate parks"], why: "Skate parks is the topic. The purpose is why it was written.", win: "Must and deserve show persuasion." },
    { say: "What is the purpose of each passage?", rows: [["Wolves hunt in packs and share food.", "to inform"], ["The wolf sneezed, and the whole pack jumped like popcorn.", "to entertain"]], extra: "wolves|", trap: [1, "wolves"], why: "Wolves is the topic of both. One explains. One amuses.", win: "Same topic, different purposes." },
    { say: "Match these by yourself.", rows: [["Vote yes on the library plan. Our readers cannot wait.", "to persuade"], ["The library opens at nine and holds 40,000 books.", "to inform"]], extra: "libraries|to entertain", trap: [0, "libraries"] },
  ],
}));
