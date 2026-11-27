// Volume of a Ball. Skill 8.G.C.9-3.
// Using the formula for the volume of a sphere. Squaring the radius instead of cubing it is the known slip.
Sidekick.game(Sidekick.play({
  title: "Volume of a Ball",
  emoji: "🏀",
  premise: "A sphere fills space in three directions, so its radius is cubed, not squared.",
  outro: "V = four thirds × πr³. Cube the radius.",
  scene: "field",
  kind: "type",
  icon: "🏀",
  unit: "π",
  hint: "Radius × radius × radius. Then multiply by 4 and divide by 3.",
  tag: "squares_instead_of_cubes",
  rounds: [
    { say: "Key in the volume in terms of π.", q: "A sphere has radius 3.", ans: 36, trap: 12, why: "That squared the radius. Cube it: 3 × 3 × 3 = 27.", win: "27 × 4 ÷ 3 = 36π." },
    { say: "Key in the volume in terms of π.", q: "A sphere has radius 6.", ans: 288, trap: 48, why: "Cube the radius: 6 × 6 × 6 = 216.", win: "216 × 4 ÷ 3 = 288π." },
    { say: "Find the volume by yourself, in terms of π.", alt: [{ q: "A sphere has radius 9.", ans: 972, trap: 108 }, { q: "A sphere has radius 12.", ans: 2304, trap: 192 }, { q: "A sphere has radius 30.", ans: 36000, trap: 1200 }] },
  ],
}));
