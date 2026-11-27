// Sine and Cosine on the Unit Circle. Skill F-TF.A.2-1.
// Explaining how the unit circle extends trigonometric functions to all real numbers. Using only right-triangle definitions, or swapping x and y, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sine and Cosine on the Unit Circle",
  emoji: "🧭",
  premise: "Walk around a circle of radius 1. At any angle, your x-coordinate is the cosine and your y-coordinate is the sine.",
  outro: "On the unit circle the point at angle θ is (cos θ, sin θ). This works for every angle.",
  scene: "night",
  kind: "sort",
  fs: 5.6,
  hint: "Cosine is across (x). Sine is up (y).",
  tag: "swaps_sine_cosine",
  rounds: [
    { say: "The point at angle θ is (x, y). Name each coordinate.", kind: "fill", fs: 6, cast: "", fig: { type: "table", rows: [["angle", "0°", "90°", "180°", "270°"], ["point", "(1, 0)", "(0, 1)", "(−1, 0)", "(0, −1)"]], v: [] }, rows: [["the x-coordinate", "cos θ"], ["the y-coordinate", "sin θ"]], extra: "tan θ|", trap: [0, "sin θ"], why: "Sine is the height. The across distance is the cosine.", win: "(cos θ, sin θ)." },
    { say: "Use the table of points. Sort each value.", fig: { type: "table", rows: [["angle", "0°", "90°", "180°", "270°"], ["point", "(1, 0)", "(0, 1)", "(−1, 0)", "(0, −1)"]], v: [] }, bins: "−1|0|1", items: ["cos 180°|sin 270°", "cos 90°|sin 0°", "cos 0°|sin 90°"], trap: ["cos 90°", 2], why: "At 90° the point is (0, 1). Cosine is the x-coordinate: 0.", win: "x for cosine, y for sine." },
    { say: "Sort these by yourself.", fig: { type: "table", rows: [["angle", "0°", "90°", "180°", "270°"], ["point", "(1, 0)", "(0, 1)", "(−1, 0)", "(0, −1)"]], v: [] }, bins: "−1|0|1", items: ["sin 270°|cos 180°", "sin 180°|cos 270°", "sin 90°|cos 0°"], trap: ["sin 180°", 0] },
  ],
}));
