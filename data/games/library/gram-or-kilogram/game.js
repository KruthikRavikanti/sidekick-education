// Gram or Kilogram?. Skill 3.MD.A.2-1.
// Estimating masses and liquid volumes: objects are sorted by the sensible unit. Having no feel for how heavy a kilogram is shows up as heavy things in the gram bin.
Sidekick.game(Sidekick.play({
  title: "Gram or Kilogram?",
  emoji: "🏋️",
  premise: "Light things are weighed in grams and heavy things in kilograms. Liquids are measured in liters.",
  outro: "Grams for light things, kilograms for heavy things, liters for liquids.",
  scene: "kitchen",
  kind: "sort",
  cast: "",
  hint: "A paper clip is about 1 gram. A big book is about 1 kilogram.",
  tag: "no_sense_of_unit_size",
  rounds: [
    { say: "About how heavy is each thing?", bins: "About 1 gram|About 1 kilogram", items: ["📎 paper clip|💵 dollar bill", "🍍 pineapple|📘 big textbook"], trap: ["📎 paper clip", 1], why: "A paper clip is very light. It is about 1 gram.", win: "Light things are grams." },
    { say: "Which unit would you use to measure it?", bins: "Grams|Kilograms|Liters", items: ["📎 paper clip|🍓 strawberry", "🐕 dog|🧒 child", "🛁 bath water|⛽ gas in a car"], trap: ["🐕 dog", 0], why: "A dog is heavy. It is weighed in kilograms.", win: "Grams, kilograms and liters." },
    { say: "Sort these by yourself.", bins: "Grams|Kilograms|Liters", items: ["🪙 coin|✉️ letter|🍬 candy", "🚲 bike|🍉 watermelon", "🪣 bucket of water|🥤 jug of juice"], trap: ["🚲 bike", 0] },
  ],
}));
