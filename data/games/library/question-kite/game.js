// Question Kite. Skill RL.K.1-2.
// Asking questions about key details in a story: questions are sorted by whether they are about the story. Asking unrelated questions is the known slip.
Sidekick.game(Sidekick.play({
  title: "Question Kite",
  emoji: "🪁",
  premise: "Good readers wonder about the story. A good question is about what is happening in the book.",
  outro: "Ask questions about the story: who, what, where, why and how.",
  scene: "sky",
  kind: "sort",
  hint: "Is the question about Mia and her kite?",
  tag: "asks_unrelated_questions",
  rounds: [
    { say: "Read the story. Which questions are about it?", read: "Mia lost her kite in a tree.", bins: "About the story|Not about it", items: ["Where is the kite?|How will Mia get it?", "What is for lunch?|Do you like dogs?"], trap: ["Do you like dogs?", 0], why: "There are no dogs in this story. Ask about Mia or the kite.", win: "Those questions fit the story." },
    { say: "Read this story. Sort the questions.", read: "Ben saw a big egg in the nest.", bins: "About the story|Not about it", items: ["What will hatch?|Who put the egg there?", "Can I have a snack?|Is it time to go?"], trap: ["Can I have a snack?", 0], why: "A snack is not part of this story. Ask about the egg.", win: "You asked about the story." },
    { say: "Sort these by yourself.", read: "A little boat sailed out in a storm.", bins: "About the story|Not about it", items: ["Will the boat be safe?|Who is in the boat?", "What color is my shirt?|Do fish like cake?"], trap: ["Do fish like cake?", 0] },
  ],
}));
