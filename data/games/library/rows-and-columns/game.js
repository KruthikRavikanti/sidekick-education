// Rows and Columns. Skill N-VM.C.6-1.
// Using matrices to represent and manipulate data. Mixing up rows and columns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Rows and Columns",
  emoji: "🗄️",
  premise: "A matrix is a grid of numbers. Rows go across. Columns go down. Each position means something.",
  outro: "In a matrix, each row and each column has a meaning. The entry in row 2, column 1 sits in the second row, first column.",
  scene: "desk",
  kind: "fill",
  figW: 20,
  cast: "",
  hint: "Rows read across, like lines of text. Columns stand up, like pillars.",
  tag: "rows_columns_mixed",
  rounds: [
    { say: "Store A sold 5 shirts and 3 hats. Store B sold 2 shirts and 7 hats. Each row is a store. Pick the matrix.", rows: [["columns: shirts, hats", "~mat:5,3;2,7"]], extra: "~mat:5,2;3,7 ~mat:3,5;7,2", trap: [0, "~mat:5,2;3,7"], why: "That puts Store A down a column. Store A belongs across row 1: 5 then 3.", win: "Row 1 is Store A. Row 2 is Store B." },
    { say: "Key in the entry in row 2, column 1.", kind: "type", icon: "🗄️", fig: { type: "mats", items: ["[5,3;2,7]"], v: [] }, ans: 2, trap: 3, why: "3 is row 1, column 2. Go down to row 2 first, then across to column 1.", win: "Second row, first number: 2." },
    { say: "Read the matrix by yourself.", kind: "type", icon: "🗄️", fig: { type: "mats", items: ["[4,9;6,1]"], v: [] }, alt: [{ q: "Key in the entry in row 1, column 2.", ans: 9, trap: 6 }, { q: "Key in the entry in row 2, column 1.", ans: 6, trap: 9 }, { q: "Key in the entry in row 2, column 2.", ans: 1, trap: 4 }] },
  ],
}));
