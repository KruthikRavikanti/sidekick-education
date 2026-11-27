// Ant Book Answers. Skill RI.1.1-1.
// Answering questions about key details in an informational text. Answering from prior knowledge is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ant Book Answers",
  emoji: "🐜",
  premise: "A book about ants has the answers inside it. Find each answer in what the book says.",
  outro: "Answer with details from the text, even if you already know something else.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "Find the sentence in the book that tells you.",
  tag: "answers_from_prior_knowledge",
  rounds: [
    { say: "Read the page. Answer from the book.", read: "Ants carry bits of leaf back to the nest. They can lift things much heavier than they are.", rows: [["What do the ants carry?", "bits of leaf"], ["Where do they take it?", "to the nest"]], extra: "sugar|to a picnic", trap: [0, "sugar"], why: "Ants may like sugar, but this book says bits of leaf.", win: "Bits of leaf, back to the nest." },
    { say: "Read this page. Answer from the book.", read: "Sea turtles lay eggs on the beach. The babies crawl to the sea when they hatch.", rows: [["Where are the eggs laid?", "on the beach"], ["Where do the babies go?", "to the sea"]], extra: "in a nest in a tree|to a pond", trap: [0, "in a nest in a tree"], why: "Birds nest in trees. This book says turtles lay eggs on the beach.", win: "On the beach, then to the sea." },
    { say: "Read and answer by yourself.", read: "Pandas eat bamboo for most of the day. They sit down to eat and hold it with their paws.", rows: [["What do pandas eat?", "bamboo"], ["How do they hold it?", "with their paws"], ["How long do they eat?", "most of the day"]], extra: "fish|", trap: [0, "fish"] },
  ],
}));
