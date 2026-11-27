// Metric Slide. Skill 5.MD.A.1-1.
// Converting among metric units with decimals: 3.5 m = 350 cm. Moving the decimal point the opposite way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Metric Slide",
  emoji: "🧪",
  premise: "Changing metric units means multiplying or dividing by 10, 100 or 1,000. Decide first if the number should grow or shrink.",
  outro: "Smaller unit, bigger number. Bigger unit, smaller number.",
  scene: "desk",
  kind: "type",
  icon: "🧪",
  hint: "Is the new unit smaller? Then you need more of them.",
  tag: "moves_point_the_other_way",
  rounds: [
    { say: "Key in the centimeters.", q: "1 meter = 100 centimeters. 3.5 meters = ? centimeters", ans: "350", trap: "0.035", why: "Centimeters are smaller than meters, so there are more of them.", win: "3.5 × 100 = 350 centimeters." },
    { say: "Key in the liters.", q: "1 liter = 1,000 milliliters. 450 milliliters = ? liters", ans: "0.45", trap: "450000", why: "Liters are bigger than milliliters, so there are fewer of them.", win: "450 ÷ 1,000 = 0.45 liter." },
    { say: "Key in the answer by yourself.", alt: [{ q: "1 kilometer = 1,000 meters. 1.2 kilometers = ? meters", ans: "1200", trap: "0.0012" }, { q: "1 meter = 100 centimeters. 75 centimeters = ? meters", ans: "0.75", trap: "7500" }, { q: "1 liter = 1,000 milliliters. 0.6 liter = ? milliliters", ans: "600", trap: "0.0006" }] },
  ],
}));
