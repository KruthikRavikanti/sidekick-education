// Cube Builder. Skill 5.MD.C.4-1.
// Measuring volume by counting unit cubes. Counting the square faces that show instead of the cubes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cube Builder",
  emoji: "🏗️",
  premise: "Build a box out of unit cubes, then count how many it took. Count whole cubes, not the little squares on the outside.",
  outro: "Count cubes, not faces. Length × width gives one layer, then count the layers.",
  scene: "desk",
  kind: "type",
  hint: "Count the cubes in the bottom layer, then multiply by the number of layers.",
  tag: "counts_faces",
  rounds: [
    { say: "Build a box 3 cubes long, 2 cubes wide and 2 cubes high.", kind: "dial", cast: "", dials: [["Long", 1, 5], ["Wide", 1, 4], ["High", 1, 4]], view: { type: "cubes", calc: true }, ans: [3, 2, 2], trap: [3, 2, 1], why: "That is one layer. Make it 2 cubes high.", win: "It took 12 cubes." },
    { say: "Key in how many cubes are in this box.", fig: { type: "cubes", d: [4, 2, 2], v: [] }, ans: 16, trap: 20, why: "That counts the squares you can see. Count cubes: 8 in a layer, 2 layers.", win: "2 layers of 8 make 16 cubes." },
    { say: "Key in how many cubes are in the box.", alt: [{ fig: { type: "cubes", d: [2, 3, 2], v: [] }, ans: 12, trap: 16 }, { fig: { type: "cubes", d: [5, 2, 2], v: [] }, ans: 20, trap: 24 }, { fig: { type: "cubes", d: [3, 2, 3], v: [] }, ans: 18, trap: 21 }] },
  ],
}));
