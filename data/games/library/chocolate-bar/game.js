// Chocolate Bar. Skill 2.G.A.2-1.
// Partitioning a rectangle into rows and columns of same-size squares: the child sets rows and columns and the bar redraws. Swapping rows and columns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Chocolate Bar",
  emoji: "🍫",
  premise: "Score the chocolate bar into rows and columns of same-size squares, just the way the order says.",
  outro: "A rectangle can be cut into rows and columns of same-size squares.",
  scene: "candy",
  kind: "dial",
  cast: "",
  dials: [["Rows", 1, 5], ["Columns", 1, 6]],
  view: { type: "array", square: true, color: "orange" },
  hint: "Rows go across. Columns go up and down.",
  tag: "swaps_rows_and_columns",
  rounds: [
    { say: "Cut the bar into 2 rows and 3 columns.", ans: [2, 3], trap: [3, 2], why: "That is 3 rows and 2 columns. Rows go across.", win: "2 rows and 3 columns." },
    { say: "Cut the bar into 3 rows and 4 columns.", ans: [3, 4], trap: [4, 3], why: "That is 4 rows and 3 columns. Rows go across.", win: "3 rows and 4 columns." },
    { say: "Cut the bar by yourself.", alt: [{ say: "Cut the bar into 4 rows and 2 columns.", ans: [4, 2], trap: [2, 4] }, { say: "Cut the bar into 2 rows and 5 columns.", ans: [2, 5], trap: [5, 2] }] },
  ],
}));
