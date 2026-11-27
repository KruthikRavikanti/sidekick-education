// Shapes Inside a Circle. Skill G-CO.D.13-1.
// Constructing an equilateral triangle, a square and a regular hexagon inscribed in a circle. Drawing freehand is the known slip.
Sidekick.game(Sidekick.play({
  title: "Shapes Inside a Circle",
  emoji: "⭕",
  premise: "Step the radius around a circle and it fits exactly six times. That one fact builds a hexagon, a triangle and more.",
  outro: "The radius steps around the circle 6 times: a regular hexagon. Every second point gives an equilateral triangle.",
  scene: "paper",
  kind: "type",
  icon: "⭕",
  hint: "Keep the compass set to the radius and walk it around the circle.",
  tag: "draws_freehand",
  rounds: [
    { say: "With the compass set to the radius, you step around the circle. Key in how many steps fit exactly.", ans: 6, trap: 3, why: "The radius fits six times, making the six corners of a hexagon.", win: "Six steps, six corners." },
    { say: "Match each inscribed shape to its construction.", kind: "fill", fs: 4.8, cast: "", rows: [["regular hexagon", "step the radius around 6 times"], ["equilateral triangle", "join every second hexagon point"], ["square", "draw two perpendicular diameters"]], extra: "sketch it by eye|", trap: [2, "sketch it by eye"], why: "A freehand sketch is not exact. Perpendicular diameters give four equal corners.", win: "Every corner comes from an arc or a line." },
    { say: "Answer by yourself.", alt: [{ q: "Joining every second hexagon point makes a triangle. How many of the six points does it use?", ans: 3, trap: 2 }, { q: "A square inscribed in a circle is built from how many diameters?", ans: 2, trap: 4 }, { q: "A regular hexagon inscribed in a circle of radius 5 has sides of what length?", ans: 5, trap: 10 }] },
  ],
}));
