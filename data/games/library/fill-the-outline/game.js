// Fill the Outline. Skill K.G.B.6-2.
// Filling an outline with smaller shapes: the child adds blocks one at a time and watches the outline fill. One too few leaves an open spot and one too many has no place.
Sidekick.game(Sidekick.play({
  title: "Fill the Outline",
  emoji: "🔷",
  premise: "An empty outline is waiting for blocks. Add blocks until it is full, with none left over.",
  outro: "Blocks fill a shape when they cover all of it with no open spots and no overlaps.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Look for open spots. Stop when the outline is full.",
  tag: "leaves_open_spot",
  tag2: "adds_overlapping_block",
  dials: [["Blocks", 0, 8]],
  rounds: [
    { say: "Add blocks until the outline is full.", view: { type: "fillshape", shape: "rhombus" }, ans: [2], trap: [1], why: "There is still an open spot. Add another block.", win: "2 triangles fill it." },
    { say: "A bigger outline. Fill it all the way.", view: { type: "fillshape", shape: "hex" }, ans: [6], trap: [5], why: "There is still an open spot. Add another block.", win: "6 triangles fill the hexagon." },
    { say: "Fill this outline by yourself.", alt: [{ view: { type: "fillshape", shape: "trapezoid" }, ans: [3], trap: [2], trap2: [4] }, { view: { type: "fillshape", shape: "bigtri" }, ans: [4], trap: [3], trap2: [5] }, { view: { type: "fillshape", shape: "bigsquare" }, ans: [4], trap: [3], trap2: [5] }] },
  ],
}));
