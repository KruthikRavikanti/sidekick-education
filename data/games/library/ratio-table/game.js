// Ratio Table. Skill 6.RP.A.3-1.
// Making tables of equivalent ratios and finding missing values. Adding the same number to both quantities instead of multiplying is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ratio Table",
  emoji: "🍚",
  premise: "Every column of a ratio table is the same recipe made bigger. Multiply both amounts by the same number.",
  outro: "Equivalent ratios come from multiplying both quantities by the same number.",
  scene: "kitchen",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "What was the first column multiplied by to get this column? Do the same below.",
  tag: "adds_instead_of_multiplying",
  rounds: [
    { say: "Rice to water is 2 to 3. Finish the table.", fig: { type: "table", rows: [["Rice", 2, 4, 6], ["Water", 3, "?", "?"]] }, rows: [["4 cups rice", "6"], ["6 cups rice", "9"]], extra: "5 7", trap: [0, "5"], why: "Rice doubled from 2 to 4, so water doubles too: 3 × 2.", win: "6 and 9 cups of water." },
    { say: "Paint: 3 red to 5 blue. Finish the table.", fig: { type: "table", rows: [["Red", 3, 6, 12], ["Blue", 5, "?", "?"]] }, rows: [["6 red", "10"], ["12 red", "20"]], extra: "8 14", trap: [1, "14"], why: "Red went from 3 to 12, which is × 4. Blue is 5 × 4.", win: "10 and 20 cans of blue." },
    { say: "Finish the table by yourself.", fig: { type: "table", rows: [["Laps", 4, 8, 20], ["Minutes", 6, "?", "?"]] }, rows: [["8 laps", "12"], ["20 laps", "30"]], extra: "10 22", trap: [1, "22"] },
  ],
}));
