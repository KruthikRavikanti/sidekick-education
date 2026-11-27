// Subtract an Arrow. Skill N-VM.B.4-3.
// Understanding vector subtraction as adding the additive inverse. Reversing the other vector is the known slip.
Sidekick.game(Sidekick.play({
  title: "Subtract an Arrow",
  emoji: "↩️",
  premise: "Subtracting a vector means adding its opposite: turn the second arrow around, then add.",
  outro: "u − v = u + (−v). By components: (a − c, b − d).",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  hint: "Flip v to point the other way. Then add it to u.",
  tag: "reverses_other_vector",
  rounds: [
    { say: "u is (3, 1) and v is (1, 3). Tap the tip of u − v.", arrows: [[0, 0, 3, 1, "u"], [0, 0, 1, 3, "v"]], ans: [[2, -2]], trap: [[-2, 2]], why: "That is v − u. Keep u and flip v: (3 − 1, 1 − 3).", win: "(2, −2)." },
    { say: "u is (2, 3) and v is (4, 1). Tap the tip of u − v.", arrows: [[0, 0, 2, 3, "u"], [0, 0, 4, 1, "v"]], ans: [[-2, 2]], trap: [[2, -2]], why: "Start from u and take v away: (2 − 4, 3 − 1).", win: "(−2, 2)." },
    { say: "Tap the tip of u − v by yourself.", alt: [{ say: "By yourself: u is (4, 1) and v is (1, 2). Tap the tip of u − v.", arrows: [[0, 0, 4, 1, "u"], [0, 0, 1, 2, "v"]], ans: [[3, -1]], trap: [[-3, 1]] }, { say: "By yourself: u is (1, 4) and v is (3, 1). Tap the tip of u − v.", arrows: [[0, 0, 1, 4, "u"], [0, 0, 3, 1, "v"]], ans: [[-2, 3]], trap: [[2, -3]] }, { say: "By yourself: u is (−1, 2) and v is (2, −1). Tap the tip of u − v.", arrows: [[0, 0, -1, 2, "u"], [0, 0, 2, -1, "v"]], ans: [[-3, 3]], trap: [[3, -3]] }] },
  ],
}));
