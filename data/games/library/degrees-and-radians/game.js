// Degrees and Radians. Skill F-TF.A.1-2.
// Converting between radians and degrees. Multiplying by the reversed factor is the known slip.
Sidekick.game(Sidekick.play({
  title: "Degrees and Radians",
  emoji: "🔁",
  premise: "A half turn is 180 degrees, and it is also π radians. That one fact converts everything.",
  outro: "180° = π radians. Degrees to radians: multiply by π ÷ 180. Radians to degrees: multiply by 180 ÷ π.",
  scene: "sky",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Think in half turns: 180° is π.",
  tag: "reversed_conversion_factor",
  rounds: [
    { say: "Match each degree measure to radians.", rows: [["180°", "π"], ["90°", "{π/2}"], ["60°", "{π/3}"]], extra: "{π/6} 2π", trap: [1, "2π"], why: "90° is half of 180°, so it is half of π.", win: "π, half of π, a third of π." },
    { say: "Match each radian measure to degrees.", rows: [["{π/4}", "45°"], ["{π/6}", "30°"], ["2π", "360°"]], extra: "60° 720°", trap: [1, "60°"], why: "π is 180°, and 180 ÷ 6 is 30.", win: "Divide 180° by the bottom number." },
    { say: "Convert these by yourself.", alt: [{ rows: [["270°", "{3π/2}"], ["{π/3}", "60°"], ["45°", "{π/4}"], ["π", "180°"]], extra: "{2π/3} 90°", trap: [0, "{2π/3}"] }, { rows: [["120°", "{2π/3}"], ["{π/2}", "90°"], ["30°", "{π/6}"], ["2π", "360°"]], extra: "{3π/2} 180°", trap: [0, "{3π/2}"] }] },
  ],
}));
