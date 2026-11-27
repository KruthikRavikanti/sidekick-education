// Corner Count. Skill K.G.B.4-1.
// Counting sides and corners: the child sorts shapes by number of sides. Counting one corner twice puts a triangle in the four box.
Sidekick.game(Sidekick.play({
  title: "Corner Count",
  emoji: "📐",
  premise: "Count the sides of each shape, touching each side just once. Then drop it in the right box.",
  outro: "Count each side and each corner once, and you know the shape.",
  scene: "paper",
  kind: "sort",
  fs: 7,
  cast: "",
  hint: "Put a finger on one corner to start. Stop when you come back to it.",
  tag: "counts_a_corner_twice",
  rounds: [
    { say: "How many sides? Sort each shape.", bins: "3 sides|4 sides", items: ["🔺 🔻 ▲", "🟦 ▬ 🔶"], trap: ["🔺", 1], why: "Touch each corner once. A triangle has 3.", win: "Threes and fours." },
    { say: "Now some shapes have 6 sides.", bins: "3 sides|4 sides|6 sides", items: ["🔺 ▲", "🟧 ▬", "⬢ ⬡"], trap: ["⬢", 1], why: "Count slowly all the way around: 6 sides.", win: "Three, four and six sides." },
    { say: "Sort these by yourself.", bins: "3 sides|4 sides|6 sides", items: ["🔻 ▲ △", "🟩 🔷 ▭", "⬢"], trap: ["🔻", 1] },
  ],
}));
