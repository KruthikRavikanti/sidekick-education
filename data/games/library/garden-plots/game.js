// Garden Plots. Skill 3.MD.C.7-2.
// Multiplying side lengths to find area in context. Adding the sides to get the distance around is the known slip.
Sidekick.game(Sidekick.play({
  title: "Garden Plots",
  emoji: "🌻",
  premise: "Each garden is a rectangle. Multiply its length by its width to find how much ground it covers.",
  outro: "The area of a rectangle is its length times its width.",
  scene: "meadow",
  kind: "type",
  icon: "🌻",
  hint: "Area is the space inside: length times width.",
  tag: "finds_the_distance_around",
  rounds: [
    { say: "Key in the area in square meters.", fig: { type: "rect", d: [8, 5], l: ["8 m", "5 m"] }, ans: 40, trap: 26, why: "That is the distance around. The space inside is 8 × 5.", win: "8 × 5 = 40 square meters." },
    { say: "Key in the area in square feet.", fig: { type: "rect", d: [9, 4], l: ["9 ft", "4 ft"] }, ans: 36, trap: 26, why: "That is the distance around. The space inside is 9 × 4.", win: "9 × 4 = 36 square feet." },
    { say: "Find the area by yourself.", alt: [{ fig: { type: "rect", d: [7, 6], l: ["7 m", "6 m"] }, ans: 42, trap: 26 }, { fig: { type: "rect", d: [10, 3], l: ["10 ft", "3 ft"] }, ans: 30, trap: 26 }] },
  ],
}));
