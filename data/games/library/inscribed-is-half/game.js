// Inscribed Is Half. Skill G-C.A.2-1.
// Identifying and describing relationships among inscribed angles, radii and chords. Thinking inscribed and central angles are equal is the known slip.
Sidekick.game(Sidekick.play({
  title: "Inscribed Is Half",
  emoji: "🎯",
  premise: "An angle at the center and an angle on the circle can stand on the same arc. The one on the circle is always half as big.",
  outro: "An inscribed angle is half the central angle on the same arc.",
  scene: "paper",
  kind: "type",
  unit: "°",
  hint: "Center angle is the big one. The angle on the circle is half of it.",
  tag: "inscribed_equals_central",
  rounds: [
    { say: "The central angle is 100°. Key in the inscribed angle on the same arc.", fig: { type: "circle", v: [], central: 100, inscribed: true, mark: ["100°", "?"] }, ans: 50, trap: 100, why: "The angle on the circle is half the angle at the center.", win: "100 ÷ 2 = 50°." },
    { say: "The inscribed angle is 35°. Key in the central angle on the same arc.", fig: { type: "circle", v: [], central: 70, inscribed: true, mark: ["?", "35°"] }, ans: 70, trap: 35, why: "The central angle is double the inscribed one.", win: "35 × 2 = 70°." },
    { say: "Find the angle by yourself.", alt: [{ q: "The central angle is 140°. Find the inscribed angle on the same arc.", ans: 70, trap: 140 }, { q: "The inscribed angle is 40°. Find the central angle.", ans: 80, trap: 20 }, { q: "The arc measures 60°. Find the inscribed angle that cuts it off.", ans: 30, trap: 60 }] },
  ],
}));
