// Two Box Building. Skill 5.MD.C.5-3.
// Finding the volume of a solid made of two non-overlapping rectangular prisms by adding. Using only one part, or combining the parts incorrectly, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Box Building",
  emoji: "🏬",
  premise: "A building made of two boxes has the volume of both boxes together. Find each one, then add.",
  outro: "Break the solid into boxes, find each volume and add them.",
  scene: "city",
  kind: "type",
  hint: "Work out each box on its own. Then add the two volumes.",
  tag: "combines_parts_incorrectly",
  rounds: [
    { say: "Key in the total volume of the two boxes.", fig: { type: "cubes", parts: [[4, 3, 2], [2, 3, 2]], v: [] }, q: "One box is 4 × 3 × 2. The other is 2 × 3 × 2.", ans: 36, trap: 24, trap2: 288, why: "That is only the first box. Add the second box too.", why2: "The two volumes are added, not multiplied.", win: "24 + 12 = 36 cubic units." },
    { say: "Key in the total volume.", fig: { type: "cubes", parts: [[5, 2, 2], [2, 2, 3]], v: [] }, q: "One box is 5 × 2 × 2. The other is 2 × 2 × 3.", ans: 32, trap: 20, why: "That is only the first box. Add the second box too.", win: "20 + 12 = 32 cubic units." },
    { say: "Key in the total volume by yourself.", alt: [{ fig: { type: "cubes", parts: [[3, 3, 2], [2, 3, 1]], v: [] }, q: "One box is 3 × 3 × 2. The other is 2 × 3 × 1.", ans: 24, trap: 18 }, { fig: { type: "cubes", parts: [[4, 2, 3], [2, 2, 1]], v: [] }, q: "One box is 4 × 2 × 3. The other is 2 × 2 × 1.", ans: 28, trap: 24 }] },
  ],
}));
