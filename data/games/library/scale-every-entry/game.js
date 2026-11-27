// Scale Every Entry. Skill N-VM.C.7-1.
// Multiplying matrices by scalars. Multiplying only one row is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scale Every Entry",
  emoji: "🔆",
  premise: "Multiplying a matrix by a number multiplies every single entry, in every row.",
  outro: "A scalar multiplies every entry of the matrix.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Go entry by entry. Each one gets multiplied.",
  tag: "scales_one_row",
  rounds: [
    { say: "Finish the product. Set the two missing entries.", view: { type: "mats", items: ["2", "[1,3;0,-2]", "=", "[2,x;0,y]"] }, dials: [["Upper right", -9, 9, 1, 0], ["Lower right", -9, 9, 1, 0]], ans: [6, -4], trap: [6, -2], why: "The bottom row gets doubled too: 2 × (−2) = −4.", win: "Every entry doubled." },
    { say: "Finish the product. Set the two missing entries.", view: { type: "mats", items: ["3", "[2,-1;4,0]", "=", "[6,x;y,0]"] }, dials: [["Upper right", -9, 9, 1, 0], ["Lower left", 0, 15, 1, 0]], ans: [-3, 12], trap: [-3, 4], why: "Row 2 is multiplied as well: 3 × 4 = 12.", win: "Every entry tripled." },
    { say: "Finish the product by yourself.", alt: [{ view: { type: "mats", items: ["4", "[1,2;-2,3]", "=", "[4,8;x,y]"] }, dials: [["Lower left", -12, 12, 1, 0], ["Lower right", 0, 15, 1, 0]], ans: [-8, 12], trap: [-2, 3] }, { view: { type: "mats", items: ["5", "[2,0;1,-1]", "=", "[10,0;x,y]"] }, dials: [["Lower left", -9, 9, 1, 0], ["Lower right", -9, 9, 1, 0]], ans: [5, -5], trap: [1, -1] }, { view: { type: "mats", items: ["−2", "[3,1;-4,2]", "=", "[−6,−2;x,y]"] }, dials: [["Lower left", -9, 9, 1, 0], ["Lower right", -9, 9, 1, 0]], ans: [8, -4], trap: [-4, 2] }] },
  ],
}));
