// Two Ant Books. Skill RI.1.9-1.
// Identifying basic similarities in and differences between two texts on the same topic. Discussing only one text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Ant Books",
  emoji: "📗",
  premise: "Two books about ants say some of the same things. Each one also says something new.",
  outro: "Compare two texts: what do both say, and what does only one say?",
  scene: "desk",
  kind: "sort",
  hint: "Check both books for each fact.",
  tag: "discusses_one_text",
  rounds: [
    { say: "Read both books. Where is each fact?", read: "Book 1: Ants live in nests. Ants have six legs. / Book 2: Ants live in nests. Some ants can bite.", bins: "Both|Only book 1|Only book 2", items: ["Ants live in nests.|", "Ants have six legs.|", "Some ants can bite.|"], trap: ["Ants live in nests.", 1], why: "Book 2 says ants live in nests too.", win: "One fact in both. One in each." },
    { say: "Read both books. Sort the facts.", read: "Book 1: The moon goes around Earth. It has no air. / Book 2: The moon goes around Earth. People have walked on it.", bins: "Both|Only book 1|Only book 2", items: ["The moon goes around Earth.|", "The moon has no air.|", "People have walked on it.|"], trap: ["People have walked on it.", 0], why: "Only book 2 tells about people walking on the moon.", win: "You compared the two books." },
    { say: "Sort these by yourself.", read: "Book 1: Sharks are fish. Sharks have many teeth. / Book 2: Sharks are fish. Sharks never stop swimming.", bins: "Both|Only book 1|Only book 2", items: ["Sharks are fish.|", "Sharks have many teeth.|", "Sharks never stop swimming.|"], trap: ["Sharks are fish.", 1] },
  ],
}));
