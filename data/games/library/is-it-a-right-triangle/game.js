// Is It a Right Triangle?. Skill 8.G.B.6-2.
// Explaining and using the converse of the Pythagorean theorem. Assuming the relation holds for any triangle is the known slip.
Sidekick.game(Sidekick.play({
  title: "Is It a Right Triangle?",
  emoji: "📐",
  premise: "The theorem works backward too. If the two shorter sides squared add up to the longest side squared, the triangle has a right angle.",
  outro: "If a² + b² = c², the triangle is a right triangle. If not, it is not.",
  scene: "desk",
  kind: "sort",
  fs: 6,
  hint: "Square the two shorter sides and add. Does it equal the longest side squared?",
  tag: "assumes_every_triangle",
  rounds: [
    { say: "Which side lengths make a right triangle?", bins: "Right triangle|Not right", items: ["5, 12, 13|3, 4, 5|6, 8, 10", "4, 5, 6|2, 3, 4"], trap: ["4, 5, 6", 0], why: "16 + 25 is 41, but 6 × 6 is 36. They do not match.", win: "Check the squares every time." },
    { say: "Sort these.", bins: "Right triangle|Not right", items: ["8, 15, 17|9, 12, 15", "5, 5, 5|7, 8, 9"], trap: ["7, 8, 9", 0], why: "49 + 64 is 113, but 9 × 9 is 81.", win: "64 + 225 = 289, and 81 + 144 = 225." },
    { say: "Sort these by yourself.", bins: "Right triangle|Not right", items: ["7, 24, 25|10, 24, 26", "6, 7, 8|3, 5, 7"], trap: ["6, 7, 8", 0] },
  ],
}));
