// Midsegment Half. Skill G-CO.C.10-2.
// Proving theorems about triangles: midsegments and medians. Using measurement as proof is the known slip.
Sidekick.game(Sidekick.play({
  title: "Midsegment Half",
  emoji: "➗",
  premise: "A midsegment joins the midpoints of two sides of a triangle. It runs parallel to the third side and is exactly half as long.",
  outro: "A midsegment is parallel to the third side and half its length.",
  scene: "paper",
  kind: "type",
  icon: "📐",
  hint: "The midsegment is half the side it is parallel to.",
  tag: "measurement_as_proof",
  rounds: [
    { say: "A midsegment is parallel to a side of length 10. Key in the midsegment’s length.", fig: { type: "poly", pts: [[10, 88], [90, 88], [40, 16]], sides: ["10", null, null], dash: [[65, 52, 25, 52, "?"]], v: [] }, ans: 5, trap: 20, why: "The midsegment is half the third side, not double.", win: "10 ÷ 2 = 5." },
    { say: "A midsegment is 7 long. Key in the length of the side it is parallel to.", ans: 14, trap: 3.5, why: "The side is twice the midsegment.", win: "7 × 2 = 14." },
    { say: "Solve it by yourself.", alt: [{ q: "The third side is 18. Find the midsegment.", ans: 9, trap: 36 }, { q: "The midsegment is 6. Find the third side.", ans: 12, trap: 3 }, { q: "The three medians meet two thirds of the way along each. A median is 12 long. How far is that point from the corner?", ans: 8, trap: 6 }] },
  ],
}));
