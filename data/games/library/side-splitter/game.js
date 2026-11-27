// Side Splitter. Skill G-SRT.B.4-1.
// Proving and using the theorem that a line parallel to one side of a triangle divides the other two proportionally. Setting the proportion up in the reverse order is the known slip.
Sidekick.game(Sidekick.play({
  title: "Side Splitter",
  emoji: "✂️",
  premise: "A line drawn parallel to one side of a triangle cuts the other two sides in the same ratio.",
  outro: "A line parallel to one side divides the other two sides proportionally.",
  scene: "paper",
  kind: "type",
  hint: "Upper part over lower part is the same on both sides.",
  tag: "proportion_reversed",
  rounds: [
    { say: "The dashed line is parallel to the base. One side is cut into 3 and 6. The other is cut into 4 and what?", fig: { type: "poly", pts: [[10, 90], [90, 90], [45, 12]], dash: [[33, 38, 60, 38]], sides: [null, "4 and ?", "3 and 6"], v: [] }, ans: 8, trap: 7, why: "That adds 3. The lower part is double the upper on one side, so double the 4.", win: "3 to 6 doubles, so 4 to 8." },
    { say: "A parallel line cuts one side into 2 and 5, and the other into 6 and what?", ans: 15, trap: 9, why: "From 2 to 6 is × 3. Multiply 5 by 3 as well.", win: "2 to 6 is × 3, so 5 becomes 15." },
    { say: "Find the missing part by yourself.", alt: [{ q: "One side is cut into 4 and 8. The other into 5 and ?", ans: 10, trap: 9 }, { q: "One side is cut into 3 and 9. The other into 2 and ?", ans: 6, trap: 8 }, { q: "One side is cut into 5 and 10. The other into 7 and ?", ans: 14, trap: 12 }] },
  ],
}));
