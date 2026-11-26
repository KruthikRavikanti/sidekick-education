// Fruit Stand Tally. Skill K.MD.B.3-3.
// Ordering categories by count: the child reads a bar for each fruit and lines the fruits up from most to fewest. Going from fewest to most is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fruit Stand Tally",
  emoji: "🍊",
  premise: "The fruit stand counted what it sold today. Line the fruits up from the most sold to the fewest.",
  outro: "The numbers tell which group has the most and which has the fewest.",
  scene: "meadow",
  kind: "row",
  cast: "",
  hint: "Find the tallest bar first. It has the most.",
  tag: "orders_fewest_first",
  rounds: [
    { say: "Line up the fruits from the most to the fewest.", fig: { type: "bars", given: [["🍎", 5], ["🍌", 2], ["🍊", 4]], values: true, cap: 6 }, seq: "🍎 🍊 🍌", trap: "reverse", why: "That goes from fewest to most. Start with the tallest bar.", win: "5, then 4, then 2." },
    { say: "A new day at the stand. Most to fewest.", fig: { type: "bars", given: [["🍇", 3], ["🍓", 6], ["🍐", 1]], values: true, cap: 6 }, seq: "🍓 🍇 🍐", trap: "reverse", why: "That goes from fewest to most. Start with the tallest bar.", win: "6, then 3, then 1." },
    { say: "Line these up from most to fewest by yourself.", alt: [{ fig: { type: "bars", given: [["🥕", 2], ["🌽", 5], ["🥦", 4]], values: true, cap: 6 }, seq: "🌽 🥦 🥕", trap: "reverse" }, { fig: { type: "bars", given: [["🍋", 6], ["🥝", 3], ["🍑", 4]], values: true, cap: 6 }, seq: "🍋 🍑 🥝", trap: "reverse" }] },
  ],
}));
