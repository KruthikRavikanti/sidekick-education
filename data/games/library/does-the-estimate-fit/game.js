// Does the Estimate Fit?. Skill 7.EE.B.3-2.
// Assessing the reasonableness of answers using mental computation and estimation. Not checking is the known slip.
Sidekick.game(Sidekick.play({
  title: "Does the Estimate Fit?",
  emoji: "🚪",
  premise: "Round the numbers and work it out in your head. An exact answer far from your estimate needs another look.",
  outro: "Estimate with rounded numbers to check that an answer is reasonable.",
  scene: "desk",
  kind: "sort",
  fs: 5.2,
  hint: "Round each number to something easy. What do you get?",
  tag: "does_not_estimate",
  rounds: [
    { say: "A 9{3/4}-inch towel bar is centered on a 27{1/2}-inch door. About how far is it from each edge?", kind: "pick", fs: 5.6, yes: "about 9 inches|", no: "about 18 inches|about 37 inches|about 2 inches", trap: "about 18 inches", why: "18 is all the space left over. It is split between two sides.", win: "About 28 − 10 = 18, and half of 18 is 9." },
    { say: "Does each estimate make sense?", bins: "Makes sense|Check again", items: ["19.6 × 4.9 ≈ 100|$48.75 split 5 ways ≈ $10", "19.6 × 4.9 ≈ 1,000|$48.75 split 5 ways ≈ $100"], trap: ["19.6 × 4.9 ≈ 1,000", 0], why: "About 20 × 5 is 100.", win: "Rounded numbers give a quick check." },
    { say: "Sort these by yourself.", bins: "Makes sense|Check again", items: ["{1/2} of 61.8 ≈ 30|9.9 × 9.9 ≈ 100", "{1/2} of 61.8 ≈ 120|9.9 × 9.9 ≈ 20"], trap: ["9.9 × 9.9 ≈ 20", 0] },
  ],
}));
