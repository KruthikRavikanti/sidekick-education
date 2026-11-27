// Prism Volume: Base First. Skill 7.G.B.6-2.
// Solving problems involving the volume of right prisms. Using a side face as the base is the known slip.
Sidekick.game(Sidekick.play({
  title: "Prism Volume: Base First",
  emoji: "🧀",
  premise: "A prism is its base shape stacked up along its length. Volume is the area of that base times how far it is stacked.",
  outro: "Volume of a prism = area of the base × height. The base is the shape that repeats.",
  scene: "desk",
  kind: "type",
  icon: "🧀",
  hint: "Which face is repeated all the way along? That is the base.",
  tag: "side_face_as_base",
  rounds: [
    { say: "Key in the volume of the triangular prism.", q: "Triangle end: area 12 · side face: area 50 · length: 10", ans: 120, trap: 500, why: "The base is the triangle that repeats along the length, not a side face.", win: "12 × 10 = 120 cubic units." },
    { say: "Key in the volume.", q: "Hexagon base: area 30 · side face: area 20 · height: 6", ans: 180, trap: 120, why: "Use the hexagon base, 30, times the height.", win: "30 × 6 = 180 cubic units." },
    { say: "Find the volume by yourself.", alt: [{ q: "Triangle base: area 15 · side face: area 40 · length: 8", ans: 120, trap: 320 }, { q: "Triangle base: area 9 · side face: area 21 · length: 7", ans: 63, trap: 147 }, { q: "The triangle end has base 6 and height 4. The prism is 5 long.", ans: 60, trap: 120 }] },
  ],
}));
