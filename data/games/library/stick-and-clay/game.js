// Stick and Clay. Skill K.G.B.5-1.
// Building shapes from sticks and clay: the child sets sticks and clay balls and the shape redraws. One clay ball short leaves a corner open.
Sidekick.game(Sidekick.play({
  title: "Stick and Clay",
  emoji: "🪵",
  premise: "Build shapes from sticks, with a ball of clay to join every corner. A shape is only done when it is closed.",
  outro: "A closed shape has a corner at every place two sides meet.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Every stick is a side. Every corner needs clay.",
  tag: "leaves_shape_open",
  dials: [["Sticks", 1, 8], ["Clay balls", 1, 8]],
  view: "ngon",
  rounds: [
    { say: "Build a triangle. Put clay on every corner.", ans: [3, 3], trap: [3, 2], why: "One corner is still open. Every corner needs clay to close the shape.", win: "3 sticks and 3 corners make a triangle." },
    { say: "Build a square. Put clay on every corner.", ans: [4, 4], trap: [4, 3], why: "One corner is still open. Add clay to close it.", win: "4 sticks and 4 corners make a square." },
    { say: "Build this shape by yourself.", alt: [{ say: "Build a shape with 6 sides. Close every corner.", ans: [6, 6], trap: [6, 5] }, { say: "Build a shape with 5 sides. Close every corner.", ans: [5, 5], trap: [5, 4] }] },
  ],
}));
