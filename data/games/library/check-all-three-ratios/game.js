// Check All Three Ratios. Skill G-SRT.A.2-1.
// Using the definition of similarity to decide if two figures are similar. Checking only one pair of sides is the known slip.
Sidekick.game(Sidekick.play({
  title: "Check All Three Ratios",
  emoji: "🔺",
  premise: "Two triangles are similar only if every pair of matching sides has the same ratio. Two matching pairs are not enough.",
  outro: "Similar figures: all corresponding sides are proportional by one scale factor.",
  scene: "paper",
  kind: "sort",
  fs: 5.4,
  hint: "Divide each side of the second triangle by its partner. Are all three answers equal?",
  tag: "checks_one_pair",
  rounds: [
    { say: "Are the triangles with these side lengths similar?", bins: "Similar|Not similar", items: ["3, 4, 5 and 6, 8, 10|2, 3, 4 and 6, 9, 12", "3, 4, 5 and 6, 8, 11|2, 3, 4 and 4, 6, 9"], trap: ["3, 4, 5 and 6, 8, 11", 0], why: "Two pairs double, but 5 to 11 does not. All three must match.", win: "One scale factor for every side." },
    { say: "Triangle A has sides 3, 4, 5. Triangle B has sides 6, 8, 10. Key in the scale factor from A to B.", kind: "type", icon: "🔺", ans: 2, trap: 3, why: "3 is the difference between 3 and 6. The scale factor multiplies: 6 ÷ 3.", win: "Every side doubles." },
    { say: "Sort these by yourself.", bins: "Similar|Not similar", items: ["5, 12, 13 and 10, 24, 26|4, 4, 6 and 6, 6, 9", "5, 12, 13 and 10, 24, 25|4, 4, 6 and 8, 8, 10"], trap: ["5, 12, 13 and 10, 24, 25", 0] },
  ],
}));
