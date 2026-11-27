// Find the Angle With Inverse Trig. Skill G-SRT.C.8-2.
// Using inverse trigonometric functions to find angles in right triangles. Reporting the ratio instead of the angle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Angle With Inverse Trig",
  emoji: "🧭",
  premise: "When you know two sides and want the angle, work backward: the inverse function turns a ratio into an angle.",
  outro: "Use sin⁻¹, cos⁻¹ or tan⁻¹ of the side ratio to find the angle.",
  scene: "field",
  kind: "type",
  icon: "🧭",
  unit: "°",
  hint: "Find the ratio. Then ask: which angle has that ratio?",
  tag: "ratio_not_angle",
  rounds: [
    { say: "A right triangle has legs 5 and 5. Key in each acute angle.", q: "tan of the angle = 5 ÷ 5 = 1, and tan 45° = 1", ans: 45, trap: 1, why: "1 is the ratio. The angle whose tangent is 1 is 45°.", win: "Equal legs give 45° angles." },
    { say: "The opposite side is 5 and the hypotenuse is 10. Key in the angle.", q: "sin 30° = 0.5 · sin 45° ≈ 0.71 · sin 60° ≈ 0.87", ans: 30, trap: 60, why: "5 ÷ 10 is 0.5. That matches sin 30°.", win: "The angle whose sine is 0.5 is 30°." },
    { say: "Find the angle by yourself.", alt: [{ q: "Adjacent 6, hypotenuse 12. cos 60° = 0.5 and cos 30° ≈ 0.87", ans: 60, trap: 30 }, { q: "The legs are 8 and 8. tan 45° = 1", ans: 45, trap: 1 }, { q: "Opposite 7, hypotenuse 14. sin 30° = 0.5 and sin 60° ≈ 0.87", ans: 30, trap: 60 }] },
  ],
}));
