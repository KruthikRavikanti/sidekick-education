// Measure Words. Skill K.MD.A.1-1.
// Naming measurable attributes: the child matches a way of measuring to length, height or weight. The catch-all word big is offered as the tempting slip.
Sidekick.game(Sidekick.play({
  title: "Measure Words",
  emoji: "📏",
  premise: "Big is not the only measuring word. Give each thing the word that tells what kind of big we mean.",
  outro: "Length, height and weight each tell a different way to measure.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "End to end is length. Bottom to head is height. How hard to lift is weight.",
  tag: "uses_big_for_everything",
  rounds: [
    { say: "Drag the measuring word that fits each one.", rows: [["🪢 from end to end", "length"], ["🍉 on a scale", "weight"]], extra: "big", trap: [0, "big"], why: "Big does not say which kind of big. End to end is its length.", win: "End to end is length. On a scale is weight." },
    { say: "Three things to measure. Which word fits each?", rows: [["🦒 from feet to head", "height"], ["🧱 when you lift it", "weight"], ["🐍 from nose to tail", "length"]], extra: "big", trap: [0, "big"], why: "Feet to head tells how tall. That is height.", win: "Height, weight and length." },
    { say: "Match these by yourself.", rows: [["🏢 from ground to roof", "height"], ["🚂 from front to back", "length"], ["🎒 when you carry it", "weight"]], extra: "big color", trap: [2, "big"] },
  ],
}));
