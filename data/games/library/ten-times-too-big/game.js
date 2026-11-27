// Ten Times Too Big. Skill 5.NBT.B.5-2.
// Estimating to check products. Accepting a product that is off by a power of ten is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ten Times Too Big",
  emoji: "🎈",
  premise: "One slipped digit makes a product ten times too big or too small. A quick estimate catches it.",
  outro: "Round each factor and multiply in your head to check the size of a product.",
  scene: "city",
  kind: "sort",
  hint: "Round both numbers and multiply. Is the answer near your estimate?",
  tag: "accepts_power_of_ten_slip",
  rounds: [
    { say: "Estimate. Is each product about right?", bins: "About right|Way off", items: ["347 × 26 = 9,022|52 × 48 = 2,496", "347 × 26 = 90,220|52 × 48 = 24,960"], trap: ["347 × 26 = 90,220", 0], why: "About 350 × 25 is close to 9,000. An answer near 90,000 is ten times too big.", win: "Estimating caught them." },
    { say: "Check these products.", bins: "About right|Way off", items: ["198 × 31 = 6,138|76 × 19 = 1,444", "198 × 31 = 613|76 × 19 = 14,440"], trap: ["198 × 31 = 613", 0], why: "About 200 × 30 is 6,000. An answer near 600 is ten times too small.", win: "A quick estimate is a strong check." },
    { say: "Check these by yourself.", bins: "About right|Way off", items: ["412 × 29 = 11,948|63 × 87 = 5,481|905 × 11 = 9,955", "412 × 29 = 1,194|63 × 87 = 54,810"], trap: ["63 × 87 = 54,810", 0] },
  ],
}));
