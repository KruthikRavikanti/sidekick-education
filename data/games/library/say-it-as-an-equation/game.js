// Say It as an Equation. Skill 4.OA.A.1-2.
// Writing a multiplicative comparison as an equation: 18 is 3 times as many as 6 becomes 18 = 3 × 6. Using addition is the known slip.
Sidekick.game(Sidekick.play({
  title: "Say It as an Equation",
  emoji: "🖊️",
  premise: "Turn each comparison in words into an equation. Times as many means multiply.",
  outro: "A times-as-many statement becomes a multiplication equation.",
  scene: "paper",
  kind: "row",
  hint: "Times as many is multiplication, not addition.",
  tag: "uses_addition",
  rounds: [
    { say: "Build the equation.", q: "18 is 3 times as many as 6.", seq: "18 = 3 × 6", also: ["18 = 6 × 3", "3 × 6 = 18", "6 × 3 = 18"], extra: "+", trap: "18 = 3 + 6", why: "Check it: 3 + 6 is 9, not 18. Times as many means multiply.", win: "18 = 3 × 6." },
    { say: "Build this equation.", q: "32 is 4 times as many as 8.", seq: "32 = 4 × 8", also: ["32 = 8 × 4", "4 × 8 = 32", "8 × 4 = 32"], extra: "+", trap: "32 = 4 + 8", why: "Check it: 4 + 8 is 12, not 32. Times as many means multiply.", win: "32 = 4 × 8." },
    { say: "Build this one by yourself.", alt: [{ q: "45 is 5 times as many as 9.", seq: "45 = 5 × 9", also: ["45 = 9 × 5", "5 × 9 = 45", "9 × 5 = 45"], extra: "+", trap: "45 = 5 + 9" }, { q: "28 is 7 times as many as 4.", seq: "28 = 7 × 4", also: ["28 = 4 × 7", "7 × 4 = 28", "4 × 7 = 28"], extra: "+", trap: "28 = 7 + 4" }] },
  ],
}));
