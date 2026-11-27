// Cover It Exactly. Skill 3.MD.C.5-2.
// Covering a figure with unit squares without spaces or overlaps: the child adds squares until the outline is exactly full. One short leaves a hole and one extra has no place.
Sidekick.game(Sidekick.play({
  title: "Cover It Exactly",
  emoji: "🪟",
  premise: "Cover the outline with unit squares: every spot filled, nothing doubled up. Then you know its area.",
  outro: "The area is the number of unit squares that cover a shape with no spaces and no overlaps.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Squares", 0, 12]],
  hint: "Look for empty spots. Stop when the outline is exactly full.",
  tag: "leaves_an_open_spot",
  tag2: "adds_an_extra_square",
  rounds: [
    { say: "Add unit squares until the outline is exactly covered.", view: { type: "fillshape", shape: "grid:3x2" }, ans: [6], trap: [5], why: "One spot is still empty. Every spot needs a square.", win: "The area is 6 square units." },
    { say: "Cover this outline exactly.", view: { type: "fillshape", shape: "grid:4x2" }, ans: [8], trap: [7], trap2: [9], why: "One spot is still empty.", why2: "That square has no place to go. It would overlap.", win: "The area is 8 square units." },
    { say: "Cover this outline by yourself.", alt: [{ view: { type: "fillshape", shape: "grid:3x3" }, ans: [9], trap: [8], trap2: [10] }, { view: { type: "fillshape", shape: "grid:5x2" }, ans: [10], trap: [9], trap2: [11] }] },
  ],
}));
