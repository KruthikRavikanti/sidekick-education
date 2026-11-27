// Altitude to the Hypotenuse. Skill G-SRT.B.4-2.
// Proving the Pythagorean theorem using triangle similarity. Not finding the similar triangles is the known slip.
Sidekick.game(Sidekick.play({
  title: "Altitude to the Hypotenuse",
  emoji: "🪜",
  premise: "Drop a height onto the hypotenuse of a right triangle and it splits into two smaller triangles, each similar to the whole.",
  outro: "The altitude to the hypotenuse creates three similar triangles: h² equals the product of the two hypotenuse pieces.",
  scene: "paper",
  kind: "type",
  icon: "🪜",
  hint: "The altitude squared equals one piece of the hypotenuse times the other.",
  tag: "cannot_find_similar_triangles",
  rounds: [
    { say: "A right triangle’s altitude splits it into two smaller triangles. Complete each fact.", kind: "fill", fs: 5, cast: "", rows: [["the two small triangles and the big one are", "all similar"], ["because each has a right angle and", "shares an acute angle with the big one"]], extra: "all congruent|", trap: [0, "all congruent"], why: "They are different sizes. They share angles, so they are similar.", win: "Three similar triangles." },
    { say: "The altitude splits the hypotenuse into pieces of 4 and 9. Key in the altitude.", q: "h × h = 4 × 9", ans: 6, trap: 36, why: "36 is h squared. Take the square root.", win: "√36 = 6." },
    { say: "Find the altitude by yourself.", alt: [{ q: "The hypotenuse pieces are 2 and 8.", ans: 4, trap: 16 }, { q: "The hypotenuse pieces are 1 and 9.", ans: 3, trap: 9 }, { q: "The hypotenuse pieces are 3 and 12.", ans: 6, trap: 36 }] },
  ],
}));
