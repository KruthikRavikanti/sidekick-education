// Stretch From the Origin. Skill 8.G.A.3-3.
// Describing the effect of dilations using coordinates. Adding the scale factor is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stretch From the Origin",
  emoji: "🔍",
  premise: "A dilation from the origin multiplies both coordinates by the scale factor. The point moves out along a straight ray.",
  outro: "Dilation by k from the origin: (x, y) → (kx, ky). Multiply, never add.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, 0, 8],
  quiet: true,
  hint: "Multiply each coordinate by the scale factor.",
  tag: "adds_scale_factor",
  rounds: [
    { say: "Dilate P by a scale factor of 3 from the origin. Tap its image.", given: [[2, 1, "P"]], ans: [[6, 3]], trap: [[5, 4]], why: "That added 3. A dilation multiplies: 2 × 3 and 1 × 3.", win: "(2, 1) becomes (6, 3)." },
    { say: "Dilate P by a scale factor of 2. Tap its image.", given: [[1, 3, "P"]], ans: [[2, 6]], trap: [[3, 5]], why: "Multiply by 2: 1 × 2 and 3 × 2.", win: "(1, 3) becomes (2, 6)." },
    { say: "Tap the image by yourself.", alt: [{ say: "Dilate P by a scale factor of 3 from the origin.", given: [[2, 2, "P"]], ans: [[6, 6]], trap: [[5, 5]] }, { say: "Dilate P by a scale factor of 2 from the origin.", given: [[4, 1, "P"]], ans: [[8, 2]], trap: [[6, 3]] }, { say: "Dilate P by a scale factor of 4 from the origin.", given: [[1, 2, "P"]], ans: [[4, 8]], trap: [[5, 6]] }] },
  ],
}));
