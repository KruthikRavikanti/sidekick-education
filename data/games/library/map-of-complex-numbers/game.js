// Map of Complex Numbers. Skill N-CN.B.4-1.
// Representing complex numbers on the complex plane. Plotting the imaginary part on the horizontal axis is the known slip.
Sidekick.game(Sidekick.play({
  title: "Map of Complex Numbers",
  emoji: "🗺️",
  premise: "Every complex number is a point. The real part says how far across. The imaginary part says how far up.",
  outro: "Plot a + bi at the point (a, b): real part across, imaginary part up.",
  scene: "space",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  axis: ["real", "imaginary"],
  quiet: true,
  hint: "Real part first, along the bottom. Then the imaginary part, up or down.",
  tag: "swaps_axes",
  rounds: [
    { say: "Tap the point for 3 + 2i.", ans: [[3, 2]], trap: [[2, 3]], why: "That is 2 + 3i. The real part, 3, goes across.", win: "3 across, 2 up." },
    { say: "Tap the points for −2 + 3i and 1 − 4i.", ans: [[-2, 3], [1, -4]], trap: [[3, -2], [-4, 1]], why: "Real parts go across: −2 is left, 1 is right.", win: "Left 2 up 3, and right 1 down 4." },
    { say: "Tap the point by yourself.", alt: [{ say: "By yourself: tap the point for 4 − i.", ans: [[4, -1]], trap: [[-1, 4]] }, { say: "By yourself: tap the point for −3 − 2i.", ans: [[-3, -2]], trap: [[-2, -3]] }, { say: "By yourself: tap the point for 2i.", ans: [[0, 2]], trap: [[2, 0]] }] },
  ],
}));
