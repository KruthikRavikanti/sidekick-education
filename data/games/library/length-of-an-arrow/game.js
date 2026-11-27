// Length of an Arrow. Skill N-VM.A.1-2.
// Using appropriate symbols for vectors and their magnitudes. Confusing the magnitude with a component is the known slip.
Sidekick.game(Sidekick.play({
  title: "Length of an Arrow",
  emoji: "🏹",
  premise: "The vector (3, 4) goes 3 across and 4 up. Its magnitude is the length of the arrow, not either of those numbers.",
  outro: "The magnitude of the vector (a, b) is √(a^2 + b^2).",
  scene: "field",
  kind: "type",
  icon: "🏹",
  hint: "The components are the legs. The magnitude is the hypotenuse.",
  tag: "component_as_magnitude",
  rounds: [
    { say: "Key in the magnitude of the vector (3, 4).", fig: { type: "poly", pts: [[12, 86], [88, 86], [88, 26]], sides: ["3", "4", "?"], right: 1, v: [], h: 34 }, ans: 5, trap: 4, why: "4 is one component. The arrow is the hypotenuse: √(9 + 16).", win: "√25 = 5." },
    { say: "Key in the magnitude of the vector (6, 8).", q: "√(36 + 64)", ans: 10, trap: 8, why: "8 is the upward part. The whole arrow is √100.", win: "√100 = 10." },
    { say: "Find the magnitude by yourself.", alt: [{ q: "the vector (5, 12)", ans: 13, trap: 12 }, { q: "the vector (8, 15)", ans: 17, trap: 15 }, { q: "the vector (−3, 4)", ans: 5, trap: 1 }] },
  ],
}));
