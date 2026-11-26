// Seesaw Sort. Skill K.MD.A.2-2.
// Comparing weights: big but light things (a balloon, a giant teddy) sit beside small but heavy ones, so size alone gives the known slip.
Sidekick.game(Sidekick.play({
  title: "Seesaw Sort",
  emoji: "⚖️",
  premise: "Some things push the seesaw down and some barely move it. Sort them by weight, not by size.",
  outro: "Bigger does not always mean heavier.",
  scene: "meadow",
  kind: "sort",
  cast: "⚖️ 🌳 🛝 🌳",
  hint: "Think about lifting it. Would it be hard or easy to hold up?",
  tag: "bigger_means_heavier",
  rounds: [
    { say: "Sort each thing: heavy or light?", bins: "Heavy|Light", items: ["🪨 rock|🧱 brick", "🎈 big balloon|🪶 feather"], trap: ["🎈 big balloon", 0], why: "A balloon is big but full of air. It is light.", win: "Size did not trick you." },
    { say: "More things for the seesaw.", bins: "Heavy|Light", items: ["🎳 bowling ball|🔨 hammer", "🧸 big teddy|🍃 leaf|🫧 bubble"], trap: ["🧸 big teddy", 0], why: "The teddy is big but soft and stuffed with fluff. It is light.", win: "Heavy things can be small." },
    { say: "Sort these by yourself.", bins: "Heavy|Light", items: ["⚓ anchor|🪨 small rock|🧱 brick", "🛟 big pool float|🎈 giant balloon"], trap: ["🎈 giant balloon", 0] },
  ],
}));
