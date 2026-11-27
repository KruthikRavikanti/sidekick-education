// Split the Shape. Skill 6.G.A.1-3.
// Finding the area of parallelograms, trapezoids and polygons by decomposing. Double counting or leaving out pieces is the known slip.
Sidekick.game(Sidekick.play({
  title: "Split the Shape",
  emoji: "✂️",
  premise: "Any polygon can be cut into rectangles and triangles. Find each piece once, then add them all.",
  outro: "Decompose a shape into rectangles and triangles, find each area once, and add.",
  scene: "paper",
  kind: "type",
  hint: "Count the pieces: a rectangle in the middle and a triangle on each side.",
  tag: "leaves_out_pieces",
  rounds: [
    { say: "The trapezoid splits into a rectangle and two triangles. Key in the whole area.", fig: { type: "poly", pts: [[10, 82], [90, 82], [74, 24], [26, 24]], sides: ["10", null, "6", null], dash: [[26, 24, 26, 82, "4"], [74, 24, 74, 82]], v: [] }, ans: 32, trap: 24, trap2: 40, why: "That is only the middle rectangle. Add the two triangles: 4 + 4.", why2: "That treats it as a full 10 by 4 rectangle. The corners are cut off.", win: "24 + 4 + 4 = 32 square units." },
    { say: "A parallelogram is base times height. Key in its area.", fig: { type: "poly", pts: [[8, 82], [68, 82], [92, 24], [32, 24]], sides: ["8", "6", null, null], dash: [[32, 24, 32, 82, "5"]], v: [] }, ans: 40, trap: 48, why: "6 is the slanted side. Use the dashed height, 5.", win: "8 × 5 = 40 square units." },
    { say: "Find the area by yourself.", alt: [{ fig: { type: "poly", pts: [[10, 82], [90, 82], [74, 24], [26, 24]], sides: ["9", null, "5", null], dash: [[26, 24, 26, 82, "4"], [74, 24, 74, 82]], v: [] }, ans: 28, trap: 20 }, { fig: { type: "poly", pts: [[8, 82], [68, 82], [92, 24], [32, 24]], sides: ["7", "8", null, null], dash: [[32, 24, 32, 82, "6"]], v: [] }, ans: 42, trap: 56 }, { fig: { type: "poly", pts: [[10, 82], [90, 82], [74, 24], [26, 24]], sides: ["8", null, "4", null], dash: [[26, 24, 26, 82, "5"], [74, 24, 74, 82]], v: [] }, ans: 30, trap: 20 }] },
  ],
}));
