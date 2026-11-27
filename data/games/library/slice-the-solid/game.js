// Slice the Solid. Skill 7.G.A.3-1.
// Describing the two-dimensional figures that result from slicing prisms and pyramids. Thinking every slice of a pyramid is a triangle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slice the Solid",
  emoji: "🔪",
  premise: "Cut straight through a solid and look at the flat face you made. Its shape depends on the solid and on the direction of the cut.",
  outro: "A slice level with the base copies the base. A slice down through the tip of a pyramid makes a triangle.",
  scene: "kitchen",
  kind: "fill",
  fs: 4.8,
  figW: 13,
  cast: "",
  hint: "Is the cut level with the base, or straight down?",
  tag: "every_pyramid_slice_triangle",
  rounds: [
    { say: "What shape is the flat face of each slice?", rows: [["a box sliced level with its base", "~quad:rect"], ["a square pyramid sliced level with its base", "~quad:sq"], ["a square pyramid sliced down through its tip", "~tri:i"]], trap: [1, "~tri:i"], why: "A level slice copies the base. The base is a square, so the slice is a smaller square.", win: "Level slices copy the base." },
    { say: "Match these slices.", rows: [["a triangular prism sliced level with its triangle end", "~tri:e"], ["a triangular prism sliced along its length", "~quad:rect"], ["a cube sliced level with its base", "~quad:sq"]], trap: [1, "~tri:e"], why: "Cutting along the length shows a long flat face: a rectangle.", win: "Direction decides the shape." },
    { say: "Match these by yourself.", rows: [["a long box sliced level with its base", "~quad:rect"], ["a square pyramid sliced level with its base", "~quad:sq"], ["a square pyramid sliced down through its tip", "~tri:i"]], extra: "~circle", trap: [1, "~tri:i"] },
  ],
}));
