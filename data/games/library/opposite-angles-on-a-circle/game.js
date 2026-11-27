// Opposite Angles on a Circle. Skill G-C.A.3-2.
// Proving properties of angles for a quadrilateral inscribed in a circle. Thinking opposite angles are equal is the known slip.
Sidekick.game(Sidekick.play({
  title: "Opposite Angles on a Circle",
  emoji: "🔷",
  premise: "When all four corners of a quadrilateral sit on a circle, its opposite angles always add to 180°.",
  outro: "Opposite angles of a quadrilateral inscribed in a circle are supplementary.",
  scene: "paper",
  kind: "type",
  unit: "°",
  hint: "Opposite angles add to 180°. They are not equal.",
  tag: "opposite_angles_equal",
  rounds: [
    { say: "One angle of the inscribed quadrilateral is 80°. Key in the opposite angle.", fig: { type: "circle", v: [], quad: [35, 130, 215, 310], mark: ["80°", null, "?", null] }, ans: 100, trap: 80, why: "Opposite angles are supplementary: they add to 180°.", win: "180 − 80 = 100°." },
    { say: "One angle is 110°. Key in the opposite angle.", fig: { type: "circle", v: [], quad: [35, 130, 215, 310], mark: [null, "110°", null, "?"] }, ans: 70, trap: 110, why: "Subtract from 180°.", win: "180 − 110 = 70°." },
    { say: "Find the opposite angle by yourself.", alt: [{ q: "An inscribed quadrilateral has an angle of 95°.", ans: 85, trap: 95 }, { q: "An inscribed quadrilateral has an angle of 120°.", ans: 60, trap: 120 }, { q: "An inscribed quadrilateral has an angle of 72°.", ans: 108, trap: 72 }] },
  ],
}));
