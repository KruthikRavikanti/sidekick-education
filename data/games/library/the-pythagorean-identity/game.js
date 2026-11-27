// The Pythagorean Identity. Skill F-TF.C.8-1.
// Proving the Pythagorean identity. Reading sin² x as sin(x²), or dropping the squares, is the known slip.
Sidekick.game(Sidekick.play({
  title: "The Pythagorean Identity",
  emoji: "⭕",
  premise: "Every point on the unit circle is 1 away from the center. Apply the Pythagorean theorem to its coordinates.",
  outro: "sin^2 θ + cos^2 θ = 1 for every angle, because (cos θ, sin θ) lies on a circle of radius 1.",
  scene: "night",
  kind: "type",
  icon: "⭕",
  hint: "sin^2 θ means (sin θ) × (sin θ). The two squares add to 1.",
  tag: "drops_the_squares",
  rounds: [
    { say: "Build the identity from the unit circle.", kind: "fill", fs: 5.2, cast: "", rows: [["the x-coordinate is", "cos θ"], ["the y-coordinate is", "sin θ"], ["x^2 + y^2 = 1 becomes", "cos^2 θ + sin^2 θ = 1"]], extra: "cos θ + sin θ = 1|", trap: [2, "cos θ + sin θ = 1"], why: "The Pythagorean theorem squares the legs. Keep the squares.", win: "A right triangle with hypotenuse 1." },
    { say: "sin θ = 0.6. Key in cos^2 θ.", q: "sin^2 θ = 0.36 · cos^2 θ = 1 − 0.36", ans: "0.64", trap: "0.4", why: "1 − 0.6 forgets to square the sine. Subtract 0.36.", win: "1 − 0.36 = 0.64, so cos θ is 0.8 or −0.8." },
    { say: "Use the identity by yourself.", alt: [{ q: "sin θ = 0.8. Find cos^2 θ.", ans: "0.36", trap: "0.2" }, { q: "cos θ = 0.6. Find sin^2 θ.", ans: "0.64", trap: "0.4" }, { q: "sin θ = 0.5. Find cos^2 θ.", ans: "0.75", trap: "0.5" }] },
  ],
}));
