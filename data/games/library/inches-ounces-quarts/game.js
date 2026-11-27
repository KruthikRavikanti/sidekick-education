// Inches, Ounces, Quarts. Skill 5.MD.A.1-2.
// Converting among customary units in both directions. Using 10 instead of 12 or 16 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Inches, Ounces, Quarts",
  emoji: "🧰",
  premise: "Customary units each have their own number: 12 inches in a foot, 16 ounces in a pound, 4 quarts in a gallon.",
  outro: "Use the right conversion number. Multiply to go to a smaller unit, divide to go to a bigger one.",
  scene: "desk",
  kind: "type",
  icon: "🧰",
  hint: "Use the fact on the card. It is not 10.",
  tag: "uses_ten_for_everything",
  rounds: [
    { say: "Key in the inches.", q: "1 foot = 12 inches. 5 feet = ? inches", ans: "60", trap: "50", why: "A foot is 12 inches, not 10.", win: "5 × 12 = 60 inches." },
    { say: "This one goes to a bigger unit.", q: "1 pound = 16 ounces. 48 ounces = ? pounds", ans: "3", trap: "4.8", why: "A pound is 16 ounces, not 10. How many 16s are in 48?", win: "48 ÷ 16 = 3 pounds." },
    { say: "Key in the answer by yourself.", alt: [{ q: "1 gallon = 4 quarts. 3 gallons = ? quarts", ans: "12", trap: "30" }, { q: "1 foot = 12 inches. 2.5 feet = ? inches", ans: "30", trap: "25" }, { q: "1 foot = 12 inches. 36 inches = ? feet", ans: "3", trap: "3.6" }] },
  ],
}));
