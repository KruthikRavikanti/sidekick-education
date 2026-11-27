// Find the Other One. Skill F-TF.C.8-2.
// Using the Pythagorean identity to find one trigonometric value from another, given the quadrant. Ignoring the sign set by the quadrant is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Other One",
  emoji: "🧲",
  premise: "The identity gives the size of the missing trig value. The quadrant decides whether it is positive or negative.",
  outro: "Use sin^2 θ + cos^2 θ = 1 for the size, then the quadrant for the sign.",
  scene: "night",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Left of the y-axis, cosine is negative. Below the x-axis, sine is negative.",
  tag: "ignores_quadrant_sign",
  rounds: [
    { say: "sin x = {3/5}. Find cos x in each quadrant.", rows: [["x in Quadrant I", "{4/5}"], ["x in Quadrant II", "−{4/5}"]], extra: "{3/4} −{3/5}", trap: [1, "{4/5}"], why: "In Quadrant II the point is left of the y-axis, so cosine is negative.", win: "Same size, sign from the quadrant." },
    { say: "cos x = {5/13}. Find sin x in each quadrant.", rows: [["x in Quadrant I", "{12/13}"], ["x in Quadrant IV", "−{12/13}"]], extra: "{5/12} −{5/13}", trap: [1, "{12/13}"], why: "In Quadrant IV the point is below the x-axis, so sine is negative.", win: "5, 12, 13 with the sign from the quadrant." },
    { say: "Find the missing value by yourself.", alt: [{ rows: [["sin x = {4/5} in Quadrant II: cos x", "−{3/5}"], ["cos x = {3/5} in Quadrant IV: sin x", "−{4/5}"]], extra: "{3/5} {4/5}", trap: [0, "{3/5}"] }, { rows: [["sin x = {5/13} in Quadrant II: cos x", "−{12/13}"], ["sin x = −{5/13} in Quadrant IV: cos x", "{12/13}"]], extra: "{5/12} −{5/12}", trap: [0, "{12/13}"] }] },
  ],
}));
