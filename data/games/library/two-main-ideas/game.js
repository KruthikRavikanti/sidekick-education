// Two Main Ideas. Skill RI.5.2-1.
// Determining two or more main ideas of a text. Finding only one is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Main Ideas",
  emoji: "✌️",
  premise: "A longer article can make more than one big point. Find both, and tell them from the details.",
  outro: "A text can have two or more main ideas, each supported by details.",
  scene: "desk",
  kind: "pick",
  hint: "Which TWO statements are big points that details support?",
  tag: "finds_only_one",
  rounds: [
    { say: "Read the article. Tap its two main ideas.", read: "Honeybees pollinate a third of our food crops. Without them, apples, almonds and berries would be scarce. But bees are dying in huge numbers. Pesticides and lost wildflowers are two major causes.", yes: "Bees are vital to our food supply.|Bees are in serious decline.", no: "Almonds need bees.|Pesticides are a cause.", trap: "Almonds need bees.", why: "That is a detail supporting the first main idea.", win: "Two main ideas: bees matter, and bees are in trouble." },
    { say: "Read this article. Tap its two main ideas.", read: "The printing press made books cheap for the first time. Ordinary people could now afford them. As a result, far more people learned to read. New ideas spread across Europe in weeks instead of years.", yes: "The printing press made books affordable.|It helped ideas and reading spread widely.", no: "Books cost less.|Europe is large.", trap: "Books cost less.", why: "That restates part of one idea. Which are the two big points?", win: "Cheap books, and widespread ideas." },
    { say: "Tap the two main ideas by yourself.", read: "Exercise strengthens the heart and muscles. It lowers the risk of many diseases. Exercise also lifts mood. People who are active report less stress and better sleep.", yes: "Exercise benefits the body.|Exercise benefits the mind.", no: "Muscles get stronger.|People sleep better.|Stress is common.", trap: "Muscles get stronger." },
  ],
}));
