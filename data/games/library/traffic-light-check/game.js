// Traffic Light Check. Skill 4.OA.A.3-3.
// Using estimation to assess reasonableness: rounded mental computation exposes answers that are far off.
Sidekick.game(Sidekick.play({
  title: "Traffic Light Check",
  emoji: "🚦",
  premise: "Before you trust an answer, estimate. Green light for answers that are close, red light for ones that cannot be right.",
  outro: "A quick estimate shows whether an answer is reasonable.",
  scene: "city",
  kind: "sort",
  hint: "Round the numbers and work it out in your head first.",
  tag: "accepts_unreasonable_answer",
  rounds: [
    { say: "Estimate. Is each answer reasonable?", bins: "Reasonable|Not reasonable", items: ["398 + 207 = 605|19 × 5 = 95", "398 + 207 = 905|19 × 5 = 950"], trap: ["398 + 207 = 905", 0], why: "About 400 + 200 is 600. An answer of 905 is far off.", win: "Estimating caught them." },
    { say: "Check these answers.", bins: "Reasonable|Not reasonable", items: ["6 × 24 − 4 × 30 = 24|803 − 398 = 405", "6 × 24 − 4 × 30 = 264|49 × 4 = 496"], trap: ["6 × 24 − 4 × 30 = 264", 0], why: "About 150 − 120 is 30. An answer of 264 is far off.", win: "A quick estimate is a good check." },
    { say: "Check these by yourself.", bins: "Reasonable|Not reasonable", items: ["31 × 9 = 279|5,012 − 2,987 = 2,025|7 × 98 = 686", "31 × 9 = 2,790|5,012 − 2,987 = 3,975"], trap: ["31 × 9 = 2,790", 0] },
  ],
}));
