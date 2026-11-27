// Sign and Size Check. Skill 7.NS.A.3-2.
// Using estimation to check answers with rational numbers. Accepting unreasonable signs or sizes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sign and Size Check",
  emoji: "🧐",
  premise: "Before trusting an answer, estimate. Is the sign sensible? Is the size about right?",
  outro: "Estimate to check both the sign and the size of an answer.",
  scene: "desk",
  kind: "sort",
  fs: 5.2,
  hint: "Round the numbers. Should the answer be positive or negative? About how big?",
  tag: "accepts_unreasonable_answer",
  rounds: [
    { say: "Is each answer reasonable?", bins: "Reasonable|Check again", items: ["−40 − 45 = −85|−19.8 × 5.1 ≈ −100", "−40 − 45 = 5|−19.8 × 5.1 ≈ 100"], trap: ["−40 − 45 = 5", 0], why: "Going down from −40 must end lower than −40.", win: "Sign and size both checked." },
    { say: "Sort these.", bins: "Reasonable|Check again", items: ["48.9 ÷ −7.1 ≈ −7|−6.2 + (−3.9) ≈ −10", "48.9 ÷ −7.1 ≈ 7|−6.2 + (−3.9) ≈ 10"], trap: ["−6.2 + (−3.9) ≈ 10", 0], why: "Two negatives added together stay negative.", win: "Estimates catch sign slips." },
    { say: "Sort these by yourself.", bins: "Reasonable|Check again", items: ["−9.8 × −3.1 ≈ 30|−52 + 11.7 ≈ −40", "−9.8 × −3.1 ≈ −30|−52 + 11.7 ≈ −64"], trap: ["−9.8 × −3.1 ≈ −30", 0] },
  ],
}));
