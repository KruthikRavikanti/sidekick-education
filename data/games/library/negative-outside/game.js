// Negative Outside. Skill 7.EE.A.1-2.
// Expanding linear expressions with negative coefficients. Dropping the sign when distributing a negative is the known slip.
Sidekick.game(Sidekick.play({
  title: "Negative Outside",
  emoji: "➖",
  premise: "A negative in front of a bracket changes the sign of every term inside when you multiply through.",
  outro: "Distributing a negative flips each sign: −2(3x − 4) = −6x + 8.",
  scene: "night",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Multiply the outside number by each term. Negative times negative is positive.",
  tag: "drops_sign_when_distributing",
  rounds: [
    { say: "Expand each expression.", rows: [["−2(3x − 4) =", "−6x + 8"], ["−3(x + 2) =", "−3x − 6"]], extra: "−6x − 8|", trap: [0, "−6x − 8"], why: "−2 × −4 is +8.", win: "Each sign inside flipped." },
    { say: "Expand these.", rows: [["−(x − 5) =", "−x + 5"], ["−4(2x − 1) =", "−8x + 4"], ["−5(x + 3) =", "−5x − 15"]], extra: "−8x − 4|", trap: [1, "−8x − 4"], why: "−4 × −1 is +4.", win: "Three expansions." },
    { say: "Expand these by yourself.", rows: [["−2(4x − 3) =", "−8x + 6"], ["−(2x + 7) =", "−2x − 7"], ["−3(x − 6) =", "−3x + 18"]], extra: "−8x − 6|−3x − 18", trap: [0, "−8x − 6"] },
  ],
}));
