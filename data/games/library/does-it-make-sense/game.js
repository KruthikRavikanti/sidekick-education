// Does It Make Sense?. Skill 3.OA.D.8-3.
// Checking answers with mental estimation: rounded numbers show whether a claimed result is reasonable.
Sidekick.game(Sidekick.play({
  title: "Does It Make Sense?",
  emoji: "🤨",
  premise: "A quick estimate tells you whether an answer is even close. Sort the claims that make sense from the ones that are way off.",
  outro: "Round the numbers and do it in your head. A good answer is close to your estimate.",
  scene: "paper",
  kind: "sort",
  hint: "Round each number to a friendly one, then work it out in your head.",
  tag: "does_not_check_reasonableness",
  rounds: [
    { say: "Estimate. Does each claim make sense?", bins: "Makes sense|Way off", items: ["198 + 305 is about 500|52 − 19 is about 30", "198 + 305 is about 800|41 × 2 is about 400"], trap: ["198 + 305 is about 800", 0], why: "Round first: 200 + 300 is 500, not 800.", win: "Estimating caught the claims that were way off." },
    { say: "Check these claims.", bins: "Makes sense|Way off", items: ["603 − 198 is about 400|49 + 52 is about 100", "603 − 198 is about 800|6 × 9 is about 500"], trap: ["603 − 198 is about 800", 0], why: "Round first: 600 − 200 is 400.", win: "A quick estimate is a good check." },
    { say: "Check these by yourself.", bins: "Makes sense|Way off", items: ["297 + 402 is about 700|81 − 29 is about 50|5 × 19 is about 100", "297 + 402 is about 300|8 × 11 is about 800"], trap: ["297 + 402 is about 300", 0] },
  ],
}));
