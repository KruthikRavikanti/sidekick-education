// Quilt Squares. Skill 2.G.A.2-2.
// Counting the squares in a partitioned rectangle: the total is found by counting rows of equal size. Adding rows and columns is the known slip.
Sidekick.game(Sidekick.play({
  title: "Quilt Squares",
  emoji: "🪡",
  premise: "Grandma sews her quilt in rows of squares. Key in how many squares are in the whole quilt.",
  outro: "Count the squares row by row to find the total.",
  scene: "candy",
  kind: "type",
  icon: "🪡",
  hint: "How many squares in one row? Count by that for each row.",
  tag: "adds_rows_and_columns",
  rounds: [
    { say: "How many squares are in the quilt?", fig: { type: "array", v: [3, 4], square: true, color: "berry" }, ans: 12, trap: 7, why: "Do not add 3 and 4. Count the squares: 4, 8, 12.", win: "3 rows of 4 is 12 squares." },
    { say: "How many squares in this quilt?", fig: { type: "array", v: [2, 6], square: true, color: "berry" }, ans: 12, trap: 8, why: "Count the squares row by row: 6, 12.", win: "2 rows of 6 is 12 squares." },
    { say: "Count the squares by yourself.", alt: [{ fig: { type: "array", v: [4, 5], square: true, color: "berry" }, ans: 20, trap: 9 }, { fig: { type: "array", v: [3, 6], square: true, color: "berry" }, ans: 18, trap: 9 }] },
  ],
}));
