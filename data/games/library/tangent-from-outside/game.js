// Tangent From Outside. Skill G-C.A.4-1.
// Constructing a tangent line from a point outside a circle to the circle. Drawing a line that crosses the circle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Tangent From Outside",
  emoji: "🧷",
  premise: "From a point outside a circle you can draw a line that just grazes it. That tangent meets the radius at a right angle.",
  outro: "A tangent from P touches the circle at T, where angle OTP is 90°. So OT, TP and OP form a right triangle.",
  scene: "paper",
  kind: "type",
  icon: "🧷",
  hint: "Radius and tangent make a right angle at T. OP is the hypotenuse.",
  tag: "line_crosses_circle",
  rounds: [
    { say: "What makes a line a tangent?", kind: "fill", fs: 5.4, cast: "", rows: [["it touches the circle at", "exactly one point"], ["there it meets the radius at", "90°"]], extra: "two points|45°", trap: [0, "two points"], why: "A line through two points cuts across the circle. A tangent only grazes it.", win: "One touch, square to the radius." },
    { say: "Put the construction in order. O is the center and P is the outside point.", kind: "row", fs: 4.6, seq: "Draw segment OP.|Find the midpoint M of OP.|Draw the circle centered at M through O.|Mark T where the two circles cross.|Draw line PT.", trap: "Draw segment OP.|Draw line PT.|Find the midpoint M of OP.|Draw the circle centered at M through O.|Mark T where the two circles cross.", why: "T does not exist until the second circle finds it.", win: "The helper circle makes the right angle at T." },
    { say: "P is 13 from the center and the radius is 5. Key in the length of the tangent from P to T.", q: "right angle at T: 13^2 − 5^2 = 144", ans: 12, trap: 8, why: "8 is 13 − 5. The right triangle gives √(169 − 25).", win: "√144 = 12." },
    { say: "Find the tangent length by yourself.", alt: [{ q: "P is 10 from the center. The radius is 6.", ans: 8, trap: 4 }, { q: "P is 17 from the center. The radius is 8.", ans: 15, trap: 9 }, { q: "P is 5 from the center. The radius is 3.", ans: 4, trap: 2 }] },
  ],
}));
