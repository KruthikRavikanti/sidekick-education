// Tangent Meets Radius. Skill G-C.A.2-2.
// Knowing that the radius of a circle is perpendicular to the tangent where the radius intersects the circle. Assuming any touching line is tangent, or missing the right angle, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tangent Meets Radius",
  emoji: "🛞",
  premise: "A tangent line just touches a circle at one point. At that point it is always perpendicular to the radius.",
  outro: "A tangent is perpendicular to the radius drawn to the point of tangency.",
  scene: "city",
  kind: "type",
  hint: "Radius and tangent make a square corner. That gives a right triangle.",
  tag: "misses_right_angle",
  rounds: [
    { say: "Key in the angle between the radius and the tangent line.", fig: { type: "circle", v: [], tangent: true, mark: ["?"] }, unit: "°", ans: 90, trap: 45, why: "A tangent always meets the radius at a right angle.", win: "90°, every time." },
    { say: "The radius is 3. A tangent segment from the touching point to P is 4 long. Key in the distance from the center to P.", ans: 5, trap: 7, why: "The radius and tangent make a right angle, so use 3² + 4².", win: "√(9 + 16) = 5." },
    { say: "Find the distance from the center to P by yourself.", alt: [{ q: "Radius 5, tangent segment 12", ans: 13, trap: 17 }, { q: "Radius 6, tangent segment 8", ans: 10, trap: 14 }, { q: "Radius 8, tangent segment 15", ans: 17, trap: 23 }] },
  ],
}));
