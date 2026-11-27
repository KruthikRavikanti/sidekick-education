// Which Is Faster?. Skill 8.EE.B.5-2.
// Comparing two proportional relationships represented in different ways. Comparing numbers without units is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Is Faster?",
  emoji: "🏎️",
  premise: "One rate is an equation, the other is a sentence. Turn both into the same kind of unit rate before you compare.",
  outro: "Find each unit rate in the same units, then compare.",
  scene: "city",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "What does each one do in ONE hour or ONE minute?",
  tag: "compares_without_units",
  rounds: [
    { say: "Find each speed, then pick the faster car.", rows: [["Car A: y = 55x", "55 mph"], ["Car B: 100 miles in 2 hours", "50 mph"], ["the faster car", "Car A"]], extra: "Car B|100 mph", trap: [2, "Car B"], why: "100 is a distance, not a speed. Car B goes 50 miles each hour.", win: "55 mph beats 50 mph." },
    { say: "Find each rate, then pick the faster tap.", rows: [["Tap A: 12 liters in 4 minutes", "3 L per min"], ["Tap B: y = 2.5x", "2.5 L per min"], ["the faster tap", "Tap A"]], extra: "Tap B|12 L per min", trap: [2, "Tap B"], why: "Tap A gives 12 ÷ 4 = 3 liters each minute. That beats 2.5.", win: "3 beats 2.5." },
    { say: "Compare these by yourself.", rows: [["Printer A: y = 20x", "20 per min"], ["Printer B: 90 pages in 5 minutes", "18 per min"], ["the faster printer", "Printer A"]], extra: "Printer B|90 per min", trap: [2, "Printer B"] },
  ],
}));
