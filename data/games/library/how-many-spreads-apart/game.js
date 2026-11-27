// How Many Spreads Apart?. Skill 7.SP.B.3-2.
// Expressing the difference between centers as a multiple of a measure of variability. Ignoring variability is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Many Spreads Apart?",
  emoji: "📏",
  premise: "To judge how different two groups are, measure the distance between their centers in units of spread.",
  outro: "Difference in centers ÷ spread tells how many spreads apart the groups are.",
  scene: "field",
  kind: "type",
  icon: "📏",
  hint: "Find the difference between the means. Divide by the spread.",
  tag: "ignores_variability",
  rounds: [
    { say: "Key in how many spreads apart the means are.", q: "The means differ by 10. The spread (MAD) of each group is 5.", ans: 2, trap: 10, why: "10 is just the difference. Divide it by the spread, 5.", win: "10 ÷ 5 = 2 spreads apart." },
    { say: "Key in how many spreads apart.", q: "Team A mean: 180 cm · Team B mean: 192 cm · MAD of each: 4 cm", ans: 3, trap: 12, why: "The difference is 12. Now divide by the MAD, 4.", win: "12 ÷ 4 = 3 spreads apart." },
    { say: "Find it by yourself.", alt: [{ q: "Means: 70 and 85 · MAD of each: 5", ans: 3, trap: 15 }, { q: "Means: 20 and 28 · MAD of each: 2", ans: 4, trap: 8 }, { q: "Means: 100 and 106 · MAD of each: 3", ans: 2, trap: 6 }] },
  ],
}));
