// Triangle Angle Sum. Skill 8.G.A.5-1.
// Using informal arguments to establish the angle sum of triangles. Thinking larger triangles have larger angle sums is the known slip.
Sidekick.game(Sidekick.play({
  title: "Triangle Angle Sum",
  emoji: "🔺",
  premise: "Tear off the three corners of any triangle and they line up into a straight angle. The total is always 180°.",
  outro: "The angles of every triangle add to 180°, whatever its size.",
  scene: "paper",
  kind: "type",
  unit: "°",
  hint: "Add the two angles you know. Subtract from 180.",
  tag: "bigger_triangle_bigger_sum",
  rounds: [
    { say: "Key in the third angle.", fig: { type: "poly", pts: [[10, 88], [92, 88], [38, 20]], angles: ["50°", "60°", "?"], v: [] }, ans: 70, trap: 250, why: "A triangle has 180°, not 360°.", win: "180 − 50 − 60 = 70°." },
    { say: "True or not true?", kind: "sort", fs: 4.8, bins: "True|Not true", items: ["A tiny triangle has angles adding to 180°|A huge triangle has angles adding to 180°", "Bigger triangles have bigger angle sums|A triangle can have two 100° angles"], trap: ["Bigger triangles have bigger angle sums", 0], why: "Size changes the sides, not the angles. The sum stays 180°.", win: "Always 180°." },
    { say: "Find the third angle by yourself.", alt: [{ q: "Two angles of a triangle are 90° and 35°.", ans: 55, trap: 235 }, { q: "Two angles of a triangle are 40° and 40°.", ans: 100, trap: 280 }, { q: "Two angles of a triangle are 110° and 25°.", ans: 45, trap: 225 }] },
  ],
}));
