// Topic Word Meanings. Skill RI.2.4-1.
// Determining the meaning of words and phrases in a text relevant to a grade 2 topic. Using a different meaning of the word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Topic Word Meanings",
  emoji: "🌸",
  premise: "Science and social studies texts use special words. The text itself usually explains them.",
  outro: "Find the meaning of a topic word in the words around it.",
  scene: "meadow",
  kind: "pick",
  hint: "Read right after the word. The meaning is often there.",
  tag: "uses_another_meaning",
  rounds: [
    { say: "Read the sentence. What is nectar?", read: "Bees collect nectar, a sweet liquid found in flowers.", yes: "a sweet liquid in flowers|", no: "a kind of bee|a part of a hive|a yellow dust", trap: "a yellow dust", why: "That is pollen. Read after the comma.", win: "Nectar is a sweet liquid in flowers." },
    { say: "Read the sentence. What does bank mean here?", read: "The otter slid down the muddy bank into the river.", yes: "the side of a river|", no: "a place for money|a piggy bank|a kind of boat", trap: "a place for money", why: "Bank can mean that, but not here. It is muddy and by a river.", win: "Here, a bank is the side of a river." },
    { say: "Read the sentence by yourself.", alt: [{ say: "What does migrate mean?", read: "Geese migrate, or travel far, to warmer places each fall.", yes: "travel far|", no: "build a nest|lay eggs|eat seeds|swim fast|make noise", trap: "build a nest" }, { say: "What does trunk mean here?", read: "The elephant lifted the log with its long trunk.", yes: "a long nose|", no: "a box for clothes|part of a tree|the back of a car|a big ear|a strong leg", trap: "part of a tree" }] },
  ],
}));
