// Find the Side With Trig. Skill G-SRT.C.8-1.
// Using trigonometric ratios to solve right triangles. Setting up the ratio upside down is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Side With Trig",
  emoji: "🧗",
  premise: "Know one side and one acute angle of a right triangle and a trig ratio gives you any other side.",
  outro: "Choose the ratio that links the side you know with the side you want, then solve.",
  scene: "field",
  kind: "type",
  icon: "🧗",
  hint: "Which sides are involved: opposite, adjacent, hypotenuse? Pick the matching ratio.",
  tag: "ratio_upside_down",
  rounds: [
    { say: "Key in the side opposite the 30° angle.", q: "The hypotenuse is 10. sin 30° = 0.5", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: [null, "?", "10"], angles: ["30°", null, null], right: 1, v: [] }, ans: 5, trap: 20, why: "Opposite = hypotenuse × sin 30°. Multiply by 0.5, do not divide.", win: "10 × 0.5 = 5." },
    { say: "Key in the side adjacent to the 60° angle.", q: "The hypotenuse is 12. cos 60° = 0.5", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["?", null, "12"], angles: ["60°", null, null], right: 1, v: [] }, ans: 6, trap: 24, why: "Adjacent = hypotenuse × cos 60°.", win: "12 × 0.5 = 6." },
    { say: "Find the side by yourself.", alt: [{ q: "Angle 30°, hypotenuse 16, sin 30° = 0.5. Find the opposite side.", ans: 8, trap: 32 }, { q: "Angle 45°, adjacent side 9, tan 45° = 1. Find the opposite side.", ans: 9, trap: 18 }, { q: "Angle 60°, hypotenuse 20, cos 60° = 0.5. Find the adjacent side.", ans: 10, trap: 40 }] },
  ],
}));
