// The One-Third Solids. Skill G-GMD.A.3-1.
// Using volume formulas for cylinders, pyramids, cones and spheres. Forgetting the one third for pyramids and cones is the known slip.
Sidekick.game(Sidekick.play({
  title: "The One-Third Solids",
  emoji: "🔺",
  premise: "A pyramid fills exactly one third of the prism around it. A cone fills one third of its cylinder.",
  outro: "Pyramid or cone: V = {1/3} × base area × height. Prism or cylinder: V = base area × height.",
  scene: "sand",
  kind: "type",
  icon: "🔺",
  hint: "Pointed solids take one third of base area × height.",
  tag: "forgets_one_third",
  rounds: [
    { say: "Key in the volume of the pyramid.", q: "A square pyramid: base 6 by 6, height 10", ans: 120, trap: 360, why: "360 is the whole prism. The pyramid is one third of it.", win: "36 × 10 ÷ 3 = 120." },
    { say: "Key in the volume of the cone in terms of π.", q: "A cone: radius 3, height 4", unit: "π", ans: 12, trap: 36, why: "36π is the cylinder. The cone is one third of it.", win: "π × 9 × 4 ÷ 3 = 12π." },
    { say: "Find the volume by yourself.", alt: [{ q: "A square pyramid: base 3 by 3, height 8", ans: 24, trap: 72 }, { q: "A pyramid: base area 30, height 5", ans: 50, trap: 150 }, { q: "A cylinder: base area 20, height 6", ans: 120, trap: 40 }] },
  ],
}));
