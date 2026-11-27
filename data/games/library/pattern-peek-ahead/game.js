// Pattern Peek Ahead. Skill GA-1-PAR.3.1-1.
// Predicting later terms in a repeating pattern: the child builds the 7th to 9th items, which takes knowing the repeating unit, not only the next item.
Sidekick.game(Sidekick.play({
  title: "Pattern Peek Ahead",
  emoji: "🔮",
  premise: "The pattern keeps going, even past what you can see. Work out what comes later, not just next.",
  outro: "When you know the part that repeats, you can tell what comes much later.",
  scene: "night",
  kind: "row",
  cast: "",
  hint: "Find the part that repeats. Then keep it going in your head.",
  tag: "only_names_the_next_item",
  rounds: [
    { say: "Six are shown. Build the 7th and the 8th.", pic: "🔴🔵🔴🔵🔴🔵", labels: "7th 8th", seq: "🔴 🔵", extra: "🔴 🟢", trap: "🔵 🔴", why: "After blue the pattern starts over with red.", win: "Red, then blue." },
    { say: "Six are shown. Build the 7th, 8th and 9th.", pic: "🔴🔵🟢🔴🔵🟢", labels: "7th 8th 9th", seq: "🔴 🔵 🟢", extra: "🔴 🔵", trap: "🔴 🔴 🔵", why: "The part that repeats is red, blue, green.", win: "Red, blue, green again." },
    { say: "Build the 7th, 8th and 9th by yourself.", alt: [{ pic: "⭐⭐🌙⭐⭐🌙", labels: "7th 8th 9th", seq: "⭐ ⭐ 🌙", extra: "🌙 ⭐", trap: "⭐ 🌙 ⭐" }, { pic: "🍎🍌🍌🍎🍌🍌", labels: "7th 8th 9th", seq: "🍎 🍌 🍌", extra: "🍎 🍌", trap: "🍎 🍎 🍌" }, { pic: "🟦🟦🟨🟦🟦🟨", labels: "7th 8th 9th", seq: "🟦 🟦 🟨", extra: "🟨 🟦", trap: "🟦 🟨 🟦" }] },
  ],
}));
