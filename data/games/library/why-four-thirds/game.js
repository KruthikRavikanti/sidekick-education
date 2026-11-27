// Why Four Thirds. Skill G-GMD.A.2-1.
// Giving an informal argument using Cavalieri’s principle for the volume of a sphere. Not relating it to cylinders and cones is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why Four Thirds",
  emoji: "🌐",
  premise: "Slice a half sphere and a cylinder with a cone scooped out. At every height the slices have equal area, so the volumes match.",
  outro: "Half sphere = cylinder − cone = πr^3 − {1/3}πr^3 = {2/3}πr^3. The whole sphere is {4/3}πr^3.",
  scene: "space",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Equal slices at every height mean equal volumes.",
  tag: "no_link_to_cylinder_cone",
  rounds: [
    { say: "Build the argument.", rows: [["a half sphere has the same slices as", "a cylinder minus a cone"], ["cylinder minus cone, with height r", "πr^3 − {1/3}πr^3"], ["so the whole sphere is", "{4/3}πr^3"]], extra: "{1/3}πr^3|", trap: [2, "{1/3}πr^3"], why: "That is the cone alone. Two halves of {2/3}πr^3 make {4/3}πr^3.", win: "Two thirds, doubled." },
    { say: "Two solids have equal slice areas at every height. One has volume 50. Key in the volume of the other.", kind: "type", icon: "🌐", ans: 50, trap: 25, why: "Equal slices all the way up means equal volumes.", win: "Cavalieri: the volumes are equal." },
    { say: "Use radius 3 by yourself. Key in the volume in terms of π.", kind: "type", icon: "🌐", unit: "π", alt: [{ q: "the whole sphere: {4/3} × 27", ans: 36, trap: 9 }, { q: "the half sphere: {2/3} × 27", ans: 18, trap: 36 }, { q: "cylinder (radius 3, height 3) minus the cone: 27 − 9", ans: 18, trap: 27 }] },
  ],
}));
