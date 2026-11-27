// Who, What, Where. Skill RL.K.1-1.
// Answering who, what and where questions about key details in a story. Answering from pictures or personal experience instead of the story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Who, What, Where",
  emoji: "🐻",
  premise: "After a story, good readers can say who was in it, what happened, and where it took place.",
  outro: "The story tells you who, what and where. Look back at the words.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Look back at the story. What do the words say?",
  tag: "answers_from_experience",
  rounds: [
    { say: "Read the story. Answer each question.", read: "A bear went to the woods. He ate a fish.", rows: [["Who?", "🐻 a bear"], ["Where?", "🌲 the woods"], ["What did he eat?", "🐟 a fish"]], extra: "🏠 a house|🍯 honey", trap: [2, "🍯 honey"], why: "Bears may like honey, but this story says he ate a fish.", win: "A bear, in the woods, ate a fish." },
    { say: "Read this story. Answer each question.", read: "Mia went to the beach. She made a sand castle.", rows: [["Who?", "👧 Mia"], ["Where?", "🏖️ the beach"], ["What did she make?", "🏰 a castle"]], extra: "🏫 school|🎂 a cake", trap: [1, "🏫 school"], why: "The story says Mia went to the beach.", win: "Mia, at the beach, made a castle." },
    { say: "Read and answer by yourself.", read: "A frog sat on a log. It ate a bug.", rows: [["Who?", "🐸 a frog"], ["Where?", "🪵 on a log"], ["What did it eat?", "🐛 a bug"]], extra: "🪷 on a pad|🐟 a fish", trap: [1, "🪷 on a pad"] },
  ],
}));
