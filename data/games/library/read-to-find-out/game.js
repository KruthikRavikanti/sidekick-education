// Read to Find Out. Skill RF.1.4-1.
// Reading grade-level text with purpose and understanding. Reading the words without being able to say what happened is the known slip.
Sidekick.game(Sidekick.play({
  title: "Read to Find Out",
  emoji: "🐾",
  premise: "Reading is more than saying words. Read the story so you can tell what happened.",
  outro: "Good readers think about what the words mean as they read.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Read the story again. Look for the answer in the words.",
  tag: "reads_without_understanding",
  rounds: [
    { say: "Read the story. Answer each question.", read: "Tom has a pet frog named Hop. Hop got out of his tank. Tom found him in a shoe.", rows: [["Who is Hop?", "a pet frog"], ["Where was Hop found?", "in a shoe"]], extra: "a pet dog|in the tank", trap: [1, "in the tank"], why: "Hop got out of the tank. Read where Tom found him.", win: "Hop the frog was in a shoe." },
    { say: "Read this story. Answer each question.", read: "Jen wanted to bake a cake. She had no eggs. Her friend Sam gave her two.", rows: [["What did Jen need?", "eggs"], ["Who helped her?", "Sam"]], extra: "milk|her mom", trap: [0, "milk"], why: "The story says she had no eggs.", win: "Sam gave Jen eggs." },
    { say: "Read and answer by yourself.", read: "A duck led her ducklings to the pond. One was too slow. The mother duck went back to get it.", rows: [["Where were they going?", "to the pond"], ["What was the problem?", "one was too slow"], ["Who fixed it?", "the mother duck"]], extra: "to the barn|", trap: [0, "to the barn"] },
  ],
}));
