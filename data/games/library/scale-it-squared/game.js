// Scale It Squared. Skill 7.G.A.1-2.
// Computing actual areas from a scale drawing. Using the scale factor once instead of its square for area is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scale It Squared",
  emoji: "🗺️",
  premise: "On a scale drawing, each side grows by the scale. So the area grows by the scale twice: once for length, once for width.",
  outro: "Convert each side to its real length first, then multiply to get the real area.",
  scene: "paper",
  kind: "type",
  icon: "🗺️",
  hint: "Change BOTH sides to real lengths. Then multiply them.",
  tag: "scale_factor_once",
  rounds: [
    { say: "Key in the real area in square meters.", q: "Scale: 1 cm = 4 m. The room is 2 cm by 3 cm on the plan.", fig: { type: "rect", d: [3, 2], l: ["3 cm", "2 cm"], grid: true, v: [] }, ans: 96, trap: 24, why: "That scaled the area only once. The real sides are 8 m and 12 m.", win: "8 × 12 = 96 square meters." },
    { say: "Key in the real area in square meters.", q: "Scale: 1 cm = 2 m. A garden is 4 cm by 5 cm on the plan.", ans: 80, trap: 40, why: "Scale both sides: 8 m and 10 m.", win: "8 × 10 = 80 square meters." },
    { say: "Find the real area by yourself.", alt: [{ q: "Scale: 1 cm = 3 m. A patio is 2 cm by 2 cm on the plan.", ans: 36, trap: 12 }, { q: "Scale: 1 in = 5 ft. A deck is 2 in by 4 in on the plan.", ans: 200, trap: 40 }, { q: "Scale: 1 cm = 10 m. A field is 1 cm by 3 cm on the plan.", ans: 300, trap: 30 }] },
  ],
}));
