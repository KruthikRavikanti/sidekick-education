// Independent or Not?. Skill S-CP.A.2-1.
// Understanding that two events are independent if the probability of both is the product of their probabilities. Thinking mutually exclusive means independent is the known slip.
Sidekick.game(Sidekick.play({
  title: "Independent or Not?",
  emoji: "🎰",
  premise: "Two events are independent when one happening tells you nothing about the other. There is a quick multiplication test.",
  outro: "A and B are independent exactly when P(A and B) = P(A) × P(B).",
  scene: "desk",
  kind: "sort",
  fs: 4.8,
  hint: "Multiply P(A) by P(B). Does it equal P(A and B)?",
  tag: "exclusive_means_independent",
  rounds: [
    { say: "Use the product test on each pair.", bins: "Independent|Not independent", items: ["P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.2|P(A) = 0.3, P(B) = 0.5, P(A and B) = 0.15", "P(A) = 0.5, P(B) = 0.4, P(A and B) = 0|P(A) = 0.6, P(B) = 0.5, P(A and B) = 0.4"], trap: ["P(A) = 0.5, P(B) = 0.4, P(A and B) = 0", 0], why: "These can never happen together. Knowing A happened tells you B did not, so they are linked.", win: "0.5 × 0.4 = 0.2 passes the test." },
    { say: "A and B are independent. P(A) = 0.5 and P(B) = 0.6. Key in P(A and B).", kind: "type", icon: "🎰", ans: "0.3", trap: "1.1", why: "That adds. Independent events multiply: 0.5 × 0.6.", win: "0.5 × 0.6 = 0.3." },
    { say: "Sort these by yourself.", bins: "Independent|Not independent", items: ["P(A) = 0.2, P(B) = 0.5, P(A and B) = 0.1|P(A) = 0.4, P(B) = 0.4, P(A and B) = 0.16", "P(A) = 0.2, P(B) = 0.5, P(A and B) = 0|P(A) = 0.4, P(B) = 0.4, P(A and B) = 0.4"], trap: ["P(A) = 0.2, P(B) = 0.5, P(A and B) = 0", 0] },
  ],
}));
