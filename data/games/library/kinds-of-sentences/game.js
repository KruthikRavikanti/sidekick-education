// Kinds of Sentences. Skill L.1.1-10.
// Producing statements, questions, commands and exclamations. Writing only statements is the known slip.
Sidekick.game(Sidekick.play({
  title: "Kinds of Sentences",
  emoji: "🎪",
  premise: "Sentences do different jobs. Some tell, some ask, and some give an order.",
  outro: "A statement tells. A question asks. A command tells someone to do something.",
  scene: "candy",
  kind: "sort",
  hint: "Is it telling, asking, or telling someone what to do?",
  tag: "only_statements",
  rounds: [
    { say: "What job does each sentence do?", bins: "Telling|Asking|Command", items: ["The dog is big.|", "Is the dog big?|", "Feed the dog.|"], trap: ["Feed the dog.", 0], why: "It tells someone to do something. That is a command.", win: "Telling, asking and a command." },
    { say: "Turn the telling sentence into a question. Build it.", kind: "row", read: "The dog is big.", seq: "Is the dog big?", trap: "the dog Is big?", why: "A question often starts with Is. Start with the capital letter.", win: "Is the dog big?" },
    { say: "Sort these by yourself.", bins: "Telling|Asking|Command", items: ["I like soup.|We have a cat.", "Where is my hat?|", "Shut the door.|Come here."], trap: ["Come here.", 0] },
  ],
}));
