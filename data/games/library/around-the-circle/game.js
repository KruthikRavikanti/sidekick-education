// Around the Circle. Skill 7.G.B.4-1.
// Knowing the relationship between radius, diameter and circumference. Using the diameter where the radius is needed (or the reverse) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Around the Circle",
  emoji: "⭕",
  premise: "The diameter goes all the way across a circle. The radius is half of it. The distance around is about 3.14 diameters.",
  outro: "d = 2r, and circumference = π × d.",
  scene: "sky",
  kind: "type",
  icon: "⭕",
  hint: "Diameter is all the way across. Radius is center to edge.",
  tag: "diameter_for_radius",
  rounds: [
    { say: "Key in the radius.", fig: { type: "circle", d: "10", v: [] }, q: "The diameter is 10.", ans: "5", trap: "20", why: "The radius is half of the diameter, not double.", win: "10 ÷ 2 = 5." },
    { say: "Key in the circumference. Use 3.14 for π.", fig: { type: "circle", r: "5", v: [] }, q: "The radius is 5.", ans: "31.4", trap: "15.7", why: "That used the radius as the diameter. The diameter is 10.", win: "3.14 × 10 = 31.4." },
    { say: "Solve it by yourself. Use 3.14 for π.", alt: [{ q: "The diameter is 20. Find the circumference.", ans: "62.8", trap: "125.6" }, { q: "The radius is 3. Find the diameter.", ans: "6", trap: "1.5" }, { q: "The radius is 10. Find the circumference.", ans: "62.8", trap: "31.4" }] },
  ],
}));
