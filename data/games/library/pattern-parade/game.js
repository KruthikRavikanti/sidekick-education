// Pattern Parade. Skill GA-K-PAR.6.1-1.
// Finding the unit that repeats: the child builds just the repeating part of a pattern. Copying only the first two pieces of an ABB pattern is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pattern Parade",
  emoji: "🥁",
  premise: "The parade marches in a pattern that keeps starting over. Find the part that repeats and build it once.",
  outro: "A pattern is one small part repeated again and again.",
  scene: "city",
  kind: "row",
  cast: "",
  hint: "Find where the pattern starts over. Everything before that is the part that repeats.",
  tag: "misses_the_repeating_unit",
  rounds: [
    { say: "Find the part that repeats. Build it once.", pic: "🔴🔵🔴🔵🔴🔵", seq: "🔴 🔵", extra: "🔴 🟢", trap: "🔴 🔴", why: "Look for where the pattern starts over: red, blue, then red again.", win: "Red, blue. Then it starts over." },
    { say: "This pattern has a longer part. Build it once.", pic: "🟡🟢🟢🟡🟢🟢🟡🟢🟢", seq: "🟡 🟢 🟢", extra: "🟡 🟢", trap: "🟡 🟢", why: "There are two greens before it starts over.", win: "Yellow, green, green." },
    { say: "Build the repeating part by yourself.", alt: [{ pic: "🔺🟦🟦🔺🟦🟦🔺🟦🟦", seq: "🔺 🟦 🟦", extra: "🔺 🟦", trap: "🔺 🟦" }, { pic: "⭐🌙☀️⭐🌙☀️⭐🌙☀️", seq: "⭐ 🌙 ☀️", extra: "⭐ 🌙", trap: "⭐ 🌙" }, { pic: "🍎🍎🍌🍎🍎🍌🍎🍎🍌", seq: "🍎 🍎 🍌", extra: "🍌 🍎", trap: "🍎 🍌" }] },
  ],
}));
