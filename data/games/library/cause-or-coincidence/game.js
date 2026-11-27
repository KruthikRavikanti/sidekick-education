// Cause or Coincidence?. Skill S-ID.C.9-1.
// Distinguishing between correlation and causation. Concluding cause from a strong correlation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cause or Coincidence?",
  emoji: "🍦",
  premise: "Two things can rise together without one causing the other. Often a third thing is driving both.",
  outro: "Correlation does not prove causation. Look for a hidden third cause.",
  scene: "city",
  kind: "sort",
  fs: 4.8,
  hint: "Could something else be causing both?",
  tag: "cause_from_correlation",
  rounds: [
    { say: "Does one cause the other, or are they only correlated?", bins: "One causes the other|Only correlated", items: ["flipping a switch and the light coming on|more rain and a higher river", "ice cream sales and drownings|children’s shoe size and reading level"], trap: ["ice cream sales and drownings", 0], why: "Both rise in hot weather. Ice cream does not cause drowning.", win: "A third factor can drive both." },
    { say: "What hidden cause explains each pair?", kind: "fill", fs: 5.2, cast: "", rows: [["ice cream sales and drownings", "hot weather"], ["shoe size and reading level", "age"], ["umbrella sales and car crashes", "rain"]], extra: "ice cream|", trap: [1, "hot weather"], why: "Older children have bigger feet and read better. Age drives both.", win: "Find the third factor." },
    { say: "Sort these by yourself.", bins: "One causes the other|Only correlated", items: ["pressing the brake and the car slowing|heating water and it boiling", "number of firefighters and fire damage|TV sets per home and life expectancy"], trap: ["number of firefighters and fire damage", 0] },
  ],
}));
