// Fill Out the Paragraph. Skill W.4.2-2.
// Developing the topic with facts, definitions, concrete details, quotations or other information and examples. Thin development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fill Out the Paragraph",
  emoji: "🦈",
  premise: "A thin paragraph just names a topic. A full one has a fact, a definition, an example, maybe even a quotation.",
  outro: "Develop a topic with facts, definitions, details, quotations and examples.",
  scene: "ocean",
  kind: "sort",
  hint: "Does it give a number or truth, tell what a word means, or show one case?",
  tag: "thin_development",
  rounds: [
    { say: "Sort each sentence by what it adds.", bins: "Fact|Definition|Example", items: ["Sharks have lived for 400 million years.|", "Cartilage is a tough, bendy tissue.|", "One example is the great white.|"], trap: ["Cartilage is a tough, bendy tissue.", 0], why: "It tells what the word cartilage means. That is a definition.", win: "A fact, a definition and an example." },
    { say: "Sort these sentences.", bins: "Fact|Definition|Quotation", items: ["A hive can hold 50,000 bees.|", "Pollination is moving pollen between flowers.|", "\"Without bees, we lose a third of our food,\" says Dr. Lee.|"], trap: ["\"Without bees, we lose a third of our food,\" says Dr. Lee.", 0], why: "Those are someone’s exact words in quotation marks.", win: "Three ways to develop a topic." },
    { say: "Sort these by yourself.", bins: "Fact|Definition|Example", items: ["Deserts cover a fifth of Earth.|", "An oasis is a place with water in a desert.|", "For instance, the camel stores fat in its hump.|"], trap: ["For instance, the camel stores fat in its hump.", 0] },
  ],
}));
