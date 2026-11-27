// Build It With Facts. Skill W.7.2-2.
// Developing a topic with relevant facts, definitions, details and quotations. Thin or off-topic development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Build It With Facts",
  emoji: "🧱",
  premise: "An explanation grows strong when every fact and quotation is about the topic. A fun fact from elsewhere is just clutter.",
  outro: "Develop a topic with relevant facts, details and quotations.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does this help explain THIS topic?",
  tag: "thin_development",
  rounds: [
    { say: "Topic: how honeybees make honey. Which details are relevant?", bins: "Relevant|Not relevant", items: ["Bees carry nectar back in a special stomach.|“They fan it with their wings to dry it,” a beekeeper says.", "Wasps can sting many times.|Bears have thick fur."], trap: ["Wasps can sting many times.", 0], why: "Wasps are a different insect. The topic is honey making.", win: "Keep what explains the topic." },
    { say: "Topic: why the Titanic sank. Sort the details.", bins: "Relevant|Not relevant", items: ["The hull struck an iceberg at night.|“The steel plates buckled,” one engineer wrote.", "The ship had a swimming pool.|Icebergs are made of fresh water."], trap: ["The ship had a swimming pool.", 0], why: "The pool did not cause the sinking.", win: "Relevant details explain the cause." },
    { say: "Topic: how vaccines work. Sort by yourself.", bins: "Relevant|Not relevant", items: ["A vaccine shows the body a harmless piece of a germ.|“The body remembers,” one doctor explains.", "Needles are made of steel.|Doctors wear white coats."], trap: ["Needles are made of steel.", 0] },
  ],
}));
