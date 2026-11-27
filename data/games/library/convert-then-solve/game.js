// Convert, Then Solve. Skill 5.MD.A.1-3.
// Using unit conversions in multistep problems. Converting only one quantity, or answering in the other unit, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Convert, Then Solve",
  emoji: "🪚",
  premise: "In these jobs the measurements come in two different units. Get everything into one unit, then finish the problem.",
  outro: "Convert every amount to the unit the question asks for, then compute.",
  scene: "desk",
  kind: "type",
  icon: "🪚",
  hint: "Which unit does the question ask for? Put every amount in that unit first.",
  tag: "converts_only_one_quantity",
  rounds: [
    { say: "Key in the answer in centimeters.", q: "A board is 2 meters long. You cut off 45 centimeters. How many centimeters are left?", ans: "155", trap: "1.55", why: "That is the answer in meters. The question asks for centimeters.", win: "200 − 45 = 155 centimeters." },
    { say: "Key in the answer in milliliters.", q: "You pour 3 glasses of 250 milliliters from a 2 liter bottle. How many milliliters are left?", ans: "1250", trap: "1750", why: "Three glasses were poured: 3 × 250 = 750 milliliters.", win: "2,000 − 750 = 1,250 milliliters." },
    { say: "Solve it by yourself.", alt: [{ q: "A race is 5 kilometers. Ana has run 1,200 meters. How many meters are left?", ans: "3800", trap: "1195" }, { q: "A recipe needs 2 pounds of flour. You have 12 ounces. How many more ounces do you need? 1 pound = 16 ounces.", ans: "20", trap: "10" }] },
  ],
}));
