// Solve Any Triangle. Skill G-SRT.D.11-1.
// Applying the Law of Sines and the Law of Cosines to find unknown measurements. Leaving out a term, or missing a second possible triangle, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Solve Any Triangle",
  emoji: "🔺",
  premise: "With the two laws you can find missing sides in triangles that have no right angle at all.",
  outro: "Law of Sines for side-angle pairs. Law of Cosines for two sides and the included angle.",
  scene: "paper",
  kind: "type",
  icon: "🔺",
  hint: "For the Law of Cosines: square, square, then subtract 2ab cos C.",
  tag: "drops_cosine_term",
  rounds: [
    { say: "Side a = 10 is opposite a 30° angle. Key in side b, opposite a 90° angle.", q: "b = 10 × sin 90° ÷ sin 30° · sin 90° = 1 · sin 30° = 0.5", ans: 20, trap: 5, why: "Divide by 0.5, which doubles: 10 ÷ 0.5 = 20.", win: "10 × 1 ÷ 0.5 = 20." },
    { say: "Sides 5 and 8 meet at 60°. Key in the third side.", q: "c^2 = 25 + 64 − 2(5)(8)(0.5) · cos 60° = 0.5", fig: { type: "poly", pts: [[10, 86], [90, 86], [34, 22]], sides: ["8", null, "5"], angles: ["60°", null, null], v: [], h: 34 }, ans: 7, trap: 13, why: "13 just adds the sides. Work out 25 + 64 − 40, then take the root.", win: "√49 = 7." },
    { say: "Find the missing side by yourself. cos 60° = 0.5 and sin 30° = 0.5.", alt: [{ q: "Sides 3 and 8 meet at 60°. Find the third side.", ans: 7, trap: 11 }, { q: "Sides 7 and 15 meet at 60°. Find the third side.", ans: 13, trap: 22 }, { q: "Side a = 6 is opposite 30°. Find side b, opposite 90°.", ans: 12, trap: 3 }] },
  ],
}));
