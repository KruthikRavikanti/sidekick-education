// Diagonals Meet Halfway. Skill G-CO.C.11-2.
// Proving that the diagonals of a parallelogram bisect each other. Using a diagram as proof is the known slip.
Sidekick.game(Sidekick.play({
  title: "Diagonals Meet Halfway",
  emoji: "✂️",
  premise: "The two diagonals of a parallelogram cut each other exactly in half at the point where they cross.",
  outro: "The diagonals of a parallelogram bisect each other.",
  scene: "paper",
  kind: "type",
  icon: "✂️",
  hint: "The crossing point is the midpoint of each diagonal.",
  tag: "diagram_as_proof",
  rounds: [
    { say: "One diagonal of a parallelogram is 12 long. Key in the distance from a corner to the crossing point.", ans: 6, trap: 12, why: "The crossing point is halfway along the diagonal.", win: "12 ÷ 2 = 6." },
    { say: "From a corner to the crossing point is 5. Key in the whole diagonal.", ans: 10, trap: 2.5, why: "The other half is 5 too.", win: "5 + 5 = 10." },
    { say: "Solve it by yourself.", alt: [{ q: "A diagonal is 20 long. How far is the crossing point from each end?", ans: 10, trap: 40 }, { q: "The diagonals are 14 and 8. How long is half of the shorter one?", ans: 4, trap: 7 }, { q: "Half a diagonal is 9. How long is the whole diagonal?", ans: 18, trap: 4.5 }] },
  ],
}));
