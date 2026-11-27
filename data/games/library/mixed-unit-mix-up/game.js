// Mixed Unit Mix-Up. Skill 4.MD.A.2-1.
// Measurement word problems that need a unit conversion first. Computing with the numbers as written, ignoring the units, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Mixed Unit Mix-Up",
  emoji: "🪢",
  premise: "These stories mix two different units. Change everything to the same unit before you add or subtract.",
  outro: "Put both amounts in the same unit before you compute.",
  scene: "desk",
  kind: "type",
  icon: "🪢",
  hint: "Change the bigger unit into the smaller one first.",
  tag: "ignores_units",
  rounds: [
    { say: "Key in the answer in centimeters.", q: "A rope is 3 meters long. You cut off 120 centimeters. How many centimeters are left?", ans: 180, trap: 117, why: "3 and 120 are in different units. Change 3 meters to 300 centimeters first.", win: "300 − 120 = 180 centimeters." },
    { say: "Key in the answer in milliliters.", q: "A jug holds 2 liters. You pour out 750 milliliters. How many milliliters are left?", ans: 1250, trap: 748, why: "2 liters is 2,000 milliliters. Subtract from that.", win: "2,000 − 750 = 1,250 milliliters." },
    { say: "Solve it by yourself.", alt: [{ q: "A movie is 2 hours long. You have watched 45 minutes. How many minutes are left?", ans: 75, trap: 43 }, { q: "A bag holds 4 kilograms of rice. You use 500 grams. How many grams are left?", ans: 3500, trap: 496 }] },
  ],
}));
