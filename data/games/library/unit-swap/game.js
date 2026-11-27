// Unit Swap. Skill 6.RP.A.3-6.
// Using ratio reasoning to convert measurement units. Multiplying when division is needed is the known slip.
Sidekick.game(Sidekick.play({
  title: "Unit Swap",
  emoji: "📏",
  premise: "A conversion is a ratio. Decide whether you need more of the new unit or fewer, then multiply or divide.",
  outro: "Going to a bigger unit gives a smaller number. Going to a smaller unit gives a bigger one.",
  scene: "desk",
  kind: "type",
  icon: "📏",
  hint: "Is the new unit bigger or smaller? Bigger units means fewer of them.",
  tag: "multiplies_instead_of_dividing",
  rounds: [
    { say: "Key in the yards.", q: "3 feet = 1 yard. How many yards are 15 feet?", ans: "5", trap: "45", why: "A yard is bigger than a foot, so the number of yards is smaller.", win: "15 ÷ 3 = 5 yards." },
    { say: "Key in the hours.", q: "60 minutes = 1 hour. How many hours are 150 minutes?", ans: "2.5", trap: "9000", why: "Hours are bigger than minutes. Divide.", win: "150 ÷ 60 = 2.5 hours." },
    { say: "Convert by yourself.", alt: [{ q: "4 quarts = 1 gallon. How many gallons are 20 quarts?", ans: "5", trap: "80" }, { q: "16 ounces = 1 pound. How many ounces are 3 pounds?", ans: "48", trap: "5.3" }, { q: "100 centimeters = 1 meter. How many meters are 250 centimeters?", ans: "2.5", trap: "25000" }] },
  ],
}));
