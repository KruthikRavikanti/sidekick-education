// Circle Formulas. Skill 7.G.B.4-2.
// Using the formulas for the area and circumference of a circle. Mixing up the two formulas is the known slip.
Sidekick.game(Sidekick.play({
  title: "Circle Formulas",
  emoji: "🍕",
  premise: "Two formulas, two jobs. C = 2πr measures the edge. A = πr² measures the space inside.",
  outro: "Circumference = 2πr (a length). Area = πr² (square units).",
  scene: "kitchen",
  kind: "type",
  icon: "🍕",
  hint: "Area covers the inside and uses r × r. Circumference goes around and uses 2 × r.",
  tag: "mixes_up_circle_formulas",
  rounds: [
    { say: "Key in the area. Use 3.14 for π.", q: "A circle has radius 3.", ans: "28.26", trap: "18.84", why: "That is the circumference, 2 × 3.14 × 3. Area uses 3 × 3.", win: "3.14 × 9 = 28.26 square units." },
    { say: "Key in the circumference. Use 3.14 for π.", q: "A circle has radius 4.", ans: "25.12", trap: "50.24", why: "That is the area, 3.14 × 16. Circumference is 2 × 3.14 × 4.", win: "2 × 3.14 × 4 = 25.12 units." },
    { say: "Solve it by yourself. Use 3.14 for π.", alt: [{ q: "Find the area of a circle with radius 5.", ans: "78.5", trap: "31.4" }, { q: "Find the circumference of a circle with radius 10.", ans: "62.8", trap: "314" }, { q: "Find the area of a circle with radius 10.", ans: "314", trap: "62.8" }] },
  ],
}));
