// Angle Partners. Skill 7.G.B.5-1.
// Using facts about supplementary, complementary, vertical and adjacent angles. Confusing supplementary (180) with complementary (90) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle Partners",
  emoji: "📐",
  premise: "Some angles come in pairs. Supplementary angles make a straight line, 180°. Complementary angles make a square corner, 90°. Vertical angles are equal.",
  outro: "Supplementary: sum 180°. Complementary: sum 90°. Vertical angles: equal.",
  scene: "paper",
  kind: "type",
  hint: "A straight line is 180°. A square corner is 90°.",
  tag: "confuses_180_and_90",
  rounds: [
    { say: "The two angles make a straight line. Key in the missing angle.", fig: { type: "angle", v: [65], straight: true, mark: ["65°", "?"] }, ans: 115, trap: 25, why: "A straight line is 180°, not 90°.", win: "180 − 65 = 115°." },
    { say: "The two angles make a square corner. Key in the missing angle.", fig: { type: "angle", v: [35], corner: true, mark: ["35°", "?"] }, ans: 55, trap: 145, why: "A square corner is 90°, not 180°.", win: "90 − 35 = 55°." },
    { say: "Two lines cross. Key in the angle straight across from 70°.", fig: { type: "angle", v: [70], cross: true, mark: ["70°", "?"] }, ans: 70, trap: 110, why: "110° is the neighbor angle. The angle straight across is equal.", win: "Vertical angles are equal: 70°." },
    { say: "Find the missing angle by yourself.", alt: [{ q: "Two angles are supplementary. One is 40°.", ans: 140, trap: 50 }, { q: "Two angles are complementary. One is 20°.", ans: 70, trap: 160 }, { q: "Two lines cross. One angle is 125°. Find its vertical angle.", ans: 125, trap: 55 }] },
  ],
}));
