// Toy Shelf. Skill K.MD.B.3-1.
// Sorting into given categories: each round names one rule, and one object would fit a different rule, which is where a child who switches rules slips.
Sidekick.game(Sidekick.play({
  title: "Toy Shelf",
  emoji: "🧸",
  premise: "Tidy the shelf by one rule at a time. Once you pick a rule, keep it for every single thing.",
  outro: "A sorting rule only works when you keep it the whole way through.",
  scene: "desk",
  kind: "sort",
  cast: "🧸 🪀 🎲 🧩",
  hint: "Say the rule out loud for each thing before you drop it.",
  tag: "changes_the_rule",
  rounds: [
    { say: "Sort by color. Keep the same rule for every one.", bins: "Red|Blue", items: ["🍎 🍓 🌹", "🫐 🐳 💙"], trap: ["🍓", 1], why: "The rule is color. A strawberry is red.", win: "Sorted by color." },
    { say: "New rule: is it food? Sort the same things again.", bins: "Food|Not food", items: ["🍎 🍓 🫐", "🌹 🐳 💙"], trap: ["🫐", 1], why: "The rule now is food. A blueberry is food, even though it is blue.", win: "Same things, new rule." },
    { say: "New rule: can it fly? Sort every one by that rule only.", bins: "Flies|Does not fly", items: ["🐦 ✈️ 🦋", "🐢 🚗 🐟"], trap: ["✈️", 1] },
  ],
}));
