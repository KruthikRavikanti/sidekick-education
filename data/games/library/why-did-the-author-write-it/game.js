// Why Did the Author Write It?. Skill RI.2.6-1.
// Identifying the main purpose of a text, including what the author wants to answer, explain or describe. Saying the purpose is just to be read is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why Did the Author Write It?",
  emoji: "✍️",
  premise: "Every author writes for a reason: to answer a question, to explain how something works, or to describe something.",
  outro: "The main purpose is what the author wants to answer, explain or describe.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "What does the author want you to know when you finish?",
  tag: "vague_purpose",
  rounds: [
    { say: "Match each text to its purpose.", rows: [["How Bees Make Honey", "to explain a process"], ["What a Desert Looks Like", "to describe a place"]], extra: "to be read|", trap: [0, "to be read"], why: "Every text is read. What does this one teach you?", win: "One explains, one describes." },
    { say: "Match these texts.", rows: [["Why Do Leaves Change Color?", "to answer a question"], ["How to Build a Birdhouse", "to explain the steps"], ["All About Sea Otters", "to describe an animal"]], trap: [0, "to describe an animal"], why: "The title asks why. The text is written to answer it.", win: "Answer, explain, describe." },
    { say: "Match these by yourself.", rows: [["How a Seed Becomes a Tree", "to explain a process"], ["Where Do Whales Go in Winter?", "to answer a question"]], extra: "to be read|to fill a page", trap: [1, "to be read"] },
  ],
}));
