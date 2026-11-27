// Maps Onto Itself. Skill G-CO.A.3-1.
// Describing the rotations and reflections that carry a polygon onto itself. Missing diagonal lines of symmetry is the known slip.
Sidekick.game(Sidekick.play({
  title: "Maps Onto Itself",
  emoji: "🔲",
  premise: "Some turns and flips leave a shape looking exactly as it started. A square has more of these than most people count.",
  outro: "A square has 4 lines of symmetry (2 through sides, 2 diagonals) and rotations of 90°, 180°, 270° and 360°.",
  scene: "paper",
  kind: "type",
  icon: "🔲",
  hint: "Try folding along the diagonals as well as across the middle.",
  tag: "misses_diagonals",
  rounds: [
    { say: "Key in the number of lines of symmetry of a square.", ans: 4, trap: 2, why: "Folding corner to corner works too. Count the two diagonals.", win: "Two through the sides, two diagonals." },
    { say: "Which moves map a square onto itself?", kind: "sort", fs: 5.4, bins: "Maps onto itself|Does not", items: ["rotate 90°|rotate 180°|reflect over a diagonal", "rotate 45°|rotate 60°"], trap: ["reflect over a diagonal", 1], why: "A diagonal is a line of symmetry. The square lands on itself.", win: "Quarter turns and four mirror lines." },
    { say: "Count the lines of symmetry by yourself.", alt: [{ q: "A rectangle that is not a square", ans: 2, trap: 4 }, { q: "An equilateral triangle", ans: 3, trap: 1 }, { q: "A regular hexagon", ans: 6, trap: 3 }] },
  ],
}));
