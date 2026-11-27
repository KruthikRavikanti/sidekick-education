// Right Angle in a Semicircle. Skill G-C.A.2-3.
// Knowing that inscribed angles on a diameter are right angles. Not being able to apply it is the known slip.
Sidekick.game(Sidekick.play({
  title: "Right Angle in a Semicircle",
  emoji: "🌗",
  premise: "Pick any point on a circle and join it to the two ends of a diameter. The angle at that point is always a right angle.",
  outro: "An angle inscribed in a semicircle is 90°.",
  scene: "paper",
  kind: "type",
  unit: "°",
  hint: "A diameter is a 180° arc. The inscribed angle is half of that.",
  tag: "cannot_apply_semicircle",
  rounds: [
    { say: "The orange line is a diameter. Key in the marked angle.", fig: { type: "circle", v: [], semi: 60, mark: ["?"] }, ans: 90, trap: 60, why: "The angle stands on a 180° arc, so it is half of 180.", win: "Half of 180° is 90°." },
    { say: "The triangle sits on a diameter. One angle is 35°. Key in the third angle.", fig: { type: "circle", v: [], semi: 60, mark: ["", "35°", "?"] }, ans: 55, trap: 145, why: "The angle on the circle is 90°. So the other two add to 90°.", win: "90 − 35 = 55°." },
    { say: "Solve it by yourself.", alt: [{ q: "A triangle is inscribed in a semicircle. One acute angle is 20°. Find the other.", ans: 70, trap: 160 }, { q: "A triangle is inscribed in a semicircle. One acute angle is 48°. Find the other.", ans: 42, trap: 132 }, { q: "Its two shorter sides are 6 and 8. Find the diameter.", unit: "", ans: 10, trap: 14 }] },
  ],
}));
