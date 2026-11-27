// Conversion Table. Skill 4.MD.A.1-3.
// Completing two-column conversion tables: each pair keeps the same ratio. Listing pairs that do not keep the ratio (12, 13, 14) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Conversion Table",
  emoji: "📋",
  premise: "A conversion table lists the same lengths in two units. Every pair in it follows the same rule.",
  outro: "Every row of a conversion table uses the same multiplier.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Multiply the first row by the same number every time.",
  tag: "breaks_the_ratio",
  rounds: [
    { say: "Finish the table of feet and inches.", fig: { type: "table", rows: [["Feet", 1, 2, 3, 4], ["Inches", 12, "?", "?", "?"]] }, rows: [["2 feet =", "24"], ["3 feet =", "36"], ["4 feet =", "48"]], extra: "13 14", trap: [0, "13"], why: "Each foot is 12 more inches, not 1 more.", win: "24, 36 and 48 inches." },
    { say: "Finish the table of hours and minutes. Watch the jump at the end.", fig: { type: "table", rows: [["Hours", 1, 2, 3, 5], ["Minutes", 60, "?", "?", "?"]] }, rows: [["2 hours =", "120"], ["3 hours =", "180"], ["5 hours =", "300"]], extra: "240 61", trap: [2, "240"], why: "The table skips from 3 hours to 5 hours. Use 5 × 60.", win: "120, 180 and 300 minutes." },
    { say: "Finish the table of yards and feet by yourself.", fig: { type: "table", rows: [["Yards", 1, 2, 4, 6], ["Feet", 3, "?", "?", "?"]] }, rows: [["2 yards =", "6"], ["4 yards =", "12"], ["6 yards =", "18"]], extra: "9 4", trap: [1, "9"] },
  ],
}));
