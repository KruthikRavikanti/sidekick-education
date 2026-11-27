// Angle Sum and Base Angles. Skill G-CO.C.10-1.
// Proving theorems about triangles: the angle sum and the base angles of isosceles triangles. Giving examples instead of a proof is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle Sum and Base Angles",
  emoji: "🔺",
  premise: "Every triangle’s angles add to 180°. In an isosceles triangle, the two base angles are equal.",
  outro: "Triangle angles sum to 180°. Base angles of an isosceles triangle are congruent.",
  scene: "paper",
  kind: "type",
  unit: "°",
  hint: "Take the known angle from 180°. In an isosceles triangle, split what is left equally.",
  tag: "examples_not_proof",
  rounds: [
    { say: "Prove the angle sum: draw a line through the top corner, parallel to the base. Give each reason.", kind: "fill", fs: 4.8, cast: "", rows: [["the three angles along that line", "make a straight angle"], ["two of them equal the base angles because", "alternate interior angles are equal"], ["so the three angles of the triangle total", "180°"]], extra: "I measured a few triangles|", trap: [1, "I measured a few triangles"], why: "Measuring examples is not a proof. The parallel line gives a reason that always holds.", win: "A reason that works for every triangle." },
    { say: "An isosceles triangle has a top angle of 40°. Key in each base angle.", fig: { type: "poly", pts: [[20, 88], [80, 88], [50, 16]], angles: ["?", "?", "40°"], v: [] }, ans: 70, trap: 140, why: "140° is what the two base angles share. They are equal, so halve it.", win: "(180 − 40) ÷ 2 = 70°." },
    { say: "Find the angle by yourself.", alt: [{ q: "An isosceles triangle has base angles of 50° each. Find the top angle.", ans: 80, trap: 130 }, { q: "An isosceles triangle has a top angle of 100°. Find each base angle.", ans: 40, trap: 80 }, { q: "A triangle has angles of 35° and 85°. Find the third.", ans: 60, trap: 240 }] },
  ],
}));
