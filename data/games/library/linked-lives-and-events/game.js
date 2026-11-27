// Linked Lives and Events. Skill RI.5.3-1.
// Explaining the relationships or interactions between two or more individuals, events or ideas in a text. Describing each alone is the known slip.
Sidekick.game(Sidekick.play({
  title: "Linked Lives and Events",
  emoji: "🤝",
  premise: "Nonfiction is full of relationships: one person builds on another’s work, one event leads to the next.",
  outro: "Explain how people, events or ideas in a text relate to and affect each other.",
  scene: "city",
  kind: "fill",
  cast: "",
  hint: "How did one affect the other?",
  tag: "describes_each_alone",
  rounds: [
    { say: "Read the text. How are the two inventors connected?", read: "Marconi sent the first radio signal across the ocean. Years later, Farnsworth used the same kind of waves to send moving pictures, creating television.", rows: [["Marconi", "sent radio signals first"], ["Farnsworth", "built on that to make TV"], ["The connection", "one invention led to the next"]], trap: [2, "sent radio signals first"], why: "That describes Marconi alone. How do the two relate?", win: "One built on the other." },
    { say: "How are the two events connected?", read: "In 1869 a railroad linked both coasts. Within ten years, towns sprang up all along its route.", rows: [["The railroad", "linked the coasts"], ["The towns", "grew along the route"], ["The connection", "the railroad caused the growth"]], trap: [2, "grew along the route"], why: "That is the second event alone. What links them?", win: "A cause and its effect." },
    { say: "How are these two ideas connected? Match by yourself.", read: "Plants release oxygen. Animals breathe oxygen and release carbon dioxide, which plants use.", rows: [["Plants", "give off oxygen"], ["The connection", "each supplies what the other needs"]], extra: "plants are green|animals move", trap: [1, "plants are green"] },
  ],
}));
