// Slice of the Circle. Skill G-C.B.5-2.
// Deriving the formula for the area of a sector. Dividing the angle by 180 instead of 360 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Slice of the Circle",
  emoji: "🍕",
  premise: "A sector is a slice of the circle. Its area is the same fraction of the whole area as its angle is of 360°.",
  outro: "Sector area = (angle ÷ 360) × πr².",
  scene: "kitchen",
  kind: "type",
  icon: "🍕",
  unit: "π",
  hint: "A full turn is 360°. What fraction of that is the slice?",
  tag: "uses_180",
  rounds: [
    { say: "Key in the area of the sector in terms of π.", q: "A 90° sector of a circle with radius 4", fig: { type: "circle", v: [], slice: 90, r: "4" }, ans: 4, trap: 8, why: "90° is a quarter of 360°, not half. A quarter of 16π is 4π.", win: "One quarter of 16π is 4π." },
    { say: "Key in the area of the sector in terms of π.", q: "A 60° sector of a circle with radius 6", ans: 6, trap: 12, why: "60° is one sixth of the full turn. One sixth of 36π is 6π.", win: "One sixth of 36π is 6π." },
    { say: "Find the sector area by yourself, in terms of π.", alt: [{ q: "A 180° sector of a circle with radius 2", ans: 2, trap: 4 }, { q: "A 120° sector of a circle with radius 3", ans: 3, trap: 6 }, { q: "A 45° sector of a circle with radius 4", ans: 2, trap: 4 }] },
  ],
}));
