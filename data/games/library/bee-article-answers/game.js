// Bee Article Answers. Skill RI.2.1-1.
// Answering questions about key details in an informational text. Answering from prior knowledge is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bee Article Answers",
  emoji: "🐝",
  premise: "An article gives real information. The answers to questions about it are in the text.",
  outro: "Answer with what the text says.",
  scene: "meadow",
  kind: "fill",
  cast: "",
  hint: "Find the sentence that answers the question.",
  tag: "answers_from_prior_knowledge",
  rounds: [
    { say: "Read the article. Answer from the text.", read: "Bees are important because they carry pollen from flower to flower. This helps plants make fruit and seeds.", rows: [["Why are bees important?", "they carry pollen"], ["What does that help plants make?", "fruit and seeds"]], extra: "they can sting|", trap: [0, "they can sting"], why: "Bees do sting, but the text gives a different reason.", win: "Pollen helps plants make fruit and seeds." },
    { say: "Read this article. Answer from the text.", read: "Camels store fat in their humps. Their bodies use the fat for energy when food is hard to find.", rows: [["What is in the hump?", "fat"], ["What is it used for?", "energy"]], extra: "water|", trap: [0, "water"], why: "Many people think it is water. The text says fat.", win: "Fat, for energy." },
    { say: "Read and answer by yourself.", read: "Bats find bugs in the dark by making high sounds. The sounds bounce back and tell them where things are.", rows: [["How do bats find bugs?", "by making high sounds"], ["What do the sounds do?", "bounce back"]], extra: "with sharp eyes|", trap: [0, "with sharp eyes"] },
  ],
}));
