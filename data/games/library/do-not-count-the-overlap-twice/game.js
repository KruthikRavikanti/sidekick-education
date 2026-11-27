// Do Not Count the Overlap Twice. Skill S-CP.B.7-1.
// Applying the addition rule and interpreting the answer. Forgetting to subtract the overlap is the known slip.
Sidekick.game(Sidekick.play({
  title: "Do Not Count the Overlap Twice",
  emoji: "♊",
  premise: "Add P(A) and P(B) and anything in both gets counted twice. Subtract the overlap once to fix it.",
  outro: "P(A or B) = P(A) + P(B) − P(A and B).",
  scene: "paper",
  kind: "type",
  icon: "♊",
  hint: "Add the two, then take away the part in both.",
  tag: "forgets_overlap",
  rounds: [
    { say: "Key in P(A or B).", q: "P(A) = 0.5 · P(B) = 0.3 · P(A and B) = 0.1", ans: "0.7", trap: "0.8", why: "0.8 counts the overlap twice. Subtract 0.1.", win: "0.5 + 0.3 − 0.1 = 0.7." },
    { say: "In a class of 30, 12 play soccer, 10 play tennis and 4 play both. Key in how many play soccer or tennis.", ans: "18", trap: "22", why: "The 4 who play both were counted in the 12 and again in the 10.", win: "12 + 10 − 4 = 18." },
    { say: "Find P(A or B) by yourself.", alt: [{ q: "P(A) = 0.4 · P(B) = 0.5 · P(A and B) = 0.2", ans: "0.7", trap: "0.9" }, { q: "P(A) = 0.6 · P(B) = 0.3 · P(A and B) = 0.1", ans: "0.8", trap: "0.9" }, { q: "P(A) = 0.25 · P(B) = 0.5 · P(A and B) = 0.05", ans: "0.7", trap: "0.75" }] },
  ],
}));
