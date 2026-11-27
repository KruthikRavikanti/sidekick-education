// How Much Area Grows. Skill N-VM.C.12-1.
// Working with 2 × 2 matrices as transformations and interpreting the determinant as area. Not connecting matrices to geometry is the known slip.
Sidekick.game(Sidekick.play({
  title: "How Much Area Grows",
  emoji: "🟪",
  premise: "A 2 by 2 matrix reshapes the plane. Its determinant tells how many times bigger every area becomes.",
  outro: "A matrix multiplies areas by the absolute value of its determinant.",
  scene: "paper",
  kind: "type",
  hint: "Find ad − bc. That is the area of the stretched unit square.",
  tag: "no_link_to_area",
  rounds: [
    { say: "This matrix stretches the unit square 2 wide and 3 tall. Key in the new area.", fig: { type: "rect", d: [2, 3], grid: true, l: ["2", "3"], v: [], h: 36 }, q: "determinant: 2 × 3 − 0 × 0", ans: 6, trap: 5, why: "Area multiplies: 2 across times 3 up.", win: "The determinant, 6, is the new area." },
    { say: "Key in the area of the unit square after this matrix acts on it.", fig: { type: "mats", items: ["[3,0;0,3]"], v: [] }, ans: 9, trap: 6, why: "Both directions triple: 3 × 3.", win: "Determinant 9: areas become 9 times bigger." },
    { say: "Key in the new area of the unit square by yourself.", alt: [{ fig: { type: "mats", items: ["[4,0;0,2]"], v: [] }, ans: 8, trap: 6 }, { fig: { type: "mats", items: ["[2,1;0,3]"], v: [] }, ans: 6, trap: 5 }, { fig: { type: "mats", items: ["[1,0;0,5]"], v: [] }, ans: 5, trap: 6 }] },
  ],
}));
