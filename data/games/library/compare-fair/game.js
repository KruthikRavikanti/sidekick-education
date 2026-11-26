// Compare Fair. Skill K.MD.A.2-3.
// Using comparison words: the child completes a sentence comparing two things and reads it back. Each right word sits beside its opposite.
Sidekick.game(Sidekick.play({
  title: "Compare Fair",
  emoji: "🎪",
  premise: "At the fair, everything gets compared. Drop in the word that tells how the first thing compares to the second.",
  outro: "Longer, shorter, heavier, lighter: each word has an opposite.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "Read the sentence with your word in it. Is it true?",
  tag: "mixes_opposite_words",
  rounds: [
    { say: "Drop in the word that makes each sentence true.", rows: [["🐍 snake is ___ than 🐛 worm", "longer"], ["🪶 feather is ___ than 🧱 brick", "lighter"]], extra: "shorter heavier", trap: [0, "shorter"], why: "The snake reaches farther. It is longer.", win: "Longer and lighter." },
    { say: "Compare these.", rows: [["🐘 elephant is ___ than 🐭 mouse", "heavier"], ["✏️ pencil is ___ than 🧹 broom", "shorter"]], extra: "lighter longer", trap: [1, "longer"], why: "The broom reaches farther. The pencil is shorter.", win: "Heavier and shorter." },
    { say: "Finish these by yourself.", rows: [["🚌 bus is ___ than 🚲 bike", "longer"], ["🎈 balloon is ___ than 🎳 ball", "lighter"], ["🐜 ant is ___ than 🐕 dog", "shorter"]], extra: "heavier", trap: [1, "heavier"] },
  ],
}));
