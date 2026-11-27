// Fact, Definition, Quotation. Skill W.6.2-2.
// Developing a topic with relevant facts, definitions, concrete details and quotations. Thin development is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fact, Definition, Quotation",
  emoji: "🧱",
  premise: "Strong informative writing is built from different materials: facts, definitions and the words of experts.",
  outro: "Develop a topic with facts, definitions, concrete details and quotations.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Is it a checkable fact, the meaning of a term, or someone’s exact words?",
  tag: "thin_development",
  rounds: [
    { say: "What kind of support is each sentence?", bins: "Fact|Definition|Quotation", items: ["A honeybee visits about 2,000 flowers a day.|", "Pollination is the moving of pollen between flowers.|", "“Bees are farm workers with wings,” says one grower.|"], trap: ["Pollination is the moving of pollen between flowers.", 0], why: "It tells what a word means. That is a definition.", win: "A number, a meaning, and exact words." },
    { say: "Sort these.", bins: "Fact|Definition|Quotation", items: ["Mount Everest is 8,849 meters tall.|", "Altitude means height above sea level.|", "“The summit felt like the moon,” one climber wrote.|"], trap: ["“The summit felt like the moon,” one climber wrote.", 0], why: "Quotation marks show someone’s exact words.", win: "One of each." },
    { say: "Sort these by yourself.", bins: "Fact|Definition|Quotation", items: ["The Nile is about 6,650 kilometers long.|", "A delta is land built up where a river meets the sea.|", "“The river is our road,” a boatman said.|"], trap: ["A delta is land built up where a river meets the sea.", 0] },
  ],
}));
