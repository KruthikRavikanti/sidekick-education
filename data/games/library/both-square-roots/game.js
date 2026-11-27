// Both Square Roots. Skill 8.EE.A.2-1.
// Solving equations of the form x² = p and x³ = p. Forgetting the negative square root is the known slip.
Sidekick.game(Sidekick.play({
  title: "Both Square Roots",
  emoji: "🟦",
  premise: "Two different numbers square to the same thing. Both 7 and −7 give 49, so x² = 49 has two solutions.",
  outro: "x² = p has two solutions, a positive and a negative one. x³ = p has one.",
  scene: "night",
  kind: "pick",
  fs: 7,
  hint: "A negative times a negative is positive. Does the negative number work too?",
  tag: "forgets_negative_root",
  rounds: [
    { say: "Tap every solution of x^2 = 49.", yes: "7 −7", no: "49 24.5 −49 14", trap: "-−7", why: "−7 × −7 is also 49. It is a solution too.", win: "7 and −7." },
    { say: "Tap every solution of x^3 = 8.", yes: "2", no: "−2 4 24 3", trap: "−2", why: "−2 × −2 × −2 is −8. A cube keeps its sign.", win: "Only 2." },
    { say: "Tap every solution of x^2 = 81 by yourself.", yes: "9 −9", no: "81 40.5 −81 18", trap: "-−9" },
  ],
}));
