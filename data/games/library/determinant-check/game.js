// Determinant Check. Skill N-VM.C.10-2.
// Knowing that a square matrix has a multiplicative inverse if and only if its determinant is nonzero. Ignoring the determinant is the known slip.
Sidekick.game(Sidekick.play({
  title: "Determinant Check",
  emoji: "🔐",
  premise: "The determinant of a 2 by 2 matrix is one number: ad − bc. If it is zero, the matrix cannot be undone.",
  outro: "det = ad − bc. A square matrix has an inverse exactly when its determinant is not 0.",
  scene: "desk",
  kind: "type",
  icon: "🔐",
  hint: "Multiply down the main diagonal. Subtract the product of the other diagonal.",
  tag: "ignores_determinant",
  rounds: [
    { say: "Key in the determinant.", fig: { type: "mats", items: ["[2,3;1,4]"], v: [] }, q: "2 × 4 − 3 × 1", ans: 5, trap: 11, why: "Subtract the second product: 8 − 3.", win: "8 − 3 = 5. Not zero, so it has an inverse." },
    { say: "Work out each determinant. Which matrices have an inverse?", kind: "sort", figW: 18, bins: "Has an inverse|No inverse", items: ["~mat:2,3;1,4 ~mat:1,0;0,1", "~mat:2,4;1,2 ~mat:3,6;1,2"], trap: ["~mat:2,4;1,2", 0], why: "2 × 2 − 4 × 1 = 0. A zero determinant means no inverse.", win: "Zero determinant: no way back." },
    { say: "Find the determinant by yourself. Use ± if you need it.", alt: [{ fig: { type: "mats", items: ["[3,1;2,4]"], v: [] }, ans: 10, trap: 14 }, { fig: { type: "mats", items: ["[5,2;3,1]"], v: [] }, ans: -1, trap: 11 }, { fig: { type: "mats", items: ["[4,2;2,1]"], v: [] }, ans: 0, trap: 8 }] },
  ],
}));
