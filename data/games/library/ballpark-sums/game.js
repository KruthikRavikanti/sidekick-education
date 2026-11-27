// Ballpark Sums. Skill 4.NBT.A.3-2.
// Using rounding to estimate sums and differences. Computing exactly instead of estimating, or rounding to another place, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Ballpark Sums",
  emoji: "⚾",
  premise: "You do not always need the exact answer. Round each number, then add or subtract in your head.",
  outro: "Round first, then compute. The estimate is close to the real answer.",
  scene: "field",
  kind: "type",
  icon: "⚾",
  hint: "Round each number to the nearest thousand before you add or subtract.",
  tag: "computes_exactly",
  rounds: [
    { say: "Round each number to the nearest thousand. Key in the estimate.", q: "4,872 + 3,109", ans: 8000, trap: 7981, why: "That is the exact sum. Round first: 5,000 + 3,000.", win: "5,000 + 3,000 = 8,000." },
    { say: "Round to the nearest thousand, then subtract.", q: "6,214 − 2,890", ans: 3000, trap: 3324, why: "That is the exact answer. Round first: 6,000 − 3,000.", win: "6,000 − 3,000 = 3,000." },
    { say: "Estimate by yourself. Round to the nearest thousand.", alt: [{ q: "7,645 + 1,298", ans: 9000, trap: 8943 }, { q: "9,102 − 4,756", ans: 4000, trap: 4346 }] },
  ],
}));
