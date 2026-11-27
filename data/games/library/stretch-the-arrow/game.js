// Stretch the Arrow. Skill N-VM.B.5-1.
// Representing scalar multiplication graphically by scaling vectors and possibly reversing their direction. Reversing direction for positive scalars is the known slip.
Sidekick.game(Sidekick.play({
  title: "Stretch the Arrow",
  emoji: "🪄",
  premise: "A positive number stretches or shrinks a vector along the same line. A negative number also turns it around.",
  outro: "c(a, b) = (ca, cb). Positive c keeps the direction. Negative c reverses it.",
  scene: "paper",
  kind: "plot",
  cast: "",
  axes: [-4, 4, -4, 4],
  quiet: true,
  hint: "Multiply both components by the number.",
  tag: "flips_for_positive_scalar",
  rounds: [
    { say: "v is (2, −1). Tap the tip of 2v.", arrows: [[0, 0, 2, -1, "v"]], ans: [[4, -2]], trap: [[-4, 2]], why: "2 is positive, so the arrow keeps pointing the same way. It just doubles.", win: "2(2, −1) = (4, −2)." },
    { say: "v is (2, 1). Tap the tip of −2v.", arrows: [[0, 0, 2, 1, "v"]], ans: [[-4, -2]], trap: [[4, 2]], why: "The negative sign turns the arrow around.", win: "−2(2, 1) = (−4, −2)." },
    { say: "Tap the tip by yourself.", alt: [{ say: "By yourself: v is (1, 2). Tap the tip of 2v.", arrows: [[0, 0, 1, 2, "v"]], ans: [[2, 4]], trap: [[-2, -4]] }, { say: "By yourself: v is (−1, 1). Tap the tip of 3v.", arrows: [[0, 0, -1, 1, "v"]], ans: [[-3, 3]], trap: [[3, -3]] }, { say: "By yourself: v is (2, −1). Tap the tip of −2v.", arrows: [[0, 0, 2, -1, "v"]], ans: [[-4, 2]], trap: [[4, -2]] }] },
  ],
}));
