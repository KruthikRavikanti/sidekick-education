// Partial Products. Skill 4.NBT.B.5-3.
// Connecting partial products to the area model: each cell is the product of its row and column values. Losing a zero (20 × 40 = 80) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Partial Products",
  emoji: "🗃️",
  premise: "The box is drawn, but its rooms are empty. Fill each room with the product of its row and its column.",
  outro: "Each room of the area model is one partial product.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Tens times tens gives hundreds. 2 tens × 4 tens is 8 hundreds.",
  tag: "loses_a_zero",
  rounds: [
    { say: "Fill the four rooms for 23 × 45.", fig: { type: "table", rows: [["×", "40", "5"], ["20", "?", "?"], ["3", "?", "?"]] }, rows: [["20 × 40 =", "800"], ["20 × 5 =", "100"], ["3 × 40 =", "120"], ["3 × 5 =", "15"]], extra: "80", trap: [0, "80"], why: "20 × 40 is 2 tens times 4 tens: 8 hundreds.", win: "800, 100, 120 and 15." },
    { say: "Fill the four rooms for 36 × 12.", fig: { type: "table", rows: [["×", "10", "2"], ["30", "?", "?"], ["6", "?", "?"]] }, rows: [["30 × 10 =", "300"], ["30 × 2 =", "60"], ["6 × 10 =", "60"], ["6 × 2 =", "12"]], extra: "30", trap: [0, "30"], why: "30 × 10 is 3 tens times 1 ten: 3 hundreds.", win: "300, 60, 60 and 12." },
    { say: "Fill the four rooms for 42 × 25 by yourself.", fig: { type: "table", rows: [["×", "20", "5"], ["40", "?", "?"], ["2", "?", "?"]] }, rows: [["40 × 20 =", "800"], ["40 × 5 =", "200"], ["2 × 20 =", "40"], ["2 × 5 =", "10"]], extra: "80", trap: [0, "80"] },
  ],
}));
