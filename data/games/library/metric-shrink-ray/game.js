// Metric Shrink Ray. Skill 4.MD.A.1-1.
// Converting within the metric system from a larger unit to a smaller one. Dividing when the unit gets smaller is the known slip.
Sidekick.game(Sidekick.play({
  title: "Metric Shrink Ray",
  emoji: "🔬",
  premise: "Zap a measurement into a smaller unit. Smaller units means you need more of them.",
  outro: "Changing to a smaller unit makes the number bigger. Multiply.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "The new unit is smaller, so it takes more of them. Multiply.",
  tag: "divides_to_smaller_unit",
  rounds: [
    { say: "Change each measurement to the smaller unit.", q: "1 m = 100 cm     1 cm = 10 mm", rows: [["500 cm = ___ mm", "5,000"], ["3 m = ___ cm", "300"]], extra: "50 30", trap: [0, "50"], why: "Millimeters are smaller than centimeters, so you need MORE of them.", win: "5,000 millimeters and 300 centimeters." },
    { say: "Now grams and milliliters.", q: "1 kg = 1,000 g     1 L = 1,000 mL", rows: [["4 kg = ___ g", "4,000"], ["6 L = ___ mL", "6,000"]], extra: "400 60", trap: [0, "400"], why: "One kilogram is 1,000 grams, so 4 kilograms is 4 thousands.", win: "4,000 grams and 6,000 milliliters." },
    { say: "Change these by yourself.", q: "1 km = 1,000 m     1 m = 100 cm     1 cm = 10 mm", rows: [["2 km = ___ m", "2,000"], ["8 m = ___ cm", "800"], ["40 cm = ___ mm", "400"]], extra: "4 80", trap: [2, "4"] },
  ],
}));
