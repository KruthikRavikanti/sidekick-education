// Unfold and Add. Skill 6.G.A.4-2.
// Using nets to find the surface area of prisms. Finding the volume instead, or missing faces, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Unfold and Add",
  emoji: "🎁",
  premise: "Surface area is the wrapping paper. Unfold the box into its six faces and add up their areas.",
  outro: "Surface area = the sum of the areas of all the faces. A box has three pairs of matching faces.",
  scene: "candy",
  kind: "type",
  hint: "There are 6 faces in 3 matching pairs. Find each pair and add.",
  tag: "finds_volume_instead",
  rounds: [
    { say: "A box is 4 by 3 by 2. Match each pair of faces to its total area.", kind: "fill", fs: 6, cast: "", rows: [["upper and lower faces, 4 by 3 each", "24"], ["front and back, 4 by 2 each", "16"], ["two ends, 3 by 2 each", "12"]], extra: "6 8", trap: [2, "6"], why: "One end is 6, and there are two ends.", win: "24, 16 and 12." },
    { say: "Now key in the whole surface area of the box.", q: "Face pairs: 24, 16 and 12", fig: { type: "cubes", d: [4, 3, 2], solid: true, l: ["4", "3", "2"], v: [] }, ans: 52, trap: 24, why: "That is the volume, 4 × 3 × 2. Surface area adds the faces.", win: "24 + 16 + 12 = 52 square units." },
    { say: "A cube has edges of 3. Key in its surface area.", fig: { type: "cubes", d: [3, 3, 3], solid: true, l: ["3", "3", "3"], v: [] }, ans: 54, trap: 27, why: "That is the volume. Each face is 9, and there are 6 faces.", win: "6 × 9 = 54 square units." },
    { say: "Find the surface area by yourself.", alt: [{ q: "A box is 5 by 2 by 1 units.", ans: 34, trap: 10 }, { q: "A box is 2 by 2 by 3 units.", ans: 32, trap: 12 }, { q: "A cube has edges of 2 units.", ans: 24, trap: 8 }] },
  ],
}));
