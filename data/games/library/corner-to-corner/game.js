// Corner to Corner. Skill 8.G.B.7-2.
// Applying the Pythagorean theorem in three dimensions. Not finding the right triangle inside the solid is the known slip.
Sidekick.game(Sidekick.play({
  title: "Corner to Corner",
  emoji: "📦",
  premise: "The longest stick that fits in a box runs corner to opposite corner. Find it with two right triangles: one on the floor, one standing up.",
  outro: "Find the diagonal of the base first. It becomes a leg of a second right triangle with the height.",
  scene: "desk",
  kind: "type",
  hint: "First the floor diagonal. Then use it with the height.",
  tag: "cannot_find_inner_triangle",
  rounds: [
    { say: "A box is 3 by 4 by 12. First key in the diagonal of its 3 by 4 floor.", fig: { type: "cubes", d: [4, 3, 5], solid: true, l: ["4", "3", "12"], v: [] }, ans: 5, trap: 7, why: "Add the squares, not the sides: 9 + 16 = 25.", win: "The floor diagonal is 5." },
    { say: "The floor diagonal 5 and the height 12 make a right triangle. Key in the corner-to-corner diagonal.", fig: { type: "poly", pts: [[18, 86], [86, 86], [18, 24]], sides: ["5", "?", "12"], right: 0, v: [] }, ans: 13, trap: 17, why: "25 + 144 = 169. Take the square root.", win: "√169 = 13." },
    { say: "Find the corner-to-corner diagonal by yourself.", alt: [{ q: "A box is 6 by 8 by 24.", ans: 26, trap: 38 }, { q: "A box is 2 by 2 by 1.", ans: 3, trap: 5 }, { q: "A box is 1 by 4 by 8.", ans: 9, trap: 13 }] },
  ],
}));
