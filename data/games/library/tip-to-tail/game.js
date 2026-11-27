// Tip to Tail. Skill N-VM.B.4-1.
// Adding vectors end to end, component-wise, and by the parallelogram rule. Adding only the magnitudes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tip to Tail",
  emoji: "🔗",
  premise: "To add two vectors, walk along the first, then along the second from where you stopped. Or just add the components.",
  outro: "Add vectors by components: (a, b) + (c, d) = (a + c, b + d).",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [0, 8, -2, 6],
  quiet: true,
  hint: "Add the across parts. Then add the up parts.",
  tag: "adds_magnitudes_only",
  rounds: [
    { say: "u is (2, 3) and v is (4, −1). Tap the tip of u + v.", arrows: [[0, 0, 2, 3, "u"], [0, 0, 4, -1, "v"]], ans: [[6, 2]], trap: [[6, 4]], why: "v goes down 1, so the up part is 3 + (−1) = 2.", win: "(2 + 4, 3 − 1) = (6, 2)." },
    { say: "u is (1, 2) and v is (3, 1). Tap the tip of u + v.", arrows: [[0, 0, 1, 2, "u"], [0, 0, 3, 1, "v"]], ans: [[4, 3]], trap: [[3, 2]], why: "That multiplied the parts. Add them: 1 + 3 and 2 + 1.", win: "(4, 3): walk u, then walk v." },
    { say: "Tap the tip of u + v by yourself.", alt: [{ say: "By yourself: u is (2, 1) and v is (1, 3). Tap the tip of u + v.", arrows: [[0, 0, 2, 1, "u"], [0, 0, 1, 3, "v"]], ans: [[3, 4]], trap: [[2, 3]] }, { say: "By yourself: u is (3, −1) and v is (2, 4). Tap the tip of u + v.", arrows: [[0, 0, 3, -1, "u"], [0, 0, 2, 4, "v"]], ans: [[5, 3]], trap: [[5, 5]] }, { say: "By yourself: u is (1, 4) and v is (4, −2). Tap the tip of u + v.", arrows: [[0, 0, 1, 4, "u"], [0, 0, 4, -2, "v"]], ans: [[5, 2]], trap: [[5, 6]] }] },
  ],
}));
