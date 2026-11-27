// How Much Overlap?. Skill 7.SP.B.3-1.
// Informally assessing the visual overlap of two distributions. Comparing only the means is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Much Overlap?",
  emoji: "🏀",
  premise: "Two groups can have different averages and still overlap a lot. It depends on how spread out each group is.",
  outro: "Compare the difference in centers with the spread. A small difference with a big spread means lots of overlap.",
  scene: "field",
  kind: "sort",
  fs: 4.8,
  hint: "How far apart are the centers? How wide is each group?",
  tag: "compares_only_means",
  rounds: [
    { say: "Do the two groups overlap a lot or only a little?", bins: "Lots of overlap|Little overlap", items: ["Means 180 and 190, spread 20 each|Means 50 and 52, spread 10 each", "Means 180 and 190, spread 2 each|Means 20 and 40, spread 3 each"], trap: ["Means 180 and 190, spread 20 each", 1], why: "The means are 10 apart, but each group spreads 20. They mix a lot.", win: "Spread decides the overlap." },
    { say: "Sort these.", bins: "Lots of overlap|Little overlap", items: ["Means 70 and 72, spread 8 each|Means 30 and 35, spread 15 each", "Means 70 and 90, spread 4 each|Means 30 and 60, spread 5 each"], trap: ["Means 30 and 35, spread 15 each", 1], why: "5 apart is small next to a spread of 15.", win: "Compare the difference with the spread." },
    { say: "Sort these by yourself.", bins: "Lots of overlap|Little overlap", items: ["Means 100 and 104, spread 12 each|Means 8 and 9, spread 6 each", "Means 100 and 130, spread 5 each|Means 8 and 20, spread 2 each"], trap: ["Means 100 and 104, spread 12 each", 1] },
  ],
}));
