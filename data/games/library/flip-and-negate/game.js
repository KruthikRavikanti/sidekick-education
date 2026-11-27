// Flip and Negate. Skill G-GPE.B.5-2.
// Proving and using the slope criterion for perpendicular lines. Using the reciprocal without changing the sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Flip and Negate",
  emoji: "➕",
  premise: "Perpendicular lines meet at a square corner. Their slopes are opposite reciprocals: flip the fraction and change the sign.",
  outro: "Perpendicular slopes multiply to −1: flip the fraction and switch the sign.",
  scene: "paper",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Two moves: flip the fraction, then change the sign.",
  tag: "reciprocal_only",
  rounds: [
    { say: "Give the slope of a line perpendicular to each one.", rows: [["slope {2/3}", "−{3/2}"], ["slope 4", "−{1/4}"]], extra: "{3/2} {1/4}", trap: [0, "{3/2}"], why: "Flipped, but still positive. A perpendicular line must tilt the other way.", win: "Flip and negate." },
    { say: "Give the perpendicular slope.", rows: [["slope −{1/2}", "2"], ["slope −3", "{1/3}"], ["slope {5/2}", "−{2/5}"]], extra: "−2 {2/5}", trap: [0, "−2"], why: "The slope was negative, so the perpendicular slope is positive.", win: "Each pair multiplies to −1." },
    { say: "Give the perpendicular slopes by yourself.", alt: [{ rows: [["slope {3/4}", "−{4/3}"], ["slope −5", "{1/5}"], ["slope 1", "−1"]], extra: "{4/3} −{1/5}", trap: [0, "{4/3}"] }, { rows: [["slope {1/6}", "−6"], ["slope −{2/7}", "{7/2}"], ["slope 2", "−{1/2}"]], extra: "6 {1/2}", trap: [0, "6"] }] },
  ],
}));
