// Division Dash. Skill 3.OA.C.7-4.
// Division facts by thinking multiplication: facts are sorted by quotient, which rewards recalling the related times fact.
Sidekick.game(Sidekick.play({
  title: "Division Dash",
  emoji: "🏁",
  premise: "Each race car carries a division fact. Park every car in the lane that shows its answer.",
  outro: "A division fact is a times fact turned around.",
  scene: "field",
  kind: "sort",
  cast: "🏁 🏎️ 🏎️ 🏎️",
  hint: "Ask: what times the second number makes the first?",
  tag: "fact_slip",
  rounds: [
    { say: "Park each fact on its answer.", bins: "6|7|8", items: ["42 ÷ 7|54 ÷ 9", "56 ÷ 8|63 ÷ 9|49 ÷ 7", "64 ÷ 8|72 ÷ 9"], trap: ["56 ÷ 8", 2], why: "8 × 7 = 56, so 56 ÷ 8 is 7.", win: "Every car is parked." },
    { say: "New answers. Where does each car go?", bins: "4|5|9", items: ["36 ÷ 9|28 ÷ 7", "45 ÷ 9|40 ÷ 8", "81 ÷ 9|63 ÷ 7"], trap: ["63 ÷ 7", 1], why: "7 × 9 = 63, so 63 ÷ 7 is 9.", win: "All parked." },
    { say: "Park these by yourself.", bins: "3|6|8", items: ["27 ÷ 9|24 ÷ 8", "48 ÷ 8|36 ÷ 6", "56 ÷ 7|72 ÷ 9"], trap: ["48 ÷ 8", 2] },
  ],
}));
