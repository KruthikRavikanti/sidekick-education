// Twelve, Sixty, Sixteen. Skill 4.MD.A.1-2.
// Converting customary units and time from larger to smaller units. Using 10 or 100 for every conversion is the known slip.
Sidekick.game(Sidekick.play({
  title: "Twelve, Sixty, Sixteen",
  emoji: "🧮",
  premise: "Feet, hours and pounds do not go by tens. Each one has its own special number.",
  outro: "Customary units and time each have their own conversion number.",
  scene: "desk",
  kind: "type",
  icon: "📏",
  hint: "Use the fact on the card. It is not always 10.",
  tag: "uses_ten_for_everything",
  rounds: [
    { say: "Key in the inches.", q: "1 foot = 12 inches. 4 feet = ? inches", ans: 48, trap: 40, why: "A foot is 12 inches, not 10. Count four 12s.", win: "4 × 12 = 48 inches." },
    { say: "Key in the minutes.", q: "1 hour = 60 minutes. 3 hours = ? minutes", ans: 180, trap: 300, why: "An hour has 60 minutes, not 100.", win: "3 × 60 = 180 minutes." },
    { say: "Key in the answer by yourself.", alt: [{ q: "1 pound = 16 ounces. 5 pounds = ? ounces", ans: 80, trap: 50 }, { q: "1 yard = 3 feet. 7 yards = ? feet", ans: 21, trap: 70 }, { q: "1 minute = 60 seconds. 4 minutes = ? seconds", ans: 240, trap: 400 }] },
  ],
}));
