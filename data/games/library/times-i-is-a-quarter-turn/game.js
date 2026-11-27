// Times i Is a Quarter Turn. Skill N-CN.B.5-2.
// Understanding multiplication by i as a rotation on the complex plane. Not seeing multiplication as rotation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Times i Is a Quarter Turn",
  emoji: "🔄",
  premise: "Multiply any complex number by i and it swings a quarter turn counterclockwise around 0, keeping its distance.",
  outro: "Multiplying by i rotates a point 90° counterclockwise: a + bi becomes −b + ai.",
  scene: "space",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  axis: ["real", "imaginary"],
  quiet: true,
  hint: "Turn the arrow a quarter turn to the left around 0.",
  tag: "no_rotation",
  rounds: [
    { say: "z is 3 + i. Tap the point for i times z.", arrows: [[0, 0, 3, 1, "z"]], ans: [[-1, 3]], trap: [[1, 3]], why: "That only swapped the parts. i(3 + i) = 3i + i^2 = −1 + 3i.", win: "A quarter turn left: −1 + 3i." },
    { say: "z is 3 + i. Multiply by i twice. Tap the result.", arrows: [[0, 0, 3, 1, "z"]], ans: [[-3, -1]], trap: [[-1, 3]], why: "That is one quarter turn. Two of them make a half turn.", win: "i^2 = −1, so z becomes −z." },
    { say: "Tap the point for i times z by yourself.", alt: [{ say: "By yourself: z is 4 + 2i. Tap i times z.", arrows: [[0, 0, 4, 2, "z"]], ans: [[-2, 4]], trap: [[2, 4]] }, { say: "By yourself: z is 1 + 3i. Tap i times z.", arrows: [[0, 0, 1, 3, "z"]], ans: [[-3, 1]], trap: [[3, 1]] }, { say: "By yourself: z is −2 + i. Tap i times z.", arrows: [[0, 0, -2, 1, "z"]], ans: [[-1, -2]], trap: [[1, -2]] }] },
  ],
}));
