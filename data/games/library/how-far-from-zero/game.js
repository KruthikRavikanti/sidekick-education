// How Far From Zero. Skill N-CN.A.3-2.
// Finding the modulus of a complex number. Adding the parts in place of the root of the sum of squares is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Far From Zero",
  emoji: "📏",
  premise: "The modulus of a complex number is its distance from 0 on the complex plane. The two parts are the legs of a right triangle.",
  outro: "The modulus of a + bi is √(a^2 + b^2).",
  scene: "space",
  kind: "type",
  icon: "📏",
  hint: "Square each part, add, then take the square root.",
  tag: "adds_parts",
  rounds: [
    { say: "Key in the modulus of 3 + 4i.", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["3", "4", "?"], right: 1, v: [], h: 34 }, ans: 5, trap: 7, why: "7 walks along both legs. The straight distance is √(9 + 16).", win: "√25 = 5." },
    { say: "Key in the modulus of 5 + 12i.", q: "√(25 + 144)", ans: 13, trap: 17, why: "Square first: 25 + 144 = 169. Then the root.", win: "√169 = 13." },
    { say: "Find the modulus by yourself.", alt: [{ q: "6 + 8i", ans: 10, trap: 14 }, { q: "8 − 15i", ans: 17, trap: 23 }, { q: "−4 + 3i", ans: 5, trap: 7 }] },
  ],
}));
