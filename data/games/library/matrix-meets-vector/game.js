// Matrix Meets Vector. Skill N-VM.C.11-1.
// Multiplying a vector by a matrix of suitable dimensions. Mismatching rows and entries is the known slip.
Sidekick.game(Sidekick.play({
  title: "Matrix Meets Vector",
  emoji: "🎯",
  premise: "A matrix can act on a vector and turn it into a new vector. Each row of the matrix makes one entry of the answer.",
  outro: "Each entry of the product is one row of the matrix times the vector.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Row 1 times the vector gives the upper entry. Row 2 gives the lower one.",
  tag: "uses_columns",
  rounds: [
    { say: "Finish the product. Set both entries of the new vector.", view: { type: "mats", items: ["[1,2;3,4]", "×", "[1;1]", "=", "[x;y]"] }, dials: [["Upper", 0, 20, 1, 0], ["Lower", 0, 20, 1, 0]], ans: [3, 7], trap: [4, 6], why: "Those are column sums. Use rows: 1 + 2, then 3 + 4.", win: "Row 1 gives 3. Row 2 gives 7." },
    { say: "Finish the product.", view: { type: "mats", items: ["[2,0;1,3]", "×", "[4;1]", "=", "[x;y]"] }, dials: [["Upper", 0, 20, 1, 0], ["Lower", 0, 20, 1, 0]], ans: [8, 7], trap: [8, 3], why: "Row 2 is 1 and 3: 1 × 4 + 3 × 1 = 7.", win: "2 × 4 + 0 = 8 and 4 + 3 = 7." },
    { say: "Finish the product by yourself.", alt: [{ view: { type: "mats", items: ["[1,1;2,0]", "×", "[3;2]", "=", "[x;y]"] }, dials: [["Upper", 0, 20, 1, 0], ["Lower", 0, 20, 1, 0]], ans: [5, 6], trap: [9, 2] }, { view: { type: "mats", items: ["[3,1;0,2]", "×", "[2;5]", "=", "[x;y]"] }, dials: [["Upper", 0, 20, 1, 0], ["Lower", 0, 20, 1, 0]], ans: [11, 10], trap: [6, 15] }, { view: { type: "mats", items: ["[2,2;1,3]", "×", "[1;4]", "=", "[x;y]"] }, dials: [["Upper", 0, 20, 1, 0], ["Lower", 0, 20, 1, 0]], ans: [10, 13], trap: [3, 20] }] },
  ],
}));
