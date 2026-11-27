// Parallelogram Angles. Skill G-CO.C.11-1.
// Proving theorems about parallelograms: opposite sides and angles are congruent. Assuming the figure is a rectangle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parallelogram Angles",
  emoji: "▱",
  premise: "In any parallelogram, opposite angles are equal and neighboring angles add to 180°. It does not have to be a rectangle.",
  outro: "Parallelogram: opposite sides and angles are congruent, and consecutive angles are supplementary.",
  scene: "paper",
  kind: "type",
  unit: "°",
  hint: "Opposite corners match. Next-door corners add to 180°.",
  tag: "assumes_rectangle",
  rounds: [
    { say: "One angle of the parallelogram is 70°. Key in the angle next to it.", fig: { type: "poly", pts: [[10, 82], [70, 82], [90, 24], [30, 24]], angles: ["70°", "?", null, null], v: [] }, ans: 110, trap: 90, why: "Not every parallelogram has right angles. Neighbors add to 180°.", win: "180 − 70 = 110°." },
    { say: "One angle is 70°. Key in the angle opposite it.", fig: { type: "poly", pts: [[10, 82], [70, 82], [90, 24], [30, 24]], angles: ["70°", null, "?", null], v: [] }, ans: 70, trap: 110, why: "Opposite angles of a parallelogram are equal.", win: "Opposite angle: 70°." },
    { say: "Find the angle by yourself.", alt: [{ q: "One angle of a parallelogram is 125°. Find the angle next to it.", ans: 55, trap: 125 }, { q: "One angle of a parallelogram is 60°. Find the opposite angle.", ans: 60, trap: 120 }, { q: "One angle of a parallelogram is 95°. Find the angle next to it.", ans: 85, trap: 95 }] },
  ],
}));
