// Slice the Round Ones. Skill 7.G.A.3-2.
// Describing slices of cylinders, cones and spheres. Not being able to picture slices at an angle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slice the Round Ones",
  emoji: "🥫",
  premise: "Round solids hide surprising shapes. A can cut level gives a circle, cut straight down gives a rectangle, and cut at a tilt gives an oval.",
  outro: "Cylinder: circle, rectangle or oval. Cone: circle or triangle. Sphere: always a circle.",
  scene: "kitchen",
  kind: "fill",
  fs: 4.8,
  figW: 13,
  cast: "",
  hint: "Picture the knife. Level, straight down, or tilted?",
  tag: "cannot_picture_angled_slice",
  rounds: [
    { say: "What shape is the flat face of each slice?", rows: [["a can sliced level with its base", "~circle"], ["a can sliced straight down the middle", "~quad:rect"], ["a cone sliced down through its tip", "~tri:i"]], trap: [1, "~circle"], why: "Cut from lid to base, the face is as tall and as wide as the can: a rectangle.", win: "Circle, rectangle, triangle." },
    { say: "Match these slices.", rows: [["a ball sliced anywhere", "~circle"], ["a can sliced at a tilt", "~oval"], ["a cone sliced down through its tip", "~tri:i"]], extra: "~quad:rect", trap: [1, "~circle"], why: "A tilted cut stretches the circle into an oval.", win: "A tilt makes an oval." },
    { say: "Match these by yourself.", rows: [["a cone sliced level with its base", "~circle"], ["a can sliced straight down the middle", "~quad:rect"], ["a can sliced at a tilt", "~oval"]], extra: "~tri:i", trap: [2, "~circle"] },
  ],
}));
