// Area From Two Sides and an Angle. Skill G-SRT.D.9-1.
// Deriving and using the formula A = ½ab sin C. Using a side that is not next to the angle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Area From Two Sides and an Angle",
  emoji: "📐",
  premise: "You do not need the height to find a triangle’s area. Two sides and the angle between them are enough.",
  outro: "Area = {1/2} × a × b × sin C, where C is the angle between sides a and b.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "Use the two sides that meet at the angle. Then half their product times the sine.",
  tag: "uses_non_adjacent_side",
  rounds: [
    { say: "Sides 6 and 8 meet at a 30° angle. Key in the area.", q: "{1/2} × 6 × 8 × sin 30°, and sin 30° = 0.5", ans: 12, trap: 24, why: "24 leaves out the one half at the front.", win: "Half of 48 is 24, times 0.5 is 12." },
    { say: "Sides 10 and 4 meet at a 30° angle. The third side is 7. Key in the area.", q: "sin 30° = 0.5", ans: 10, trap: 17.5, why: "The 7 is across from the angle. Use the two sides that form it: 10 and 4.", win: "{1/2} × 10 × 4 × 0.5 = 10." },
    { say: "Find the area by yourself. sin 30° = 0.5 and sin 150° = 0.5.", alt: [{ q: "Sides 8 and 5 meet at 30°. The third side is 4.", ans: 10, trap: 8 }, { q: "Sides 12 and 6 meet at 30°. The third side is 8.", ans: 18, trap: 24 }, { q: "Sides 10 and 10 meet at 150°. The third side is 19.", ans: 25, trap: 47.5 }] },
  ],
}));
