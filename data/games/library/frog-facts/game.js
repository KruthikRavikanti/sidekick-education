// Frog Facts. Skill RI.K.1-1.
// Asking and answering questions about key details in an informational text. Answering from prior knowledge instead of the text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Frog Facts",
  emoji: "🐸",
  premise: "A fact book tells true things. The answers to questions about it are right there in the words.",
  outro: "Answer from what the book says, not from what you think you know.",
  scene: "meadow",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Look back at the page. What do the words say?",
  tag: "answers_from_prior_knowledge",
  rounds: [
    { say: "Read the page. Answer from the book.", read: "Frogs eat bugs. They catch them with a long tongue.", rows: [["What do frogs eat?", "🐛 bugs"], ["How do they catch them?", "👅 a long tongue"]], extra: "🍎 apples|🖐️ two hands", trap: [0, "🍎 apples"], why: "The book says frogs eat bugs.", win: "Bugs, with a long tongue." },
    { say: "Read this page. Answer from the book.", read: "Bats sleep in the day. They hang upside down in caves.", rows: [["When do bats sleep?", "☀️ in the day"], ["Where do they hang?", "🕳️ in caves"]], extra: "🌙 at night|🌳 in a nest", trap: [0, "🌙 at night"], why: "We sleep at night, but the book says bats sleep in the day.", win: "In the day, in caves." },
    { say: "Read and answer by yourself.", read: "Camels live in the desert. They can go many days with no water.", rows: [["Where do camels live?", "🏜️ the desert"], ["What can they go without?", "💧 water"]], extra: "🌊 the sea|🍞 food", trap: [1, "🍞 food"] },
  ],
}));
