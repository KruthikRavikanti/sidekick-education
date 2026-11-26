// Fact Fireworks. Skill 2.OA.B.2-1.
// Recalling sums of two one-digit numbers: facts are sorted by their totals, which rewards knowing them over counting.
Sidekick.game(Sidekick.play({
  title: "Fact Fireworks",
  emoji: "🎆",
  premise: "Each rocket carries an adding fact. Send every rocket to the cloud that shows its sum.",
  outro: "Knowing your sums by heart makes everything else faster.",
  scene: "night",
  kind: "sort",
  cast: "🎆 ⭐ 🌙 ⭐",
  hint: "Use a fact you know. Make a ten, or use a double.",
  tag: "fact_slip",
  rounds: [
    { say: "Send each fact to its sum.", bins: "13|15|17", items: ["6 + 7|9 + 4|8 + 5", "8 + 7|9 + 6", "9 + 8"], trap: ["8 + 7", 0], why: "7 + 7 is 14, and one more is 15.", win: "Every rocket found its cloud." },
    { say: "New sums. Where does each fact go?", bins: "12|14|16", items: ["7 + 5|8 + 4|9 + 3", "8 + 6|7 + 7|9 + 5", "9 + 7|8 + 8"], trap: ["8 + 6", 2], why: "8 + 2 makes ten, and 4 more is 14.", win: "All sorted." },
    { say: "Sort these facts by yourself.", bins: "11|13|15", items: ["6 + 5|7 + 4|8 + 3", "7 + 6|9 + 4", "8 + 7|9 + 6"], trap: ["7 + 6", 0] },
  ],
}));
