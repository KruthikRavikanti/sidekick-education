// Fact Hive. Skill K.OA.A.5-1.
// Addition facts within 5: each fact tile belongs in the cell with its total, so the child recalls sums instead of counting everything from 1.
Sidekick.game(Sidekick.play({
  title: "Fact Hive",
  emoji: "🐝",
  premise: "Each bee carries a little adding fact. Fly every bee to the hive cell that shows its total.",
  outro: "You know your adding facts up to 5!",
  scene: "meadow",
  kind: "sort",
  cast: "🐝 🌼 🌻 🌼",
  hint: "Start with the first number and count on the second.",
  tag: "fact_slip_within_5",
  rounds: [
    { say: "Fly each fact to its total.", bins: "3|4|5", items: ["2 + 1|1 + 2", "3 + 1|2 + 2", "4 + 1|2 + 3"], trap: ["2 + 2", 0], why: "2 and 2 make 4.", win: "Every bee found its cell." },
    { say: "New facts. Where does each bee go?", bins: "2|4|5", items: ["1 + 1|2 + 0", "1 + 3|4 + 0", "3 + 2|1 + 4"], trap: ["1 + 3", 2], why: "1 and 3 make 4.", win: "All sorted by total." },
    { say: "Sort these facts by yourself.", bins: "3|4|5", items: ["3 + 0|1 + 2", "2 + 2|1 + 3", "5 + 0|3 + 2|4 + 1"], trap: ["3 + 2", 1] },
  ],
}));
