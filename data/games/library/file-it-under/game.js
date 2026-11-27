// File It Under. Skill W.8.2-1.
// Introducing a topic and organizing ideas and information into broader categories. Disorganized writing is the known slip.
Sidekick.game(Sidekick.play({
  title: "File It Under",
  emoji: "🗄️",
  premise: "Before writing, sort your notes into bigger categories. Each category becomes a section of the piece.",
  outro: "Organize ideas, concepts and information into broader categories.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Which heading would this note sit under?",
  tag: "disorganized",
  rounds: [
    { say: "Notes for a report on wind power. File each note.", bins: "How it works|Benefits|Challenges", items: ["blades spin a generator|", "no fuel to buy|makes no smoke", "calm days produce nothing|"], trap: ["calm days produce nothing", 1], why: "No power on calm days is a drawback, not a benefit.", win: "Three categories, three sections." },
    { say: "Notes for a report on volcanoes. File each note.", bins: "Causes|Effects|Safety", items: ["magma rises through cracks|", "ash can ground airplanes|lava buries roads", "follow evacuation routes|"], trap: ["ash can ground airplanes", 0], why: "Grounded planes are a result of an eruption.", win: "Causes, effects and safety." },
    { say: "Notes for a report on sleep. File each note by yourself.", bins: "Why we need it|What blocks it|How to improve it", items: ["the brain stores memories|", "bright screens at night|caffeine late in the day", "keep a regular bedtime|"], trap: ["bright screens at night", 2] },
  ],
}));
