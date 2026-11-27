// Slide and Stretch. Skill N-CN.B.5-1.
// Representing addition and multiplication of complex numbers geometrically. Mixing up the slide and the stretch is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slide and Stretch",
  emoji: "🛷",
  premise: "On the complex plane, adding slides a point. Multiplying by a real number stretches it away from 0.",
  outro: "Adding a + bi moves a point a across and b up. Multiplying by a real number scales its distance from 0.",
  scene: "space",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  axis: ["real", "imaginary"],
  quiet: true,
  hint: "Adding: move across by the real part, then up by the imaginary part.",
  tag: "multiplies_when_adding",
  rounds: [
    { say: "z is 1 + 2i. Tap the point for z + (2 + i).", given: [[1, 2, "z"]], ans: [[3, 3]], trap: [[2, 2]], why: "That multiplied the parts. Adding slides z 2 right and 1 up.", win: "Slide 2 right, 1 up: 3 + 3i." },
    { say: "z is 1 + 2i. Tap the point for 2z.", given: [[1, 2, "z"]], ans: [[2, 4]], trap: [[3, 4]], why: "That added 2. Multiplying by 2 doubles both parts.", win: "Twice as far from 0, same direction." },
    { say: "Tap the new point by yourself.", alt: [{ say: "By yourself: z is −2 + i. Tap z + (3 − 2i).", given: [[-2, 1, "z"]], ans: [[1, -1]], trap: [[1, 3]] }, { say: "By yourself: z is 1 − i. Tap 3z.", given: [[1, -1, "z"]], ans: [[3, -3]], trap: [[4, 2]] }, { say: "By yourself: z is −1 − 2i. Tap z + (2 + 4i).", given: [[-1, -2, "z"]], ans: [[1, 2]], trap: [[-2, -4]] }] },
  ],
}));
