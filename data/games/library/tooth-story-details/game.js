// Tooth Story Details. Skill RL.1.1-1.
// Answering questions about key details in a text. Answering from memory of a different story is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tooth Story Details",
  emoji: "🦷",
  premise: "The answers to questions about a story are in its details. Go back and find them.",
  outro: "Use key details from the story to answer questions.",
  scene: "night",
  kind: "fill",
  cast: "",
  hint: "Find the sentence in the story that tells you.",
  tag: "answers_from_another_story",
  rounds: [
    { say: "Read the story. Answer with details from it.", read: "Bella lost her tooth at school. She put it in a little box. That night she put it under her pillow.", rows: [["What did Bella lose?", "her tooth"], ["Where did it go at night?", "under her pillow"]], extra: "her shoe|in her desk", trap: [1, "in her desk"], why: "The story does not say desk. Read the last sentence.", win: "A tooth, under her pillow." },
    { say: "Read this story. Answer with details from it.", read: "Leo had a kite, but there was no wind. He ran fast down the hill. At last the kite went up.", rows: [["What was the problem?", "no wind"], ["How did Leo fix it?", "he ran fast"]], extra: "no string|he went home", trap: [0, "no string"], why: "The story says there was no wind.", win: "No wind, so Leo ran fast." },
    { say: "Read and answer by yourself.", read: "Nia could not find her cat. She looked under the bed and in the box. The cat was asleep in the wash basket.", rows: [["Who was lost?", "her cat"], ["Where was it?", "in the wash basket"]], extra: "in a tree|her dog", trap: [1, "in a tree"] },
  ],
}));
