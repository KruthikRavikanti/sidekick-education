// Complementary Angles Trade. Skill G-SRT.C.7-1.
// Explaining and using the relationship between the sine and cosine of complementary angles. Thinking sin x = cos x for every x is the known slip.
Sidekick.game(Sidekick.play({
  title: "Complementary Angles Trade",
  emoji: "🔁",
  premise: "The two acute angles of a right triangle add to 90°. The side opposite one is adjacent to the other, so sine and cosine swap.",
  outro: "sin x = cos(90° − x).",
  scene: "paper",
  kind: "type",
  icon: "🔁",
  unit: "°",
  hint: "What angle adds to this one to make 90°?",
  tag: "sin_equals_cos",
  rounds: [
    { say: "sin 30° equals the cosine of which angle?", ans: 60, trap: 30, why: "Sine and cosine swap between the two acute angles. The other angle is 90 − 30.", win: "sin 30° = cos 60°." },
    { say: "cos 20° equals the sine of which angle?", ans: 70, trap: 20, why: "Use the complement: 90 − 20.", win: "cos 20° = sin 70°." },
    { say: "Find the angle by yourself.", alt: [{ q: "sin 75° = cos of what angle?", ans: 15, trap: 75 }, { q: "cos 40° = sin of what angle?", ans: 50, trap: 40 }, { q: "sin 10° = cos of what angle?", ans: 80, trap: 10 }] },
  ],
}));
