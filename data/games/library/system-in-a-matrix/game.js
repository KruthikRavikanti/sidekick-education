// System in a Matrix. Skill A-REI.C.8-1.
// Representing a system of linear equations as a single matrix equation. Misplacing the coefficients is the known slip.
Sidekick.game(Sidekick.play({
  title: "System in a Matrix",
  emoji: "🗃️",
  premise: "A system of equations packs into one matrix equation: coefficients in a grid, unknowns in a column, constants in a column.",
  outro: "Each equation is a row. Each variable is a column. Then the system reads AX = B.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Row 1 holds the first equation’s coefficients, in the order x then y.",
  tag: "misplaces_coefficients",
  rounds: [
    { say: "Pack 2x + 3y = 7 and x − y = 1 into matrices.", kind: "fill", figW: 20, rows: [["coefficients", "~mat:2,3;1,-1"], ["constants", "~mat:7;1"]], extra: "~mat:2,1;3,-1 ~mat:2,3;7,1", trap: [0, "~mat:2,1;3,-1"], why: "That runs each equation down a column. The first equation is the first row: 2 then 3.", win: "Rows are equations. Columns are x and y." },
    { say: "Write 4x + y = 9 and 2x − 3y = 1 as a matrix equation. Set the two missing coefficients.", view: { type: "mats", items: ["[4,p;q,-3]", "[x;y]", "=", "[9;1]"], ph: "pq" }, dials: [["Upper right", -9, 9, 1, 0], ["Lower left", -9, 9, 1, 0]], ans: [1, 2], trap: [2, 1], why: "The y in the first equation has coefficient 1. The 2 belongs to x in the second equation.", win: "Row 1: 4 and 1. Row 2: 2 and −3." },
    { say: "Set the two missing coefficients by yourself.", alt: [{ say: "By yourself: write 3x + 5y = 2 and x + 4y = 6 as a matrix equation.", view: { type: "mats", items: ["[3,p;q,4]", "[x;y]", "=", "[2;6]"], ph: "pq" }, dials: [["Upper right", -9, 9, 1, 0], ["Lower left", -9, 9, 1, 0]], ans: [5, 1], trap: [1, 5] }, { say: "By yourself: write 2x − y = 3 and 6x + 2y = 8 as a matrix equation.", view: { type: "mats", items: ["[2,p;q,2]", "[x;y]", "=", "[3;8]"], ph: "pq" }, dials: [["Upper right", -9, 9, 1, 0], ["Lower left", -9, 9, 1, 0]], ans: [-1, 6], trap: [6, -1] }, { say: "By yourself: write x + 7y = 4 and 5x + y = 0 as a matrix equation.", view: { type: "mats", items: ["[1,p;q,1]", "[x;y]", "=", "[4;0]"], ph: "pq" }, dials: [["Upper right", -9, 9, 1, 0], ["Lower left", -9, 9, 1, 0]], ans: [7, 5], trap: [5, 7] }] },
  ],
}));
