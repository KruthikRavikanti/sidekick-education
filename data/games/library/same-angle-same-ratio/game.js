// Same Angle, Same Ratio. Skill G-SRT.C.6-1.
// Understanding that side ratios in right triangles are properties of the angles. Thinking bigger triangles have a bigger sine is the known slip.
Sidekick.game(Sidekick.play({
  title: "Same Angle, Same Ratio",
  emoji: "📐",
  premise: "All right triangles with the same acute angle are similar. So the ratio of two sides depends only on the angle, not on the size.",
  outro: "Trig ratios are properties of the angle: sin 30° is 0.5 in every right triangle.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "If both sides double, what happens to their ratio?",
  tag: "bigger_triangle_bigger_sine",
  rounds: [
    { say: "A right triangle has opposite side 3 and hypotenuse 6 for its 30° angle. A triangle twice as big has 6 and 12. Key in opposite ÷ hypotenuse for the big one.", ans: "0.5", trap: "1", why: "Both sides doubled, so the ratio is unchanged: 6 ÷ 12.", win: "3 ÷ 6 and 6 ÷ 12 are both 0.5." },
    { say: "True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["sin 30° is the same in every right triangle.|Similar triangles have equal side ratios.", "A bigger triangle has a bigger sin 30°.|Sine depends on how long the sides are."], trap: ["A bigger triangle has a bigger sin 30°.", 0], why: "Scaling multiplies both sides by the same number. The ratio stays put.", win: "The angle sets the ratio." },
    { say: "Key in opposite ÷ hypotenuse for the scaled triangle by yourself.", alt: [{ q: "Opposite 5, hypotenuse 10. The triangle is tripled.", ans: "0.5", trap: "1.5" }, { q: "Opposite 3, hypotenuse 5. The triangle is doubled.", ans: "0.6", trap: "1.2" }, { q: "Opposite 4, hypotenuse 8. The triangle is halved.", ans: "0.5", trap: "0.25" }] },
  ],
}));
