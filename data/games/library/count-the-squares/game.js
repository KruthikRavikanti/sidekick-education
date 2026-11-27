// Count the Squares. Skill 3.MD.C.6-1.
// Counting unit squares to find area: every square inside counts. Counting only the squares along the edges is the known slip.
Sidekick.game(Sidekick.play({
  title: "Count the Squares",
  emoji: "🟩",
  premise: "The rectangle is drawn on grid paper. Count every square inside it to find its area.",
  outro: "Area counts all the squares inside, not only the ones along the edge.",
  scene: "paper",
  kind: "type",
  icon: "🐸",
  hint: "Count a whole row, then count by that for every row.",
  tag: "counts_edge_squares_only",
  rounds: [
    { say: "Key in the area in square units.", fig: { type: "rect", d: [5, 3], l: [], grid: true }, ans: 15, trap: 12, why: "That counts only the squares on the edge. Count the ones in the middle too.", win: "3 rows of 5 is 15 square units." },
    { say: "Key in the area in square units.", fig: { type: "rect", d: [4, 4], l: [], grid: true }, ans: 16, trap: 12, why: "Count every square, including the ones in the middle.", win: "4 rows of 4 is 16 square units." },
    { say: "Find the area by yourself.", alt: [{ fig: { type: "rect", d: [6, 4], l: [], grid: true }, ans: 24, trap: 16 }, { fig: { type: "rect", d: [5, 4], l: [], grid: true }, ans: 20, trap: 14 }] },
  ],
}));
