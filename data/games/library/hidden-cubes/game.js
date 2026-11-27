// Hidden Cubes. Skill 5.MD.C.3-2.
// Volume as the number of unit cubes that fill a solid, counted in layers. Counting only the visible cubes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Hidden Cubes",
  emoji: "🧊",
  premise: "Some cubes are hiding in the middle and at the back of the box. Count them by layers so none are missed.",
  outro: "Volume is every cube that fills the solid, including the ones you cannot see.",
  scene: "snow",
  kind: "type",
  hint: "Count the cubes in one layer. Then count the layers.",
  tag: "counts_only_visible_cubes",
  rounds: [
    { say: "Each layer has 6 cubes and there are 2 layers. Key in how many cubes fill the box.", fig: { type: "cubes", d: [3, 2, 2], v: [] }, ans: 12, trap: 10, why: "Two cubes are hiding at the back of the bottom layer. Count by layers.", win: "2 layers of 6 make 12 cubes." },
    { say: "Each layer has 8 cubes and there are 3 layers. Key in the volume.", fig: { type: "cubes", d: [4, 2, 3], v: [] }, ans: 24, trap: 18, why: "Some cubes are hidden at the back. Count 8 for each of the 3 layers.", win: "3 layers of 8 make 24 cubes." },
    { say: "Key in how many cubes fill the box.", alt: [{ fig: { type: "cubes", d: [3, 3, 2], v: [] }, ans: 18, trap: 14 }, { fig: { type: "cubes", d: [2, 2, 3], v: [] }, ans: 12, trap: 10 }, { fig: { type: "cubes", d: [4, 3, 2], v: [] }, ans: 24, trap: 18 }] },
  ],
}));
