// Arc Length. Skill G-C.B.5-1.
// Deriving that the length of an arc is proportional to the radius. Using the diameter in place of the radius is the known slip.
Sidekick.game(Sidekick.play({
  title: "Arc Length",
  emoji: "🌈",
  premise: "An arc is a fraction of the whole circumference. The central angle tells you which fraction.",
  outro: "Arc length = (angle ÷ 360) × 2πr.",
  scene: "sky",
  kind: "type",
  icon: "🌈",
  unit: "π",
  hint: "What fraction of 360° is the angle? Take that fraction of 2πr.",
  tag: "uses_diameter",
  rounds: [
    { say: "Key in the arc length in terms of π.", q: "A 60° angle in a circle of radius 6", fig: { type: "circle", v: [], slice: 60, r: "6" }, ans: 2, trap: 4, why: "The circumference is 2π × 6 = 12π, not 24π. One sixth of 12π is 2π.", win: "One sixth of 12π is 2π." },
    { say: "Key in the arc length in terms of π.", q: "A 90° angle in a circle of radius 8", ans: 4, trap: 8, why: "The circumference is 16π. A quarter of it is 4π.", win: "One quarter of 16π is 4π." },
    { say: "Find the arc length by yourself, in terms of π.", alt: [{ q: "A 180° angle in a circle of radius 5", ans: 5, trap: 10 }, { q: "A 120° angle in a circle of radius 3", ans: 2, trap: 4 }, { q: "A 45° angle in a circle of radius 8", ans: 2, trap: 4 }] },
  ],
}));
