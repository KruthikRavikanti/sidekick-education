// Source and Answer. Skill W.2.8-1.
// Recalling information from experiences or gathering information from provided sources to answer a question. Answering off topic is the known slip.
Sidekick.game(Sidekick.play({
  title: "Source and Answer",
  emoji: "🔎",
  premise: "A research question needs the right source. Then the answer you write has to match the question.",
  outro: "Choose a source about your question, and give an answer that fits it.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "Does the source, and the answer, match what was asked?",
  tag: "answers_off_topic",
  rounds: [
    { say: "Pick the best source for each question.", rows: [["Why do volcanoes erupt?", "a book about volcanoes"], ["What did our class do on Friday?", "my own memory"]], extra: "a book about cats|", trap: [0, "a book about cats"], why: "A cat book will not explain volcanoes.", win: "The right source for each question." },
    { say: "The question is: Why do volcanoes erupt? Tap the answer that fits.", kind: "pick", read: "Magma is lighter than the rock around it, so it rises. Gas in the magma pushes it out.", yes: "Magma rises and gas pushes it out.|", no: "Volcanoes are very tall.|Lava is hot.|Rocks can be gray.", trap: "Lava is hot.", why: "That is true, but it does not answer WHY they erupt.", win: "That answers the question." },
    { say: "Pick the best source for each question by yourself.", rows: [["How deep is the ocean?", "a book about oceans"], ["What games did I play at recess?", "my own memory"], ["What do owls eat?", "a website about owls"]], extra: "a cookbook|", trap: [2, "a cookbook"] },
  ],
}));
