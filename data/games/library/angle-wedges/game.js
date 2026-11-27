// Angle Wedges. Skill 4.MD.C.7-1.
// Angle measure is additive: the measure of the whole is the sum of the parts. Not seeing the whole as a sum of parts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle Wedges",
  emoji: "🍕",
  premise: "Angles that sit side by side add up, just like slices of pizza make a bigger slice.",
  outro: "When angles do not overlap, the whole angle is the sum of its parts.",
  scene: "kitchen",
  kind: "type",
  hint: "Side by side angles join into one bigger angle. Add their sizes.",
  tag: "cannot_decompose_angle",
  rounds: [
    { say: "Two angles sit side by side. Key in the size of the whole angle.", fig: { type: "angle", v: [75], ref: 30 }, q: "One part is 30°. The other part is 45°.", ans: 75, trap: 15, why: "The parts are joined, not compared. Add them.", win: "30 + 45 = 75 degrees." },
    { say: "Pick wedges that fit together to make a 90 degree corner.", kind: "build", pile: [["30°", 30, 3], ["60°", 60, 1], ["20°", 20, 1]], goal: 90, unit: "#°", trap: 80, why: "Those add to 80 degrees. A square corner needs 90.", win: "The parts add up to 90 degrees." },
    { say: "Key in the whole angle by yourself.", alt: [{ q: "An angle is made of three parts: 25°, 40° and 50°.", ans: 115, trap: 65 }, { q: "An angle is made of three parts: 35°, 35° and 60°.", ans: 130, trap: 95 }] },
  ],
}));
