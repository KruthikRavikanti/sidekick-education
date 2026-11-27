// Facts, Definitions, Details. Skill W.3.2-2.
// Developing the topic with facts, definitions and details. Writing opinions instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Facts, Definitions, Details",
  emoji: "🧱",
  premise: "Build your topic with facts, definitions and details. Leave your own opinions out of it.",
  outro: "Develop a topic with facts, definitions and details, not opinions.",
  scene: "desk",
  kind: "sort",
  hint: "Does it tell what a word means, give a true fact, or say what someone thinks?",
  tag: "writes_opinions",
  rounds: [
    { say: "You are writing about deserts. Sort each sentence.", bins: "Fact|Definition|Opinion", items: ["Deserts get little rain.|", "A desert is a very dry place.|", "Deserts are boring.|"], trap: ["Deserts are boring.", 0], why: "Boring is what someone thinks. It cannot be checked.", win: "A fact, a definition and an opinion." },
    { say: "You are writing about magnets. Sort each sentence.", bins: "Fact|Definition|Opinion", items: ["Magnets pull on iron.|", "A pole is one end of a magnet.|", "Magnets are the coolest toy.|"], trap: ["A pole is one end of a magnet.", 0], why: "It tells what the word pole means. That is a definition.", win: "You sorted all three." },
    { say: "You are writing about frogs. Sort by yourself.", bins: "Fact|Definition|Opinion", items: ["Frogs lay eggs in water.|", "A tadpole is a young frog.|", "Frogs are slimy and gross.|Frogs are cute."], trap: ["Frogs are cute.", 0] },
  ],
}));
