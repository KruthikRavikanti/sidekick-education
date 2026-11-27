// Given That. Skill S-CP.A.3-1.
// Understanding the conditional probability of A given B as P(A and B) ÷ P(B). Reporting P(A and B) as the conditional probability is the known slip.
Sidekick.game(Sidekick.play({
  title: "Given That",
  emoji: "🔦",
  premise: "Once you know B happened, B becomes your whole world. The chance of A inside that world is a conditional probability.",
  outro: "P(A given B) = P(A and B) ÷ P(B).",
  scene: "night",
  kind: "type",
  icon: "🔦",
  hint: "Divide the overlap by the probability of the thing you know happened.",
  tag: "joint_as_conditional",
  rounds: [
    { say: "Key in P(A given B).", q: "P(A and B) = 0.2 · P(B) = 0.5", ans: "0.4", trap: "0.2", why: "0.2 is the overlap out of everything. Inside B alone it is 0.2 ÷ 0.5.", win: "0.2 ÷ 0.5 = 0.4." },
    { say: "Key in P(A given B).", q: "P(A and B) = 0.3 · P(B) = 0.6", ans: "0.5", trap: "0.3", why: "Divide by P(B): 0.3 ÷ 0.6.", win: "0.3 ÷ 0.6 = 0.5." },
    { say: "Find P(A given B) by yourself.", alt: [{ q: "P(A and B) = 0.1 · P(B) = 0.4", ans: "0.25", trap: "0.1" }, { q: "P(A and B) = 0.12 · P(B) = 0.2", ans: "0.6", trap: "0.12" }, { q: "P(A and B) = 0.4 · P(B) = 0.5", ans: "0.8", trap: "0.4" }] },
  ],
}));
