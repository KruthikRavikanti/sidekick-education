// Answer Hunt. Skill W.1.8-1.
// Recalling information from experiences or gathering information from provided sources to answer a question. Giving an unrelated answer is the known slip.
Sidekick.game(Sidekick.play({
  title: "Answer Hunt",
  emoji: "🕵️",
  premise: "To answer a question, pick the right place to look. Then find the answer there.",
  outro: "Find the source that matches your question, then take your answer from it.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Which source is about the same thing as the question?",
  tag: "unrelated_answer",
  rounds: [
    { say: "Where should you look for each answer?", rows: [["What do plants need?", "📗 the plant book"], ["What did we do at recess?", "🧠 my own memory"], ["How do fish breathe?", "📘 the fish book"]], trap: [0, "📘 the fish book"], why: "The fish book is about fish. The plant book tells about plants.", win: "The right source for each question." },
    { say: "The plant book says this. Tap what plants need.", kind: "pick", read: "Plants need sun, water and air to grow.", yes: "☀️ sun|💧 water|🌬️ air", no: "🍬 candy|🧸 toys|👟 shoes", trap: "🍬 candy", why: "The book does not say candy. Look at the sentence again.", win: "Sun, water and air." },
    { say: "Match each question to its source by yourself.", rows: [["How big is a whale?", "📘 the whale book"], ["What did I eat today?", "🧠 my own memory"], ["How do bees make honey?", "📙 the bee book"]], extra: "📕 the truck book|", trap: [0, "📕 the truck book"] },
  ],
}));
