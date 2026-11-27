// Laws for Any Triangle. Skill G-SRT.D.10-1.
// Proving the Laws of Sines and Cosines and using them to solve problems. Applying them only to right triangles is the known slip.
Sidekick.game(Sidekick.play({
  title: "Laws for Any Triangle",
  emoji: "⚖️",
  premise: "SOH-CAH-TOA needs a right angle. The Law of Sines and the Law of Cosines work in every triangle.",
  outro: "Law of Sines: a ÷ sin A = b ÷ sin B. Law of Cosines: c^2 = a^2 + b^2 − 2ab cos C. Both hold for any triangle.",
  scene: "paper",
  kind: "sort",
  fs: 5,
  hint: "Does the rule mention a hypotenuse? Then it needs a right angle.",
  tag: "only_right_triangles",
  rounds: [
    { say: "Which tools work in any triangle?", bins: "Any triangle|Right triangles only", items: ["Law of Sines|Law of Cosines|Area = {1/2}ab sin C", "Pythagorean theorem|sin = opposite ÷ hypotenuse"], trap: ["Law of Cosines", 1], why: "With a 90° angle its last term vanishes, but it works for every angle.", win: "The two laws are for all triangles." },
    { say: "Which law fits what you know?", kind: "fill", fs: 5.2, cast: "", rows: [["two sides and the angle between them", "Law of Cosines"], ["two angles and one side", "Law of Sines"]], extra: "Pythagorean theorem|", trap: [0, "Pythagorean theorem"], why: "There may be no right angle. The Law of Cosines handles any included angle.", win: "Side-angle-side: cosines. Angle pairs: sines." },
    { say: "Which law would you use first? Sort these by yourself.", bins: "Law of Sines|Law of Cosines", items: ["angles 30° and 45° and one side|two angles and the side between them", "all three sides|sides 5 and 8 with 60° between them"], trap: ["all three sides", 0] },
  ],
}));
