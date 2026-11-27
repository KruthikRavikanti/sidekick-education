// Two Frog Books. Skill RI.K.9-1.
// Identifying basic similarities and differences between two texts on the same topic. Talking about only one text is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Frog Books",
  emoji: "📚",
  premise: "Two books on the same topic share some facts. Each one also tells something the other does not.",
  outro: "To compare two books, find what both say and what only one says.",
  scene: "desk",
  kind: "sort",
  hint: "Is that fact in book 1, in book 2, or in both?",
  tag: "talks_about_one_text",
  rounds: [
    { say: "Read both books. Where is each fact?", read: "Book 1: Frogs live in ponds. They eat bugs. / Book 2: Frogs live in ponds. They lay eggs.", bins: "Both|Only book 1|Only book 2", items: ["Frogs live in ponds.|", "Frogs eat bugs.|", "Frogs lay eggs.|"], trap: ["Frogs live in ponds.", 1], why: "Look at book 2. It says frogs live in ponds too.", win: "One fact is shared. Two are different." },
    { say: "Read both books. Sort the facts.", read: "Book 1: Bees can fly. They make honey. / Book 2: Bees can fly. They can sting.", bins: "Both|Only book 1|Only book 2", items: ["Bees can fly.|", "Bees make honey.|", "Bees can sting.|"], trap: ["Bees can sting.", 0], why: "Only book 2 talks about stinging.", win: "You compared two books." },
    { say: "Sort these by yourself.", read: "Book 1: The sun is a star. It is very hot. / Book 2: The sun is a star. It gives us light.", bins: "Both|Only book 1|Only book 2", items: ["The sun is a star.|", "The sun is very hot.|", "The sun gives us light.|"], trap: ["The sun is a star.", 1] },
  ],
}));
