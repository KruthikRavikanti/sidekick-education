// Wrap Every Face. Skill 7.G.B.6-3.
// Solving problems involving the surface area of prisms and cylinders. Missing faces is the known slip.
Sidekick.game(Sidekick.play({
  title: "Wrap Every Face",
  emoji: "🎀",
  premise: "Surface area covers every face, including the ones you cannot see from the front.",
  outro: "Surface area adds ALL the faces: both ends and every side.",
  scene: "candy",
  kind: "type",
  icon: "🎀",
  hint: "Count the faces. Each one has a twin on the opposite side.",
  tag: "misses_faces",
  rounds: [
    { say: "Key in the surface area of the box.", fig: { type: "cubes", d: [5, 4, 3], solid: true, l: ["5", "4", "3"], v: [] }, ans: 94, trap: 47, why: "That is only the three faces you can see. Each has a twin on the far side.", win: "2 × (20 + 15 + 12) = 94 square units." },
    { say: "Key in the surface area of the can.", q: "Each circle end: area 10 · curved side: area 60", ans: 80, trap: 70, why: "A can has two circle ends, the lid and the base.", win: "10 + 10 + 60 = 80 square units." },
    { say: "Find the surface area by yourself.", alt: [{ q: "A box is 2 by 3 by 4 units.", ans: 52, trap: 26 }, { q: "A can: each circle end has area 12, the curved side has area 50.", ans: 74, trap: 62 }, { q: "A prism: two triangle ends of area 6 each, and side faces of 30, 40 and 50.", ans: 132, trap: 126 }] },
  ],
}));
