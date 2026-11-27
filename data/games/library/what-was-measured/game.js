// What Was Measured?. Skill 6.SP.B.5-2.
// Describing the attribute under investigation, including how it was measured and its units. Leaving out the units is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Was Measured?",
  emoji: "🏷️",
  premise: "Numbers alone mean little. A good data report says what was measured, how, and in what unit.",
  outro: "Always report what was measured, how it was measured, and the unit.",
  scene: "desk",
  kind: "sort",
  fs: 4.8,
  hint: "Does it say what the numbers are AND the unit?",
  tag: "leaves_out_units",
  rounds: [
    { say: "Tap everything a good data report includes.", kind: "pick", fs: 5.6, yes: "what was measured|the unit|how it was measured|how many values", no: "a lucky number|the color of the pen", trap: "-the unit", why: "Without the unit, 150 could be inches, centimeters or pounds.", win: "What, how, the unit and how many." },
    { say: "Is each report complete?", bins: "Complete|Missing something", items: ["Heights of 12 students in cm, by tape measure|Times of 8 runners in seconds, by stopwatch", "Heights: 150, 152, 160|The weights were 40, 42 and 45"], trap: ["Heights: 150, 152, 160", 0], why: "It gives no unit. 150 inches and 150 centimeters are very different.", win: "Complete reports name the unit and the tool." },
    { say: "Sort these by yourself.", bins: "Complete|Missing something", items: ["Rain on 7 days in mm, from a rain gauge|Ages of 20 pets in years, from a survey", "The lengths were 12, 15 and 19|Temperatures: 68, 70, 75"], trap: ["Temperatures: 68, 70, 75", 0] },
  ],
}));
