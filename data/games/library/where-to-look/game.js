// Where to Look. Skill W.K.8-1.
// Recalling information from experience or gathering it from provided sources to answer a question. Answering off topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "Where to Look",
  emoji: "🧭",
  premise: "To answer a question you have to know where to look: in a book, out the window, or in your own memory.",
  outro: "Pick the place that can really answer your question.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Which one is about the same thing as the question?",
  tag: "looks_off_topic",
  rounds: [
    { say: "Where can you find each answer?", rows: [["What do pandas eat?", "📗 a panda book"], ["What did I do at the park?", "🧠 my memory"]], extra: "📕 a truck book|", trap: [0, "📕 a truck book"], why: "A truck book will not tell about pandas.", win: "A panda book and your own memory." },
    { say: "Where can you find each answer?", rows: [["Is it raining now?", "🪟 look outside"], ["How do bees make honey?", "📙 a bee book"], ["What did I eat for lunch?", "🧠 my memory"]], extra: "📘 a train book|", trap: [1, "📘 a train book"], why: "A train book will not tell about bees.", win: "Outside, a bee book, and your memory." },
    { say: "Match these by yourself.", rows: [["Where do whales live?", "📘 a whale book"], ["What game did I play today?", "🧠 my memory"], ["Is the sun out?", "🪟 look outside"]], extra: "📗 a cake book|", trap: [0, "📗 a cake book"] },
  ],
}));
