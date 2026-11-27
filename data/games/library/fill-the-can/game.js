// Fill the Can. Skill 8.G.C.9-1.
// Using the formula for the volume of a cylinder. Using the diameter in place of the radius is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fill the Can",
  emoji: "🥫",
  premise: "A cylinder is a circle stacked up. Its volume is the area of the circle times the height. Use the radius, not the diameter.",
  outro: "V = πr²h. Halve the diameter first to get the radius.",
  scene: "kitchen",
  kind: "type",
  icon: "🥫",
  unit: "π",
  hint: "Radius × radius × height. Is the number you have a radius or a diameter?",
  tag: "diameter_for_radius",
  rounds: [
    { say: "Key in the volume in terms of π.", q: "A cylinder has radius 3 and height 10.", ans: 90, trap: 360, why: "That used 6, the diameter. Radius 3 gives 3 × 3 × 10.", win: "9 × 10 = 90π." },
    { say: "Key in the volume in terms of π.", q: "A cylinder has diameter 4 and height 5.", ans: 20, trap: 80, why: "The diameter is 4, so the radius is 2: 2 × 2 × 5.", win: "4 × 5 = 20π." },
    { say: "Find the volume by yourself, in terms of π.", alt: [{ q: "A cylinder has radius 2 and height 7.", ans: 28, trap: 112 }, { q: "A cylinder has diameter 10 and height 2.", ans: 50, trap: 200 }, { q: "A cylinder has radius 5 and height 4.", ans: 100, trap: 400 }] },
  ],
}));
